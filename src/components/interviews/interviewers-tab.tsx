"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import {
  INTERVIEWERS,
  loadBarColor,
} from "@/components/interviews/data";

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  available: { label: "Available", bg: "bg-success/10", text: "text-success" },
  busy: { label: "Busy", bg: "bg-warning/10", text: "text-warning" },
  overloaded: { label: "Overloaded", bg: "bg-destructive/10", text: "text-destructive" },
};

export function InterviewersTab() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="px-4 py-3 font-medium">Interviewer</th>
            <th className="px-3 py-3 font-medium">Department</th>
            <th className="px-3 py-3 font-medium">Types</th>
            <th className="px-3 py-3 font-medium">This Week</th>
            <th className="px-3 py-3 font-medium">Avg Score</th>
            <th className="px-3 py-3 font-medium">Feedback Time</th>
            <th className="px-3 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {INTERVIEWERS.map((interviewer, i) => {
            const statusCfg = STATUS_CONFIG[interviewer.status];
            const loadPct = Math.min((interviewer.thisWeek / interviewer.maxPerWeek) * 100, 100);
            const barColor = loadBarColor(interviewer.status);

            return (
              <motion.tr
                key={interviewer.id}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                custom={i}
                className={`border-b border-border last:border-b-0 ${
                  interviewer.status === "overloaded" ? "border-l-2 border-l-destructive" : ""
                }`}
              >
                {/* Interviewer */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-purple/10 text-xs font-bold text-brand-purple">
                      {interviewer.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {interviewer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{interviewer.role}</p>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td className="px-3 py-3 text-xs text-muted-foreground">
                  {interviewer.department}
                </td>

                {/* Types */}
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {interviewer.interviewTypes.map((type) => (
                      <span
                        key={type}
                        className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </td>

                {/* This Week */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground">
                      {interviewer.thisWeek}/{interviewer.maxPerWeek}
                    </span>
                    <div className="h-1.5 w-16 rounded-full bg-secondary">
                      <div
                        className={`h-1.5 rounded-full ${barColor}`}
                        style={{ width: `${loadPct}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Avg Score */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-warning text-warning" />
                    <span className="text-xs font-medium text-foreground">
                      {interviewer.avgScore.toFixed(1)}
                    </span>
                  </div>
                </td>

                {/* Feedback Time */}
                <td className="px-3 py-3 text-xs text-muted-foreground">
                  {interviewer.avgFeedbackTime}
                </td>

                {/* Status */}
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusCfg.bg} ${statusCfg.text}`}
                  >
                    {statusCfg.label}
                  </span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
