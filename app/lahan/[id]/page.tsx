"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getLahanById, getLahanOverallStatus, lahanStatusStyles } from "@/lib/mock-data";
import { LahanMapGrid } from "@/components/lahan/LahanMapGrid";
import { LandConditionGrid } from "@/components/home/LandConditionGrid";

export default function LahanDetailPage() {
  const params = useParams<{ id: string }>();
  const lahan = getLahanById(params.id);

  if (!lahan) {
    notFound();
  }

  const status = getLahanOverallStatus(lahan);
  const style = lahanStatusStyles[status];

  return (
    <div className="flex flex-col gap-4 pb-8 bg-[#f8fafc] text-zinc-900 animate-in fade-in duration-200">
      {/* Mobile Top Header with Back Button */}
      <div className="flex items-center justify-between px-4 pt-4">
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
          Detail Lahan
        </span>
        <div className="w-9" />
      </div>

      <div className="flex flex-col gap-4 px-4">
        {/* Header Card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-md shadow-emerald-700/20">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">{lahan.name}</h1>
              <p className="text-xs text-emerald-100">
                {lahan.location} &middot; {lahan.komoditas} &middot; {lahan.areaHa} ha
              </p>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur`}>
              <span className={`h-2 w-2 rounded-full ${style.dot}`} />
              {style.label}
            </span>
          </div>
          <p className="mt-3 text-[11px] text-emerald-100">
            {lahan.deviceStatus === "connected" ? "Sensor aktif" : "Sensor offline"} &middot; Update {lahan.lastUpdated.toLowerCase()}
          </p>
        </section>

        {/* Mapping Result */}
        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Hasil Mapping Lahan
            </h2>
          </div>
          <LahanMapGrid lahan={lahan} />
        </section>

        {/* Land Condition Metrics */}
        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Kondisi Lahan Terkini
            </h2>
          </div>
          <LandConditionGrid condition={lahan.condition} />
        </section>
      </div>
    </div>
  );
}
