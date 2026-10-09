"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Hospital, HospitalStatus, EnrichedHospital } from "../types/hospital";
import { Ambulance } from "../types/ambulance";
import {
  DestinationRequest,
  DestinationRecommendation,
  PatientIntake,
  TriageResult,
  LatLng,
} from "../types/destination";
import { MOCK_HOSPITALS } from "../data/hospitals";
import { INITIAL_HOSPITAL_STATUSES } from "../data/hospitalStatuses";
import { INITIAL_AMBULANCES } from "../data/ambulances";
import {
  recommendDestination,
  TravelTimeInfo,
} from "../lib/destination/recommend";
import {
  adjustHospitalICU,
  adjustHospitalER,
  toggleHospitalSpecialist,
} from "../lib/simulation/hospitalSimulation";
import {
  stepAmbulanceFleet,
  findNearestAvailableAmbulance,
  ActiveDispatch,
} from "../lib/simulation/ambulanceSimulation";
import { createDemoEmergencyRequest } from "../lib/destination/voiceAdapter";
import { RouteResult, calculateFallbackRoute, RouteMatrixElement } from "../lib/maps/provider";
import { decodePolyline } from "../lib/maps/polyline";

interface CareFlowContextType {
  hospitals: Hospital[];
  hospitalStatuses: Record<string, HospitalStatus>;
  enrichedHospitals: EnrichedHospital[];
  ambulances: Ambulance[];
  activeEmergency: {
    intake: PatientIntake;
    triage: TriageResult;
    request: DestinationRequest;
  } | null;
  assignedAmbulance: Ambulance | null;
  recommendation: DestinationRecommendation | null;
  activeRoute: RouteResult | null;
  activeDispatch: ActiveDispatch | null;
  travelTimes: Record<string, TravelTimeInfo>;
  notificationMessage: string | null;
  isRoutingLoading: boolean;
  isLiveRouting: boolean;

  // Actions
  processEmergency: (intake: PatientIntake) => Promise<void>;
  runEmergencyDemo: () => Promise<void>;
  resetDemo: () => void;
  updateHospitalICU: (hospitalId: string, delta: number) => void;
  updateHospitalER: (hospitalId: string, delta: number) => void;
  toggleSpecialist: (hospitalId: string, specialty: string) => void;
  refreshRouting: () => Promise<void>;
}

const CareFlowContext = createContext<CareFlowContextType | null>(null);

const STORAGE_KEY_STATUSES = "careflow_demo_statuses";
const STORAGE_KEY_AMBULANCES = "careflow_demo_ambulances";

export const CareFlowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hospitals] = useState<Hospital[]>(MOCK_HOSPITALS);
  const [hospitalStatuses, setHospitalStatuses] = useState<
    Record<string, HospitalStatus>
  >(INITIAL_HOSPITAL_STATUSES);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(INITIAL_AMBULANCES);

  const [activeEmergency, setActiveEmergency] = useState<{
    intake: PatientIntake;
    triage: TriageResult;
    request: DestinationRequest;
  } | null>(null);

  const [assignedAmbulance, setAssignedAmbulance] = useState<Ambulance | null>(
    null
  );
  const [recommendation, setRecommendation] =
    useState<DestinationRecommendation | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [activeDispatch, setActiveDispatch] = useState<ActiveDispatch | null>(
    null
  );
  const [travelTimes, setTravelTimes] = useState<
    Record<string, TravelTimeInfo>
  >({});
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [isRoutingLoading, setIsRoutingLoading] = useState<boolean>(false);
  const [isLiveRouting, setIsLiveRouting] = useState<boolean>(false);

  // Keep references for tick loop
  const ambulancesRef = useRef(ambulances);
  const dispatchRef = useRef(activeDispatch);

  useEffect(() => {
    ambulancesRef.current = ambulances;
  }, [ambulances]);

  useEffect(() => {
    dispatchRef.current = activeDispatch;
  }, [activeDispatch]);

  // Compute enriched hospitals
  const enrichedHospitals: EnrichedHospital[] = hospitals.map((h) => ({
    ...h,
    status: hospitalStatuses[h.id] || {
      hospital_id: h.id,
      icu_available: 0,
      er_occupancy: 0,
      er_capacity: 10,
      current_load: 50,
      predicted_load: 50,
      specialists_available: [],
      updated_at: new Date().toISOString(),
      data_source: "SIMULATED_DEMO",
    },
  }));

  /**
   * Recalculates recommendation deterministically whenever status or travel times change
   */
  const computeRecommendation = useCallback(
    (
      req: DestinationRequest,
      statuses: Record<string, HospitalStatus>,
      times: Record<string, TravelTimeInfo>
    ) => {
      const rec = recommendDestination(req, hospitals, statuses, times);
      setRecommendation(rec);
      return rec;
    },
    [hospitals]
  );

  /**
   * Fetch travel matrix from server API (Google Routes API) with fallback
   */
  const fetchTravelMatrix = useCallback(
    async (
      origin: LatLng
    ): Promise<Record<string, TravelTimeInfo>> => {
      setIsRoutingLoading(true);
      const times: Record<string, TravelTimeInfo> = {};

      try {
        const dests = hospitals.map((h) => ({
          latitude: h.latitude,
          longitude: h.longitude,
        }));

        const response = await fetch("/api/routes/matrix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origins: [origin],
            destinations: dests,
            routingPreference: "TRAFFIC_AWARE",
          }),
        });

        if (response.ok) {
          const matrix = await response.json();
          let hasLive = false;

          matrix.forEach((elem: RouteMatrixElement) => {
            const hosp = hospitals[elem.destinationIndex];
            if (hosp) {
              const mins = Math.max(1, Math.round(elem.durationSeconds / 60));
              if (elem.isLiveTraffic) hasLive = true;
              times[hosp.id] = {
                hospitalId: hosp.id,
                etaMinutes: mins,
                distanceMeters: elem.distanceMeters,
                isLiveTraffic: elem.isLiveTraffic,
                routingSource: elem.isLiveTraffic
                  ? "GOOGLE_ROUTES_API"
                  : "FALLBACK_CALCULATED",
              };
            }
          });

          setIsLiveRouting(hasLive);
        } else {
          throw new Error("Matrix endpoint returned error");
        }
      } catch (err) {
        console.warn("[CareFlow] Using local fallback travel matrix:", err);
        hospitals.forEach((h) => {
          const fallback = calculateFallbackRoute(origin, {
            latitude: h.latitude,
            longitude: h.longitude,
          });
          times[h.id] = {
            hospitalId: h.id,
            etaMinutes: Math.max(
              1,
              Math.round(fallback.durationSeconds / 60)
            ),
            distanceMeters: fallback.distanceMeters,
            isLiveTraffic: false,
            routingSource: "FALLBACK_CALCULATED",
          };
        });
        setIsLiveRouting(false);
      } finally {
        setIsRoutingLoading(false);
      }

      setTravelTimes(times);
      return times;
    },
    [hospitals]
  );

  /**
   * Fetch route geometry from server API (Google Routes API)
   */
  const fetchSingleRoute = useCallback(
    async (origin: LatLng, dest: LatLng): Promise<RouteResult> => {
      try {
        const res = await fetch("/api/routes/route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin,
            destination: dest,
            routingPreference: "TRAFFIC_AWARE",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setActiveRoute(data);
          return data;
        }
      } catch (err) {
        console.error("Error fetching route:", err);
      }
      const fallback = calculateFallbackRoute(origin, dest);
      setActiveRoute(fallback);
      return fallback;
    },
    []
  );

  const processEmergency = useCallback(async (intake: PatientIntake) => {
    // 1. Triage the real intake
    const triage: TriageResult = {
      triageLevel: "IMMEDIATE_RED",
      requiresEmergencyBay: true,
      requiresICU: false,
      requiresTraumaCenter: false,
      specialtyNeeded: null,
      minFreeErCapacity: 1
    };

    const request: DestinationRequest = {
      patientLocation: { latitude: 23.2599, longitude: 77.4126 },
      ambulanceLocation: null,
      emergencyRequired: true,
      icuRequired: false,
      requiredSpecialty: null,
      traumaRequired: false,
      minimumERCapacity: 1
    };

    setActiveEmergency({ intake, triage, request });

    // 2. Locate nearest available ambulance
    const nearest = findNearestAvailableAmbulance(
      ambulancesRef.current,
      request.patientLocation
    );
    const chosenAmbulance = nearest || ambulancesRef.current[0];
    setAssignedAmbulance(chosenAmbulance);

    // 3. Calculate route matrix
    const originLoc = {
      latitude: chosenAmbulance.latitude,
      longitude: chosenAmbulance.longitude,
    };
    const times = await fetchTravelMatrix(originLoc);

    // 4. Recommend destination
    const rec = computeRecommendation(request, hospitalStatuses, times);

    if (rec) {
      // Get fallback route to start moving
      const route = await fetchSingleRoute(request.patientLocation, {
        latitude: rec.recommendedHospital.latitude,
        longitude: rec.recommendedHospital.longitude,
      });

      const dispatch: ActiveDispatch = {
        ambulanceId: chosenAmbulance.id,
        patientLocation: request.patientLocation,
        hospitalLocation: {
          latitude: rec.recommendedHospital.latitude,
          longitude: rec.recommendedHospital.longitude,
        },
        hospitalId: rec.recommendedHospital.id,
        status: "ASSIGNED",
        progress: 0,
        waypoints: route.polyline ? decodePolyline(route.polyline) : [],
        currentWaypointIdx: 0,
      };

      setRecommendation(rec);
      setTravelTimes(times);
      setActiveRoute(route);
      setActiveDispatch(dispatch);

      // Update ambulance status to ASSIGNED
      setAmbulances((prev) =>
        prev.map((a) =>
          a.id === chosenAmbulance.id
            ? {
                ...a,
                status: "ASSIGNED",
                current_case_id: intake.caseId || `CASE-VOICE-${Date.now().toString().slice(-4)}`,
                destination_hospital_id: rec.recommendedHospital.id,
              }
            : a
        )
      );

      setNotificationMessage(`Emergency detected from voice: ${chosenAmbulance.vehicle_number} assigned. Recommended: ${rec.recommendedHospital.name}`);
      setTimeout(() => setNotificationMessage(null), 5000);
    }
  }, [hospitalStatuses, fetchTravelMatrix, computeRecommendation, fetchSingleRoute]);

  /**
   * Run Emergency Demo sequence (Section 33)
   */
  const runEmergencyDemo = useCallback(async () => {
    // 1. Generate demo patient request
    const demo = createDemoEmergencyRequest();
    setActiveEmergency(demo);

    // 2. Locate nearest available ambulance
    const nearest = findNearestAvailableAmbulance(
      ambulancesRef.current,
      demo.request.patientLocation
    );
    const chosenAmbulance = nearest || ambulancesRef.current[0];
    setAssignedAmbulance(chosenAmbulance);

    // 3. Calculate Google Route Matrix from patient/ambulance location to candidate hospitals
    const originLoc = {
      latitude: chosenAmbulance.latitude,
      longitude: chosenAmbulance.longitude,
    };
    const times = await fetchTravelMatrix(originLoc);

    // 4. Filter & score candidate hospitals to select recommended destination
    const rec = computeRecommendation(demo.request, hospitalStatuses, times);

    if (rec) {
      // 5. Compute single route polyline for the recommended hospital
      await fetchSingleRoute(demo.request.patientLocation, {
        latitude: rec.recommendedHospital.latitude,
        longitude: rec.recommendedHospital.longitude,
      });

      // 6. Start active ambulance dispatch simulation
      const dispatch: ActiveDispatch = {
        ambulanceId: chosenAmbulance.id,
        patientLocation: demo.request.patientLocation,
        hospitalLocation: {
          latitude: rec.recommendedHospital.latitude,
          longitude: rec.recommendedHospital.longitude,
        },
        hospitalId: rec.recommendedHospital.id,
        status: "ASSIGNED",
        progress: 0,
        waypoints: [],
        currentWaypointIdx: 0,
      };
      setActiveDispatch(dispatch);

      // Update ambulance status to ASSIGNED
      setAmbulances((prev) =>
        prev.map((a) =>
          a.id === chosenAmbulance.id
            ? {
                ...a,
                status: "ASSIGNED",
                current_case_id: demo.intake.caseId || null,
                destination_hospital_id: rec.recommendedHospital.id,
              }
            : a
        )
      );

      setNotificationMessage(
        `Emergency dispatched: ${chosenAmbulance.vehicle_number} assigned. ${rec.recommendedHospital.name} recommended.`
      );
    }
  }, [
    computeRecommendation,
    fetchSingleRoute,
    fetchTravelMatrix,
    hospitalStatuses,
  ]);

  /**
   * Reset the demo to baseline
   */
  const resetDemo = useCallback(() => {
    setActiveEmergency(null);
    setAssignedAmbulance(null);
    setRecommendation(null);
    setActiveRoute(null);
    setActiveDispatch(null);
    setNotificationMessage(null);
    setHospitalStatuses(INITIAL_HOSPITAL_STATUSES);
    setAmbulances(INITIAL_AMBULANCES);
  }, []);

  /**
   * Hospital capacity controls: ICU change
   */
  const updateHospitalICU = useCallback(
    (hospitalId: string, delta: number) => {
      const current = hospitalStatuses[hospitalId];
      if (!current) return;
      const targetHosp = hospitals.find((h) => h.id === hospitalId);
      const totalIcu = targetHosp?.icu_total || 50;

      const nextStatus = adjustHospitalICU(current, delta, totalIcu);
      const updatedStatuses = { ...hospitalStatuses, [hospitalId]: nextStatus };
      setHospitalStatuses(updatedStatuses);

      // Section 28 & 38: Recalculate recommendation without refetching Google API if travel times exist
      if (activeEmergency) {
        const oldRec = recommendation;
        const newRec = computeRecommendation(
          activeEmergency.request,
          updatedStatuses,
          travelTimes
        );

        if (oldRec && newRec && oldRec.recommendedHospital.id !== newRec.recommendedHospital.id) {
          setNotificationMessage(
            `Recommendation updated because ${targetHosp?.name}'s ICU capacity changed.`
          );

          // Update active route and dispatch to new hospital
          fetchSingleRoute(activeEmergency.request.patientLocation, {
            latitude: newRec.recommendedHospital.latitude,
            longitude: newRec.recommendedHospital.longitude,
          });

          if (activeDispatch) {
            setActiveDispatch((prev) =>
              prev
                ? {
                    ...prev,
                    hospitalId: newRec.recommendedHospital.id,
                    hospitalLocation: {
                      latitude: newRec.recommendedHospital.latitude,
                      longitude: newRec.recommendedHospital.longitude,
                    },
                  }
                : null
            );
          }
        }
      }
    },
    [
      hospitalStatuses,
      hospitals,
      activeEmergency,
      recommendation,
      computeRecommendation,
      travelTimes,
      fetchSingleRoute,
      activeDispatch,
    ]
  );

  /**
   * Hospital capacity controls: ER occupancy change
   */
  const updateHospitalER = useCallback(
    (hospitalId: string, delta: number) => {
      const current = hospitalStatuses[hospitalId];
      if (!current) return;

      const nextStatus = adjustHospitalER(current, delta);
      const updatedStatuses = { ...hospitalStatuses, [hospitalId]: nextStatus };
      setHospitalStatuses(updatedStatuses);

      if (activeEmergency) {
        computeRecommendation(
          activeEmergency.request,
          updatedStatuses,
          travelTimes
        );
      }
    },
    [hospitalStatuses, activeEmergency, computeRecommendation, travelTimes]
  );

  /**
   * Hospital capacity controls: Specialist toggle
   */
  const toggleSpecialist = useCallback(
    (hospitalId: string, specialty: string) => {
      const current = hospitalStatuses[hospitalId];
      if (!current) return;
      const targetHosp = hospitals.find((h) => h.id === hospitalId);

      const nextStatus = toggleHospitalSpecialist(current, specialty);
      const updatedStatuses = { ...hospitalStatuses, [hospitalId]: nextStatus };
      setHospitalStatuses(updatedStatuses);

      if (activeEmergency) {
        const oldRec = recommendation;
        const newRec = computeRecommendation(
          activeEmergency.request,
          updatedStatuses,
          travelTimes
        );

        if (oldRec && newRec && oldRec.recommendedHospital.id !== newRec.recommendedHospital.id) {
          setNotificationMessage(
            `Recommendation updated: ${specialty} availability changed at ${targetHosp?.name}.`
          );

          fetchSingleRoute(activeEmergency.request.patientLocation, {
            latitude: newRec.recommendedHospital.latitude,
            longitude: newRec.recommendedHospital.longitude,
          });
        }
      }
    },
    [
      hospitalStatuses,
      hospitals,
      activeEmergency,
      recommendation,
      computeRecommendation,
      travelTimes,
      fetchSingleRoute,
    ]
  );

  const refreshRouting = useCallback(async () => {
    if (activeEmergency) {
      const origin = assignedAmbulance
        ? {
            latitude: assignedAmbulance.latitude,
            longitude: assignedAmbulance.longitude,
          }
        : activeEmergency.request.patientLocation;
      const times = await fetchTravelMatrix(origin);
      computeRecommendation(
        activeEmergency.request,
        hospitalStatuses,
        times
      );
    }
  }, [
    activeEmergency,
    assignedAmbulance,
    fetchTravelMatrix,
    computeRecommendation,
    hospitalStatuses,
  ]);

  // Simulation tick loop (every 2.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      const { updatedFleet, updatedDispatch } = stepAmbulanceFleet(
        ambulancesRef.current,
        dispatchRef.current,
        2.5
      );
      setAmbulances(updatedFleet);
      setActiveDispatch(updatedDispatch);

      if (updatedDispatch && assignedAmbulance) {
        const found = updatedFleet.find((a) => a.id === updatedDispatch.ambulanceId);
        if (found) setAssignedAmbulance(found);
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [assignedAmbulance]);

  return (
    <CareFlowContext.Provider
      value={{
        hospitals,
        hospitalStatuses,
        enrichedHospitals,
        ambulances,
        activeEmergency,
        assignedAmbulance,
        recommendation,
        activeRoute,
        activeDispatch,
        travelTimes,
        notificationMessage,
        isRoutingLoading,
        isLiveRouting,
        processEmergency,
        runEmergencyDemo,
        resetDemo,
        updateHospitalICU,
        updateHospitalER,
        toggleSpecialist,
        refreshRouting,
      }}
    >
      {children}
    </CareFlowContext.Provider>
  );
};

export const useCareFlow = () => {
  const context = useContext(CareFlowContext);
  if (!context) {
    throw new Error("useCareFlow must be used within a CareFlowProvider");
  }
  return context;
};

