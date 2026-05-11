"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Pencil,
  Share2,
  Undo2,
  XCircle,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  AUDIT_BY_REQUEST,
  approverChainFor,
  attachmentsFor,
  defaultAudit,
  LEAVE_TYPE_MAP,
  type LeaveAttachment,
} from "@/components/leave/data";
import { StatusPill } from "@/components/leave/status-pill";
import { ApprovalTimeline } from "@/components/leave/approval-timeline";
import { CommentsThread } from "@/components/leave/comments-thread";
import { AttachmentsList } from "@/components/leave/attachments-list";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LeaveDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { setScreen } = useScreen();
  const { findRequest, commentsByRequest, cancel, addComment } = useLeaveStore();
  const request = findRequest(id);

  const [auditOpen, setAuditOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const reqId = request?.id;
  const reqLabel = request
    ? `${LEAVE_TYPE_MAP[request.type].shortLabel} · ${request.startDate}`
    : undefined;
  useEffect(() => {
    if (!reqId) return;
    setScreen({
      module: "Leave",
      page: "Request detail",
      recordId: reqId,
      recordLabel: reqLabel,
    });
    return () => setScreen(null);
  }, [reqId, reqLabel, setScreen]);

  const chain = useMemo(() => (request ? approverChainFor(request) : []), [request]);
  const attachments = useMemo(() => (request ? attachmentsFor(request) : []), [request]);
  const audit = useMemo(() => {
    if (!request) return [];
    return AUDIT_BY_REQUEST[request.id] ?? defaultAudit(request);
  }, [request]);

  if (!request) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Request not found</h1>
        <p className="text-sm text-muted-foreground mt-2">
          The leave request <code className="text-foreground">{id}</code> isn&apos;t in your records. It may have been deleted.
        </p>
        <Link
          href="/leave/history"
          className="inline-flex items-center gap-1.5 mt-6 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to My Leaves
        </Link>
      </div>
    );
  }

  // After the early return above, `request` is defined. Alias to a const so closures
  // capture a non-nullable value (TS won't narrow the mutable binding inside closures).
  const req = request;

  const type = LEAVE_TYPE_MAP[req.type];
  const fmtDateFull = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const fmtDateShort = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const daysUntil = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(req.startDate);
    return Math.round((start.getTime() - today.getTime()) / 86400000);
  })();

  const canCancel = req.status === "pending" || req.status === "approved";
  const canEdit = req.status === "pending" || req.status === "draft";
  const comments = commentsByRequest[req.id] ?? [];

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  function handleCancel() {
    cancel(req.id);
    setShowCancelConfirm(false);
    flashOnce("Request cancelled. Your manager has been notified.");
  }

  function handleEdit() {
    const q = encodeURIComponent(
      [
        type.label,
        req.startDate === req.endDate
          ? req.startDate
          : `${req.startDate} to ${req.endDate}`,
      ].join(" "),
    );
    router.push(`/leave/request?q=${q}`);
  }

  function handleDownload(a?: LeaveAttachment) {
    flashOnce(a ? `Downloading ${a.filename}…` : "Download started — confirmation.pdf");
  }

  function handleShare() {
    flashOnce("Calendar invite sent to your inbox.");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div className="flex items-start gap-3 min-w-0">
          <Link
            href="/leave/history"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${type.tint}`}>
                <span className={`text-[10px] font-bold ${type.color}`}>{type.shortLabel}</span>
                <span className="text-xs text-foreground">{type.label}</span>
              </span>
              <StatusPill status={request.status} />
              {daysUntil > 0 && request.status !== "cancelled" && request.status !== "rejected" && (
                <span className="text-[11px] text-muted-foreground">
                  Starts in {daysUntil} day{daysUntil !== 1 ? "s" : ""}
                </span>
              )}
              {daysUntil < 0 && request.status === "taken" && (
                <span className="text-[11px] text-muted-foreground">Past leave</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight mt-1.5">
              {request.startDate === request.endDate ? (
                fmtDateFull(request.startDate)
              ) : (
                <>
                  {fmtDateFull(request.startDate)} <span className="text-muted-foreground">→</span>{" "}
                  {fmtDateFull(request.endDate)}
                </>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 tabular-nums">
              {request.days} day{request.days !== 1 ? "s" : ""}
              {request.granularity === "FH" && " · first half"}
              {request.granularity === "SH" && " · second half"}
              {request.granularity === "HOURS" && " · hourly"}
              {" · "}Request ID <code className="text-foreground">{request.id}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {canEdit && (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
            >
              <Pencil className="size-3.5" />
              Edit
            </button>
          )}
          <button
            onClick={() => handleDownload()}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <Download className="size-3.5" />
            Download
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <Share2 className="size-3.5" />
            Share to calendar
          </button>
          {canCancel && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Undo2 className="size-3.5" />
              {request.status === "approved" ? "Withdraw" : "Cancel"}
            </button>
          )}
        </div>
      </motion.div>

      {/* Approval timeline */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
      >
        <ApprovalTimeline
          submittedOn={request.submittedOn}
          submittedLabel={fmtDateShort(request.submittedOn)}
          chain={chain}
        />
      </motion.div>

      {/* Lower two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 — attachments + comments */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <AttachmentsList attachments={attachments} onDownload={handleDownload} />
          <CommentsThread
            comments={comments}
            onPost={(body) => {
              addComment(request.id, body);
              flashOnce("Comment posted.");
            }}
            disabled={request.status === "cancelled" || request.status === "rejected"}
          />
        </motion.div>

        {/* Right 1/3 — details, audit, links */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="space-y-6"
        >
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Details</h3>
            <dl className="space-y-2">
              <DetailRow label="Submitted" value={fmtDateShort(request.submittedOn)} />
              {request.decidedOn && <DetailRow label="Decided" value={fmtDateShort(request.decidedOn)} />}
              <DetailRow label="Approver" value={request.approverName ?? "—"} />
              <DetailRow label="Policy" value={
                <Link href="/leave/policies" className="text-brand hover:underline inline-flex items-center gap-1">
                  {type.label} policy <ExternalLink className="size-3" />
                </Link>
              } />
              {request.reason && <DetailRow label="Reason" value={request.reason} multiline />}
            </dl>
          </div>

          {/* Audit trail */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setAuditOpen((p) => !p)}
              className="w-full flex items-center justify-between p-4 hover:bg-surface-overlay/40 transition-colors"
            >
              <h3 className="text-sm font-semibold text-foreground">Audit trail</h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">{audit.length} events</span>
                {auditOpen ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
              </div>
            </button>
            <AnimatePresence>
              {auditOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden border-t border-border"
                >
                  <ol className="p-4 space-y-3">
                    {audit.map((ev, i) => (
                      <li key={ev.id} className="flex gap-3 text-xs">
                        <span className="size-6 shrink-0 rounded-full bg-secondary text-[9px] text-muted-foreground flex items-center justify-center font-mono">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground">
                            <span className="font-medium">{ev.actor}</span>{" "}
                            <span className="text-muted-foreground">· {ev.kind.replace("_", " ")}</span>
                          </p>
                          {ev.note && <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{ev.note}</p>}
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">{ev.whenLabel}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick links */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick links</h3>
            <div className="space-y-1.5 text-xs">
              <Link href="/leave/calendar" className="flex items-center gap-2 text-foreground hover:text-brand transition-colors">
                <Calendar className="size-3.5 text-muted-foreground" />
                See on calendar
              </Link>
              <Link href={`/leave/request?q=${encodeURIComponent(`Similar to ${request.id}`)}`} className="flex items-center gap-2 text-foreground hover:text-brand transition-colors">
                <CheckCircle2 className="size-3.5 text-muted-foreground" />
                Plan a similar leave
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowCancelConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full pointer-events-auto p-5">
                <div className="flex items-start gap-3">
                  <div className="size-9 shrink-0 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="size-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {request.status === "approved" ? "Withdraw this leave?" : "Cancel this request?"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {request.status === "approved"
                        ? `Your manager will be notified. Any balance held against this leave will be released. You can't reverse this without resubmitting.`
                        : "This will withdraw the request from your approver. You can resubmit later."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-5">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Keep
                  </button>
                  <button
                    onClick={handleCancel}
                    className="h-9 px-3 rounded-lg bg-destructive text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    {request.status === "approved" ? "Withdraw" : "Cancel request"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Flash bar */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-card border border-border shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 text-success" />
            <span className="text-xs text-foreground">{flash}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ label, value, multiline }: { label: string; value: React.ReactNode; multiline?: boolean }) {
  return (
    <div className={`grid ${multiline ? "grid-cols-1 gap-1" : "grid-cols-3 gap-2 items-center"} text-xs`}>
      <dt className={`${multiline ? "" : "col-span-1"} text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold`}>
        {label}
      </dt>
      <dd className={`${multiline ? "" : "col-span-2"} text-foreground`}>{value}</dd>
    </div>
  );
}
