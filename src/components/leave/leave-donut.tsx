"use client";

import { useMemo, useState } from "react";
import { LEAVE_TYPE_MAP, type LeaveRequest, type LeaveTypeKey } from "@/components/leave/data";

interface Slice {
  type: LeaveTypeKey;
  label: string;
  days: number;
  color: string;
  tint: string;
}

const TAKEN_STATUSES = new Set(["taken", "approved"]);

/**
 * Map our Tailwind text-color tokens to a concrete fill color.
 * We can't use Tailwind classes directly on SVG fill, so we resolve to hex/oklch values.
 * Picked to match the existing tokens roughly; tweak alongside the theme if it shifts.
 */
const TYPE_FILL: Record<LeaveTypeKey, string> = {
  privileged:  "#2DD4BF",  // brand-teal-ish
  sick:        "#F87171",  // destructive-ish
  casual:      "#F59E0B",  // warning-ish
  compoff:     "#A78BFA",  // brand-purple-ish
  maternity:   "#F472B6",  // pink-400
  paternity:   "#60A5FA",  // blue-400
  bereavement: "#94A3B8",  // muted
  wfa:         "#A3E635",  // lime
};

export function LeaveDonut({ requests, year }: { requests: LeaveRequest[]; year: number }) {
  const [hover, setHover] = useState<LeaveTypeKey | null>(null);

  const slices: Slice[] = useMemo(() => {
    const totals = new Map<LeaveTypeKey, number>();
    for (const r of requests) {
      if (!TAKEN_STATUSES.has(r.status)) continue;
      if (new Date(r.startDate).getFullYear() !== year) continue;
      totals.set(r.type, (totals.get(r.type) ?? 0) + r.days);
    }
    return Array.from(totals.entries())
      .map(([type, days]) => ({
        type,
        label: LEAVE_TYPE_MAP[type].label,
        days,
        color: TYPE_FILL[type],
        tint: LEAVE_TYPE_MAP[type].tint,
      }))
      .sort((a, b) => b.days - a.days);
  }, [requests, year]);

  const total = slices.reduce((s, x) => s + x.days, 0);

  // SVG donut geometry
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 54;
  const strokeWidth = 18;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-1">Leave taken in {year}</h3>
      <p className="text-[11px] text-muted-foreground mb-4">
        Only approved and taken requests are counted.
      </p>

      <div className="flex items-center gap-5 flex-wrap">
        {/* Donut */}
        <div className="relative shrink-0">
          <svg width={size} height={size} className="-rotate-90">
            {/* Background ring */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              strokeWidth={strokeWidth}
              className="stroke-secondary"
            />
            {/* Slices */}
            {total > 0 &&
              (() => {
                const circumference = 2 * Math.PI * r;
                let offset = 0;
                return slices.map((s) => {
                  const length = (s.days / total) * circumference;
                  const dasharray = `${length} ${circumference - length}`;
                  const node = (
                    <circle
                      key={s.type}
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={hover && hover === s.type ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={dasharray}
                      strokeDashoffset={-offset}
                      strokeLinecap="butt"
                      onMouseEnter={() => setHover(s.type)}
                      onMouseLeave={() => setHover(null)}
                      style={{ transition: "stroke-width 0.15s ease" }}
                    />
                  );
                  offset += length;
                  return node;
                });
              })()}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hover ? (
              <>
                <span className="text-lg font-bold text-foreground leading-none">
                  {slices.find((s) => s.type === hover)?.days ?? 0}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 max-w-20 text-center">
                  {LEAVE_TYPE_MAP[hover].shortLabel} days
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-foreground leading-none">{total}</span>
                <span className="text-[10px] text-muted-foreground mt-1">days used</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 min-w-44 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {slices.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No leave taken in {year} yet.</p>
          ) : (
            slices.map((s) => {
              const pct = total === 0 ? 0 : Math.round((s.days / total) * 100);
              return (
                <button
                  key={s.type}
                  onMouseEnter={() => setHover(s.type)}
                  onMouseLeave={() => setHover(null)}
                  className={`flex items-center gap-2 py-1 px-1.5 rounded text-left transition-colors ${
                    hover === s.type ? "bg-surface-overlay" : ""
                  }`}
                >
                  <span
                    className="size-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-xs text-foreground truncate flex-1">{s.label}</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {s.days}d · {pct}%
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
