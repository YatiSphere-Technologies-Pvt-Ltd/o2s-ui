"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type PerfTab,
  PERF_TABS,
  ACTIVE_CYCLE,
} from "@/components/performance/data";
import { ReviewCyclesTab } from "@/components/performance/review-cycles-tab";
import { FeedbackTab } from "@/components/performance/feedback-tab";
import { GoalsTab } from "@/components/performance/goals-tab";
import { CalibrationTab } from "@/components/performance/calibration-tab";
import { OneOnOnesTab } from "@/components/performance/one-on-ones-tab";
import { PerfAnalyticsTab } from "@/components/performance/perf-analytics-tab";

const tabMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: "easeInOut" as const },
};

function ActiveCycleBanner() {
  if (!ACTIVE_CYCLE) return null;

  const activePhaseIndex = ACTIVE_CYCLE.phases.findIndex(
    (p) => p.status === "active"
  );
  const completionPct = Math.round(
    (ACTIVE_CYCLE.completed / ACTIVE_CYCLE.totalReviews) * 100
  );

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-foreground">
            {ACTIVE_CYCLE.name}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/10 text-warning font-medium">
            In Progress
          </span>
        </div>

        {/* Phase stepper */}
        <div className="flex items-center gap-1 mb-2">
          {ACTIVE_CYCLE.phases.map((phase, i) => (
            <div key={phase.name} className="flex items-center">
              {i > 0 && (
                <div className="w-4 h-px border-t border-border mx-0.5" />
              )}
              <div className="flex flex-col items-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    phase.status === "done"
                      ? "bg-success"
                      : phase.status === "active"
                        ? "bg-brand animate-pulse"
                        : "bg-secondary"
                  }`}
                />
                <span className="text-[9px] text-muted-foreground mt-0.5 whitespace-nowrap">
                  {phase.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">
            {completionPct}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-muted-foreground">
          Due {ACTIVE_CYCLE.dueDate}
        </span>
        <Button variant="outline" size="sm">
          Manage Cycle
          <ChevronRight className="size-3" />
        </Button>
      </div>
    </div>
  );
}

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState<PerfTab>("cycles");

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="size-5 text-brand" />
            <h1 className="text-xl font-bold text-foreground">Performance</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Review cycles, continuous feedback, goals, calibration, and
            performance analytics.
          </p>
        </div>

        {/* Active cycle banner */}
        <ActiveCycleBanner />

        {/* Tab pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PERF_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                activeTab === tab.key
                  ? "bg-brand text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === "cycles" && (
            <motion.div key="cycles" {...tabMotion}>
              <ReviewCyclesTab />
            </motion.div>
          )}
          {activeTab === "feedback" && (
            <motion.div key="feedback" {...tabMotion}>
              <FeedbackTab />
            </motion.div>
          )}
          {activeTab === "goals" && (
            <motion.div key="goals" {...tabMotion}>
              <GoalsTab />
            </motion.div>
          )}
          {activeTab === "calibration" && (
            <motion.div key="calibration" {...tabMotion}>
              <CalibrationTab />
            </motion.div>
          )}
          {activeTab === "oneOnOnes" && (
            <motion.div key="oneOnOnes" {...tabMotion}>
              <OneOnOnesTab />
            </motion.div>
          )}
          {activeTab === "analytics" && (
            <motion.div key="analytics" {...tabMotion}>
              <PerfAnalyticsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
