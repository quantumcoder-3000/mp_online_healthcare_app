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
    is_emergency: { type: "boolean", description: "Set to true if the symptoms or request indicate a severe medical emergency requiring an immediate ambulance (e.g. stroke, heart attack, trauma, or user explicitly asking for ambulance)." },
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
    "is_emergency",
  ],
};
