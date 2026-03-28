"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import {
  INTERVIEW_ANALYTICS_KPIS,
  INTERVIEWER_LOAD,
  loadColor,
  loadBarColor,
} from "@/components/interviews/data";

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const STATUS_LABEL: Record<string, { label: string; bg: string; text: string }> = {
  available: { label: "Available", bg: "bg-success/10", text: "text-success" },
  busy: { label: "Busy", bg: "bg-warning/10", text: "text-warning" },
  overloaded: { label: "Overloaded", bg: "bg-destructive/10", text: "text-destructive" },
};

export function InterviewAnalyticsTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {INTERVIEW_ANALYTICS_KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 text-xl font-bold text-foreground">{kpi.value}</p>
            <div className="mt-1 flex items-center gap-1">
              {kpi.positive ? (
                <TrendingUp className="size-3 text-success" />
              ) : (
                <TrendingDown className="size-3 text-destructive" />
              )}
              <span
                className={`text-[10px] ${
                  kpi.positive ? "text-success" : "text-destructive"
                }`}
              >
                {kpi.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interviewer load chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground">Interviewer Load</h3>
        <p className="text-xs text-muted-foreground">This week&apos;s interview distribution</p>

        <div className="mt-4 flex flex-col gap-3">
          {INTERVIEWER_LOAD.map((item, i) => {
            const pct = Math.min((item.load / item.max) * 100, 100);
            const barColor = loadBarColor(item.status);
            const textColor = loadColor(item.status);
            const statusCfg = STATUS_LABEL[item.status];

            return (
              <motion.div
                key={item.name}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={i}
                className="flex items-center gap-3"
              >
                <span className="w-32 shrink-0 truncate text-xs text-foreground">
                  {item.name}
                </span>
                <div className="flex flex-1 items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-secondary">
                    <div
                      className={`h-2 rounded-full ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={`w-8 text-right text-xs font-medium ${textColor}`}>
                    {item.load}/{item.max}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusCfg.bg} ${statusCfg.text}`}
                >
                  {statusCfg.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* AI insights */}
      <div className="rounded-xl border-l-[3px] border-brand-purple bg-brand-purple/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="size-4 text-brand-purple" />
          <h3 className="text-sm font-semibold text-brand-purple">AI Interview Insights</h3>
        </div>
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Efficiency:</span> Average
            interviews-per-hire dropped to 3.2, beating the industry benchmark of 3.6.
            Technical rounds are the most predictive of on-the-job performance.
          </p>
          <p>
            <span className="font-semibold text-foreground">Bottleneck:</span> Elena Volkov is
            at capacity (5/5 this week). Consider redistributing Technical interviews to Alex
            Torres or Tom Liu who have available slots.
          </p>
          <p>
            <span className="font-semibold text-foreground">Recommendation:</span> Feedback
            turnaround improved 22% this quarter. Two overdue scorecards from David Kim and
            Alex Torres should be escalated to maintain the trend.
          </p>
        </div>
      </div>
    </div>
  );
}
