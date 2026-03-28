"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { REQ_ANALYTICS_KPIS } from "@/components/requisitions/data";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const AI_INSIGHTS = [
  "SLA compliance at 72% — 2 reqs exceeded 90-day target. VP Engineering (100d open) is the primary risk.",
  "Candidate coverage averages 5.2x per slot, but 3 slots have <3 candidates. AI sourcing could fill gaps in 48hrs.",
  "Engineering has 8 open positions across 4 reqs competing for 2 recruiters. Consider adding contract recruiting support.",
  "Offer acceptance rate is 87%. Salary competitiveness analysis suggests IC4+ ranges need 10% upward adjustment.",
  "3 pending approvals have been waiting 5+ days. Auto-escalation could reduce avg approval time by 40%.",
];

const COVERAGE_DATA = [
  { label: "Sourcing", count: 4, color: "bg-brand" },
  { label: "Interviewing", count: 5, color: "bg-brand-purple" },
  { label: "Offer Stage", count: 1, color: "bg-info" },
  { label: "Partially Filled", count: 1, color: "bg-brand-teal" },
];

const SLA_BREAKDOWN = [
  { label: "Within SLA (<60d)", count: 4, pct: 57, color: "bg-success" },
  { label: "At Risk (60-80d)", count: 1, pct: 14, color: "bg-warning" },
  { label: "Breached (>80d)", count: 2, pct: 29, color: "bg-destructive" },
];

export function ReqAnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {REQ_ANALYTICS_KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {kpi.positive ? (
                <TrendingUp className="size-3 text-success" />
              ) : (
                <TrendingDown className="size-3 text-destructive" />
              )}
              <span className={`text-xs ${kpi.positive ? "text-success" : "text-destructive"}`}>
                {kpi.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pipeline by Status + SLA Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pipeline by Status */}
        <motion.div
          variants={cardVariants}
          custom={5}
          initial="hidden"
          animate="visible"
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Active Reqs by Stage</h3>
          <div className="space-y-3">
            {COVERAGE_DATA.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className={`size-2.5 rounded-full ${item.color}`} />
                <span className="flex-1 text-xs text-muted-foreground">{item.label}</span>
                <span className="text-sm font-bold text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SLA Breakdown */}
        <motion.div
          variants={cardVariants}
          custom={6}
          initial="hidden"
          animate="visible"
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">SLA Compliance Breakdown</h3>
          <div className="space-y-3">
            {SLA_BREAKDOWN.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-medium text-foreground">{item.count} reqs ({item.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        variants={cardVariants}
        custom={7}
        initial="hidden"
        animate="visible"
        className="bg-brand-purple/5 border-l-[3px] border-brand-purple p-4 rounded-r-lg"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-brand-purple" />
          <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
        </div>
        <ul className="space-y-2 text-xs text-muted-foreground">
          {AI_INSIGHTS.map((insight, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 size-1 shrink-0 rounded-full bg-brand-purple" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
