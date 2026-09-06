import type { LandCondition } from "@/lib/mock-data";
import { FlaskIcon, SunIcon, ThermometerIcon, WaterDropIcon } from "../icons";

function MetricCard({
  label,
  value,
  unit,
  icon,
  indicator,
  colorClass,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  indicator: string;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/90 bg-white p-4 shadow-xs transition hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className={`flex h-8 w-8 items-center justify-center rounded-2xl ${colorClass}`}>
          {icon}
        </span>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          {indicator}
        </span>
      </div>
      <div className="mt-3">
        <p className="text-[11px] font-medium text-zinc-500">{label}</p>
        <p className="mt-0.5 text-xl font-bold tracking-tight text-zinc-900">
          {value}
          {unit && <span className="ml-1 text-xs font-semibold text-zinc-400">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

export function LandConditionGrid({ condition }: { condition: LandCondition }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard
        label="Kelembapan Tanah"
        value={condition.moisturePct}
        unit="%"
        icon={<WaterDropIcon className="h-4 w-4" />}
        indicator="Optimal"
        colorClass="bg-blue-50 text-blue-600 border border-blue-100"
      />
      <MetricCard
        label="Suhu Tanah"
        value={condition.soilTempC}
        unit="°C"
        icon={<ThermometerIcon className="h-4 w-4" />}
        indicator="Normal"
        colorClass="bg-amber-50 text-amber-600 border border-amber-100"
      />
      <MetricCard
        label="pH Tanah"
        value={condition.ph.toFixed(1)}
        icon={<FlaskIcon className="h-4 w-4" />}
        indicator="Netral"
        colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100"
      />
      <MetricCard
        label="Intensitas Cahaya"
        value={condition.lightLevel}
        icon={<SunIcon className="h-4 w-4" />}
        indicator="Cukup"
        colorClass="bg-orange-50 text-orange-600 border border-orange-100"
      />
    </div>
  );
}
