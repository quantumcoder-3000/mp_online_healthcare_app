"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Star, FileText, Search, Activity, PhoneCall, Building2, Mic, Shield, Lock } from "lucide-react";
import { VoiceIntake } from "@/components/voice/VoiceIntake";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0C10] font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Hero Left Content */}
        <div className="flex-1 space-y-8 z-10 text-center lg:text-left">

          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Your Personal <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Healthcare AI
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed mx-auto lg:mx-0">
            From instant AI prescription parsing to live hospital bed availability and emergency routing. Connect seamlessly with government registries and top specialists.
          </p>
          
          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
            <Link 
              href="/prescription" 
              className="px-6 py-3 rounded-xl bg-[#1F2833] hover:bg-[#283442] text-white font-medium flex items-center gap-2 transition-colors border border-white/5"
            >
              Analyze Prescription <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link 
              href="/discovery" 
              className="px-6 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-medium transition-colors border border-cyan-500/20"
            >
              Find Doctors
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 border-t border-white/5 w-fit mx-auto lg:mx-0">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#0B0C10] z-30"></div>
              <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-[#0B0C10] z-20"></div>
              <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-[#0B0C10] z-10"></div>
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-sm">25+ Live Hospitals</div>
              <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                <span className="text-xs text-slate-400 ml-1">Real-time Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Right Visuals (AI Voice Sphere) */}
        <div className="flex-1 relative w-full flex items-center justify-center h-[400px]">
          {/* Status Badge */}
          <div className="absolute top-0 right-0 lg:right-10 z-30 bg-[#1F2833] border border-white/10 rounded-xl p-3 flex items-center gap-3 shadow-2xl">
             <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
               <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
             </div>
             <div>
               <div className="text-xs text-slate-400">System Status</div>
               <div className="text-sm font-bold text-white flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live Routing Active
               </div>
             </div>
          </div>

          {/* Glowing Sphere */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Massive Ambient Glows */}
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-[100px] animate-[pulse_4s_ease-in-out_infinite]"></div>
            <div className="absolute inset-4 rounded-full bg-indigo-500/20 blur-[80px] animate-[pulse_5s_ease-in-out_infinite]" style={{ animationDelay: "1s" }}></div>
            <div className="absolute inset-10 rounded-full bg-purple-500/30 blur-[60px] animate-[pulse_6s_ease-in-out_infinite]" style={{ animationDelay: "2s" }}></div>
            
            {/* Core 3D Luminescent Sphere */}
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-cyan-300 via-indigo-500 to-purple-800 shadow-[0_0_80px_rgba(99,102,241,0.6),inset_0_0_50px_rgba(255,255,255,0.6),inset_0_-20px_40px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden z-10 border border-white/40 animate-[pulse_4s_ease-in-out_infinite] group hover:scale-105 transition-transform duration-500">
              
              {/* Glass Specular Highlight (Rim Light) */}
              <div className="absolute top-3 left-6 w-24 h-12 bg-white/50 blur-[12px] rounded-[100%] rotate-[-25deg] group-hover:bg-white/70 transition-colors"></div>
              
              {/* Inner Core Texture */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent group-hover:rotate-180 transition-transform duration-1000 ease-in-out"></div>
              
              {/* Floating Glowing Icon */}
              <Mic className="w-16 h-16 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] z-20 group-hover:scale-110 transition-transform duration-500" />
              
              {/* Subtle Pulsing Rings inside */}
              <div className="absolute inset-0 rounded-full border border-white/30 scale-[1.05] animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              <div className="absolute inset-0 rounded-full border border-white/10 scale-[1.15] animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: "1s" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width SarthiAi Section */}
      <section id="sarthiai" className="pb-24 px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-b from-cyan-950/20 to-[#11131A] border border-cyan-500/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.05)] relative transition-all duration-500 hover:scale-[1.01] hover:border-cyan-500/40 hover:shadow-[0_0_80px_rgba(34,211,238,0.15)] group">
          {/* Subtle background glow for the container */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent group-hover:via-cyan-400 transition-all duration-500"></div>
          
          <div className="p-8 lg:p-12">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-lg">SarthiAi</h2>
              <h3 className="text-xl font-semibold text-white mb-3">Speak naturally.</h3>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm">
                AI-assisted emergency risk screening based on predefined clinical red flags and safety-oriented triage logic. SarthiAi automatically transcribes and routes your request.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto bg-[#0B0C10] rounded-2xl border border-white/5 p-2 shadow-inner">
              <VoiceIntake />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Grid Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Explore by Service</h2>
            <p className="text-slate-400">Find specialized medical routing and AI analysis tools tailored to your needs.</p>
          </div>
          <Link href="/services" className="hidden sm:flex px-4 py-2 rounded-full bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors border border-white/5 items-center gap-2">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          
          {/* Card 1 */}
          <Link href="/prescription" className="group flex flex-col justify-between bg-gradient-to-br from-cyan-950/40 to-[#11131A] border border-cyan-500/10 p-6 rounded-3xl shadow-[0_0_30px_rgba(34,211,238,0.05)] hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] transition-all cursor-pointer h-[240px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="px-2.5 py-1 rounded-full border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/5">
                  Local AI
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Prescription AI</h3>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-medium text-slate-400 group-hover:text-cyan-400 transition-colors">Analyze Document</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-400" />
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/discovery" className="group flex flex-col justify-between bg-gradient-to-br from-indigo-950/40 to-[#11131A] border border-indigo-500/10 p-6 rounded-3xl shadow-[0_0_30px_rgba(99,102,241,0.05)] hover:border-indigo-500/40 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] transition-all cursor-pointer h-[240px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="px-2.5 py-1 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/5">
                  Verified
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Doctor Discovery</h3>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-medium text-slate-400 group-hover:text-indigo-400 transition-colors">Book Consult</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/emergency" className="group flex flex-col justify-between bg-gradient-to-br from-rose-950/40 to-[#11131A] border border-rose-500/10 p-6 rounded-3xl shadow-[0_0_30px_rgba(244,63,94,0.05)] hover:border-rose-500/40 hover:shadow-[0_0_40px_rgba(244,63,94,0.2)] transition-all cursor-pointer h-[240px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-6 h-6 text-rose-400" />
                </div>
                <div className="px-2.5 py-1 rounded-full border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/5">
                  Live Dispatch
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Emergency Routing</h3>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-medium text-slate-400 group-hover:text-rose-400 transition-colors">Call Ambulance</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-400" />
              </div>
            </div>
          </Link>

          {/* Card 4 */}
          <Link href="/command-center" className="group flex flex-col justify-between bg-gradient-to-br from-emerald-950/40 to-[#11131A] border border-emerald-500/10 p-6 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.05)] hover:border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] transition-all cursor-pointer h-[240px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="px-2.5 py-1 rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/5">
                  Dashboard
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Command Center</h3>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-medium text-slate-400 group-hover:text-emerald-400 transition-colors">View Capacity</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-400" />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Safety & Guidelines Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Trust, Safety & Guidelines</h2>
          <p className="text-slate-400">ArogyaGrid is built on a foundation of clinical safety and data privacy.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Link href="/guidelines" className="group bg-gradient-to-br from-cyan-950/30 to-[#11131A] border border-cyan-500/10 p-8 rounded-3xl hover:border-cyan-500/40 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Safety Protocols</h3>
            <p className="text-sm text-slate-400">View our emergency routing safety logic and clinical red-flag protocols.</p>
          </Link>
          <Link href="/guidelines" className="group bg-gradient-to-br from-indigo-950/30 to-[#11131A] border border-indigo-500/10 p-8 rounded-3xl hover:border-indigo-500/40 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Clinical Guidelines</h3>
            <p className="text-sm text-slate-400">Understand the triage algorithms and how SarthiAi makes routing decisions.</p>
          </Link>
          <Link href="/guidelines" className="group bg-gradient-to-br from-emerald-950/30 to-[#11131A] border border-emerald-500/10 p-8 rounded-3xl hover:border-emerald-500/40 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Data Privacy</h3>
            <p className="text-sm text-slate-400">Learn how your ephemeral session data is secured and automatically wiped.</p>
          </Link>
        </div>
      </section>

      {/* Live State Map Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Live Grid Map</h2>
            <p className="text-slate-400">Monitoring real-time healthcare infrastructure across Madhya Pradesh.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-400 tracking-wider">LIVE DATA</span>
          </div>
        </div>
        <div className="w-full h-[500px] rounded-3xl overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.1)] relative hover:border-cyan-500/30 transition-colors duration-500 group">
          <div className="absolute inset-0 pointer-events-none rounded-3xl ring-1 ring-inset ring-white/5 z-10"></div>
          <iframe 
            src="https://maps.google.com/maps?q=Madhya%20Pradesh,%20India&t=m&z=6&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(85%) opacity(0.85)' }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="ArogyaGrid Live Map"
            className="group-hover:opacity-100 transition-opacity duration-500"
          />
        </div>
      </section>
      {/* Verified Partners / Government Links */}
      <section className="py-16 bg-[#0a0a0a] border-t border-slate-900 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-900/20 blur-[60px] -z-10 rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center z-10">
          <h4 className="text-xs font-semibold text-cyan-500/80 uppercase tracking-[0.2em] mb-10">References & Guidelines</h4>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            
            <a href="https://abdm.gov.in" target="_blank" rel="noreferrer" className="group bg-gradient-to-br from-[#11131A] to-[#11131A] hover:from-cyan-950/40 border border-white/5 hover:border-cyan-500/30 px-8 py-5 rounded-2xl flex items-center justify-center min-w-[180px] grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] cursor-pointer">
              <span className="font-bold text-xl text-slate-300 tracking-tight group-hover:text-white">ABDM</span>
            </a>
            
            <a href="https://esanjeevani.mohfw.gov.in" target="_blank" rel="noreferrer" className="group bg-gradient-to-br from-[#11131A] to-[#11131A] hover:from-emerald-950/40 border border-white/5 hover:border-emerald-500/30 px-8 py-5 rounded-2xl flex items-center justify-center min-w-[180px] grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] cursor-pointer">
              <span className="font-bold text-xl text-slate-300 tracking-tight flex items-center gap-2 group-hover:text-emerald-400">
                <Activity className="w-5 h-5" /> eSanjeevani
              </span>
            </a>
            
            <a href="https://facility.abdm.gov.in" target="_blank" rel="noreferrer" className="group bg-gradient-to-br from-[#11131A] to-[#11131A] hover:from-indigo-950/40 border border-white/5 hover:border-indigo-500/30 px-8 py-5 rounded-2xl flex items-center justify-center min-w-[180px] grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] cursor-pointer">
              <span className="font-bold text-xl text-slate-300 tracking-tight flex items-center gap-2 group-hover:text-indigo-400">
                <Building2 className="w-5 h-5" /> HFR Registry
              </span>
            </a>
            
            <a href="https://www.nmc.org.in" target="_blank" rel="noreferrer" className="group bg-gradient-to-br from-[#11131A] to-[#11131A] hover:from-amber-950/40 border border-white/5 hover:border-amber-500/30 px-8 py-5 rounded-2xl flex items-center justify-center min-w-[180px] grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] cursor-pointer">
              <span className="font-bold text-xl text-slate-300 tracking-tight flex items-center gap-2 group-hover:text-amber-400">
                <Star className="w-5 h-5" /> NMC
              </span>
            </a>
            
          </div>
        </div>
      </section>

    </div>
  );
}





