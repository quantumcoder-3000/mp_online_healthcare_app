import { HospitalStatus } from "../../types/hospital";
import { calculatePredictedLoad } from "../destination/loadPrediction";

/**
 * Deterministically adjusts ICU availability for a specific hospital.
 * Automatically recalculates current load and 30-min predicted load.
 */
export function adjustHospitalICU(
  status: HospitalStatus,
  delta: number,
  icuTotal: number = 50
): HospitalStatus {
  const newIcu = Math.max(0, Math.min(icuTotal, status.icu_available + delta));
  return recalculateHospitalLoads({
    ...status,
    icu_available: newIcu,
    updated_at: new Date().toISOString(),
  });
}

/**
 * Deterministically adjusts ER occupancy for a hospital.
 */
export function adjustHospitalER(
  status: HospitalStatus,
  delta: number
): HospitalStatus {
  const newOccupancy = Math.max(0, Math.min(status.er_capacity, status.er_occupancy + delta));
  return recalculateHospitalLoads({
    ...status,
    er_occupancy: newOccupancy,
    updated_at: new Date().toISOString(),
  });
}

/**
 * Toggles a medical specialist's active duty status.
 */
export function toggleHospitalSpecialist(
  status: HospitalStatus,
  specialty: string
): HospitalStatus {
  const specLower = specialty.trim().toLowerCase();
  const exists = status.specialists_available.some((s) => s.toLowerCase() === specLower);

  let newSpecialists: string[];
  if (exists) {
    newSpecialists = status.specialists_available.filter((s) => s.toLowerCase() !== specLower);
  } else {
    newSpecialists = [...status.specialists_available, specLower];
  }

  return {
    ...status,
    specialists_available: newSpecialists,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Recomputes current composite load percentage (0-100) and calls
 * the 30-minute predicted load engine.
 */
export function recalculateHospitalLoads(status: HospitalStatus): HospitalStatus {
  const erRatio = status.er_capacity > 0 ? status.er_occupancy / status.er_capacity : 0.5;
  // If ICU is full, load increases significantly
  const icuDeficit = status.icu_available <= 1 ? 0.3 : 0.05;

  const rawCurrentLoad = erRatio * 70 + icuDeficit * 30;
  const currentLoad = Math.round(Math.min(100, Math.max(10, rawCurrentLoad)));

  const prediction = calculatePredictedLoad({
    currentLoad,
    erOccupancyRate: erRatio,
    incomingEmergencyCases: 2,
  });

  return {
    ...status,
    current_load: currentLoad,
    predicted_load: prediction.predictedLoad,
  };
}

/**
 * Advances simulated operational states with subtle, realistic clinical turnover
 * (discharges, bed turn-around). Does NOT apply chaotic fluctuations.
 */
export function stepHospitalTurnover(
  statuses: Record<string, HospitalStatus>
): Record<string, HospitalStatus> {
  const nextStatuses: Record<string, HospitalStatus> = {};

  for (const [id, status] of Object.entries(statuses)) {
    // 15% probability per tick of a 1-patient bed turnover
    let erChange = 0;
    const rand = Math.random();
    if (rand < 0.08 && status.er_occupancy > 2) erChange = -1; // discharge
    else if (rand > 0.92 && status.er_occupancy < status.er_capacity - 1) erChange = +1; // admission

    if (erChange !== 0) {
      nextStatuses[id] = adjustHospitalER(status, erChange);
    } else {
      nextStatuses[id] = status;
    }
  }

  return nextStatuses;
}
