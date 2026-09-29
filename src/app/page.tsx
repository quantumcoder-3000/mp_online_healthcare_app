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
          <span className="text-xl font-bold text-white tracking-tight">CareFlow AI</span>
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
          <h2 className="text-3xl font-bold text-white tracking-tight">CareFlow Toolkit</h2>
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
      </section>

      {/* Map Statistics Section (India/MP Map placeholder concept like the image) */}
      <section className="py-16 bg-[#e6effc]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="bg-[#0b8005] text-white px-8 py-6 rounded-xl shadow-lg w-full md:w-auto text-center md:text-left mb-8 md:mb-0">
            <p className="text-4xl font-bold mb-1">502,911,634</p>
            <p className="text-sm font-medium">Total Patients Served</p>
          </div>
          
          <div className="flex-1 flex justify-center opacity-70 scale-75 md:scale-100">
            {/* Outline placeholder for the map shown in user image */}
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M200 20 L250 50 L280 150 L260 250 L180 380 L140 280 L100 200 L120 100 Z" stroke="#cbd5e1" strokeWidth="2" fill="#f8fafc" />
              <circle cx="150" cy="150" r="10" fill="none" stroke="#f97316" strokeWidth="2" />
              <circle cx="150" cy="150" r="3" fill="#f97316" />
              <circle cx="230" cy="200" r="20" fill="none" stroke="#f97316" strokeWidth="2" />
              <circle cx="230" cy="200" r="4" fill="#f97316" />
              <circle cx="180" cy="300" r="15" fill="none" stroke="#f97316" strokeWidth="2" />
              <circle cx="180" cy="300" r="3" fill="#f97316" />
            </svg>
          </div>

          <div className="bg-[#0b8005] text-white px-8 py-6 rounded-xl shadow-lg w-full md:w-auto text-center md:text-left mt-8 md:mt-0">
            <p className="text-4xl font-bold mb-1">196,416</p>
            <p className="text-sm font-medium">Patients Served Today</p>
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
