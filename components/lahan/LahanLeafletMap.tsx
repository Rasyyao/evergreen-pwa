"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Rectangle, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Lahan } from "@/lib/mock-data";
import { getLahanOverallStatus, lahanStatusStyles } from "@/lib/mock-data";
import { computeLahanGrid, type LahanGridCell } from "@/lib/lahan-grid";

const GRID_RESOLUTION = 6;

function FitToBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [32, 32], maxZoom: 18 });
    }
  }, [map, positions]);
  return null;
}

interface LahanLeafletMapProps {
  lahan: Lahan;
  activeFilter?: "all" | "bahaya" | "waspada" | "aman";
  selectedCellId?: string | null;
  onSelectCell?: (cell: LahanGridCell | null) => void;
}

export default function LahanLeafletMap({
  lahan,
  activeFilter = "all",
  selectedCellId = null,
  onSelectCell,
}: LahanLeafletMapProps) {
  const overallStatus = getLahanOverallStatus(lahan);
  const overallStyle = lahanStatusStyles[overallStatus];

  const boundaryPositions = useMemo(
    () => lahan.boundary.map(([lat, lng]) => [lat, lng] as [number, number]),
    [lahan.boundary]
  );

  const gridCells = useMemo(() => computeLahanGrid(lahan, GRID_RESOLUTION), [lahan]);

  return (
    <MapContainer
      center={lahan.center}
      zoom={18}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer
        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        maxZoom={20}
        maxNativeZoom={20}
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />

      {/* Lahan Outer Boundary */}
      <Rectangle
        bounds={[
          [Math.min(...boundaryPositions.map((p) => p[0])), Math.min(...boundaryPositions.map((p) => p[1]))],
          [Math.max(...boundaryPositions.map((p) => p[0])), Math.max(...boundaryPositions.map((p) => p[1]))],
        ]}
        pathOptions={{
          color: overallStyle.hex,
          weight: 2.5,
          fillOpacity: 0,
        }}
      />

      {/* Grid Rectangles */}
      {gridCells.map((cell) => {
        const style = lahanStatusStyles[cell.status];
        const isSelected = cell.id === selectedCellId;
        const isMatch = activeFilter === "all" || cell.status === activeFilter;

        return (
          <Rectangle
            key={`rect-${cell.id}`}
            bounds={cell.bounds}
            eventHandlers={{
              click: () => onSelectCell?.(cell),
            }}
            pathOptions={{
              color: isSelected ? "#ffffff" : isMatch ? style.hex : "#94a3b8",
              weight: isSelected ? 3 : isMatch ? 1.5 : 0.6,
              fillColor: style.hex,
              fillOpacity: isMatch ? (isSelected ? 0.65 : 0.42) : 0.08,
              dashArray: !isMatch ? "3 3" : undefined,
            }}
          />
        );
      })}

      {/* Grid Center Points with Comprehensive Popup */}
      {gridCells.map((cell) => {
        const style = lahanStatusStyles[cell.status];
        const isSelected = cell.id === selectedCellId;
        const isMatch = activeFilter === "all" || cell.status === activeFilter;
        const { prediction } = cell;

        return (
          <CircleMarker
            key={`marker-${cell.id}`}
            center={cell.center}
            radius={isSelected ? 8 : isMatch ? (cell.status === "bahaya" ? 7 : 6) : 4}
            eventHandlers={{
              click: () => onSelectCell?.(cell),
            }}
            pathOptions={{
              color: isSelected ? "#facc15" : "#ffffff",
              weight: isSelected ? 3 : 2,
              fillColor: style.hex,
              fillOpacity: isMatch ? 0.95 : 0.25,
            }}
          >
            <Popup minWidth={260} maxWidth={300} className="farmora-map-popup">
              <div className="p-0.5 text-zinc-800">
                {/* Header */}
                <div className="flex items-center justify-between gap-1.5 border-b border-zinc-100 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-zinc-900 tracking-tight">
                      {cell.gridCode}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${style.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      {style.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider block">
                      Prediktabilitas
                    </span>
                    <span className="text-xs font-black text-emerald-600">
                      {prediction.predictabilityPct}% AI
                    </span>
                  </div>
                </div>

                {/* Threat / Risk Section */}
                <div className="mb-2">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Prediksi Ancaman
                  </div>
                  <p className="text-xs font-bold text-zinc-900 mt-0.5 leading-snug flex items-center gap-1.5">
                    {cell.status === "bahaya" ? (
                      <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-2.032-1.5-2.898 0L2.697 16.126zM12 17.25h.007v.008H12v-.008z" />
                      </svg>
                    ) : cell.status === "waspada" ? (
                      <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9S3 7.03 3 12a9 9 0 0 0 9 9zm0 0v-7m0 0a4 4 0 0 1 4-4" />
                      </svg>
                    )}
                    <span>{prediction.threatName}</span>
                  </p>
                </div>

                {/* Predictability Progress Bar */}
                <div className="mb-2.5">
                  <div className="flex items-center justify-between text-[9px] text-zinc-500 mb-1">
                    <span>Akurasi Model Prediksi</span>
                    <span className="font-bold text-zinc-700">{prediction.predictabilityPct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cell.status === "bahaya"
                          ? "bg-rose-500"
                          : cell.status === "waspada"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${prediction.predictabilityPct}%` }}
                    />
                  </div>
                </div>

                {/* Based on what data */}
                <div className="mb-2.5 rounded-xl bg-zinc-50 p-2 border border-zinc-100/80">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Berdasarkan Data:
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-zinc-600">
                    <div>
                      Kelembapan: <strong className="text-zinc-800">{prediction.dataSources.moisturePct}%</strong>
                    </div>
                    <div>
                      Suhu: <strong className="text-zinc-800">{prediction.dataSources.soilTempC}&deg;C</strong>
                    </div>
                    <div>
                      pH Tanah: <strong className="text-zinc-800">{prediction.dataSources.ph}</strong>
                    </div>
                    <div>
                      Urgensi: <strong className="text-zinc-800">{prediction.prevention.urgency}</strong>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[9px] text-zinc-500 leading-tight italic border-t border-zinc-200/60 pt-1">
                    {prediction.dataSources.sensorScan}
                  </p>
                </div>

                {/* Prevention guidance */}
                <div className="rounded-xl bg-emerald-50/80 border border-emerald-100 p-2">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 mb-0.5">
                    Cara Pencegahan &amp; Tindakan:
                  </div>
                  <p className="text-[10px] font-semibold text-emerald-950 leading-snug">
                    {prediction.prevention.immediateAction}
                  </p>
                  {prediction.prevention.preventionTips[0] && (
                    <p className="text-[9px] text-emerald-700 mt-1 leading-tight">
                      &bull; {prediction.prevention.preventionTips[0]}
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      <FitToBounds positions={boundaryPositions} />
    </MapContainer>
  );
}
