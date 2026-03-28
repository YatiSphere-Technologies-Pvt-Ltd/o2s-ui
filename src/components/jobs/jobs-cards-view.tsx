"use client";

import { motion } from "framer-motion";
import {
  Building,
  Globe,
  Home,
  MapPin,
  MoreHorizontal,
  Sparkles,
  Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  type Job,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  DEPT_COLORS,
  PIPELINE_STAGES,
  healthColor,
  healthBarColor,
  healthLabel,
  daysOpenColor,
} from "@/components/jobs/data";

/* ── Work-model icon map ── */

const WORK_MODEL_ICON: Record<Job["workModel"], React.ReactNode> = {
  Hybrid: <Home className="size-3" />,
  Remote: <Globe className="size-3" />,
  "On-site": <Building className="size-3" />,
};

/* ── Pipeline mini-funnel ── */

function PipelineFunnel({ pipeline }: { pipeline: Job["pipeline"] }) {
  const values = PIPELINE_STAGES.map(
    (s) => pipeline[s.key as keyof typeof pipeline]
  );
  const maxCount = Math.max(...values, 1);

  return (
    <div className="mt-3 space-y-0.5">
      {PIPELINE_STAGES.map((stage, i) => {
        const count = values[i];
        const pct = (count / maxCount) * 100;
        return (
          <div key={stage.key} className="flex items-center gap-2">
            <motion.div
              className={`h-1 rounded-full ${stage.colorClass}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              style={{ minWidth: count > 0 ? 4 : 0, maxWidth: "100%" }}
            />
            <span className="text-[10px] tabular-nums text-muted-foreground w-5 text-right shrink-0">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Single Card ── */

function JobCard({
  job,
  index,
  onSelectJob,
}: {
  job: Job;
  index: number;
  onSelectJob: (j: Job) => void;
}) {
  const status = STATUS_CONFIG[job.status];
  const priority = PRIORITY_CONFIG[job.priority];
  const dept = DEPT_COLORS[job.department] ?? {
    colorClass: "bg-muted-foreground",
    textClass: "text-muted-foreground",
  };
  const isDraft = job.status === "draft";
  const isPaused = job.status === "paused";
  const isCritical = job.healthScore !== null && job.healthScore < 40;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onClick={() => onSelectJob(job)}
      className={`bg-card border rounded-xl p-5 cursor-pointer group hover:-translate-y-0.5 transition-all ${
        isDraft ? "border-dashed border-border" : "border-border"
      } ${isPaused ? "opacity-80 border-l-[3px] border-l-warning" : ""}`}
    >
      {/* Top row: status + priority + req id */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
          <span className={`size-1.5 rounded-full ${status.dotClass}`} />
          <span className={status.textClass}>{status.label}</span>
        </span>

        {(job.priority === "urgent" || job.priority === "high") && (
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${priority.bgClass} ${priority.textClass}`}
          >
            {priority.label}
          </span>
        )}

        <span className="ml-auto text-[10px] font-mono text-muted-foreground">
          {job.reqId}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-2 text-base font-bold text-foreground line-clamp-2">
        {job.title}
      </h3>

      {/* Meta row */}
      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
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
      </div>

      {/* Pipeline mini-funnel */}
      <PipelineFunnel pipeline={job.pipeline} />

      {/* Team row */}
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span>
          {job.hiringManager.name} <span className="opacity-60">(HM)</span>
        </span>
        <span>
          {job.recruiter.name} <span className="opacity-60">(Rec)</span>
        </span>
      </div>

      {/* Timing row */}
      <div className="mt-2 flex items-center gap-3 text-[10px]">
        {isDraft ? (
          <span className="text-muted-foreground">Not posted</span>
        ) : (
          <>
            <span className={daysOpenColor(job.daysOpen)}>
              {job.daysOpen}d open
            </span>
            <span className="inline-flex items-center gap-0.5 text-muted-foreground">
              <Sparkles className="size-2.5" />
              Est. {job.estimatedTimeToFill}d
            </span>
          </>
        )}
      </div>

      {/* Health bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <div className="h-1.5 rounded-full bg-secondary flex-1 mr-2 overflow-hidden">
            {isDraft ? null : (
              <motion.div
                className={`h-full rounded-full ${healthBarColor(job.healthScore)} ${
                  isCritical ? "animate-pulse" : ""
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${job.healthScore ?? 0}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            )}
          </div>
          <span className={`text-xs font-medium ${healthColor(job.healthScore)}`}>
            {isDraft
              ? "—"
              : `${job.healthScore} ${healthLabel(job.healthScore)}`}
          </span>
        </div>
      </div>

      {/* AI one-liner */}
      <div className="mt-2 flex items-start gap-1">
        <Sparkles className="size-3 text-brand-purple shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground italic line-clamp-1">
          {job.aiSummary}
        </p>
      </div>

      {/* Action row */}
      <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          className="text-xs text-brand hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onSelectJob(job);
          }}
        >
          View Pipeline
        </button>
        <button
          type="button"
          className="text-xs text-muted-foreground hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Edit
        </button>
        <Button
          variant="ghost"
          size="icon-xs"
          className="ml-auto"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

/* ── Cards View ── */

export function JobsCardsView({
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6 overflow-y-auto h-full">
      {jobs.map((job, i) => (
        <JobCard
          key={job.id}
          job={job}
          index={i}
          onSelectJob={onSelectJob}
        />
      ))}
    </div>
  );
}
