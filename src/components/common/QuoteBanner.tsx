"use client";

import { usePathname } from "next/navigation";

export function QuoteBanner() {
  const pathname = usePathname();
  
  // Only show on Home (/) and Doctor Portal (/discovery)
  if (pathname !== "/" && pathname !== "/discovery") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-gradient-to-r from-[#0d1218] via-[#121b22] to-[#0d1218] p-4 md:p-6 rounded-2xl border border-slate-800/50 shadow-xl">
        <div className="text-center">
          <p className="text-sm md:text-base font-medium text-slate-300 italic mb-2 leading-relaxed">
            &quot;I dream of a Digital India where quality healthcare percolates right up to the remotest regions powered by e-Healthcare.&quot;
          </p>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Shri Narendra Modi <span className="text-xs text-slate-400 font-medium ml-2 font-normal">Hon&apos;ble Prime Minister of India</span>
          </h3>
        </div>
      </div>
    </div>
  );
}
