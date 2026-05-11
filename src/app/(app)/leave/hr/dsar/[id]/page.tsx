"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Ban,
  Check,
  CheckCircle2,
  Download,
  Lock,
  Send,
  ShieldAlert,
  Unlock,
  UserPlus,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  HR_COUNTRIES,
  type DsarStatus,
} from "@/components/leave/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_LABEL: Record<DsarStatus, string> = {
  new: "New",
  in_progress: "In progress",
  awaiting_legal: "Awaiting legal",
  completed: "Completed",
  rejected: "Rejected",
};

const STATUS_META: Record<DsarStatus, { tint: string; color: string }> = {
  new:            { tint: "bg-brand/10",          color: "text-brand" },
  in_progress:    { tint: "bg-warning/10",        color: "text-warning" },
  awaiting_legal: { tint: "bg-destructive/10",    color: "text-destructive" },
  completed:      { tint: "bg-success/10",        color: "text-success" },
  rejected:       { tint: "bg-secondary",         color: "text-muted-foreground" },
};

function flagFor(code: string): string {
  return HR_COUNTRIES.find((c) => c.code === code)?.flag ?? "🏳";
}

export default function DsarDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { setScreen } = useScreen();
  const { findDsar, updateDsar, appendDsarHistory } = useLeaveStore();
  const dsar = findDsar(id);

  const [flash, setFlash] = useState<string | null>(null);
  const [legalHoldOpen, setLegalHoldOpen] = useState(false);
  const [legalHoldReason, setLegalHoldReason] = useState("");

  const dsarId = dsar?.id;
  const dsarLabel = dsar ? `${dsar.subjectName} · ${dsar.scope}` : undefined;
  useEffect(() => {
    if (!dsarId) return;
    setScreen({
      module: "Leave",
      page: "DSAR detail",
      recordId: dsarId,
      recordLabel: dsarLabel,
    });
    return () => setScreen(null);
  }, [dsarId, dsarLabel, setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  if (!dsar) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">DSAR not found</h1>
        <Link
          href="/leave/hr/dsar"
          className="inline-flex items-center gap-1.5 mt-6 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to DSAR queue
        </Link>
      </div>
    );
  }

  const meta = STATUS_META[dsar.status];
  const onHold = !!dsar.legalHold;

  function assignToSelf() {
    updateDsar(dsar!.id, { assigneeName: "Anita Sharma" });
    appendDsarHistory(dsar!.id, { actor: "Anita Sharma", action: "assigned to self" });
    flashOnce("Assigned to you.");
  }

  function placeLegalHold() {
    if (!legalHoldReason.trim()) return;
    const now = new Date();
    updateDsar(dsar!.id, {
      legalHold: {
        reason: legalHoldReason.trim(),
        placedByName: "Anita Sharma",
        placedOnISO: now.toISOString(),
      },
      status: "awaiting_legal",
    });
    appendDsarHistory(dsar!.id, {
      actor: "Anita Sharma",
      action: "placed legal hold",
      note: legalHoldReason.trim(),
    });
    setLegalHoldOpen(false);
    setLegalHoldReason("");
    flashOnce("Legal hold placed.");
  }

  function releaseLegalHold() {
    updateDsar(dsar!.id, { legalHold: null, status: "in_progress" });
    appendDsarHistory(dsar!.id, {
      actor: "Anita Sharma",
      action: "released legal hold",
    });
    flashOnce("Legal hold released.");
  }

  function markComplete() {
    updateDsar(dsar!.id, { status: "completed" });
    appendDsarHistory(dsar!.id, { actor: "Anita Sharma", action: "marked complete" });
    flashOnce("DSAR marked complete.");
  }

  function reject() {
    updateDsar(dsar!.id, { status: "rejected" });
    appendDsarHistory(dsar!.id, { actor: "Anita Sharma", action: "rejected" });
    flashOnce("DSAR rejected.");
  }

  function exportPackage() {
    flashOnce(`Generating data package for ${dsar!.subjectName}…`);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3 flex-wrap"
      >
        <Link
          href="/leave/hr/dsar"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`size-12 rounded-full ${dsar.subjectAvatar} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
            {dsar.subjectInitials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${meta.tint} ${meta.color}`}>
                {STATUS_LABEL[dsar.status]}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{dsar.scope} · {flagFor(dsar.country)} {dsar.country}</span>
              <code className="text-[10px] font-mono text-muted-foreground/80">{dsar.id}</code>
              {onHold && (
                <span className="inline-flex items-center gap-1 text-[10px] text-destructive">
                  <Lock className="size-2.5" /> Legal hold active
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">{dsar.subjectName}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{dsar.reason}</p>
          </div>
        </div>
      </motion.div>

      {/* Action bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {!dsar.assigneeName && (
          <button onClick={assignToSelf} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
            <UserPlus className="size-3.5" />
            Assign to me
          </button>
        )}
        {!onHold && dsar.status !== "completed" && dsar.status !== "rejected" && (
          <button onClick={() => setLegalHoldOpen(true)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-destructive/40 bg-destructive/5 text-destructive text-sm hover:bg-destructive/10 transition-colors">
            <Lock className="size-3.5" />
            Place legal hold
          </button>
        )}
        {onHold && (
          <button onClick={releaseLegalHold} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
            <Unlock className="size-3.5" />
            Release legal hold
          </button>
        )}
        <button onClick={exportPackage} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
          <Download className="size-3.5" />
          Export data package
        </button>
        {dsar.status !== "completed" && dsar.status !== "rejected" && (
          <>
            <button onClick={markComplete} className="ml-auto inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-success text-white text-sm font-medium hover:opacity-90 transition-opacity">
              <Check className="size-3.5" />
              Mark complete
            </button>
            <button onClick={reject} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
              <Ban className="size-3.5" />
              Reject
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Section title="Subject details">
            <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              <Row label="Subject" value={dsar.subjectName} />
              <Row label="Country" value={`${flagFor(dsar.country)} ${dsar.country}`} />
              <Row label="Scope" value={dsar.scope} />
              <Row label="Submitted" value={new Date(dsar.submittedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
              <Row label="Submitted by" value={dsar.submittedByName} />
              <Row label="Due" value={new Date(dsar.dueDateISO).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
              <Row label="Assignee" value={dsar.assigneeName ?? "Unassigned"} />
              <Row label="Status" value={STATUS_LABEL[dsar.status]} />
            </dl>
            <p className="text-xs text-muted-foreground leading-relaxed mt-3 border-t border-border pt-3">
              <span className="font-medium text-foreground">Reason: </span>
              {dsar.reason}
            </p>
          </Section>

          {/* Timeline */}
          <Section title="Timeline">
            <ol className="space-y-3">
              {dsar.history.map((h, i) => (
                <li key={h.id} className="flex gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="size-6 rounded-full bg-secondary flex items-center justify-center">
                      <Send className="size-3 text-muted-foreground" />
                    </div>
                    {i < dsar.history.length - 1 && <span className="w-px flex-1 bg-border mt-1 min-h-3" />}
                  </div>
                  <div className="flex-1 min-w-0 pb-2">
                    <p className="text-xs text-foreground">
                      <span className="font-medium">{h.actor}</span> · {h.action}
                    </p>
                    {h.note && <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{h.note}</p>}
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{h.whenLabel}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        <div className="space-y-6">
          {/* Legal hold panel */}
          <Section title="Legal hold">
            {onHold ? (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-[11px] text-destructive">
                  <Lock className="size-3" />
                  Active hold
                </div>
                <p className="text-xs text-foreground leading-snug">{dsar.legalHold!.reason}</p>
                <p className="text-[10px] text-muted-foreground">
                  Placed by {dsar.legalHold!.placedByName} on{" "}
                  {new Date(dsar.legalHold!.placedOnISO).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.
                </p>
                <p className="text-[10px] text-muted-foreground/60 leading-snug pt-2 border-t border-border">
                  Deletion is paused while a hold is active. Access and portability requests can still progress.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No legal hold on this DSAR.</p>
            )}
          </Section>

          {/* Privacy footer */}
          <Section title="Privacy">
            <p className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
              <ShieldAlert className="size-3 shrink-0 mt-0.5" />
              <span>
                Access by HR is logged in the audit trail. Subject can request a copy of their access record at any time.
              </span>
            </p>
          </Section>
        </div>
      </div>

      {/* Legal hold modal */}
      <AnimatePresence>
        {legalHoldOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-60 bg-black/50"
              onClick={() => setLegalHoldOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full pointer-events-auto p-5">
                <h3 className="text-sm font-semibold text-foreground">Place legal hold</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-3 leading-relaxed">
                  Pauses deletion. Required: a reason for audit. The DSAR will move to &ldquo;Awaiting legal&rdquo;.
                </p>
                <textarea
                  value={legalHoldReason}
                  onChange={(e) => setLegalHoldReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Active disciplinary investigation pending May 22 hearing."
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                />
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button onClick={() => setLegalHoldOpen(false)} className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={placeLegalHold}
                    disabled={!legalHoldReason.trim()}
                    className="h-9 px-3 rounded-lg bg-destructive text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  >
                    Place hold
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-70 px-4 py-2.5 rounded-lg bg-card border border-border shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 text-success" />
            <span className="text-xs text-foreground">{flash}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</dt>
      <dd className="text-foreground mt-0.5 text-xs">{value}</dd>
    </div>
  );
}
