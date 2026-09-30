export type PatientSex = "male" | "female" | "other" | "unknown";
export type SymptomOnset = "sudden" | "gradual" | "unknown";

export interface PatientIntake {
  patient_name: string | null;
  age: number | null;
  sex: PatientSex;
  main_complaint: string | null;
  symptoms: string[];
  duration: string | null;
  onset: SymptomOnset;
  associated_symptoms: string[];
  medical_history: string[];
  current_medications: string[];
  allergies: string[];
  additional_information: string[];
  summary: string;
  is_emergency: boolean;

  // Added for ambulance module integration
  caseId?: string;
  callerRole?: "ASHA" | "FAMILY" | "BYSTANDER" | "FIRST_RESPONDER";
  chiefComplaint?: string;
  vitalSigns?: {
    heartRate?: number;
    systolicBP?: number;
    diastolicBP?: number;
    oxygenSaturation?: number;
    gcs?: number; // Glasgow Coma Scale
  };
  suspectedCondition?: "STROKE" | "CARDIAC_ARREST" | "TRAUMA" | "RESPIRATORY" | "MATERNAL";
  location?: { latitude: number; longitude: number };
  locationDescription?: string;
  reportedAt?: string;
}
