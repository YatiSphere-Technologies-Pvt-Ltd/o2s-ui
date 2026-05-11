"use client";

import { useState } from "react";
import { LEAVE_TYPE_MAP, type LeaveTrendPoint, type LeaveTypeKey } from "@/components/leave/data";

interface Props {
  points: LeaveTrendPoint[];
}

const STACK_ORDER: LeaveTypeKey[] = ["privileged", "wfa", "sick", "casual", "compoff"];

export function LeaveTrendsChart({ points }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  const totals = points.map((p) => p.byType.reduce((s, x) => s + x.days, 0));
  const max = Math.max(1, ...totals);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm font-semibold text-foreground">Leave volume by type</h3>
        <span className="text-[11px] text-muted-foreground">last 6 months · org-wide</span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-4">
        Days taken (approved or in progress), stacked by leave type.
      </p>

      <div className="flex items-end gap-3 h-44">
        {points.map((p) => {
          const total = p.byType.reduce((s, x) => s + x.days, 0);
          const hPct = (total / max) * 100;
          const isHover = hover === p.monthISO;
          return (
            <div
              key={p.monthISO}
              onMouseEnter={() => setHover(p.monthISO)}
              onMouseLeave={() => setHover((h) => (h === p.monthISO ? null : h))}
              className="flex-1 flex flex-col items-center gap-1.5 group"
            >
              <div className="w-full flex-1 flex items-end relative">
                <div
                  className="w-full rounded-md overflow-hidden flex flex-col-reverse"
                  style={{ height: `${Math.max(4, hPct)}%`, transition: "height 250ms ease" }}
                >
                  {STACK_ORDER.map((t) => {
                    const entry = p.byType.find((b) => b.type === t);
                    const days = entry?.days ?? 0;
                    if (days <= 0) return null;
                    const meta = LEAVE_TYPE_MAP[t];
                    const segPct = total === 0 ? 0 : (days / total) * 100;
                    return (
                      <div
                        key={t}
                        className={`w-full bg-current ${meta.color}`}
                        style={{ height: `${segPct}%`, opacity: isHover || !hover ? 1 : 0.7 }}
                        title={`${meta.label}: ${days}d`}
                      />
                    );
                  })}
                </div>
                {isHover && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 w-44 bg-card border border-border rounded-lg shadow-xl p-2.5 pointer-events-none">
                    <p className="text-[11px] font-semibold text-foreground mb-1.5 flex items-center justify-between">
                      <span>{p.monthLabel}</span>
                      <span className="text-muted-foreground tabular-nums font-normal">{total}d</span>
                    </p>
                    <ul className="space-y-0.5">
                      {[...p.byType].sort((a, b) => b.days - a.days).map((b) => {
                        const meta = LEAVE_TYPE_MAP[b.type];
                        return (
                          <li key={b.type} className="flex items-center gap-1.5 text-[10px]">
                            <span className={`size-1.5 rounded-full bg-current ${meta.color}`} />
                            <span className="flex-1 text-foreground truncate">{meta.shortLabel}</span>
                            <span className="text-muted-foreground tabular-nums">{b.days}d</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-[10px] text-foreground tabular-nums">{total}</p>
                <p className="text-[9px] text-muted-foreground/60">{p.monthLabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap mt-4 pt-3 border-t border-border">
        {STACK_ORDER.map((t) => {
          const meta = LEAVE_TYPE_MAP[t];
          return (
            <span key={t} className="inline-flex items-center gap-1.5 text-[11px]">
              <span className={`size-2 rounded-sm bg-current ${meta.color}`} />
              <span className="text-muted-foreground">{meta.shortLabel}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
