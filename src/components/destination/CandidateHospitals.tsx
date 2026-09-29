"use client";

import React from "react";
import { useCareFlow } from "@/context/CareFlowContext";
import {
  CheckCircle,
  XCircle,
  Bed,
  Activity,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";

export const CandidateHospitalsList: React.FC = () => {
  const { recommendation, travelTimes, enrichedHospitals, activeEmergency } = useCareFlow();

  if (!activeEmergency) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        <p className="text-xs">Candidate evaluation matrix will populate during active triage.</p>
      </div>
    );
  }

  // Get full list of evaluated alternatives or fall back to all enriched hospitals
  const alternatives = recommendation?.alternatives || [];
  const recId = recommendation?.recommendedHospital.id;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <span>Candidate Hospital Evaluation Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict clinical eligibility filters executed prior to penalty scoring.
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {enrichedHospitals.length} Candidates
        </span>
      </div>

      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
        {/* Recommended Hospital First */}
        {recommendation && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/70 shadow-lg relative">
            <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider">
              Selected Destination
            </span>

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">1.</span>
                  <h4 className="font-bold text-white text-sm">
                    {recommendation.recommendedHospital.name}
                  </h4>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-cyan-400" />
                    <strong>{recommendation.recommendedHospital.status.icu_available}</strong> ICU
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <strong>
                      {recommendation.recommendedHospital.status.er_capacity -
                        recommendation.recommendedHospital.status.er_occupancy}
                    </strong>{" "}
                    free ER
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <strong>{recommendation.recommendedHospital.status.predicted_load}%</strong> 30m load
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-emerald-400 font-mono font-bold text-base flex items-center justify-end gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{recommendation.etaMinutes} min</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Score: {recommendation.score}
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-emerald-900/60 flex flex-wrap gap-1">
              {recommendation.recommendedHospital.status.specialists_available.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded text-[10px] bg-emerald-900/50 border border-emerald-700/60 text-emerald-200 capitalize"
                >
                  ✓ {s.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Other Candidates */}
        {alternatives.map((alt, idx) => {
          if (alt.hospital.id === recId) return null;
          const isEligible = alt.eligible;

          return (
            <div
              key={alt.hospital.id}
              className={`p-3 rounded-xl border transition-all ${
                isEligible
                  ? "bg-slate-800/40 border-slate-700/70 hover:border-slate-600"
                  : "bg-red-950/20 border-red-900/40 opacity-75"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-xs">{idx + 2}.</span>
                    <h5 className="font-semibold text-slate-200 text-sm">{alt.hospital.name}</h5>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${
                        isEligible
                          ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                          : "bg-red-950 text-red-300 border-red-800"
                      }`}
                    >
                      {isEligible ? "ELIGIBLE" : "INELIGIBLE"}
                    </span>
                  </div>

                  {/* Operational stats */}
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span>
                      ICU:{" "}
                      <strong className={alt.hospital.status.icu_available > 0 ? "text-slate-200" : "text-red-400"}>
                        {alt.hospital.status.icu_available} beds
                      </strong>
                    </span>
                    <span>
                      ER Occupancy: {alt.hospital.status.er_occupancy}/{alt.hospital.status.er_capacity}
                    </span>
                    <span>Load: {alt.hospital.status.predicted_load}%</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-slate-300 text-sm font-semibold">
                    {alt.etaMinutes} min
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {isEligible ? `Score: ${alt.score}` : "Disqualified"}
                  </div>
                </div>
              </div>

              {/* Status / Disqualification explanation */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
                {isEligible ? (
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{alt.reasons[0] || "All clinical criteria satisfied"}</span>
                  </div>
                ) : (
                  <div className="text-red-300/90 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <span>{alt.reasons[0]}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
