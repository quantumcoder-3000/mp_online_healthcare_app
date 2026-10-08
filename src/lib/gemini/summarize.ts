import { GoogleGenAI } from "@google/genai";

import type { PatientIntake } from "@/types/patient-intake";
import { patientIntakeSchema } from "./schema";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isNullableInteger(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isInteger(value));
}

function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validatePatientIntake(value: unknown): PatientIntake {
  if (!isRecord(value)) {
    throw new Error("AI returned an invalid intake object.");
  }

  if (!isNullableString(value.patient_name)) {
    throw new Error("Invalid patient_name in AI output.");
  }
  if (!isNullableInteger(value.age) || (typeof value.age === "number" && (value.age < 0 || value.age > 130))) {
    throw new Error("Invalid age in AI output.");
  }
  if (!['male', 'female', 'other', 'unknown'].includes(String(value.sex))) {
    throw new Error("Invalid sex in AI output.");
  }
  if (!isNullableString(value.main_complaint)) {
    throw new Error("Invalid main_complaint in AI output.");
  }
  if (!stringArray(value.symptoms)) throw new Error("Invalid symptoms in AI output.");
  if (!isNullableString(value.duration)) throw new Error("Invalid duration in AI output.");
  if (!['sudden', 'gradual', 'unknown'].includes(String(value.onset))) throw new Error("Invalid onset in AI output.");
  if (!stringArray(value.associated_symptoms)) throw new Error("Invalid associated_symptoms in AI output.");
  if (!stringArray(value.medical_history)) throw new Error("Invalid medical_history in AI output.");
  if (!stringArray(value.current_medications)) throw new Error("Invalid current_medications in AI output.");
  if (!stringArray(value.allergies)) throw new Error("Invalid allergies in AI output.");
  if (!stringArray(value.additional_information)) throw new Error("Invalid additional_information in AI output.");
  if (typeof value.summary !== "string") throw new Error("Invalid summary in AI output.");

  return {
    patient_name: value.patient_name,
    age: value.age,
    sex: value.sex as PatientIntake["sex"],
    main_complaint: value.main_complaint,
    symptoms: value.symptoms,
    duration: value.duration,
    onset: value.onset as PatientIntake["onset"],
    associated_symptoms: value.associated_symptoms,
    medical_history: value.medical_history,
    current_medications: value.current_medications,
    allergies: value.allergies,
    additional_information: value.additional_information,
    summary: value.summary,
    
  };
}

export async function summarizeTranscript(transcript: string): Promise<PatientIntake> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) { console.warn("GEMINI_API_KEY is not configured on the server. AI features may fail."); }

  const model = process.env.GEMINI_SUMMARY_MODEL || "gemini-3.8-flash";
  const ai = new GoogleGenAI({ apiKey: apiKey || "dummy" });

  const prompt = `
You are CareFlow's patient-intake structuring assistant.

Convert the following conversation transcript into structured patient-intake information.

Rules:
- Extract ONLY facts stated or confirmed by the caller.
- Do not diagnose.
- Do not infer a disease.
- Do not recommend treatment.
- Do not prescribe medication.
- Do not invent vital signs.
- Do not invent medical history, age, sex, allergies, medicines, symptoms, onset, or duration.
- Missing information must be null, unknown, or an empty array.
- Preserve uncertainty exactly where it matters.
- The summary must be factual and concise for later review by a healthcare professional.
- Do not add any diagnosis field.

Transcript:
---
${transcript.slice(0, 30000)}
---
`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: patientIntakeSchema as any,
      temperature: 0.1,
    }
  });

  const outputText = response.text;
  if (!outputText) {
    throw new Error("Gemini returned no structured output.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new Error("Gemini returned malformed JSON.");
  }

  return validatePatientIntake(parsed);
}

