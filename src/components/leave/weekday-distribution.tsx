"use client";

import { AlertTriangle } from "lucide-react";
import type { WeekdayDistribution } from "@/components/leave/data";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeekdayDistributionChart({ data }: { data: WeekdayDistribution }) {
  const max = Math.max(1, ...data.sickByDow);
  const total = data.sickByDow.reduce((s, d) => s + d, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm font-semibold text-foreground">Sick-day distribution</h3>
        <span className="text-[11px] text-muted-foreground tabular-nums">{total} day{total !== 1 ? "s" : ""}</span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-4">
        Where sick leave landed across days of the week, last 12 months.
      </p>

      <div className="flex items-end gap-2 h-24">
        {data.sickByDow.map((count, i) => {
          const pct = (count / max) * 100;
          const isWeekend = i >= 5;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-sm ${
                    count === 0 ? "bg-secondary/60" : isWeekend ? "bg-muted-foreground/40" : count >= 2 ? "bg-destructive" : "bg-warning"
                  }`}
                  style={{ height: count > 0 ? `${Math.max(15, pct)}%` : "6%" }}
                  title={`${DAY_LABELS[i]}: ${count} sick day${count !== 1 ? "s" : ""}`}
                />
              </div>
              <div className="text-center">
                <p className={`text-[10px] tabular-nums ${count >= 2 ? "text-destructive font-medium" : "text-foreground"}`}>{count}</p>
                <p className="text-[9px] text-muted-foreground/60">{DAY_LABELS[i]}</p>
              </div>
            </div>
          );
        })}
      </div>

      {data.patternNote && (
        <div className="mt-4 pt-3 border-t border-border flex items-start gap-2 text-[11px]">
          <AlertTriangle className="size-3 text-warning shrink-0 mt-0.5" />
          <p className="text-foreground leading-snug">{data.patternNote}</p>
        </div>
      )}
    </div>
  );
}
