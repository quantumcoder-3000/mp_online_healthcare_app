"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Star, FileText, Search, Activity, PhoneCall, Building2, Mic, Bot } from "lucide-react";
import { VoiceIntake } from "@/components/voice/VoiceIntake";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0C10] font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Hero Left Content */}
        <div className="flex-1 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-sm font-medium text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            India's #1 Clinical AI Platform
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Your Personal <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Healthcare AI
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            From instant AI prescription parsing to live hospital bed availability and emergency routing. Connect seamlessly with government registries and top specialists.
          </p>
          
          <div className="flex items-center gap-4 pt-4">
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

          <div className="flex items-center gap-6 pt-6 border-t border-white/5 w-fit">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#0B0C10] z-30"></div>
              <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-[#0B0C10] z-20"></div>
              <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-[#0B0C10] z-10"></div>
            </div>
            <div>
              <div className="text-white font-bold text-sm">25+ Live Hospitals</div>
              <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                <span className="text-xs text-slate-400 ml-1">Real-time Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Right Visuals (Voice AI / Main Graphic) */}
        <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
          <div className="absolute -top-6 -left-6 z-20 bg-[#1F2833] border border-white/10 rounded-xl p-3 flex items-center gap-3 shadow-2xl">
             <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
               <Activity className="w-4 h-4 text-emerald-400" />
             </div>
             <div>
               <div className="text-xs text-slate-400">System Status</div>
               <div className="text-sm font-bold text-white flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live Routing Active
               </div>
             </div>
          </div>

          <div className="bg-[#11131A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10">
            <div className="p-8">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <Bot className="w-6 h-6 text-cyan-400" /> Voice Intake Assistant
              </h3>
              <p className="text-slate-400 text-sm mb-8">Speak naturally about your symptoms. ArogyaGrid will automatically transcribe and route your request to the appropriate medical facility.</p>
              <VoiceIntake />
            </div>
          </div>
          
          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 blur-[100px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
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
          <Link href="/prescription" className="group flex flex-col justify-between bg-[#11131A] border border-white/5 p-6 rounded-3xl hover:border-cyan-500/30 transition-all cursor-pointer h-[240px]">
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
          <Link href="/discovery" className="group flex flex-col justify-between bg-[#11131A] border border-white/5 p-6 rounded-3xl hover:border-indigo-500/30 transition-all cursor-pointer h-[240px]">
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
          <Link href="/emergency" className="group flex flex-col justify-between bg-[#11131A] border border-white/5 p-6 rounded-3xl hover:border-rose-500/30 transition-all cursor-pointer h-[240px]">
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
          <Link href="/command-center" className="group flex flex-col justify-between bg-[#11131A] border border-white/5 p-6 rounded-3xl hover:border-emerald-500/30 transition-all cursor-pointer h-[240px]">
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

          {/* Card 5 */}
          <Link href="/voice" className="group flex flex-col justify-between bg-[#11131A] border border-white/5 p-6 rounded-3xl hover:border-amber-500/30 transition-all cursor-pointer h-[240px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mic className="w-6 h-6 text-amber-400" />
                </div>
                <div className="px-2.5 py-1 rounded-full border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-500/5">
                  AI Scribe
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Voice AI Scribe</h3>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-medium text-slate-400 group-hover:text-amber-400 transition-colors">Start Dictation</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-400" />
              </div>
            </div>
          </Link>
          
          {/* Card 6 */}
          <Link href="/hospital" className="group flex flex-col justify-between bg-[#11131A] border border-white/5 p-6 rounded-3xl hover:border-fuchsia-500/30 transition-all cursor-pointer h-[240px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-fuchsia-400" />
                </div>
                <div className="px-2.5 py-1 rounded-full border border-fuchsia-500/20 text-fuchsia-400 text-[10px] font-bold uppercase tracking-wider bg-fuchsia-500/5">
                  Admin Tools
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Facility Manager</h3>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-medium text-slate-400 group-hover:text-fuchsia-400 transition-colors">Manage Resources</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-fuchsia-500/20 transition-colors">
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-fuchsia-400" />
              </div>
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
}
