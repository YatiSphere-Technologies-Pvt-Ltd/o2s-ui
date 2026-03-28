"use client";

import { motion } from "framer-motion";
import { Check, Circle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type NewHire,
  PREBOARDING_TASKS,
  type PreboardingTask,
} from "@/components/onboarding-hub/data";

interface PreboardingTabProps {
  hires: NewHire[];
}

const genericTasks: PreboardingTask[] = [
  { text: "Offer letter signed", done: false, date: null, assignee: "manual" },
  {
    text: "Background check initiated",
    done: false,
    date: null,
    assignee: "auto",
  },
  {
    text: "Welcome email drafted",
    done: false,
    date: null,
    assignee: "agent",
  },
  { text: "Laptop ordered", done: false, date: null, assignee: "scheduled" },
  {
    text: "Account provisioning queued",
    done: false,
    date: null,
    assignee: "scheduled",
  },
];

const assigneeBadge: Record<string, { label: string; cls: string }> = {
  auto: { label: "Auto", cls: "bg-secondary text-secondary-foreground" },
  agent: { label: "🤖 Agent", cls: "bg-brand-teal/10 text-brand-teal" },
  scheduled: { label: "🤖 Sched", cls: "bg-brand/10 text-brand" },
  manual: { label: "Manual", cls: "bg-warning/10 text-warning" },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export function PreboardingTab({ hires }: PreboardingTabProps) {
  const preboardingHires = hires.filter((h) => h.phase === "preboarding");

  if (preboardingHires.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-card p-12 text-muted-foreground">
        No pre-boarding hires match your filters.
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {preboardingHires.map((hire) => {
        const tasks = PREBOARDING_TASKS[hire.id] ?? genericTasks;
        const doneCount = tasks.filter((t) => t.done).length;
        const progress = Math.round((doneCount / tasks.length) * 100);

        return (
          <motion.div
            key={hire.id}
            variants={cardVariants}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
            className="rounded-xl border border-border bg-card p-5"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand-teal/20 text-sm font-bold text-brand-teal">
                  {hire.initials}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {hire.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{hire.role}</p>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>
                  Starts{" "}
                  <span className="font-semibold text-foreground">
                    {hire.startDate}
                  </span>
                </div>
                <div>{hire.department}</div>
                <div>Manager: {hire.manager}</div>
                <div>{hire.location}</div>
              </div>
            </div>

            {/* Checklist */}
            <div className="mt-4 space-y-2">
              {tasks.map((task, i) => {
                const badge = assigneeBadge[task.assignee];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm"
                  >
                    {task.done ? (
                      <Check className="size-4 flex-shrink-0 text-success" />
                    ) : (
                      <Circle className="size-4 flex-shrink-0 text-muted-foreground" />
                    )}
                    <span
                      className={
                        task.done
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }
                    >
                      {task.text}
                    </span>
                    {task.date && (
                      <span className="text-xs text-muted-foreground">
                        {task.date}
                      </span>
                    )}
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {doneCount}/{tasks.length} complete
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 w-full rounded-full bg-secondary">
                <div
                  className="h-1 rounded-full bg-brand-teal"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* AI Strip */}
            <div className="mt-4 flex items-start gap-2 rounded-r-lg border-l-[3px] border-brand-teal bg-brand-teal/5 p-3">
              <Sparkles className="size-4 flex-shrink-0 text-brand-teal" />
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-brand-teal">AI Agent:</span>{" "}
                {hire.aiTasksCompleted} tasks auto-completed. Remaining
                scheduled tasks will execute on{" "}
                <span className="text-foreground">
                  {hire.startDate.replace(/\d+/, (m) =>
                    String(Number(m) - 2)
                  )}
                </span>
                .
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                View full journey
              </Button>
              <Button variant="outline" size="sm">
                Edit checklist
              </Button>
              <Button variant="outline" size="sm">
                Send welcome pkg
              </Button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
