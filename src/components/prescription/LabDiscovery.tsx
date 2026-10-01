"use client";

import React, { useState, useRef } from "react";
import { usePrescription } from "@/context/PrescriptionContext";
import { MapPin, Navigation2, Phone, Search, Loader2, UploadCloud, CheckCircle2, FlaskConical, Send, ExternalLink } from "lucide-react";

interface Lab {
  id: string;
  name: string;
  address: string;
  distanceMeters: number;
  phone: string;
  isOpen: boolean;
  latitude: number;
  longitude: number;
}

export function LabDiscovery() {
  const { confirmedTests, setConfirmedTests } = usePrescription();
  const [isSearching, setIsSearching] = useState(false);
  const [nearbyLabs, setNearbyLabs] = useState<Lab[]>([]);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Upload states mapping: testId -> status (none, uploading, uploaded, sent)
  const [uploadStatus, setUploadStatus] = useState<Record<string, "none" | "uploading" | "uploaded" | "sent">>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);

  if (!confirmedTests || confirmedTests.length === 0) {
    return null; 
  }

  const findLabs = async () => {
    setIsSearching(true);
    // Simulate API delay and location
    const mockLocation = { lat: 23.2332, lng: 77.43 };
    setLocation(mockLocation);
    
    setTimeout(() => {
      setNearbyLabs([
        {
          id: "lab-1",
          name: "Apollo Diagnostics",
          address: "MP Nagar Zone 1, Bhopal",
          distanceMeters: 450,
          phone: "+91 9876543210",
          isOpen: true,
          latitude: 23.2320,
          longitude: 77.4320
        },
        {
          id: "lab-2",
          name: "Dr. Lal PathLabs",
          address: "10 No. Market, Arera Colony",
          distanceMeters: 1200,
          phone: "+91 8765432109",
          isOpen: true,
          latitude: 23.2250,
          longitude: 77.4280
        },
        {
          id: "lab-3",
          name: "Bansal Pathology Centre",
          address: "Shahpura, Bhopal",
          distanceMeters: 2500,
          phone: "+91 7654321098",
          isOpen: true,
          latitude: 23.2100,
          longitude: 77.4400
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[700px] overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center shrink-0">
        <h2 className="font-semibold text-slate-200 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-indigo-400" />
          Diagnostics & Tests
        </h2>
      </div>

      {/* Tests List & Upload Action (Scrollable if many, but usually compact) */}
      <div className="p-4 border-b border-slate-800 shrink-0 bg-slate-900/30 max-h-[250px] overflow-y-auto">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Prescribed Tests to Complete</h3>
        <div className="space-y-3">
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
                      <UploadCloud className="w-4 h-4" /> Upload Report
                    </button>
                  )}
                  {status === "uploading" && (
                    <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm font-medium px-4 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                    </div>
                  )}
                  {status === "uploaded" && (
                    <button 
                      onClick={() => handleSendToDoctor(test.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Send to Doctor
                    </button>
                  )}
                  {status === "sent" && (
                    <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium px-4 py-2 bg-emerald-950/30 rounded-lg border border-emerald-900/50">
                      <CheckCircle2 className="w-4 h-4" /> Sent for Review
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,.pdf" />
      </div>

      {/* Lab Discovery Header */}
      <div className="p-4 border-b border-slate-800 shrink-0">
        <button
          onClick={findLabs}
          disabled={isSearching}
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {isSearching ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Searching Nearby Labs...</>
          ) : (
            <><Search className="w-4 h-4" /> Find Nearby Diagnostic Centres</>
          )}
        </button>
      </div>

      {/* Map & List Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Column: List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 md:w-2/5 md:border-r border-slate-800">
          {nearbyLabs.length === 0 && !isSearching ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <MapPin className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Click search to find centres</p>
            </div>
          ) : (
            nearbyLabs.map((lab) => {
              const isSelected = selectedLab?.id === lab.id;
              return (
                <div 
                  key={lab.id}
                  onClick={() => setSelectedLab(lab)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-950/30 border-indigo-500/50 ring-1 ring-indigo-500/50' 
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-slate-200">{lab.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {(lab.distanceMeters / 1000).toFixed(1)} km
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-4">{lab.address}</p>
                  
                  {isSelected && (
                    <div className="flex gap-2 pt-2 border-t border-slate-800">
                      <button className="flex-1 flex justify-center items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-md text-xs font-medium transition-colors">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </button>
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(lab.name + " " + lab.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex justify-center items-center gap-1.5 bg-indigo-900/30 hover:bg-indigo-800/40 text-indigo-400 py-1.5 rounded-md text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Directions
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* Right Column: Map Window (Hidden on mobile) */}
        <div className="hidden md:block md:w-3/5 relative bg-slate-950">
          {(selectedLab || location) ? (
            <iframe
              className="w-full h-full border-0 grayscale opacity-80 contrast-125"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${selectedLab?.latitude || location?.lat},${selectedLab?.longitude || location?.lng}&t=m&z=15&output=embed&iwloc=near`}
            ></iframe>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/50">
               <MapPin className="w-8 h-8 mb-2 opacity-50" />
               <p className="text-sm">Map preview</p>
             </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
