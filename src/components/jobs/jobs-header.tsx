"use client";

import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATUS_CONFIG } from "@/components/jobs/data";

type PrimaryView = "alljobs" | "department" | "analytics";

interface JobsHeaderProps {
  primaryView: PrimaryView;
  onPrimaryViewChange: (view: PrimaryView) => void;
  totalCounts: { active: number; draft: number; paused: number; closed: number };
}

const PRIMARY_TABS: { value: PrimaryView; label: string }[] = [
  { value: "alljobs", label: "All Jobs" },
  { value: "department", label: "By Department" },
  { value: "analytics", label: "Analytics" },
];

export function JobsHeader({
  primaryView,
  onPrimaryViewChange,
  totalCounts,
}: JobsHeaderProps) {
  return (
    <div className="w-full px-6 py-4 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex justify-between items-start">
        {/* Left: Title + subtitle */}
        <div>
          <h1 className="text-xl font-bold text-foreground">Jobs</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <span className="inline-flex items-center gap-1">
              <span className={`size-2 rounded-full ${STATUS_CONFIG.active.dotClass}`} />
              <span className="text-foreground font-semibold">{totalCounts.active}</span>
              <span>active</span>
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="inline-flex items-center gap-1">
              <span className={`size-2 rounded-full ${STATUS_CONFIG.draft.dotClass}`} />
              <span className="text-foreground font-semibold">{totalCounts.draft}</span>
              <span>draft</span>
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="inline-flex items-center gap-1">
              <span className={`size-2 rounded-full ${STATUS_CONFIG.paused.dotClass}`} />
              <span className="text-foreground font-semibold">{totalCounts.paused}</span>
              <span>paused</span>
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="inline-flex items-center gap-1">
              <span className={`size-2 rounded-full ${STATUS_CONFIG.closed.dotClass}`} />
              <span className="text-foreground font-semibold">{totalCounts.closed}</span>
              <span>closed</span>
            </span>
          </p>
        </div>

        {/* Right: Action buttons */}
        <div className="flex gap-3">
          <Button
            size="sm"
            className="bg-brand text-white hover:bg-brand/90"
          >
            <Plus className="size-3.5" />
            Post New Job
          </Button>
          <Button
            size="sm"
            className="bg-brand-purple/10 border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/20"
          >
            <Sparkles className="size-3.5" />
            AI Actions
          </Button>
        </div>
      </div>

      {/* Segmented pill tabs */}
      <div className="flex items-center bg-secondary rounded-lg p-0.5 w-fit">
        {PRIMARY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onPrimaryViewChange(tab.value)}
            className="relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
          >
            {primaryView === tab.value && (
              <motion.span
                layoutId="jobs-primary-tab"
                className="absolute inset-0 bg-card rounded-md shadow-sm"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span
              className={`relative z-10 ${
                primaryView === tab.value
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
