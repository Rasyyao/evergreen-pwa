"use client";

import { useState } from "react";
import { SeverityBadge } from "@/components/SeverityBadge";
import { SparklesIcon } from "@/components/icons";
import type { DetectionResult } from "@/lib/detection";

const severityStroke: Record<string, string> = {
  Rendah: "#10b981",
  Sedang: "#f59e0b",
  Tinggi: "#f43f5e",
};

export function DetectionResultView({
  result,
  imageDataUrl,
  timestamp,
}: {
  result: DetectionResult;
  imageDataUrl: string;
  timestamp: string;
}) {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const topDetection = result.detections[0];

  return (
    <>
      {/* Title & Timestamp */}
      <div className="px-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Hasil Analisis AI</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          {new Date(timestamp).toLocaleString("id-ID")}
        </p>
      </div>

      {/* Detection Image with Bounding Box Overlay */}
      <div className="relative mx-4 overflow-hidden rounded-3xl bg-zinc-100 border border-zinc-200/90 shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageDataUrl}
          alt="Hasil deteksi"
          className="w-full h-auto block"
          onLoad={(e) => {
            const img = e.currentTarget;
            setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
          }}
        />
        {naturalSize && result.detections.length > 0 && (
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${naturalSize.w} ${naturalSize.h}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {result.detections.map((d, i) => {
              const [x, y, w, h] = d.bbox;
              const color = severityStroke[d.severity] ?? "#10b981";
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="none"
                    stroke={color}
                    strokeWidth={Math.max(naturalSize.w, naturalSize.h) * 0.006}
                    rx={4}
                  />
                  <text
                    x={x}
                    y={Math.max(y - 6, 12)}
                    fill={color}
                    fontSize={Math.max(naturalSize.w, naturalSize.h) * 0.028}
                    fontWeight={700}
                  >
                    {d.display_name} {Math.round(d.confidence * 100)}%
                  </text>
                </g>
              );
            })}
          </svg>
        )}
        <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white">
          {result.count} Deteksi
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4">
        {/* Species & Severity Card(s) */}
        {result.detections.length === 0 ? (
          <section className="rounded-3xl border border-zinc-200/90 bg-white p-4 shadow-xs text-center">
            <p className="text-sm text-zinc-500">
              Tidak ada gulma atau hama yang terdeteksi pada gambar ini.
            </p>
          </section>
        ) : (
          <section className="rounded-3xl border border-zinc-200/90 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Spesies Terdeteksi
                </p>
                <h2 className="text-lg font-bold text-zinc-900 mt-0.5">
                  {topDetection.display_name}
                </h2>
              </div>
              <SeverityBadge severity={topDetection.severity} />
            </div>
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-zinc-100">
              <span className="text-xs text-zinc-500">Tingkat Keyakinan Model</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-md">
                {Math.round(topDetection.confidence * 100)}% Cocok
              </span>
            </div>

            {result.detections.length > 1 && (
              <div className="mt-3 pt-3 border-t border-zinc-100 flex flex-col gap-2">
                {result.detections.slice(1).map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-700 font-medium">{d.display_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">{Math.round(d.confidence * 100)}%</span>
                      <SeverityBadge severity={d.severity} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* AI Plain Language Explanation */}
        <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <SparklesIcon className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Diagnosa &amp; Penjelasan AI
              </h3>
            </div>
            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              Sistem Pakar
            </span>
          </div>
          <FormattedSummary text={result.summary} />
        </section>
      </div>
    </>
  );
}

// Renders a small subset of markdown (**bold** and *italic*) used by the AI summary text.
function FormattedSummary({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <p className="text-xs leading-relaxed text-emerald-950/90 whitespace-pre-line">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
