"use client";

import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function GoalsTab() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground max-w-xl">
        Configure how goals are structured, aligned, and integrated into performance reviews.
      </p>

      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-card border border-border rounded-xl p-6 space-y-6"
      >
        {/* ── Goal Type ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Goal Type</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="radio" name="goalType" className="size-3.5 accent-brand" />
              KPIs (Key Performance Indicators)
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="goalType"
                defaultChecked
                className="size-3.5 accent-brand"
              />
              OKRs (Objectives &amp; Key Results)
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="radio" name="goalType" className="size-3.5 accent-brand" />
              SMART Goals
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="radio" name="goalType" className="size-3.5 accent-brand" />
              Hybrid (OKR + KPI)
            </label>
          </div>
        </div>

        {/* ── Goal Cadence ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Goal Cadence</h3>
          <div className="space-y-1.5 text-sm">
            <p className="text-muted-foreground">
              Default cadence: <span className="text-foreground font-medium">Quarterly</span>
            </p>
            <p className="text-muted-foreground">
              Align with review cycles: <span className="text-foreground font-medium">Yes</span>
            </p>
          </div>
        </div>

        {/* ── Alignment Rules ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Alignment Rules</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Individual goals must align to team objectives
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Team objectives must align to company OKRs
            </label>
          </div>
        </div>

        {/* ── Review Integration ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Review Integration</h3>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Goal weight in overall review score:{" "}
              <span className="text-foreground font-medium">30%</span>
            </p>
            <div>
              <p className="text-muted-foreground mb-1.5">Scoring method:</p>
              <div className="space-y-1.5 ml-1">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name="scoringMethod"
                    defaultChecked
                    className="size-3.5 accent-brand"
                  />
                  Percentage (0-100%)
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="radio" name="scoringMethod" className="size-3.5 accent-brand" />
                  Rating scale (1-5)
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="radio" name="scoringMethod" className="size-3.5 accent-brand" />
                  Binary (Met / Not Met)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Goal Features ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">AI Goal Features</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              AI-suggested goals based on role and level
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Automatic progress tracking from integrated tools
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              AI alignment checker (flag misaligned goals)
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-3.5 accent-brand" />
              Predictive goal completion estimates
            </label>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
