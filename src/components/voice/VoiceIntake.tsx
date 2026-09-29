"use client";

import React from "react";

import { GeminiLiveClient } from "@/lib/gemini/live-client";
import { useCareFlow } from "@/context/CareFlowContext";
import type { VoiceMessage, VoiceSessionState } from "@/types/live";
import type { PatientIntake } from "@/types/patient-intake";

function StatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "live" | "warning" | "success";
}) {
  return <span className={`status-pill ${tone}`}>{label}</span>;
}

function IntakeCard({ intake }: { intake: PatientIntake }) {
  return (
    <section className="panel intake-card">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">AI-generated intake</p>
          <h2>Patient information</h2>
        </div>
        <StatusPill label="Review required" tone="warning" />
      </div>

      <div className="intake-grid">
        <div><span>Name</span><strong>{intake.patient_name || "Not provided"}</strong></div>
        <div><span>Age</span><strong>{intake.age ?? "Not provided"}</strong></div>
        <div><span>Sex</span><strong>{intake.sex}</strong></div>
        <div><span>Onset</span><strong>{intake.onset}</strong></div>
        <div><span>Duration</span><strong>{intake.duration || "Not provided"}</strong></div>
        <div><span>Main complaint</span><strong>{intake.main_complaint || "Not provided"}</strong></div>
      </div>

      <div className="detail-block">
        <span>Symptoms</span>
        {intake.symptoms.length ? (
          <div className="tag-row">
            {intake.symptoms.map((symptom) => (
              <span className="tag" key={symptom}>{symptom}</span>
            ))}
          </div>
        ) : <p className="muted">None reported.</p>}
      </div>

      <div className="detail-block">
        <span>Summary</span>
        <p className="summary-text">{intake.summary}</p>
      </div>

      <div className="safety-note">
        This information is AI-generated from the conversation. Verify it with the patient and a qualified healthcare professional. CareFlow does not make a diagnosis in this module.
      </div>
    </section>
  );
}

function ConversationPanel({ conversation }: { conversation: VoiceMessage[] }) {
  return (
    <section className="panel conversation-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Live conversation</p>
          <h2>Intake transcript</h2>
        </div>
        <StatusPill label={`${conversation.length} turns`} />
      </div>

      <div className="conversation-list">
        {conversation.length === 0 ? (
          <div className="empty-conversation">
            <div className="empty-icon">◌</div>
            <p>Start a conversation to begin patient intake.</p>
            <small>Try English, Hindi, or Hinglish.</small>
          </div>
        ) : (
          conversation.map((message) => (
            <div className={`message ${message.role}`} key={message.id}>
              <div className="message-role">
                {message.role === "user" ? "PATIENT / ASHA" : "CAREFLOW"}
              </div>
              <p>{message.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

const stateLabels: Record<VoiceSessionState, string> = {
  idle: "READY",
  connecting: "CONNECTING",
  listening: "LISTENING",
  speaking: "CAREFLOW SPEAKING",
  error: "ERROR",
  ended: "ENDED",
};

function VoiceControls({
  state,
  onStart,
  onStop,
  onClear,
}: {
  state: VoiceSessionState;
  onStart: () => Promise<void>;
  onStop: () => void;
  onClear: () => void;
}) {
  const active = state === "listening" || state === "speaking";
  const busy = state === "connecting";

  return (
    <div className="voice-control-stack">
      <div className={`voice-orb ${active ? "active" : ""} ${state}`}>
        <div className="orb-core">{active ? "◉" : "◌"}</div>
        <div className="orb-ring ring-a" />
        <div className="orb-ring ring-b" />
        <div className="orb-ring ring-c" />
      </div>

      <div className="voice-state">
        <StatusPill
          label={stateLabels[state]}
          tone={active ? "live" : state === "error" ? "warning" : "neutral"}
        />
        <span>
          {active
            ? state === "speaking"
              ? "CareFlow is responding. You can speak naturally and interrupt."
              : "Speak naturally. CareFlow is listening."
            : busy
              ? "Opening a secure Gemini Live session…"
              : "Your microphone is off."}
        </span>
      </div>

      {active || busy ? (
        <button className="secondary-button danger" type="button" onClick={onStop} disabled={busy}>
          {busy ? "Connecting…" : "End conversation"}
        </button>
      ) : (
        <div className="voice-actions-row">
          <button className="primary-button" type="button" onClick={onStart}>
            {state === "ended" ? "Start new conversation" : "Start conversation"}
          </button>
          {state === "ended" && (
            <button className="secondary-button" type="button" onClick={onClear}>
              Clear transcript
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function VoiceIntake() {
  const { processEmergency } = useCareFlow();
  const [state, setState] = React.useState<VoiceSessionState>("idle");
  const [conversation, setConversation] = React.useState<VoiceMessage[]>([]);
  const [intake, setIntake] = React.useState<PatientIntake | null>(null);
  const [summaryStatus, setSummaryStatus] = React.useState<"idle" | "loading" | "error">("idle");
  const [summaryError, setSummaryError] = React.useState<string | null>(null);
  const [agentError, setAgentError] = React.useState<string | null>(null);
  const clientRef = React.useRef<GeminiLiveClient | null>(null);

  React.useEffect(() => {
    const client = new GeminiLiveClient({
      onStateChange: setState,
      onMessagesChange: setConversation,
      onError: setAgentError,
    });

    clientRef.current = client;

    return () => {
      client.stop();
      clientRef.current = null;
    };
  }, []);

  async function startConversation() {
    setAgentError(null);
    setSummaryError(null);
    try {
      await clientRef.current?.start();
    } catch {
      // User-visible error is published by GeminiLiveClient.
    }
  }

  function stopConversation() {
    clientRef.current?.stop();
    // Smartly auto-generate the summary once we stop the conversation
    if (conversation.length > 0 && summaryStatus === "idle") {
      generateSummary();
    }
  }

  function clearTranscript() {
    clientRef.current?.clearMessages();
    setConversation([]);
    setIntake(null);
    setSummaryError(null);
    setAgentError(null);
    setSummaryStatus("idle");
    setState("idle");
  }

  async function generateSummary() {
    const transcript = conversation
      .map((entry) => `${entry.role === "user" ? "USER" : "CAREFLOW"}: ${entry.content}`)
      .join("\n");

    if (!transcript.trim()) return;

    setSummaryStatus("loading");
    setSummaryError(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        data?: PatientIntake;
        error?: string;
      };

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "Unable to create intake summary.");
      }

      setIntake(payload.data);
      setSummaryStatus("idle");
      // Trigger dynamic integration!
      processEmergency(payload.data);
    } catch (error) {
      setSummaryStatus("error");
      setSummaryError(error instanceof Error ? error.message : "Unable to create intake summary.");
    }
  }

  return (
    <div className="voice-page">
      <div className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">CAREFLOW • GEMINI VOICE INTAKE</p>
          <h1>Turn a spoken story into a clear patient handoff.</h1>
          <p className="hero-subtitle">
            Speak naturally. Gemini handles realtime voice conversation and CareFlow prepares structured intake information for human clinical review.
          </p>
          <div className="hero-badges">
            <span>Gemini Live</span>
            <span>English / Hindi / Hinglish</span>
            <span>AI-assisted</span>
            <span>Human review</span>
          </div>
        </div>

        <div className="voice-card">
          <div className="voice-card-top">
            <div>
              <p className="eyebrow">VOICE SESSION</p>
              <h2>Patient intake</h2>
            </div>
            <div className="secure-mark">● Ephemeral session</div>
          </div>

          <VoiceControls
            state={state}
            onStart={startConversation}
            onStop={stopConversation}
            onClear={clearTranscript}
          />
        </div>
      </div>

      <div className="content-grid">
        <ConversationPanel conversation={conversation} />

        <section className="panel workflow-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Workflow</p>
              <h2>What happens next</h2>
            </div>
          </div>

          <div className="workflow-list">
            <div className="workflow-step active">
              <b>01</b>
              <div><strong>Listen</strong><span>Gemini Live receives microphone audio in realtime.</span></div>
            </div>
            <div className="workflow-step">
              <b>02</b>
              <div><strong>Understand</strong><span>Gemini asks concise follow-ups and organizes the patient&apos;s story.</span></div>
            </div>
            <div className="workflow-step">
              <b>03</b>
              <div><strong>Review</strong><span>The completed conversation can be converted into structured intake JSON.</span></div>
            </div>
            <div className="workflow-step muted-step">
              <b>04</b>
              <div><strong>Later: triage</strong><span>This prototype keeps medical triage separate from generative AI.</span></div>
            </div>
          </div>

          {summaryStatus === "loading" ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#a1a1aa' }}>
            Auto-generating structured intake...
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#71717a', fontSize: '13px' }}>
            The structured intake will generate automatically when you end the conversation.
          </div>
        )}

          {summaryStatus === "error" && <p className="error-text">{summaryError}</p>}
        </section>
      </div>

      {agentError && <div className="error-banner">{agentError}</div>}
      {intake && <IntakeCard intake={intake} />}
    </div>
  );
}
