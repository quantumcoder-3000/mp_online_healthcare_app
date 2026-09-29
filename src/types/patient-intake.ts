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
}
