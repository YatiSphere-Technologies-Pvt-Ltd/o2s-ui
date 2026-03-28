"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users, Clock, Activity, Briefcase } from "lucide-react";
import {
  type Job,
  DEPT_COLORS,
  healthColor,
  healthBarColor,
  healthLabel,
  daysOpenColor,
} from "@/components/jobs/data";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface JobsDepartmentViewProps {
  jobs: Job[];
  onSelectJob: (j: Job) => void;
}

/* ------------------------------------------------------------------ */
/*  Mini Job Card                                                      */
/* ------------------------------------------------------------------ */

function MiniJobCard({
  job,
  onClick,
  index,
}: {
  job: Job;
  onClick: () => void;
  index: number;
}) {
  const score = job.healthScore;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      onClick={onClick}
      className="min-w-[220px] max-w-[260px] shrink-0 rounded-lg border border-border bg-card p-3.5 text-left hover:border-brand/30 hover:bg-card/80 transition-colors cursor-pointer space-y-2.5"
    >
      {/* Title */}
      <p className="text-sm font-semibold text-foreground truncate">
        {job.title}
      </p>

      {/* Candidate count */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="size-3" />
        <span>
          {job.totalCandidates} candidate{job.totalCandidates !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Health score + bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Health</span>
          <span className={`font-semibold tabular-nums ${healthColor(score)}`}>
            {score !== null ? score : "—"}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${healthBarColor(score)}`}
            initial={{ width: 0 }}
            animate={{ width: `${score ?? 0}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Days open */}
      <div className="flex items-center gap-1.5 text-xs">
        <Clock className="size-3 text-muted-foreground" />
        <span className={daysOpenColor(job.daysOpen)}>
          {job.daysOpen !== null ? `${job.daysOpen} days open` : "Not posted"}
        </span>
      </div>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Department Section                                                 */
/* ------------------------------------------------------------------ */

function DepartmentSection({
  department,
  jobs,
  onSelectJob,
  index,
}: {
  department: string;
  jobs: Job[];
  onSelectJob: (j: Job) => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(true);

  const deptColor = DEPT_COLORS[department] ?? {
    colorClass: "bg-muted-foreground",
    textClass: "text-muted-foreground",
  };

  const activeJobs = jobs.filter(
    (j) => j.status === "active" || j.status === "internal"
  );
  const totalCandidates = jobs.reduce((sum, j) => sum + j.totalCandidates, 0);

  const avgHealth = useMemo(() => {
    const scored = jobs.filter((j) => j.healthScore !== null);
    if (scored.length === 0) return null;
    return Math.round(
      scored.reduce((sum, j) => sum + (j.healthScore ?? 0), 0) / scored.length
    );
  }, [jobs]);

  const avgDaysOpen = useMemo(() => {
    const opened = jobs.filter((j) => j.daysOpen !== null);
    if (opened.length === 0) return null;
    return Math.round(
      opened.reduce((sum, j) => sum + (j.daysOpen ?? 0), 0) / opened.length
    );
  }, [jobs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="space-y-3"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-3 text-left group"
      >
        <span className={`size-3 rounded-full shrink-0 ${deptColor.colorClass}`} />
        <h3 className="text-sm font-bold text-foreground">{department}</h3>
        <span className="text-xs text-muted-foreground">
          ({activeJobs.length} open role{activeJobs.length !== 1 ? "s" : ""} &middot;{" "}
          {totalCandidates} active candidate{totalCandidates !== 1 ? "s" : ""})
        </span>
        <motion.span
          animate={{ rotate: expanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="ml-auto"
        >
          <ChevronDown className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.span>
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden space-y-3"
          >
            {/* Summary bar */}
            <div className="bg-card border border-border rounded-lg p-3 grid grid-cols-4 gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Activity className="size-3" />
                  Avg Health
                </div>
                <p className={`text-sm font-bold tabular-nums ${healthColor(avgHealth)}`}>
                  {avgHealth !== null ? avgHealth : "—"}
                </p>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  Avg Days Open
                </div>
                <p className={`text-sm font-bold tabular-nums ${daysOpenColor(avgDaysOpen)}`}>
                  {avgDaysOpen !== null ? avgDaysOpen : "—"}
                </p>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Users className="size-3" />
                  Total Candidates
                </div>
                <p className="text-sm font-bold tabular-nums text-foreground">
                  {totalCandidates}
                </p>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Briefcase className="size-3" />
                  Jobs Count
                </div>
                <p className="text-sm font-bold tabular-nums text-foreground">
                  {jobs.length}
                </p>
              </div>
            </div>

            {/* Horizontally scrollable row of mini job cards */}
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
              {jobs.map((job, i) => (
                <MiniJobCard
                  key={job.id}
                  job={job}
                  onClick={() => onSelectJob(job)}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function JobsDepartmentView({
  jobs,
  onSelectJob,
}: JobsDepartmentViewProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, Job[]>();
    for (const job of jobs) {
      const dept = job.department;
      if (!map.has(dept)) map.set(dept, []);
      map.get(dept)!.push(job);
    }
    // Sort departments by number of jobs desc
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [jobs]);

  return (
    <div className="space-y-6 px-6 pb-6">
      {grouped.map(([dept, deptJobs], i) => (
        <DepartmentSection
          key={dept}
          department={dept}
          jobs={deptJobs}
          onSelectJob={onSelectJob}
          index={i}
        />
      ))}
    </div>
  );
}
