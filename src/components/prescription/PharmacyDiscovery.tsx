"use client";

import React, { useState } from "react";
import { usePrescription } from "@/context/PrescriptionContext";
import { MapPin, Navigation2, Phone, Search, Loader2, Store, ExternalLink } from "lucide-react";
import { Pharmacy } from "@/types/prescription";

export function PharmacyDiscovery() {
  const { confirmedMedications, nearbyPharmacies, setNearbyPharmacies, selectedPharmacy, setSelectedPharmacy } = usePrescription();
  const [isSearching, setIsSearching] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const findPharmacies = async () => {
    setIsSearching(true);
    
    try {
      // Simulate getting browser location
      const mockLocation = { lat: 23.2332, lng: 77.43 }; // MP Nagar, Bhopal
      setLocation(mockLocation);

      const res = await fetch("/api/pharmacy/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: mockLocation.lat, longitude: mockLocation.lng })
      });

      const data = await res.json();
      if (data.success) {
        setNearbyPharmacies(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center shrink-0">
        <h2 className="font-semibold text-slate-200 flex items-center gap-2">
          <Store className="w-5 h-5 text-cyan-400" />
          Find Nearby Pharmacies
        </h2>
      </div>

      <div className="p-4 border-b border-slate-800 shrink-0">
        <p className="text-sm text-slate-400 mb-3">
          Searching based on your verified prescription ({confirmedMedications.length} medicines).
        </p>
        
        <button
          onClick={findPharmacies}
          disabled={isSearching}
          className="w-full flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {isSearching ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Searching Google Places...</>
          ) : (
            <><Search className="w-4 h-4" /> Search Near Me</>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 md:w-2/5 md:border-r border-slate-800">
          {nearbyPharmacies.length === 0 && !isSearching ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <MapPin className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Click search to find pharmacies</p>
            </div>
          ) : (
            nearbyPharmacies.map(pharmacy => {
              const isSelected = selectedPharmacy?.id === pharmacy.id;
              
              return (
                <div 
                  key={pharmacy.id}
                  onClick={() => setSelectedPharmacy(pharmacy)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-950/20 border-cyan-500/50 ring-1 ring-cyan-500/50' 
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-slate-200">{pharmacy.name}</h3>
                    {pharmacy.isOpen !== null && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${pharmacy.isOpen ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900' : 'bg-red-950/50 text-red-400 border border-red-900'}`}>
                        {pharmacy.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-4">{pharmacy.address}</p>
                  
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Navigation2 className="w-3.5 h-3.5" />
                        {pharmacy.etaMinutes} min
                      </span>
                      <span className="text-slate-500">
                        {pharmacy.distanceMeters ? (pharmacy.distanceMeters / 1000).toFixed(1) : '?'} km
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                      <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-2.5">
                        <p className="text-[11px] text-amber-500/90 font-medium mb-1">STOCK NOT VERIFIED</p>
                        <p className="text-[10px] text-slate-400">Medicine availability is not confirmed. Please contact the pharmacy before travelling.</p>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 flex justify-center items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-md text-xs font-medium transition-colors">
                          <Phone className="w-3.5 h-3.5" /> Call
                        </button>
                        {pharmacy.mapsUrl && (
                          <a 
                            href={pharmacy.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex justify-center items-center gap-1.5 bg-cyan-900/30 hover:bg-cyan-800/40 text-cyan-400 py-1.5 rounded-md text-xs font-medium transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Google Maps
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* Map Window (Hidden on mobile) */}
        <div className="hidden md:block md:w-3/5 relative bg-slate-950">
          {(selectedPharmacy || location) ? (
            <iframe
              className="w-full h-full border-0 grayscale opacity-80 contrast-125"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${selectedPharmacy?.latitude || location?.lat},${selectedPharmacy?.longitude || location?.lng}&t=m&z=15&output=embed&iwloc=near`}
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
