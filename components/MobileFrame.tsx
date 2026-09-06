"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function MobileFrame({
  children,
  bottomNav,
}: {
  children: React.ReactNode;
  bottomNav?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDeteksi = pathname === "/deteksi";

  return (
    <div className="min-h-[100dvh] w-full bg-[#f8fafc] md:bg-slate-950 flex flex-col items-center justify-center p-0 md:py-6 md:px-4">
      {/* Top Banner Bar - ONLY visible on Desktop */}
      <div className="hidden md:flex items-center gap-3 mb-3 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs shadow-lg backdrop-blur select-none">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-emerald-400">FARMORA Mobile Preview</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">390 × 844 px</span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold tracking-wide uppercase">
          Mobile Viewport
        </span>
      </div>

      {/* Main Container: Full screen edge-to-edge on Mobile; Framed Chassis on Desktop */}
      <div className="relative w-full h-[100dvh] md:max-w-[390px] md:h-[844px] md:max-h-[94vh] rounded-none md:rounded-[40px] bg-[#f8fafc] text-zinc-900 shadow-none md:shadow-2xl ring-0 md:ring-1 md:ring-slate-800 border-0 md:border-[7px] md:border-slate-800 flex flex-col overflow-hidden">
        {/* Scrollable Main Screen Content (Locked to non-scrollable on /deteksi) */}
        <main
          className={`relative flex-1 w-full h-full ${
            isDeteksi
              ? "overflow-hidden bg-black touch-none overscroll-none"
              : "overflow-y-auto no-scrollbar bg-[#f8fafc]"
          } flex flex-col`}
        >
          {children}
        </main>

        {/* Docked Bottom Navigation firmly anchored above device bottom safe area */}
        {bottomNav && (
          <div className="shrink-0 w-full relative z-40">
            {bottomNav}
          </div>
        )}
      </div>
    </div>
  );
}
