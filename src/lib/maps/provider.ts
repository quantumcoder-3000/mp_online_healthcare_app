import { LatLng } from "../../types/destination";

export interface RouteResult {
  distanceMeters: number;
  durationSeconds: number;
  durationText: string;
  polyline: string | null;
  status: "OK" | "NOT_FOUND" | "FALLBACK";
  isLiveTraffic: boolean;
  source: "GOOGLE_ROUTES_API" | "FALLBACK_ESTIMATE";
}

export interface RouteMatrixElement {
  originIndex: number;
  destinationIndex: number;
  distanceMeters: number;
  durationSeconds: number;
  durationText: string;
  status: "OK" | "ROUTE_NOT_FOUND" | "FALLBACK";
  isLiveTraffic: boolean;
  source: "GOOGLE_ROUTES_API" | "FALLBACK_ESTIMATE";
}

export interface RoutingProvider {
  calculateRoute(
    origin: LatLng,
    destination: LatLng,
    options?: { routingPreference?: "TRAFFIC_AWARE" | "TRAFFIC_AWARE_OPTIMAL" }
  ): Promise<RouteResult>;

  calculateRouteMatrix(
    origins: LatLng[],
    destinations: LatLng[],
    options?: { routingPreference?: "TRAFFIC_AWARE" | "TRAFFIC_AWARE_OPTIMAL" }
  ): Promise<RouteMatrixElement[]>;
}

/**
 * Utility to format seconds to human-readable string.
 */
export function formatDurationSeconds(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 1) return "< 1 min";
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hrs} hr ${remainingMins} min`;
}

/**
 * Fallback Haversine-based calculation with traffic & urban penalty factor
 * used when Google Routes API is unreachable or during offline development.
 * Never silently presented as live traffic.
 */
export function calculateFallbackRoute(origin: LatLng, destination: LatLng): RouteResult {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (origin.latitude * Math.PI) / 180;
  const phi2 = (destination.latitude * Math.PI) / 180;
  const deltaPhi = ((destination.latitude - origin.latitude) * Math.PI) / 180;
  const deltaLambda = ((destination.longitude - origin.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const crowDistanceMeters = R * c;

  // Urban road winding factor (~1.35x crow-flies distance in Indian cities)
  const roadDistanceMeters = Math.round(crowDistanceMeters * 1.35);

  // Average emergency vehicle urban speed ~32 km/h (8.88 m/s) with traffic
  const estimatedSeconds = Math.max(120, Math.round(roadDistanceMeters / 8.88));

  return {
    distanceMeters: roadDistanceMeters,
    durationSeconds: estimatedSeconds,
    durationText: formatDurationSeconds(estimatedSeconds),
    polyline: null,
    status: "FALLBACK",
    isLiveTraffic: false,
    source: "FALLBACK_ESTIMATE",
  };
}
