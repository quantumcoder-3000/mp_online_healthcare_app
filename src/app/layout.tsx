import type { Metadata } from "next";
import "./globals.css";
import { CareFlowProvider } from "@/context/CareFlowContext";
import { PrescriptionProvider } from "@/context/PrescriptionContext";
import { Header } from "@/components/common/Header";

export const metadata: Metadata = {
  title: "ArogyaGrid - Emergency Healthcare Network & Destination Intelligence",
  description:
    "Real Google Maps routing, traffic-aware ETA calculation, and deterministic hospital destination recommendation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        <CareFlowProvider>
          <PrescriptionProvider>
                        <Header />
            {/* Global Prime Minister Quote Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-gradient-to-r from-[#0d1218] via-[#121b22] to-[#0d1218] p-4 md:p-6 rounded-2xl border border-slate-800/50 shadow-xl">
                <div className="text-center">
                  <p className="text-sm md:text-base font-medium text-slate-300 italic mb-2 leading-relaxed">
                    &quot;I dream of a Digital India where quality healthcare percolates right up to the remotest regions powered by e-Healthcare.&quot;
                  </p>
                  <h3 className="text-sm font-bold text-white tracking-tight">Shri Narendra Modi <span className="text-xs text-slate-400 font-medium ml-2 font-normal">Hon&apos;ble Prime Minister of India</span></h3>
                </div>
              </div>
            </div>
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </PrescriptionProvider>
        </CareFlowProvider>
      </body>
    </html>
  );
}
