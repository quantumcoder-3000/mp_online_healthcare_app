import {
  PatientIntake,
  TriageResult,
  DestinationRequest,
  LatLng,
} from "../../types/destination";

/**
 * Adapter bridging the independent Voice Intake module to the Destination Intelligence Layer.
 * Transforms clinical intake findings and triage decisions into an operational DestinationRequest.
 */
export function createDestinationRequest(
  patientIntake: PatientIntake,
  triageResult: TriageResult,
  ambulanceLocation: LatLng | null = null
): DestinationRequest {
  return {
    patientLocation: patientIntake.location || { latitude: 23.2599, longitude: 77.4126 },
    ambulanceLocation: ambulanceLocation,
    emergencyRequired: triageResult.requiresEmergencyBay,
    icuRequired: triageResult.requiresICU,
    traumaRequired: triageResult.requiresTraumaCenter,
    requiredSpecialty: triageResult.specialtyNeeded,
    minimumERCapacity: triageResult.minFreeErCapacity,
  };
}

/**
 * Factory creating the default demonstration patient scenario (Section 32):
 * - Location in Bhopal demo region (MP Nagar Zone-1)
 * - Emergency Required: true
 * - ICU Required: true
 * - Required Specialty: "neurology"
 */
export function createDemoEmergencyRequest(): {
  intake: PatientIntake;
  triage: TriageResult;
  request: DestinationRequest;
} {
  const patientLocation: LatLng = {
    latitude: 23.2332,
    longitude: 77.43, // MP Nagar Zone-1, Bhopal
  };

  const intake: PatientIntake = {
    patient_name: "John Doe",
    age: 62,
    sex: "male",
    main_complaint: "Acute onset hemiparesis and facial drooping; suspected stroke",
    symptoms: ["Weakness", "Facial droop", "Slurred speech"],
    duration: "30 minutes",
    onset: "sudden",
    associated_symptoms: [],
    medical_history: ["Hypertension"],
    current_medications: [],
    allergies: [],
    additional_information: [],
    summary: "Patient presents with sudden onset hemiparesis and facial drooping.",
    caseId: "CASE-MP-2026-089",
    callerRole: "ASHA",
    chiefComplaint: "Acute onset hemiparesis and facial drooping; suspected stroke",
    vitalSigns: {
      heartRate: 104,
      systolicBP: 178,
      diastolicBP: 102,
      oxygenSaturation: 94,
      gcs: 12,
    },
    suspectedCondition: "STROKE",
    location: patientLocation,
    locationDescription: "Near Jyoti Cinema, MP Nagar Zone-1, Bhopal",
    reportedAt: new Date().toISOString(),
  };

  const triage: TriageResult = {
    triageLevel: "IMMEDIATE_RED",
    requiresEmergencyBay: true,
    requiresICU: true,
    requiresTraumaCenter: false,
    specialtyNeeded: "neurology",
    minFreeErCapacity: 2,
  };

  const request = createDestinationRequest(intake, triage, null);

  return { intake, triage, request };
}
