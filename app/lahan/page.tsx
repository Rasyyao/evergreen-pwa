import { getLahanList, getLahanOverallStatus, lahanStatusStyles } from "@/lib/mock-data";
import { LahanCard } from "@/components/lahan/LahanCard";
import { MapIcon } from "@/components/icons";

export default function LahanPage() {
  const lahanList = getLahanList();
  const totalArea = lahanList.reduce((s, l) => s + l.areaHa, 0).toFixed(1);
  const activeCount = lahanList.filter((l) => l.deviceStatus === "connected").length;

  const statusCount = {
    bahaya: lahanList.filter((l) => getLahanOverallStatus(l) === "bahaya").length,
    waspada: lahanList.filter((l) => getLahanOverallStatus(l) === "waspada").length,
    aman: lahanList.filter((l) => getLahanOverallStatus(l) === "aman").length,
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f4f6f9]">
      {/* ── Hero Header ── */}
      <div
        className="relative overflow-hidden px-5 pt-10 pb-8"
        style={{
          background: "linear-gradient(145deg, #052e16 0%, #064e3b 55%, #065f46 100%)",
        }}
      >
        {/* decorative blobs */}
        <div
          className="pointer-events-none absolute -top-8 -right-8 h-44 w-44 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #34d399, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-6 h-28 w-28 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #6ee7b7, transparent 70%)" }}
        />

        <div className="relative flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-400/30">
            <MapIcon className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Peta Lahan</h1>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Monitoring & pemetaan seluruh lahan aktif
            </p>
          </div>
        </div>

        {/* ── Summary stats ── */}
        <div className="relative mt-5 grid grid-cols-3 gap-2.5">
          {[
            { label: "Total Lahan", value: lahanList.length, unit: "lahan" },
            { label: "Total Area", value: totalArea, unit: "ha" },
            { label: "Sensor Aktif", value: `${activeCount}/${lahanList.length}`, unit: "" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-2xl py-3 px-2 text-center"
              style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
            >
              <span className="text-xl font-bold text-white">
                {stat.value}
                {stat.unit && (
                  <span className="ml-0.5 text-[11px] font-medium text-emerald-300">
                    {stat.unit}
                  </span>
                )}
              </span>
              <span className="mt-0.5 text-[10px] font-medium text-emerald-200/70">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Status Summary Bar ── */}
      <div className="mx-4 -mt-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-md shadow-black/5 z-10 relative">
        {(["bahaya", "waspada", "aman"] as const).map((s) => {
          const st = lahanStatusStyles[s];
          return (
            <div key={s} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${st.dot}`} />
              <span className="text-[11px] font-semibold text-zinc-600">
                {st.label}{" "}
                <span className="text-zinc-400">({statusCount[s]})</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Lahan Cards ── */}
      <div className="flex flex-col gap-2.5 px-4 pt-4 pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-0.5">
          Semua Lahan
        </p>
        {lahanList.map((lahan) => (
          <LahanCard key={lahan.id} lahan={lahan} />
        ))}
      </div>
    </div>
  );
}
