"use client";

import { Check, Clock, X, MinusCircle, Send, Bell } from "lucide-react";
import { type ApproverStep, type ApproverStepStatus } from "@/components/leave/data";

const STEP_META: Record<ApproverStepStatus, { icon: React.ComponentType<{ className?: string }>; bg: string; ring: string; color: string; label: string }> = {
  pending:  { icon: Clock,       bg: "bg-secondary",       ring: "ring-border",          color: "text-muted-foreground", label: "Pending" },
  approved: { icon: Check,       bg: "bg-success/15",      ring: "ring-success/30",      color: "text-success",          label: "Approved" },
  rejected: { icon: X,           bg: "bg-destructive/15",  ring: "ring-destructive/30",  color: "text-destructive",      label: "Rejected" },
  skipped:  { icon: MinusCircle, bg: "bg-secondary",       ring: "ring-border",          color: "text-muted-foreground", label: "Skipped" },
  notified: { icon: Bell,        bg: "bg-brand/15",        ring: "ring-brand/30",        color: "text-brand",            label: "Notified" },
};

interface Props {
  submittedOn: string;
  submittedLabel: string;
  chain: ApproverStep[];
}

export function ApprovalTimeline({ submittedOn, submittedLabel, chain }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-1">Approval timeline</h3>
      <p className="text-[11px] text-muted-foreground mb-5">
        Each step below shows status and the actor responsible.
      </p>

      {/* Horizontal nodes + connectors */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${chain.length + 1}, minmax(0, 1fr))` }}>
        {/* Submitted node */}
        <TimelineNode
          status="approved"
          name="Priya Singh"
          subtitle="Submitted"
          initials="PS"
          avatarColor="bg-brand"
          whenLabel={submittedLabel}
          showConnector
          isFirst
        />
        {chain.map((step, i) => (
          <TimelineNode
            key={step.id}
            status={step.status}
            name={step.name}
            initials={step.initials}
            avatarColor={step.avatarColor}
            subtitle={step.role}
            whenLabel={step.whenLabel}
            note={step.note}
            showConnector={i < chain.length - 1}
          />
        ))}
      </div>

      <p className="sr-only">Submitted on {submittedOn}.</p>
    </div>
  );
}

function TimelineNode({
  status,
  name,
  initials,
  avatarColor,
  subtitle,
  whenLabel,
  note,
  showConnector,
  isFirst,
}: {
  status: ApproverStepStatus;
  name: string;
  initials: string;
  avatarColor: string;
  subtitle: string;
  whenLabel?: string;
  note?: string;
  showConnector: boolean;
  isFirst?: boolean;
}) {
  const m = STEP_META[status];
  const Icon = isFirst ? Send : m.icon;
  return (
    <div className="relative flex flex-col items-center text-center">
      {showConnector && (
        <span
          aria-hidden
          className={`absolute top-5 left-1/2 w-full h-px ${
            status === "pending" || status === "skipped" ? "bg-border" : "bg-border"
          }`}
        />
      )}
      {/* Status badge */}
      <div className={`relative size-10 rounded-full ring-2 ${m.ring} ${m.bg} flex items-center justify-center z-10`}>
        <Icon className={`size-4 ${m.color}`} />
      </div>
      {/* Avatar pill */}
      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-overlay/60">
        <span className={`size-4 rounded-full ${avatarColor} text-white text-[8px] font-bold flex items-center justify-center`}>
          {initials}
        </span>
        <span className="text-[11px] text-foreground truncate max-w-32">{name}</span>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-1">{subtitle}</p>
      {whenLabel && <p className="text-[10px] text-muted-foreground mt-0.5">{whenLabel}</p>}
      {note && <p className="text-[11px] text-muted-foreground mt-2 leading-snug line-clamp-3 px-1">&ldquo;{note}&rdquo;</p>}
      {!whenLabel && status === "pending" && (
        <p className="text-[10px] text-muted-foreground/60 mt-0.5 italic">Waiting…</p>
      )}
    </div>
  );
}
