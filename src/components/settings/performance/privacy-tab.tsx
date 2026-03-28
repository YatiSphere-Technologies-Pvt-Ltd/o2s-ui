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

export function PrivacyTab() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground max-w-xl">
        Control anonymity, visibility, and data retention for reviews, feedback, and performance
        data.
      </p>

      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-card border border-border rounded-xl p-6 space-y-6"
      >
        {/* ── Peer Feedback Anonymity ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Peer Feedback Anonymity</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Peer identities hidden from the reviewed employee
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Peer identities visible to the manager
            </label>
          </div>
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1.5">What does the employee see?</p>
            <div className="space-y-1.5 ml-1">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="radio" name="peerVisibility" className="size-3.5 accent-brand" />
                Full verbatim feedback
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="radio"
                  name="peerVisibility"
                  defaultChecked
                  className="size-3.5 accent-brand"
                />
                Aggregated themes only
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="radio" name="peerVisibility" className="size-3.5 accent-brand" />
                Nothing until delivery meeting
              </label>
            </div>
          </div>
        </div>

        {/* ── Self-Review Visibility ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Self-Review Visibility</h3>
          <div className="space-y-1.5 text-sm">
            <p className="text-muted-foreground">
              Manager sees self-review:{" "}
              <span className="text-foreground font-medium">Yes</span>
            </p>
            <p className="text-muted-foreground">
              Timing:{" "}
              <span className="text-foreground font-medium">Before writing their own review</span>
            </p>
          </div>
        </div>

        {/* ── Manager Review Visibility ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Manager Review Visibility</h3>
          <div className="space-y-1.5 text-sm">
            <p className="text-muted-foreground">
              Employee sees manager review:{" "}
              <span className="text-foreground font-medium">After delivery meeting</span>
            </p>
            <p className="text-muted-foreground">
              Employee sees individual ratings:{" "}
              <span className="text-foreground font-medium">Yes</span>
            </p>
            <p className="text-muted-foreground">
              Peer comparison data:{" "}
              <span className="text-foreground font-medium">No</span>
            </p>
          </div>
        </div>

        {/* ── HR/Admin Visibility ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">HR/Admin Visibility</h3>
          <div className="space-y-1.5 text-sm">
            <p className="text-muted-foreground">
              HR sees all reviews:{" "}
              <span className="text-foreground font-medium">Yes</span>
            </p>
            <p className="text-muted-foreground">
              Skip-level manager access:{" "}
              <span className="text-foreground font-medium">Summary only</span>
            </p>
          </div>
        </div>

        {/* ── Data Retention ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Data Retention</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="retention"
                defaultChecked
                className="size-3.5 accent-brand"
              />
              Retain indefinitely
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="radio" name="retention" className="size-3.5 accent-brand" />
              Delete after 3 years
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="radio" name="retention" className="size-3.5 accent-brand" />
              Anonymize after employee departure
            </label>
          </div>
        </div>

        {/* ── Sensitive Fields ── */}
        <div className="border-l-[3px] border-rose-500 pl-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Sensitive Fields</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              PIP status restricted to HR + direct manager
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Compensation-linked ratings hidden from peers
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Calibration discussion notes restricted
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Flight risk scores visible to HR only
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              AI-generated insights require manager opt-in
            </label>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
