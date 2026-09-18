"use client";

import { getHomeData } from "@/lib/mock-data";
import { DeviceCard } from "@/components/home/DeviceCard";
import { LandConditionGrid } from "@/components/home/LandConditionGrid";
import { ActivityHistoryList } from "@/components/home/ActivityHistoryList";
import { useAuth } from "@/context/AuthContext";
import { EverGreenLogoIcon } from "@/components/icons";

export default function HomePage() {
  const { device, landCondition, activityHistory } = getHomeData();
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-4 bg-[#f8fafc] text-zinc-900 animate-in fade-in duration-200">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-emerald-700">Selamat bertani,</p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {user?.name || "Rasya Pratama"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-600/30">
            <EverGreenLogoIcon className="h-5 w-5" />
          </div>
        </div>
      </header>

      <DeviceCard device={device} />

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
