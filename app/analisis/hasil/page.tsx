"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DetectionResultView } from "@/components/DetectionResultView";
import { DETECTION_STORAGE_KEY, type StoredDetection } from "@/lib/detection";

export default function HasilDeteksiPage() {
  const router = useRouter();
  const [data, setData] = useState<StoredDetection | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DETECTION_STORAGE_KEY);
      setData(raw ? (JSON.parse(raw) as StoredDetection) : null);
    } catch {
      setData(null);
    }
  }, []);

  if (data === undefined) {
    return null;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-6 text-center bg-[#f8fafc]">
        <p className="text-sm text-zinc-500">Belum ada hasil deteksi.</p>
        <button
          type="button"
          onClick={() => router.push("/deteksi")}
          className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold tracking-wide shadow-md active:scale-95 transition cursor-pointer"
        >
          Buka Kamera Deteksi
        </button>
      </div>
    );
  }

  const { result, imageDataUrl, timestamp } = data;

  return (
    <div className="flex flex-col gap-4 pb-8 bg-[#f8fafc] text-zinc-900 animate-in fade-in duration-200">
      {/* Mobile Top Header with Back Button */}
      <div className="flex items-center justify-between px-4 pt-4">
        <Link
          href="/analisis"
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white border border-zinc-200 shadow-xs text-zinc-700 transition active:scale-90"
          aria-label="Kembali ke daftar analisis"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
          Detail Deteksi AI
        </span>
        <div className="w-9" />
      </div>

      <DetectionResultView result={result} imageDataUrl={imageDataUrl} timestamp={timestamp} />
    </div>
  );
}
