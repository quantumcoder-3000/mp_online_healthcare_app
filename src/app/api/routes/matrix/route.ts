import { NextRequest, NextResponse } from "next/server";
import { calculateRouteMatrix } from "@/lib/maps/routeMatrix";
import { LatLng } from "@/types/destination";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origins, destinations, routingPreference } = body as {
      origins: LatLng[];
      destinations: LatLng[];
      routingPreference?: "TRAFFIC_AWARE" | "TRAFFIC_AWARE_OPTIMAL";
    };

    if (!origins || !destinations || origins.length === 0 || destinations.length === 0) {
      return NextResponse.json(
        { error: "Origins and Destinations arrays must be non-empty." },
        { status: 400 }
      );
    }

    const matrix = await calculateRouteMatrix(origins, destinations, { routingPreference });
    return NextResponse.json(matrix);
  } catch (error) {
    console.error("[API /api/routes/matrix] Error calculating matrix:", error);
    return NextResponse.json(
      { error: "Failed to compute route matrix. Live matrix unavailable." },
      { status: 500 }
    );
  }
}
