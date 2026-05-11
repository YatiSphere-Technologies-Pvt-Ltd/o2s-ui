"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  MessageSquare,
  Send,
  ShieldQuestion,
  Wallet,
  XCircle,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  CURRENT_BALANCES,
  LEAVE_TYPE_MAP,
  OPEN_WORK_BY_EMPLOYEE,
  impactFor,
  historyFor,
  recommendFor,
} from "@/components/leave/data";
import { StatusPill } from "@/components/leave/status-pill";
import { TeamCalendarOverlay } from "@/components/leave/team-calendar-overlay";
import { EmployeeLeaveTimeline } from "@/components/leave/employee-leave-timeline";
import { OpenWorkList } from "@/components/leave/open-work-list";
import { BusinessImpactCard } from "@/components/leave/business-impact";
import { CoPilotPanel } from "@/components/leave/copilot-panel";
import { CommentsThread } from "@/components/leave/comments-thread";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ManagerApprovalPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { setScreen } = useScreen();
  const {
    teamRequests,
    commentsByRequest,
    decideTeamRequest,
    addComment,
    managerName,
    managerInitials,
  } = useLeaveStore();

  const request = teamRequests.find((r) => r.id === id);

  const [flash, setFlash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDeny, setShowDeny] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [comment, setComment] = useState("");

  const reqId = request?.id;
  const reqLabel = request
    ? `${request.employeeName} · ${LEAVE_TYPE_MAP[request.type].shortLabel}`
    : undefined;
  useEffect(() => {
    if (!reqId) return;
    setScreen({
      module: "Leave",
      page: "Approval detail",
      recordId: reqId,
      recordLabel: reqLabel,
    });
    return () => setScreen(null);
  }, [reqId, reqLabel, setScreen]);

  const otherTeamRequests = useMemo(() => teamRequests, [teamRequests]);
  const rec = useMemo(
    () => (request ? recommendFor(request, otherTeamRequests) : null),
    [request, otherTeamRequests],
  );
  const impact = useMemo(() => (request ? impactFor(request) : null), [request]);
  const history = useMemo(() => (request ? historyFor(request.employeeId) : undefined), [request]);
  const openWork = useMemo(
    () => (request ? OPEN_WORK_BY_EMPLOYEE[request.employeeId] ?? [] : []),
    [request],
  );
  const comments = request ? commentsByRequest[request.id] ?? [] : [];

  // Balance impact: rough — Priya's balances seeded for employee; for managers we estimate by type.
  const balanceBefore = request
    ? CURRENT_BALANCES.find((b) => b.type === request.type)?.balance ?? 14
    : 0;
  const balanceAfter = Math.max(0, balanceBefore - (request?.days ?? 0));

  if (!request) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Request not found</h1>
        <p className="text-sm text-muted-foreground mt-2">
          The request <code className="text-foreground">{id}</code> isn&apos;t in your queue.
        </p>
        <Link
          href="/leave/manager"
          className="inline-flex items-center gap-1.5 mt-6 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Manager Home
        </Link>
      </div>
    );
  }

  const req = request;
  const type = LEAVE_TYPE_MAP[req.type];
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  function handleApprove() {
    decideTeamRequest(req.id, "approved");
    flashOnce(`Approved ${req.employeeName.split(" ")[0]}'s request.`);
    window.setTimeout(() => router.push("/leave/manager"), 800);
  }

  function handleDeny() {
    decideTeamRequest(req.id, "rejected", denyReason || undefined);
    flashOnce(`Denied ${req.employeeName.split(" ")[0]}'s request.`);
    setShowDeny(false);
    setDenyReason("");
    window.setTimeout(() => router.push("/leave/manager"), 800);
  }

  function copyMessage() {
    if (!rec) return;
    try {
      void navigator.clipboard?.writeText(rec.suggestedMessage);
    } catch {}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function postComment(body: string) {
    addComment(req.id, body, managerName, managerInitials, "manager");
    flashOnce("Comment posted.");
  }

  function negotiateAlternative() {
    const altStart = new Date(req.startDate);
    altStart.setDate(altStart.getDate() + 7);
    const altEnd = new Date(req.endDate);
    altEnd.setDate(altEnd.getDate() + 7);
    const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const body = `Holiday Negotiator suggestion: would moving to ${fmt(altStart)} – ${fmt(altEnd)} work? That window's clear on the team calendar.`;
    setComment(body);
  }

  function requestMoreInfo() {
    const body = `Hi ${req.employeeName.split(" ")[0]}, before I decide — could you share `;
    setComment(body);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3 min-w-0">
          <Link
            href="/leave/manager"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${type.tint}`}>
                <span className={`text-[10px] font-bold ${type.color}`}>{type.shortLabel}</span>
                <span className="text-xs text-foreground">{type.label}</span>
              </span>
              <StatusPill status={req.status} />
              <span className="text-[11px] text-muted-foreground">
                Request <code className="text-foreground">{req.id}</code>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {req.employeeName}&apos;s leave
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {req.startDate === req.endDate
                ? fmtDate(req.startDate)
                : `${fmtDate(req.startDate)} → ${fmtDate(req.endDate)}`}{" "}
              · {req.days} day{req.days !== 1 ? "s" : ""}
              {req.granularity === "FH" ? " (first half)" : req.granularity === "SH" ? " (second half)" : req.granularity === "HOURS" ? " (hourly)" : ""}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left — request summary */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="lg:col-span-3 space-y-6"
        >
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Request summary</h3>
            <Link
              href={`/leave/manager/report/${req.employeeId}`}
              className="flex items-center gap-3 mb-4 p-2 -mx-2 rounded-lg hover:bg-surface-overlay/40 transition-colors"
              title="Open direct report detail"
            >
              <div className={`size-10 rounded-full ${req.employeeAvatar} text-white text-sm font-bold flex items-center justify-center`}>
                {req.employeeInitials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{req.employeeName}</p>
                <p className="text-[11px] text-muted-foreground truncate">{req.employeeTitle}</p>
              </div>
            </Link>
            <dl className="space-y-2 text-xs">
              <Row label="Type" value={type.label} />
              <Row label="Dates" value={req.startDate === req.endDate ? new Date(req.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : `${new Date(req.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(req.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`} />
              <Row label="Days" value={`${req.days}`} />
              <Row label="Submitted" value={new Date(req.submittedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} />
              {req.reason && <Row label="Reason" value={req.reason} multiline />}
              {req.needsCertificate && <Row label="Certificate" value="Attached (medical)" />}
            </dl>
          </div>

          {/* Balance impact */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="size-4 text-brand" />
              <h3 className="text-sm font-semibold text-foreground">Balance impact</h3>
            </div>
            <div className="flex items-center gap-3 bg-surface-overlay/40 border border-border rounded-lg p-3">
              <div className="flex-1 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Before</p>
                <p className="text-lg font-bold text-foreground">{balanceBefore}</p>
              </div>
              <div className="text-muted-foreground">→</div>
              <div className="flex-1 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">After</p>
                <p className={`text-lg font-bold ${balanceAfter === 0 ? "text-destructive" : "text-foreground"}`}>
                  {balanceAfter}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
              {type.shortLabel} balance assuming this request is approved.
            </p>
          </div>
        </motion.div>

        {/* Middle — context */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="lg:col-span-5 space-y-6"
        >
          {history && <EmployeeLeaveTimeline strip={history} />}
          <TeamCalendarOverlay
            startISO={req.startDate}
            endISO={req.endDate}
            employeeId={req.employeeId}
            employeeName={req.employeeName}
            employeeInitials={req.employeeInitials}
            employeeAvatar={req.employeeAvatar}
            type={req.type}
          />
          <OpenWorkList items={openWork} leaveStartISO={req.startDate} leaveEndISO={req.endDate} />
          {impact && <BusinessImpactCard impact={impact} />}
        </motion.div>

        {/* Right — Co-Pilot */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="lg:col-span-4 space-y-6"
        >
          {rec && (
            <CoPilotPanel
              rec={rec}
              onCopyMessage={copyMessage}
              copied={copied}
            />
          )}
        </motion.div>
      </div>

      {/* Comments thread */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-brand" />
              <h3 className="text-sm font-semibold text-foreground">Comments</h3>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {comments.length} {comments.length === 1 ? "message" : "messages"}
            </span>
          </div>
          {comments.length > 0 ? (
            <div className="p-0">
              <CommentsThread
                comments={comments}
                onPost={postComment}
                disabled={false}
              />
            </div>
          ) : (
            <div className="p-4">
              <p className="text-xs text-muted-foreground italic text-center py-6">
                No messages yet. Write to the employee below — they&apos;ll see it on their /leave/[id].
              </p>
            </div>
          )}
          {/* Composer (controlled so we can prefill from action buttons) */}
          {comments.length === 0 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!comment.trim()) return;
                postComment(comment.trim());
                setComment("");
              }}
              className="border-t border-border p-3 flex items-center gap-2"
            >
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write to the employee…"
                className="flex-1 h-10 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="size-10 rounded-lg bg-brand text-brand-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                aria-label="Post"
              >
                <Send className="size-4" />
              </button>
            </form>
          )}
        </div>
      </motion.div>

      {/* Sticky action bar */}
      {req.status === "pending" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-3xl w-[calc(100%-2rem)]"
        >
          <div className="bg-card/95 backdrop-blur-md border border-border shadow-2xl rounded-xl p-2.5 flex items-center gap-2">
            <button
              onClick={requestMoreInfo}
              className="flex-1 h-10 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <ShieldQuestion className="size-3.5" />
              Request more info
            </button>
            <button
              onClick={negotiateAlternative}
              className="flex-1 h-10 px-3 rounded-lg text-sm text-warning hover:bg-warning/10 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <CalendarDays className="size-3.5" />
              Negotiate dates
            </button>
            <button
              onClick={() => setShowDeny(true)}
              className="flex-1 h-10 px-3 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive hover:bg-destructive/10 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <XCircle className="size-3.5" />
              Deny
            </button>
            <button
              onClick={handleApprove}
              disabled={rec?.verdict === "block"}
              className="flex-1 h-10 px-4 rounded-lg bg-success text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity inline-flex items-center justify-center gap-1.5"
            >
              <Check className="size-3.5" />
              Approve
            </button>
          </div>
        </motion.div>
      )}

      {/* Deny modal */}
      <AnimatePresence>
        {showDeny && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowDeny(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full pointer-events-auto p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="size-9 shrink-0 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="size-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Deny {req.employeeName}&apos;s request?
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      The employee will see your reason on their leave detail page.
                    </p>
                  </div>
                </div>
                <textarea
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  rows={3}
                  placeholder="Reason (optional)"
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                />
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowDeny(false)}
                    className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeny}
                    className="h-9 px-3 rounded-lg bg-destructive text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Deny request
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-card border border-border shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 text-success" />
            <span className="text-xs text-foreground">{flash}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value, multiline }: { label: string; value: React.ReactNode; multiline?: boolean }) {
  return (
    <div className={`grid ${multiline ? "grid-cols-1 gap-1" : "grid-cols-3 gap-2 items-baseline"}`}>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</dt>
      <dd className={`${multiline ? "" : "col-span-2"} text-xs text-foreground leading-snug`}>{value}</dd>
    </div>
  );
}

