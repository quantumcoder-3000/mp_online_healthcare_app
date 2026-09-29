"use client";

import React from "react";
import { Ambulance } from "@/types/ambulance";
import { EnrichedHospital } from "@/types/hospital";
import {
  Navigation,
  Shield,
  Users,
  Gauge,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

interface Props {
  ambulance: Ambulance;
  destinationHospital?: EnrichedHospital | null;
  etaMinutes?: number;
  isAssigned?: boolean;
}

export const AmbulanceCard: React.FC<Props> = ({
  ambulance,
  destinationHospital,
  etaMinutes,
  isAssigned,
}) => {
  const getStatusBadge = (status: Ambulance["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-700";
      case "ASSIGNED":
        return "bg-amber-950/80 text-amber-300 border-amber-700 animate-pulse";
      case "EN_ROUTE_TO_PATIENT":
        return "bg-amber-900 text-amber-200 border-amber-600 animate-pulse";
      case "PATIENT_ONBOARD":
        return "bg-cyan-950 text-cyan-200 border-cyan-600";
      case "EN_ROUTE_TO_HOSPITAL":
        return "bg-purple-950 text-purple-200 border-purple-600";
      case "ARRIVED":
        return "bg-blue-950 text-blue-200 border-blue-600";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div
      className={`rounded-xl p-4 border bg-slate-900/90 shadow-xl transition-all ${
        isAssigned
          ? "border-amber-500 ring-2 ring-amber-500/20 shadow-amber-950/50"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🚑</span>
            <h4 className="font-bold text-white text-base font-mono">
              {ambulance.vehicle_number}
            </h4>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">{ambulance.equipment}</span>
            <span>•</span>
            <span>{ambulance.crew_type}</span>
          </div>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-mono ${getStatusBadge(
            ambulance.status
          )}`}
        >
          {ambulance.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Transit Mission Telemetry */}
      {isAssigned && (
        <div className="mt-3 p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Assigned Emergency:</span>
            </span>
            <span className="font-mono text-amber-300 font-semibold">
              {ambulance.current_case_id || "Stroke Triage"}
            </span>
          </div>

          {destinationHospital && (
            <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-700/60">
              <span className="text-slate-400 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Destination:</span>
              </span>
              <span className="font-semibold text-slate-100 flex items-center gap-1">
                {destinationHospital.name.split(" ")[0]}
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </span>
            </div>
          )}

          {etaMinutes !== undefined && (
            <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-700/60">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Transit ETA:</span>
              </span>
              <span className="font-mono font-bold text-cyan-300">{etaMinutes} min</span>
            </div>
          )}
        </div>
      )}

      {/* Real-time telemetry */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1">
          <Gauge className="w-3 h-3 text-slate-500" />
          <span>Speed: {ambulance.speed_kmh ?? 0} km/h</span>
        </div>
        <div className="flex items-center justify-end gap-1">
          <span>
            {ambulance.latitude.toFixed(4)}, {ambulance.longitude.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
};
