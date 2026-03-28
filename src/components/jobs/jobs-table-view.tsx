"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  type Job,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  DEPT_COLORS,
  healthColor,
  healthBarColor,
  healthLabel,
  daysOpenColor,
} from "@/components/jobs/data";

/* ── Table View ── */

export function JobsTableView({
  jobs,
  onSelectJob,
}: {
  jobs: Job[];
  onSelectJob: (j: Job) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected = jobs.length > 0 && selectedIds.size === jobs.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(jobs.map((j) => j.id)));
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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
    <div className="relative h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="w-10 px-3 py-2.5">
                <Checkbox
                  checked={allSelected || someSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th className="px-3 py-2.5 font-medium">REQ ID</th>
              <th className="px-3 py-2.5 font-medium">Job Title</th>
              <th className="px-3 py-2.5 font-medium">Department</th>
              <th className="px-3 py-2.5 font-medium">Location</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 font-medium">Pri</th>
              <th className="px-3 py-2.5 font-medium text-right">Cand.</th>
              <th className="px-3 py-2.5 font-medium text-right">Days</th>
              <th className="px-3 py-2.5 font-medium">Health</th>
              <th className="w-10 px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, i) => {
              const status = STATUS_CONFIG[job.status];
              const priority = PRIORITY_CONFIG[job.priority];
              const dept = DEPT_COLORS[job.department] ?? {
                colorClass: "bg-muted-foreground",
                textClass: "text-muted-foreground",
              };
              const isDraft = job.status === "draft";
              const isPaused = job.status === "paused";
              const isClosed = job.status === "closed";
              const isCritical =
                job.healthScore !== null && job.healthScore < 40;

              return (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  onClick={() => onSelectJob(job)}
                  className={`border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                    isDraft ? "opacity-70" : ""
                  } ${isPaused ? "border-l-[3px] border-l-warning" : ""} ${
                    isCritical && !isDraft
                      ? "border-l-[3px] border-l-destructive"
                      : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-3 py-2.5">
                    <Checkbox
                      checked={selectedIds.has(job.id)}
                      onCheckedChange={() => toggleOne(job.id)}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      aria-label={`Select ${job.title}`}
                    />
                  </td>

                  {/* REQ ID */}
                  <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground">
                    {job.reqId}
                  </td>

                  {/* Title */}
                  <td className="px-3 py-2.5 font-medium text-foreground max-w-60">
                    <span className={isClosed ? "line-through" : ""}>
                      {job.title}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span
                        className={`size-2 rounded-full ${dept.colorClass}`}
                      />
                      {job.department}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">
                    {job.location}
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span
                        className={`size-1.5 rounded-full ${status.dotClass}`}
                      />
                      <span className={status.textClass}>{status.abbr}</span>
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-3 py-2.5">
                    <span
                      className={`size-2 rounded-full inline-block ${priority.dotClass}`}
                      title={priority.label}
                    />
                  </td>

                  {/* Candidates */}
                  <td className="px-3 py-2.5 text-xs tabular-nums text-right">
                    {job.totalCandidates}
                  </td>

                  {/* Days Open */}
                  <td className="px-3 py-2.5 text-xs tabular-nums text-right">
                    {isDraft ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className={daysOpenColor(job.daysOpen)}>
                        {job.daysOpen}
                      </span>
                    )}
                  </td>

                  {/* Health */}
                  <td className="px-3 py-2.5">
                    {isDraft ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs ${healthColor(job.healthScore)}`}
                      >
                        <span className="tabular-nums font-medium">
                          {job.healthScore}
                        </span>
                        <span
                          className={`size-1.5 rounded-full ${healthBarColor(job.healthScore)} ${
                            isCritical ? "animate-pulse" : ""
                          }`}
                        />
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2.5">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="sticky bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-2.5 flex items-center gap-3"
          >
            <span className="text-xs font-medium text-foreground">
              {selectedIds.size} selected
            </span>
            <div className="h-4 w-px bg-border" />
            {["Pause", "Close", "Change Priority", "Export", "Archive"].map(
              (action) => (
                <Button key={action} variant="ghost" size="xs">
                  {action}
                </Button>
              )
            )}
            <Button
              variant="ghost"
              size="xs"
              className="ml-auto text-muted-foreground"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
