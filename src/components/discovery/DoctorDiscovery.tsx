"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Video,
  User,
  Info,
  AlertTriangle,
  Calendar,
  ExternalLink,
  X,
  PhoneCall,
  Check,
  Activity,
  ArrowRight,
} from "lucide-react";

interface Doctor {
  doctor_id: string;
  doctor_name: string;
  specialty: string;
  facility_area: string;
  facility_name: string;
  pincode_demo: string;
  registration_id_demo?: string;
  virtual_availability: string;
  physical_availability: string;
}

export const DoctorDiscovery = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [consultationType, setConsultationType] = useState<
    "Virtual" | "Physical" | ""
  >("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStep, setBookingStep] = useState<
    | "select_type"
    | "select_time_virtual"
    | "fill_form_physical"
    | "confirmed"
    | "in_call"
  >("select_type");
  const [selectedSlotType, setSelectedSlotType] = useState<
    "Virtual" | "Physical" | null
  >(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [symptoms, setSymptoms] = useState("");

  // Deterministic online status for demo (e.g., doctor ID ends in 1 or 5)
  const isDoctorOnline = (id: string) => {
    const num = parseInt(id.replace(/\D/g, "")) || 0;
    return num % 3 === 0; // ~33% of doctors are online now
  };

  useEffect(() => {
    let mounted = true;
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (specialty) params.append("specialty", specialty);
        if (consultationType)
          params.append("consultationType", consultationType);

        const response = await fetch(`/api/doctors?${params.toString()}`);
        const data = await response.json();

        let filtered = data;
        if (location) {
          filtered = filtered.filter(
            (doc: Doctor) =>
              doc.facility_area
                ?.toLowerCase()
                .includes(location.toLowerCase()) ||
              doc.facility_name
                ?.toLowerCase()
                .includes(location.toLowerCase()) ||
              doc.pincode_demo?.includes(location),
          );
        }

        if (mounted) {
          setDoctors(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    fetchDoctors();
    return () => {
      mounted = false;
    };
  }, [consultationType, specialty, location]); // Added dependencies to trigger on search

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In this updated version, handleSearch doesn't need to manually fetch
    // since the location and specialty are in the dependency array.
    // BUT since we only want to fetch on search submit, maybe we should NOT have them in dependency array.
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Explicit Demo Context */}
      <div className="bg-slate-900 border border-cyan-800/50 rounded-2xl p-6 shadow-lg shadow-cyan-900/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-cyan-950 rounded-xl text-cyan-400">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Doctor Discovery (Demo)
            </h1>
            <p className="text-slate-400 mb-4">
              <span className="font-semibold text-cyan-400">
                Why am I seeing these doctors?
              </span>{" "}
              The ranking is entirely objective and randomized to ensure fair
              exposure. No AI bias influences this list. All data displayed is{" "}
              <span className="font-bold text-amber-400">
                SYNTHETIC DEMO DATA
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Specialty (e.g. Cardiology)"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Location or Pincode"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
        >
          Search
        </button>
      </form>

      {/* Toggles */}
      <div className="flex gap-4">
        <button
          onClick={() =>
            setConsultationType(consultationType === "Virtual" ? "" : "Virtual")
          }
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            consultationType === "Virtual"
              ? "bg-cyan-950 border border-cyan-500 text-cyan-400 shadow-sm shadow-cyan-900/50"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
          }`}
        >
          <Video className="w-4 h-4" /> Virtual
        </button>
        <button
          onClick={() =>
            setConsultationType(
              consultationType === "Physical" ? "" : "Physical",
            )
          }
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            consultationType === "Physical"
              ? "bg-cyan-950 border border-cyan-500 text-cyan-400 shadow-sm shadow-cyan-900/50"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
          }`}
        >
          <User className="w-4 h-4" /> Physical
        </button>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">
          Loading synthetic doctors...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc, idx) => (
            <div
              key={`${doc.doctor_id}-${idx}`}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-slate-900/50 group"
            >
              <div className="bg-slate-950/50 p-4 border-b border-slate-800 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {doc.doctor_name}
                  </h3>
                  <p className="text-cyan-500 text-sm font-medium">
                    {doc.specialty}
                  </p>
                </div>
                <div className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-1 rounded border border-amber-500/20 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> DEMO
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-2 text-sm text-slate-400">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />{" "}
                    {doc.facility_name}
                  </p>
                  <p className="pl-6 text-xs">
                    {doc.facility_area} Ã¢â‚¬Â¢ {doc.pincode_demo}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Video className="w-4 h-4 text-slate-500" /> Virtual
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${doc.virtual_availability === "DEMO AVAILABLE" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"}`}
                    >
                      {doc.virtual_availability || "UNAVAILABLE"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" /> Physical
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${doc.physical_availability === "DEMO AVAILABLE" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"}`}
                    >
                      {doc.physical_availability || "UNAVAILABLE"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <div className="text-[10px] text-slate-500 font-mono">
                    SYNTHETIC DEMO DOCTOR
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setBookingStep("select_type");
                      setSelectedSlotType(null);
                      setSymptoms("");
                      setSelectedTime("");
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            </div>
          ))}
          {doctors.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No demo doctors found for the selected criteria.
            </div>
          )}
        </div>
      )}
      {/* Booking Modal Prototype */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-cyan-900/20 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-500" />
                Demo Appointment
              </h2>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {bookingStep === "select_type" && (
                <div className="space-y-6">
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                    <h3 className="font-bold text-lg text-white mb-1">
                      {selectedDoctor.doctor_name}
                    </h3>
                    <p className="text-cyan-400 text-sm mb-3">
                      {selectedDoctor.specialty}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      ID: {selectedDoctor.doctor_id} |{" "}
                      {selectedDoctor.registration_id_demo}
                    </p>
                  </div>

                  <h4 className="font-semibold text-slate-200">
                    Select Mock Slot Type
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Virtual Option */}
                    <button
                      disabled={
                        selectedDoctor.virtual_availability !== "DEMO AVAILABLE"
                      }
                      onClick={() => {
                        setSelectedSlotType("Virtual");
                        setBookingStep("select_time_virtual");
                      }}
                      className="flex flex-col items-center justify-center p-6 border rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-950/50 hover:bg-cyan-950/20 border-slate-800 hover:border-cyan-500/50 group relative overflow-hidden"
                    >
                      {isDoctorOnline(selectedDoctor.doctor_id) && (
                        <div className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>{" "}
                          ONLINE NOW
                        </div>
                      )}
                      <Video className="w-8 h-8 mb-3 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      <span className="font-semibold text-slate-200 mb-1">
                        Virtual Consultation
                      </span>
                      <span className="text-xs text-slate-500">
                        Video call with doctor
                      </span>
                    </button>

                    {/* Physical Option */}
                    <button
                      disabled={
                        selectedDoctor.physical_availability !==
                        "DEMO AVAILABLE"
                      }
                      onClick={() => {
                        setSelectedSlotType("Physical");
                        setBookingStep("fill_form_physical");
                      }}
                      className="flex flex-col items-center justify-center p-6 border rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-950/50 hover:bg-cyan-950/20 border-slate-800 hover:border-cyan-500/50 group"
                    >
                      <User className="w-8 h-8 mb-3 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      <span className="font-semibold text-slate-200 mb-1">
                        Physical Visit
                      </span>
                      <span className="text-xs text-slate-500">
                        Visit facility in person
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {bookingStep === "select_time_virtual" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => setBookingStep("select_type")}
                      className="text-slate-400 hover:text-white"
                    >
                      &larr; Back
                    </button>
                    <h3 className="text-lg font-bold text-white">
                      Virtual Consultation
                    </h3>
                  </div>

                  {isDoctorOnline(selectedDoctor.doctor_id) && (
                    <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-6 text-center space-y-4">
                      <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-emerald-400 font-bold mb-1">
                          Doctor is Online Now
                        </h4>
                        <p className="text-sm text-slate-400">
                          You can bypass scheduling and connect instantly.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTime("Instant");
                          setBookingStep("in_call");
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white w-full py-3 rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all"
                      >
                        Connect Instantly
                      </button>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-slate-200 mb-3">
                      Or Schedule for Later
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Today, 14:00",
                        "Today, 16:30",
                        "Tomorrow, 10:00",
                        "Tomorrow, 11:30",
                      ].map((slot) => (
                        <button
                          key={slot}
                          onClick={() => {
                            setSelectedTime(slot);
                            setBookingStep("confirmed");
                          }}
                          className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 py-3 rounded-lg text-sm font-medium transition-colors"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === "fill_form_physical" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <button
                      onClick={() => setBookingStep("select_type")}
                      className="text-slate-400 hover:text-white"
                    >
                      &larr; Back
                    </button>
                    <h3 className="text-lg font-bold text-white">
                      Physical Visit Booking
                    </h3>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        ABHA ID (Demo Auto-filled)
                      </label>
                      <input
                        type="text"
                        disabled
                        value="14-4923-XXXX-XXXX"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300 opacity-70"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        disabled
                        value="John Doe"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300 opacity-70"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        Symptoms or Reason for Visit
                      </label>
                      <textarea
                        rows={3}
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="E.g., Fever, headache for 2 days..."
                        className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-lg px-4 py-2.5 text-white outline-none transition-colors"
                      ></textarea>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-xs font-medium text-slate-400 mb-2">
                        Available Slots
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {["Tomorrow, 09:30", "Tomorrow, 11:00"].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 rounded-lg text-sm font-medium transition-colors border ${selectedTime === slot ? "bg-cyan-900/30 border-cyan-500 text-cyan-400" : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!selectedTime}
                    onClick={() => setBookingStep("confirmed")}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-lg font-bold transition-all"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}

              {bookingStep === "confirmed" && (
                <div className="space-y-6 text-center py-8">
                  <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Mock Booking Confirmed!
                  </h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    This is a{" "}
                    <span className="font-bold text-amber-400">
                      SYNTHETIC DEMO
                    </span>
                    . No actual booking was made in any external registry.
                  </p>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left inline-block w-full max-w-sm mt-6">
                    <p className="text-xs text-slate-500 mb-1">
                      Appointment Type
                    </p>
                    <p className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                      {selectedSlotType === "Virtual" ? (
                        <Video className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <User className="w-4 h-4 text-cyan-400" />
                      )}
                      {selectedSlotType} Consultation
                    </p>
                    <p className="text-xs text-slate-500 mb-1">Time</p>
                    <p className="text-sm font-semibold text-emerald-400 mb-4">
                      {selectedTime}
                    </p>
                    <p className="text-xs text-slate-500 mb-1">Doctor</p>
                    <p className="text-sm font-semibold text-white mb-4">
                      {selectedDoctor.doctor_name}
                    </p>
                    <p className="text-xs text-slate-500 mb-1">Location</p>
                    <p className="text-sm font-semibold text-white">
                      {selectedSlotType === "Virtual"
                        ? "Secure Video Room"
                        : selectedDoctor.facility_name}
                    </p>
                  </div>

                  {/* Add Reminder Feature */}
                  <div className="w-full max-w-sm mx-auto mt-4 text-left">
                    <p className="text-sm font-semibold text-slate-300 mb-2">
                      Add to Calendar / Reminders
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={(e) => {
                          e.currentTarget.innerText = "Ã¢Å“â€œ Added";
                          e.currentTarget.className =
                            "px-3 py-1.5 text-xs rounded-lg border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 transition-colors";
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors"
                      >
                        3-4 hrs before
                      </button>
                      <button
                        onClick={(e) => {
                          e.currentTarget.innerText = "Ã¢Å“â€œ Added";
                          e.currentTarget.className =
                            "px-3 py-1.5 text-xs rounded-lg border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 transition-colors";
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors"
                      >
                        1 day before
                      </button>
                      <button
                        onClick={(e) => {
                          e.currentTarget.innerText = "Ã¢Å“â€œ Added";
                          e.currentTarget.className =
                            "px-3 py-1.5 text-xs rounded-lg border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 transition-colors";
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors"
                      >
                        3 days before
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    {selectedSlotType === "Virtual" ? (
                      <button
                        onClick={() => setBookingStep("in_call")}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center mx-auto gap-2"
                      >
                        <Video className="w-5 h-5" /> Join Prototype Call
                      </button>
                    ) : (
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(selectedDoctor.facility_name || "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center mx-auto gap-2 w-fit"
                      >
                        <MapPin className="w-5 h-5" /> Navigate to Facility
                      </a>
                    )}
                  </div>
                </div>
              )}

              {bookingStep === "in_call" && (
                <div className="flex flex-col h-[75vh] min-h-[500px] bg-black rounded-xl overflow-hidden relative border border-slate-800">
                  <iframe
                    src={`https://meet.jit.si/ArogyaGridDemo_${selectedDoctor.doctor_id}_Room`}
                    allow="camera; microphone; fullscreen; display-capture"
                    className="w-full h-full border-0"
                  ></iframe>
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-mono text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    DEMO CONSULTATION ROOM
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* eSanjeevani Direct Link Section */}
      <div className="mt-16 max-w-2xl mx-auto">
        <a
          href="https://esanjeevani.mohfw.gov.in"
          target="_blank"
          rel="noreferrer"
          className="group block bg-[#11131A] border border-emerald-500/20 p-6 rounded-3xl hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  eSanjeevani Telemedicine
                </h3>
                <p className="text-sm text-slate-400">
                  Access the National Teleconsultation Service (Reference)
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-400" />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
