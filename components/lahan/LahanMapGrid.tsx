"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import type { Lahan } from "@/lib/mock-data";
import { lahanStatusStyles } from "@/lib/mock-data";
import { computeLahanGrid } from "@/lib/lahan-grid";

const GRID_RESOLUTION = 6;

function MapLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-emerald-950">
      <span className="text-xs font-medium text-emerald-200">Memuat peta&hellip;</span>
    </div>
  );
}

export function LahanMapGrid({ lahan }: { lahan: Lahan }) {
  const statuses: (keyof typeof lahanStatusStyles)[] = ["aman", "waspada", "bahaya"];
  const [LeafletMap, setLeafletMap] = useState<ComponentType<{ lahan: Lahan }> | null>(null);
  const gridCells = useMemo(() => computeLahanGrid(lahan, GRID_RESOLUTION), [lahan]);

  useEffect(() => {
    let mounted = true;
    import("./LahanLeafletMap").then((mod) => {
      if (mounted) setLeafletMap(() => mod.default);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/90 shadow-md">
        <div className="flex items-center justify-between bg-emerald-950 px-4 py-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
            Peta Lahan &middot; Tampak Atas
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>

        <div className="h-72 w-full">
          {LeafletMap ? <LeafletMap lahan={lahan} /> : <MapLoading />}
        </div>

        <p className="bg-emerald-950 px-4 py-2 text-[10px] text-emerald-200/80">
          Update {lahan.lastUpdated.toLowerCase()} &middot; {gridCells.length} titik sensor
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200/90 bg-white px-4 py-3 shadow-xs">
        {statuses.map((status) => {
          const style = lahanStatusStyles[status];
          const count = gridCells.filter((cell) => cell.status === status).length;
          return (
            <div key={status} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
              <span className="text-[11px] font-semibold text-zinc-700">
                {style.label} <span className="text-zinc-400">({count})</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
