import { LatLng } from "../../types/destination";
import {
  RouteResult,
  calculateFallbackRoute,
  formatDurationSeconds,
} from "./provider";

interface GoogleRoutesApiResponse {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string; // e.g., "640s"
    polyline?: {
      encodedPolyline?: string;
    };
  }>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

/**
 * Executes a traffic-aware route calculation using the Google Routes API (Directions v2).
 * Strictly server-side: uses GOOGLE_MAPS_SERVER_API_KEY.
 */
export async function calculateRoute(
  origin: LatLng,
  destination: LatLng,
  options: { routingPreference?: "TRAFFIC_AWARE" | "TRAFFIC_AWARE_OPTIMAL" } = {}
): Promise<RouteResult> {
  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    // Graceful fallback for demo or when API key has not been configured
    return calculateFallbackRoute(origin, destination);
  }

  const endpoint = "https://routes.googleapis.com/directions/v2:computeRoutes";
  const fieldMask = "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline";

  const requestBody = {
    origin: {
      location: {
        latLng: {
          latitude: origin.latitude,
          longitude: origin.longitude,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: destination.latitude,
          longitude: destination.longitude,
        },
      },
    },
    travelMode: "DRIVE",
    routingPreference: options.routingPreference || "TRAFFIC_AWARE",
    departureTime: new Date().toISOString(),
    computeAlternativeRoutes: false,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.warn(`[CareFlow Maps] Routes API returned status ${response.status}. Falling back to estimate.`);
      return calculateFallbackRoute(origin, destination);
    }

    const data = (await response.json()) as GoogleRoutesApiResponse;

    if (!data.routes || data.routes.length === 0) {
      return calculateFallbackRoute(origin, destination);
    }

    const primaryRoute = data.routes[0];
    const durationSeconds = primaryRoute.duration
      ? parseInt(primaryRoute.duration.replace("s", ""), 10) || 300
      : 300;
    const distanceMeters = primaryRoute.distanceMeters ?? 1000;

    return {
      distanceMeters,
      durationSeconds,
      durationText: formatDurationSeconds(durationSeconds),
      polyline: primaryRoute.polyline?.encodedPolyline ?? null,
      status: "OK",
      isLiveTraffic: true,
      source: "GOOGLE_ROUTES_API",
    };
  } catch (error) {
    console.error("[CareFlow Maps] Routes API network or parse error:", error);
    return calculateFallbackRoute(origin, destination);
  }
}
