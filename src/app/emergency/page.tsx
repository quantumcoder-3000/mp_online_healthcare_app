"use client";

import React from "react";
import { useCareFlow } from "@/context/CareFlowContext";
import { CareFlowMap } from "@/components/map/CareFlowMap";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Building2,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  Play,
} from "lucide-react";

export default function EmergencyIncidentPage() {
  const {
    activeEmergency,
    assignedAmbulance,
    recommendation,
    runEmergencyDemo,
    activeDispatch,
  } = useCareFlow();

  if (!activeEmergency || !recommendation) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-white">No Active Emergency Mission</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Start the demo scenario to simulate a high-priority emergency triage intake with Google Routes ETA calculation and deterministic hospital recommendation.
        </p>
        <button
          onClick={() => runEmergencyDemo()}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 mx-auto transition-transform hover:scale-105"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Run Emergency Demo</span>
        </button>
      </div>
    );
  }

  const { intake, triage } = activeEmergency;
  const ambulance = assignedAmbulance || {
    vehicle_number: "MP-04-AM-1007",
    status: "EN_ROUTE_TO_PATIENT",
    crew_type: "DOCTOR_LED",
  };
  const hospital = recommendation.recommendedHospital;

  // Lifecycle timeline states
  const currentStatus = activeDispatch?.status || "ASSIGNED";
  const isEnRoute =
    currentStatus === "EN_ROUTE_TO_PATIENT" ||
    currentStatus === "PATIENT_ONBOARD" ||
    currentStatus === "EN_ROUTE_TO_HOSPITAL" ||
    currentStatus === "ARRIVED";

  return (
    <div className="space-y-6">
      {/* Top Incident Banner (Section 30) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border border-red-700/60 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-red-600 text-white tracking-widest uppercase">
                EMERGENCY ACTIVE
              </span>
              <span className="font-mono text-xs text-red-300">
                CASE #{intake.caseId}
              </span>
            </div>

            <h1 className="text-2xl font-black text-white tracking-wide mt-2">
              {intake.chiefComplaint}
            </h1>
            <p className="text-xs text-slate-300">
              Caller: <strong className="text-white">{intake.callerRole}</strong> • Location:{" "}
              <strong className="text-white">{intake.locationDescription}</strong>
            </p>
          </div>

          {/* Quick Mission Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Patient</div>
              <div className="font-bold text-white text-xs mt-0.5">Demo Patient</div>
              <div className="text-[10px] text-red-400 font-mono">Suspected Stroke</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Ambulance</div>
              <div className="font-bold text-amber-300 font-mono text-xs mt-0.5">
                {ambulance.vehicle_number}
              </div>
              <div className="text-[10px] text-slate-400">{ambulance.crew_type}</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Destination</div>
              <div className="font-bold text-emerald-300 text-xs mt-0.5 truncate max-w-[120px]">
                {hospital.name.split(" ")[0]}
              </div>
              <div className="text-[10px] text-slate-400">{hospital.status.icu_available} ICU free</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Google ETA</div>
              <div className="font-black font-mono text-cyan-300 text-sm mt-0.5">
                {recommendation.etaMinutes} min
              </div>
              <div className="text-[10px] text-slate-400">
                {(recommendation.distanceMeters / 1000).toFixed(1)} km
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operations Split: Map & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map */}
        <div className="lg:col-span-8 h-[540px]">
          <CareFlowMap />
        </div>

        {/* Incident Timeline & Clinical Vitals (Section 30) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Mission Progress Timeline */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Incident Response Lifecycle</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">✓ Emergency Request Received</div>
                  <div className="text-[11px] text-slate-400">
                    Triage level: RED (Emergency + ICU required)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">✓ Ambulance Assigned</div>
                  <div className="text-[11px] text-slate-400">
                    Vehicle: {ambulance.vehicle_number} (ALS Doctor-led)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">✓ Real Route Matrix Calculated</div>
                  <div className="text-[11px] text-slate-400">
                    Google Routes API batch travel times processed
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">
                    ✓ Hospital Recommendation Generated
                  </div>
                  <div className="text-[11px] text-emerald-300 font-mono">
                    {hospital.name} (Score: {recommendation.score})
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">✓ Hospital Pre-Arrival Notified</div>
                  <div className="text-[11px] text-slate-400">
                    Neuro bay & CT suite pre-alerted
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isEnRoute
                      ? "bg-amber-500 text-slate-950 animate-pulse"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  ●
                </div>
                <div>
                  <div className="font-semibold text-slate-200">
                    Ambulance in Transit: {currentStatus.replace(/_/g, " ")}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Continuous GPS tracking & ETA monitoring
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Synthetic Clinical Vitals Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-red-400" />
              <span>Synthetic Field Clinical Telemetry</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400">Heart Rate:</span>{" "}
                <span className="text-white font-bold">{intake.vitalSigns?.heartRate} bpm</span>
              </div>
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400">Blood Pressure:</span>{" "}
                <span className="text-white font-bold">
                  {intake.vitalSigns?.systolicBP}/{intake.vitalSigns?.diastolicBP}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400">SpO2:</span>{" "}
                <span className="text-white font-bold">{intake.vitalSigns?.oxygenSaturation}%</span>
              </div>
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400">GCS Score:</span>{" "}
                <span className="text-amber-400 font-bold">{intake.vitalSigns?.gcs} / 15</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 italic pt-1 font-mono">
              * Synthetic clinical record for demonstration purposes only.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
