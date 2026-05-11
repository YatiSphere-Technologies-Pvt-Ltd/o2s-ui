"use client";

import { TrendingUp } from "lucide-react";
import type { AbsencePoint } from "@/components/leave/data";

export function AbsenteeismChart({ points }: { points: AbsencePoint[] }) {
  const data = points.map((p) => ({
    ...p,
    rate: p.workingDaysAvail > 0 ? (p.daysLost / p.workingDaysAvail) * 100 : 0,
  }));
  const max = Math.max(...data.map((d) => d.rate), 5);
  const avg = data.reduce((s, d) => s + d.rate, 0) / data.length;
  const latest = data[data.length - 1]?.rate ?? 0;
  const trend = data.length >= 2 ? latest - data[data.length - 2].rate : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm font-semibold text-foreground">Absenteeism rate</h3>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {latest.toFixed(1)}% this month
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-4">
        Days lost ÷ working days available, last 6 months. Includes all leave types.
      </p>

      <div className="flex items-end gap-3 h-32">
        {data.map((d) => {
          const pct = (d.rate / max) * 100;
          const tint = d.rate >= avg * 1.25 ? "bg-warning" : "bg-brand";
          return (
            <div key={d.monthISO} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-md ${tint}`}
                  style={{ height: `${Math.max(8, pct)}%`, transition: "height 250ms ease" }}
                  title={`${d.monthLabel}: ${d.rate.toFixed(1)}% (${d.daysLost} of ${d.workingDaysAvail} working days)`}
                />
              </div>
              <div className="text-center">
                <p className="text-xs tabular-nums text-foreground">{d.rate.toFixed(1)}%</p>
                <p className="text-[10px] text-muted-foreground">{d.monthLabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-[11px]">
        <span className="text-muted-foreground">6-month average</span>
        <span className="inline-flex items-center gap-1.5 text-foreground">
          <TrendingUp className={`size-3 ${trend > 0 ? "text-warning" : "text-success"}`} />
          <span className="tabular-nums">{avg.toFixed(1)}%</span>
          <span className={`text-[10px] ${trend > 0 ? "text-warning" : "text-success"}`}>
            {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend).toFixed(1)}% MoM
          </span>
        </span>
      </div>
    </div>
  );
}
