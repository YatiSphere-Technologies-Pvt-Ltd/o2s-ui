"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Calendar,
  CalendarRange,
  Check,
  ChevronDown,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Send,
  Share2,
  Siren,
  Sparkles,
  X,
} from "lucide-react";
import type {
  WellbeingKind,
  WellbeingSeverity,
  WellbeingSignal,
} from "@/components/leave/data";
import type { SignalActionState } from "@/lib/leave-store";
import { SignalAuditTrail } from "@/components/leave/signal-audit-trail";

const KIND_META: Record<
  WellbeingKind,
  { icon: React.ComponentType<{ className?: string }>; label: string; tint: string; color: string }
> = {
  no_leave_taken:     { icon: CalendarRange, label: "Low PTO usage",    tint: "bg-warning/10",     color: "text-warning" },
  sick_cluster:       { icon: Heart,         label: "Sick clusters",    tint: "bg-destructive/10", color: "text-destructive" },
  high_workload:      { icon: Activity,      label: "High workload",    tint: "bg-warning/10",     color: "text-warning" },
  back_to_back:       { icon: Activity,      label: "Back-to-back",     tint: "bg-brand/10",       color: "text-brand" },
  weekend_bracketing: { icon: Calendar,      label: "Weekend bracketing", tint: "bg-brand-purple/10", color: "text-brand-purple" },
};

const SEVERITY_META: Record<
  WellbeingSeverity,
  { label: string; ringClass: string; chipBg: string; chipText: string }
> = {
  high:   { label: "High",   ringClass: "ring-1 ring-destructive/30", chipBg: "bg-destructive/15", chipText: "text-destructive" },
  medium: { label: "Medium", ringClass: "ring-1 ring-warning/30",     chipBg: "bg-warning/15",     chipText: "text-warning" },
  low:    { label: "Low",    ringClass: "ring-1 ring-border",          chipBg: "bg-secondary",      chipText: "text-muted-foreground" },
};

interface Props {
  signal: WellbeingSignal;
  state: SignalActionState;
  onSuggestLeave: () => void;
  onScheduleOneOnOne: () => void;
  onShareResources: () => void;
  onMarkAddressed: () => void;
  onDismissClick: () => void;
  onEscalateClick: () => void;
}

export function SignalCard({
  signal,
  state,
  onSuggestLeave,
  onScheduleOneOnOne,
  onShareResources,
  onMarkAddressed,
  onDismissClick,
  onEscalateClick,
}: Props) {
  const k = KIND_META[signal.kind];
  const s = SEVERITY_META[signal.severity];
  const KIcon = k.icon;
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  const closed = state.status !== "active";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-card border border-border rounded-xl flex flex-col ${s.ringClass} ${closed ? "opacity-75" : ""}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Link
            href={`/leave/manager/report/${signal.employeeId}`}
            className={`size-10 shrink-0 rounded-full ${signal.employeeAvatar} text-white text-[12px] font-bold flex items-center justify-center hover:ring-2 hover:ring-brand transition-all`}
            title="Open direct report detail"
          >
            {signal.employeeInitials}
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{signal.employeeName}</p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${k.tint} ${k.color}`}>
                <KIcon className="size-2.5" />
                {k.label}
              </span>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${s.chipBg} ${s.chipText}`}>
                {s.label}
              </span>
              {closed && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider bg-secondary text-muted-foreground">
                  {state.status}
                </span>
              )}
            </div>
          </div>

          {/* Overflow menu */}
          <div className="relative">
            <button
              onClick={() => setOverflowOpen((p) => !p)}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
              aria-label="More"
            >
              <MoreHorizontal className="size-4" />
            </button>
            <AnimatePresence>
              {overflowOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-7 z-10 w-44 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                  onMouseLeave={() => setOverflowOpen(false)}
                >
                  <button
                    onClick={() => {
                      setOverflowOpen(false);
                      onMarkAddressed();
                    }}
                    disabled={closed}
                    className="w-full text-left px-3 py-2 text-[11px] text-foreground hover:bg-surface-overlay flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Check className="size-3 text-success" />
                    Mark addressed
                  </button>
                  <button
                    onClick={() => {
                      setOverflowOpen(false);
                      onDismissClick();
                    }}
                    disabled={closed}
                    className="w-full text-left px-3 py-2 text-[11px] text-foreground hover:bg-surface-overlay flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <X className="size-3 text-muted-foreground" />
                    Dismiss…
                  </button>
                  <button
                    onClick={() => {
                      setOverflowOpen(false);
                      onEscalateClick();
                    }}
                    disabled={closed}
                    className="w-full text-left px-3 py-2 text-[11px] text-foreground hover:bg-surface-overlay flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed border-t border-border"
                  >
                    <Siren className="size-3 text-warning" />
                    Escalate to HR…
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 space-y-3">
        <p className="text-sm font-medium text-foreground leading-snug">{signal.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{signal.body}</p>

        {/* Citations */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold flex items-center gap-1">
            <Sparkles className="size-2.5" />
            Wellbeing Agent reasoning
          </p>
          <ul className="space-y-1">
            {signal.citations.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px]">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium ${k.tint} ${k.color} shrink-0 mt-px`}>
                  {c.label}
                </span>
                <span className="text-muted-foreground leading-snug">{c.rationale}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Audit toggle */}
        {state.audit.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setAuditOpen((p) => !p)}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown className={`size-3 transition-transform ${auditOpen ? "rotate-0" : "-rotate-90"}`} />
              {state.audit.length} action{state.audit.length !== 1 ? "s" : ""} on this signal
            </button>
            <AnimatePresence>
              {auditOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-3 rounded-lg bg-surface-overlay/40 border border-border">
                    <SignalAuditTrail entries={state.audit} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Suggested actions */}
      {!closed && (
        <div className="border-t border-border p-3 flex items-center gap-2 flex-wrap">
          <ActionButton onClick={onSuggestLeave} icon={Send} label="Suggest leave" />
          <ActionButton onClick={onScheduleOneOnOne} icon={MessageSquare} label="Schedule 1:1" />
          <ActionButton onClick={onShareResources} icon={Share2} label="Share resources" />
          <Link
            href={`/leave/manager/report/${signal.employeeId}`}
            className="ml-auto inline-flex items-center gap-1 text-[11px] text-brand hover:underline"
          >
            Open detail <ArrowRight className="size-3" />
          </Link>
        </div>
      )}

      {closed && state.status === "escalated" && (
        <div className="border-t border-warning/30 bg-warning/5 p-3 text-[11px] text-warning flex items-center gap-2">
          <Siren className="size-3.5" />
          Escalated to HR. They&apos;ll follow up.
        </div>
      )}
      {closed && state.status === "addressed" && (
        <div className="border-t border-success/30 bg-success/5 p-3 text-[11px] text-success flex items-center gap-2">
          <Check className="size-3.5" />
          Marked addressed.
        </div>
      )}
      {closed && state.status === "dismissed" && (
        <div className="border-t border-border bg-secondary/30 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
          <X className="size-3.5" />
          Dismissed.
        </div>
      )}
    </motion.div>
  );
}

function ActionButton({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card text-[11px] text-foreground hover:bg-surface-overlay transition-colors"
    >
      <Icon className="size-3 text-muted-foreground" />
      {label}
    </button>
  );
}

