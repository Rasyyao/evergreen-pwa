import Link from "next/link";
import { SeverityBadge } from "@/components/SeverityBadge";
import { supabase } from "@/lib/supabase";
import type { Severity } from "@/lib/mock-data";

export default async function AnalisisPage() {
  const { data: rows, error } = await supabase
    .from("detections")
    .select("id, created_at, image_data_url, top_species, top_confidence, top_severity, detection_count")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal memuat riwayat analisis:", error.message);
  }

  const entries = rows ?? [];

  return (
    <div className="flex flex-col gap-4 px-4 pt-5 pb-6 bg-[#f8fafc] text-zinc-900 animate-in fade-in duration-200">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Riwayat Analisis</h1>
          <p className="text-xs text-zinc-500">
            Hasil deteksi komputer vision hama &amp; gulma
          </p>
        </div>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
          {entries.length} data
        </span>
      </header>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white/60 py-10 text-center">
          <p className="text-sm text-zinc-500">Belum ada riwayat analisis.</p>
          <Link
            href="/deteksi"
            className="mt-1 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold tracking-wide shadow-md active:scale-95 transition"
          >
            Mulai Deteksi
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/analisis/${entry.id}`}
              className="group flex items-center gap-3.5 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-xs transition hover:border-zinc-300 active:scale-[0.98]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="relative h-15 w-15 shrink-0 overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200/70">
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
        </div>
      )}
    </div>
  );
}
