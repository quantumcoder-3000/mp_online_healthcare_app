"use client";

import React from "react";
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
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { runEmergencyDemo, resetDemo, activeEmergency, isRoutingLoading } = useCareFlow();

  const navLinks = [
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
          <Link href="/command-center" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-cyan-950 ring-1 ring-cyan-400/40">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white tracking-wider text-base">CAREFLOW</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  INTELLIGENCE
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Healthcare Network Routing & Capacity
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? "bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
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

        {/* Action Buttons: Demo Run & Reset */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => runEmergencyDemo()}
            disabled={isRoutingLoading}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/80 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRoutingLoading ? "Computing Routing..." : "Run Emergency Demo"}</span>
          </button>

          <button
            onClick={resetDemo}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs transition-colors"
            title="Reset Simulation State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
