import type { PatientIntake } from "@/types/patient-intake";

export type TriageCategory = "RED" | "YELLOW" | "GREEN";

/**
 * Deterministic Red-Flag Engine based on MoHFW / DGHS India guidelines.
 * This separates the generative AI (which extracts text) from the actual medical triage logic.
 */
export function evaluateRedFlags(intake: PatientIntake): TriageCategory {
  // 1. Define strict clinical red flag keywords (Airway, Breathing, Circulation, Disability)
  const redFlags = [
    "chest pain", "chest tightness", "heart attack", "myocardial infarction",
    "difficulty breathing", "shortness of breath", "choking", "gasping",
    "unconscious", "fainted", "passed out", "unresponsive", "coma",
    "confusion", "altered mental status", "delirium", "seizure", "convulsion",
    "stroke", "paralysis", "face drooping", "speech slurred",
    "severe bleeding", "hemorrhage", "gunshot", "stab", "amputation", "severe trauma",
    "suicide", "overdose", "poison"
  ];

  const yellowFlags = [
    "fever", "high temperature", "abdominal pain", "vomiting", "dizziness", 
    "moderate pain", "fracture", "broken bone", "burn", "dehydration", "headache"
  ];

  // 2. Normalize patient inputs for keyword matching
  const allText = [
    intake.main_complaint || "",
    ...(intake.symptoms || []),
    ...(intake.associated_symptoms || []),
    intake.additional_information?.join(" ") || ""
  ].join(" ").toLowerCase();

  // 3. Evaluate RED FLAGS (Immediate Emergency)
  for (const flag of redFlags) {
    if (allText.includes(flag)) {
      return "RED";
    }
  }

  // 4. Evaluate YELLOW FLAGS (Urgent Evaluation)
  for (const flag of yellowFlags) {
    if (allText.includes(flag)) {
      return "YELLOW";
    }
  }

  // 5. Default to GREEN (Lower-risk presentation)
  return "GREEN";
}