import type { ActivityEvent } from "@/lib/mock-data";
import { PestIcon, PlantIcon, SignalIcon } from "../icons";

export function ActivityHistoryList({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="space-y-2.5 rounded-3xl border border-zinc-200/90 bg-white p-3.5 shadow-xs max-h-72 overflow-y-auto no-scrollbar">
      {events.map((event, index) => {
        const isWeed = event.action.includes("Gulma");
        const isPest = event.action.includes("Hama");

        return (
          <div
            key={`${event.time}-${index}`}
            className="flex items-center justify-between rounded-2xl bg-zinc-50/70 p-3 transition hover:bg-zinc-100/70"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isWeed
                    ? "bg-emerald-100 text-emerald-700"
                    : isPest
                    ? "bg-rose-100 text-rose-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {isWeed ? (
                  <PlantIcon className="h-4 w-4" />
                ) : isPest ? (
                  <PestIcon className="h-4 w-4" />
                ) : (
                  <SignalIcon className="h-4 w-4" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-zinc-900">{event.action}</p>
                <p className="text-[11px] text-zinc-500 truncate">{event.detail}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-lg bg-white border border-zinc-200/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
              {event.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}
