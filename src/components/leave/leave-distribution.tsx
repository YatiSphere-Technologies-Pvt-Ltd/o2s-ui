"use client";

import Link from "next/link";
import {
  LEAVE_TYPE_MAP,
  type DistributionByEmployee,
  type DistributionPoint,
} from "@/components/leave/data";

interface Props {
  byType: DistributionPoint[];
  byEmployee: DistributionByEmployee[];
}

export function LeaveDistribution({ byType, byEmployee }: Props) {
  const typeTotal = byType.reduce((s, x) => s + x.days, 0);
  const employeeMax = Math.max(1, ...byEmployee.map((e) => e.total));
  const sortedByEmployee = [...byEmployee].sort((a, b) => b.total - a.total);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* By type */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-sm font-semibold text-foreground">Distribution by leave type</h3>
          <span className="text-[11px] text-muted-foreground tabular-nums">{typeTotal} days</span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-4">
          Days taken across the team, last 12 months.
        </p>
        <div className="space-y-2.5">
          {byType.map((b) => {
            const type = LEAVE_TYPE_MAP[b.type];
            const pct = typeTotal === 0 ? 0 : (b.days / typeTotal) * 100;
            return (
              <div key={b.type}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={`inline-flex items-center gap-1.5 ${type.color}`}>
                    <span className="size-2 rounded-full bg-current" />
                    <span className="text-foreground">{type.label}</span>
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {b.days}d · {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-current ${type.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* By employee */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-sm font-semibold text-foreground">Distribution by teammate</h3>
          <span className="text-[11px] text-muted-foreground">stacked by type</span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-4">
          Bars are scaled to the heaviest user to make balance obvious.
        </p>
        <div className="space-y-2.5">
          {sortedByEmployee.map((e) => {
            const widthPct = (e.total / employeeMax) * 100;
            return (
              <div key={e.employeeId} className="flex items-center gap-3">
                <Link
                  href={`/leave/manager/report/${e.employeeId}`}
                  className="flex items-center gap-2 w-32 shrink-0 hover:text-brand transition-colors"
                >
                  <span className={`size-6 rounded-full ${e.avatarColor} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
                    {e.initials}
                  </span>
                  <span className="text-[11px] text-foreground truncate">{e.employeeName.split(" ")[0]}</span>
                </Link>
                <div className="flex-1 h-3 bg-secondary rounded overflow-hidden flex" style={{ maxWidth: `${widthPct}%` }}>
                  {e.byType.map((b) => {
                    const type = LEAVE_TYPE_MAP[b.type];
                    const segPct = e.total === 0 ? 0 : (b.days / e.total) * 100;
                    return (
                      <div
                        key={b.type}
                        className={`h-full bg-current ${type.color}`}
                        style={{ width: `${segPct}%` }}
                        title={`${type.label}: ${b.days}d`}
                      />
                    );
                  })}
                </div>
                <span className="text-[11px] text-foreground tabular-nums w-10 text-right">{e.total}d</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
