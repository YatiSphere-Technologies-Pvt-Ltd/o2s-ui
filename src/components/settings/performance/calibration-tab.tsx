"use client";

import { motion } from "framer-motion";
import { DISTRIBUTION_TARGETS } from "@/components/settings/performance/data";

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function CalibrationTab() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground max-w-xl">
        Configure rating distribution targets, enforcement rules, and bias detection thresholds for
        calibration sessions.
      </p>

      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-card border border-border rounded-xl p-6 space-y-6"
      >
        {/* ── Expected Distribution ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Expected Distribution</h3>
          <div className="space-y-2.5">
            {DISTRIBUTION_TARGETS.map((dt) => (
              <div key={dt.rating} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-24 shrink-0">{dt.rating}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dt.colorClass}`}
                    style={{
                      width: `${parseInt(dt.target.split("-")[1] || dt.target.split("-")[0])}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-16 text-right">{dt.target}</span>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {dt.tolerance}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Enforcement ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Enforcement</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="enforcement"
                defaultChecked
                className="size-3.5 accent-brand"
              />
              Advisory — Show targets, no blocking
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="radio" name="enforcement" className="size-3.5 accent-brand" />
              Soft Gate — Warn when outside tolerance
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="radio" name="enforcement" className="size-3.5 accent-brand" />
              Hard Gate — Block submission outside tolerance
            </label>
          </div>
        </div>

        {/* ── Apply at ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Apply at</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="radio" name="applyAt" className="size-3.5 accent-brand" />
              Company level
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="applyAt"
                defaultChecked
                className="size-3.5 accent-brand"
              />
              Department level
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="radio" name="applyAt" className="size-3.5 accent-brand" />
              Team level
            </label>
          </div>
        </div>

        {/* ── Calibration Requirements ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Calibration Requirements</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Minimum 2 calibrators per session
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              HR representative must be present
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Written justification for any rating change
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-3.5 accent-brand" />
              Skip-level manager approval for extreme ratings
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Document dissenting opinions
            </label>
          </div>
        </div>

        {/* ── Bias Detection Thresholds ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Bias Detection Thresholds
          </h3>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p>
              Gender disparity alert: &gt;0.3 point average gap between groups
            </p>
            <p>
              Tenure bias check: Flag if &lt;1yr employees rated 15%+ lower than average
            </p>
            <p>
              Central tendency: Alert if &gt;80% of ratings fall on a single value
            </p>
            <p>
              Recency bias: Flag if Q4 incidents weighted &gt;50% of narrative
            </p>
          </div>
        </div>

        {/* ── Rating Change Limits ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Rating Change Limits</h3>
          <p className="text-sm text-muted-foreground">
            Maximum change during calibration: <span className="text-foreground font-medium">±1 level</span> without
            VP approval
          </p>
        </div>
      </motion.div>
    </div>
  );
}
