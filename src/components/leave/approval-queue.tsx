"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckSquare, ChevronDown, ChevronRight, Inbox, Square, ShieldAlert, Sparkles, X } from "lucide-react";
import {
  LEAVE_TYPE_MAP,
  recommendFor,
  type CoPilotVerdict,
  type TeamRequest,
} from "@/components/leave/data";

const VERDICT_META: Record<
  CoPilotVerdict,
  { icon: React.ComponentType<{ className?: string }>; tint: string; color: string; ring: string }
> = {
  approve: { icon: Sparkles,     tint: "bg-success/10",      color: "text-success",     ring: "ring-success/30" },
  review:  { icon: ChevronRight, tint: "bg-warning/10",      color: "text-warning",     ring: "ring-warning/30" },
  block:   { icon: ShieldAlert,  tint: "bg-destructive/10",  color: "text-destructive", ring: "ring-destructive/30" },
};

function fmtRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  if (start === end) {
    return s.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  return `${s.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${e.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
}

interface Props {
  requests: TeamRequest[];
  otherRequests: TeamRequest[];
  onApprove: (id: string) => void;
  onDenyClick: (r: TeamRequest) => void;
  onBulkApprove?: (ids: string[]) => void;
  onBulkDeny?: (ids: string[]) => void;
  /** Active delegate label, if any. Shown as a per-row attribution chip. */
  delegateLabel?: string | null;
}

export function ApprovalQueueCard({ requests, otherRequests, onApprove, onDenyClick, onBulkApprove, onBulkDeny, delegateLabel }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const pending = useMemo(() => requests.filter((r) => r.status === "pending"), [requests]);

  // Precompute verdicts so the header + bulk actions can use them.
  const verdicts = useMemo(() => {
    const map = new Map<string, CoPilotVerdict>();
    for (const r of pending) map.set(r.id, recommendFor(r, otherRequests).verdict);
    return map;
  }, [pending, otherRequests]);

  const recommendedIds = useMemo(
    () => pending.filter((r) => verdicts.get(r.id) === "approve").map((r) => r.id),
    [pending, verdicts],
  );

  const allSelected = pending.length > 0 && selected.size === pending.length;
  const anySelected = selected.size > 0;
  const selectedArray = Array.from(selected);
  const selectedBlocked = selectedArray.filter((id) => verdicts.get(id) === "block").length;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(pending.map((r) => r.id)));
  }

  function selectRecommended() {
    setSelected(new Set(recommendedIds));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function bulkApprove() {
    const approvable = selectedArray.filter((id) => verdicts.get(id) !== "block");
    if (approvable.length === 0) return;
    onBulkApprove?.(approvable);
    clearSelection();
  }

  function bulkDeny() {
    if (selectedArray.length === 0) return;
    onBulkDeny?.(selectedArray);
    clearSelection();
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border flex-wrap">
        <div className="flex items-center gap-2">
          <Inbox className="size-4 text-brand" />
          <h3 className="text-sm font-semibold text-foreground">Approval queue</h3>
          <span className="ml-1 inline-flex items-center justify-center min-w-5 h-4 px-1 rounded-full bg-brand/10 text-brand text-[10px] font-semibold tabular-nums">
            {pending.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {recommendedIds.length > 0 && (
            <button
              onClick={selectRecommended}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-success/10 text-success hover:bg-success/15 transition-colors"
              title="Select every request the Co-Pilot recommends approving"
            >
              <Sparkles className="size-3" />
              Select all recommended ({recommendedIds.length})
            </button>
          )}
          {pending.length > 0 && (
            <button
              onClick={allSelected ? clearSelection : selectAll}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {allSelected ? <CheckSquare className="size-3" /> : <Square className="size-3" />}
              {allSelected ? "Clear" : "Select all"}
            </button>
          )}
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm text-foreground">All clear.</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Nothing in the queue. We&apos;ll ping you when a new request arrives.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {pending.map((r) => (
            <QueueRow
              key={r.id}
              r={r}
              otherRequests={otherRequests}
              expanded={expandedId === r.id}
              onToggle={() => setExpandedId((p) => (p === r.id ? null : r.id))}
              onApprove={() => onApprove(r.id)}
              onDeny={() => onDenyClick(r)}
              isSelected={selected.has(r.id)}
              onSelectionToggle={() => toggle(r.id)}
              delegateLabel={delegateLabel ?? null}
            />
          ))}
        </div>
      )}

      {/* Sticky bulk action bar inside the card */}
      <AnimatePresence>
        {anySelected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="border-t border-border bg-surface-overlay/60 p-3 flex items-center gap-3 flex-wrap"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-xs font-medium text-foreground tabular-nums">
                {selected.size} selected
              </span>
              {selectedBlocked > 0 && (
                <span className="text-[10px] text-destructive">
                  · {selectedBlocked} blocked by policy will be skipped
                </span>
              )}
            </div>
            <button
              onClick={clearSelection}
              className="px-2.5 py-1.5 rounded-md text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={bulkDeny}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-destructive/30 bg-destructive/5 text-destructive text-[11px] font-medium hover:bg-destructive/10 transition-colors"
            >
              <X className="size-3" />
              Deny {selected.size}
            </button>
            <button
              onClick={bulkApprove}
              disabled={selected.size === selectedBlocked}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-success text-white text-[11px] font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              <Check className="size-3" />
              Approve {selected.size - selectedBlocked}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QueueRow({
  r,
  otherRequests,
  expanded,
  onToggle,
  onApprove,
  onDeny,
  isSelected,
  onSelectionToggle,
  delegateLabel,
}: {
  r: TeamRequest;
  otherRequests: TeamRequest[];
  expanded: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onDeny: () => void;
  isSelected: boolean;
  onSelectionToggle: () => void;
  delegateLabel: string | null;
}) {
  const type = LEAVE_TYPE_MAP[r.type];
  const rec = recommendFor(r, otherRequests);
  const m = VERDICT_META[rec.verdict];
  const RecIcon = m.icon;
  const blocked = rec.verdict === "block";

  return (
    <div className={`px-4 py-3 transition-colors ${isSelected ? "bg-brand/4" : expanded ? "bg-surface-overlay/40" : "hover:bg-surface-overlay/30"}`}>
      <div className="flex items-center gap-3">
        {/* Selection checkbox */}
        <button
          onClick={onSelectionToggle}
          className={`size-5 shrink-0 rounded flex items-center justify-center transition-colors ${
            isSelected ? "bg-brand text-brand-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={isSelected}
          aria-label={isSelected ? "Deselect" : "Select"}
        >
          {isSelected ? <Check className="size-3" /> : <span className="block size-3" />}
        </button>

        {/* Avatar */}
        <div className={`size-9 shrink-0 rounded-full ${r.employeeAvatar} text-white text-[11px] font-bold flex items-center justify-center`}>
          {r.employeeInitials}
        </div>

        {/* Identity + request summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground truncate">{r.employeeName}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{r.employeeTitle}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <span className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded ${type.tint}`}>
              <span className={`text-[9px] font-bold ${type.color}`}>{type.shortLabel}</span>
              <span className="text-[11px] text-foreground">{type.label}</span>
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {fmtRange(r.startDate, r.endDate)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {r.days} day{r.days !== 1 ? "s" : ""}
              {r.granularity === "FH" ? " (AM)" : r.granularity === "SH" ? " (PM)" : ""}
            </span>
            {delegateLabel && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-brand/10 text-brand">
                Routed to {delegateLabel}
              </span>
            )}
          </div>
        </div>

        {/* Co-pilot rec pill */}
        <button
          onClick={onToggle}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${m.tint} ${m.color} ${m.ring} text-[11px] font-medium whitespace-nowrap`}
          title={rec.rationale}
        >
          <RecIcon className="size-3" />
          {rec.label}
          <ChevronDown className={`size-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onDeny}
            className="size-8 inline-flex items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Deny"
            title="Deny"
          >
            <X className="size-3.5" />
          </button>
          <button
            onClick={onApprove}
            disabled={blocked}
            className="inline-flex items-center gap-1 h-8 px-3 rounded-md bg-success text-white text-xs font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            title={blocked ? "Blocked by hard policy" : "Approve"}
          >
            <Check className="size-3.5" />
            Approve
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-border">
              <div className="md:col-span-2 space-y-2 text-xs">
                <p className="text-foreground leading-relaxed">{rec.rationale}</p>
                {r.reason && (
                  <p className="text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-medium">Reason: </span>
                    {r.reason}
                  </p>
                )}
                <ul className="space-y-1">
                  {rec.facts.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-muted-foreground">
                      <span className={`size-1 rounded-full bg-current ${m.color}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2 text-xs">
                <Link
                  href={`/leave/manager/${r.id}`}
                  className="block w-full text-center px-3 py-2 rounded-md bg-brand text-brand-foreground hover:opacity-90 transition-opacity"
                >
                  Open approval detail →
                </Link>
                {r.needsCertificate && (
                  <p className="text-warning text-[11px] leading-snug">
                    Medical certificate attached — verify before approving.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
