"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import type { Lahan } from "@/lib/mock-data";
import { lahanStatusStyles, type LahanStatus } from "@/lib/mock-data";
import { computeLahanGrid, type LahanGridCell } from "@/lib/lahan-grid";

const GRID_RESOLUTION = 6;

function MapLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-emerald-950">
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
        <span className="text-xs font-medium text-emerald-200">Memuat peta satelit&hellip;</span>
      </div>
    </div>
  );
}

interface LahanMapGridProps {
  lahan: Lahan;
  selectedThreatStatus?: "all" | LahanStatus | null;
  onFilterChange?: (status: "all" | LahanStatus) => void;
}

export function LahanMapGrid({
  lahan,
  selectedThreatStatus = null,
  onFilterChange,
}: LahanMapGridProps) {
  const [LeafletMap, setLeafletMap] = useState<ComponentType<{
    lahan: Lahan;
    activeFilter?: "all" | "bahaya" | "waspada" | "aman";
    selectedCellId?: string | null;
    onSelectCell?: (cell: LahanGridCell | null) => void;
  }> | null>(null);

  const [activeFilter, setActiveFilter] = useState<"all" | LahanStatus>(
    selectedThreatStatus ?? "all"
  );
  const [selectedCell, setSelectedCell] = useState<LahanGridCell | null>(null);

  // Sync external filter changes (e.g. if user clicks a prediction card from parent)
  useEffect(() => {
    if (selectedThreatStatus) {
      setActiveFilter(selectedThreatStatus);
    }
  }, [selectedThreatStatus]);

  const gridCells = useMemo(() => computeLahanGrid(lahan, GRID_RESOLUTION), [lahan]);

  const stats = useMemo(() => {
    const bahaya = gridCells.filter((c) => c.status === "bahaya");
    const waspada = gridCells.filter((c) => c.status === "waspada");
    const aman = gridCells.filter((c) => c.status === "aman");

    const totalPredPct = gridCells.reduce((acc, c) => acc + c.prediction.predictabilityPct, 0);
    const avgPredictability = Math.round(totalPredPct / gridCells.length);

    const bahayaThreat = bahaya[0]?.prediction.threatName ?? "Hama Tingkat Tinggi";
    const waspadaThreat = waspada[0]?.prediction.threatName ?? "Gulma & Gejala Awal";

    return {
      bahayaCount: bahaya.length,
      waspadaCount: waspada.length,
      amanCount: aman.length,
      avgPredictability,
      bahayaThreat,
      waspadaThreat,
      riskRatio: Math.round(((bahaya.length + waspada.length) / gridCells.length) * 100),
    };
  }, [gridCells]);

  useEffect(() => {
    let mounted = true;
    import("./LahanLeafletMap").then((mod) => {
      if (mounted) setLeafletMap(() => mod.default);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleFilter = (filter: "all" | LahanStatus) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
    // If selected cell doesn't match filter, clear it
    if (filter !== "all" && selectedCell && selectedCell.status !== filter) {
      setSelectedCell(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ── Toggle Filter Header & Map Card ── */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/90 shadow-md bg-white">
        {/* Top Control Bar */}
        <div className="bg-emerald-950 px-4 py-3 text-white">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                Peta Prediksi Lahan &middot; Robot AI
              </span>
            </div>
            <span className="rounded-full bg-emerald-900/80 border border-emerald-700/60 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              Akurasi {stats.avgPredictability}%
            </span>
          </div>

          {/* Toggle buttons to switch which risk part to view */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {/* All toggle */}
            <button
              type="button"
              onClick={() => handleToggleFilter("all")}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                activeFilter === "all"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "bg-emerald-900/60 text-emerald-200/90 hover:bg-emerald-800/80 border border-emerald-800/60"
              }`}
            >
              <span>Semua Grid</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                activeFilter === "all" ? "bg-emerald-100 text-emerald-900" : "bg-emerald-950 text-emerald-300"
              }`}>
                {gridCells.length}
              </span>
            </button>

            {/* Bahaya toggle */}
            {stats.bahayaCount > 0 && (
              <button
                type="button"
                onClick={() => handleToggleFilter("bahaya")}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                  activeFilter === "bahaya"
                    ? "bg-rose-500 text-white shadow-xs ring-2 ring-rose-300/50"
                    : "bg-rose-950/60 text-rose-300 hover:bg-rose-900/80 border border-rose-800/60"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span>Bahaya</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  activeFilter === "bahaya" ? "bg-rose-700 text-white" : "bg-rose-900 text-rose-200"
                }`}>
                  {stats.bahayaCount}
                </span>
              </button>
            )}

            {/* Waspada toggle */}
            {stats.waspadaCount > 0 && (
              <button
                type="button"
                onClick={() => handleToggleFilter("waspada")}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                  activeFilter === "waspada"
                    ? "bg-amber-500 text-zinc-950 shadow-xs ring-2 ring-amber-300/50"
                    : "bg-amber-950/60 text-amber-300 hover:bg-amber-900/80 border border-amber-800/60"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Waspada</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  activeFilter === "waspada" ? "bg-amber-600 text-white" : "bg-amber-900 text-amber-200"
                }`}>
                  {stats.waspadaCount}
                </span>
              </button>
            )}

            {/* Aman toggle */}
            <button
              type="button"
              onClick={() => handleToggleFilter("aman")}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                activeFilter === "aman"
                  ? "bg-emerald-500 text-white shadow-xs ring-2 ring-emerald-300/50"
                  : "bg-emerald-900/60 text-emerald-200/90 hover:bg-emerald-800/80 border border-emerald-800/60"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Aman</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                activeFilter === "aman" ? "bg-emerald-700 text-white" : "bg-emerald-950 text-emerald-300"
              }`}>
                {stats.amanCount}
              </span>
            </button>
          </div>
        </div>

        {/* Map Viewport */}
        <div className="h-72 w-full relative">
          {LeafletMap ? (
            <LeafletMap
              lahan={lahan}
              activeFilter={activeFilter}
              selectedCellId={selectedCell?.id ?? null}
              onSelectCell={(cell) => setSelectedCell(cell)}
            />
          ) : (
            <MapLoading />
          )}

          {/* Hint Overlay pill */}
          <div className="absolute top-2.5 right-2.5 z-[1000] pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[10px] font-semibold text-white/90 shadow-xs">
              <svg className="w-3 h-3 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Klik grid untuk detail
            </span>
          </div>
        </div>

        {/* Dynamic Filter Context Note */}
        <div className="bg-zinc-50 border-t border-zinc-200/80 px-4 py-2.5 flex items-center justify-between">
          <p className="text-[11px] text-zinc-600">
            {activeFilter === "all" ? (
              <span>
                Menampilkan <strong>{gridCells.length} titik grid</strong> &middot; {stats.riskRatio}% area terindikasi risiko
              </span>
            ) : activeFilter === "bahaya" ? (
              <span className="text-rose-700 font-medium inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-2.032-1.5-2.898 0L2.697 16.126zM12 17.25h.007v.008H12v-.008z" />
                </svg>
                <span>Menyorot <strong>{stats.bahayaCount} titik bahaya</strong> &middot; Prediksi: {stats.bahayaThreat}</span>
              </span>
            ) : activeFilter === "waspada" ? (
              <span className="text-amber-800 font-medium inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Menyorot <strong>{stats.waspadaCount} titik waspada</strong> &middot; Prediksi: {stats.waspadaThreat}</span>
              </span>
            ) : (
              <span className="text-emerald-700 font-medium inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9S3 7.03 3 12a9 9 0 0 0 9 9zm0 0v-7m0 0a4 4 0 0 1 4-4" />
                </svg>
                <span>Menyorot <strong>{stats.amanCount} titik optimal</strong> &middot; Bebas indikasi ancaman</span>
              </span>
            )}
          </p>

          {activeFilter !== "all" && (
            <button
              type="button"
              onClick={() => handleToggleFilter("all")}
              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 underline shrink-0 ml-2"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* ── Interactive Grid Inspector Card (When a cell is selected) ── */}
      {selectedCell && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-tight text-zinc-900">
                  Detail Grid {selectedCell.gridCode}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    lahanStatusStyles[selectedCell.status].badge
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${lahanStatusStyles[selectedCell.status].dot}`} />
                  {lahanStatusStyles[selectedCell.status].label}
                </span>
              </div>
              <p className="text-[11px] font-bold text-zinc-700 mt-1">
                {selectedCell.prediction.threatName}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCell(null)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition active:scale-95"
              aria-label="Tutup detail grid"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Predictability Progress Meter */}
          <div className="mb-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-[11px] font-bold text-zinc-700">Tingkat Prediktabilitas AI</span>
              </div>
              <span className={`text-xs font-black ${
                selectedCell.status === "bahaya"
                  ? "text-rose-600"
                  : selectedCell.status === "waspada"
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}>
                {selectedCell.prediction.predictabilityPct}% Akurat
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-zinc-200/80 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedCell.status === "bahaya"
                    ? "bg-rose-500"
                    : selectedCell.status === "waspada"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${selectedCell.prediction.predictabilityPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-zinc-400">
              Dihitung berdasarkan model deep learning multispektral robot pemetaan Farmora.
            </p>
          </div>

          {/* Based on what data (Berdasarkan Data Apa) */}
          <div className="mb-3.5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
              <svg className="w-3 h-3 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Berdasarkan Data Parameter Sensor
            </h4>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-2 text-center">
                <span className="text-[10px] text-zinc-400 block font-medium">Kelembapan</span>
                <span className="text-xs font-bold text-zinc-900 mt-0.5 block">
                  {selectedCell.prediction.dataSources.moisturePct}%
                </span>
              </div>
              <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-2 text-center">
                <span className="text-[10px] text-zinc-400 block font-medium">Suhu Tanah</span>
                <span className="text-xs font-bold text-zinc-900 mt-0.5 block">
                  {selectedCell.prediction.dataSources.soilTempC}&deg;C
                </span>
              </div>
              <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-2 text-center">
                <span className="text-[10px] text-zinc-400 block font-medium">pH Tanah</span>
                <span className="text-xs font-bold text-zinc-900 mt-0.5 block">
                  {selectedCell.prediction.dataSources.ph}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-2.5">
              <span className="text-[10px] font-bold text-zinc-600 block mb-0.5">
                Temuan Sensor Robot:
              </span>
              <p className="text-[11px] text-zinc-700 leading-relaxed italic">
                &ldquo;{selectedCell.prediction.dataSources.sensorScan}&rdquo;
              </p>
            </div>
          </div>

          {/* How to prevent it (Cara Pencegahan & Penanganan) */}
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-3.5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <h4 className="text-[11px] font-bold text-emerald-950">
                  Cara Pencegahan &amp; Penanganan
                </h4>
              </div>
              <span className="rounded-full bg-emerald-200/80 px-2 py-0.5 text-[9px] font-black text-emerald-900 uppercase">
                {selectedCell.prediction.prevention.urgency}
              </span>
            </div>

            {/* Immediate Action */}
            <div className="mb-2.5 rounded-xl bg-white/90 p-2.5 border border-emerald-100 shadow-2xs">
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 block mb-0.5">
                Tindakan Segera ({selectedCell.prediction.prevention.actionType})
              </span>
              <p className="text-xs font-bold text-zinc-900 leading-snug">
                {selectedCell.prediction.prevention.immediateAction}
              </p>
            </div>

            {/* Prevention steps list */}
            <div>
              <span className="text-[10px] font-bold text-emerald-800 block mb-1">
                Langkah Pencegahan Preventif:
              </span>
              <ul className="flex flex-col gap-1 text-[11px] text-emerald-900">
                {selectedCell.prediction.prevention.preventionTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-emerald-500 font-bold shrink-0">&bull;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
