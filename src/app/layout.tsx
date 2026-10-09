import type { Metadata } from "next";`nimport Script from "next/script";
import "./globals.css";
import { CareFlowProvider } from "@/context/CareFlowContext";
import { PrescriptionProvider } from "@/context/PrescriptionContext";
import { Header } from "@/components/common/Header";
import { QuoteBanner } from "@/components/common/QuoteBanner";

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
      <head></head>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        <div id="google_translate_element" style={{ display: "none" }}></div>
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: "en", autoDisplay: false}, "google_translate_element");
            }
          `}
        </Script>
        <CareFlowProvider>
          <PrescriptionProvider>
                        <Header />
            <QuoteBanner />
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </PrescriptionProvider>
        </CareFlowProvider>
      </body>
    </html>
  );
}



