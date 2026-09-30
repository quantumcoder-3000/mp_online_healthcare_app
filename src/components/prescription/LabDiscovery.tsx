"use client";

import React, { useState, useRef } from "react";
import { usePrescription } from "@/context/PrescriptionContext";
import { MapPin, Navigation2, Phone, Search, Loader2, Activity, UploadCloud, FileText, CheckCircle2, FlaskConical, Send } from "lucide-react";

interface Lab {
  id: string;
  name: string;
  address: string;
  distanceMeters: number;
  phone: string;
  isOpen: boolean;
}

export function LabDiscovery() {
  const { confirmedTests, setConfirmedTests } = usePrescription();
  const [isSearching, setIsSearching] = useState(false);
  const [nearbyLabs, setNearbyLabs] = useState<Lab[]>([]);
  
  // Upload states mapping: testId -> status (none, uploading, uploaded, sent)
  const [uploadStatus, setUploadStatus] = useState<Record<string, "none" | "uploading" | "uploaded" | "sent">>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);

  if (!confirmedTests || confirmedTests.length === 0) {
    return null; // Hide completely if there are no tests
  }

  const findLabs = async () => {
    setIsSearching(true);
    // Simulate API delay
    setTimeout(() => {
      setNearbyLabs([
        {
          id: "lab-1",
          name: "Apollo Diagnostics",
          address: "MP Nagar Zone 1, Bhopal",
          distanceMeters: 450,
          phone: "+91 9876543210",
          isOpen: true
        },
        {
          id: "lab-2",
          name: "Dr. Lal PathLabs",
          address: "10 No. Market, Arera Colony",
          distanceMeters: 1200,
          phone: "+91 8765432109",
          isOpen: true
        },
        {
          id: "lab-3",
          name: "Bansal Pathology Centre",
          address: "Shahpura, Bhopal",
          distanceMeters: 2500,
          phone: "+91 7654321098",
          isOpen: true
        }
      ]);
      setIsSearching(false);
    }, 1200);
  };

  const handleUploadClick = (testId: string) => {
    setActiveTestId(testId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && activeTestId) {
      const testId = activeTestId;
      setUploadStatus(prev => ({ ...prev, [testId]: "uploading" }));
      
      // Simulate extraction time
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [testId]: "uploaded" }));
        
        // Update context to show report is uploaded
        setConfirmedTests(confirmedTests.map(t => 
          t.id === testId ? { ...t, reportUploaded: true } : t
        ));
      }, 2000);
    }
  };

  const handleSendToDoctor = (testId: string) => {
    setUploadStatus(prev => ({ ...prev, [testId]: "sent" }));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
        <h2 className="font-semibold text-slate-200 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-indigo-400" />
          Diagnostics & Tests
        </h2>
      </div>

      <div className="p-6 flex-1 flex flex-col space-y-6">
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-400">Prescribed Tests</h3>
          {confirmedTests.map(test => {
            const status = uploadStatus[test.id] || "none";
            return (
              <div key={test.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-slate-200 font-medium">{test.name}</h4>
                  {test.reason && <p className="text-xs text-slate-400 mt-1">Reason: {test.reason}</p>}
                </div>
                
                <div className="shrink-0">
                  {status === "none" && (
                    <button 
                      onClick={() => handleUploadClick(test.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Upload Report
                    </button>
                  )}
                  {status === "uploading" && (
                    <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium px-4 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </div>
                  )}
                  {status === "uploaded" && (
                    <button 
                      onClick={() => handleSendToDoctor(test.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send to Doctor
                    </button>
                  )}
                  {status === "sent" && (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium px-4 py-2 bg-emerald-950/30 rounded-lg border border-emerald-900/50">
                      <CheckCircle2 className="w-4 h-4" />
                      Sent for Review
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
          accept="image/*,.pdf" 
        />

        {nearbyLabs.length === 0 ? (
          <div className="mt-auto pt-6 border-t border-slate-800">
            <button
              onClick={findLabs}
              disabled={isSearching}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-xl font-medium transition-all"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {isSearching ? "Searching..." : "Find Nearby Labs"}
            </button>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Nearby Diagnostic Centres
            </h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {nearbyLabs.map((lab) => (
                <div 
                  key={lab.id}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-4 transition-all hover:border-indigo-500/50 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-200">{lab.name}</h4>
                    <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded-md">
                      {(lab.distanceMeters / 1000).toFixed(1)} km
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-4 line-clamp-1">{lab.address}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <button className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 rounded-lg text-xs font-medium transition-colors">
                      <Navigation2 className="w-3.5 h-3.5" />
                      Navigate
                    </button>
                    <button className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                      Call Center
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
