"use client";

import { motion } from "framer-motion";
import {
  POOL_ANALYTICS_KPIS,
  ENGAGEMENT_FUNNEL,
  SOURCE_BREAKDOWN,
  TALENT_POOLS,
} from "@/components/talent-pool/data";

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

function computeHealth(pool: (typeof TALENT_POOLS)[number]): number {
  if (pool.candidateCount === 0) return 0;
  const contactedPct = (pool.contacted / pool.candidateCount) * 100;
  const score = (contactedPct + pool.responseRate + (pool.converted / pool.candidateCount) * 100) / 3;
  return Math.round(score);
}

function healthColor(score: number): string {
  if (score >= 60) return "bg-success";
  if (score >= 35) return "bg-warning";
  return "bg-destructive";
}

function healthTextColor(score: number): string {
  if (score >= 60) return "text-success";
  if (score >= 35) return "text-warning";
  return "text-destructive";
}

export function PoolAnalyticsTab() {
  const maxSourceCount = Math.max(...SOURCE_BREAKDOWN.map((s) => s.count));

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {POOL_ANALYTICS_KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="text-xs text-muted-foreground">{kpi.label}</div>
            <div className="text-xl font-bold text-foreground mt-1">{kpi.value}</div>
            <div
              className={`text-xs mt-1 ${
                kpi.positive ? "text-success" : "text-destructive"
              }`}
            >
              {kpi.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Engagement Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Engagement Funnel</h3>
        <div className="flex flex-col gap-3">
          {ENGAGEMENT_FUNNEL.map((step) => (
            <div key={step.stage} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs text-muted-foreground">{step.stage}</span>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-2 rounded-full bg-brand-teal transition-all"
                  style={{ width: `${step.pct}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
                {step.count} ({step.pct}%)
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Source Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Source Breakdown</h3>
        <div className="flex flex-col gap-3">
          {SOURCE_BREAKDOWN.map((src) => (
            <div key={src.source} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs text-muted-foreground">{src.source}</span>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-2 rounded-full bg-brand transition-all"
                  style={{ width: `${(src.count / maxSourceCount) * 100}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">
                {src.pct}%
              </span>
              <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
                Avg {src.avgMatch}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pool Health */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Pool Health</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {TALENT_POOLS.map((pool) => {
            const health = computeHealth(pool);
            return (
              <div
                key={pool.id}
                className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2.5"
              >
                <span className={`size-2.5 shrink-0 rounded-full ${healthColor(health)}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground truncate">{pool.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {pool.candidateCount} candidates
                  </div>
                </div>
                <span className={`text-sm font-semibold ${healthTextColor(health)}`}>
                  {health}%
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
