import { LatLng } from "../../types/destination";
import {
  RouteMatrixElement,
  calculateFallbackRoute,
  formatDurationSeconds,
} from "./provider";

interface GoogleMatrixElement {
  originIndex?: number;
  destinationIndex?: number;
  status?: {
    code?: number;
    message?: string;
  };
  condition?: "ROUTE_EXISTS" | "ROUTE_NOT_FOUND";
  distanceMeters?: number;
  duration?: string; // e.g. "540s"
}

/**
 * Computes a travel-time matrix using Google's ComputeRouteMatrix API.
 * Minimizes API billing by batching all candidate hospitals in a single request.
 */
export async function calculateRouteMatrix(
  origins: LatLng[],
  destinations: LatLng[],
  options: { routingPreference?: "TRAFFIC_AWARE" | "TRAFFIC_AWARE_OPTIMAL" } = {}
): Promise<RouteMatrixElement[]> {
  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;

  // If no server API key is provided, compute fallback matrix
  if (!apiKey || apiKey.trim() === "") {
    return generateFallbackMatrix(origins, destinations);
  }

  const endpoint = "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix";
  const fieldMask = "originIndex,destinationIndex,duration,distanceMeters,status,condition";

  const requestBody = {
    origins: origins.map((origin) => ({
      waypoint: {
        location: {
          latLng: {
            latitude: origin.latitude,
            longitude: origin.longitude,
          },
        },
      },
    })),
    destinations: destinations.map((dest) => ({
      waypoint: {
        location: {
          latLng: {
            latitude: dest.latitude,
            longitude: dest.longitude,
          },
        },
      },
    })),
    travelMode: "DRIVE",
    routingPreference: options.routingPreference || "TRAFFIC_AWARE",
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
      console.warn(`[CareFlow Maps] RouteMatrix returned status ${response.status}. Using fallback matrix.`);
      return generateFallbackMatrix(origins, destinations);
    }

    const data = (await response.json()) as GoogleMatrixElement[];

    if (!Array.isArray(data) || data.length === 0) {
      return generateFallbackMatrix(origins, destinations);
    }

    return data.map((item, index) => {
      const origIdx = item.originIndex ?? 0;
      const destIdx = item.destinationIndex ?? index;
      const durationSec = item.duration
        ? parseInt(item.duration.replace("s", ""), 10) || 300
        : 300;
      const distMeters = item.distanceMeters ?? 1000;

      return {
        originIndex: origIdx,
        destinationIndex: destIdx,
        distanceMeters: distMeters,
        durationSeconds: durationSec,
        durationText: formatDurationSeconds(durationSec),
        status: item.condition === "ROUTE_NOT_FOUND" ? "ROUTE_NOT_FOUND" : "OK",
        isLiveTraffic: true,
        source: "GOOGLE_ROUTES_API",
      };
    });
  } catch (error) {
    console.error("[CareFlow Maps] RouteMatrix API error:", error);
    return generateFallbackMatrix(origins, destinations);
  }
}

function generateFallbackMatrix(origins: LatLng[], destinations: LatLng[]): RouteMatrixElement[] {
  const matrix: RouteMatrixElement[] = [];

  for (let o = 0; o < origins.length; o++) {
    for (let d = 0; d < destinations.length; d++) {
      const route = calculateFallbackRoute(origins[o], destinations[d]);
      matrix.push({
        originIndex: o,
        destinationIndex: d,
        distanceMeters: route.distanceMeters,
        durationSeconds: route.durationSeconds,
        durationText: route.durationText,
        status: "FALLBACK",
        isLiveTraffic: false,
        source: "FALLBACK_ESTIMATE",
      });
    }
  }

  return matrix;
}
