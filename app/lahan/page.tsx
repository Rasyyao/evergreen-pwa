import { getLahanList } from "@/lib/mock-data";
import { LahanCard } from "@/components/lahan/LahanCard";

export default function LahanPage() {
  const lahanList = getLahanList();

  return (
    <div className="flex flex-col gap-4 px-4 pt-5 pb-6 bg-[#f8fafc] text-zinc-900 animate-in fade-in duration-200">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Peta Lahan</h1>
          <p className="text-xs text-zinc-500">Pilih lahan untuk lihat hasil mapping</p>
        </div>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
          {lahanList.length} lahan
        </span>
      </header>

      <div className="flex flex-col gap-2.5">
        {lahanList.map((lahan) => (
          <LahanCard key={lahan.id} lahan={lahan} />
        ))}
      </div>
    </div>
  );
}
