/**
 * Transparent demo model for estimating hospital 30-minute surge load.
 * NOTE: Prototype estimate for operational simulation. Not clinically or statistically validated.
 */
export interface LoadPredictionParams {
  currentLoad: number; // 0 - 100 percentage
  incomingEmergencyCases?: number; // expected inbound ambulances/walk-ins
  erOccupancyRate?: number; // ratio of er_occupancy / er_capacity (0 - 1)
  timeWindowMinutes?: number; // default 30 minutes
}

export interface LoadPredictionResult {
  predictedLoad: number; // 0 - 100 percentage
  label: string; // "30-minute predicted load (Prototype estimate)"
  trend: "RISING" | "STABLE" | "SUBSIDING";
  explanation: string;
}

export function calculatePredictedLoad(params: LoadPredictionParams): LoadPredictionResult {
  const current = Math.min(100, Math.max(0, params.currentLoad));
  const incoming = params.incomingEmergencyCases ?? 2;
  const occupancyRatio = params.erOccupancyRate ?? 0.7;

  // Transparent linear simulation:
  // Inflow contribution: +2.5% per inbound emergency
  // Discharge / transfer rate: ~1.5% per 30 minutes baseline
  // Congestion multiplier: higher ER occupancy slows down patient disposition
  const inflowImpact = incoming * 2.5 * (1 + occupancyRatio * 0.5);
  const dischargeRecovery = 3.0 * (1 - occupancyRatio * 0.3);

  const rawPredicted = current + inflowImpact - dischargeRecovery;
  const clamped = Math.round(Math.min(100, Math.max(0, rawPredicted)));

  let trend: "RISING" | "STABLE" | "SUBSIDING" = "STABLE";
  if (clamped > current + 2) trend = "RISING";
  else if (clamped < current - 2) trend = "SUBSIDING";

  return {
    predictedLoad: clamped,
    label: "30-minute predicted load (Prototype estimate)",
    trend,
    explanation: `Calculated from current load (${current}%), inbound emergency rate (+${inflowImpact.toFixed(
      1
    )}%), and estimated bed disposition rate (-${dischargeRecovery.toFixed(1)}%).`,
  };
}
