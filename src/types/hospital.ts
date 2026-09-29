export type HospitalType =
  | "GOVERNMENT_TERTIARY"
  | "DISTRICT_HOSPITAL"
  | "PRIVATE_MULTISPECIALTY"
  | "COMMUNITY_HEALTH_CENTER"
  | "SPECIALTY_INSTITUTE";

/**
 * Static baseline data for a healthcare facility.
 * Rapidly fluctuating operational metrics (ICU available, ER occupancy)
 * belong strictly in HospitalStatus.
 */
export interface Hospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  hospital_type: HospitalType;
  emergency_capable: boolean;
  trauma_capable: boolean;
  icu_total: number;
  specialties: string[];
  source: string; // e.g. "data.gov.in static facility data" or "DEMO_DATA"
}

/**
 * Dynamic operational state of a hospital.
 * Clearly tagged with data_source to guarantee transparency.
 */
export interface HospitalStatus {
  hospital_id: string;
  icu_available: number;
  er_occupancy: number; // current patient count in ER
  er_capacity: number; // max ER bays
  current_load: number; // 0 to 100 percentage
  predicted_load: number; // 0 to 100 percentage (e.g. 30-min outlook)
  specialists_available: string[];
  updated_at: string; // ISO timestamp
  data_source: "SIMULATED_DEMO" | "LIVE_CONNECTED";
}

/**
 * Combined view for UI rendering and recommendation scoring.
 */
export interface EnrichedHospital extends Hospital {
  status: HospitalStatus;
}
