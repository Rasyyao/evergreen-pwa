import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnalisisDetail } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/SeverityBadge";
import { SparklesIcon } from "@/components/icons";

export default async function AnalisisDetailPage(props: PageProps<"/analisis/[id]">) {
  const { id } = await props.params;
  const entry = getAnalisisDetail(id);

  if (!entry) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 pb-8 bg-[#f8fafc] text-zinc-900 animate-in fade-in duration-200">
      {/* Mobile Top Header with Back Button */}
      <div className="flex items-center justify-between px-4 pt-4">
        <Link
          href="/analisis"
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white border border-zinc-200 shadow-xs text-zinc-700 transition active:scale-90"
          aria-label="Kembali ke daftar analisis"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
          Detail Deteksi AI
        </span>
        <div className="w-9" />
      </div>

      {/* Title & Timestamp */}
      <div className="px-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Hasil Analisis AI
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">{entry.datetime}</p>
      </div>

      {/* Detection Image with Bounding Box Container */}
      <div className="relative mx-4 overflow-hidden rounded-3xl bg-zinc-100 border border-zinc-200/90 shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entry.imageUrl}
          alt={`Deteksi ${entry.species}`}
          className="aspect-[4/3] w-full object-cover"
        />
        <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white">
          Bounding Box Aktif
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4">
        {/* Species & Severity Card */}
        <section className="rounded-3xl border border-zinc-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Spesies Terdeteksi
              </p>
              <h2 className="text-lg font-bold text-zinc-900 mt-0.5">
                {entry.species}
              </h2>
            </div>
            <SeverityBadge severity={entry.severity} />
          </div>
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-zinc-100">
            <span className="text-xs text-zinc-500">Tingkat Keyakinan Model</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-md">
              {Math.round(entry.confidence * 100)}% Cocok
            </span>
          </div>
        </section>

        {/* AI Plain Language Explanation */}
        <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <SparklesIcon className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Diagnosa &amp; Penjelasan AI
              </h3>
            </div>
            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              Sistem Pakar
            </span>
          </div>
          <p className="text-xs leading-relaxed text-emerald-950/90">
            {entry.explanation}
          </p>
        </section>

        {/* Action Recommendation Card */}
        <section className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-slate-950 p-5 text-white shadow-md shadow-zinc-950/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Rekomendasi Presisi
            </span>
            <span className="text-[11px] text-zinc-400">IoT Nozzle Ready</span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-lg font-bold text-white">{entry.recommendation.type}</p>
              <p className="text-xs text-zinc-300 mt-0.5">
                Target terkalibrasi: {entry.species}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">
                {entry.recommendation.doseMl}
              </span>
              <span className="ml-1 text-xs text-zinc-300 font-semibold">mL / tangki</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
