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
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </PrescriptionProvider>
        </CareFlowProvider>
      </body>
    </html>
  );
}
