"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Rectangle, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Lahan } from "@/lib/mock-data";
import { getLahanOverallStatus, lahanStatusStyles } from "@/lib/mock-data";
import { computeLahanGrid } from "@/lib/lahan-grid";

const GRID_RESOLUTION = 6;

function boundaryPinIcon(number: number) {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:28px;height:36px;">
        <svg width="28" height="36" viewBox="0 0 28 36" style="position:absolute;top:0;left:0;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.35));">
          <path d="M14 0C6.3 0 0 6.3 0 14c0 9.3 14 22 14 22s14-12.7 14-22C28 6.3 21.7 0 14 0Z" fill="#dc2626" stroke="white" stroke-width="2"/>
        </svg>
        <span style="position:absolute;top:5px;left:0;width:28px;text-align:center;color:white;font-weight:700;font-size:12px;font-family:inherit;">${number}</span>
      </div>
    `,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  });
}

function FitToBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [32, 32], maxZoom: 18 });
    }
  }, [map, positions]);
  return null;
}

export default function LahanLeafletMap({ lahan }: { lahan: Lahan }) {
  const overallStatus = getLahanOverallStatus(lahan);
  const overallStyle = lahanStatusStyles[overallStatus];

  const boundaryPositions = useMemo(
    () => lahan.boundary.map(([lat, lng]) => [lat, lng] as [number, number]),
    [lahan.boundary],
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

      <Rectangle
        bounds={[
          [Math.min(...boundaryPositions.map((p) => p[0])), Math.min(...boundaryPositions.map((p) => p[1]))],
          [Math.max(...boundaryPositions.map((p) => p[0])), Math.max(...boundaryPositions.map((p) => p[1]))],
        ]}
        pathOptions={{
          color: overallStyle.hex,
          weight: 3,
          fillOpacity: 0,
        }}
      />

      {gridCells.map((cell) => {
        const style = lahanStatusStyles[cell.status];
        return (
          <Rectangle
            key={cell.id}
            bounds={cell.bounds}
            pathOptions={{
              color: style.hex,
              weight: 1,
              fillColor: style.hex,
              fillOpacity: 0.4,
            }}
          />
        );
      })}

      {gridCells.map((cell) => {
        const style = lahanStatusStyles[cell.status];
        return (
          <CircleMarker
            key={`${cell.id}-point`}
            center={cell.center}
            radius={6}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: style.hex,
              fillOpacity: 0.95,
            }}
          >
            <Popup>
              <div className="text-xs font-sans">
                <p className="font-bold">{cell.id.split("-").pop()}</p>
                <p>Status: {style.label}</p>
                <p>Kelembapan: {cell.moisturePct}%</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      <FitToBounds positions={boundaryPositions} />
    </MapContainer>
  );
}
