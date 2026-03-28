"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  Info,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RENEWALS,
  RENEWAL_ALERT_CONFIG,
  DECISION_CONFIG,
  type ContractRenewal,
} from "@/components/legal/documents/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

const sortedRenewals = [...RENEWALS].sort(
  (a, b) => a.daysUntilExpiry - b.daysUntilExpiry
);

function alertSummary() {
  const counts: Record<string, number> = {
    critical: 0,
    urgent: 0,
    warning: 0,
    info: 0,
    none: 0,
  };
  RENEWALS.forEach((r) => {
    counts[r.alertLevel] = (counts[r.alertLevel] ?? 0) + 1;
  });
  return counts;
}

function daysRemainingDisplay(days: number) {
  if (days < 0) {
    return <span className="text-destructive font-medium">Expired</span>;
  }
  if (days < 30) {
    return <span className="text-destructive font-medium">{days}d</span>;
  }
  if (days < 90) {
    return <span className="text-warning font-medium">{days}d</span>;
  }
  return <span className="text-success font-medium">{days}d</span>;
}

const ALERT_SUMMARY_CONFIG: {
  key: string;
  label: string;
  colorClass: string;
  bgClass: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "critical",
    label: "Critical",
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
    icon: <AlertTriangle className="size-3.5" />,
  },
  {
    key: "urgent",
    label: "Urgent",
    colorClass: "text-[#FB923C]",
    bgClass: "bg-[#FB923C]/10",
    icon: <AlertCircle className="size-3.5" />,
  },
  {
    key: "warning",
    label: "Warning",
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    icon: <AlertTriangle className="size-3.5" />,
  },
  {
    key: "info",
    label: "Review",
    colorClass: "text-brand",
    bgClass: "bg-brand/10",
    icon: <Info className="size-3.5" />,
  },
  {
    key: "none",
    label: "No Action",
    colorClass: "text-muted-foreground",
    bgClass: "bg-secondary",
    icon: null,
  },
];

export function RenewalsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const counts = alertSummary();

  return (
    <div className="space-y-4">
      {/* Alert Summary */}
      <div className="flex items-center gap-3 flex-wrap">
        {ALERT_SUMMARY_CONFIG.map((a) => (
          <div
            key={a.key}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${a.bgClass} ${a.colorClass}`}
          >
            {a.icon}
            {a.label}: {counts[a.key] ?? 0}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs">
              <th className="px-4 py-3 text-left font-medium">Contract</th>
              <th className="px-4 py-3 text-left font-medium">Counterparty</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Entity</th>
              <th className="px-4 py-3 text-left font-medium">End Date</th>
              <th className="px-4 py-3 text-left font-medium">Days Left</th>
              <th className="px-4 py-3 text-left font-medium">Auto-Renew</th>
              <th className="px-4 py-3 text-left font-medium">Annual Value</th>
              <th className="px-4 py-3 text-left font-medium">Decision</th>
              <th className="px-4 py-3 text-left font-medium">Alert</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRenewals.map((r) => {
              const isExpired = r.daysUntilExpiry < 0;
              const isExpanded = expanded === r.id;
              const decisionCfg = DECISION_CONFIG[r.decision];
              const alertCfg = RENEWAL_ALERT_CONFIG[r.alertLevel];

              return (
                <React.Fragment key={r.id}>
                  <tr
                    className={`border-b border-border cursor-pointer transition-colors hover:bg-surface-overlay ${
                      isExpired
                        ? "bg-destructive/5 border-l-[3px] border-l-destructive"
                        : ""
                    }`}
                    onClick={() => setExpanded(isExpanded ? null : r.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {r.aiRecommendation ? (
                          isExpanded ? (
                            <ChevronDown className="size-3 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                          )
                        ) : (
                          <span className="size-3 shrink-0" />
                        )}
                        <span className="font-medium text-sm text-foreground">
                          {r.contractName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {r.counterparty}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {r.contractType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {r.entity}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {r.currentEndDate}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {daysRemainingDisplay(r.daysUntilExpiry)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {r.autoRenew ? (
                        <span>
                          Yes
                          {r.noticeDueDate && (
                            <span className="block text-[10px] text-muted-foreground">
                              Notice: {r.noticeDueDate}
                            </span>
                          )}
                        </span>
                      ) : (
                        "No"
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground">
                      {r.annualValue}
                    </td>
                    <td className="px-4 py-3">
                      {decisionCfg && (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${decisionCfg.bgClass} ${decisionCfg.colorClass}`}
                        >
                          {decisionCfg.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {alertCfg && (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${alertCfg.bgClass} ${alertCfg.colorClass}`}
                        >
                          {alertCfg.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon-xs">
                        <MoreHorizontal className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                  {isExpanded && r.aiRecommendation && (
                    <tr>
                      <td
                        colSpan={11}
                        className="px-6 py-4 border-b border-border"
                      >
                        <AnimatePresence>
                          <motion.div {...fadeIn}>
                            <div className="bg-brand-purple/5 border-l-[2px] border-brand-purple rounded-r-lg p-3 text-xs text-foreground">
                              <span className="font-medium text-brand-purple">
                                AI Recommendation:
                              </span>{" "}
                              {r.aiRecommendation}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
