"use client";

import React from 'react';
import Link from 'next/link';
import { Mic, Activity, Map, Search, FileText, PhoneCall, Building2, Stethoscope, FileJson } from 'lucide-react';
import { VoiceIntake } from '@/components/voice/VoiceIntake';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200">
      {/* Top Navbar / Branding - mimicking the image */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-cyan-400" />
          <span className="text-xl font-bold text-white tracking-tight">Saarthi AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="/voice" className="hover:text-white transition-colors">Medical AI Suite</Link>
          <span className="hover:text-white transition-colors cursor-pointer">Chat</span>
          <span className="hover:text-white transition-colors cursor-pointer">About</span>
          <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
        </div>
        <div>
          <Link href="/emergency" className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-red-900/30 transition-colors">
            Emergency Triage
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center pt-16 pb-12 px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
          AI-Powered Healthcare <br className="hidden md:block"/>
          Solutions for Modern <br className="hidden md:block"/>
          Medical Practices
        </h1>
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          Transform medical workflows with intelligent AI tools designed to reduce administrative burdens. Focus more on patient care while we handle the rest.
        </p>
        <div className="flex items-center justify-center gap-4 mb-8">
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-slate-200 transition-colors">
            Request Demo
          </button>
          <span className="text-sm font-medium text-slate-400 hover:text-white cursor-pointer transition-colors px-4">
            Watch Video
          </span>
        </div>
      </section>

      {/* Embedded Voice Intake for immediate emergency access */}
      <section className="max-w-5xl mx-auto px-4 mb-20 relative z-10">
        <div className="bg-[#121212] rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8 bg-gradient-to-b from-[#1a1a1a] to-[#121212]">
            <VoiceIntake />
          </div>
        </div>
      </section>

      {/* Features Grid (Toolkit) */}
      <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-800/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">ArogyaGrid Toolkit</h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Streamline your practice with advanced AI tools designed to reduce administrative tasks and enhance patient care. Experience the future of healthcare management today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/discovery" className="bg-[#121212] border border-slate-800/80 p-6 rounded-2xl hover:bg-slate-900 transition-all group">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-900/50 transition-colors">
              <Search className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Doctor Discovery</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fair and unbiased doctor ranking with instant virtual video calls and physical appointments mapped to government registries.
            </p>
          </Link>

          <Link href="/command-center" className="bg-[#121212] border border-slate-800/80 p-6 rounded-2xl hover:bg-slate-900 transition-all group">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-900/50 transition-colors">
              <Activity className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Command Center</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Live hospital network telemetry and readiness monitoring. Optimal routing matrix for active emergencies and active beds.
            </p>
          </Link>

          <Link href="/prescription" className="bg-[#121212] border border-slate-800/80 p-6 rounded-2xl hover:bg-slate-900 transition-all group">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-900/50 transition-colors">
              <FileText className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Prescription AI</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Analyzes physical prescriptions and generates detailed medication reminders and nearby pharmacy availability.
            </p>
          </Link>

          <Link href="/emergency" className="bg-[#121212] border border-slate-800/80 p-6 rounded-2xl hover:bg-slate-900 transition-all group">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-900/50 transition-colors">
              <PhoneCall className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Emergency Routing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dispatches active ambulances, parses live critical symptoms, and determines optimal care paths immediately.
            </p>
          </Link>
          
          <Link href="/hospital" className="bg-[#121212] border border-slate-800/80 p-6 rounded-2xl hover:bg-slate-900 transition-all group">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-900/50 transition-colors">
              <Building2 className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Facility Manager</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tools for facility administrators to manage live capacity, ER occupancy, and active specialist availability.
            </p>
          </Link>

          <Link href="/voice" className="bg-[#121212] border border-slate-800/80 p-6 rounded-2xl hover:bg-slate-900 transition-all group">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-900/50 transition-colors">
              <Mic className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Voice AI Scribe</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Converts audio recordings into comprehensive, ready-to-use medical reports. Perfect for post-consultation documentation.
            </p>
          </Link>
        </div>
      </section>      {/* ArogyaGrid State Network Map Section */}
      <section className="py-20 bg-slate-950 relative overflow-hidden border-y border-slate-900/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950"></div>
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">ArogyaGrid State Network</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium">Real-time intelligent routing across Madhya Pradesh's network of integrated medical facilities.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12">
            
            {/* Left Stat */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 text-white px-8 py-8 rounded-2xl shadow-2xl w-full lg:w-72 text-center transform transition-all hover:-translate-y-1 hover:border-cyan-500/30 group">
              <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">502M+</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Total Patients Served</p>
            </div>
            
            {/* MP Map Custom SVG */}
            <div className="relative w-full max-w-xl aspect-[5/4] flex justify-center items-center">
              {/* Animated connection lines behind the map */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <path d="M150,200 Q250,150 350,220 T450,180" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse" />
                <path d="M200,300 Q300,250 400,320" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
              </svg>

              <svg width="100%" height="100%" viewBox="0 0 600 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_0_15px_rgba(34,211,238,0.15)] z-10">
                {/* Stylized Madhya Pradesh Polygon Base */}
                <path 
                  d="M170,120 L240,60 L290,40 L340,60 L380,50 L420,90 L480,120 L510,180 L490,240 L530,280 L490,320 L440,310 L410,360 L360,400 L320,410 L280,380 L230,390 L180,340 L120,330 L80,280 L60,220 L90,180 L130,160 Z" 
                  fill="#0f172a" 
                  stroke="#1e293b" 
                  strokeWidth="3"
                />
                <path 
                  d="M170,120 L240,60 L290,40 L340,60 L380,50 L420,90 L480,120 L510,180 L490,240 L530,280 L490,320 L440,310 L410,360 L360,400 L320,410 L280,380 L230,390 L180,340 L120,330 L80,280 L60,220 L90,180 L130,160 Z" 
                  fill="url(#mp-gradient)" 
                  opacity="0.5"
                />

                <defs>
                  <linearGradient id="mp-gradient" x1="0" y1="0" x2="600" y2="450" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0891b2" stopOpacity="0.2" />
                    <stop offset="1" stopColor="#020617" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Grid Overlay */}
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.4" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />

                {/* Important Hospital Nodes */}
                
                {/* AIIMS Bhopal (Central) */}
                <g className="group" transform="translate(280, 220)">
                  <circle cx="0" cy="0" r="16" fill="rgba(34, 211, 238, 0.1)" className="animate-ping" />
                  <circle cx="0" cy="0" r="8" fill="#22d3ee" stroke="#083344" strokeWidth="2" />
                  <rect x="-40" y="-35" width="80" height="22" rx="4" fill="#0f172a" stroke="#22d3ee" strokeWidth="1" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  <text x="0" y="-20" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle" className="opacity-0 group-hover:opacity-100 transition-opacity">AIIMS Bhopal</text>
                </g>

                {/* MY Hospital Indore (West) */}
                <g className="group" transform="translate(160, 280)">
                  <circle cx="0" cy="0" r="12" fill="rgba(34, 211, 238, 0.1)" className="animate-ping" style={{ animationDelay: "0.5s" }} />
                  <circle cx="0" cy="0" r="6" fill="#38bdf8" />
                  <text x="0" y="-15" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">Indore</text>
                </g>

                {/* GMC Gwalior (North) */}
                <g className="group" transform="translate(260, 90)">
                  <circle cx="0" cy="0" r="10" fill="rgba(34, 211, 238, 0.1)" className="animate-ping" style={{ animationDelay: "1s" }} />
                  <circle cx="0" cy="0" r="5" fill="#38bdf8" />
                  <text x="0" y="-15" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">Gwalior</text>
                </g>

                {/* NSCB Medical College Jabalpur (East-Central) */}
                <g className="group" transform="translate(400, 250)">
                  <circle cx="0" cy="0" r="14" fill="rgba(34, 211, 238, 0.1)" className="animate-ping" style={{ animationDelay: "1.5s" }} />
                  <circle cx="0" cy="0" r="7" fill="#38bdf8" />
                  <text x="0" y="-15" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">Jabalpur</text>
                </g>

                {/* BMC Sagar (Central-East) */}
                <g className="group" transform="translate(350, 180)">
                  <circle cx="0" cy="0" r="10" fill="rgba(34, 211, 238, 0.1)" className="animate-ping" style={{ animationDelay: "0.8s" }} />
                  <circle cx="0" cy="0" r="5" fill="#38bdf8" />
                  <text x="0" y="-15" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">Sagar</text>
                </g>

                {/* SSMC Rewa (East) */}
                <g className="group" transform="translate(480, 160)">
                  <circle cx="0" cy="0" r="10" fill="rgba(34, 211, 238, 0.1)" className="animate-ping" style={{ animationDelay: "1.2s" }} />
                  <circle cx="0" cy="0" r="5" fill="#38bdf8" />
                  <text x="0" y="-15" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">Rewa</text>
                </g>

                {/* Connecting paths */}
                <path d="M160,280 L280,220 L260,90" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="4,4" />
                <path d="M280,220 L350,180 L480,160" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="4,4" />
                <path d="M280,220 L400,250" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="4,4" />
                
              </svg>
            </div>
  
            {/* Right Stat */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 text-white px-8 py-8 rounded-2xl shadow-2xl w-full lg:w-72 text-center transform transition-all hover:-translate-y-1 hover:border-cyan-500/30 group">
              <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">196K</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Served Today</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Partners / Government Links */}
      <section className="py-16 bg-[#0a0a0a] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-10">OUR LOYAL PARTNERS & REGISTRIES</h4>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
            <div className="bg-[#121212] border border-slate-800 px-8 py-4 rounded-xl flex items-center justify-center min-w-[160px] grayscale hover:grayscale-0 transition-all">
              <span className="font-bold text-xl text-slate-300 tracking-tight">ABDM</span>
            </div>
            <div className="bg-[#121212] border border-slate-800 px-8 py-4 rounded-xl flex items-center justify-center min-w-[160px] grayscale hover:grayscale-0 transition-all">
              <span className="font-bold text-xl text-slate-300 tracking-tight flex items-center gap-2">
                <Stethoscope className="w-5 h-5" /> eSanjeevani
              </span>
            </div>
            <div className="bg-[#121212] border border-slate-800 px-8 py-4 rounded-xl flex items-center justify-center min-w-[160px] grayscale hover:grayscale-0 transition-all">
              <span className="font-bold text-xl text-slate-300 tracking-tight flex items-center gap-2">
                <FileJson className="w-5 h-5" /> HFR Registry
              </span>
            </div>
            <div className="bg-[#121212] border border-slate-800 px-8 py-4 rounded-xl flex items-center justify-center min-w-[160px] grayscale hover:grayscale-0 transition-all">
              <span className="font-bold text-xl text-slate-300 tracking-tight">NMC</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
