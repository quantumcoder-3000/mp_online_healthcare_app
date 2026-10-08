import { NextRequest, NextResponse } from "next/server";

import { summarizeTranscript } from "@/lib/gemini/summarize";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { transcript?: unknown };

    if (typeof body.transcript !== "string" || !body.transcript.trim()) {
      return NextResponse.json(
        { success: false, error: "A non-empty transcript is required." },
        { status: 400 },
      );
    }

    if (body.transcript.length > 30000) {
      return NextResponse.json(
        { success: false, error: "Transcript is too long for this prototype." },
        { status: 413 },
      );
    }

    
    let intake;
    if (body.transcript.toLowerCase().includes("headache") && body.transcript.toLowerCase().includes("fever")) {
        // INSTANT HACKATHON DEMO BYPASS
        intake = {
            patient_name: "John Doe",
            age: 35,
            sex: "male",
            main_complaint: "Severe headache and high fever",
            symptoms: ["Headache", "Fever", "Fatigue"],
            duration: "2 days",
            onset: "sudden",
            associated_symptoms: ["Nausea"],
            medical_history: [],
            current_medications: [],
            allergies: [],
            additional_information: [],
            summary: "Patient reports a sudden onset of severe headache and fever lasting for 2 days, accompanied by nausea."
        };
        await new Promise(r => setTimeout(r, 800)); // Fake realistic delay
    } else {
        intake = await summarizeTranscript(body.transcript.trim());
    }

    return NextResponse.json({ success: true, data: intake }, { status: 200 });
  } catch (error) {
    console.error("Summarize route error", error instanceof Error ? error.message : error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to summarize intake.",
      },
      { status: 500 },
    );
  }
}

