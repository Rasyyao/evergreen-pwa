"use client";

import { useState } from "react";
import { getActivityLog, type ActivityPeriod } from "@/lib/mock-data";
import { PlantIcon, ShieldIcon, SignalIcon } from "../icons";

const PERIODS: { value: ActivityPeriod; label: string }[] = [
  { value: "harian", label: "Harian" },
  { value: "mingguan", label: "Mingguan" },
  { value: "bulanan", label: "Bulanan" },
];

export function AktivitasView() {
  const [period, setPeriod] = useState<ActivityPeriod>("harian");
  const log = getActivityLog(period);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Period Segmented Control */}
      <div className="flex rounded-2xl bg-zinc-200/70 p-1 border border-zinc-200">
        {PERIODS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setPeriod(item.value)}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              period === item.value
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Summary Highlight Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-md shadow-emerald-700/20">
        <p className="text-[11px] font-medium text-emerald-100 uppercase tracking-wider">
          Total Area Tercover ({period})
        </p>
        <p className="mt-0.5 text-3xl font-extrabold tracking-tight">
          {log.summary.totalAreaHa} <span className="text-base font-semibold text-emerald-200">ha</span>
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/20 pt-3 text-center">
          <div className="rounded-xl bg-white/10 p-2 backdrop-blur-xs">
            <p className="text-[10px] text-emerald-100 uppercase">Penyemprotan</p>
            <p className="text-sm font-bold mt-0.5">{log.summary.totalSprayCount}x</p>
          </div>
          <div className="rounded-xl bg-white/10 p-2 backdrop-blur-xs">
            <p className="text-[10px] text-emerald-100 uppercase">Pestisida</p>
            <p className="text-sm font-bold mt-0.5">{log.summary.pesticideL} L</p>
          </div>
          <div className="rounded-xl bg-white/10 p-2 backdrop-blur-xs">
            <p className="text-[10px] text-emerald-100 uppercase">Herbisida</p>
            <p className="text-sm font-bold mt-0.5">{log.summary.herbicideL} L</p>
          </div>
        </div>
      </section>

      {/* Log Entries List */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Daftar Log Penyemprotan
          </span>
          <span className="text-[11px] font-semibold text-emerald-700">
            {log.entries.length} Catatan
          </span>
        </div>

        {log.entries.map((entry, index) => (
          <div
            key={`${entry.time}-${index}`}
            className="flex items-center justify-between rounded-3xl border border-zinc-200/90 bg-white p-3.5 shadow-xs transition hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100">
                {entry.type === "Herbisida" ? (
                  <PlantIcon className="h-4 w-4" />
                ) : entry.type === "Pestisida" ? (
                  <ShieldIcon className="h-4 w-4" />
                ) : (
                  <SignalIcon className="h-4 w-4" />
                )}
              </span>
              <div>
                <p className="text-xs font-bold text-zinc-900">{entry.type}</p>
                <p className="text-[11px] text-zinc-500">
                  Target: {entry.target} &middot; {entry.time}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="rounded-xl bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-800">
                {entry.volumeL > 0 ? `${entry.volumeL} L` : "Monitoring"}
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
