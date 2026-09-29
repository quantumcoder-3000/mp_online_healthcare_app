"use client";

import React from "react";
import { EnrichedHospital } from "@/types/hospital";
import { useCareFlow } from "@/context/CareFlowContext";
import {
  Bed,
  Activity,
  TrendingUp,
  UserCheck,
  Plus,
  Minus,
  AlertCircle,
} from "lucide-react";

interface Props {
  hospital: EnrichedHospital;
  isRecommended?: boolean;
}

export const HospitalStatusCard: React.FC<Props> = ({ hospital, isRecommended }) => {
  const { updateHospitalICU, updateHospitalER, toggleSpecialist } = useCareFlow();
  const status = hospital.status;

  const coreSpecialties = [
    "neurology",
    "cardiology",
    "trauma",
    "orthopedics",
    "pediatrics",
    "critical_care",
  ];

  return (
    <div
      className={`rounded-xl p-5 border transition-all shadow-xl bg-slate-900/90 ${
        isRecommended
          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-950/50"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">{hospital.name}</h3>
            {isRecommended && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                ACTIVE DESTINATION
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{hospital.address}</p>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          {hospital.hospital_type.replace("_", " ")}
        </span>
      </div>

      {/* Capacity & Load Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {/* ICU Controls */}
        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-cyan-400" />
            <span>ICU Beds Free</span>
          </div>

          <div className="my-2 flex items-center justify-between">
            <span
              className={`text-xl font-bold font-mono ${
                status.icu_available > 0 ? "text-cyan-300" : "text-red-400"
              }`}
            >
              {status.icu_available}{" "}
              <span className="text-xs font-normal text-slate-400">
                / {hospital.icu_total}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-700/50">
            <button
              onClick={() => updateHospitalICU(hospital.id, -1)}
              disabled={status.icu_available <= 0}
              className="flex-1 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white flex items-center justify-center text-xs font-bold transition-colors"
              title="Decrease ICU by 1"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={() => updateHospitalICU(hospital.id, 1)}
              className="flex-1 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center text-xs font-bold transition-colors"
              title="Increase ICU by 1"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ER Occupancy Controls */}
        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>ER Occupancy</span>
          </div>

          <div className="my-2 flex items-center justify-between">
            <span className="text-xl font-bold font-mono text-amber-300">
              {status.er_occupancy}{" "}
              <span className="text-xs font-normal text-slate-400">
                / {status.er_capacity} bays
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-700/50">
            <button
              onClick={() => updateHospitalER(hospital.id, -1)}
              disabled={status.er_occupancy <= 0}
              className="flex-1 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white flex items-center justify-center text-xs font-bold transition-colors"
              title="Decrease ER Occupancy by 1"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={() => updateHospitalER(hospital.id, 1)}
              disabled={status.er_occupancy >= status.er_capacity}
              className="flex-1 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white flex items-center justify-center text-xs font-bold transition-colors"
              title="Increase ER Occupancy by 1"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Current Composite Load */}
        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Current Load</span>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-white">
            {status.current_load}%
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                status.current_load > 80
                  ? "bg-red-500"
                  : status.current_load > 60
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${status.current_load}%` }}
            />
          </div>
        </div>

        {/* 30-min Predicted Surge Load */}
        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-purple-400" />
            <span>30m Predicted</span>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-purple-300">
            {status.predicted_load}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Prototype Estimate</div>
        </div>
      </div>

      {/* Specialist On-Duty Interactive Toggles */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Specialists On Active Duty (Click to toggle):</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {status.specialists_available.length} active
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {coreSpecialties.map((spec) => {
            const isActive = status.specialists_available.some(
              (s) => s.toLowerCase() === spec.toLowerCase()
            );

            return (
              <button
                key={spec}
                onClick={() => toggleSpecialist(hospital.id, spec)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? "bg-emerald-950/80 border-emerald-600 text-emerald-200 hover:bg-emerald-900"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700 line-through"
                }`}
              >
                <span>{isActive ? "●" : "○"}</span>
                <span className="capitalize">{spec.replace("_", " ")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="mt-4 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Source: {status.data_source}</span>
        <span>Updated: {new Date(status.updated_at).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};
