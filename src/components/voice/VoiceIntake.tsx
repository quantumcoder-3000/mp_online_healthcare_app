"use client";

import React from "react";
import { useRouter } from "next/navigation";

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
        This information is AI-generated from the conversation. Verify it with the patient and a qualified healthcare professional. ArogyaGrid does not make a diagnosis in this module.
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
            <div className="empty-icon flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-cyan-900/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse" />
              </div>
            </div>
            <p>Start a conversation to begin patient intake.</p>
            <small>Try English, Hindi, or Hinglish.</small>
          </div>
        ) : (
          conversation.map((message) => (
            <div className={`message ${message.role}`} key={message.id}>
              <div className="message-role">
                {message.role === "user" ? "PATIENT / ASHA" : "SAARTHI"}
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
  speaking: "SAARTHI SPEAKING",
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
        <div className="orb-core flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.8)] animate-pulse" />
        </div>
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
              ? "Saarthi AI is responding. You can speak naturally and interrupt."
              : "Speak naturally. Saarthi AI is listening."
            : busy
              ? "Opening a secure Voice session..."
              : "Your microphone is off."}
        </span>
      </div>

      {active || busy ? (
        <button className="secondary-button danger" type="button" onClick={onStop} disabled={busy}>
          {busy ? "Connecting..." : "End conversation"}
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
  const router = useRouter();
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
      .map((entry) => `${entry.role === "user" ? "USER" : "SAARTHI"}: ${entry.content}`)
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
      if (payload.data.triage_level === "potential_emergency") { processEmergency(payload.data); router.push("/emergency"); } else { router.push("/discovery"); }
    } catch (error) {
      setSummaryStatus("error");
      setSummaryError(error instanceof Error ? error.message : "Unable to create intake summary.");
    }
  }

  return (
    <div className="voice-page-embedded w-full max-w-6xl mx-auto">
      <div className="flex flex-col items-center py-8">
        <div className="text-center mb-8">
          <p className="text-cyan-400 font-bold tracking-widest text-xs mb-2">VOICE INTAKE</p>
          <h2 className="text-3xl font-bold text-white mb-3">Speak naturally.</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Describe your symptoms. The AI handles the real-time conversation and ArogyaGrid prepares a structured patient handoff.
          </p>
        </div>

        <div className="w-full max-w-xl mx-auto bg-[#0f0f0f] border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-lg">Patient Intake Session</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Secure & Ephemeral
            </span>
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
              <div><strong>Listen</strong><span>The AI receives microphone audio in realtime.</span></div>
            </div>
            <div className="workflow-step">
              <b>02</b>
              <div><strong>Understand</strong><span>The AI asks concise follow-ups and organizes the patient&apos;s story.</span></div>
            </div>
            <div className="workflow-step">
              <b>03</b>
              <div><strong>Review</strong><span>The completed conversation can be converted into structured intake JSON.</span></div>
            </div>
            <div className="workflow-step muted-step">
              <b>04</b>
              <div><strong>Safety Screening</strong><span>3-tier risk evaluation prioritizing conservative escalation over diagnosis.</span></div>
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
