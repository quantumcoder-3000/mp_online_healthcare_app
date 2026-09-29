"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useCareFlow } from "@/context/CareFlowContext";
import { EnrichedHospital } from "@/types/hospital";
import { Ambulance } from "@/types/ambulance";
import { decodePolyline } from "@/lib/maps/polyline";
import { LatLng } from "@/types/destination";
import {
  Building2,
  Navigation,
  AlertTriangle,
  Activity,
  Bed,
  UserCheck,
  TrendingUp,
  MapPin,
  ExternalLink,
} from "lucide-react";

export const CareFlowMap: React.FC = () => {
  const {
    enrichedHospitals,
    ambulances,
    activeEmergency,
    assignedAmbulance,
    recommendation,
    activeRoute,
    travelTimes,
  } = useCareFlow();

  const [selectedHospital, setSelectedHospital] = useState<EnrichedHospital | null>(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);

  // Google Maps API Key check
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isKeyAvailable = Boolean(apiKey && apiKey.trim() !== "");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Center point: Bhopal urban center
  const centerLat = 23.235;
  const centerLng = 77.425;

  // Decoded polyline coordinates if available
  const routePoints: LatLng[] = useMemo(() => {
    if (activeRoute?.polyline) {
      return decodePolyline(activeRoute.polyline);
    }
    // If no polyline string, fallback to direct line
    if (activeEmergency && recommendation) {
      return [
        activeEmergency.request.patientLocation,
        {
          latitude: recommendation.recommendedHospital.latitude,
          longitude: recommendation.recommendedHospital.longitude,
        },
      ];
    }
    return [];
  }, [activeRoute, activeEmergency, recommendation]);

  // Load Google Maps script dynamically if key is available
  useEffect(() => {
    if (!isKeyAvailable || typeof window === "undefined") return;

    const existingScript = document.getElementById("google-maps-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.onload = () => initGoogleMap();
      document.head.appendChild(script);
    } else if (window.google?.maps) {
      initGoogleMap();
    }

    function initGoogleMap() {
      if (!mapContainerRef.current || !window.google?.maps) return;

      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 12,
        mapTypeId: "roadmap",
        styles: [
          { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#cbd5e1" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#1e293b" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#334155" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1e293b" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#1e293b" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#082f49" }],
          },
        ],
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      googleMapRef.current = map;
    }
  }, [apiKey, isKeyAvailable]);

  // Update Google Maps markers & route when state changes
  useEffect(() => {
    if (!googleMapRef.current || !window.google?.maps) return;
    const map = googleMapRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    // 1. Patient Marker
    if (activeEmergency) {
      const pLoc = activeEmergency.request.patientLocation;
      const patientMarker = new google.maps.Marker({
        position: { lat: pLoc.latitude, lng: pLoc.longitude },
        map,
        title: "EMERGENCY: Patient Location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
      markersRef.current.push(patientMarker);
      bounds.extend({ lat: pLoc.latitude, lng: pLoc.longitude });
    }

    // 2. Hospital Markers
    enrichedHospitals.forEach((hosp) => {
      const isRec = recommendation?.recommendedHospital.id === hosp.id;
      const marker = new google.maps.Marker({
        position: { lat: hosp.latitude, lng: hosp.longitude },
        map,
        title: hosp.name,
        label: {
          text: isRec ? "★ 🏥" : "🏥",
          color: isRec ? "#10b981" : "#ffffff",
          fontSize: isRec ? "18px" : "14px",
        },
      });

      marker.addListener("click", () => {
        setSelectedHospital(hosp);
      });

      markersRef.current.push(marker);
      bounds.extend({ lat: hosp.latitude, lng: hosp.longitude });
    });

    // 3. Ambulance Markers
    ambulances.forEach((amb) => {
      const isAssigned = assignedAmbulance?.id === amb.id;
      const marker = new google.maps.Marker({
        position: { lat: amb.latitude, lng: amb.longitude },
        map,
        title: `${amb.vehicle_number} (${amb.status})`,
        label: {
          text: "🚑",
          fontSize: isAssigned ? "20px" : "14px",
        },
      });

      marker.addListener("click", () => {
        setSelectedAmbulance(amb);
      });

      markersRef.current.push(marker);
      if (isAssigned) {
        bounds.extend({ lat: amb.latitude, lng: amb.longitude });
      }
    });

    // 4. Draw Route Polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    if (routePoints.length > 1) {
      const path = routePoints.map((pt) => ({
        lat: pt.latitude,
        lng: pt.longitude,
      }));

      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: "#10b981",
        strokeOpacity: 0.9,
        strokeWeight: 5,
        map,
      });

      path.forEach((p) => bounds.extend(p));
    }

    // Adjust camera viewport
    if (activeEmergency && !bounds.isEmpty()) {
      map.fitBounds(bounds, 50);
    }
  }, [
    enrichedHospitals,
    ambulances,
    activeEmergency,
    assignedAmbulance,
    recommendation,
    routePoints,
  ]);

  // Tactical GIS Coordinates Projector for Native Fallback Grid
  // Bounding area of Bhopal: Lat [23.14, 23.32], Lng [77.31, 77.49]
  const minLat = 23.15;
  const maxLat = 23.32;
  const minLng = 77.32;
  const maxLng = 77.49;

  const projectToPercent = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(4, Math.min(96, x)),
      y: Math.max(4, Math.min(96, y)),
    };
  };

  return (
    <div className="relative w-full h-full min-h-[520px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* Top Map Status Banner */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-900/90 border border-slate-700 text-slate-200 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            BHOPAL EMERGENCY DISPATCH CORRIDOR
          </span>

          <span
            className={`px-2 py-1 text-[11px] font-mono rounded-md backdrop-blur-md border ${
              isKeyAvailable
                ? "bg-emerald-950/80 border-emerald-600 text-emerald-300"
                : "bg-amber-950/80 border-amber-600 text-amber-300"
            }`}
          >
            {isKeyAvailable ? "LIVE GOOGLE MAPS API ACTIVE" : "TACTICAL GIS GRID (DEMO)"}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <span className="px-2 py-1 text-[11px] font-mono bg-slate-900/90 border border-slate-700 text-slate-400 rounded-md">
            23.2355° N, 77.4285° E
          </span>
        </div>
      </div>

      {/* Main Map Body: Google Maps Container or Tactical Grid */}
      {isKeyAvailable ? (
        <div ref={mapContainerRef} className="w-full h-full min-h-[520px]" />
      ) : (
        <div className="relative w-full flex-1 bg-gradient-to-b from-[#06090e] via-[#09111c] to-[#040810] overflow-hidden select-none">
          {/* Tactical GIS Grid Lines */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Bhopal Lake Representation (Upper Lake & Lower Lake subtle geographic styling) */}
          <div className="absolute top-[28%] left-[20%] w-36 h-20 rounded-full bg-cyan-950/30 blur-sm border border-cyan-900/20 transform -rotate-12 pointer-events-none" />
          <div className="absolute top-[38%] left-[34%] w-16 h-10 rounded-full bg-cyan-950/30 blur-sm border border-cyan-900/20 pointer-events-none" />

          {/* SVG Route Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Draw route lines */}
            {activeEmergency && assignedAmbulance && (
              <line
                x1={`${projectToPercent(assignedAmbulance.latitude, assignedAmbulance.longitude).x}%`}
                y1={`${projectToPercent(assignedAmbulance.latitude, assignedAmbulance.longitude).y}%`}
                x2={`${projectToPercent(activeEmergency.request.patientLocation.latitude, activeEmergency.request.patientLocation.longitude).x}%`}
                y2={`${projectToPercent(activeEmergency.request.patientLocation.latitude, activeEmergency.request.patientLocation.longitude).y}%`}
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            )}

            {activeEmergency && recommendation && (
              <line
                x1={`${projectToPercent(activeEmergency.request.patientLocation.latitude, activeEmergency.request.patientLocation.longitude).x}%`}
                y1={`${projectToPercent(activeEmergency.request.patientLocation.latitude, activeEmergency.request.patientLocation.longitude).y}%`}
                x2={`${projectToPercent(recommendation.recommendedHospital.latitude, recommendation.recommendedHospital.longitude).x}%`}
                y2={`${projectToPercent(recommendation.recommendedHospital.latitude, recommendation.recommendedHospital.longitude).y}%`}
                stroke="#10b981"
                strokeWidth="3.5"
              />
            )}
          </svg>

          {/* Patient Marker */}
          {activeEmergency && (
            <div
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{
                left: `${projectToPercent(activeEmergency.request.patientLocation.latitude, activeEmergency.request.patientLocation.longitude).x}%`,
                top: `${projectToPercent(activeEmergency.request.patientLocation.latitude, activeEmergency.request.patientLocation.longitude).y}%`,
              }}
            >
              <div className="relative flex flex-col items-center">
                <span className="absolute -top-1 w-8 h-8 rounded-full bg-red-500/40 animate-ping" />
                <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white shadow-lg shadow-red-950 font-bold text-xs">
                  🚨
                </div>
                <div className="mt-1 px-2 py-0.5 rounded bg-red-950/90 border border-red-700 text-[10px] font-mono text-red-200 whitespace-nowrap shadow-md">
                  PATIENT (MP Nagar)
                </div>
              </div>
            </div>
          )}

          {/* Hospital Markers */}
          {enrichedHospitals.map((hosp) => {
            const isRec = recommendation?.recommendedHospital.id === hosp.id;
            const travel = travelTimes[hosp.id];
            const coords = projectToPercent(hosp.latitude, hosp.longitude);

            return (
              <div
                key={hosp.id}
                onClick={() => setSelectedHospital(hosp)}
                className={`absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${
                  isRec ? "scale-110 z-30" : "hover:scale-105"
                }`}
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
              >
                <div className="relative flex flex-col items-center">
                  {isRec && (
                    <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping" />
                  )}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-lg text-base border transition-all ${
                      isRec
                        ? "bg-emerald-600 border-emerald-300 ring-4 ring-emerald-500/30 text-white shadow-emerald-900/80"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    🏥
                  </div>

                  {/* Marker label */}
                  <div
                    className={`mt-1 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap border shadow-md flex items-center gap-1 ${
                      isRec
                        ? "bg-emerald-950/95 border-emerald-600 text-emerald-200 font-bold"
                        : "bg-slate-900/90 border-slate-800 text-slate-300"
                    }`}
                  >
                    {isRec && <span className="text-amber-400">★</span>}
                    <span>{hosp.name.split(" ")[0]}</span>
                    {travel && (
                      <span className="text-[9px] text-slate-400 font-mono">
                        ({travel.etaMinutes}m)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Ambulance Markers */}
          {ambulances.map((amb) => {
            const isAssigned = assignedAmbulance?.id === amb.id;
            const coords = projectToPercent(amb.latitude, amb.longitude);

            return (
              <div
                key={amb.id}
                onClick={() => setSelectedAmbulance(amb)}
                className={`absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-700 ${
                  isAssigned ? "scale-125 z-40" : "hover:scale-110"
                }`}
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
              >
                <div className="relative flex flex-col items-center">
                  {isAssigned && (
                    <span className="absolute -inset-2 rounded-full bg-amber-500/40 animate-ping" />
                  )}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md border text-xs transition-all ${
                      isAssigned
                        ? "bg-amber-600 border-amber-300 text-white shadow-amber-950 ring-2 ring-amber-400"
                        : amb.status === "AVAILABLE"
                        ? "bg-slate-900 border-emerald-500/70 text-slate-200"
                        : "bg-slate-800 border-slate-600 text-slate-400"
                    }`}
                  >
                    🚑
                  </div>
                  <div className="mt-0.5 px-1.5 py-0.2 rounded bg-slate-950/90 border border-slate-800 text-[9px] font-mono text-slate-300">
                    {amb.vehicle_number.split("-").pop()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Map Legend / Footer Controls */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 z-10 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🏥</span>
            <span>Hospital Network</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-400 font-medium">Recommended Destination</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">🚑</span>
            <span>Simulated Ambulances</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-amber-400">Assigned Transit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-red-400">Patient Emergency</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          * Hospital locations: Real GIS | Fleet & Beds: Simulated Demo
        </div>
      </div>

      {/* Hospital Inspection Modal / Slide-up Card (Section 19) */}
      {selectedHospital && (
        <div className="absolute bottom-14 left-4 right-4 md:right-auto md:w-96 z-30 bg-slate-900/95 border border-slate-700 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🏥</span>
                <h4 className="font-semibold text-slate-100 text-sm">
                  {selectedHospital.name}
                </h4>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedHospital.address}</p>
            </div>
            <button
              onClick={() => setSelectedHospital(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="text-slate-400 flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-cyan-400" /> ICU Beds
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {selectedHospital.status.icu_available}{" "}
                <span className="text-xs font-normal text-slate-400">
                  / {selectedHospital.icu_total} total
                </span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="text-slate-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-amber-400" /> ER Occupancy
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {selectedHospital.status.er_occupancy}{" "}
                <span className="text-xs font-normal text-slate-400">
                  / {selectedHospital.status.er_capacity} bays
                </span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" /> 30-min Load
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {selectedHospital.status.predicted_load}%
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="text-slate-400 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Travel ETA
              </div>
              <div className="text-sm font-bold text-emerald-400 mt-1">
                {travelTimes[selectedHospital.id]?.etaMinutes || "--"} min
              </div>
            </div>
          </div>

          <div className="mt-3">
            <span className="text-[11px] text-slate-400">Specialists on active duty:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedHospital.status.specialists_available.map((spec) => (
                <span
                  key={spec}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300 font-mono capitalize"
                >
                  {spec.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>Source: {selectedHospital.status.data_source}</span>
            <span>Coords: {selectedHospital.latitude.toFixed(4)}, {selectedHospital.longitude.toFixed(4)}</span>
          </div>
        </div>
      )}

      {/* Ambulance Inspection Modal */}
      {selectedAmbulance && (
        <div className="absolute bottom-14 right-4 md:w-80 z-30 bg-slate-900/95 border border-slate-700 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🚑</span>
                <h4 className="font-semibold text-slate-100 text-sm">
                  {selectedAmbulance.vehicle_number}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 mt-1 inline-block">
                {selectedAmbulance.status}
              </span>
            </div>
            <button
              onClick={() => setSelectedAmbulance(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 mt-3 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Equipment Level:</span>
              <span className="font-semibold text-emerald-400">{selectedAmbulance.equipment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Crew Type:</span>
              <span>{selectedAmbulance.crew_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Speed:</span>
              <span className="font-mono">{selectedAmbulance.speed_kmh ?? 0} km/h</span>
            </div>
            {selectedAmbulance.current_case_id && (
              <div className="flex justify-between">
                <span className="text-slate-400">Case ID:</span>
                <span className="font-mono text-amber-300">{selectedAmbulance.current_case_id}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
