import type { VoiceMessage, VoiceSessionState } from "@/types/live";

const INPUT_SAMPLE_RATE = 16_000;
const OUTPUT_SAMPLE_RATE = 24_000;
const PROCESSOR_BUFFER_SIZE = 2_048;

interface GeminiLiveCallbacks {
  onStateChange: (state: VoiceSessionState) => void;
  onMessagesChange: (messages: VoiceMessage[]) => void;
  onError: (message: string) => void;
  systemInstruction?: string;
}

interface GeminiLiveTokenResponse {
  success?: boolean;
  token?: string;
  model?: string;
  error?: string;
}

interface PendingTurn {
  user: string;
  assistant: string;
}

interface GeminiLiveResponse {
  setupComplete?: Record<string, unknown>;
  serverContent?: {
    modelTurn?: {
      parts?: Array<{
        inlineData?: { data?: string; mimeType?: string };
      }>;
    };
    inputTranscription?: { text?: string };
    outputTranscription?: { text?: string };
    turnComplete?: boolean;
    interrupted?: boolean;
  };
}

function pcm16ToBase64(pcm: Int16Array): string {
  const bytes = new Uint8Array(pcm.byteLength);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < pcm.length; i += 1) {
    view.setInt16(i * 2, pcm[i] ?? 0, true);
  }

  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function resampleTo16k(input: Float32Array, inputRate: number): Float32Array {
  if (inputRate === INPUT_SAMPLE_RATE) return input;

  const ratio = inputRate / INPUT_SAMPLE_RATE;
  const outputLength = Math.max(1, Math.round(input.length / ratio));
  const output = new Float32Array(outputLength);

  for (let i = 0; i < outputLength; i += 1) {
    const position = i * ratio;
    const left = Math.floor(position);
    const right = Math.min(left + 1, input.length - 1);
    const weight = position - left;
    const a = input[left] ?? 0;
    const b = input[right] ?? a;
    output[i] = a + (b - a) * weight;
  }

  return output;
}

function floatToPcm16(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, input[i] ?? 0));
    output[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return output;
}

export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private inputContext: AudioContext | null = null;
  private outputContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private silentGain: GainNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private nextPlaybackTime = 0;
  private activeSources = new Set<AudioBufferSourceNode>();
  private messages: VoiceMessage[] = [];
  private pendingTurn: PendingTurn = { user: "", assistant: "" };
  private callbacks: GeminiLiveCallbacks;
  private manualStop = false;

  constructor(callbacks: GeminiLiveCallbacks) {
    this.callbacks = callbacks;
  }

  async start(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.manualStop = false;
    this.callbacks.onStateChange("connecting");

    try {
      const response = await fetch("/api/gemini-live-token", { cache: "no-store" });
      const payload = (await response.json()) as GeminiLiveTokenResponse;
      if (!response.ok || !payload.success || !payload.token || !payload.model) {
        throw new Error(payload.error || "Unable to start Gemini Live.");
      }

      await this.prepareAudio();
      await this.connect(payload.token, payload.model);
    } catch (error) {
      await this.cleanup();
      const message = error instanceof Error ? error.message : "Unable to start voice intake.";
      this.callbacks.onError(message);
      this.callbacks.onStateChange("error");
      throw error;
    }
  }

  stop(): void {
    this.manualStop = true;
    this.ws?.close(1000, "User ended session");
    this.ws = null;
    void this.cleanup();
    this.callbacks.onStateChange("ended");
  }

  clearMessages(): void {
    this.messages = [];
    this.pendingTurn = { user: "", assistant: "" };
    this.callbacks.onMessagesChange([]);
  }

  private async prepareAudio(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("This browser does not support microphone access.");
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const AudioContextCtor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) {
      throw new Error("This browser does not support the Web Audio API.");
    }

    // Request the protocol sample rates, but gracefully fall back if the browser
    // chooses a different hardware rate. The input stream is resampled below.
    try {
      this.inputContext = new AudioContextCtor({ sampleRate: INPUT_SAMPLE_RATE });
    } catch {
      this.inputContext = new AudioContextCtor();
    }

    try {
      this.outputContext = new AudioContextCtor({ sampleRate: OUTPUT_SAMPLE_RATE });
    } catch {
      this.outputContext = new AudioContextCtor();
    }

    await Promise.all([this.inputContext.resume(), this.outputContext.resume()]);

    this.sourceNode = this.inputContext.createMediaStreamSource(this.mediaStream);
    this.processor = this.inputContext.createScriptProcessor(PROCESSOR_BUFFER_SIZE, 1, 1);
    this.silentGain = this.inputContext.createGain();
    this.silentGain.gain.value = 0;

    this.processor.onaudioprocess = (event) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

      const input = event.inputBuffer.getChannelData(0);
      const resampled = resampleTo16k(input, this.inputContext?.sampleRate ?? INPUT_SAMPLE_RATE);
      const pcm = floatToPcm16(resampled);
      if (!pcm.length) return;

      this.ws.send(JSON.stringify({
        realtimeInput: {
          audio: {
            data: pcm16ToBase64(pcm),
            mimeType: "audio/pcm;rate=16000",
          },
        },
      }));
      this.callbacks.onStateChange("listening");
    };

    this.sourceNode.connect(this.processor);
    this.processor.connect(this.silentGain);
    this.silentGain.connect(this.inputContext.destination);
  }

  private connect(token: string, model: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const url =
        "wss://generativelanguage.googleapis.com/ws/" +
        "google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained" +
        `?access_token=${encodeURIComponent(token)}`;

      const ws = new WebSocket(url);
      this.ws = ws;
      let settled = false;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          setup: {
            model: `models/${model}`,
            generationConfig: {
              responseModalities: ["AUDIO"],
            },
          },
        }));
      };

      ws.onmessage = async (event) => {
        try {
          let textData = event.data;
          if (textData instanceof Blob) {
            textData = await textData.text();
          } else if (typeof textData !== "string") {
            textData = String(textData);
          }
          
          const message = JSON.parse(textData) as GeminiLiveResponse;
          if (!settled) {
            if (message.setupComplete !== undefined) {
              settled = true;
              resolve();
            }
          }
          this.handleMessage(message);
        } catch (error) {
          console.error("Gemini Live message parsing error", error);
        }
      };

      ws.onerror = () => {
        const error = new Error("Gemini Live connection failed.");
        this.callbacks.onError(error.message);
        if (!settled) {
          settled = true;
          reject(error);
        }
      };

      ws.onclose = () => {
        this.ws = null;
        void this.cleanup(false);
        if (!this.manualStop) {
          this.callbacks.onStateChange("error");
          this.callbacks.onError("The Gemini Live connection closed unexpectedly. Please reconnect.");
        }
      };

      window.setTimeout(() => {
        if (settled) return;
        if (ws.readyState === WebSocket.OPEN) {
          // If the server omits setupComplete in a compatible response shape,
          // the open connection is still usable, so let the UI proceed.
          settled = true;
          resolve();
        }
      }, 1800);
    });
  }

  private handleMessage(message: GeminiLiveResponse): void {
    const content = message.serverContent;
    if (!content) return;

    if (content.interrupted) {
      this.clearPlayback();
      this.callbacks.onStateChange("listening");
      return;
    }

    if (content.inputTranscription?.text) {
      this.pendingTurn.user += content.inputTranscription.text;
    }

    if (content.outputTranscription?.text) {
      this.pendingTurn.assistant += content.outputTranscription.text;
    }

    if (content.modelTurn?.parts) {
      for (const part of content.modelTurn.parts) {
        if (part.inlineData?.data) {
          this.playPcmChunk(part.inlineData.data);
          this.callbacks.onStateChange("speaking");
        }
      }
    }

    if (content.turnComplete) {
      const userText = this.pendingTurn.user.trim();
      const assistantText = this.pendingTurn.assistant.trim();

      if (userText) {
        this.messages = [
          ...this.messages,
          { id: crypto.randomUUID(), role: "user", content: userText },
        ];
      }
      if (assistantText) {
        this.messages = [
          ...this.messages,
          { id: crypto.randomUUID(), role: "assistant", content: assistantText },
        ];
      }

      this.pendingTurn = { user: "", assistant: "" };
      this.callbacks.onMessagesChange(this.messages);
      this.callbacks.onStateChange("listening");
    }
  }

  private playPcmChunk(base64Audio: string): void {
    if (!this.outputContext) return;

    const bytes = base64ToBytes(base64Audio);
    if (bytes.byteLength < 2) return;

    const frameCount = Math.floor(bytes.byteLength / 2);
    const buffer = this.outputContext.createBuffer(1, frameCount, OUTPUT_SAMPLE_RATE);
    const channel = buffer.getChannelData(0);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    for (let i = 0; i < frameCount; i += 1) {
      channel[i] = view.getInt16(i * 2, true) / 32768;
    }

    const source = this.outputContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.outputContext.destination);
    this.activeSources.add(source);
    source.onended = () => this.activeSources.delete(source);

    const startAt = Math.max(this.nextPlaybackTime, this.outputContext.currentTime);
    source.start(startAt);
    this.nextPlaybackTime = startAt + buffer.duration;
  }

  private clearPlayback(): void {
    for (const source of this.activeSources) {
      try {
        source.stop();
      } catch {
        // Already stopped.
      }
    }
    this.activeSources.clear();
    this.nextPlaybackTime = this.outputContext?.currentTime ?? 0;
  }

  private async cleanup(closeSocket = true): Promise<void> {
    this.clearPlayback();

    if (closeSocket) {
      this.ws?.close();
      this.ws = null;
    }

    this.processor?.disconnect();
    this.sourceNode?.disconnect();
    this.silentGain?.disconnect();
    this.processor = null;
    this.sourceNode = null;
    this.silentGain = null;

    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.mediaStream = null;

    if (this.inputContext) {
      await this.inputContext.close().catch(() => undefined);
      this.inputContext = null;
    }

    if (this.outputContext) {
      await this.outputContext.close().catch(() => undefined);
      this.outputContext = null;
    }
  }
}


