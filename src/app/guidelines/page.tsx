import React from "react";
import { ShieldCheck, Scale, Activity, FileWarning, CheckCircle2 } from "lucide-react";

export default function GuidelinesPage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-950/50 border border-cyan-800 text-cyan-400 mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Safety & Clinical Guidelines
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          ArogyaGrid is built on the principles of Responsible AI, prioritizing patient safety, deterministic routing, and alignment with Indian government healthcare frameworks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* NITI Aayog Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors shadow-lg">
          <Scale className="w-8 h-8 text-emerald-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-3">NITI Aayog Responsible AI (Part 1 & 2)</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Following NITI Aayog's "Operationalizing Principles for Responsible AI" document (August 2021), we mandate Ethics-by-Design. Our architecture adopts a strictly risk-based approach, ensuring Generative AI is decoupled from high-risk medical decision making.
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>No AI Diagnosis:</strong> Saarthi AI strictly parses natural language into structured data; it does not diagnose conditions.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Risk-Based Interventions:</strong> Applying NITI Aayog's mandate that regulatory scrutiny must match the likelihood of harm, high-risk triage is deferred to deterministic engines.</span>
            </li>
          </ul>
        </div>

        {/* MoHFW / DGHS Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors shadow-lg">
          <Activity className="w-8 h-8 text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-3">DGHS Clinical Red Flags</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Triage is performed by a deterministic, rule-based engine modeled on the Directorate General of Health Services (DGHS) emergency protocols, not by an LLM.
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center mt-0.5 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span></span>
              <span><strong>RED (Immediate):</strong> Airway/breathing issues, chest pain, major trauma, altered consciousness.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center mt-0.5 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span></span>
              <span><strong>YELLOW (Urgent):</strong> Fever, severe pain, dehydration requiring prompt evaluation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center mt-0.5 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span></span>
              <span><strong>GREEN (Non-Urgent):</strong> Routine conditions routed to virtual or physical doctor discovery.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-950 border border-red-900/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
        <div className="flex items-center gap-4 mb-4">
          <FileWarning className="w-6 h-6 text-red-400" />
          <h3 className="text-xl font-bold text-white">Prototype & Hackathon Disclaimer</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          ArogyaGrid is currently a technology prototype demonstrating a decentralized, AI-assisted healthcare routing architecture. 
          <strong> It is not a clinically validated medical device. </strong> 
          Before real-world deployment, full clinical validation of the Red-Flag Engine with qualified healthcare professionals and approved MoHFW protocols is a strict roadmap requirement. Users are always provided a manual override to bypass AI screening and directly request emergency services.
        </p>
      </div>
    </div>
  );
}