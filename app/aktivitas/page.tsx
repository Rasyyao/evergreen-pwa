import { AktivitasView } from "@/components/aktivitas/AktivitasView";

export default function AktivitasPage() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-5 pb-6 bg-[#f8fafc] text-zinc-900 animate-in fade-in duration-200">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Aktivitas Lahan</h1>
        <p className="text-xs text-zinc-500">Laporan log penyemprotan &amp; monitoring</p>
      </header>

      <AktivitasView />
    </div>
  );
}
