"use client";

import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Sparkles,
  Users,
  Inbox,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type Requisition,
  REQUISITIONS,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  TYPE_CONFIG,
  SLOT_STATUS_CONFIG,
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

export function PendingTab() {
  const pending = REQUISITIONS.filter((r) => r.status === "pending_approval");

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-success/10">
          <Inbox className="size-8 text-success" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">You&apos;re all caught up!</h3>
        <p className="text-sm text-muted-foreground">No requisitions awaiting approval.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {pending.map((req, i) => {
        const status = STATUS_CONFIG[req.status];
        const priority = PRIORITY_CONFIG[req.priority];
        const typeInfo = TYPE_CONFIG[req.type];

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

            {/* Dept / level / type */}
            <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-muted-foreground">
              <span>{req.department}</span>
              <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">{req.level}</span>
              <span className={`text-[11px] ${typeInfo.colorClass}`}>{typeInfo.label}</span>
              <span className="flex items-center gap-0.5">
                <Users className="size-3" />
                HM: {req.hiringManager}
              </span>
            </div>

            {/* Slots */}
            <div className="mb-3 space-y-1.5">
              {req.slots.map((slot) => {
                const slotCfg = SLOT_STATUS_CONFIG[slot.status];
                return (
                  <div key={slot.id} className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-1.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-2.5" />
                        Slot {slot.slotNumber}: {slot.location} ({slot.workMode})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={`size-1.5 rounded-full ${slotCfg.dotClass}`} />
                        {slotCfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-muted-foreground">
              <span>{req.totalPositions} position{req.totalPositions > 1 ? "s" : ""}</span>
              <span className="font-mono">{req.salaryRange}</span>
              <span>Target: {req.targetFillDate}</span>
            </div>

            {/* AI Insight */}
            {req.aiInsight && (
              <div className="mb-3 flex items-start gap-2 border-l-[2px] border-brand-purple pl-2">
                <Sparkles className="size-3 text-brand-purple shrink-0 mt-0.5" />
                <span className="text-xs text-brand-purple">{req.aiInsight}</span>
              </div>
            )}

            {/* Approval dots */}
            {req.approvalChain.length > 0 && (
              <div className="mb-3">
                <ApprovalDots chain={req.approvalChain} progress={req.approvalProgress} />
              </div>
            )}

            {/* Approve / Reject actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <Button className="bg-success text-white hover:bg-success/90" size="sm">
                Approve
              </Button>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                Reject
              </Button>
              <button type="button" className="ml-auto text-xs font-medium text-brand-purple hover:underline">View Details</button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
