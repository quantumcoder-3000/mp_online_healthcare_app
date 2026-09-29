import { EnrichedHospital } from "./hospital";
export type { PatientIntake } from "./patient-intake";

export interface LatLng {
  latitude: number;
  longitude: number;
}

/**
 * Incoming operational triage payload for destination optimization.
 * This is the integration boundary for the voice/triage module.
 */
export interface DestinationRequest {
  patientLocation: LatLng;
  ambulanceLocation: LatLng | null;
  emergencyRequired: boolean;
  icuRequired: boolean;
  requiredSpecialty: string | null;
  traumaRequired: boolean;
  minimumERCapacity: number;
}

export interface HospitalAlternative {
  hospital: EnrichedHospital;
  eligible: boolean;
  score: number;
  etaMinutes: number;
  distanceMeters: number;
  reasons: string[];
}

export interface DestinationRecommendation {
  recommendedHospital: EnrichedHospital;
  alternatives: HospitalAlternative[];
  reason: string;
  score: number;
  etaMinutes: number;
  distanceMeters: number;
  routingSource: "GOOGLE_ROUTES_API" | "FALLBACK_CALCULATED";
  evaluatedAt: string;
}

/**
 * Integration contract for the future voice intake module.
 * The destination module can receive this synthetic or live voice intake
 * and adapt it to a DestinationRequest.
 */


export interface TriageResult {
  triageLevel: "IMMEDIATE_RED" | "URGENT_YELLOW" | "DELAYED_GREEN" | "EXPECTANT_BLACK";
  requiresEmergencyBay: boolean;
  requiresICU: boolean;
  requiresTraumaCenter: boolean;
  specialtyNeeded: string | null;
  minFreeErCapacity: number;
}
