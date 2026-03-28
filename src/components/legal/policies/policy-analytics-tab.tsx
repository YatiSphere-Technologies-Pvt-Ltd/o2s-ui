"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  ACK_BY_DEPT,
  POLICIES_BY_STATUS,
  UPCOMING_REVIEWS,
  REVIEW_STATUS_CONFIG,
  ackBarColor,
} from "@/components/legal/policies/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

const STATUS_BAR_COLORS: Record<string, string> = {
  Published: "bg-success",
  Draft: "bg-warning",
  Archived: "bg-muted-foreground",
};

export function PolicyAnalyticsTab() {
  const maxStatusCount = Math.max(...POLICIES_BY_STATUS.map((s) => s.count));

  return (
    <motion.div {...fadeIn} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ack Rate by Department */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Acknowledgment Rate by Department
          </h3>
          <div className="space-y-3">
            {ACK_BY_DEPT.map((d) => (
              <div key={d.dept} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{d.dept}</span>
                  <span className="font-medium">{d.rate}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className={`h-2 rounded-full ${ackBarColor(d.rate)}`}
                    style={{ width: `${d.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policies by Status */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Policies by Status
          </h3>
          <div className="space-y-3">
            {POLICIES_BY_STATUS.map((s) => (
              <div key={s.status} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.status}</span>
                  <span className="font-medium">{s.count}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className={`h-2 rounded-full ${
                      STATUS_BAR_COLORS[s.status] ?? "bg-brand"
                    }`}
                    style={{
                      width: `${(s.count / maxStatusCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Reviews */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Upcoming Reviews
          </h3>
          <div className="divide-y divide-border">
            {UPCOMING_REVIEWS.map((r) => {
              const cfg = REVIEW_STATUS_CONFIG[r.status];
              return (
                <div
                  key={r.policy}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {r.policy}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Due: {r.dueDate}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bgClass} ${cfg.colorClass}`}
                  >
                    {cfg.icon} {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-destructive/5 border-l-[3px] border-destructive rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
            <Sparkles className="size-4" />
            AI Insights
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <li>
              <span className="font-medium text-foreground">Low acknowledgment alert:</span>{" "}
              Data Protection Policy (DPDP) has only 45% acknowledgment rate.
              Consider sending a targeted reminder to the 82 pending employees.
            </li>
            <li>
              <span className="font-medium text-foreground">Review due soon:</span>{" "}
              Remote Work Policy and Leave Policy are both due for review in the
              next 3 months. Schedule review sessions with policy owners.
            </li>
            <li>
              <span className="font-medium text-foreground">Sales dept lagging:</span>{" "}
              Sales department has the lowest acknowledgment rate at 72%. This is
              18% below HR. Consider department-specific follow-up.
            </li>
            <li>
              <span className="font-medium text-foreground">Recommendation:</span>{" "}
              5 employees have been overdue for more than 7 days across multiple
              policies. Escalate to their managers for immediate action.
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
