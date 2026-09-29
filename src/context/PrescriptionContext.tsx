"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { 
  ExtractedPrescription, 
  ConfirmedMedication, 
  ScheduledDose,
  Pharmacy
} from "../types/prescription";

interface PrescriptionContextType {
  // Prescription State
  prescriptionMode: "demo" | "live";
  extractedPrescription: ExtractedPrescription | null;
  setExtractedPrescription: (p: ExtractedPrescription | null) => void;
  
  // Verification State
  confirmedMedications: ConfirmedMedication[];
  setConfirmedMedications: (m: ConfirmedMedication[]) => void;
  isVerified: boolean;
  setIsVerified: (v: boolean) => void;

  // Reminders
  schedule: ScheduledDose[];
  setSchedule: (s: ScheduledDose[]) => void;
  updateDoseStatus: (id: string, status: ScheduledDose["status"]) => void;
  updateDoseTime: (id: string, timeString: string) => void;

  // Pharmacies
  nearbyPharmacies: Pharmacy[];
  setNearbyPharmacies: (p: Pharmacy[]) => void;
  selectedPharmacy: Pharmacy | null;
  setSelectedPharmacy: (p: Pharmacy | null) => void;

  resetPrescriptionWorkflow: () => void;
}

const PrescriptionContext = createContext<PrescriptionContextType | undefined>(undefined);

export const PrescriptionProvider = ({ children }: { children: ReactNode }) => {
  const [prescriptionMode] = useState<"demo" | "live">(
    (process.env.NEXT_PUBLIC_PRESCRIPTION_AI_MODE as "demo" | "live") || "demo"
  );
  const [extractedPrescription, setExtractedPrescription] = useState<ExtractedPrescription | null>(null);
  const [confirmedMedications, setConfirmedMedications] = useState<ConfirmedMedication[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [schedule, setSchedule] = useState<ScheduledDose[]>([]);
  const [nearbyPharmacies, setNearbyPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  const updateDoseStatus = useCallback((id: string, status: ScheduledDose["status"]) => {
    setSchedule(prev => prev.map(dose => dose.id === id ? { ...dose, status } : dose));
  }, []);

  const updateDoseTime = useCallback((id: string, timeString: string) => {
    setSchedule(prev => prev.map(dose => dose.id === id ? { ...dose, timeString } : dose));
  }, []);

  const resetPrescriptionWorkflow = useCallback(() => {
    setExtractedPrescription(null);
    setConfirmedMedications([]);
    setIsVerified(false);
    setSchedule([]);
    setNearbyPharmacies([]);
    setSelectedPharmacy(null);
  }, []);

  return (
    <PrescriptionContext.Provider
      value={{
        prescriptionMode,
        extractedPrescription,
        setExtractedPrescription,
        confirmedMedications,
        setConfirmedMedications,
        isVerified,
        setIsVerified,
        schedule,
        setSchedule,
        updateDoseStatus,
        updateDoseTime,
        nearbyPharmacies,
        setNearbyPharmacies,
        selectedPharmacy,
        setSelectedPharmacy,
        resetPrescriptionWorkflow
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescription = () => {
  const ctx = useContext(PrescriptionContext);
  if (!ctx) throw new Error("usePrescription must be used within a PrescriptionProvider");
  return ctx;
};
