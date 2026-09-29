import { Hospital, HospitalStatus, EnrichedHospital } from "../../types/hospital";
import {
  DestinationRequest,
  DestinationRecommendation,
  HospitalAlternative,
} from "../../types/destination";
import { getEligibleHospitals } from "./eligibility";
import { scoreHospital, ScoringWeights, DEFAULT_SCORING_WEIGHTS } from "./scoring";

export interface TravelTimeInfo {
  hospitalId: string;
  etaMinutes: number;
  distanceMeters: number;
  isLiveTraffic: boolean;
  routingSource: "GOOGLE_ROUTES_API" | "FALLBACK_CALCULATED";
}

/**
 * Recommends the optimal destination hospital based on deterministic clinical eligibility,
 * live/fallback Google Maps travel times, capacity, specialist coverage, and surge load.
 */
export function recommendDestination(
  request: DestinationRequest,
  hospitals: Hospital[],
  statuses: Record<string, HospitalStatus>,
  travelTimes: Record<string, TravelTimeInfo>,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): DestinationRecommendation | null {
  // Step 1: Strict clinical & operational eligibility filtering
  const { eligibleHospitals, allEvaluations } = getEligibleHospitals(
    request,
    hospitals,
    statuses
  );

  // If no hospitals meet the mandatory clinical thresholds
  if (eligibleHospitals.length === 0) {
    return null;
  }

  // Step 2: Score all eligible candidates
  const scoredCandidates = eligibleHospitals.map((hospital) => {
    const travel = travelTimes[hospital.id] || {
      hospitalId: hospital.id,
      etaMinutes: 15,
      distanceMeters: 6000,
      isLiveTraffic: false,
      routingSource: "FALLBACK_CALCULATED" as const,
    };

    return scoreHospital(
      hospital,
      travel.etaMinutes,
      travel.distanceMeters,
      request,
      weights
    );
  });

  // Step 3: Sort deterministically (lowest penalty score wins)
  scoredCandidates.sort((a, b) => a.score - b.score);

  const topChoice = scoredCandidates[0];
  const topTravel = travelTimes[topChoice.hospital.id];
  const routingSource = topTravel?.routingSource ?? "FALLBACK_CALCULATED";

  // Build alternatives list (including both eligible and ineligible with reasons)
  const alternatives: HospitalAlternative[] = [];

  // Scored runners up
  for (let i = 1; i < scoredCandidates.length; i++) {
    const candidate = scoredCandidates[i];
    alternatives.push({
      hospital: candidate.hospital,
      eligible: true,
      score: candidate.score,
      etaMinutes: candidate.etaMinutes,
      distanceMeters: candidate.distanceMeters,
      reasons: candidate.reasons,
    });
  }

  // Add ineligible hospitals so operators understand why they were not chosen
  for (const evalResult of allEvaluations) {
    if (!evalResult.isEligible) {
      const travel = travelTimes[evalResult.hospital.id] || {
        hospitalId: evalResult.hospital.id,
        etaMinutes: 20,
        distanceMeters: 8000,
        isLiveTraffic: false,
        routingSource: "FALLBACK_CALCULATED" as const,
      };

      alternatives.push({
        hospital: evalResult.hospital,
        eligible: false,
        score: 999, // Disqualified
        etaMinutes: travel.etaMinutes,
        distanceMeters: travel.distanceMeters,
        reasons: evalResult.disqualificationReasons.map((r) => `Disqualified: ${r}`),
      });
    }
  }

  // Step 4: Synthesize human-readable explanation
  const specText = request.requiredSpecialty
    ? `required specialist (${request.requiredSpecialty}) is on active duty`
    : "emergency capabilities are verified";
  const icuText = request.icuRequired
    ? `ICU capacity is available (${topChoice.hospital.status.icu_available} beds)`
    : "accredited emergency department ready";
  const loadText = `forecasted 30-min load is ${topChoice.hospital.status.predicted_load}%`;

  const reason = `${topChoice.hospital.name} is recommended because ${specText}, ${icuText}, and ${loadText} at an ETA of ${topChoice.etaMinutes} min.`;

  return {
    recommendedHospital: topChoice.hospital,
    alternatives,
    reason,
    score: topChoice.score,
    etaMinutes: topChoice.etaMinutes,
    distanceMeters: topChoice.distanceMeters,
    routingSource,
    evaluatedAt: new Date().toISOString(),
  };
}
