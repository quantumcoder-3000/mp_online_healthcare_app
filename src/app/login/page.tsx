"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, User, Activity, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"abha" | "aadhar">("abha");
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full flex bg-[#030712] overflow-hidden selection:bg-cyan-500/30">
      
      {/* LEFT PANEL - LOGIN FORM */}
      <div className="w-full lg:w-5/12 flex flex-col justify-between p-8 sm:p-12 md:p-16 relative z-10 bg-[#050B14] shadow-2xl border-r border-slate-800/50">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Image src="/logo.jpg" alt="ArogyaGrid Logo" fill className="object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            ArogyaGrid
          </span>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-sm mx-auto mt-16 mb-auto">
          <div className="mb-10 text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-full mx-auto mb-6 flex items-center justify-center border border-slate-800 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <User className="w-10 h-10 text-cyan-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Secure access to your health records</p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex p-1 bg-slate-900 rounded-lg mb-8 border border-slate-800">
            <button
              onClick={() => setLoginMethod("abha")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginMethod === "abha" 
                  ? "bg-cyan-950 text-cyan-400 shadow-sm border border-cyan-900/50" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ABHA ID
            </button>
            <button
              onClick={() => setLoginMethod("aadhar")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginMethod === "aadhar" 
                  ? "bg-cyan-950 text-cyan-400 shadow-sm border border-cyan-900/50" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              AADHAR ID
            </button>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* ID Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                {loginMethod === "abha" ? "ABHA Number" : "Aadhar Number"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder={loginMethod === "abha" ? "14-digit ABHA ID" : "12-digit Aadhar ID"}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                Password / OTP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password or OTP"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900" />
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <Link href="#" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold rounded-xl py-3.5 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 group mt-4">
              Secure Login
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-10 text-center text-sm text-slate-400">
            Not a member?{" "}
            <Link href="#" className="text-cyan-500 font-semibold hover:text-cyan-400 transition-colors">
              Sign up now
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-1 justify-center mt-auto">
          <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
        </div>
      </div>

      {/* RIGHT PANEL - VISUAL / MASCOT */}
      <div className="hidden lg:flex w-7/12 relative bg-[#0a192f] items-center justify-center overflow-hidden">
        
        {/* Topographical Fluid Mesh Gradient Background */}
        <div className="absolute inset-0 z-0 bg-[#0B1E40] overflow-hidden">
          {/* Base fluid wave layers matching the peach/blue template image */}
          <div className="absolute top-[-10%] left-[-15%] w-[80%] h-[80%] rounded-[100%] bg-gradient-to-br from-[#ffd5a1] to-[#ffb347] blur-[130px] opacity-[0.9] mix-blend-screen transform rotate-12 scale-y-150 animate-pulse" style={{ animationDuration: "10s" }}></div>
          
          <div className="absolute bottom-[-10%] right-[-10%] w-[90%] h-[90%] rounded-full bg-gradient-to-tl from-[#1E3A8A] via-[#22d3ee] to-[#043d52] blur-[140px] opacity-[0.8] transform -rotate-12 scale-x-125"></div>
          
          {/* The dark topographical ridge */}
          <div className="absolute top-[15%] left-[20%] w-[70%] h-[150%] rounded-full bg-[#0a192f] blur-[110px] opacity-[0.95] transform -rotate-45"></div>
          
          <div className="absolute top-[40%] right-[5%] w-[45%] h-[60%] rounded-[100%] bg-gradient-to-b from-[#ffd5a1] to-transparent blur-[110px] opacity-[0.45] transform rotate-[35deg]"></div>
          
          {/* Topographical Grid Overlay */}
          <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        {/* Mascot & Welcome Text */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-20">
          
          {/* Mascot Container */}
          <div className="relative w-72 h-72 mb-10 transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl">
            <Image 
              src="/mascot.png" 
              alt="ArogyaGrid Doctor Mascot" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          
          <h1 className="text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg text-center">
            Welcome.
          </h1>
          <p className="text-cyan-100/70 text-lg max-w-md text-center leading-relaxed">
            Experience the future of healthcare with India's smartest clinical AI ecosystem.
          </p>
        </div>

      </div>

    </div>
  );
}
