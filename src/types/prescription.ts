export interface RawMedication {
  id: string;
  name: string | null;
  strength: string | null;
  dose: string | null;
  frequency: string | null;
  duration: string | null;
  route: string | null;
  instructions: string | null;
  confidence: number;
  needsVerification: boolean;
  sourceText: string;
}

export interface DiagnosticTest {
  id: string;
  name: string;
  reason: string | null;
  needsVerification: boolean;
}

export interface ExtractedPrescription {
  prescriptionId: string;
  analyzedAt: string;
  doctorName: string | null;
  facilityName: string | null;
  prescriptionDate: string | null;
  notes: string | null;
  medications: RawMedication[];
  tests?: DiagnosticTest[];
  needsVerification: boolean;
}

export interface ConfirmedMedication {
  id: string;
  name: string;
  strength: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
}

export interface ConfirmedTest {
  id: string;
  name: string;
  reason: string;
  reportUploaded: boolean;
}

export type ReminderStatus = "UPCOMING" | "TAKEN" | "MISSED" | "SNOOZED";

export interface ScheduledDose {
  id: string;
  medicationId: string;
  timeString: string; // HH:mm format
  status: ReminderStatus;
  date: string; // YYYY-MM-DD
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  isOpen: boolean | null;
  mapsUrl: string | null;
  distanceMeters: number | null;
  etaMinutes: number | null;
  routePolyline?: string | null;
}
