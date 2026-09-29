export type AmbulanceStatus =
  | "AVAILABLE"
  | "ASSIGNED"
  | "EN_ROUTE_TO_PATIENT"
  | "PATIENT_ONBOARD"
  | "EN_ROUTE_TO_HOSPITAL"
  | "ARRIVED";

export type AmbulanceEquipment = "ALS" | "BLS" | "PATIENT_TRANSPORT" | "NEONATAL_ICU";

export interface Ambulance {
  id: string;
  vehicle_number: string;
  latitude: number;
  longitude: number;
  status: AmbulanceStatus;
  equipment: AmbulanceEquipment;
  crew_type: string;
  current_case_id: string | null;
  destination_hospital_id: string | null;
  speed_kmh?: number;
  heading?: number;
  last_updated?: string;
  data_source?: "SIMULATED_DEMO" | "LIVE_GPS";
}
