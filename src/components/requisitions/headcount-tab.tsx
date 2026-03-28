"use client";

import { motion } from "framer-motion";
import { Building2, TrendingUp, Users, ArrowRight } from "lucide-react";
import { DEPT_HEADCOUNTS } from "@/components/requisitions/data";

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

export function HeadcountTab() {
  const totalAuthorized = DEPT_HEADCOUNTS.reduce((s, d) => s + d.authorized, 0);
  const totalCurrent = DEPT_HEADCOUNTS.reduce((s, d) => s + d.current, 0);
  const totalOpen = DEPT_HEADCOUNTS.reduce((s, d) => s + d.openPositions, 0);
  const totalPipeline = DEPT_HEADCOUNTS.reduce((s, d) => s + d.inPipeline, 0);
  const utilization = Math.round((totalCurrent / totalAuthorized) * 100);

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <motion.div
        variants={cardVariants}
        custom={0}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="size-4 text-brand" />
          <h3 className="text-sm font-semibold text-foreground">Headcount Overview</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-2xl font-bold text-foreground">{totalAuthorized}</p>
            <p className="text-xs text-muted-foreground">Authorized</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalCurrent}</p>
            <p className="text-xs text-muted-foreground">Current</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalOpen}</p>
            <p className="text-xs text-muted-foreground">Open Positions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalPipeline}</p>
            <p className="text-xs text-muted-foreground">In Pipeline</p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-bold text-foreground">{utilization}%</p>
              <TrendingUp className="size-4 text-success" />
            </div>
            <p className="text-xs text-muted-foreground">Utilization</p>
          </div>
        </div>
      </motion.div>

      {/* Department swimlanes */}
      <div className="space-y-4">
        {DEPT_HEADCOUNTS.map((dept, i) => {
          const fillPct = Math.round((dept.current / dept.authorized) * 100);
          const pipelinePct = Math.min(100, Math.round((dept.inPipeline / Math.max(dept.openPositions, 1)) * 100));

          return (
            <motion.div
              key={dept.dept}
              custom={i + 1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-card border border-border rounded-xl p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${dept.colorClass}`} />
                  <h4 className="text-sm font-semibold text-foreground">{dept.dept}</h4>
                </div>
                <span className="text-xs text-muted-foreground">
                  {dept.authorized} authorized · {dept.current} current
                </span>
              </div>

              {/* Headcount fill bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Headcount fill</span>
                  <span className="text-xs font-medium text-foreground">{fillPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dept.colorClass} transition-all`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>

              {/* Open + Pipeline */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="size-3" />
                    {dept.openPositions} open position{dept.openPositions !== 1 ? "s" : ""}
                  </span>
                  <span>{dept.inPipeline} in pipeline</span>
                </div>
              </div>

              {/* Pipeline coverage bar */}
              {dept.openPositions > 0 && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-muted-foreground">Pipeline coverage</span>
                    <span className="text-[10px] text-muted-foreground">{dept.inPipeline}/{dept.openPositions}</span>
                  </div>
                  <div className="h-1 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pipelinePct >= 100 ? "bg-success" : pipelinePct >= 50 ? "bg-warning" : "bg-destructive"} transition-all`}
                      style={{ width: `${pipelinePct}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button type="button" className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                  View Details
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
