"use client";

import React from "react";
import { useCareFlow } from "@/context/CareFlowContext";
import { AmbulanceCard } from "@/components/ambulance/AmbulanceCard";
import { CareFlowMap } from "@/components/map/CareFlowMap";
import {
  Truck,
  Navigation,
  MapPin,
  Clock,
  Shield,
  Activity,
  Radio,
} from "lucide-react";

export default function AmbulanceFleetPage() {
  const {
    ambulances,
    assignedAmbulance,
    recommendation,
    activeEmergency,
    activeRoute,
  } = useCareFlow();

  const availableCount = ambulances.filter((a) => a.status === "AVAILABLE").length;
  const inMissionCount = ambulances.length - availableCount;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Ambulance Fleet Operations & Transit Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated ambulance fleet positions with Google Routes API transit calculations and dynamic lifecycle dispatching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Readiness Status</div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              {availableCount} Available / {inMissionCount} Dispatched
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-mono rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800">
            SIMULATED FLEET
          </span>
        </div>
      </div>

      {/* Active Mission Banner (Section 29) */}
      {assignedAmbulance && activeEmergency && recommendation && (
        <div className="p-5 rounded-xl bg-slate-900/90 border border-amber-500/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700 animate-pulse uppercase">
                Active Emergency Dispatch Mission
              </span>
              <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2 font-mono">
                <span>{assignedAmbulance.vehicle_number}</span>
                <span className="text-xs font-normal text-slate-400">
                  ({assignedAmbulance.crew_type})
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Case: <strong className="text-white">{activeEmergency.intake.chiefComplaint}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> Patient Pickup
                </span>
                <span className="font-semibold text-white mt-1 block">MP Nagar Zone-1</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Target Destination
                </span>
                <span className="font-semibold text-emerald-300 mt-1 block truncate max-w-[140px]">
                  {recommendation.recommendedHospital.name}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs col-span-2 md:col-span-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Google Route ETA
                </span>
                <span className="font-bold font-mono text-cyan-300 text-sm mt-0.5 block">
                  {recommendation.etaMinutes} min
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fleet Map & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-[500px]">
          <CareFlowMap />
        </div>

        <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
            <span>Fleet Roster & Operational Readiness</span>
            <span className="text-[11px] font-mono text-slate-400 font-normal">
              ({ambulances.length} vehicles)
            </span>
          </h3>

          {ambulances.map((amb) => (
            <AmbulanceCard
              key={amb.id}
              ambulance={amb}
              destinationHospital={
                assignedAmbulance?.id === amb.id
                  ? recommendation?.recommendedHospital
                  : null
              }
              etaMinutes={
                assignedAmbulance?.id === amb.id
                  ? recommendation?.etaMinutes
                  : undefined
              }
              isAssigned={assignedAmbulance?.id === amb.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
