"use client";

import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Circle,
  Calendar,
  User,
  MapPin,
  Mail,
} from "lucide-react";
import { HR_QUEUE } from "@/components/requisitions/data";

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

function urgencyForDays(days: number): { label: string; colorClass: string; bgClass: string } {
  if (days < 7) return { label: "URGENT", colorClass: "text-destructive", bgClass: "bg-destructive/10" };
  if (days < 14) return { label: "SOON", colorClass: "text-warning", bgClass: "bg-warning/10" };
  return { label: "ON TRACK", colorClass: "text-success", bgClass: "bg-success/10" };
}

function TaskIcon({ status }: { status: "done" | "in_progress" | "pending" }) {
  if (status === "done") return <Check className="size-3 text-success" />;
  if (status === "in_progress") return <Clock className="size-3 text-warning" />;
  return <Circle className="size-3 text-muted-foreground" />;
}

export function HRQueueTab() {
  const joiningIn7 = HR_QUEUE.filter((h) => h.daysUntilJoining < 7).length;
  const joining7to14 = HR_QUEUE.filter((h) => h.daysUntilJoining >= 7 && h.daysUntilJoining < 14).length;
  const joining14plus = HR_QUEUE.filter((h) => h.daysUntilJoining >= 14).length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <motion.div
        variants={cardVariants}
        custom={0}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-6"
      >
        <div>
          <p className="text-lg font-bold text-foreground">{HR_QUEUE.length}</p>
          <p className="text-xs text-muted-foreground">In HR Queue</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs">
            <span className="size-2 rounded-full bg-destructive" />
            {joiningIn7} joining in &lt;7d
          </span>
          <span className="flex items-center gap-1 text-xs">
            <span className="size-2 rounded-full bg-warning" />
            {joining7to14} in 7-14d
          </span>
          <span className="flex items-center gap-1 text-xs">
            <span className="size-2 rounded-full bg-success" />
            {joining14plus} in 14+d
          </span>
        </div>
      </motion.div>

      {/* HR Queue cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {HR_QUEUE.map((item, i) => {
          const badge = urgencyForDays(item.daysUntilJoining);

          return (
            <motion.div
              key={item.id}
              custom={i + 1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all"
            >
              {/* Urgency badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.colorClass} ${badge.bgClass}`}>
                  {badge.label} — {item.daysUntilJoining}d until joining
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{item.requisitionId}</span>
              </div>

              {/* Candidate info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold">
                  {item.candidateInitials}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{item.candidateName}</h3>
                  <p className="text-xs text-muted-foreground">{item.jobTitle} — {item.slotInfo}</p>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs text-muted-foreground">
                <span>{item.department}</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="size-3" />
                  {item.location}
                </span>
                <span className="flex items-center gap-0.5">
                  <Calendar className="size-3" />
                  Joining: {item.joiningDate}
                </span>
              </div>

              {/* Handoff info */}
              <div className="mb-3 text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <span className="flex items-center gap-0.5">
                    <User className="size-3" />
                    Handoff by: {item.handoffBy}
                  </span>
                  <span>Date: {item.handoffDate}</span>
                  <span>{item.offerDetails}</span>
                </div>
              </div>

              {/* HR Tasks checklist */}
              <div className="mb-3 space-y-1.5">
                <p className="text-[10px] font-semibold text-foreground uppercase tracking-wider">HR Tasks</p>
                {item.tasks.map((task, ti) => (
                  <div key={ti} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TaskIcon status={task.status} />
                    <span className={task.status === "done" ? "line-through opacity-60" : ""}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pre-boarding progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-muted-foreground">Pre-boarding</span>
                  <span className="text-[10px] font-medium text-foreground">{item.preboardingProgress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-teal transition-all"
                    style={{ width: `${item.preboardingProgress}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <button type="button" className="text-xs font-medium text-brand-purple hover:underline">View Onboarding Journey</button>
                <button type="button" className="text-xs font-medium text-brand hover:underline">Create Employee Record</button>
                <button type="button" className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-0.5">
                  <Mail className="size-3" />
                  Contact
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
