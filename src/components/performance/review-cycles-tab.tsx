"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Bell,
  Settings,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACTIVE_CYCLE, PAST_CYCLES } from "@/components/performance/data";

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

export function ReviewCyclesTab() {
  const completionPct = Math.round(
    (ACTIVE_CYCLE.completed / ACTIVE_CYCLE.totalReviews) * 100
  );

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage review cycles, track completion, and monitor reviewer progress.
        </p>
        <Button variant="outline" size="sm">
          <Plus className="size-3.5" />
          New Cycle
        </Button>
      </motion.div>

      {/* Active Cycle Card */}
      <motion.div
        variants={fadeUp}
        className="bg-card border border-border rounded-xl p-6 space-y-5"
      >
        {/* Title */}
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-foreground">
            {ACTIVE_CYCLE.name}
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium">
            In Progress
          </span>
        </div>

        {/* Phase stepper */}
        <div className="flex items-center gap-0">
          {ACTIVE_CYCLE.phases.map((phase, i) => (
            <div key={phase.name} className="flex items-center flex-1">
              {i > 0 && (
                <div
                  className={`flex-1 h-px ${
                    phase.status === "done" || ACTIVE_CYCLE.phases[i - 1].status === "done"
                      ? "border-t border-success"
                      : "border-t border-border"
                  }`}
                />
              )}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    phase.status === "done"
                      ? "bg-success"
                      : phase.status === "active"
                        ? "bg-brand animate-pulse"
                        : "bg-secondary"
                  }`}
                />
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {phase.name}
                </span>
                {phase.completion !== null && (
                  <span className="text-[10px] font-medium text-foreground">
                    {phase.completion}%
                  </span>
                )}
              </div>
              {i < ACTIVE_CYCLE.phases.length - 1 && (
                <div
                  className={`flex-1 h-px ${
                    phase.status === "done"
                      ? "border-t border-success"
                      : "border-t border-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-foreground">
              {ACTIVE_CYCLE.totalReviews}
            </div>
            <div className="text-[10px] text-muted-foreground">
              Total Reviews
            </div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-success">
              {ACTIVE_CYCLE.completed}
            </div>
            <div className="text-[10px] text-muted-foreground">
              Completed ({completionPct}%)
            </div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-warning">
              {ACTIVE_CYCLE.pending}
            </div>
            <div className="text-[10px] text-muted-foreground">Pending</div>
          </div>
        </div>

        {/* Overdue warning */}
        {ACTIVE_CYCLE.overdueManagers > 0 && (
          <div className="flex items-center gap-2 text-warning text-xs">
            <AlertTriangle className="size-3.5" />
            <span>
              {ACTIVE_CYCLE.overdueManagers} managers are overdue on their
              reviews
            </span>
          </div>
        )}

        {/* AI Insight */}
        <div className="border-l-[3px] border-brand-purple bg-brand-purple/5 p-3 rounded-r-lg">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="size-3.5 text-brand-purple" />
            <span className="text-xs font-medium text-brand-purple">
              AI Insight
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {ACTIVE_CYCLE.aiInsight}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button variant="outline" size="sm">
            <Eye className="size-3.5" />
            View All Reviews
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="size-3.5" />
            Send Reminders
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="size-3.5" />
            Manage
          </Button>
        </div>
      </motion.div>

      {/* Past Cycles Table */}
      <motion.div variants={fadeUp} className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Past Cycles</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left font-medium px-4 py-2.5">Cycle</th>
                <th className="text-left font-medium px-4 py-2.5">Type</th>
                <th className="text-left font-medium px-4 py-2.5">Period</th>
                <th className="text-left font-medium px-4 py-2.5">Status</th>
                <th className="text-left font-medium px-4 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PAST_CYCLES.map((cycle) => (
                <tr
                  key={cycle.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {cycle.name}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {cycle.type}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {cycle.period}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        cycle.status === "completed"
                          ? "bg-success/10 text-success"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {cycle.status === "completed" ? "Completed" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button className="text-xs text-brand hover:underline flex items-center gap-0.5">
                      View <ChevronRight className="size-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
