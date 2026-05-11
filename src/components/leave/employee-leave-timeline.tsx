"use client";

import { LEAVE_TYPE_MAP, type HistoryStrip } from "@/components/leave/data";

interface Props {
  strip: HistoryStrip;
}

export function EmployeeLeaveTimeline({ strip }: Props) {
  const max = Math.max(1, ...strip.monthly.map((m) => m.days));
  const total = strip.byType.reduce((s, t) => s + t.days, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm font-semibold text-foreground">Last 12 months</h3>
        <span className="text-[11px] text-muted-foreground tabular-nums">{total} day{total !== 1 ? "s" : ""}</span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-4">{strip.summary}</p>

      {/* By type breakdown */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        {strip.byType.map((t) => {
          const meta = LEAVE_TYPE_MAP[t.type];
          return (
            <span key={t.type} className="inline-flex items-center gap-1.5">
              <span className={`size-2 rounded-full bg-current ${meta.color}`} />
              <span className="text-[11px] text-foreground">
                {meta.shortLabel}{" "}
                <span className="text-muted-foreground tabular-nums">{t.days}d</span>
              </span>
            </span>
          );
        })}
      </div>

      {/* Monthly mini-bars */}
      <div className="flex items-end gap-1.5 h-16">
        {strip.monthly.map((m) => {
          const pct = (m.days / max) * 100;
          return (
            <div key={m.monthLabel} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-sm ${m.days > 0 ? "bg-brand" : "bg-secondary"}`}
                  style={{ height: m.days > 0 ? `${Math.max(15, pct)}%` : "8%" }}
                  title={`${m.monthLabel}: ${m.days} day${m.days !== 1 ? "s" : ""}`}
                />
              </div>
              <span className="text-[9px] text-muted-foreground/60">{m.monthLabel[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
