export interface PatientIntake {
  patient_name: string | null;
  age: number | null;
  sex: "male" | "female" | "other" | "unknown";
  main_complaint: string | null;
  symptoms: string[];
  duration: string | null;
  onset: "sudden" | "gradual" | "unknown";
  associated_symptoms: string[];
  medical_history: string[];
  current_medications: string[];
  allergies: string[];
  additional_information: string[];
  summary: string;
}
