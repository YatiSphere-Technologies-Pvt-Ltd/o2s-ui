"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertCircle, Building2 } from "lucide-react";
import {
  SPEND_BY_FIRM,
  SPEND_BY_TYPE,
} from "@/components/legal/spend/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

const BAR_COLORS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-muted-foreground",
];

const TYPE_COLORS = [
  "bg-chart-1",
  "bg-chart-3",
  "bg-chart-2",
  "bg-chart-4",
  "bg-chart-5",
];

const AI_INSIGHTS = [
  {
    icon: TrendingUp,
    text: "IP litigation spend is trending 18% higher YoY. Consider alternative fee arrangements for the NeuralTech matter to cap exposure.",
  },
  {
    icon: AlertCircle,
    text: "Morrison & Foerster partner rates are 12% above market benchmark for comparable IP litigation in your region. Renegotiation recommended at next review.",
  },
  {
    icon: Building2,
    text: "AZB & Partners has the highest discount (14%) but lowest spend utilization. Consider consolidating India regulatory work to maximize panel benefits.",
  },
  {
    icon: Sparkles,
    text: "AI billing review has identified $12,400 in savings YTD across 5 invoices — 23% acceptance rate suggests opportunity to tighten billing guidelines.",
  },
];

function formatSpend(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

export function SpendAnalyticsTab() {
  const maxSpend = Math.max(...SPEND_BY_FIRM.map((f) => f.spend));

  return (
    <motion.div {...fadeIn} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend by Firm */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Spend by Firm
          </h3>
          <div className="space-y-3">
            {SPEND_BY_FIRM.map((item, idx) => (
              <div key={item.firm} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">{item.firm}</span>
                  <span className="font-mono text-muted-foreground">
                    {formatSpend(item.spend)} ({item.pct}%)
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      BAR_COLORS[idx % BAR_COLORS.length]
                    }`}
                    style={{
                      width: `${(item.spend / maxSpend) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spend by Matter Type */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Spend by Matter Type
          </h3>
          <div className="space-y-3">
            {SPEND_BY_TYPE.map((item, idx) => (
              <div key={item.type} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">{item.type}</span>
                  <span className="font-mono text-muted-foreground">
                    {item.pct}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      TYPE_COLORS[idx % TYPE_COLORS.length]
                    }`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Savings Card */}
      <div className="bg-destructive/5 border-l-[3px] border-destructive border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="size-4 text-destructive" />
          AI Billing Review Savings
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              YTD Savings
            </div>
            <div className="font-mono font-bold text-lg text-success">
              $12,400
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Invoices Reviewed
            </div>
            <div className="font-mono font-bold text-lg text-foreground">
              5
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Flags Identified
            </div>
            <div className="font-mono font-bold text-lg text-foreground">
              5
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Acceptance Rate
            </div>
            <div className="font-mono font-bold text-lg text-foreground">
              23%
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="size-4 text-brand-purple" />
          AI Spend Insights
        </div>
        <div className="space-y-3">
          {AI_INSIGHTS.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 text-xs text-muted-foreground"
              >
                <Icon className="size-3.5 text-brand-purple shrink-0 mt-0.5" />
                <span>{insight.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
