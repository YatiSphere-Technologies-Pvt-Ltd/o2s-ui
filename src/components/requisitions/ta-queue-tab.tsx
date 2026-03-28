"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  AlertTriangle,
  Calendar,
  LayoutGrid,
  Table2,
} from "lucide-react";
import {
  REQUISITIONS,
  SLOT_STATUS_CONFIG,
  urgencyBadge,
  healthBarColor,
} from "@/components/requisitions/data";

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

const TA_STATUSES = ["sourcing", "interviewing", "offer_stage", "partially_filled"] as const;

export function TAQueueTab() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const taReqs = REQUISITIONS.filter((r) =>
    (TA_STATUSES as readonly string[]).includes(r.status)
  );

  const activeReqs = taReqs.length;
  const openPositions = taReqs.reduce((s, r) => s + (r.totalPositions - r.filledPositions), 0);
  const totalPipeline = taReqs.reduce((s, r) => s + r.totalCandidatesMapped, 0);
  const needsAction = taReqs.filter((r) => r.aiUrgencyScore > 80).length;
  const atRisk = taReqs.filter((r) => r.aiUrgencyScore > 60 && r.aiUrgencyScore <= 80).length;
  const onTrack = taReqs.filter((r) => r.aiUrgencyScore <= 60).length;

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
          <p className="text-lg font-bold text-foreground">{activeReqs}</p>
          <p className="text-xs text-muted-foreground">Active Reqs</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{openPositions}</p>
          <p className="text-xs text-muted-foreground">Open Positions</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{totalPipeline}</p>
          <p className="text-xs text-muted-foreground">In Pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs">
            <span className="size-2 rounded-full bg-destructive" />
            {needsAction} needs action
          </span>
          <span className="flex items-center gap-1 text-xs">
            <span className="size-2 rounded-full bg-warning" />
            {atRisk} at risk
          </span>
          <span className="flex items-center gap-1 text-xs">
            <span className="size-2 rounded-full bg-success" />
            {onTrack} on track
          </span>
        </div>
      </motion.div>

      {/* View toggle */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
          <button onClick={() => setViewMode("cards")} className={`p-1.5 rounded-md transition-colors ${viewMode === "cards" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <LayoutGrid className="size-4" />
          </button>
          <button onClick={() => setViewMode("table")} className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <Table2 className="size-4" />
          </button>
        </div>
      </div>

      {viewMode === "table" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">REQ ID</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">HM</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Days in Queue</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Slots</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Candidates</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">SLA Progress</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Urgency</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taReqs.map((req, i) => {
                const badge = urgencyBadge(req.aiUrgencyScore);
                const daysInQueue = req.daysOpen ?? 0;
                const slaTarget = 90;
                const slaPct = Math.min(100, Math.round((daysInQueue / slaTarget) * 100));
                const slaColor = slaPct > 80 ? "bg-destructive" : slaPct > 50 ? "bg-warning" : "bg-success";
                const openSlots = req.totalPositions - req.filledPositions;
                return (
                  <motion.tr
                    key={req.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-3 py-3 font-mono text-[10px] text-muted-foreground">{req.id}</td>
                    <td className="px-3 py-3 font-medium text-foreground">{req.title}</td>
                    <td className="px-3 py-3 text-muted-foreground">{req.hiringManager}</td>
                    <td className="px-3 py-3 font-medium text-foreground">{daysInQueue}d</td>
                    <td className="px-3 py-3 text-muted-foreground">{openSlots}/{req.totalPositions}</td>
                    <td className="px-3 py-3 text-muted-foreground">{req.totalCandidatesMapped}m / {req.totalInterviewing}i</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full rounded-full ${slaColor} transition-all`} style={{ width: `${slaPct}%` }} />
                        </div>
                        <span className="text-[10px] font-medium text-foreground">{slaPct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.colorClass} ${badge.bgClass}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <button type="button" className="font-medium text-brand hover:underline">Map</button>
                        <button type="button" className="font-medium text-brand-purple hover:underline">Pipeline</button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TA Queue cards */}
      {viewMode === "cards" && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {taReqs.map((req, i) => {
          const badge = urgencyBadge(req.aiUrgencyScore);
          const daysInQueue = req.daysOpen ?? 0;
          const slaTarget = 90;
          const slaPct = Math.min(100, Math.round((daysInQueue / slaTarget) * 100));
          const slaColor = slaPct > 80 ? "bg-destructive" : slaPct > 50 ? "bg-warning" : "bg-success";

          return (
            <motion.div
              key={req.id}
              custom={i + 1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all"
            >
              {/* Urgency badge */}
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.colorClass} ${badge.bgClass}`}>
                  {badge.label}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{req.id}</span>
              </div>

              {/* Title + dept + HM + approved date + queue days */}
              <h3 className="text-sm font-semibold text-foreground mb-1">{req.title}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-3 text-xs text-muted-foreground">
                <span>{req.department}</span>
                <span className="flex items-center gap-0.5">
                  <Users className="size-3" />
                  HM: {req.hiringManager}
                </span>
                <span className="flex items-center gap-0.5">
                  <Calendar className="size-3" />
                  Approved: {req.createdDate}
                </span>
                <span className="font-medium text-foreground">In Queue: {daysInQueue}d</span>
              </div>

              {/* Per-slot progress */}
              <div className="mb-3 space-y-2">
                {req.slots.map((slot) => {
                  const slotCfg = SLOT_STATUS_CONFIG[slot.status];
                  const target = 8;
                  const coverage = slot.candidatesMapped;
                  const slotProgressPct = Math.min(100, Math.round((coverage / Math.max(target, 1)) * 100));
                  const lowCoverage = coverage < target && slot.status !== "filled" && slot.status !== "offer_accepted";

                  return (
                    <div key={slot.id} className="bg-secondary/40 rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">
                          Slot {slot.slotNumber}: {slot.location}
                        </span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <span className={`size-1.5 rounded-full ${slotCfg.dotClass}`} />
                          {slotCfg.label}
                        </span>
                      </div>
                      {/* Mini progress bar */}
                      <div className="h-1 rounded-full bg-secondary overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full ${healthBarColor(req.healthScore)} transition-all`}
                          style={{ width: `${slotProgressPct}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-muted-foreground">
                        <span>{slot.candidatesMapped} mapped</span>
                        <span>→</span>
                        <span>{slot.interviewing} interviewing</span>
                        <span>→</span>
                        <span>{slot.offers} offers</span>
                        <span className="ml-auto text-brand-purple">Recruiter: {slot.recruiter}</span>
                      </div>
                      {lowCoverage && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-warning font-medium">
                          <AlertTriangle className="size-3" />
                          Low coverage: {coverage}/{target} target
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* AI insight strip */}
              {req.aiInsight && (
                <div className="mb-3 bg-brand-purple/5 border-l-[3px] border-brand-purple p-3 rounded-r-lg">
                  <div className="flex items-start gap-2">
                    <Sparkles className="size-3 text-brand-purple shrink-0 mt-0.5" />
                    <span className="text-xs text-brand-purple">{req.aiInsight}</span>
                  </div>
                </div>
              )}

              {/* SLA bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-muted-foreground">SLA ({daysInQueue}d / {slaTarget}d)</span>
                  <span className="text-[10px] font-medium text-foreground">{slaPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${slaColor} transition-all`}
                    style={{ width: `${slaPct}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <button type="button" className="text-xs font-medium text-brand hover:underline">Map Candidates</button>
                <button type="button" className="text-xs font-medium text-brand-purple hover:underline">View Pipeline</button>
                <button type="button" className="text-xs font-medium text-muted-foreground hover:text-foreground">View Interviews</button>
              </div>
            </motion.div>
          );
        })}
      </div>
      )}
    </div>
  );
}
