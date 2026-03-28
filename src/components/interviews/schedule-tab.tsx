"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Filter, LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SCHEDULED_INTERVIEWS,
  INTERVIEW_TYPE_CONFIG,
  type ScheduledInterview,
} from "@/components/interviews/data";

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DATE_LABELS: Record<string, string> = {
  Mon: "Mar 24",
  Tue: "Mar 25",
  Wed: "Mar 26",
  Thu: "Mar 27",
  Fri: "Mar 28",
};

function groupByDay(interviews: ScheduledInterview[]): Record<string, ScheduledInterview[]> {
  const grouped: Record<string, ScheduledInterview[]> = {};
  for (const day of DAYS) {
    grouped[day] = [];
  }
  for (const interview of interviews) {
    if (grouped[interview.day]) {
      grouped[interview.day].push(interview);
    }
  }
  return grouped;
}

function StatusBadge({ status }: { status: ScheduledInterview["status"] }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    completed: { bg: "bg-success/10", text: "text-success", label: "Completed" },
    scheduled: { bg: "bg-brand/10", text: "text-brand", label: "Scheduled" },
    in_progress: { bg: "bg-warning/10", text: "text-warning", label: "In Progress" },
    cancelled: { bg: "bg-destructive/10", text: "text-destructive", label: "Cancelled" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

export function ScheduleTab() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [jobFilter] = useState("All Jobs");
  const [interviewerFilter] = useState("All Interviewers");
  const [typeFilter] = useState("All Types");

  const grouped = groupByDay(SCHEDULED_INTERVIEWS);
  let globalIndex = 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Week navigation + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-semibold text-foreground">This Week</span>
          <Button variant="ghost" size="icon-sm">
            <ChevronRight className="size-4" />
          </Button>
          <span className="text-xs text-muted-foreground">Mar 24 – Mar 28, 2026</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Filter className="size-3.5 text-muted-foreground" />
            <select className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground">
              <option>{jobFilter}</option>
            </select>
            <select className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground">
              <option>{interviewerFilter}</option>
            </select>
            <select className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground">
              <option>{typeFilter}</option>
            </select>
          </div>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            <button onClick={() => setViewMode("cards")} className={`p-1.5 rounded-md transition-colors ${viewMode === "cards" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutGrid className="size-4" />
            </button>
            <button onClick={() => setViewMode("table")} className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <Table2 className="size-4" />
            </button>
          </div>
          <Button className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90" size="sm">
            <Plus className="size-3.5" />
            Schedule Interview
          </Button>
        </div>
      </div>

      {viewMode === "table" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Time</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Candidate</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Interviewer</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Duration</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Platform</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...SCHEDULED_INTERVIEWS]
                .sort((a, b) => {
                  const dayOrder = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
                  if (dayOrder !== 0) return dayOrder;
                  return a.time.localeCompare(b.time);
                })
                .map((interview, i) => {
                  const config = INTERVIEW_TYPE_CONFIG[interview.type] ?? { colorClass: "bg-secondary", icon: "\u{1F4CB}" };
                  return (
                    <motion.tr
                      key={interview.id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-3 py-3 text-muted-foreground">{interview.date}</td>
                      <td className="px-3 py-3 font-mono font-medium text-foreground">{interview.time}</td>
                      <td className="px-3 py-3">
                        <span className="flex items-center gap-1.5">
                          <span className={`size-2 rounded-full ${config.colorClass}`} />
                          {interview.type}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-medium text-foreground">{interview.candidate}</td>
                      <td className="px-3 py-3 text-muted-foreground">{interview.role}</td>
                      <td className="px-3 py-3 text-muted-foreground">{interview.interviewer}</td>
                      <td className="px-3 py-3 text-muted-foreground">{interview.duration}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{interview.platform}</span>
                      </td>
                      <td className="px-3 py-3"><StatusBadge status={interview.status} /></td>
                    </motion.tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* Week view - horizontal columns */}
      {viewMode === "cards" && (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {DAYS.map((day) => {
          const interviews = grouped[day];
          return (
            <div key={day} className="flex min-w-[220px] flex-1 flex-col gap-2">
              {/* Day header */}
              <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                <span className="text-xs font-semibold text-foreground">{day}</span>
                <span className="text-xs text-muted-foreground">{DATE_LABELS[day]}</span>
                {interviews.length > 0 && (
                  <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                    {interviews.length}
                  </span>
                )}
              </div>

              {/* Interview cards */}
              {interviews.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  No interviews
                </div>
              ) : (
                interviews.map((interview) => {
                  const config = INTERVIEW_TYPE_CONFIG[interview.type] ?? {
                    colorClass: "bg-secondary",
                    icon: "📋",
                  };
                  const idx = globalIndex++;
                  return (
                    <motion.div
                      key={interview.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={idx}
                      className={`border-l-[3px] ${config.colorClass} rounded-lg border border-border bg-card p-3`}
                      style={{ borderLeftColor: undefined }}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {interview.time}
                        </span>
                        <StatusBadge status={interview.status} />
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-sm">{config.icon}</span>
                        <span className="text-xs font-medium text-foreground">
                          {interview.type}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {interview.interviewer}
                      </p>
                      <div className="mt-1.5">
                        <p className="text-xs font-medium text-foreground">
                          {interview.candidate}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {interview.role}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {interview.platform}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {interview.duration}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
