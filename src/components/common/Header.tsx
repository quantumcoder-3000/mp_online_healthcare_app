"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCareFlow } from "@/context/CareFlowContext";
import {
  Activity,
  Play,
  RotateCcw,
  Radio,
  Building2,
  Truck,
  AlertTriangle,
  LayoutDashboard,
  FileText,
  Search,
  Download,
  X,
  Smartphone
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { runEmergencyDemo, resetDemo, activeEmergency, isRoutingLoading } = useCareFlow();
  const [showQR, setShowQR] = useState(false);

  const navLinks = [
    { href: "/discovery", label: "Find a Doctor", icon: Search },
    { href: "/voice", label: "Voice AI Intake", icon: Radio },
    { href: "/prescription", label: "Prescription & Pharmacy", icon: FileText },
    { href: "/command-center", label: "Command Center", icon: LayoutDashboard },
    { href: "/hospital", label: "Hospital Ops", icon: Building2 },
    { href: "/ambulance", label: "Ambulance Fleet", icon: Truck },
    { href: "/emergency", label: "Active Incident", icon: AlertTriangle },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-6">
            <Link href="/command-center" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-cyan-950 ring-1 ring-cyan-400/40">
                <Activity className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white tracking-wider text-base">AROGYAGRID</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                    INTELLIGENCE
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Healthcare Network Routing
                </div>
              </div>
            </Link>

            {/* Desktop Nav links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${isActive ? "bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                    <span>{label}</span>
                    {href === "/emergency" && activeEmergency && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowQR(true)}
              className="hidden sm:flex px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs items-center gap-1.5 shadow-lg border border-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Get App</span>
            </button>

            <button
              onClick={() => runEmergencyDemo()}
              disabled={isRoutingLoading}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/80 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{isRoutingLoading ? "Computing Routing..." : "Run Emergency Demo"}</span>
              <span className="sm:hidden">{isRoutingLoading ? "Computing..." : "Run Demo"}</span>
            </button>

            <button
              onClick={resetDemo}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs transition-colors"
              title="Reset Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scrolling Nav */}
        <nav className="lg:hidden border-t border-slate-800 bg-slate-900/50 overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-2 px-4 min-w-max">
            {/* Get App Mobile Button */}
            <button
              onClick={() => setShowQR(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors bg-cyan-900/30 text-cyan-400 border border-cyan-800/50 mr-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download App</span>
            </button>
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${isActive ? "bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                  <span>{label}</span>
                  {href === "/emergency" && activeEmergency && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-auto" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowQR(false)}></div>
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-600 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Download ArogyaGrid</h3>
            <p className="text-slate-400 text-sm mb-6">Scan this QR code with your phone camera to download and install the official Android App.</p>
            
            <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-6 shadow-inner">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://mp-online-healthcare-app.vercel.app/ArogyaGrid.apk`} 
                alt="Download APK QR Code"
                className="w-48 h-48"
              />
            </div>
            
            <a 
              href="/ArogyaGrid.apk" 
              download
              className="block w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-900/50"
            >
              Download .APK Directly
            </a>
          </div>
        </div>
      )}
    </>
  );
};