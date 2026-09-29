import { Hospital, HospitalStatus, EnrichedHospital } from "../../types/hospital";
import { DestinationRequest } from "../../types/destination";

export interface HospitalEligibilityEvaluation {
  hospital: EnrichedHospital;
  isEligible: boolean;
  disqualificationReasons: string[];
  passingReasons: string[];
}

export interface EligibilityResult {
  eligibleHospitals: EnrichedHospital[];
  allEvaluations: HospitalEligibilityEvaluation[];
  ineligibleCount: number;
}

/**
 * Deterministically evaluates hospital clinical and operational eligibility
 * against patient triage requirements.
 *
 * CRITICAL RULE: Mandatory clinical filters execute FIRST. Ineligible hospitals
 * are disqualified before any scoring or distance optimization can occur.
 */
export function getEligibleHospitals(
  request: DestinationRequest,
  hospitals: Hospital[],
  statuses: Record<string, HospitalStatus>
): EligibilityResult {
  const evaluations: HospitalEligibilityEvaluation[] = [];
  const eligibleHospitals: EnrichedHospital[] = [];

  for (const hospital of hospitals) {
    const status: HospitalStatus = statuses[hospital.id] || {
      hospital_id: hospital.id,
      icu_available: 0,
      er_occupancy: 0,
      er_capacity: 10,
      current_load: 50,
      predicted_load: 50,
      specialists_available: [],
      updated_at: new Date().toISOString(),
      data_source: "SIMULATED_DEMO",
    };

    const enriched: EnrichedHospital = {
      ...hospital,
      status,
    };

    const disqualificationReasons: string[] = [];
    const passingReasons: string[] = [];

    // Rule 1: Emergency capability
    if (request.emergencyRequired) {
      if (!hospital.emergency_capable) {
        disqualificationReasons.push("Facility lacks accredited emergency response unit");
      } else {
        passingReasons.push("Emergency unit active");
      }
    }

    // Rule 2: ICU availability
    if (request.icuRequired) {
      if (status.icu_available <= 0) {
        disqualificationReasons.push(`No ICU beds currently available (0 of ${hospital.icu_total})`);
      } else {
        passingReasons.push(`${status.icu_available} ICU beds ready`);
      }
    }

    // Rule 3: Trauma capability
    if (request.traumaRequired) {
      if (!hospital.trauma_capable) {
        disqualificationReasons.push("Trauma center certification required but not available");
      } else {
        passingReasons.push("Trauma center verified");
      }
    }

    // Rule 4: Required specialty on duty
    if (request.requiredSpecialty) {
      const needed = request.requiredSpecialty.trim().toLowerCase();
      const availableSpecialists = status.specialists_available.map((s) => s.toLowerCase());

      if (!availableSpecialists.includes(needed)) {
        disqualificationReasons.push(
          `Required specialist (${request.requiredSpecialty}) not on active duty`
        );
      } else {
        passingReasons.push(`Specialist on duty: ${request.requiredSpecialty}`);
      }
    }

    // Rule 5: Minimum ER capacity threshold
    const freeErBays = Math.max(0, status.er_capacity - status.er_occupancy);
    if (request.minimumERCapacity > 0 && freeErBays < request.minimumERCapacity) {
      disqualificationReasons.push(
        `Insufficient ER surge capacity (${freeErBays} free bays, minimum ${request.minimumERCapacity} required)`
      );
    } else if (request.minimumERCapacity > 0) {
      passingReasons.push(`Sufficient ER bays available (${freeErBays} free)`);
    }

    const isEligible = disqualificationReasons.length === 0;

    evaluations.push({
      hospital: enriched,
      isEligible,
      disqualificationReasons,
      passingReasons,
    });

    if (isEligible) {
      eligibleHospitals.push(enriched);
    }
  }

  return {
    eligibleHospitals,
    allEvaluations: evaluations,
    ineligibleCount: evaluations.length - eligibleHospitals.length,
  };
}
