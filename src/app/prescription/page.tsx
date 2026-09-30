"use client";

import React from "react";
import { usePrescription } from "@/context/PrescriptionContext";
import { UploadPrescription } from "@/components/prescription/UploadPrescription";
import { VerificationView } from "@/components/prescription/VerificationView";
import { MedicationSchedule } from "@/components/prescription/MedicationSchedule";
import { PharmacyDiscovery } from "@/components/prescription/PharmacyDiscovery";
import { LabDiscovery } from "@/components/prescription/LabDiscovery";
import { RefreshCw } from "lucide-react";

export default function PrescriptionWorkflowPage() {
  const { 
    extractedPrescription, 
    isVerified, 
    resetPrescriptionWorkflow 
  } = usePrescription();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            Prescription & Diagnostics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload a prescription, verify medications, and find nearby pharmacies or diagnostic labs.
          </p>
        </div>
        <button
          onClick={resetPrescriptionWorkflow}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Start Over
        </button>
      </div>

      {!extractedPrescription ? (
        <UploadPrescription />
      ) : !isVerified ? (
        <VerificationView />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MedicationSchedule />
            <PharmacyDiscovery />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LabDiscovery />
          </div>
        </div>
      )}
    </div>
  );
}
