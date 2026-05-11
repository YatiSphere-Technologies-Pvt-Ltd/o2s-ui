"use client";

import { LEAVE_TYPE_MAP, type NoticeSample } from "@/components/leave/data";

const BUCKETS: { label: string; min: number; max: number }[] = [
  { label: "Same day", min: -10, max: 0 },
  { label: "1–3 days", min: 1, max: 3 },
  { label: "1 week",   min: 4, max: 7 },
  { label: "2 weeks",  min: 8, max: 14 },
  { label: "3+ weeks", min: 15, max: 9999 },
];

export function NoticeHistogram({ samples }: { samples: NoticeSample[] }) {
  const counts = BUCKETS.map((b) => samples.filter((s) => s.daysOfNotice >= b.min && s.daysOfNotice <= b.max).length);
  const max = Math.max(1, ...counts);
  const avg = samples.length === 0 ? 0 : Math.round(samples.reduce((s, x) => s + Math.max(0, x.daysOfNotice), 0) / samples.length);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm font-semibold text-foreground">Advance-notice pattern</h3>
        <span className="text-[11px] text-muted-foreground tabular-nums">avg {avg} day{avg !== 1 ? "s" : ""}</span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-4">
        How early this teammate typically requests leave. Last {samples.length} requests.
      </p>

      <div className="flex items-end gap-2 h-24">
        {counts.map((c, i) => {
          const pct = (c / max) * 100;
          return (
            <div key={BUCKETS[i].label} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-sm ${c === 0 ? "bg-secondary/60" : "bg-brand"}`}
                  style={{ height: c > 0 ? `${Math.max(15, pct)}%` : "6%" }}
                  title={`${BUCKETS[i].label}: ${c} request${c !== 1 ? "s" : ""}`}
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] tabular-nums text-foreground">{c}</p>
                <p className="text-[9px] text-muted-foreground/60 leading-tight">{BUCKETS[i].label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent samples with type chips */}
      <div className="flex items-center gap-1.5 flex-wrap mt-4 pt-3 border-t border-border">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mr-1">Recent</span>
        {samples.slice(0, 6).map((s, i) => {
          const type = LEAVE_TYPE_MAP[s.type];
          return (
            <span
              key={i}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${type.tint}`}
            >
              <span className={`font-bold ${type.color}`}>{type.shortLabel}</span>
              <span className="text-foreground">{s.daysOfNotice <= 0 ? "0d" : `${s.daysOfNotice}d`}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
