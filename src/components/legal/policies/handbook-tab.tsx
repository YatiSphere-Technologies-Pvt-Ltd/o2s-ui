"use client";

import { motion } from "framer-motion";
import { Download, Pencil, ChevronRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HANDBOOK_POLICIES,
  POLICIES,
  ackBarColor,
} from "@/components/legal/policies/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

export function HandbookTab() {
  // Compute overall handbook ack stats
  const handbookWithAck = HANDBOOK_POLICIES.filter((p) => p.ackRequired);
  const totalEmployees = handbookWithAck.length > 0
    ? Math.max(...handbookWithAck.map((p) => p.ackStats.total))
    : 0;
  const totalAcked = handbookWithAck.length > 0
    ? Math.round(
        handbookWithAck.reduce((sum, p) => sum + p.ackRate, 0) /
          handbookWithAck.length
      )
    : 0;
  const ackedCount = handbookWithAck.reduce(
    (sum, p) => sum + p.ackStats.acknowledged,
    0
  );
  const totalCount = handbookWithAck.reduce(
    (sum, p) => sum + p.ackStats.total,
    0
  );

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Employee Handbook — Latent Bridge
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Last compiled: Mar 15, 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Download className="size-3.5" />
            Download PDF
          </Button>
          <Button variant="ghost" size="sm">
            <Pencil className="size-3.5" />
            Edit Order
          </Button>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Table of Contents
          </h3>
        </div>
        <div className="divide-y divide-border">
          {HANDBOOK_POLICIES.map((policy, idx) => (
            <div
              key={policy.id}
              className="flex items-center justify-between px-5 py-3 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono w-6 text-right">
                  {idx + 1}.
                </span>
                <span className="text-sm font-medium text-foreground">
                  {policy.title}
                </span>
                <span className="text-[10px] text-muted-foreground bg-secondary rounded-full px-1.5 py-0.5">
                  v{policy.currentVersion}
                </span>
              </div>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                View
                <ChevronRight className="size-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Handbook Acknowledgment Card */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Handbook Acknowledgment
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-secondary">
              <div
                className={`h-2 rounded-full ${ackBarColor(totalAcked)}`}
                style={{ width: `${totalAcked}%` }}
              />
            </div>
            <span className="text-sm font-medium">{totalAcked}%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {ackedCount} of {totalCount} total policy acknowledgments completed
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Bell className="size-3.5" />
          Send Reminder
        </Button>
      </div>
    </motion.div>
  );
}
