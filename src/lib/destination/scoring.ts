import { EnrichedHospital } from "../../types/hospital";
import { DestinationRequest } from "../../types/destination";

/**
 * Configurable scoring weights for destination optimization.
 * Centralized to prevent scattered magic numbers.
 */
export interface ScoringWeights {
  ETA_WEIGHT: number; // default: 40
  CAPACITY_WEIGHT: number; // default: 25
  PREDICTED_LOAD_WEIGHT: number; // default: 20
  DISTANCE_WEIGHT: number; // default: 15
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  ETA_WEIGHT: 40,
  CAPACITY_WEIGHT: 25,
  PREDICTED_LOAD_WEIGHT: 20,
  DISTANCE_WEIGHT: 15,
};

export interface ScoredHospitalEvaluation {
  hospital: EnrichedHospital;
  score: number; // Lower score indicates superior candidate (penalty-minimization model)
  etaMinutes: number;
  distanceMeters: number;
  reasons: string[];
  breakdown: {
    etaPenalty: number;
    capacityPenalty: number;
    predictedLoadPenalty: number;
    distancePenalty: number;
  };
}

/**
 * Deterministically scores an eligible hospital based on normalized travel time,
 * ICU availability, ER surge margin, and 30-minute predicted load.
 *
 * NOTE: Algorithmic heuristic for hackathon operational demo. Not clinically validated.
 */
export function scoreHospital(
  hospital: EnrichedHospital,
  etaMinutes: number,
  distanceMeters: number,
  request: DestinationRequest,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): ScoredHospitalEvaluation {
  const status = hospital.status;
  const reasons: string[] = [];

  // 1. ETA Component (0 to 1, capped at 45 minutes)
  const normalizedEta = Math.min(1, Math.max(0, etaMinutes / 45));
  const etaPenalty = normalizedEta * weights.ETA_WEIGHT;

  if (etaMinutes <= 10) {
    reasons.push(`Rapid transit corridor (ETA: ${etaMinutes} min)`);
  } else if (etaMinutes <= 20) {
    reasons.push(`Moderate transit window (ETA: ${etaMinutes} min)`);
  } else {
    reasons.push(`Extended transit distance (ETA: ${etaMinutes} min)`);
  }

  // 2. Capacity Component: ICU & ER availability
  // ICU bonus: more available beds reduces risk of diversion
  const icuRatio = Math.min(1, Math.max(0, status.icu_available / 10)); // 10+ beds is optimal
  const freeErRatio = Math.max(0, (status.er_capacity - status.er_occupancy) / Math.max(1, status.er_capacity));
  
  // Inverse ratio: higher availability = lower penalty
  const capacityDeficit = (1 - icuRatio) * 0.6 + (1 - freeErRatio) * 0.4;
  const capacityPenalty = capacityDeficit * weights.CAPACITY_WEIGHT;

  if (status.icu_available >= 5) {
    reasons.push(`High ICU reserve (${status.icu_available} beds free)`);
  } else if (status.icu_available > 0) {
    reasons.push(`Limited ICU buffer (${status.icu_available} beds free)`);
  }

  const freeErBays = Math.max(0, status.er_capacity - status.er_occupancy);
  if (freeErBays >= 10) {
    reasons.push(`Uncongested ER (${freeErBays} available bays)`);
  } else {
    reasons.push(`ER near peak capacity (${status.er_occupancy}/${status.er_capacity} occupied)`);
  }

  // 3. Predicted Load Component (0 to 100% normalized to 0 to 1)
  const normalizedLoad = Math.min(1, Math.max(0, status.predicted_load / 100));
  const predictedLoadPenalty = normalizedLoad * weights.PREDICTED_LOAD_WEIGHT;

  if (status.predicted_load < 60) {
    reasons.push(`Low forecasted load (${status.predicted_load}% over 30 min)`);
  } else if (status.predicted_load <= 80) {
    reasons.push(`Manageable forecasted load (${status.predicted_load}% over 30 min)`);
  } else {
    reasons.push(`High incoming surge projected (${status.predicted_load}% over 30 min)`);
  }

  // 4. Distance Component (0 to 1, capped at 25km)
  const normalizedDistance = Math.min(1, Math.max(0, distanceMeters / 25000));
  const distancePenalty = normalizedDistance * weights.DISTANCE_WEIGHT;

  // Total deterministic score (lower score wins)
  const rawScore = etaPenalty + capacityPenalty + predictedLoadPenalty + distancePenalty;
  const score = Math.round(rawScore * 10) / 10;

  // Add specialist endorsement if patient needed it
  if (request.requiredSpecialty) {
    reasons.unshift(`Verified specialist on duty: ${request.requiredSpecialty}`);
  }

  return {
    hospital,
    score,
    etaMinutes,
    distanceMeters,
    reasons,
    breakdown: {
      etaPenalty: Math.round(etaPenalty * 10) / 10,
      capacityPenalty: Math.round(capacityPenalty * 10) / 10,
      predictedLoadPenalty: Math.round(predictedLoadPenalty * 10) / 10,
      distancePenalty: Math.round(distancePenalty * 10) / 10,
    },
  };
}
