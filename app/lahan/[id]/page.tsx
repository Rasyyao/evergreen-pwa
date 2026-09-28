"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  getLahanById,
  getLahanOverallStatus,
  lahanStatusStyles,
  getZonePredictions,
  type LahanStatus,
} from "@/lib/mock-data";
import { LahanMapGrid } from "@/components/lahan/LahanMapGrid";
import { LandConditionGrid } from "@/components/home/LandConditionGrid";

export default function LahanDetailPage() {
  const params = useParams<{ id: string }>();
  const lahan = getLahanById(params.id);

  const [activeMapFilter, setActiveMapFilter] = useState<"all" | LahanStatus>("all");
  const mapSectionRef = useRef<HTMLDivElement>(null);

  if (!lahan) {
    notFound();
  }

  const status = getLahanOverallStatus(lahan);
  const style = lahanStatusStyles[status];
  const isConnected = lahan.deviceStatus === "connected";
  const predictions = getZonePredictions(lahan.id);
  const bahayaPreds = predictions.filter((p) => p.zoneStatus === "bahaya");
  const waspadaPreds = predictions.filter((p) => p.zoneStatus === "waspada");

  const handleToggleThreatOnMap = (zoneStatus: LahanStatus) => {
    setActiveMapFilter(zoneStatus);
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f4f6f9] animate-in fade-in duration-200">

      {/* ── Sticky Top Nav ── */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#f4f6f9]/90 backdrop-blur border-b border-zinc-200/60">
        <Link
          href="/lahan"
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white border border-zinc-200 shadow-xs text-zinc-700 transition active:scale-90"
          aria-label="Kembali ke daftar lahan"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {lahan.name}
        </span>
        {/* Status dot on the right */}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${style.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {style.label}
        </span>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4 pb-8">

        {/* ── Header Card ── */}
        <section
          className="relative rounded-3xl p-5 text-white shadow-md overflow-hidden"
          style={{ background: "linear-gradient(145deg, #065f46 0%, #047857 50%, #0f766e 100%)" }}
        >
          {/* Decorative blobs — inside their own clip wrapper */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div
              className="absolute -top-6 -right-6 h-36 w-36 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #34d399, transparent 70%)" }}
            />
            <div
              className="absolute bottom-0 left-4 h-24 w-24 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #6ee7b7, transparent 70%)" }}
            />
          </div>

          <div className="relative">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white">{lahan.name}</h1>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  {lahan.location}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur text-white">
                <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                {style.label}
              </span>
            </div>

            {/* Stats row */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "Komoditas", value: lahan.komoditas },
                { label: "Luas Area", value: `${lahan.areaHa} ha` },
                { label: "Sensor", value: isConnected ? "Aktif" : "Offline" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center rounded-2xl py-2.5 px-1 text-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
                >
                  <span className="text-sm font-bold text-white leading-tight">{s.value}</span>
                  <span className="mt-0.5 text-[10px] font-medium text-emerald-200/70">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Update timestamp */}
            <div className="mt-3 flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"}`}
              />
              <p className="text-[10px] text-emerald-100/70">
                {isConnected ? "Sensor aktif" : "Sensor offline"} · Update {lahan.lastUpdated.toLowerCase()}
              </p>
            </div>
          </div>
        </section>

        {/* ── Mapping Result with Risk Toggles ── */}
        <section ref={mapSectionRef}>
          <div className="mb-2 flex items-center justify-between px-0.5">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Hasil Mapping &amp; Prediksi Grid
              </h2>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Pilih filter risiko untuk menyorot grid &amp; klik untuk data pencegahan
              </p>
            </div>
          </div>
          <LahanMapGrid
            lahan={lahan}
            selectedThreatStatus={activeMapFilter}
            onFilterChange={setActiveMapFilter}
          />
        </section>

        {/* ── Zone Predictions & Threat Prevention ── */}
        {predictions.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between px-0.5">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Prediksi Ancaman Zona
                </h2>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Hasil scan robot mapping · {predictions.length} temuan risiko
                </p>
              </div>
              {/* Summary counts */}
              <div className="flex items-center gap-1.5">
                {bahayaPreds.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200/80 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    {bahayaPreds.length} Bahaya
                  </span>
                )}
                {waspadaPreds.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {waspadaPreds.length} Waspada
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Sort: bahaya first */}
              {[...predictions]
                .sort((a) => (a.zoneStatus === "bahaya" ? -1 : 1))
                .map((pred) => {
                  const isBahaya = pred.zoneStatus === "bahaya";
                  const isFocused = activeMapFilter === pred.zoneStatus;
                  const urgencyColor =
                    pred.urgency === "Segera"
                      ? "bg-rose-50 text-rose-700 border-rose-200/80"
                      : pred.urgency === "Dalam 3 Hari"
                      ? "bg-amber-50 text-amber-700 border-amber-200/80"
                      : "bg-sky-50 text-sky-700 border-sky-200/80";
                  const actionColor =
                    pred.actionType === "Pestisida"
                      ? "bg-violet-50 text-violet-700"
                      : pred.actionType === "Herbisida"
                      ? "bg-teal-50 text-teal-700"
                      : "bg-sky-50 text-sky-700";

                  return (
                    <div
                      key={pred.id}
                      className={`rounded-3xl border bg-white p-4 shadow-xs transition-all duration-200 ${
                        isFocused
                          ? isBahaya
                            ? "border-rose-400 ring-2 ring-rose-200 shadow-md"
                            : "border-amber-400 ring-2 ring-amber-200 shadow-md"
                          : isBahaya
                          ? "border-rose-200/80"
                          : "border-amber-200/80"
                      }`}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          {/* Zone badge */}
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                              isBahaya
                                ? "bg-rose-100 text-rose-600"
                                : "bg-amber-100 text-amber-600"
                            }`}
                          >
                            {isBahaya ? (
                              <svg className="w-4 h-4 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-2.032-1.5-2.898 0L2.697 16.126zM12 17.25h.007v.008H12v-.008z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            )}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-zinc-900 leading-tight">
                              {pred.threat}
                            </p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              {pred.detectedAt} · {pred.affectedCells} zona terdampak
                            </p>
                          </div>
                        </div>

                        {/* Urgency chip */}
                        <span
                          className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-black tracking-wide uppercase ${urgencyColor}`}
                        >
                          {pred.urgency}
                        </span>
                      </div>

                      {/* Confidence bar & Predictability Score */}
                      <div className="mb-3 rounded-2xl bg-zinc-50 border border-zinc-100 p-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-zinc-500 font-medium">
                            Tingkat Prediktabilitas AI
                          </span>
                          <span className={`text-[11px] font-black ${ isBahaya ? "text-rose-600" : "text-amber-600" }`}>
                            {Math.round(pred.confidence * 100)}% Kepastian
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-200/70 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${ isBahaya ? "bg-rose-500" : "bg-amber-500" }`}
                            style={{ width: `${pred.confidence * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Based on what data chips */}
                      <div className="mb-3">
                        <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400 block mb-1.5">
                          Berdasarkan Data Sensor:
                        </span>
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 font-medium text-zinc-700">
                            <svg className="w-3 h-3 text-sky-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </svg>
                            <span>Kelembapan {isBahaya ? "<22% (Kering Ekstrem)" : "27% (Waspada)"}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 font-medium text-zinc-700">
                            <svg className="w-3 h-3 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                            </svg>
                            <span>Suhu {lahan.condition.soilTempC}&deg;C</span>
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 font-medium text-zinc-700">
                            <svg className="w-3 h-3 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            <span>Kamera Robot AI (NDVI Spektral)</span>
                          </span>
                        </div>
                      </div>

                      {/* Recommended action & prevention */}
                      <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-3 mb-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[9px] font-black rounded-full px-2 py-0.5 uppercase ${actionColor}`}>
                            {pred.actionType}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-600">Cara Mencegah &amp; Mengatasi</span>
                        </div>
                        <p className="text-[11px] text-zinc-800 leading-relaxed font-medium">
                          {pred.action}
                        </p>
                      </div>

                      {/* Toggle / Sorot di Peta button */}
                      <button
                        type="button"
                        onClick={() => handleToggleThreatOnMap(pred.zoneStatus)}
                        className={`w-full flex items-center justify-center gap-2 rounded-2xl py-2 px-3 text-xs font-bold transition active:scale-98 ${
                          isFocused
                            ? "bg-zinc-900 text-white shadow-xs"
                            : isBahaya
                            ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                            : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                          <path d="M12 2v3m0 14v3M2 12h3m14 0h3" strokeWidth="2"/>
                        </svg>
                        <span>
                          {isFocused
                            ? "Sedang Disorot di Peta (Lihat ke Atas)"
                            : `Sorot ${pred.affectedCells} Grid di Peta`}
                        </span>
                      </button>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* ── Land Condition Metrics ── */}
        <section>
          <div className="mb-2.5 flex items-center justify-between px-0.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Kondisi Lahan Terkini
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <LandConditionGrid condition={lahan.condition} />
        </section>

        {/* ── Analisis AI CTA (bottom — "what's next") ──
        <section>
          <div className="mb-2.5 px-0.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Deteksi &amp; Analisis
            </h2>
          </div>
          <Link
            href={`/deteksi?lahan=${encodeURIComponent(lahan.name)}`}
            className="group flex w-full items-center justify-between rounded-3xl p-5 transition active:scale-[0.98] shadow-lg shadow-emerald-600/15"
            style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)" }}
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="m12 3 1.91 5.09L19 10l-5.09 1.91L12 17l-1.91-5.09L5 10l5.09-1.91L12 3zM19 17l.95 2.05L22 20l-2.05.95L19 23l-.95-2.05L16 20l2.05-.95L19 17z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-extrabold text-white tracking-tight">Analisis dengan AI</p>
                <p className="text-[11px] text-white/60 mt-0.5">
                  Scan hama &amp; gulma · {lahan.name}
                </p>
              </div>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20 transition group-hover:bg-white/25">
              <svg
                className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </section> */}

      </div>
    </div>
  );
}
