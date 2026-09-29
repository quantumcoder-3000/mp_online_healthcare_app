import { PatientIntake } from "../../types/patient-intake";

export function validatePatientIntake(data: any): PatientIntake {
  if (typeof data !== "object" || data === null) {
    throw new Error("Intake data must be an object");
  }

  const age = data.age === null ? null : parseInt(data.age, 10);
  if (age !== null && (isNaN(age) || age < 0 || age > 130)) {
    throw new Error("Invalid age");
  }

  const validSex = ["male", "female", "other", "unknown"];
  const sex = validSex.includes(data.sex) ? data.sex : "unknown";

  const validOnset = ["sudden", "gradual", "unknown"];
  const onset = validOnset.includes(data.onset) ? data.onset : "unknown";

  return {
    patient_name: typeof data.patient_name === "string" ? data.patient_name : null,
    age,
    sex,
    main_complaint: typeof data.main_complaint === "string" ? data.main_complaint : null,
    symptoms: Array.isArray(data.symptoms) ? data.symptoms.map(String) : [],
    duration: typeof data.duration === "string" ? data.duration : null,
    onset,
    associated_symptoms: Array.isArray(data.associated_symptoms) ? data.associated_symptoms.map(String) : [],
    medical_history: Array.isArray(data.medical_history) ? data.medical_history.map(String) : [],
    current_medications: Array.isArray(data.current_medications) ? data.current_medications.map(String) : [],
    allergies: Array.isArray(data.allergies) ? data.allergies.map(String) : [],
    additional_information: Array.isArray(data.additional_information) ? data.additional_information.map(String) : [],
    summary: typeof data.summary === "string" ? data.summary : "No summary provided.",
  };
}
