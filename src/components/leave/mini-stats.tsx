"use client";

import { CalendarCheck, Clock, Wallet } from "lucide-react";
import type { YearStats } from "@/components/leave/calendar-utils";

interface Props {
  stats: YearStats;
  year: number;
}

export function MiniStats({ stats, year }: Props) {
  const { usedYTD, planned, remaining, allotment } = stats;
  const usedPct = allotment > 0 ? Math.round((usedYTD / allotment) * 100) : 0;
  const plannedPct = allotment > 0 ? Math.round((planned / allotment) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Your year</h3>
        <p className="text-[11px] text-muted-foreground">{year} · across all leave types</p>
      </div>

      <StatRow
        icon={CalendarCheck}
        iconColor="text-success"
        iconBg="bg-success/10"
        label="Days used YTD"
        value={usedYTD}
        suffix={` of ${allotment}`}
        pct={usedPct}
        pctColor="bg-success"
      />

      <StatRow
        icon={Clock}
        iconColor="text-warning"
        iconBg="bg-warning/10"
        label="Days planned"
        value={planned}
        suffix=" approved + pending"
        pct={plannedPct}
        pctColor="bg-warning"
      />

      <StatRow
        icon={Wallet}
        iconColor="text-brand"
        iconBg="bg-brand/10"
        label="Days remaining"
        value={remaining}
        suffix=" discretionary"
        pct={allotment > 0 ? 100 - usedPct - plannedPct : 0}
        pctColor="bg-brand"
      />
    </div>
  );
}

function StatRow({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  suffix,
  pct,
  pctColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  label: string;
  value: number;
  suffix?: string;
  pct: number;
  pctColor: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`size-6 rounded-md flex items-center justify-center ${iconBg}`}>
          <Icon className={`size-3 ${iconColor}`} />
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-xl font-bold text-foreground tabular-nums">
        {value}
        {suffix && <span className="ml-1 text-[11px] font-normal text-muted-foreground">{suffix}</span>}
      </p>
      <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full ${pctColor} rounded-full`}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
}
