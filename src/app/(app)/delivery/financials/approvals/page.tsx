"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  Check,
  ChevronRight,
  Clock,
  Receipt,
  Users,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import { useFinanceStore } from "@/lib/finance-store";
import {
  APPROVAL_LAYER_LABEL,
  type ApprovalLayer,
} from "@/components/delivery/financial/data";
import { PEOPLE_MAP, PROJECTS_MAP } from "@/components/delivery/data";

export default function ApprovalsPage() {
  const { setScreen } = useScreen();
  const { timeEntries } = useDeliveryStore();
  const { approvals, setApprovalState } = useFinanceStore();
  const [layer, setLayer] = useState<ApprovalLayer | "all">("all");
  const [flash, setFlash] = useState<string | null>(null);
  const [rejectFor, setRejectFor] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Approvals" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  const filteredApprovals = useMemo(() => {
    return approvals.filter((a) => layer === "all" ? true : a.layer === layer);
  }, [approvals, layer]);

  const groupedByEntry = useMemo(() => {
    const map: Record<string, typeof approvals> = {};
    for (const a of filteredApprovals) {
      if (!map[a.timeEntryId]) map[a.timeEntryId] = [];
      map[a.timeEntryId].push(a);
    }
    return map;
  }, [filteredApprovals]);

  const counts = useMemo(() => {
    return {
      pending: approvals.filter((a) => a.status === "pending").length,
      approved: approvals.filter((a) => a.status === "approved").length,
      rejected: approvals.filter((a) => a.status === "rejected").length,
      manager: approvals.filter((a) => a.layer === "manager" && a.status === "pending").length,
      project: approvals.filter((a) => a.layer === "project" && a.status === "pending").length,
      client_bill: approvals.filter((a) => a.layer === "client_bill" && a.status === "pending").length,
    };
  }, [approvals]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link href="/delivery/financials" className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Timesheet approvals</h1>
            <p className="text-sm text-muted-foreground">3-layer approval chain: Manager (is this real?) → Project (is it on-scope?) → Client-billable (can we bill?).</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="rounded-lg bg-success/10 border border-success/20 px-3 py-2 text-[12px] text-success flex items-center gap-2">
            <Check className="size-3.5" />
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatTile label="Pending" value={counts.pending} icon={Clock} tint="bg-warning/10 text-warning" />
        <StatTile label="Approved" value={counts.approved} icon={Check} tint="bg-success/10 text-success" />
        <StatTile label="Rejected" value={counts.rejected} icon={X} tint="bg-destructive/10 text-destructive" />
      </div>

      {/* Layer pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "manager", "project", "client_bill"] as const).map((l) => {
          const c = l === "all" ? approvals.length : l === "manager" ? counts.manager : l === "project" ? counts.project : counts.client_bill;
          return (
            <button key={l} onClick={() => setLayer(l)}
              className={`h-9 px-3 rounded-lg text-[12px] inline-flex items-center gap-2 transition-colors ${
                layer === l ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}>
              {l === "all" ? <Receipt className="size-3.5" /> : l === "manager" ? <Users className="size-3.5" /> : l === "project" ? <Banknote className="size-3.5" /> : <Receipt className="size-3.5" />}
              {l === "all" ? "All layers" : APPROVAL_LAYER_LABEL[l]}
              {l !== "all" && <span className="text-[10px] tabular-nums">({c})</span>}
            </button>
          );
        })}
      </div>

      {/* Grouped by time entry */}
      <div className="space-y-3">
        {Object.entries(groupedByEntry).map(([entryId, rows]) => {
          const entry = timeEntries.find((t) => t.id === entryId);
          if (!entry) return null;
          const person = PEOPLE_MAP[entry.personId];
          const project = PROJECTS_MAP[entry.projectId];
          return (
            <section key={entryId} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 flex-wrap">
                {person && (
                  <span className={`size-7 rounded-full ${person.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}>{person.initials}</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{person?.name}</p>
                    <span className="text-[10px] uppercase tracking-wider bg-secondary text-foreground px-1.5 py-0.5 rounded">{project?.shortName}</span>
                    {entry.billable && <span className="text-[10px] uppercase tracking-wider bg-success/10 text-success px-1.5 py-0.5 rounded">Billable</span>}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{entry.dateISO} · {entry.hours}h · {entry.kind} · {entry.note ?? "—"}</p>
                </div>
              </div>
              <ol className="px-4 py-3 space-y-2">
                {rows.map((a) => {
                  const approver = PEOPLE_MAP[a.approverId];
                  return (
                    <li key={a.id} className="flex items-start gap-3">
                      <div className={`size-6 rounded-full shrink-0 flex items-center justify-center ${
                        a.status === "approved" ? "bg-success/10 text-success" : a.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                      }`}>
                        {a.status === "approved" ? <Check className="size-3" /> : a.status === "rejected" ? <X className="size-3" /> : <Clock className="size-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wider bg-secondary text-foreground px-1.5 py-0.5 rounded">{APPROVAL_LAYER_LABEL[a.layer]}</span>
                          <p className="text-[12px] text-foreground">{approver?.name}</p>
                          {a.whenISO && <span className="text-[10px] text-muted-foreground">· {a.whenISO.slice(0, 10)}</span>}
                          {a.rejectionReason && (
                            <span className="text-[11px] text-destructive">— {a.rejectionReason}</span>
                          )}
                        </div>
                      </div>
                      {a.status === "pending" && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => { setApprovalState(a.id, "approved"); flashOnce("Approved."); }}
                            className="size-7 rounded-md flex items-center justify-center bg-success/10 text-success hover:bg-success/20 transition-colors" aria-label="Approve">
                            <Check className="size-3.5" />
                          </button>
                          <button onClick={() => setRejectFor(a.id)}
                            className="size-7 rounded-md flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors" aria-label="Reject">
                            <X className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
        {Object.keys(groupedByEntry).length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-12">No approvals match these filters.</p>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground/60 flex items-start gap-2 pt-1">
        <ChevronRight className="size-3 mt-0.5" />
        Manager confirms hours are real. Project confirms work was on-scope. Client-billable layer confirms hours can be billed (rate card matches, scope covered by SOW).
      </p>

      <AnimatePresence>
        {rejectFor && (
          <RejectModal
            onClose={() => setRejectFor(null)}
            onSubmit={(reason) => { setApprovalState(rejectFor!, "rejected", reason); setRejectFor(null); flashOnce("Rejected with note."); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatTile({ label, value, icon: Icon, tint }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; tint: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1 inline-flex items-center gap-1.5">
        <span className={`size-5 rounded-md flex items-center justify-center ${tint}`}><Icon className="size-3" /></span>
        {label}
      </p>
      <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
    </div>
  );
}

function RejectModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md min-w-80">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Reject with reason</h3>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"><X className="size-4" /></button>
        </div>
        <div className="px-5 py-4">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Why are you rejecting?</span>
            <textarea autoFocus value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="e.g. Two hours look like Phoenix work — please split."
              className="mt-1 w-full px-2.5 py-2 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none" />
          </label>
          <p className="text-[11px] text-muted-foreground mt-2">The submitter will be notified and can resubmit a corrected entry.</p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button onClick={onClose} className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">Cancel</button>
          <button onClick={() => onSubmit(reason || "No reason given")} disabled={reason.trim().length < 3}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
            <X className="size-3.5" />
            Reject
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
