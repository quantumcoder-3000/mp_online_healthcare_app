"use client";

import React from "react";
import { useCareFlow } from "@/context/CareFlowContext";
import { HospitalStatusCard } from "@/components/hospitals/HospitalStatusCard";
import {
  Building2,
  Sliders,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Info,
} from "lucide-react";
import Link from "next/link";

export default function HospitalDashboardPage() {
  const {
    enrichedHospitals,
    recommendation,
    notificationMessage,
    updateHospitalICU,
    toggleSpecialist,
  } = useCareFlow();

  const recommendedId = recommendation?.recommendedHospital.id;

  // Preset demo test actions for quick judge evaluation (Section 28)
  const triggerHospitalBICUExhaustion = () => {
    // Finds Bansal Hospital or current recommended hospital and exhausts ICU to 0
    if (recommendation) {
      updateHospitalICU(
        recommendation.recommendedHospital.id,
        -recommendation.recommendedHospital.status.icu_available
      );
    }
  };

  const restoreHospitalBICU = () => {
    if (recommendation) {
      updateHospitalICU(recommendation.recommendedHospital.id, 5);
    } else {
      // Find Bansal and restore
      updateHospitalICU("hosp-bansal-super", 6);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Hospital Operations & Surge Control Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate dynamic changes in ICU availability, ER bays, and specialist shifts. Recommendations recalculate in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-mono rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800">
            SIMULATED OPERATIONAL DATA
          </span>
        </div>
      </div>

      {/* Live Notification Bar */}
      {notificationMessage && (
        <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-600/70 text-amber-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="font-semibold">{notificationMessage}</span>
          </div>
          <Link
            href="/command-center"
            className="text-[11px] underline font-mono text-amber-300 hover:text-white"
          >
            View on Map →
          </Link>
        </div>
      )}

      {/* Interactive Scenario Control Bar (Section 28) */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">Quick Judge Scenario Toggles:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={triggerHospitalBICUExhaustion}
            className="px-3 py-1.5 rounded-lg bg-red-900/70 hover:bg-red-800 text-red-200 border border-red-700 text-xs font-medium transition-colors"
          >
            Exhaust Recommended Hospital ICU (Set to 0)
          </button>

          <button
            onClick={restoreHospitalBICU}
            className="px-3 py-1.5 rounded-lg bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-medium transition-colors"
          >
            Restore ICU Capacity (+5 Beds)
          </button>
        </div>
      </div>

      {/* Active Recommended Destination Summary */}
      {recommendation ? (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Currently Recommended Destination for Active Emergency:
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {recommendation.recommendedHospital.name}
            </h3>
            <p className="text-xs text-slate-400">{recommendation.reason}</p>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold font-mono text-emerald-400">
              {recommendation.etaMinutes} min ETA
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Score: {recommendation.score}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          No emergency is currently active. Use the header button to run an emergency triage case.
        </div>
      )}

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {enrichedHospitals.map((hospital) => (
          <HospitalStatusCard
            key={hospital.id}
            hospital={hospital}
            isRecommended={hospital.id === recommendedId}
          />
        ))}
      </div>
    </div>
  );
}
