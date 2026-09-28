"use client";

import Link from "next/link";
import { getHomeData } from "@/lib/mock-data";
import { DeviceCard } from "@/components/home/DeviceCard";
import { LandConditionGrid } from "@/components/home/LandConditionGrid";
import { ActivityHistoryList } from "@/components/home/ActivityHistoryList";
import { useAuth } from "@/context/AuthContext";
import { AgrivaLogoIcon, MapIcon } from "@/components/icons";

export default function HomePage() {
  const { device, landCondition, activityHistory } = getHomeData();
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-4 bg-[#f8fafc] text-zinc-900 animate-in fade-in duration-200">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-emerald-700">Selamat bertani,</p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {user?.name || "Rasya "}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/30">
            <AgrivaLogoIcon className="h-5 w-5" />
          </div>
        </div>
      </header>

      <DeviceCard device={device} />

      {/* <Link
        href="/lahan"
        className="group flex items-center justify-between rounded-3xl border border-zinc-200/90 bg-white p-4 shadow-xs transition hover:shadow-sm active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <MapIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-zinc-900">Peta Lahan</p>
            <p className="text-[11px] text-zinc-500">Lihat mapping &amp; kondisi tiap lahan</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
          Buka &rarr;
        </span>
      </Link> */}

      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Kondisi Lahan Terkini
          </h2>
          <span className="text-[11px] font-semibold text-emerald-700">Sensor Aktif</span>
        </div>
        <LandConditionGrid condition={landCondition} />
      </section>

      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Aktivitas Perangkat
          </h2>
          <span className="text-[11px] font-semibold text-zinc-400">Riwayat Terkini</span>
        </div>
        <ActivityHistoryList events={activityHistory} />
      </section>
    </div>
  );
}
