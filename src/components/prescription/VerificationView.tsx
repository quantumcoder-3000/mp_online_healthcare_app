"use client";

import React, { useState } from "react";
import { usePrescription } from "@/context/PrescriptionContext";
import { ConfirmedMedication, RawMedication, ConfirmedTest } from "@/types/prescription";
import { Check, AlertTriangle, CheckCircle2, FileCheck2, Activity } from "lucide-react";

export function VerificationView() {
  const { extractedPrescription, setConfirmedMedications, setConfirmedTests, setIsVerified, setSchedule } = usePrescription();
  
  const [meds, setMeds] = useState<RawMedication[]>(extractedPrescription?.medications || []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tests, setTests] = useState<any[]>(extractedPrescription?.tests || []);

  const handleUpdate = (id: string, field: keyof RawMedication, value: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };
  
  const handleTestUpdate = (id: string, field: string, value: string) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const toggleVerification = (id: string, current: boolean) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, needsVerification: !current } : m));
  };
  
  const toggleTestVerification = (id: string, current: boolean) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, needsVerification: !current } : t));
  };

  const removeMed = (id: string) => {
    setMeds(prev => prev.filter(m => m.id !== id));
  };
  
  const removeTest = (id: string) => {
    setTests(prev => prev.filter(t => t.id !== id));
  };

  const unverifiedMedsCount = meds.filter(m => m.needsVerification).length;
  const unverifiedTestsCount = tests.filter(t => t.needsVerification).length;
  const unverifiedCount = unverifiedMedsCount + unverifiedTestsCount;

  const confirmAll = () => {
    if (unverifiedCount > 0) {
      alert("Please verify all marked items before proceeding.");
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
    
    const confirmedTestsList: ConfirmedTest[] = tests.map(t => ({
      id: t.id,
      name: t.name || "Unknown Test",
      reason: t.reason || "",
      reportUploaded: false
    }));

    setConfirmedMedications(confirmed);
    setConfirmedTests(confirmedTestsList);
    setIsVerified(true);
    
    generateSchedule(confirmed);
  };

  const generateSchedule = (confirmedMeds: ConfirmedMedication[]) => {
    const newSchedule = [];
    let scheduleId = 1;
    
    for (const med of confirmedMeds) {
      const instructionsLower_ = med.instructions?.toLowerCase() || "";
      const frequencyLower = med.frequency?.toLowerCase() || "";
      let times = 1;

      if (frequencyLower.includes("twice") || frequencyLower.includes("bd") || frequencyLower.includes("b.i.d")) times = 2;
      else if (frequencyLower.includes("thrice") || frequencyLower.includes("tds") || frequencyLower.includes("t.i.d")) times = 3;
      else if (frequencyLower.includes("four times") || frequencyLower.includes("qds")) times = 4;

      const baseTimes = times === 1 ? ["09:00"] : times === 2 ? ["09:00", "21:00"] : times === 3 ? ["09:00", "14:00", "21:00"] : ["09:00", "13:00", "17:00", "21:00"];

      for (let i = 0; i < times; i++) {
        newSchedule.push({
          id: `sch-${scheduleId++}`,
          medicationId: med.id,
          timeString: baseTimes[i] || "12:00",
          status: "UPCOMING" as const,
          date: new Date().toISOString().split("T")[0]
        });
      }
    }
    
    setSchedule(newSchedule.sort((a, b) => a.timeString.localeCompare(b.timeString)));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="font-semibold text-slate-200 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            Prescription Review
          </h2>
          <p className="text-xs text-slate-400 mt-1">Prescription information extracted using Saarthi AI. Please verify the extracted details.</p>
        </div>
        
        {unverifiedCount > 0 && (
          <span className="px-3 py-1 bg-amber-950/50 text-amber-400 border border-amber-900/50 rounded-full text-xs font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {unverifiedCount} action{unverifiedCount !== 1 ? 's' : ''} required
          </span>
        )}
      </div>

      <div className="p-6 space-y-8">
        
        {/* MEDICATIONS SECTION */}
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-500" />
            Medications
          </h3>
          {meds.length === 0 ? (
            <p className="text-slate-400 text-center py-8 bg-slate-950/50 rounded-xl border border-slate-800">No medications found in document.</p>
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
                    <div className="lg:w-1/3 bg-slate-900 rounded-lg p-3 border border-slate-800 self-start">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Source Text</p>
                      <p className="text-sm text-slate-300 font-mono italic">&quot;{med.sourceText}&quot;</p>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Medicine Name</label>
                        <input 
                          type="text" 
                          value={med.name || ""} 
                          onChange={(e) => handleUpdate(med.id, 'name', e.target.value)}
                          className={`w-full bg-slate-900 border rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors ${!med.name ? 'border-amber-500/50 focus:border-amber-500' : 'border-slate-700'}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Dose</label>
                        <input 
                          type="text" 
                          value={med.dose || ""} 
                          onChange={(e) => handleUpdate(med.id, 'dose', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Frequency</label>
                        <input 
                          type="text" 
                          value={med.frequency || ""} 
                          onChange={(e) => handleUpdate(med.id, 'frequency', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Instructions / Notes</label>
                        <input 
                          type="text" 
                          value={med.instructions || ""} 
                          onChange={(e) => handleUpdate(med.id, 'instructions', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 px-4 py-3 border-t border-slate-800 flex items-center justify-between">
                    <button onClick={() => removeMed(med.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    <button 
                      onClick={() => toggleVerification(med.id, med.needsVerification)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        med.needsVerification ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50'
                      }`}
                    >
                      {med.needsVerification ? "Verify as Correct" : <><CheckCircle2 className="w-4 h-4" /> Verified</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TESTS SECTION */}
        {tests.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Diagnostics & Tests
            </h3>
            <div className="space-y-4">
              {tests.map((test) => (
                <div 
                  key={test.id} 
                  className={`relative border rounded-xl overflow-hidden transition-colors ${
                    test.needsVerification ? 'border-amber-700/50 bg-amber-950/10' : 'border-slate-700 bg-slate-950/50'
                  }`}
                >
                  {test.needsVerification && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>}
                  
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Test Name</label>
                      <input 
                        type="text" 
                        value={test.name || ""} 
                        onChange={(e) => handleTestUpdate(test.id, 'name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Reason (Optional)</label>
                      <input 
                        type="text" 
                        value={test.reason || ""} 
                        onChange={(e) => handleTestUpdate(test.id, 'reason', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950/80 px-4 py-3 border-t border-slate-800 flex items-center justify-between">
                    <button onClick={() => removeTest(test.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    <button 
                      onClick={() => toggleTestVerification(test.id, test.needsVerification)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        test.needsVerification ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50'
                      }`}
                    >
                      {test.needsVerification ? "Verify as Correct" : <><CheckCircle2 className="w-4 h-4" /> Verified</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={confirmAll}
            disabled={unverifiedCount > 0 || (meds.length === 0 && tests.length === 0)}
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