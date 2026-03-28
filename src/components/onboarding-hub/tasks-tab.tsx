"use client";

import { motion } from "framer-motion";
import {
  Check,
  Circle,
  AlertTriangle,
  Clock,
  Sparkles,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_TASKS, type TaskItem } from "@/components/onboarding-hub/data";

type TaskType = TaskItem["type"];

const sectionConfig: Record<
  TaskType,
  {
    label: string;
    borderClass: string;
    bgClass: string;
    icon: typeof AlertTriangle;
    iconClass: string;
  }
> = {
  overdue: {
    label: "Overdue",
    borderClass: "border-l-[3px] border-destructive",
    bgClass: "bg-destructive/5 rounded-lg p-4",
    icon: AlertTriangle,
    iconClass: "text-destructive",
  },
  today: {
    label: "Due Today",
    borderClass: "border-l-[3px] border-warning",
    bgClass: "",
    icon: Clock,
    iconClass: "text-warning",
  },
  week: {
    label: "This Week",
    borderClass: "border-l-[3px] border-brand",
    bgClass: "",
    icon: Clock,
    iconClass: "text-brand",
  },
  upcoming: {
    label: "Upcoming",
    borderClass: "border-l-[3px] border-muted-foreground",
    bgClass: "",
    icon: Circle,
    iconClass: "text-muted-foreground",
  },
  ai_scheduled: {
    label: "AI Scheduled",
    borderClass: "border-l-[3px] border-brand-teal",
    bgClass: "bg-brand-teal/5 rounded-lg p-4",
    icon: Sparkles,
    iconClass: "text-brand-teal",
  },
};

const typeOrder: TaskType[] = [
  "overdue",
  "today",
  "week",
  "upcoming",
  "ai_scheduled",
];

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

export function TasksTab() {
  const grouped = typeOrder
    .map((type) => ({
      type,
      config: sectionConfig[type],
      items: ALL_TASKS.filter((t) => t.type === type),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {grouped.map((group) => {
        const SectionIcon = group.config.icon;
        return (
          <section key={group.type}>
            <div
              className={`flex items-center gap-2 mb-3 pl-2 ${group.config.borderClass}`}
            >
              <SectionIcon
                className={`size-4 ${group.config.iconClass}`}
              />
              <h3 className="text-sm font-semibold text-foreground">
                {group.config.label}
              </h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                {group.items.length}
              </span>
            </div>

            <div className={group.config.bgClass}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {group.items.map((task) => (
                  <motion.div
                    key={task.id}
                    variants={cardVariants}
                    transition={{
                      duration: 0.25,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    }}
                    className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    {/* Status icon */}
                    {task.type === "overdue" ? (
                      <AlertTriangle className="size-4 flex-shrink-0 text-destructive" />
                    ) : task.type === "ai_scheduled" ? (
                      <Sparkles className="size-4 flex-shrink-0 text-brand-teal" />
                    ) : (
                      <Circle className="size-4 flex-shrink-0 text-muted-foreground" />
                    )}

                    {/* Task text */}
                    <span className="text-sm text-foreground">{task.text}</span>

                    {/* New hire name */}
                    <span className="text-xs text-muted-foreground">
                      {task.newHire}
                    </span>

                    {/* Phase */}
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                      {task.phase}
                    </span>

                    {/* Due date */}
                    <span
                      className={`ml-auto text-xs ${
                        task.type === "overdue"
                          ? "font-medium text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {task.dueDate}
                      {task.overdueDays !== undefined &&
                        ` (${task.overdueDays}d overdue)`}
                    </span>

                    {/* Assignee */}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        task.assignee === "Agent"
                          ? "bg-brand-teal/10 text-brand-teal"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {task.assignee}
                    </span>

                    {/* Actions */}
                    <div className="flex gap-1">
                      {task.type === "overdue" && (
                        <Button variant="ghost" size="icon-xs">
                          <Bell className="size-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-xs">
                        <Check className="size-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
