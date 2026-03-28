"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building,
  ChevronDown,
  Clock,
  Globe,
  Home,
  MapPin,
  MessageSquare,
  Sparkles,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  type Job,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  DEPT_COLORS,
  PIPELINE_STAGES,
  healthColor,
  healthLabel,
  daysOpenColor,
} from "@/components/jobs/data";

/* ── Work-model icon ── */

const WORK_MODEL_ICON: Record<Job["workModel"], React.ReactNode> = {
  Hybrid: <Home className="size-3" />,
  Remote: <Globe className="size-3" />,
  "On-site": <Building className="size-3" />,
};

/* ── Mock recent activity ── */

function recentActivity(job: Job) {
  if (job.status === "draft") {
    return [
      { icon: <Clock className="size-3" />, text: "Requisition created", time: "2d ago" },
      { icon: <User className="size-3" />, text: "Assigned to " + job.recruiter.name, time: "2d ago" },
      { icon: <MessageSquare className="size-3" />, text: "Awaiting JD completion", time: "1d ago" },
    ];
  }
  return [
    { icon: <Users className="size-3" />, text: `${job.pipeline.applied} new applications received`, time: "2d ago" },
    { icon: <User className="size-3" />, text: `${job.pipeline.screened} candidates moved to screening`, time: "1d ago" },
    { icon: <MessageSquare className="size-3" />, text: "Interview feedback submitted by " + job.hiringManager.name, time: "4h ago" },
  ];
}

/* ── Single List Row ── */

function JobListRow({
  job,
  index,
  onSelectJob,
}: {
  job: Job;
  index: number;
  onSelectJob: (j: Job) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const status = STATUS_CONFIG[job.status];
  const priority = PRIORITY_CONFIG[job.priority];
  const dept = DEPT_COLORS[job.department] ?? {
    colorClass: "bg-muted-foreground",
    textClass: "text-muted-foreground",
  };
  const isDraft = job.status === "draft";
  const isPaused = job.status === "paused";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className={`bg-card border rounded-xl overflow-hidden transition-all ${
        isDraft ? "border-dashed border-border" : "border-border"
      } ${isPaused ? "border-l-[3px] border-l-warning" : ""}`}
    >
      {/* Collapsed header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 hover:bg-muted/30 transition-colors"
      >
        {/* Line 1: Status dot + Title + REQ ID + Health */}
        <div className="flex items-center gap-3">
          <span className={`size-2 rounded-full shrink-0 ${status.dotClass}`} />
          <span className="font-semibold text-foreground truncate flex-1">
            {job.title}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
            {job.reqId}
          </span>
          {!isDraft && (
            <span
              className={`text-xs font-medium tabular-nums shrink-0 ${healthColor(job.healthScore)}`}
            >
              {job.healthScore}
            </span>
          )}
          <ChevronDown
            className={`size-4 text-muted-foreground shrink-0 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Line 2: meta chips */}
        <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span className="inline-flex items-center gap-1">
            <span className={`size-2 rounded-full ${dept.colorClass}`} />
            {job.department}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1">
            {WORK_MODEL_ICON[job.workModel]}
            {job.workModel}
          </span>
          {(job.priority === "urgent" || job.priority === "high") && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${priority.bgClass} ${priority.textClass}`}
            >
              {priority.label}
            </span>
          )}
          <span className="text-xs">
            {job.hiringManager.name}{" "}
            <span className="opacity-60">(HM)</span>
          </span>
          <span className="text-xs">
            {job.recruiter.name}{" "}
            <span className="opacity-60">(Rec)</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3" />
            {job.totalCandidates}
          </span>
          {isDraft ? (
            <span>Not posted</span>
          ) : (
            <span className={daysOpenColor(job.daysOpen)}>
              {job.daysOpen}d open
            </span>
          )}
        </div>

        {/* Line 3: AI summary */}
        <div className="mt-1.5 flex items-center gap-1">
          <Sparkles className="size-3 text-brand-purple shrink-0" />
          <span className="text-[11px] text-muted-foreground italic truncate">
            {job.aiSummary}
          </span>
        </div>
      </button>

      {/* Expanded section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border space-y-4">
              {/* Pipeline snapshot */}
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2">
                  Pipeline Snapshot
                </h4>
                <div className="flex items-center gap-3 flex-wrap">
                  {PIPELINE_STAGES.map((stage) => {
                    const count =
                      job.pipeline[stage.key as keyof typeof job.pipeline];
                    return (
                      <div
                        key={stage.key}
                        className="flex items-center gap-1.5"
                      >
                        <span
                          className={`size-2 rounded-full ${stage.colorClass}`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {stage.label}
                        </span>
                        <span className="text-xs font-semibold tabular-nums text-foreground">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent activity */}
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2">
                  Recent Activity
                </h4>
                <div className="space-y-2">
                  {recentActivity(job).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      {item.icon}
                      <span className="flex-1">{item.text}</span>
                      <span className="text-[10px]">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-1">
                  AI Summary
                </h4>
                <div className="flex items-start gap-1.5">
                  <Sparkles className="size-3 text-brand-purple shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {job.aiSummary}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onSelectJob(job);
                  }}
                >
                  View Full Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onSelectJob(job);
                  }}
                >
                  Jump to Pipeline
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── List View ── */

export function JobsListView({
  jobs,
  onSelectJob,
}: {
  jobs: Job[];
  onSelectJob: (j: Job) => void;
}) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center">
        <Briefcase className="size-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">No jobs found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your filters or create a new job requisition.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-6 overflow-y-auto h-full">
      {jobs.map((job, i) => (
        <JobListRow
          key={job.id}
          job={job}
          index={i}
          onSelectJob={onSelectJob}
        />
      ))}
    </div>
  );
}
