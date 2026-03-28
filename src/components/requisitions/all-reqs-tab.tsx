"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Sparkles,
  Users,
  Calendar,
  MapPin,
  LayoutGrid,
  Table2,
} from "lucide-react";
import {
  type Requisition,
  REQUISITIONS,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  TYPE_CONFIG,
  SLOT_STATUS_CONFIG,
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

function ApprovalDots({ chain, progress }: { chain: Requisition["approvalChain"]; progress: string }) {
  return (
    <div className="flex items-center gap-1">
      {chain.map((step, i) => (
        <div
          key={i}
          className={`size-4 rounded-full flex items-center justify-center ${
            step.status === "approved"
              ? "bg-success"
              : step.status === "pending"
              ? "bg-warning"
              : "bg-secondary"
          }`}
          title={`${step.name} (${step.role}) - ${step.status}`}
        >
          {step.status === "approved" && <Check className="size-2.5 text-white" />}
          {step.status === "pending" && <Clock className="size-2 text-white" />}
        </div>
      ))}
      <span className="ml-1 text-[10px] text-muted-foreground font-mono">{progress}</span>
    </div>
  );
}

function daysRemaining(targetFillDate: string, daysOpen: number | null): number | null {
  if (daysOpen === null) return null;
  // Simple estimate: assume ~90 day total window minus daysOpen
  const match = targetFillDate.match(/(\w+)\s+(\d+)/);
  if (!match) return null;
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const target = new Date(2026, months[match[1]] ?? 0, parseInt(match[2]));
  const now = new Date(2026, 2, 26); // Mar 26 2026
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function AllReqsTab() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  return (
    <div className="space-y-4">
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
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Dept</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Slots</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Priority</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Candidates</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Health</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {REQUISITIONS.map((req, i) => {
                const status = STATUS_CONFIG[req.status];
                const priority = PRIORITY_CONFIG[req.priority];
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
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full ${STATUS_CONFIG[req.status].dotClass}`} />
                        {req.department}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{req.filledPositions}/{req.totalPositions}</td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full ${status.dotClass}`} />
                        <span className={status.textClass}>{status.label}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full ${priority.dotClass}`} />
                        <span className={priority.textClass}>{priority.label}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{req.totalCandidatesMapped}m / {req.totalInterviewing}i / {req.totalOffers}o</td>
                    <td className="px-3 py-3">
                      {req.healthScore !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                            <div className={`h-full rounded-full ${healthBarColor(req.healthScore)} transition-all`} style={{ width: `${req.healthScore}%` }} />
                          </div>
                          <span className="text-[10px] font-medium text-foreground">{req.healthScore}%</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <button type="button" className="font-medium text-brand-purple hover:underline">View</button>
                        <button type="button" className="font-medium text-brand hover:underline">Map</button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "cards" && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {REQUISITIONS.map((req, i) => {
        const status = STATUS_CONFIG[req.status];
        const priority = PRIORITY_CONFIG[req.priority];
        const typeInfo = TYPE_CONFIG[req.type];
        const remaining = daysRemaining(req.targetFillDate, req.daysOpen);

        return (
          <motion.div
            key={req.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all"
          >
            {/* Top: ID + status + priority */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">{req.id}</span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium">
                  <span className={`size-1.5 rounded-full ${status.dotClass}`} />
                  <span className={status.textClass}>{status.label}</span>
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-medium">
                <span className={`size-1.5 rounded-full ${priority.dotClass}`} />
                <span className={priority.textClass}>{priority.label}</span>
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-foreground mb-1">{req.title}</h3>

            {/* Dept / level / type meta */}
            <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-muted-foreground">
              <span>{req.department}</span>
              <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">{req.level}</span>
              <span className={`text-[11px] ${typeInfo.colorClass}`}>{typeInfo.label}</span>
              <span className="flex items-center gap-0.5">
                <Users className="size-3" />
                HM: {req.hiringManager}
              </span>
            </div>

            {/* Position Slots */}
            {req.slots.length > 0 && (
              <div className="mb-3 space-y-2">
                {req.slots.map((slot) => {
                  const slotCfg = SLOT_STATUS_CONFIG[slot.status];
                  return (
                    <div key={slot.id} className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">Slot {slot.slotNumber}:</span>
                        <span className="flex items-center gap-1">
                          <span className={`size-1.5 rounded-full ${slotCfg.dotClass}`} />
                          {slotCfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="size-2.5" />
                          {slot.location} ({slot.workMode})
                        </span>
                        <span>{slot.candidatesMapped} mapped</span>
                        <span>{slot.interviewing} interviewing</span>
                        <span>Recruiter: {slot.recruiter}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-muted-foreground">
              <span>{req.totalCandidatesMapped} mapped / {req.totalInterviewing} interviewing / {req.totalOffers} offers</span>
              <span className="font-mono">{req.salaryRange}</span>
              {remaining !== null && (
                <span className="flex items-center gap-0.5">
                  <Calendar className="size-3" />
                  {req.targetFillDate} ({remaining}d left)
                </span>
              )}
            </div>

            {/* Health bar */}
            {req.healthScore !== null && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-muted-foreground">Health</span>
                  <span className="text-[10px] font-medium text-foreground">{req.healthScore}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${healthBarColor(req.healthScore)} transition-all`}
                    style={{ width: `${req.healthScore}%` }}
                  />
                </div>
              </div>
            )}

            {/* AI Insight */}
            {req.aiInsight && (
              <div className="mb-3 flex items-start gap-2 border-l-[2px] border-brand-purple pl-2">
                <Sparkles className="size-3 text-brand-purple shrink-0 mt-0.5" />
                <span className="text-xs text-brand-purple">{req.aiInsight}</span>
              </div>
            )}

            {/* Approval progress dots */}
            {req.approvalChain.length > 0 && (
              <div className="mb-3">
                <ApprovalDots chain={req.approvalChain} progress={req.approvalProgress} />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2 border-t border-border">
              <button type="button" className="text-xs font-medium text-brand-purple hover:underline">View Details</button>
              <button type="button" className="text-xs font-medium text-brand hover:underline">Map Candidates</button>
              <button type="button" className="text-xs font-medium text-muted-foreground hover:text-foreground">View Pipeline</button>
            </div>
          </motion.div>
        );
      })}
    </div>
      )}
    </div>
  );
}
