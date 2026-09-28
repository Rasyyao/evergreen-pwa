import Link from "next/link";
import { SeverityBadge } from "@/components/SeverityBadge";
import { supabase } from "@/lib/supabase";
import type { Severity } from "@/lib/mock-data";
import { AnalisisIcon } from "@/components/icons";

export default async function AnalisisPage() {
  const { data: rows, error } = await supabase
    .from("detections")
    .select("id, created_at, image_data_url, top_species, top_confidence, top_severity, detection_count")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal memuat riwayat analisis:", error.message);
  }

  const entries = rows ?? [];

  const tinggiCount = entries.filter((e) => e.top_severity === "Tinggi").length;
  const sedangCount = entries.filter((e) => e.top_severity === "Sedang").length;
  const rendahCount = entries.filter((e) => e.top_severity === "Rendah").length;

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
            <AnalisisIcon className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Riwayat Analisis</h1>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Hasil deteksi komputer vision hama &amp; gulma
            </p>
          </div>
        </div>

        {/* ── Summary stats ── */}
        <div className="relative mt-5 grid grid-cols-3 gap-2.5">
          {[
            { label: "Total Deteksi", value: entries.length, unit: "data" },
            { label: "Bahaya Tinggi", value: tinggiCount, unit: "" },
            { label: "Perlu Tindakan", value: tinggiCount + sedangCount, unit: "" },
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

      {/* ── Severity Summary Bar ── */}
      <div className="mx-4 -mt-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-md shadow-black/5 z-10 relative">
        {(
          [
            { label: "Tinggi", count: tinggiCount, dot: "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)]" },
            { label: "Sedang", count: sedangCount, dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]" },
            { label: "Rendah", count: rendahCount, dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" },
          ] as const
        ).map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            <span className="text-[11px] font-semibold text-zinc-600">
              {s.label} <span className="text-zinc-400">({s.count})</span>
            </span>
          </div>
        ))}
      </div>

      {/* ── Entry List ── */}
      <div className="flex flex-col gap-2.5 px-4 pt-4 pb-6">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white/70 py-12 text-center mt-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
              <AnalisisIcon className="h-6 w-6 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-600">Belum ada riwayat analisis</p>
              <p className="text-xs text-zinc-400 mt-0.5">Mulai deteksi untuk melihat hasil di sini</p>
            </div>
            <Link
              href="/deteksi"
              className="mt-1 px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold tracking-wide shadow-md active:scale-95 transition"
            >
              Mulai Deteksi
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-0.5">
              Semua Hasil
            </p>
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/analisis/${entry.id}`}
                className="group flex items-center gap-3.5 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-xs transition hover:border-zinc-300 active:scale-[0.98]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200/70">
                  <img
                    src={entry.image_data_url}
                    alt={entry.top_species ?? "Hasil deteksi"}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <p className="truncate font-semibold text-sm text-zinc-900">
                      {entry.top_species ?? "Tidak ada deteksi"}
                    </p>
                    {entry.top_severity && (
                      <SeverityBadge severity={entry.top_severity as Severity} />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {new Date(entry.created_at).toLocaleString("id-ID")}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-emerald-700">
                      {entry.top_confidence != null
                        ? `Akurasi ${Math.round(entry.top_confidence * 100)}%`
                        : `${entry.detection_count} deteksi`}
                    </span>
                    <span className="text-[11px] text-zinc-400 group-hover:text-zinc-700 transition">
                      Detail &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
