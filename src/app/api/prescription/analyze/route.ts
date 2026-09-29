import { NextRequest, NextResponse } from "next/server";
import { analyzePrescription } from "@/lib/gemini/vision";
import { ExtractedPrescription, RawMedication } from "@/types/prescription";

// Demo fallback data
const DEMO_PRESCRIPTION: ExtractedPrescription = {
  prescriptionId: "RX-DEMO-2026-001",
  analyzedAt: new Date().toISOString(),
  doctorName: "Dr. A. Sharma",
  facilityName: "CareFlow Demo Hospital",
  prescriptionDate: new Date().toISOString().split("T")[0],
  notes: "Follow up in 5 days.",
  needsVerification: true, // Force user to verify demo
  medications: [
    {
      id: "MED-DEMO-1",
      name: "Amoxicillin",
      strength: "500 mg",
      dose: "1 capsule",
      frequency: "3 times daily",
      duration: "5 days",
      route: "Oral",
      instructions: "After food",
      confidence: 0.95,
      needsVerification: false,
      sourceText: "Amoxicillin 500mg 1 cap TID pc x 5d",
    },
    {
      id: "MED-DEMO-2",
      name: null, // Simulate unclear handwriting
      strength: null,
      dose: "1 tablet",
      frequency: "Once daily",
      duration: "5 days",
      route: "Oral",
      instructions: "At night",
      confidence: 0.3,
      needsVerification: true,
      sourceText: "unclear scribble for antihistamine",
    },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mimeType, base64Data, mode } = body;

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (mode === "demo") {
      return NextResponse.json({ success: true, data: DEMO_PRESCRIPTION }, { status: 200 });
    }

    if (!mimeType || !base64Data) {
      return NextResponse.json(
        { success: false, error: "Missing image data or mimeType" },
        { status: 400 }
      );
    }

    const result = await analyzePrescription(mimeType, base64Data);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: unknown) {
    console.error("Prescription analysis error:", error);
    
    // Fallback for 429/quota errors
    if (error instanceof Error && (error.message?.includes("429") || error.message?.includes("quota"))) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Prescription AI analysis is temporarily unavailable (quota exceeded).",
          code: "QUOTA_EXCEEDED"
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Unable to analyze prescription." },
      { status: 500 }
    );
  }
}
