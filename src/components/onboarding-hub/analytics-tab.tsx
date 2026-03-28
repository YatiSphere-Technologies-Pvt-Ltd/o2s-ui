"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  ANALYTICS_KPIS,
  RAMP_BY_DEPT,
  TASK_BREAKDOWN,
} from "@/components/onboarding-hub/data";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export function AnalyticsTab() {
  const maxRampDays = Math.max(...RAMP_BY_DEPT.map((r) => r.days));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {ANALYTICS_KPIS.map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={cardVariants}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {kpi.value}
            </p>
            <p
              className={`mt-1 text-xs ${
                kpi.positive ? "text-success" : "text-destructive"
              }`}
            >
              {kpi.trend}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Time to Ramp by Dept */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Time to Ramp by Department
        </h3>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {RAMP_BY_DEPT.map((row) => (
            <motion.div
              key={row.dept}
              variants={cardVariants}
              transition={{
                duration: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
              className="flex items-center gap-3"
            >
              <span className="w-28 truncate text-sm text-foreground">
                {row.dept}
              </span>
              <div className="h-2 flex-1 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-brand-teal transition-all"
                  style={{
                    width: `${(row.days / maxRampDays) * 100}%`,
                  }}
                />
              </div>
              <span className="w-12 text-right text-xs font-medium text-muted-foreground">
                {row.days}d
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Task Completion Breakdown */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Task Completion Breakdown
        </h3>

        {/* Stacked bar */}
        <div className="flex h-4 w-full overflow-hidden rounded-full">
          {TASK_BREAKDOWN.map((segment) => (
            <div
              key={segment.type}
              className={`${segment.colorClass}`}
              style={{ width: `${segment.pct}%` }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-4">
          {TASK_BREAKDOWN.map((segment) => (
            <div key={segment.type} className="flex items-center gap-2 text-xs">
              <span
                className={`size-2.5 rounded-full ${segment.colorClass}`}
              />
              <span className="text-muted-foreground">{segment.type}</span>
              <span className="font-medium text-foreground">
                {segment.pct}% ({segment.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Narrative */}
      <div className="rounded-r-lg border-l-[3px] border-brand-teal bg-brand-teal/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-4 text-brand-teal" />
          <h3 className="text-sm font-semibold text-brand-teal">
            AI Summary
          </h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Onboarding efficiency improved 7% this quarter. AI agents
          auto-completed 38% of all tasks, saving an estimated 42 hours of HR
          admin time. Engineering has the longest ramp time at 48 days —
          consider adding a dedicated technical onboarding track. Sales ramp
          decreased by 3 days after introducing the buddy program. One new hire
          (Zara Ali, Marketing) is flagged at risk due to low pulse scores;
          manager check-in has been auto-scheduled.
        </p>
      </div>
    </div>
  );
}
