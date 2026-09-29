"use client";

import React, { useState } from "react";
import { usePrescription } from "@/context/PrescriptionContext";
import { ConfirmedMedication, RawMedication } from "@/types/prescription";
import { Check, Edit2, AlertTriangle, Info, CheckCircle2, FileCheck2 } from "lucide-react";

export function VerificationView() {
  const { extractedPrescription, setConfirmedMedications, setIsVerified, setSchedule } = usePrescription();
  
  const [meds, setMeds] = useState<RawMedication[]>(extractedPrescription?.medications || []);

  const handleUpdate = (id: string, field: keyof RawMedication, value: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const toggleVerification = (id: string, current: boolean) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, needsVerification: !current } : m));
  };

  const removeMed = (id: string) => {
    setMeds(prev => prev.filter(m => m.id !== id));
  };

  const confirmAll = () => {
    const allVerified = meds.every(m => !m.needsVerification);
    if (!allVerified) {
      alert("Please verify all marked medications before proceeding.");
      return;
    }

    const confirmed: ConfirmedMedication[] = meds.map(m => ({
      id: m.id,
      name: m.name || "Unknown",
      strength: m.strength || "",
      dose: m.dose || "",
      frequency: m.frequency || "",
      duration: m.duration || "",
      route: m.route || "",
      instructions: m.instructions || ""
    }));

    setConfirmedMedications(confirmed);
    setIsVerified(true);
    
    // Generate prototype schedule
    generateSchedule(confirmed);
  };

  const generateSchedule = (confirmedMeds: ConfirmedMedication[]) => {
    // Very simple prototype scheduling logic
    const newSchedule = [];
    let scheduleId = 1;
    
    for (const med of confirmedMeds) {
      const instructionsLower = med.instructions?.toLowerCase() || "";
      const frequencyLower = med.frequency?.toLowerCase() || "";

      // Determine how many times a day
      let times = 1;
      if (frequencyLower.match(/2|twice|bid/)) times = 2;
      if (frequencyLower.match(/3|thrice|tid/)) times = 3;
      if (frequencyLower.match(/4|qid/)) times = 4;

      const scheduleTimes = [];

      if (times === 1) {
        // Look for explicit time in instructions
        if (instructionsLower.includes("night") || instructionsLower.includes("bedtime") || instructionsLower.includes("evening")) {
          scheduleTimes.push("20:00");
        } else if (instructionsLower.includes("afternoon")) {
          scheduleTimes.push("14:00");
        } else {
          scheduleTimes.push("08:00"); // default morning
        }
      } else if (times === 2) {
        scheduleTimes.push("08:00");
        scheduleTimes.push("20:00");
      } else if (times === 3) {
        scheduleTimes.push("08:00");
        scheduleTimes.push("14:00");
        scheduleTimes.push("20:00");
      } else if (times === 4) {
        scheduleTimes.push("08:00");
        scheduleTimes.push("12:00");
        scheduleTimes.push("16:00");
        scheduleTimes.push("20:00");
      } else {
        scheduleTimes.push("08:00"); // fallback
      }

      // Add each schedule time for this medication
      for (const t of scheduleTimes) {
        newSchedule.push({
          id: `SCH-${scheduleId++}`,
          medicationId: med.id,
          timeString: t,
          status: "UPCOMING" as const,
          date: new Date().toISOString().split("T")[0]
        });
      }
    }
    
    setSchedule(newSchedule.sort((a, b) => a.timeString.localeCompare(b.timeString)));
  };

  const unverifiedCount = meds.filter(m => m.needsVerification).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="font-semibold text-slate-200 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            Prescription Review
          </h2>
          <p className="text-xs text-slate-400 mt-1">Prescription information extracted using Gemini AI. Please verify the extracted details.</p>
        </div>
        
        {unverifiedCount > 0 && (
          <span className="px-3 py-1 bg-amber-950/50 text-amber-400 border border-amber-900/50 rounded-full text-xs font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {unverifiedCount} action{unverifiedCount !== 1 ? 's' : ''} required
          </span>
        )}
      </div>

      <div className="p-6 space-y-6">
        {meds.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No medications found in document.</p>
        ) : (
          <div className="space-y-4">
            {meds.map((med) => (
              <div 
                key={med.id} 
                className={`relative border rounded-xl overflow-hidden transition-colors ${
                  med.needsVerification 
                    ? 'border-amber-700/50 bg-amber-950/10' 
                    : 'border-slate-700 bg-slate-950/50'
                }`}
              >
                {med.needsVerification && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                )}
                
                <div className="p-4 flex flex-col lg:flex-row gap-6">
                  {/* Left: Extracted Text Context */}
                  <div className="lg:w-1/3 bg-slate-900 rounded-lg p-3 border border-slate-800 self-start">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Source Text</p>
                    <p className="text-sm text-slate-300 font-mono italic">&quot;{med.sourceText}&quot;</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-500">Confidence:</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${med.confidence < 0.6 ? 'bg-red-500' : med.confidence < 0.8 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.max(5, med.confidence * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{Math.round(med.confidence * 100)}%</span>
                    </div>
                  </div>

                  {/* Right: Editable Fields */}
                  <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Medicine Name</label>
                      <input 
                        type="text" 
                        value={med.name || ""} 
                        onChange={(e) => handleUpdate(med.id, 'name', e.target.value)}
                        placeholder="e.g. Amoxicillin"
                        className={`w-full bg-slate-900 border rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors ${!med.name ? 'border-amber-500/50 focus:border-amber-500' : 'border-slate-700'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Strength</label>
                      <input 
                        type="text" 
                        value={med.strength || ""} 
                        onChange={(e) => handleUpdate(med.id, 'strength', e.target.value)}
                        placeholder="e.g. 500 mg"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Dose</label>
                      <input 
                        type="text" 
                        value={med.dose || ""} 
                        onChange={(e) => handleUpdate(med.id, 'dose', e.target.value)}
                        placeholder="e.g. 1 capsule"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Frequency</label>
                      <input 
                        type="text" 
                        value={med.frequency || ""} 
                        onChange={(e) => handleUpdate(med.id, 'frequency', e.target.value)}
                        placeholder="e.g. 3 times daily"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs text-slate-400">Instructions / Notes</label>
                      <input 
                        type="text" 
                        value={med.instructions || ""} 
                        onChange={(e) => handleUpdate(med.id, 'instructions', e.target.value)}
                        placeholder="e.g. After food"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/80 px-4 py-3 border-t border-slate-800 flex items-center justify-between">
                  <button 
                    onClick={() => removeMed(med.id)}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 transition-colors"
                  >
                    Remove Medication
                  </button>
                  
                  <button 
                    onClick={() => toggleVerification(med.id, med.needsVerification)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      med.needsVerification 
                        ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                        : 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/60'
                    }`}
                  >
                    {med.needsVerification ? (
                      <>Verify as Correct</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> User Verified</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={confirmAll}
            disabled={unverifiedCount > 0 || meds.length === 0}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Check className="w-5 h-5" />
            Confirm Prescription
          </button>
        </div>
      </div>
    </div>
  );
}
