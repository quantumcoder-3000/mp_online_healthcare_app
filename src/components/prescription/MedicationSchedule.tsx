"use client";

import React, { useState, useEffect } from "react";
import { usePrescription } from "@/context/PrescriptionContext";
import { Clock, Check, BellOff } from "lucide-react";

function TimeEditor({ doseId, initialTime, onSave }: { doseId: string, initialTime: string, onSave: (id: string, time: string) => void }) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  const handleBlur = () => {
    if (time !== initialTime) {
      onSave(doseId, time);
    }
  };

  return (
    <input 
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      onBlur={handleBlur}
      className="bg-slate-900 border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-cyan-500 transition-colors"
      title="Edit reminder time"
    />
  );
}

export function MedicationSchedule() {
  const { schedule, confirmedMedications, updateDoseStatus, updateDoseTime } = usePrescription();

  // Group by time
  const groupedSchedule = schedule.reduce((acc, dose) => {
    if (!acc[dose.timeString]) acc[dose.timeString] = [];
    acc[dose.timeString].push(dose);
    return acc;
  }, {} as Record<string, typeof schedule>);

  const sortedTimes = Object.keys(groupedSchedule).sort();

  const getMedication = (id: string) => confirmedMedications.find(m => m.id === id);

  const totalDoses = schedule.length;
  const takenDoses = schedule.filter(d => d.status === "TAKEN").length;
  const progress = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center shrink-0">
        <h2 className="font-semibold text-slate-200 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Medication Schedule
        </h2>
        <div className="text-sm text-slate-400 font-medium">
          {takenDoses} / {totalDoses} Taken
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-950/30 border-b border-slate-800 shrink-0">
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sortedTimes.length === 0 ? (
          <p className="text-center text-slate-500 text-sm mt-10">No medications scheduled.</p>
        ) : (
          sortedTimes.map(time => (
            <div key={time} className="relative pl-4">
              <div className="absolute left-0 top-1 bottom-[-24px] w-px bg-slate-800"></div>
              <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-cyan-500 ring-4 ring-slate-900"></div>
              
              <h3 className="text-sm font-semibold text-cyan-400 mb-3">{time}</h3>
              
              <div className="space-y-3">
                {groupedSchedule[time].map(dose => {
                  const med = getMedication(dose.medicationId);
                  if (!med) return null;

                  return (
                    <div 
                      key={dose.id} 
                      className={`p-3 rounded-lg border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        dose.status === "TAKEN" 
                          ? 'bg-emerald-950/20 border-emerald-900/50' 
                          : dose.status === "SNOOZED"
                          ? 'bg-amber-950/20 border-amber-900/50'
                          : 'bg-slate-950/50 border-slate-700'
                      }`}
                    >
                      <div>
                        <p className={`font-medium text-sm ${dose.status === "TAKEN" ? 'text-emerald-400 line-through opacity-70' : 'text-slate-200'}`}>
                          {med.name} {med.strength}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {med.dose} • {med.instructions}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 shrink-0">
                        {dose.status === "TAKEN" ? (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-900/30 text-emerald-400 rounded-md text-xs font-medium">
                            <Check className="w-3.5 h-3.5" /> Taken
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <TimeEditor 
                              doseId={dose.id}
                              initialTime={dose.timeString}
                              onSave={updateDoseTime}
                            />
                            <button
                              onClick={() => updateDoseStatus(dose.id, "SNOOZED")}
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-md transition-colors"
                              title="Snooze"
                            >
                              <BellOff className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateDoseStatus(dose.id, "TAKEN")}
                              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded-md text-xs font-medium transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" /> Mark Taken
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
