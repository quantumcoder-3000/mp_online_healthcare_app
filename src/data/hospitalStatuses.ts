import { HospitalStatus } from "../types/hospital";

/**
 * Initial simulated operational state for hospitals in the demonstration corridor.
 * Marked explicitly as SIMULATED_DEMO to comply with transparency requirements.
 */
export const INITIAL_HOSPITAL_STATUSES: Record<string, HospitalStatus> = {
  // Hospital A scenario: Close to MP Nagar, but ICU is currently FULL (0 available)
  "hosp-jp-district": {
    hospital_id: "hosp-jp-district",
    icu_available: 0,
    er_occupancy: 22,
    er_capacity: 25,
    current_load: 88,
    predicted_load: 92,
    specialists_available: ["emergency_medicine", "general_medicine", "pediatrics"],
    updated_at: new Date().toISOString(),
    data_source: "SIMULATED_DEMO",
  },

  // Hospital B scenario: Prime candidate with ICU available, Neurology available, moderate load
  "hosp-bansal-super": {
    hospital_id: "hosp-bansal-super",
    icu_available: 6,
    er_occupancy: 28,
    er_capacity: 45,
    current_load: 54,
    predicted_load: 58,
    specialists_available: [
      "neurology",
      "neurosurgery",
      "cardiology",
      "critical_care",
      "nephrology",
    ],
    updated_at: new Date().toISOString(),
    data_source: "SIMULATED_DEMO",
  },

  // Hospital C scenario: Rapid ETA, ICU available, but NEUROLOGY is UNAVAILABLE
  "hosp-kasturba-bhel": {
    hospital_id: "hosp-kasturba-bhel",
    icu_available: 4,
    er_occupancy: 18,
    er_capacity: 35,
    current_load: 51,
    predicted_load: 53,
    specialists_available: ["cardiology", "orthopedics", "general_surgery"],
    updated_at: new Date().toISOString(),
    data_source: "SIMULATED_DEMO",
  },

  // Hospital D scenario: Tertiary with high capabilities, but severe surge load
  "hosp-hamidia-gmc": {
    hospital_id: "hosp-hamidia-gmc",
    icu_available: 3,
    er_occupancy: 84,
    er_capacity: 90,
    current_load: 91,
    predicted_load: 96,
    specialists_available: ["trauma", "orthopedics", "general_surgery", "cardiology"],
    updated_at: new Date().toISOString(),
    data_source: "SIMULATED_DEMO",
  },

  // Hospital E scenario: Apex tertiary facility, full capabilities, stable load
  "hosp-aiims-bhopal": {
    hospital_id: "hosp-aiims-bhopal",
    icu_available: 12,
    er_occupancy: 52,
    er_capacity: 80,
    current_load: 65,
    predicted_load: 68,
    specialists_available: [
      "neurology",
      "neurosurgery",
      "cardiology",
      "trauma",
      "critical_care",
      "orthopedics",
    ],
    updated_at: new Date().toISOString(),
    data_source: "SIMULATED_DEMO",
  },

  "hosp-narmada-trauma": {
    hospital_id: "hosp-narmada-trauma",
    icu_available: 2,
    er_occupancy: 19,
    er_capacity: 25,
    current_load: 76,
    predicted_load: 80,
    specialists_available: ["trauma", "orthopedics", "neurosurgery", "critical_care"],
    updated_at: new Date().toISOString(),
    data_source: "SIMULATED_DEMO",
  },

  "hosp-care-chl": {
    hospital_id: "hosp-care-chl",
    icu_available: 5,
    er_occupancy: 22,
    er_capacity: 40,
    current_load: 55,
    predicted_load: 59,
    specialists_available: ["neurology", "cardiology", "critical_care"],
    updated_at: new Date().toISOString(),
    data_source: "SIMULATED_DEMO",
  },

  "hosp-chirayu-med": {
    hospital_id: "hosp-chirayu-med",
    icu_available: 9,
    er_occupancy: 38,
    er_capacity: 60,
    current_load: 63,
    predicted_load: 65,
    specialists_available: ["neurology", "cardiology", "trauma", "critical_care"],
    updated_at: new Date().toISOString(),
    data_source: "SIMULATED_DEMO",
  },

  "hosp-bmhrc-karond": {
    hospital_id: "hosp-bmhrc-karond",
    icu_available: 7,
    er_occupancy: 29,
    er_capacity: 50,
    current_load: 58,
    predicted_load: 62,
    specialists_available: ["pulmonology", "cardiology", "neurology", "critical_care"],
    updated_at: new Date().toISOString(),
    data_source: "SIMULATED_DEMO",
  },

  "hosp-peoples-pcms": {
    hospital_id: "hosp-peoples-pcms",
    icu_available: 6,
    er_occupancy: 42,
    er_capacity: 65,
    current_load: 64,
    predicted_load: 69,
    specialists_available: ["trauma", "cardiology", "critical_care"],
    updated_at: new Date().toISOString(),
    data_source: "SIMULATED_DEMO",
  },
};
