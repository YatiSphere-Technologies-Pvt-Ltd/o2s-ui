"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { CapacityPoint } from "@/components/leave/data";

interface Props {
  points: CapacityPoint[];
}

export function TeamCapacitySparkline({ points }: Props) {
  if (points.length === 0) return null;

  // Use a bar chart for capacity utilisation per week.
  const minAvailable = Math.min(...points.map((p) => p.available));
  const minWeek = points.find((p) => p.available === minAvailable);
  const minUtilization = minWeek ? Math.round((minWeek.available / minWeek.total) * 100) : 100;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm font-semibold text-foreground">Team capacity · next 4 weeks</h3>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Available days</span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-4">
        Coverage estimate from approved + pending leaves.
      </p>

      <div className="flex items-end gap-3 h-32">
        {points.map((p) => {
          const availablePct = Math.max(0, (p.available / p.total) * 100);
          const tight = availablePct < 70;
          return (
            <div key={p.weekStartISO} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex-1 flex items-end">
                <div className="w-full bg-secondary rounded-md overflow-hidden flex flex-col justify-end h-full">
                  <div
                    className={`w-full ${tight ? "bg-warning" : "bg-success"}`}
                    style={{ height: `${availablePct}%`, transition: "height 200ms ease" }}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold tabular-nums ${tight ? "text-warning" : "text-foreground"}`}>
                  {p.available}/{p.total}
                </p>
                <p className="text-[10px] text-muted-foreground">{p.weekLabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-[11px]">
        <span className="text-muted-foreground">Tightest week</span>
        <span className="inline-flex items-center gap-1.5 text-foreground">
          {minUtilization < 70 ? (
            <TrendingDown className="size-3 text-warning" />
          ) : (
            <TrendingUp className="size-3 text-success" />
          )}
          <span className="font-medium">{minWeek?.weekLabel}</span>
          <span className="text-muted-foreground tabular-nums">· {minUtilization}% available</span>
        </span>
      </div>
    </div>
  );
}
