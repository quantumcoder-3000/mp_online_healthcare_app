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

