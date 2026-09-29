import { GoogleGenAI, Modality } from "@google/genai";
import { NextResponse } from "next/server";

import { CAREFLOW_LIVE_SYSTEM_INSTRUCTION } from "@/lib/gemini/live-prompt";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const model = process.env.GEMINI_LIVE_MODEL || "gemini-3.8-live";
  const ai = new GoogleGenAI({ apiKey });

  try {
    const expireTime = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime,
        liveConnectConstraints: {
          model,
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: {
              parts: [{ text: CAREFLOW_LIVE_SYSTEM_INSTRUCTION }],
            },
          },
        },
      },
    });

    if (!token.name) {
      return NextResponse.json(
        { success: false, error: "Gemini did not return an ephemeral token." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { success: true, token: token.name, model },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Gemini Live token error", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, error: "Unable to create a Gemini Live session." },
      { status: 502 },
    );
  }
}
