"use client";

import { useState } from "react";
import type { Device } from "@/lib/mock-data";
import { BatteryIcon } from "../icons";

export function DeviceCard({ device: initialDevice }: { device: Device }) {
  const [device, setDevice] = useState(initialDevice);
  const isConnected = device.status === "connected";

  const toggleConnection = () => {
    setDevice((prev) => ({
      ...prev,
      status: prev.status === "connected" ? "disconnected" : "connected",
    }));
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-5 text-white shadow-md shadow-emerald-900/30" style={{ background: "linear-gradient(145deg, #065f46 0%, #047857 50%, #0f766e 100%)" }}>
      {/* Decorative leaf/mesh watermark */}
      <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/10 blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        {/* Toggleable Connection Button */}
        <button
          type="button"
          onClick={toggleConnection}
          className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur transition active:scale-95 hover:bg-white/25"
          title="Klik untuk mengubah status koneksi (Demo)"
        >
          <span
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              isConnected ? "bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" : "bg-rose-300"
            }`}
          />
          <span className="text-emerald-50">
            {isConnected ? "IoT Terhubung" : "Terputus (Offline)"}
          </span>
          <span className="text-[10px] text-emerald-200 underline ml-0.5">Ubah</span>
        </button>

        {/* Battery Indicator */}
        <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-emerald-50 backdrop-blur">
          <BatteryIcon className="h-4 w-4" />
          <span>{device.battery}%</span>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
            ID Perangkat Aktif
          </p>
          <p className="text-xl font-bold tracking-tight text-white">{device.id}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-emerald-200">Frekuensi Update</p>
          <p className="text-xs font-semibold text-emerald-100">Tiap 30 Detik</p>
        </div>
      </div>
    </div>
  );
}
