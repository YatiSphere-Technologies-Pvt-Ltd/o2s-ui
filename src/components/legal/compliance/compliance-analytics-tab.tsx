"use client";

import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, TrendingUp } from "lucide-react";
import {
  COMPLIANCE_KPIS,
  FILING_BY_STATUS,
  FILING_BY_CATEGORY,
  ENTITY_SCORES,
} from "@/components/legal/compliance/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

function BarFill({
  pct,
  colorClass,
  delay = 0,
}: {
  pct: number;
  colorClass: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`h-full rounded-full ${colorClass}`}
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.4, 0, 0.2, 1] as const,
      }}
    />
  );
}

const STATUS_COLORS: Record<string, string> = {
  "Filed On Time": "bg-success",
  "Filed Late": "bg-warning",
  Overdue: "bg-destructive",
  Upcoming: "bg-brand",
};

export function ComplianceAnalyticsTab() {
  const maxCategory = Math.max(
    ...FILING_BY_CATEGORY.map((c) => c.onTime + c.late)
  );

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* KPIs large display */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {COMPLIANCE_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className={`bg-card border border-border rounded-xl p-4 ${
              kpi.label === "Overdue Filings" && Number(kpi.value) > 0
                ? "bg-destructive/5"
                : ""
            }`}
          >
            <div className="text-xs text-muted-foreground">{kpi.label}</div>
            <div
              className={`text-2xl font-bold mt-1 ${
                kpi.isScore ? "text-brand" : "text-foreground"
              }`}
            >
              {kpi.value}
            </div>
            {kpi.trend && (
              <div
                className={`text-[10px] mt-1 ${
                  kpi.positive ? "text-success" : "text-destructive"
                }`}
              >
                {kpi.trend}
              </div>
            )}
            {kpi.subtext && (
              <div className="text-[10px] text-muted-foreground mt-1">
                {kpi.subtext}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* On-Time Filing Rate */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-brand" />
            <span className="font-semibold text-sm">On-Time Filing Rate</span>
          </div>
          <div className="space-y-3">
            {FILING_BY_STATUS.map((item) => (
              <div key={item.status} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.status}</span>
                  <span className="font-medium">
                    {item.count} ({item.pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <BarFill
                    pct={item.pct}
                    colorClass={STATUS_COLORS[item.status] ?? "bg-brand"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filing by Category */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <span className="font-semibold text-sm">Filing by Category</span>
          <div className="space-y-3">
            {FILING_BY_CATEGORY.map((cat) => {
              const total = cat.onTime + cat.late;
              const onTimePct = (cat.onTime / maxCategory) * 100;
              const latePct = (cat.late / maxCategory) * 100;
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {cat.category}
                    </span>
                    <span className="font-medium">{total}</span>
                  </div>
                  <div className="flex gap-0.5 h-2">
                    <div
                      className="bg-success rounded-l-full"
                      style={{ width: `${onTimePct}%` }}
                    />
                    {cat.late > 0 && (
                      <div
                        className="bg-warning rounded-r-full"
                        style={{ width: `${latePct}%` }}
                      />
                    )}
                  </div>
                  <div className="flex gap-3 text-[10px] text-muted-foreground">
                    <span>On-time: {cat.onTime}</span>
                    {cat.late > 0 && <span>Late: {cat.late}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground pt-2 border-t border-border">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-success" /> On-time
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-warning" /> Late
            </span>
          </div>
        </div>

        {/* Entity Compliance Scores */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <span className="font-semibold text-sm">
            Entity Compliance Scores
          </span>
          <div className="space-y-3">
            {ENTITY_SCORES.map((es) => (
              <div key={es.entity} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{es.entity}</span>
                  <span className="font-bold">{es.score}%</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <BarFill pct={es.score} colorClass={es.colorClass} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-destructive/5 border-l-[3px] border-destructive border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
            <Sparkles className="size-4" />
            AI Compliance Insights
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center gap-1.5 font-medium text-foreground mb-1">
                <AlertTriangle className="size-3 text-destructive" />
                Top Risk Areas
              </div>
              <ul className="space-y-1 text-muted-foreground ml-4 list-disc">
                <li>
                  PF Monthly Return (FIL-023) is 11 days overdue with penalty
                  exposure of INR 5,000/month + 12% interest
                </li>
                <li>
                  Two filings due within 4 days (Professional Tax, TDS Q4) —
                  escalate to assignees
                </li>
                <li>
                  Maharashtra minimum wage revision effective Apr 2026 may
                  impact PF calculations
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-medium text-foreground mb-1">
                <TrendingUp className="size-3 text-success" />
                Recommendations
              </div>
              <ul className="space-y-1 text-muted-foreground ml-4 list-disc">
                <li>
                  Immediately file PF Return (FIL-023) to stop penalty
                  accumulation
                </li>
                <li>
                  Set up automated 7-day and 3-day advance reminders for all
                  monthly filings
                </li>
                <li>
                  LB US and LB UAE maintain 100% scores — replicate their
                  processes for LB India
                </li>
                <li>
                  Review PF interest rate change (8.15% for FY 2025-26) before
                  next filing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
