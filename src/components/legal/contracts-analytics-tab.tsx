"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import {
  LEGAL_KPIS,
  CONTRACTS_BY_STATUS,
  CONTRACTS_BY_TYPE,
  SIG_TURNAROUND,
} from "@/components/legal/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

function HorizontalBar({ label, value, max, pctLabel, colorClass }: { label: string; value: number; max: number; pctLabel?: string; colorClass: string }) {
  const width = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {value}{pctLabel ? ` (${pctLabel})` : ""}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
        />
      </div>
    </div>
  );
}

export function ContractsAnalyticsTab() {
  const maxType = Math.max(...CONTRACTS_BY_TYPE.map((t) => t.count));
  const maxStatus = Math.max(...CONTRACTS_BY_STATUS.map((s) => s.count));
  const maxTurnaround = Math.max(...SIG_TURNAROUND.map((s) => s.days));

  function turnaroundColor(days: number): string {
    if (days < 2) return "bg-success";
    if (days <= 4) return "bg-warning";
    return "bg-destructive";
  }

  const statusColors: Record<string, string> = {
    Active: "bg-success",
    Pending: "bg-brand-purple",
    Draft: "bg-muted-foreground",
    Expired: "bg-destructive",
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {LEGAL_KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            {...fadeIn}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as const, delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
            <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
            {kpi.trend && (
              <div className={`flex items-center gap-1 text-xs mt-1 ${kpi.positive ? "text-success" : "text-destructive"}`}>
                {kpi.positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {kpi.trend}
              </div>
            )}
            {kpi.subtext && (
              <div className={`text-xs mt-1 ${kpi.positive ? "text-success" : "text-warning"}`}>
                {kpi.subtext}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contracts by Status */}
        <motion.div {...fadeIn} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Contracts by Status</h3>
          <div className="space-y-3">
            {CONTRACTS_BY_STATUS.map((s) => (
              <HorizontalBar
                key={s.status}
                label={s.status}
                value={s.count}
                max={maxStatus}
                pctLabel={`${s.pct}%`}
                colorClass={statusColors[s.status] ?? "bg-brand"}
              />
            ))}
          </div>
        </motion.div>

        {/* Contracts by Type */}
        <motion.div {...fadeIn} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Contracts by Type</h3>
          <div className="space-y-3">
            {CONTRACTS_BY_TYPE.map((t) => (
              <HorizontalBar
                key={t.type}
                label={t.type}
                value={t.count}
                max={maxType}
                colorClass="bg-brand"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Signature Turnaround */}
      <motion.div {...fadeIn} className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Signature Turnaround (days)</h3>
        <div className="space-y-3 max-w-xl">
          {SIG_TURNAROUND.map((s) => (
            <HorizontalBar
              key={s.type}
              label={s.type}
              value={s.days}
              max={maxTurnaround}
              colorClass={turnaroundColor(s.days)}
            />
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        {...fadeIn}
        className="bg-destructive/5 border-l-[3px] border-destructive rounded-r-xl p-4 space-y-3"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-destructive" />
          <h3 className="text-sm font-semibold text-foreground">AI Contract Health Insights</h3>
        </div>
        <ul className="space-y-2 text-xs text-foreground ml-6 list-disc">
          <li>
            <span className="font-medium">2 contracts have overdue signatures</span> — Vikram Rao&apos;s separation agreement (12 days) and Maya Chen&apos;s employment agreement (7 days) need urgent follow-up.
          </li>
          <li>
            <span className="font-medium">Non-compete clauses flagged in 3 contracts</span> — AI detected enforceability concerns in Maharashtra and California jurisdictions. Review recommended.
          </li>
          <li>
            <span className="font-medium">8 contracts expiring within 30 days</span> — Proactive renewal or termination decisions needed for vendor MSAs and contractor agreements.
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
