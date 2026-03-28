"use client";

import { motion } from "framer-motion";
import {
  type NewHire,
  type Phase,
  PHASE_CONFIG,
  progressColor,
  pulseEmoji,
  pulseColor,
} from "@/components/onboarding-hub/data";

interface ActiveTabProps {
  hires: NewHire[];
}

const phases: Phase[] = [
  "preboarding",
  "day1",
  "week1",
  "month1",
  "month2",
  "month3",
  "graduated",
];

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export function ActiveTab({ hires }: ActiveTabProps) {
  const grouped = phases
    .map((phase) => ({
      phase,
      config: PHASE_CONFIG[phase],
      items: hires.filter((h) => h.phase === phase),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {grouped.map((group) => (
        <div key={group.phase} className="min-w-[280px] flex-shrink-0">
          {/* Column header */}
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`size-2.5 rounded-full ${group.config.bgClass}`}
            />
            <span className="text-sm font-semibold text-foreground">
              {group.config.label}
            </span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {group.items.length}
            </span>
          </div>

          {/* Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-3"
          >
            {group.items.map((hire) => (
              <motion.div
                key={hire.id}
                variants={cardVariants}
                transition={{
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94] as const,
                }}
                className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-lg"
              >
                {/* Avatar + Name + At-Risk */}
                <div className="flex items-start gap-3">
                  <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal/20 text-xs font-bold text-brand-teal">
                    {hire.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {hire.name}
                      </span>
                      {hire.atRisk && (
                        <span className="animate-pulse rounded-full bg-destructive/10 px-2 text-[10px] font-medium text-destructive">
                          At Risk
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {hire.role}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {hire.department}
                    </p>
                  </div>
                </div>

                {/* Start date / Day X */}
                <div className="mt-2 text-xs text-muted-foreground">
                  {hire.dayNumber !== null
                    ? `Day ${hire.dayNumber}`
                    : `Starts ${hire.startDate}`}
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="h-1 w-full rounded-full bg-secondary">
                    <div
                      className={`h-1 rounded-full ${progressColor(hire.phase)}`}
                      style={{ width: `${hire.progress}%` }}
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div className="mt-2 text-xs text-muted-foreground">
                  {hire.tasksCompleted}/{hire.tasksTotal} tasks
                </div>

                {/* AI line */}
                {hire.aiTasksCompleted > 0 && (
                  <div className="text-[10px] text-brand-teal">
                    {"🤖"} {hire.aiTasksCompleted} auto-done
                  </div>
                )}

                {/* Buddy */}
                <div className="mt-1 text-[10px]">
                  {hire.buddy ? (
                    <span className="text-muted-foreground">
                      {"👤"} {hire.buddy}
                    </span>
                  ) : (
                    <span className="text-warning">{"👤"} TBD</span>
                  )}
                </div>

                {/* Pulse */}
                {hire.pulseScore !== null && (
                  <div
                    className={`mt-1 text-[10px] ${pulseColor(hire.pulseScore)}`}
                  >
                    {pulseEmoji(hire.pulseScore)} {hire.pulseScore.toFixed(1)}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
