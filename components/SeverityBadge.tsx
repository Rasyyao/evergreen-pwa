import type { Severity } from "@/lib/mock-data";

const severityStyles: Record<Severity, string> = {
  Rendah: "bg-emerald-50 text-emerald-700",
  Sedang: "bg-amber-50 text-amber-700",
  Tinggi: "bg-rose-50 text-rose-700",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${severityStyles[severity]}`}
    >
      {severity}
    </span>
  );
}
