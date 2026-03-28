"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MY_GOALS,
  COMPANY_GOALS,
  GOAL_STATUS_CONFIG,
  goalProgressColor,
} from "@/components/performance/data";

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

type GoalView = "my" | "team" | "company" | "alignment";

const SUB_VIEWS: { key: GoalView; label: string }[] = [
  { key: "my", label: "My Goals" },
  { key: "team", label: "Team Goals" },
  { key: "company", label: "Company Goals" },
  { key: "alignment", label: "Alignment" },
];

export function GoalsTab() {
  const [subView, setSubView] = useState<GoalView>("my");

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-5"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Set, track, and align goals and OKRs across the organization.
        </p>
        <Button variant="outline" size="sm">
          <Plus className="size-3.5" />
          New Goal
        </Button>
      </motion.div>

      {/* Sub-view pills */}
      <motion.div variants={fadeUp} className="flex items-center gap-1.5">
        {SUB_VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setSubView(v.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              subView === v.key
                ? "bg-brand text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {v.label}
          </button>
        ))}
      </motion.div>

      {/* My Goals */}
      {(subView === "my" || subView === "team") && (
        <motion.div variants={stagger} className="space-y-3">
          {MY_GOALS.map((goal) => {
            const statusCfg = GOAL_STATUS_CONFIG[goal.status];
            return (
              <motion.div
                key={goal.id}
                variants={fadeUp}
                className="bg-card border border-border rounded-xl p-5 space-y-3"
              >
                {/* Title + Status */}
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">
                    {goal.title}
                  </h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusCfg.bgClass} ${statusCfg.colorClass}`}
                  >
                    {statusCfg.icon} {statusCfg.label}
                  </span>
                </div>

                {/* Aligns to */}
                {goal.alignsTo && (
                  <p className="text-xs text-brand">
                    Aligns to: {goal.alignsTo}
                  </p>
                )}

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${goalProgressColor(goal.progress)}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-foreground">
                    {goal.progress}%
                  </span>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>Due: {goal.dueDate}</span>
                  {goal.completedDate && (
                    <span className="text-success">
                      Completed: {goal.completedDate}
                    </span>
                  )}
                </div>

                {/* Key Results */}
                {goal.keyResults.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Key Results
                    </span>
                    {goal.keyResults.map((kr, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        {kr.done ? (
                          <CheckCircle2 className="size-3.5 text-success mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        )}
                        <span
                          className={
                            kr.done
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }
                        >
                          {kr.text}
                        </span>
                        {kr.progress && (
                          <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
                            {kr.progress}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Review impact */}
                {goal.reviewImpact && (
                  <p className="text-xs text-brand-purple flex items-center gap-1">
                    <Sparkles className="size-3" />
                    {goal.reviewImpact}
                  </p>
                )}

                {/* Benchmark note */}
                {goal.benchmarkNote && (
                  <p className="text-xs text-muted-foreground">
                    {goal.benchmarkNote}
                  </p>
                )}

                {/* AI note */}
                {goal.aiNote && (
                  <div className="border-l-[3px] border-brand-purple bg-brand-purple/5 p-2 rounded-r">
                    <p className="text-xs text-muted-foreground flex items-start gap-1">
                      <Sparkles className="size-3 text-brand-purple mt-0.5 shrink-0" />
                      {goal.aiNote}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Company Goals */}
      {(subView === "company" || subView === "alignment") && (
        <motion.div variants={stagger} className="space-y-4">
          {COMPANY_GOALS.map((goal) => (
            <motion.div
              key={goal.id}
              variants={fadeUp}
              className="bg-card border border-border rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">
                  {goal.title}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {goal.owner}
                </span>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${goalProgressColor(goal.progress)}`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-foreground">
                  {goal.progress}%
                </span>
              </div>

              {/* Children */}
              <div className="pl-4 border-l-2 border-border space-y-3 mt-2">
                {goal.children.map((child, ci) => (
                  <div key={ci} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground">
                        {child.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {child.owner}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${goalProgressColor(child.progress)}`}
                          style={{ width: `${child.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {child.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
