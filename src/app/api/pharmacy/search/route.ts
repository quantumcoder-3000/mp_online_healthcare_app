import { NextRequest, NextResponse } from "next/server";
import { Pharmacy } from "@/types/prescription";

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude } = await request.json();

    if (!latitude || !longitude) {
      return NextResponse.json({ success: false, error: "Missing location data" }, { status: 400 });
    }

    const DEMO_PHARMACIES: Pharmacy[] = [
      {
        id: "PHARM-1",
        name: "Apollo Pharmacy",
        address: "MP Nagar Zone 1, Bhopal",
        latitude: latitude + 0.005,
        longitude: longitude + 0.005,
        phone: "+91 9876543210",
        isOpen: true,
        mapsUrl: "https://maps.google.com/?q=Apollo+Pharmacy",
        distanceMeters: 850,
        etaMinutes: 4,
      },
      {
        id: "PHARM-2",
        name: "Sanjeevani Medical Store",
        address: "Habibganj, Bhopal",
        latitude: latitude - 0.008,
        longitude: longitude - 0.003,
        phone: null,
        isOpen: true,
        mapsUrl: "https://maps.google.com/?q=Sanjeevani",
        distanceMeters: 1200,
        etaMinutes: 7,
      },
      {
        id: "PHARM-3",
        name: "Wellness Forever",
        address: "Arera Colony, Bhopal",
        latitude: latitude + 0.015,
        longitude: longitude - 0.01,
        phone: "+91 1122334455",
        isOpen: false,
        mapsUrl: "https://maps.google.com/?q=Wellness+Forever",
        distanceMeters: 2500,
        etaMinutes: 12,
      },
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Sort by distance
    DEMO_PHARMACIES.sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));

    return NextResponse.json({ success: true, data: DEMO_PHARMACIES }, { status: 200 });

  } catch (error: unknown) {
    console.error("Pharmacy search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search nearby pharmacies." },
      { status: 500 }
    );
  }
}
