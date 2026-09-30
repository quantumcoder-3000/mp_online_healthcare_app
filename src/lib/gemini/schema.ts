export const patientIntakeSchema = {
  type: "object",
  properties: {
    patient_name: { type: ["string", "null"] },
    age: { type: ["integer", "null"] },
    sex: {
      type: "string",
      enum: ["male", "female", "other", "unknown"],
    },
    main_complaint: { type: ["string", "null"] },
    symptoms: {
      type: "array",
      items: { type: "string" },
    },
    duration: { type: ["string", "null"] },
    onset: {
      type: "string",
      enum: ["sudden", "gradual", "unknown"],
    },
    associated_symptoms: {
      type: "array",
      items: { type: "string" },
    },
    medical_history: {
      type: "array",
      items: { type: "string" },
    },
    current_medications: {
      type: "array",
      items: { type: "string" },
    },
    allergies: {
      type: "array",
      items: { type: "string" },
    },
    additional_information: {
      type: "array",
      items: { type: "string" },
    },
    summary: { type: "string" },
    triage_level: { type: "string", enum: ["potential_emergency", "needs_evaluation", "lower_risk"], description: "Safety-first screening: Evaluate predefined clinical red flags. Output 'potential_emergency' for potential severe conditions triggering ambulance, 'needs_evaluation' for prompt doctor consultation, and 'lower_risk' for non-emergency." },
  },
  required: [
    "patient_name",
    "age",
    "sex",
    "main_complaint",
    "symptoms",
    "duration",
    "onset",
    "associated_symptoms",
    "medical_history",
    "current_medications",
    "allergies",
    "additional_information",
    "summary",
    "triage_level",
  ],
};
