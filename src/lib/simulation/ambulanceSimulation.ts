import { Ambulance, AmbulanceStatus } from "../../types/ambulance";
import { LatLng } from "../../types/destination";

// Bounding box for Bhopal metropolitan demo corridor
export const DEMO_BOUNDS = {
  minLat: 23.15,
  maxLat: 23.32,
  minLng: 77.32,
  maxLng: 77.49,
};

export interface ActiveDispatch {
  ambulanceId: string;
  patientLocation: LatLng;
  hospitalLocation: LatLng;
  hospitalId: string;
  status: AmbulanceStatus;
  progress: number; // 0 to 1 along current segment
  waypoints: LatLng[];
  currentWaypointIdx: number;
}

/**
 * Calculates Euclidean distance between two geographic coordinates in meters (approximation).
 */
export function geoDistanceMeters(p1: LatLng, p2: LatLng): number {
  const R = 6371e3;
  const dLat = ((p2.latitude - p1.latitude) * Math.PI) / 180;
  const dLng = ((p2.longitude - p1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.latitude * Math.PI) / 180) *
      Math.cos((p2.latitude * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates bearing angle in degrees between two coordinates.
 */
export function calculateBearing(start: LatLng, dest: LatLng): number {
  const startLat = (start.latitude * Math.PI) / 180;
  const startLng = (start.longitude * Math.PI) / 180;
  const destLat = (dest.latitude * Math.PI) / 180;
  const destLng = (dest.longitude * Math.PI) / 180;

  const y = Math.sin(destLng - startLng) * Math.cos(destLat);
  const x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Advances simulated fleet positions by dt seconds.
 * Available ambulances wander slightly along local road sectors.
 * Dispatched ambulance progresses through lifecycles:
 * AVAILABLE -> ASSIGNED -> EN_ROUTE_TO_PATIENT -> PATIENT_ONBOARD -> EN_ROUTE_TO_HOSPITAL -> ARRIVED.
 */
export function stepAmbulanceFleet(
  fleet: Ambulance[],
  activeDispatch: ActiveDispatch | null,
  dtSeconds: number = 2
): { updatedFleet: Ambulance[]; updatedDispatch: ActiveDispatch | null } {
  const updatedDispatch = activeDispatch ? { ...activeDispatch } : null;

  const updatedFleet = fleet.map((amb) => {
    // If this ambulance is in active emergency transit
    if (updatedDispatch && updatedDispatch.ambulanceId === amb.id) {
      return stepActiveAmbulance(amb, updatedDispatch, dtSeconds);
    }

    // Available patrol: slight smooth wander within bounds
    if (amb.status === "AVAILABLE") {
      return stepPatrolAmbulance(amb, dtSeconds);
    }

    return amb;
  });

  return { updatedFleet, updatedDispatch };
}

function stepActiveAmbulance(
  amb: Ambulance,
  dispatch: ActiveDispatch,
  dtSeconds: number
): Ambulance {
  const speedMetersPerSec = 14; // ~50 km/h emergency transit
  const travelDistance = speedMetersPerSec * dtSeconds;

  let currentTarget: LatLng;
  if (
    dispatch.status === "ASSIGNED" ||
    dispatch.status === "EN_ROUTE_TO_PATIENT"
  ) {
    currentTarget = dispatch.patientLocation;
  } else {
    currentTarget = dispatch.hospitalLocation;
  }

  const distToTarget = geoDistanceMeters(
    { latitude: amb.latitude, longitude: amb.longitude },
    currentTarget
  );

  // Reached target threshold (< 60 meters)
  if (distToTarget <= Math.max(60, travelDistance)) {
    if (dispatch.status === "EN_ROUTE_TO_PATIENT" || dispatch.status === "ASSIGNED") {
      dispatch.status = "PATIENT_ONBOARD";
      return {
        ...amb,
        latitude: currentTarget.latitude,
        longitude: currentTarget.longitude,
        status: "PATIENT_ONBOARD",
        speed_kmh: 0,
        destination_hospital_id: dispatch.hospitalId,
      };
    } else if (
      dispatch.status === "PATIENT_ONBOARD" ||
      dispatch.status === "EN_ROUTE_TO_HOSPITAL"
    ) {
      dispatch.status = "ARRIVED";
      return {
        ...amb,
        latitude: currentTarget.latitude,
        longitude: currentTarget.longitude,
        status: "ARRIVED",
        speed_kmh: 0,
      };
    }
  }

  // Smooth advancement towards current target
  const fraction = Math.min(1, travelDistance / Math.max(1, distToTarget));
  const newLat = amb.latitude + (currentTarget.latitude - amb.latitude) * fraction;
  const newLng = amb.longitude + (currentTarget.longitude - amb.longitude) * fraction;
  const heading = calculateBearing(
    { latitude: amb.latitude, longitude: amb.longitude },
    currentTarget
  );

  let nextStatus: AmbulanceStatus = amb.status;
  if (amb.status === "ASSIGNED") nextStatus = "EN_ROUTE_TO_PATIENT";
  else if (amb.status === "PATIENT_ONBOARD") nextStatus = "EN_ROUTE_TO_HOSPITAL";

  dispatch.status = nextStatus;

  return {
    ...amb,
    latitude: Math.round(newLat * 100000) / 100000,
    longitude: Math.round(newLng * 100000) / 100000,
    status: nextStatus,
    speed_kmh: 48 + Math.round(Math.random() * 8),
    heading: Math.round(heading),
  };
}

function stepPatrolAmbulance(amb: Ambulance, dtSeconds: number): Ambulance {
  // Gentle microscopic shift representing station rotation / traffic crawl
  const delta = (Math.random() - 0.5) * 0.00015 * (dtSeconds / 2);
  let newLat = amb.latitude + delta;
  let newLng = amb.longitude + delta * 0.8;

  // Keep strictly bounded
  if (newLat < DEMO_BOUNDS.minLat || newLat > DEMO_BOUNDS.maxLat) {
    newLat = amb.latitude - delta;
  }
  if (newLng < DEMO_BOUNDS.minLng || newLng > DEMO_BOUNDS.maxLng) {
    newLng = amb.longitude - delta;
  }

  return {
    ...amb,
    latitude: Math.round(newLat * 100000) / 100000,
    longitude: Math.round(newLng * 100000) / 100000,
    speed_kmh: Math.random() > 0.6 ? Math.round(15 + Math.random() * 10) : 0,
  };
}

/**
 * Finds the closest available ambulance to a given patient location.
 */
export function findNearestAvailableAmbulance(
  ambulances: Ambulance[],
  patientLoc: LatLng
): Ambulance | null {
  const available = ambulances.filter((a) => a.status === "AVAILABLE");
  if (available.length === 0) return null;

  let bestAmb: Ambulance = available[0];
  let minDistance = geoDistanceMeters(
    { latitude: bestAmb.latitude, longitude: bestAmb.longitude },
    patientLoc
  );

  for (let i = 1; i < available.length; i++) {
    const amb = available[i];
    const dist = geoDistanceMeters(
      { latitude: amb.latitude, longitude: amb.longitude },
      patientLoc
    );
    if (dist < minDistance) {
      minDistance = dist;
      bestAmb = amb;
    }
  }

  return bestAmb;
}
