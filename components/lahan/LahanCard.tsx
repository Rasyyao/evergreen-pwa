import Link from "next/link";
import type { Lahan } from "@/lib/mock-data";
import { getLahanOverallStatus, lahanStatusStyles } from "@/lib/mock-data";
import { MapIcon } from "../icons";

export function LahanCard({ lahan }: { lahan: Lahan }) {
  const status = getLahanOverallStatus(lahan);
  const style = lahanStatusStyles[status];
  const isConnected = lahan.deviceStatus === "connected";

  return (
    <Link
      href={`/lahan/${lahan.id}`}
      className="group flex items-center gap-3.5 rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs transition hover:border-zinc-300 active:scale-[0.98]"
    >
      <div
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border"
        style={{ backgroundColor: `${style.hex}1a`, borderColor: `${style.hex}40`, color: style.hex }}
      >
        <MapIcon className="h-6 w-6" />
        <span className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${style.dot}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1.5 mb-0.5">
          <p className="truncate font-semibold text-sm text-zinc-900">{lahan.name}</p>
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {style.label}
          </span>
        </div>
        <p className="text-[11px] text-zinc-400">
          {lahan.location} &middot; {lahan.komoditas} &middot; {lahan.areaHa} ha
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span
            className={`text-[11px] font-medium ${
              isConnected ? "text-emerald-700" : "text-zinc-400"
            }`}
          >
            {isConnected ? "Sensor Aktif" : "Sensor Offline"} &middot; {lahan.lastUpdated}
          </span>
          <span className="text-[11px] text-zinc-400 group-hover:text-zinc-700 transition">
            Peta &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
