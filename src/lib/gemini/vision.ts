import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExtractedPrescription, RawMedication } from "../../types/prescription";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) { console.warn("GEMINI_API_KEY is not configured on the server. AI features may fail."); }

const ai = new GoogleGenAI({ apiKey: apiKey || "dummy" });

const prescriptionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    doctorName: { type: Type.STRING, nullable: true },
    facilityName: { type: Type.STRING, nullable: true },
    prescriptionDate: { type: Type.STRING, nullable: true },
    notes: { type: Type.STRING, nullable: true },
    medications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, nullable: true },
          strength: { type: Type.STRING, nullable: true },
          dose: { type: Type.STRING, nullable: true },
          frequency: { type: Type.STRING, nullable: true },
          duration: { type: Type.STRING, nullable: true },
          route: { type: Type.STRING, nullable: true },
          instructions: { type: Type.STRING, nullable: true },
          confidence: { type: Type.NUMBER },
          needsVerification: { type: Type.BOOLEAN },
          sourceText: { type: Type.STRING },
        },
        required: ["confidence", "needsVerification", "sourceText"],
      },
    },
    tests: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          reason: { type: Type.STRING, nullable: true },
          needsVerification: { type: Type.BOOLEAN },
        },
        required: ["name", "needsVerification"],
      },
    },
    needsVerification: { type: Type.BOOLEAN },
  },
  required: ["medications", "needsVerification"],
};

export async function analyzePrescription(
  mimeType: string,
  base64Data: string
): Promise<ExtractedPrescription> {
  const model = process.env.GEMINI_VISION_MODEL || "gemini-2.5-pro";

  console.log("VISION API KEY Check: ", process.env.GEMINI_API_KEY ? "EXISTS" : "UNDEFINED");
  const prompt = `
You are CareFlow's clinical document reading assistant.
Extract the prescription details from this image/PDF exactly as written.

CRITICAL RULES:
1. ONLY extract information actually visible in the document.
2. DO NOT invent, guess, or infer missing information (e.g., if strength is missing, leave it null).
3. For unclear handwriting, DO NOT guess a medication name. Instead:
   - Set 'name' (or 'strength', 'dose', etc.) to null.
   - Set 'confidence' low (e.g., 0.2).
   - Set 'needsVerification' to true.
   - Put exactly what it looks like or "unclear handwriting" in 'sourceText'.
4. Do not diagnose, modify the treatment, or invent instructions.
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: prescriptionSchema,
        temperature: 0.1,
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("Gemini returned empty text.");
    }

    const parsed = JSON.parse(outputText);
    
    const result: ExtractedPrescription = {
      prescriptionId: `RX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      analyzedAt: new Date().toISOString(),
      doctorName: parsed.doctorName || null,
      facilityName: parsed.facilityName || null,
      prescriptionDate: parsed.prescriptionDate || null,
      notes: parsed.notes || null,
      needsVerification: parsed.needsVerification ?? true,
      tests: (parsed.tests || []).map((t: any) => ({
        id: `TEST-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        name: typeof t.name === 'string' ? t.name : "Unknown Test",
        reason: typeof t.reason === 'string' ? t.reason : null,
        needsVerification: typeof t.needsVerification === 'boolean' ? t.needsVerification : true
      })),
      medications: (parsed.medications || []).map((m: any) => ({
        id: `MED-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        name: typeof m.name === 'string' ? m.name : null,
        strength: typeof m.strength === 'string' ? m.strength : null,
        dose: typeof m.dose === 'string' ? m.dose : null,
        frequency: typeof m.frequency === 'string' ? m.frequency : null,
        duration: typeof m.duration === 'string' ? m.duration : null,
        route: typeof m.route === 'string' ? m.route : null,
        instructions: typeof m.instructions === 'string' ? m.instructions : null,
        confidence: typeof m.confidence === 'number' ? m.confidence : 1.0,
        needsVerification: typeof m.needsVerification === 'boolean' ? m.needsVerification : ((typeof m.confidence === 'number' ? m.confidence : 1.0) < 0.8),
        sourceText: typeof m.sourceText === 'string' ? m.sourceText : "Unknown",
      })),
    };

    return result;
  } catch (error) {
    console.error("Gemini Vision API error:", error);
    throw error;
  }
}

