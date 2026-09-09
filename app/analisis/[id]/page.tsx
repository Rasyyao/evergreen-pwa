"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { DetectionResultView } from "@/components/DetectionResultView";
import { supabase, type DetectionRow } from "@/lib/supabase";
import type { DetectionResult } from "@/lib/detection";

export default function AnalisisDetailPage() {
  const params = useParams<{ id: string }>();
  const [row, setRow] = useState<DetectionRow | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("detections")
      .select("id, created_at, image_data_url, summary, detection_count, detections")
      .eq("id", params.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        setRow(error ? null : (data as DetectionRow));
      });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (row === undefined) {
    return null;
  }

  if (row === null) {
    notFound();
  }

  const result: DetectionResult = {
    id: row.id,
    detections: (row.detections as DetectionResult["detections"]) ?? [],
    count: row.detection_count,
    summary: row.summary,
  };

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

      <DetectionResultView
        result={result}
        imageDataUrl={row.image_data_url}
        timestamp={row.created_at}
      />
    </div>
  );
}
