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
  Menu,
  X
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { runEmergencyDemo, resetDemo, activeEmergency, isRoutingLoading } = useCareFlow();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Toggle Button */}
          <button 
            className="xl:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

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
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors }
                >
                  <Icon className={w-3.5 h-3.5 } />
                  <span>{label}</span>
                  {href === "/emergency" && activeEmergency && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Buttons: Demo Run & Reset */}
        <div className="flex items-center gap-2.5">
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

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] xl:hidden flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="relative w-64 max-w-[80%] bg-slate-900 h-full border-r border-slate-800 shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-white tracking-wider text-sm">AROGYAGRID</span>
              </div>
              <button 
                className="p-1 text-slate-400 hover:text-white rounded-md bg-slate-800/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={px-3 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors }
                  >
                    <Icon className={w-5 h-5 } />
                    <span>{label}</span>
                    {href === "/emergency" && activeEmergency && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-auto" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};