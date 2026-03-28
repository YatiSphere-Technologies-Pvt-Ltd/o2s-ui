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

export function AutomationTab() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground max-w-xl">
        Configure automated reminders, escalation rules, cycle launches, triggers, and AI nudges.
      </p>

      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-card border border-border rounded-xl p-6 space-y-6"
      >
        {/* ── Reminder Schedule ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Reminder Schedule</h3>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p>
              Phase start reminder:{" "}
              <span className="text-foreground font-medium">1 day before</span>
            </p>
            <p>
              Deadline approaching:{" "}
              <span className="text-foreground font-medium">3 days before</span>
            </p>
            <p>
              Overdue frequency:{" "}
              <span className="text-foreground font-medium">Daily</span>
            </p>
            <p>
              Max reminders per phase:{" "}
              <span className="text-foreground font-medium">5</span>
            </p>
          </div>
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1.5">Channels:</p>
            <div className="space-y-1.5 ml-1">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                Email
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                In-app notification
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                Slack
              </label>
            </div>
          </div>
        </div>

        {/* ── Escalation Rules ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Escalation Rules</h3>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p>
              After <span className="text-foreground font-medium">3 days</span> overdue — Notify
              direct manager
            </p>
            <p>
              After <span className="text-foreground font-medium">5 days</span> overdue — Notify
              skip-level manager
            </p>
            <p>
              After <span className="text-foreground font-medium">7 days</span> overdue — Notify HR
              Business Partner
            </p>
          </div>
        </div>

        {/* ── Cycle Auto-Launch ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Cycle Auto-Launch</h3>
          <label className="flex items-center gap-2 text-sm text-foreground mb-2">
            <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
            Enable automatic cycle launch
          </label>
          <div className="space-y-1.5 text-sm text-muted-foreground ml-1">
            <p>
              Annual review:{" "}
              <span className="text-foreground font-medium">January 15 &amp; July 15</span>
            </p>
            <p>
              Quarterly check-in:{" "}
              <span className="text-foreground font-medium">
                Apr 1, Jul 1, Oct 1, Jan 1
              </span>
            </p>
          </div>
        </div>

        {/* ── Automated Triggers ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Automated Triggers</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Auto-assign reviewers based on reporting structure
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Auto-populate goals from previous cycle
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Auto-close phases after deadline + grace period
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Auto-generate review summary after all inputs received
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-3.5 accent-brand" />
              Auto-schedule calibration meetings
            </label>
          </div>
        </div>

        {/* ── AI Nudge Settings ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">AI Nudge Settings</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Nudge managers to add specific examples
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Suggest peer nominees based on collaboration data
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Flag potentially biased language in reviews
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Recommend development goals based on gaps
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-3.5 accent-brand" />
              Auto-draft talking points for delivery meetings
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Frequency limit:{" "}
            <span className="text-foreground font-medium">2 per week per user</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
