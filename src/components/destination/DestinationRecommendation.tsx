"use client";

import React from "react";
import { useCareFlow } from "@/context/CareFlowContext";
import {
  CheckCircle2,
  XCircle,
  Navigation,
  ShieldCheck,
  TrendingUp,
  Bed,
  Sparkles,
  Info,
  Clock,
} from "lucide-react";

export const DestinationRecommendationCard: React.FC = () => {
  const {
    recommendation,
    activeEmergency,
    notificationMessage,
    isRoutingLoading,
    isLiveRouting,
  } = useCareFlow();

  if (!activeEmergency) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        <Sparkles className="w-10 h-10 text-cyan-400 mx-auto mb-2 opacity-60 animate-pulse" />
        <h3 className="text-slate-200 font-semibold">No Active Emergency Triage</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Click <span className="text-amber-400 font-medium">&quot;Run Emergency Demo&quot;</span> in the header to simulate a stroke case intake, calculate Google Routes ETA, and generate deterministic hospital recommendations.
        </p>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="bg-red-950/40 border border-red-800 rounded-xl p-5 text-red-200">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-400" />
          <h3 className="font-semibold text-sm">NO ELIGIBLE HOSPITALS FOUND</h3>
        </div>
        <p className="text-xs text-red-300/80 mt-1">
          No hospital in the demonstration network satisfies all mandatory clinical requirements (emergency capable + free ICU + required specialist).
        </p>
      </div>
    );
  }

  const { recommendedHospital, alternatives, etaMinutes, distanceMeters, routingSource, evaluatedAt } =
    recommendation;

  return (
    <div className="bg-slate-900/95 border border-emerald-500/40 rounded-xl p-5 shadow-2xl space-y-4">
      {/* Live Notification Banner */}
      {notificationMessage && (
        <div className="px-3 py-2 rounded-lg bg-amber-950/70 border border-amber-600/70 text-amber-200 text-xs flex items-center gap-2 animate-in fade-in">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="font-medium">{notificationMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
              RECOMMENDED DESTINATION
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                isLiveRouting
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-600"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              {routingSource === "GOOGLE_ROUTES_API"
                ? "Google Traffic-Aware ETA"
                : "Fallback ETA (Traffic Model)"}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
            <span>{recommendedHospital.name}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{recommendedHospital.address}</p>
        </div>

        {/* Travel ETA Display */}
        <div className="text-right bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>ETA</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight">
            {isRoutingLoading ? "..." : `${etaMinutes} min`}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {(distanceMeters / 1000).toFixed(1)} km transit
          </div>
        </div>
      </div>

      {/* Transparent Clinical & Operational Justification */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Why this destination was deterministically selected:</span>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              ICU Available:{" "}
              <strong className="text-emerald-300">
                {recommendedHospital.status.icu_available} beds ready
              </strong>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Verified Specialist on duty:{" "}
              <strong className="text-emerald-300 capitalize">
                {activeEmergency.request.requiredSpecialty || "Emergency Team"}
              </strong>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Surge Forecast:{" "}
              <strong className="text-cyan-300">
                {recommendedHospital.status.predicted_load}% over 30 min
              </strong>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Emergency Bay Readiness:{" "}
              <strong className="text-slate-200">
                {recommendedHospital.status.er_capacity -
                  recommendedHospital.status.er_occupancy}{" "}
                free bays
              </strong>
            </span>
          </li>
        </ul>

        <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400 italic">
          &quot;{recommendation.reason}&quot;
        </div>
      </div>

      {/* Runner-up Alternative preview */}
      {alternatives.length > 0 && (
        <div className="pt-1">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span>Primary Backup Alternative:</span>
            <span className="text-[11px] font-mono text-slate-500">
              Evaluated {new Date(evaluatedAt).toLocaleTimeString()}
            </span>
          </div>

          {alternatives
            .filter((a) => a.eligible)
            .slice(0, 1)
            .map((alt) => (
              <div
                key={alt.hospital.id}
                className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{alt.hospital.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {alt.reasons[0] || "Eligible backup"} • {alt.hospital.status.icu_available} ICU beds
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-300 font-mono">{alt.etaMinutes} min</div>
                  <div className="text-[10px] text-slate-500">Score: {alt.score}</div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Transparency Disclaimer (Section 46) */}
      <div className="text-[10px] text-slate-400 bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 font-mono leading-relaxed">
        <strong>DEMO TRANSPARENCY NOTICE:</strong> Combines real Google Maps road network & routing with simulated operational telemetry (ICU/ER/Specialists). Never claimed as live government hospital feeds.
      </div>
    </div>
  );
};
