import { NextRequest, NextResponse } from "next/server";
import { calculateRoute } from "@/lib/maps/routes";
import { LatLng } from "@/types/destination";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination, routingPreference } = body as {
      origin: LatLng;
      destination: LatLng;
      routingPreference?: "TRAFFIC_AWARE" | "TRAFFIC_AWARE_OPTIMAL";
    };

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and Destination coordinates are required." },
        { status: 400 }
      );
    }

    const route = await calculateRoute(origin, destination, { routingPreference });
    return NextResponse.json(route);
  } catch (error) {
    console.error("[API /api/routes/route] Error calculating route:", error);
    return NextResponse.json(
      { error: "Failed to compute route. Live routing unavailable." },
      { status: 500 }
    );
  }
}
