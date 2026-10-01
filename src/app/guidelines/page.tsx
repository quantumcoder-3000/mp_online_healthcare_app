import React from "react";
import { ShieldCheck, ExternalLink, Activity, Network, Stethoscope, Globe, ChevronRight, Lock, CheckCircle2 } from "lucide-react";

export default function TrustAndGovernancePage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-12 pb-24">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-950/50 border border-cyan-800 text-cyan-400 mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Trust & Governance
        </h1>
        <p className="text-slate-400 text-lg md:text-xl">
          Built with healthcare safety, privacy and responsible AI in mind.
        </p>
      </div>

      {/* Guidelines Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/50 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-900/50">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">NITI Aayog</p>
          <h3 className="text-lg font-bold text-slate-200 mb-3">Responsible AI</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
            Focus: Safety & Reliability, Transparency, Accountability, Equality & Non-discrimination.
          </p>
          <a href="https://www.niti.gov.in/node/326" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-xl text-sm font-medium transition-colors">
            View Official Source <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-blue-950/50 text-blue-400 flex items-center justify-center mb-4 border border-blue-900/50">
            <Activity className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Ministry of Health & Family Welfare</p>
          <h3 className="text-lg font-bold text-slate-200 mb-3">National Digital Health Blueprint</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
            Focus: Patient safety, privacy, security, consent, interoperability and patient-centric digital health.
          </p>
          <a href="https://main.mohfw.gov.in/sites/default/files/Final%20NDHB%20report_0.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-xl text-sm font-medium transition-colors">
            View Official Source <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-amber-950/50 text-amber-400 flex items-center justify-center mb-4 border border-amber-900/50">
            <Network className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Government of India</p>
          <h3 className="text-lg font-bold text-slate-200 mb-3">Ayushman Bharat Digital Mission (ABDM)</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
            Focus: Digital health ecosystem, health-data governance, privacy and secure health-information exchange.
          </p>
          <a href="https://abdm.gov.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-xl text-sm font-medium transition-colors">
            View Official Source <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-indigo-950/50 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-900/50">
            <Stethoscope className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Government of India</p>
          <h3 className="text-lg font-bold text-slate-200 mb-3">Telemedicine Practice Guidelines</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
            Focus: Appropriate use of telemedicine and professional responsibility.
          </p>
          <a href="https://www.mohfw.gov.in/pdf/TelemedicineINdiaGuidelines20Mar2020.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-xl text-sm font-medium transition-colors">
            View Official Source <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Card 5 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-teal-950/50 text-teal-400 flex items-center justify-center mb-4 border border-teal-900/50">
            <Globe className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">World Health Organization (WHO)</p>
          <h3 className="text-lg font-bold text-slate-200 mb-3">Ethics & Governance of AI for Health</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
            Focus: Human oversight, safety, accountability, privacy and responsible AI.
          </p>
          <a href="https://www.who.int/publications/i/item/9789240029200" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-xl text-sm font-medium transition-colors">
            View Official Source <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Implementation Points */}
      <div className="mt-16 bg-slate-900 border border-slate-800 rounded-2xl p-8 lg:p-10 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-cyan-400" />
          How These Principles Shape ArogyaGrid
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <ChevronRight className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block mb-1">Patient Safety</span>
              <span className="text-sm text-slate-400">Safety-screening and risk-flagging layer.</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <ChevronRight className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block mb-1">Human Oversight</span>
              <span className="text-sm text-slate-400">AI assists with extraction and routing; final clinical decisions remain with healthcare professionals.</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <ChevronRight className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block mb-1">Privacy & Consent</span>
              <span className="text-sm text-slate-400">Patient information should be handled through appropriate consent and access controls.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <ChevronRight className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block mb-1">Responsible AI</span>
              <span className="text-sm text-slate-400">Validate accuracy, errors and possible bias before real-world deployment.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <ChevronRight className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block mb-1">Secure Integration</span>
              <span className="text-sm text-slate-400">Live ambulance, hospital, bed/ICU, laboratory and patient data require authorised APIs, permissions and appropriate security controls.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <ChevronRight className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block mb-1">Transparency</span>
              <span className="text-sm text-slate-400">Clearly distinguish AI-generated/extracted information from clinical decisions.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimers & Context */}
      <div className="space-y-6">
        <div className="bg-amber-950/20 border border-amber-900/50 rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-start shadow-xl">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="shrink-0 p-3 bg-amber-900/30 rounded-full text-amber-500 border border-amber-700/50">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-300 text-[15px] leading-relaxed font-medium">
              ArogyaGrid is a prototype designed with reference to applicable healthcare policies and responsible-AI principles. Real-world deployment would require clinical validation, authorised integrations, data permissions and compliance with applicable laws and regulations.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row gap-6 items-start">
          <div className="shrink-0 p-3 bg-slate-900 rounded-full text-cyan-500 border border-slate-700">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-slate-200 font-bold mb-2">Why this matters</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Healthcare AI cannot be treated like an ordinary consumer app. Our goal is to keep the AI useful without allowing it to become an unchecked clinical decision-maker.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}