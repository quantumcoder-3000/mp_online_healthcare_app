"use client";

import React from "react";
import { useCareFlow } from "@/context/CareFlowContext";
import { CareFlowMap } from "@/components/map/CareFlowMap";
import { DestinationRecommendationCard } from "@/components/destination/DestinationRecommendation";
import { CandidateHospitalsList } from "@/components/destination/CandidateHospitals";
import {
  AlertTriangle,
  Truck,
  Building2,
  Bed,
  Clock,
  Activity,
  TrendingUp,
  MapPin,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function CommandCenterPage() {
  const {
    enrichedHospitals,
    ambulances,
    activeEmergency,
    recommendation,
    travelTimes,
  } = useCareFlow();

  // Top Metrics Calculations
  const activeEmergenciesCount = activeEmergency ? 1 : 0;
  const availableAmbulancesCount = ambulances.filter(
    (a) => a.status === "AVAILABLE"
  ).length;
  const connectedHospitalsCount = enrichedHospitals.length;

  // ICU Utilization
  const totalIcuBeds = enrichedHospitals.reduce((acc, h) => acc + h.icu_total, 0);
  const freeIcuBeds = enrichedHospitals.reduce(
    (acc, h) => acc + h.status.icu_available,
    0
  );
  const occupiedIcuBeds = totalIcuBeds - freeIcuBeds;
  const icuUtilizationPercent =
    totalIcuBeds > 0 ? Math.round((occupiedIcuBeds / totalIcuBeds) * 100) : 0;

  // Average ETA across candidate hospitals
  const calculatedEtas = Object.values(travelTimes).map((t) => t.etaMinutes);
  const avgEta =
    calculatedEtas.length > 0
      ? Math.round(
          calculatedEtas.reduce((a, b) => a + b, 0) / calculatedEtas.length
        )
      : 14;

  return (
    <div className="space-y-6">
      {/* Top Operations Metrics Grid (Section 26) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Active Incidents</span>
            <AlertTriangle
              className={`w-4 h-4 ${
                activeEmergenciesCount > 0
                  ? "text-red-400 animate-pulse"
                  : "text-slate-600"
              }`}
            />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {activeEmergenciesCount}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {activeEmergenciesCount > 0 ? "1 Critical Stroke Case" : "All Clear"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Fleet Available</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-300">
            {availableAmbulancesCount}{" "}
            <span className="text-sm font-normal text-slate-500">
              / {ambulances.length}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Bhopal Corridor Grid
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Connected Hospitals</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">
            {connectedHospitalsCount}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Govt Tertiary & Multispecialty
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>ICU Utilization</span>
            <Bed className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-300">
            {icuUtilizationPercent}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {freeIcuBeds} beds available network-wide
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl col-span-2 md:col-span-1">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Average Corridor ETA</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-300">
            ~{avgEta} min
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Google Traffic-Aware
          </div>
        </div>
      </div>

      {/* Main Operational Split: Interactive Map & Live Triage Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main: Large Google Map (Section 26) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="h-[560px]">
            <CareFlowMap />
          </div>

          {/* Quick Scenario Runner Banner */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-500 animate-ping" />
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Deterministic Destination Engine Active
                </h4>
                <p className="text-xs text-slate-400">
                  Combine live Google Maps route matrices with hospital capability matrices to pick optimal destinations.
                </p>
              </div>
            </div>

            <Link
              href="/hospital"
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>Simulate Capacity Change</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Side: Live Incidents & Destination Recommendation (Section 26) */}
        <div className="lg:col-span-5 space-y-4">
          <DestinationRecommendationCard />
          <CandidateHospitalsList />
        </div>
      </div>

      {/* Bottom: Hospital Network Status Table (Section 26) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <span>Hospital Network Telemetry & Readiness</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live operational monitoring grid across all registered emergency receiving facilities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-amber-950/80 text-amber-300 border border-amber-800 font-bold">
              SIMULATED OPERATIONAL DATA
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Hospital Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">ICU Available</th>
                <th className="py-2.5 px-3">ER Occupancy</th>
                <th className="py-2.5 px-3">30m Predicted Load</th>
                <th className="py-2.5 px-3">Specialists on Duty</th>
                <th className="py-2.5 px-3">Travel ETA</th>
                <th className="py-2.5 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {enrichedHospitals.map((hosp) => {
                const isRec = recommendation?.recommendedHospital.id === hosp.id;
                const travel = travelTimes[hosp.id];

                return (
                  <tr
                    key={hosp.id}
                    className={`transition-colors ${
                      isRec
                        ? "bg-emerald-950/20 font-medium"
                        : "hover:bg-slate-800/30"
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {isRec && <span className="text-amber-400 font-bold">★</span>}
                        <span className="font-semibold text-white">{hosp.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono block">
                        {hosp.address.split(",")[0]}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-400">
                        {hosp.hospital_type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span
                        className={
                          hosp.status.icu_available > 0
                            ? "text-cyan-400 font-bold"
                            : "text-red-400 font-bold"
                        }
                      >
                        {hosp.status.icu_available}{" "}
                        <span className="text-slate-500 font-normal">
                          / {hosp.icu_total}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {hosp.status.er_occupancy}{" "}
                      <span className="text-slate-500">/ {hosp.status.er_capacity}</span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span
                        className={
                          hosp.status.predicted_load > 80
                            ? "text-red-400 font-bold"
                            : hosp.status.predicted_load > 60
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }
                      >
                        {hosp.status.predicted_load}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {hosp.status.specialists_available.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 font-mono capitalize"
                          >
                            {s.replace("_", " ")}
                          </span>
                        ))}
                        {hosp.status.specialists_available.length > 3 && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            +{hosp.status.specialists_available.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold">
                      {travel ? (
                        <span className={isRec ? "text-emerald-400" : "text-slate-300"}>
                          {travel.etaMinutes} min
                        </span>
                      ) : (
                        <span className="text-slate-600">--</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        href="/hospital"
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        Manage Bed & Ops →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
