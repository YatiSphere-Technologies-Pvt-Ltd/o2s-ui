"use client";

import { Clock, Inbox, Users } from "lucide-react";

interface Props {
  pendingCount: number;
  /** In hours. */
  avgApprovalHours: number;
  /** 0–100. */
  teamUtilization: number;
}

export function ManagerStats({ pendingCount, avgApprovalHours, teamUtilization }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard
        icon={Inbox}
        iconColor="text-brand"
        iconBg="bg-brand/10"
        label="Pending"
        value={`${pendingCount}`}
        sub="requests in queue"
      />
      <StatCard
        icon={Clock}
        iconColor="text-warning"
        iconBg="bg-warning/10"
        label="Avg time to decision"
        value={`${avgApprovalHours.toFixed(1)}h`}
        sub="last 30 days"
      />
      <StatCard
        icon={Users}
        iconColor="text-success"
        iconBg="bg-success/10"
        label="Team utilization"
        value={`${teamUtilization}%`}
        sub="this week"
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className={`size-7 rounded-md flex items-center justify-center ${iconBg} mb-3`}>
        <Icon className={`size-3.5 ${iconColor}`} />
      </div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</p>
      <p className="text-xl font-bold text-foreground mt-1 tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>
    </div>
  );
}
