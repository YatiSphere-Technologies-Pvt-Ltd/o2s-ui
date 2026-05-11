"use client";

import Link from "next/link";
import { ArrowRight, Check, X, Send, Ban, FileText, MessageSquare, Paperclip, Pencil } from "lucide-react";
import {
  AUDIT_BY_REQUEST,
  defaultAudit,
  LEAVE_TYPE_MAP,
  type AuditEvent,
  type AuditEventKind,
  type LeaveRequest,
} from "@/components/leave/data";

const EVENT_META: Record<AuditEventKind, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  created:            { icon: Pencil,         color: "text-muted-foreground", bg: "bg-secondary" },
  edited:             { icon: Pencil,         color: "text-muted-foreground", bg: "bg-secondary" },
  submitted:          { icon: Send,           color: "text-brand",            bg: "bg-brand/10" },
  comment:            { icon: MessageSquare,  color: "text-muted-foreground", bg: "bg-secondary" },
  approved:           { icon: Check,          color: "text-success",          bg: "bg-success/10" },
  rejected:           { icon: X,              color: "text-destructive",      bg: "bg-destructive/10" },
  cancelled:          { icon: Ban,            color: "text-muted-foreground", bg: "bg-secondary" },
  withdraw_requested: { icon: Send,           color: "text-warning",          bg: "bg-warning/10" },
};

const KIND_LABEL: Record<AuditEventKind, string> = {
  created: "Created",
  edited: "Edited",
  submitted: "Submitted",
  comment: "Commented",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
  withdraw_requested: "Withdrawal requested",
};

function fmtFull(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function RequestDetailExpand({ request }: { request: LeaveRequest }) {
  const type = LEAVE_TYPE_MAP[request.type];
  const trail: AuditEvent[] = AUDIT_BY_REQUEST[request.id] ?? defaultAudit(request);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 bg-surface-overlay/30 border-t border-border">
      {/* Left: fields */}
      <div className="space-y-3">
        <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
          Details
        </h4>
        <DetailRow label="Leave type" value={
          <span className="inline-flex items-center gap-1.5">
            <span className={`text-[10px] font-bold ${type.color}`}>{type.shortLabel}</span>
            <span>{type.label}</span>
          </span>
        } />
        <DetailRow label="Start" value={fmtFull(request.startDate)} />
        <DetailRow label="End" value={request.startDate === request.endDate ? "Same day" : fmtFull(request.endDate)} />
        <DetailRow label="Days" value={`${request.days} ${request.granularity === "FH" ? "(first half)" : request.granularity === "SH" ? "(second half)" : ""}`} />
        <DetailRow label="Approver" value={request.approverName ?? "—"} />
        <DetailRow label="Submitted" value={fmtFull(request.submittedOn)} />
        {request.decidedOn && <DetailRow label="Decided" value={fmtFull(request.decidedOn)} />}
        {request.reason && <DetailRow label="Reason" value={request.reason} />}
      </div>

      {/* Middle: timeline */}
      <div className="space-y-3 md:col-span-1">
        <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
          Timeline
        </h4>
        <ol className="relative space-y-3">
          {trail.map((ev, i) => {
            const m = EVENT_META[ev.kind];
            const Icon = m.icon;
            return (
              <li key={ev.id} className="flex gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`size-7 rounded-full flex items-center justify-center ${m.bg}`}>
                    <Icon className={`size-3.5 ${m.color}`} />
                  </div>
                  {i < trail.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-1" style={{ minHeight: 12 }} />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <p className="text-xs text-foreground">
                    <span className="font-medium">{ev.actor}</span>{" "}
                    <span className="text-muted-foreground">· {KIND_LABEL[ev.kind].toLowerCase()}</span>
                  </p>
                  {ev.note && <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{ev.note}</p>}
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">{ev.whenLabel}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Right: attachments + policy badges */}
      <div className="space-y-3">
        <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
          Attachments &amp; policy
        </h4>
        {request.needsCertificate ? (
          <div className="flex items-center gap-2 p-2.5 bg-surface-overlay rounded-lg">
            <Paperclip className="size-3.5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground">medical-certificate.pdf</p>
              <p className="text-[10px] text-muted-foreground">144 KB · attached</p>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground italic">No attachments.</p>
        )}
        <div className="pt-2 border-t border-border space-y-1.5">
          <Badge color="text-success" label="Policy: probation cleared" />
          <Badge color="text-success" label="Policy: balance OK" />
          {request.type === "wfa" && <Badge color="text-brand" label="Policy: WFA manager approval" />}
          {request.needsCertificate && <Badge color="text-warning" label="Policy: certificate required" />}
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <Link
            href={`/leave/${request.id}`}
            className="px-3 py-2 rounded-md bg-brand text-brand-foreground text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Open full detail
            <ArrowRight className="size-3.5" />
          </Link>
          <button className="px-3 py-2 rounded-md border border-border bg-card text-xs text-foreground hover:bg-surface-overlay transition-colors flex items-center justify-center gap-2">
            <FileText className="size-3.5" />
            View policy doc
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-xs">
      <dt className="col-span-1 text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-foreground">{value}</dd>
    </div>
  );
}

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <p className={`inline-flex items-center gap-1.5 text-[11px] ${color}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </p>
  );
}
