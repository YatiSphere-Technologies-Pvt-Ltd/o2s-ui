/* ================================================================
   Leave Management — Types & Mock Data (India locale)
   ================================================================ */

export type LeaveTypeKey =
  | "privileged"
  | "sick"
  | "casual"
  | "compoff"
  | "maternity"
  | "paternity"
  | "bereavement"
  | "wfa";

export type RequestStatus = "draft" | "pending" | "approved" | "rejected" | "cancelled" | "taken";

export interface LeaveType {
  key: LeaveTypeKey;
  label: string;
  shortLabel: string;
  /** Tailwind text color class. */
  color: string;
  /** Tailwind bg/border tint class (e.g. "bg-brand/10"). */
  tint: string;
  /** "Accrues monthly", "Capped at 30/yr", etc. */
  accrualRule: string;
  /** Days added each accrual tick. 0 if non-accruing. */
  accrualRate: number;
  /** Months between accruals. */
  accrualEveryMonths: number;
  /** Expiry policy text. */
  expiryRule?: string;
  /** True if this leave type is available to this employee. */
  available: boolean;
}

export const LEAVE_TYPES: LeaveType[] = [
  { key: "privileged", label: "Privileged Leave",  shortLabel: "PL",  color: "text-brand-teal",    tint: "bg-brand-teal/10",    accrualRule: "1.5 days / month, carry-forward to 45",     accrualRate: 1.5, accrualEveryMonths: 1, expiryRule: "Carry-forward capped at 45 days", available: true },
  { key: "sick",       label: "Sick Leave",         shortLabel: "SL",  color: "text-destructive",   tint: "bg-destructive/10",   accrualRule: "12 days / year, no carry-forward",          accrualRate: 1,   accrualEveryMonths: 1, expiryRule: "Lapses on Dec 31",                  available: true },
  { key: "casual",     label: "Casual Leave",       shortLabel: "CL",  color: "text-warning",       tint: "bg-warning/10",       accrualRule: "6 days / year, no carry-forward",           accrualRate: 0.5, accrualEveryMonths: 1, expiryRule: "Lapses on Dec 31",                  available: true },
  { key: "compoff",    label: "Comp-Off",           shortLabel: "CO",  color: "text-brand-purple",  tint: "bg-brand-purple/10",  accrualRule: "Earned on holiday work, expires in 90 days", accrualRate: 0,  accrualEveryMonths: 0, expiryRule: "Each credit expires 90 days from earn", available: true },
  { key: "maternity",  label: "Maternity Leave",    shortLabel: "ML",  color: "text-pink-400",      tint: "bg-pink-400/10",      accrualRule: "26 weeks (per Indian Maternity Benefit Act)", accrualRate: 0, accrualEveryMonths: 0, available: false },
  { key: "paternity",  label: "Paternity Leave",    shortLabel: "PT",  color: "text-blue-400",      tint: "bg-blue-400/10",      accrualRule: "10 days, within 6 months of childbirth",     accrualRate: 0,  accrualEveryMonths: 0, available: true },
  { key: "bereavement",label: "Bereavement Leave",  shortLabel: "BL",  color: "text-muted-foreground", tint: "bg-secondary",      accrualRule: "5 days per event, immediate family",          accrualRate: 0,  accrualEveryMonths: 0, available: true },
  { key: "wfa",        label: "Work From Anywhere", shortLabel: "WFA", color: "text-[#A3E635]",     tint: "bg-[#A3E635]/10",     accrualRule: "30 days / year, manager approval",            accrualRate: 2.5, accrualEveryMonths: 1, expiryRule: "Lapses on Dec 31", available: true },
];

export const LEAVE_TYPE_MAP: Record<LeaveTypeKey, LeaveType> = Object.fromEntries(
  LEAVE_TYPES.map((t) => [t.key, t]),
) as Record<LeaveTypeKey, LeaveType>;

export interface LeaveBalance {
  type: LeaveTypeKey;
  /** Days currently available. */
  balance: number;
  /** Days used calendar-YTD. */
  used: number;
  /** Days pending approval (held against balance). */
  pending: number;
  /** Days that will be lost if not used by year-end. */
  expiringDays?: number;
  /** Date the next accrual hits, ISO string. */
  nextAccrualOn?: string;
  /** Total annual allotment (for the progress ring). */
  annualAllotment: number;
}

export const CURRENT_BALANCES: LeaveBalance[] = [
  { type: "privileged", balance: 12, used: 8,  pending: 2, expiringDays: 0,  nextAccrualOn: "2026-06-01", annualAllotment: 18 },
  { type: "sick",       balance: 9,  used: 3,  pending: 0, expiringDays: 0,  nextAccrualOn: "2026-06-01", annualAllotment: 12 },
  { type: "casual",     balance: 2,  used: 4,  pending: 0, expiringDays: 2,  nextAccrualOn: "2026-06-01", annualAllotment: 6 },
  { type: "compoff",    balance: 1.5, used: 0.5, pending: 0, expiringDays: 1, annualAllotment: 2 },
  { type: "paternity",  balance: 10, used: 0,  pending: 0, expiringDays: 0,  annualAllotment: 10 },
  { type: "bereavement",balance: 5,  used: 0,  pending: 0, expiringDays: 0,  annualAllotment: 5 },
  { type: "wfa",        balance: 18, used: 12, pending: 0, expiringDays: 0,  nextAccrualOn: "2026-06-01", annualAllotment: 30 },
];

/* ── Requests ── */

export interface LeaveRequest {
  id: string;
  type: LeaveTypeKey;
  startDate: string; // ISO date (no time)
  endDate: string;
  days: number;
  /** "FH" first half, "SH" second half, "FULL" or "HOURS" */
  granularity: "FULL" | "FH" | "SH" | "HOURS";
  status: RequestStatus;
  reason?: string;
  approverName?: string;
  approverInitials?: string;
  submittedOn: string;
  decidedOn?: string;
  /** True if this is a medical-leave request that may need a certificate. */
  needsCertificate?: boolean;
}

export const MY_REQUESTS: LeaveRequest[] = [
  { id: "lr-001", type: "privileged", startDate: "2026-05-22", endDate: "2026-05-23", days: 2, granularity: "FULL", status: "pending",
    reason: "Family wedding in Pune.", approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2026-05-08" },
  { id: "lr-002", type: "wfa",        startDate: "2026-06-02", endDate: "2026-06-06", days: 5, granularity: "FULL", status: "approved",
    reason: "Working from Goa.", approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2026-05-04", decidedOn: "2026-05-05" },
  { id: "lr-003", type: "sick",       startDate: "2026-04-21", endDate: "2026-04-22", days: 2, granularity: "FULL", status: "taken",
    approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2026-04-21", decidedOn: "2026-04-21", needsCertificate: false },
  { id: "lr-004", type: "casual",     startDate: "2026-03-14", endDate: "2026-03-14", days: 0.5, granularity: "FH", status: "taken",
    approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2026-03-12", decidedOn: "2026-03-13" },
  { id: "lr-005", type: "privileged", startDate: "2026-02-09", endDate: "2026-02-13", days: 5, granularity: "FULL", status: "taken",
    reason: "Annual trip to Manali.", approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2026-01-20", decidedOn: "2026-01-22" },
  { id: "lr-006", type: "privileged", startDate: "2026-01-22", endDate: "2026-01-22", days: 1, granularity: "FULL", status: "taken",
    approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2026-01-15", decidedOn: "2026-01-16" },
  { id: "lr-007", type: "compoff",    startDate: "2026-02-19", endDate: "2026-02-19", days: 0.5, granularity: "SH", status: "taken",
    approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2026-02-19", decidedOn: "2026-02-19" },
  { id: "lr-008", type: "wfa",        startDate: "2026-04-01", endDate: "2026-04-08", days: 6, granularity: "FULL", status: "taken",
    reason: "Quarterly remote sprint.", approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2026-03-15", decidedOn: "2026-03-16" },
  { id: "lr-009", type: "casual",     startDate: "2026-01-10", endDate: "2026-01-10", days: 1, granularity: "FULL", status: "taken",
    approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2026-01-08", decidedOn: "2026-01-09" },
  { id: "lr-010", type: "casual",     startDate: "2026-05-30", endDate: "2026-05-30", days: 1, granularity: "FULL", status: "rejected",
    reason: "Personal errand.", approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2026-05-09", decidedOn: "2026-05-10" },
  { id: "lr-011", type: "wfa",        startDate: "2026-03-05", endDate: "2026-03-09", days: 3, granularity: "FULL", status: "cancelled",
    reason: "Family visit — postponed.", approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2026-02-20", decidedOn: "2026-02-21" },

  /* 2025 history */
  { id: "lr-101", type: "privileged", startDate: "2025-12-22", endDate: "2025-12-31", days: 8, granularity: "FULL", status: "taken",
    reason: "Year-end break.", approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2025-11-10", decidedOn: "2025-11-11" },
  { id: "lr-102", type: "sick",       startDate: "2025-10-14", endDate: "2025-10-16", days: 3, granularity: "FULL", status: "taken",
    reason: "Dengue — certificate attached.", approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2025-10-14", decidedOn: "2025-10-14", needsCertificate: true },
  { id: "lr-103", type: "privileged", startDate: "2025-09-08", endDate: "2025-09-12", days: 5, granularity: "FULL", status: "taken",
    approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2025-08-15", decidedOn: "2025-08-16" },
  { id: "lr-104", type: "casual",     startDate: "2025-08-13", endDate: "2025-08-13", days: 0.5, granularity: "SH", status: "taken",
    approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2025-08-11", decidedOn: "2025-08-12" },
  { id: "lr-105", type: "wfa",        startDate: "2025-06-16", endDate: "2025-06-20", days: 5, granularity: "FULL", status: "taken",
    reason: "Working from Pondicherry.", approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2025-05-25", decidedOn: "2025-05-26" },
  { id: "lr-106", type: "sick",       startDate: "2025-04-02", endDate: "2025-04-02", days: 1, granularity: "FULL", status: "taken",
    approverName: "Meera Krishnan", approverInitials: "MK", submittedOn: "2025-04-02", decidedOn: "2025-04-02" },

  /* 2024 history (limited) */
  { id: "lr-201", type: "privileged", startDate: "2024-11-04", endDate: "2024-11-08", days: 5, granularity: "FULL", status: "taken",
    reason: "Diwali break.", approverName: "Rakesh Pillai", approverInitials: "RP", submittedOn: "2024-10-10", decidedOn: "2024-10-12" },
  { id: "lr-202", type: "casual",     startDate: "2024-07-19", endDate: "2024-07-19", days: 1, granularity: "FULL", status: "taken",
    approverName: "Rakesh Pillai", approverInitials: "RP", submittedOn: "2024-07-15", decidedOn: "2024-07-16" },
];

/* ── Per-request audit trail for the expanded row ── */

export type AuditEventKind = "created" | "edited" | "submitted" | "comment" | "approved" | "rejected" | "cancelled" | "withdraw_requested";

export interface AuditEvent {
  id: string;
  requestId: string;
  kind: AuditEventKind;
  actor: string;
  actorInitials: string;
  whenISO: string;
  whenLabel: string;
  note?: string;
}

export const AUDIT_BY_REQUEST: Record<string, AuditEvent[]> = {
  "lr-001": [
    { id: "ev-1-1", requestId: "lr-001", kind: "created",  actor: "Priya Singh",    actorInitials: "PS", whenISO: "2026-05-08T09:14:00", whenLabel: "May 8, 9:14 AM" },
    { id: "ev-1-2", requestId: "lr-001", kind: "submitted",actor: "Priya Singh",    actorInitials: "PS", whenISO: "2026-05-08T09:16:00", whenLabel: "May 8, 9:16 AM", note: "Family wedding in Pune." },
    { id: "ev-1-3", requestId: "lr-001", kind: "comment",  actor: "Meera Krishnan", actorInitials: "MK", whenISO: "2026-05-08T11:02:00", whenLabel: "May 8, 11:02 AM", note: "Will you be reachable for the launch checkin on the 23rd?" },
  ],
  "lr-002": [
    { id: "ev-2-1", requestId: "lr-002", kind: "created",  actor: "Priya Singh",    actorInitials: "PS", whenISO: "2026-05-04T15:20:00", whenLabel: "May 4, 3:20 PM" },
    { id: "ev-2-2", requestId: "lr-002", kind: "submitted",actor: "Priya Singh",    actorInitials: "PS", whenISO: "2026-05-04T15:22:00", whenLabel: "May 4, 3:22 PM", note: "Working from Goa." },
    { id: "ev-2-3", requestId: "lr-002", kind: "approved", actor: "Meera Krishnan", actorInitials: "MK", whenISO: "2026-05-05T10:11:00", whenLabel: "May 5, 10:11 AM", note: "Approved. Coverage with Karan." },
  ],
  "lr-010": [
    { id: "ev-10-1", requestId: "lr-010", kind: "created", actor: "Priya Singh",    actorInitials: "PS", whenISO: "2026-05-09T13:00:00", whenLabel: "May 9, 1:00 PM" },
    { id: "ev-10-2", requestId: "lr-010", kind: "submitted", actor: "Priya Singh",  actorInitials: "PS", whenISO: "2026-05-09T13:01:00", whenLabel: "May 9, 1:01 PM" },
    { id: "ev-10-3", requestId: "lr-010", kind: "rejected", actor: "Meera Krishnan",actorInitials: "MK", whenISO: "2026-05-10T08:45:00", whenLabel: "May 10, 8:45 AM", note: "Quarter close on the 30th — please try the week after." },
  ],
  "lr-011": [
    { id: "ev-11-1", requestId: "lr-011", kind: "created", actor: "Priya Singh", actorInitials: "PS", whenISO: "2026-02-20T11:30:00", whenLabel: "Feb 20, 11:30 AM" },
    { id: "ev-11-2", requestId: "lr-011", kind: "submitted", actor: "Priya Singh", actorInitials: "PS", whenISO: "2026-02-20T11:31:00", whenLabel: "Feb 20, 11:31 AM" },
    { id: "ev-11-3", requestId: "lr-011", kind: "approved", actor: "Meera Krishnan", actorInitials: "MK", whenISO: "2026-02-21T09:00:00", whenLabel: "Feb 21, 9:00 AM" },
    { id: "ev-11-4", requestId: "lr-011", kind: "cancelled", actor: "Priya Singh", actorInitials: "PS", whenISO: "2026-02-28T17:12:00", whenLabel: "Feb 28, 5:12 PM", note: "Trip postponed." },
  ],
};

/* ── Approver chain (manager → HR) ── */

export type ApproverStepStatus = "pending" | "approved" | "rejected" | "skipped" | "notified";

export interface ApproverStep {
  id: string;
  role: "Manager" | "HR";
  name: string;
  initials: string;
  avatarColor: string;
  status: ApproverStepStatus;
  /** ISO timestamp when this step's status was last updated. */
  whenISO?: string;
  whenLabel?: string;
  /** Note left when approving / rejecting. */
  note?: string;
}

/** Build a two-step chain (manager → HR) from a request's status + decided-on date. */
export function approverChainFor(request: LeaveRequest): ApproverStep[] {
  const managerName = request.approverName ?? "Meera Krishnan";
  const managerInitials = request.approverInitials ?? "MK";
  const managerDecidedAt = request.decidedOn;
  const managerLabel = managerDecidedAt
    ? new Date(managerDecidedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : undefined;

  let managerStatus: ApproverStepStatus = "pending";
  let hrStatus: ApproverStepStatus = "pending";
  let managerNote: string | undefined;

  switch (request.status) {
    case "draft":
    case "pending":
      managerStatus = "pending";
      hrStatus = "pending";
      break;
    case "approved":
    case "taken":
      managerStatus = "approved";
      hrStatus = "notified";
      managerNote = request.type === "sick" ? "Approved. Take care of yourself." : "Approved.";
      break;
    case "rejected":
      managerStatus = "rejected";
      hrStatus = "skipped";
      managerNote = "Conflicts with quarter close. Please try the week after.";
      break;
    case "cancelled":
      managerStatus = request.decidedOn ? "approved" : "skipped";
      hrStatus = managerStatus === "approved" ? "notified" : "skipped";
      managerNote = managerStatus === "approved" ? "Approved (later cancelled by employee)." : undefined;
      break;
  }

  return [
    {
      id: `${request.id}-mgr`,
      role: "Manager",
      name: managerName,
      initials: managerInitials,
      avatarColor: "bg-brand-purple",
      status: managerStatus,
      whenISO: managerStatus === "pending" ? undefined : managerDecidedAt,
      whenLabel: managerStatus === "pending" ? undefined : managerLabel,
      note: managerStatus === "approved" || managerStatus === "rejected" ? managerNote : undefined,
    },
    {
      id: `${request.id}-hr`,
      role: "HR",
      name: "Anjali Menon",
      initials: "AM",
      avatarColor: "bg-brand-teal",
      status: hrStatus,
      whenISO: hrStatus === "notified" ? managerDecidedAt : undefined,
      whenLabel: hrStatus === "notified" ? managerLabel : undefined,
    },
  ];
}

/* ── Comments thread ── */

export type CommentAuthorRole = "employee" | "manager" | "hr" | "system";

export interface LeaveComment {
  id: string;
  requestId: string;
  author: string;
  authorInitials: string;
  authorRole: CommentAuthorRole;
  whenISO: string;
  whenLabel: string;
  body: string;
}

export const COMMENTS_BY_REQUEST: Record<string, LeaveComment[]> = {
  "lr-001": [
    { id: "cm-1-1", requestId: "lr-001", author: "Meera Krishnan", authorInitials: "MK", authorRole: "manager", whenISO: "2026-05-08T11:02:00", whenLabel: "May 8, 11:02 AM",
      body: "Will you be reachable for the launch checkin on the 23rd? Otherwise we should move it to the 24th." },
    { id: "cm-1-2", requestId: "lr-001", author: "Priya Singh", authorInitials: "PS", authorRole: "employee", whenISO: "2026-05-08T11:48:00", whenLabel: "May 8, 11:48 AM",
      body: "I can join async via Slack — happy to send a written update Friday EOD." },
    { id: "cm-1-3", requestId: "lr-001", author: "Meera Krishnan", authorInitials: "MK", authorRole: "manager", whenISO: "2026-05-08T14:10:00", whenLabel: "May 8, 2:10 PM",
      body: "Works. I'll loop in Karan on the 23rd as backup." },
  ],
  "lr-102": [
    { id: "cm-102-1", requestId: "lr-102", author: "Anjali Menon", authorInitials: "AM", authorRole: "hr", whenISO: "2025-10-14T14:20:00", whenLabel: "Oct 14, 2:20 PM",
      body: "Got the certificate — recorded. Take care, no need to check Slack." },
  ],
};

/* ── Attachments ── */

export interface LeaveAttachment {
  id: string;
  requestId: string;
  filename: string;
  sizeKB: number;
  mime: string;
  uploadedOn: string;
}

export const ATTACHMENTS_BY_REQUEST: Record<string, LeaveAttachment[]> = {
  "lr-102": [
    { id: "att-1", requestId: "lr-102", filename: "medical-certificate-dengue.pdf", sizeKB: 144, mime: "application/pdf", uploadedOn: "2025-10-14" },
  ],
};

/** Default attachments derived from request flags. */
export function attachmentsFor(r: LeaveRequest): LeaveAttachment[] {
  const seeded = ATTACHMENTS_BY_REQUEST[r.id];
  if (seeded) return seeded;
  if (r.needsCertificate) {
    return [
      { id: `${r.id}-att`, requestId: r.id, filename: "medical-certificate.pdf", sizeKB: 144, mime: "application/pdf", uploadedOn: r.submittedOn },
    ];
  }
  return [];
}

/** Default audit trail for requests we didn't seed individually. */
export function defaultAudit(r: LeaveRequest): AuditEvent[] {
  const out: AuditEvent[] = [
    { id: `${r.id}-c`, requestId: r.id, kind: "created",   actor: "Priya Singh", actorInitials: "PS", whenISO: r.submittedOn, whenLabel: new Date(r.submittedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) },
    { id: `${r.id}-s`, requestId: r.id, kind: "submitted", actor: "Priya Singh", actorInitials: "PS", whenISO: r.submittedOn, whenLabel: new Date(r.submittedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), note: r.reason },
  ];
  if (r.decidedOn && (r.status === "approved" || r.status === "taken")) {
    out.push({ id: `${r.id}-a`, requestId: r.id, kind: "approved", actor: r.approverName ?? "—", actorInitials: r.approverInitials ?? "—", whenISO: r.decidedOn, whenLabel: new Date(r.decidedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) });
  }
  if (r.decidedOn && r.status === "rejected") {
    out.push({ id: `${r.id}-r`, requestId: r.id, kind: "rejected", actor: r.approverName ?? "—", actorInitials: r.approverInitials ?? "—", whenISO: r.decidedOn, whenLabel: new Date(r.decidedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) });
  }
  if (r.status === "cancelled" && r.decidedOn) {
    out.push({ id: `${r.id}-x`, requestId: r.id, kind: "cancelled", actor: "Priya Singh", actorInitials: "PS", whenISO: r.decidedOn, whenLabel: new Date(r.decidedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) });
  }
  return out;
}

/* ── Team out today/this week ── */

export interface TeammateOut {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  leaveType: LeaveTypeKey;
  /** "Today", "Mon", "Mon–Wed", etc. */
  whenLabel: string;
  /** "Out", "Half-day AM", "WFA — Bali" */
  modifier?: string;
}

export const TEAM_OUT_TODAY: TeammateOut[] = [
  { id: "t1", name: "Arjun Iyer",  initials: "AI", avatarColor: "bg-warning",      leaveType: "privileged", whenLabel: "Today",   modifier: "Out" },
  { id: "t2", name: "Sneha Rao",   initials: "SR", avatarColor: "bg-brand-purple", leaveType: "wfa",        whenLabel: "All week", modifier: "WFA — Bengaluru → Goa" },
  { id: "t3", name: "Vikram Shah", initials: "VS", avatarColor: "bg-success",      leaveType: "casual",     whenLabel: "Half day", modifier: "PM" },
];

export const TEAM_OUT_THIS_WEEK: TeammateOut[] = [
  ...TEAM_OUT_TODAY,
  { id: "t4", name: "Anjali Menon",  initials: "AM", avatarColor: "bg-brand-teal", leaveType: "privileged", whenLabel: "Thu–Fri",  modifier: "Out" },
  { id: "t5", name: "Rohan Gupta",   initials: "RG", avatarColor: "bg-destructive", leaveType: "sick",       whenLabel: "Fri",      modifier: "Sick" },
  { id: "t6", name: "Lakshmi Iyer",  initials: "LI", avatarColor: "bg-[#A3E635]",  leaveType: "wfa",        whenLabel: "Wed–Fri",  modifier: "WFA — Kerala" },
];

/* ── Team leaves (calendar) ── */

export interface TeamLeave {
  id: string;
  personId: string;
  personName: string;
  initials: string;
  avatarColor: string;
  type: LeaveTypeKey;
  startDate: string;
  endDate: string;
  /** Soft modifier for the avatar label tooltip. */
  note?: string;
}

export const TEAM_LEAVES: TeamLeave[] = [
  /* April */
  { id: "tl-001", personId: "t6", personName: "Lakshmi Iyer",  initials: "LI", avatarColor: "bg-[#A3E635]",   type: "wfa",        startDate: "2026-04-13", endDate: "2026-04-17", note: "Kerala" },
  { id: "tl-002", personId: "t1", personName: "Arjun Iyer",    initials: "AI", avatarColor: "bg-warning",     type: "privileged", startDate: "2026-04-20", endDate: "2026-04-21" },
  { id: "tl-003", personId: "t3", personName: "Vikram Shah",   initials: "VS", avatarColor: "bg-success",     type: "sick",       startDate: "2026-04-28", endDate: "2026-04-28" },

  /* May */
  { id: "tl-004", personId: "t1", personName: "Arjun Iyer",    initials: "AI", avatarColor: "bg-warning",     type: "privileged", startDate: "2026-05-11", endDate: "2026-05-11", note: "Out" },
  { id: "tl-005", personId: "t2", personName: "Sneha Rao",     initials: "SR", avatarColor: "bg-brand-purple",type: "wfa",        startDate: "2026-05-11", endDate: "2026-05-15", note: "Goa" },
  { id: "tl-006", personId: "t3", personName: "Vikram Shah",   initials: "VS", avatarColor: "bg-success",     type: "casual",     startDate: "2026-05-11", endDate: "2026-05-11", note: "Half-day PM" },
  { id: "tl-007", personId: "t4", personName: "Anjali Menon",  initials: "AM", avatarColor: "bg-brand-teal",  type: "privileged", startDate: "2026-05-14", endDate: "2026-05-15" },
  { id: "tl-008", personId: "t5", personName: "Rohan Gupta",   initials: "RG", avatarColor: "bg-destructive", type: "sick",       startDate: "2026-05-15", endDate: "2026-05-15" },
  { id: "tl-009", personId: "t6", personName: "Lakshmi Iyer",  initials: "LI", avatarColor: "bg-[#A3E635]",   type: "wfa",        startDate: "2026-05-13", endDate: "2026-05-15" },
  { id: "tl-010", personId: "t7", personName: "Karan Mehta",   initials: "KM", avatarColor: "bg-brand",       type: "privileged", startDate: "2026-05-28", endDate: "2026-05-29" },

  /* June */
  { id: "tl-011", personId: "t2", personName: "Sneha Rao",     initials: "SR", avatarColor: "bg-brand-purple",type: "privileged", startDate: "2026-06-08", endDate: "2026-06-12" },
  { id: "tl-012", personId: "t4", personName: "Anjali Menon",  initials: "AM", avatarColor: "bg-brand-teal",  type: "wfa",        startDate: "2026-06-15", endDate: "2026-06-19", note: "Pondicherry" },
  { id: "tl-013", personId: "t7", personName: "Karan Mehta",   initials: "KM", avatarColor: "bg-brand",       type: "casual",     startDate: "2026-06-22", endDate: "2026-06-22" },

  /* July */
  { id: "tl-014", personId: "t5", personName: "Rohan Gupta",   initials: "RG", avatarColor: "bg-destructive", type: "privileged", startDate: "2026-07-06", endDate: "2026-07-10" },
];

/* ── Team members (roster used by heatmap + report-detail) ── */

export type SubTeam = "Platform" | "Onboarding" | "Payments" | "Storage";
export type EmployeeRole =
  | "Senior Engineer"
  | "Engineer"
  | "Engineering Manager"
  | "Staff Engineer";

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: EmployeeRole;
  subTeam: SubTeam;
  /** Whether they're customer-facing (e.g. on-call rota). */
  isOnCall: boolean;
  /** Critical for product surfaces: customer-impacting if absent. */
  customerFacing: boolean;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "self", name: "Priya Singh",   initials: "PS", avatarColor: "bg-brand",         role: "Senior Engineer",     subTeam: "Onboarding", isOnCall: false, customerFacing: true },
  { id: "t1",   name: "Arjun Iyer",    initials: "AI", avatarColor: "bg-warning",       role: "Engineering Manager", subTeam: "Payments",   isOnCall: true,  customerFacing: true },
  { id: "t2",   name: "Sneha Rao",     initials: "SR", avatarColor: "bg-brand-purple",  role: "Senior Engineer",     subTeam: "Platform",   isOnCall: false, customerFacing: false },
  { id: "t3",   name: "Vikram Shah",   initials: "VS", avatarColor: "bg-success",       role: "Engineer",            subTeam: "Onboarding", isOnCall: true,  customerFacing: true },
  { id: "t4",   name: "Anjali Menon",  initials: "AM", avatarColor: "bg-brand-teal",    role: "Engineer",            subTeam: "Onboarding", isOnCall: false, customerFacing: true },
  { id: "t5",   name: "Rohan Gupta",   initials: "RG", avatarColor: "bg-destructive",   role: "Engineer",            subTeam: "Platform",   isOnCall: false, customerFacing: false },
  { id: "t6",   name: "Lakshmi Iyer",  initials: "LI", avatarColor: "bg-[#A3E635]",     role: "Staff Engineer",      subTeam: "Storage",    isOnCall: true,  customerFacing: false },
  { id: "t7",   name: "Karan Mehta",   initials: "KM", avatarColor: "bg-brand",         role: "Senior Engineer",     subTeam: "Onboarding", isOnCall: true,  customerFacing: true },
];

export const SUB_TEAMS: SubTeam[] = ["Platform", "Onboarding", "Payments", "Storage"];
export const EMPLOYEE_ROLES: EmployeeRole[] = ["Engineering Manager", "Staff Engineer", "Senior Engineer", "Engineer"];

export function findTeamMember(id: string): TeamMember | undefined {
  return TEAM_MEMBERS.find((m) => m.id === id);
}

/** Per-employee balance fixture (HR directory). */
export interface EmployeeBalances {
  employeeId: string;
  byType: { type: LeaveTypeKey; balance: number; used: number; annualAllotment: number }[];
}

export const BALANCES_BY_EMPLOYEE: Record<string, EmployeeBalances> = {
  self: { employeeId: "self", byType: [
    { type: "privileged", balance: 12, used: 8,  annualAllotment: 18 },
    { type: "sick",       balance: 9,  used: 3,  annualAllotment: 12 },
    { type: "casual",     balance: 2,  used: 4,  annualAllotment: 6 },
    { type: "wfa",        balance: 18, used: 12, annualAllotment: 30 },
  ]},
  t1: { employeeId: "t1", byType: [
    { type: "privileged", balance: 7,  used: 11, annualAllotment: 18 },
    { type: "sick",       balance: 11, used: 1,  annualAllotment: 12 },
    { type: "casual",     balance: 4,  used: 2,  annualAllotment: 6 },
    { type: "wfa",        balance: 24, used: 6,  annualAllotment: 30 },
  ]},
  t2: { employeeId: "t2", byType: [
    { type: "privileged", balance: 10, used: 8,  annualAllotment: 18 },
    { type: "sick",       balance: 12, used: 0,  annualAllotment: 12 },
    { type: "casual",     balance: 6,  used: 0,  annualAllotment: 6 },
    { type: "wfa",        balance: 18, used: 12, annualAllotment: 30 },
  ]},
  t3: { employeeId: "t3", byType: [
    { type: "privileged", balance: 12, used: 6,  annualAllotment: 18 },
    { type: "sick",       balance: 11, used: 1,  annualAllotment: 12 },
    { type: "casual",     balance: 3,  used: 3,  annualAllotment: 6 },
    { type: "wfa",        balance: 30, used: 0,  annualAllotment: 30 },
  ]},
  t4: { employeeId: "t4", byType: [
    { type: "privileged", balance: 10, used: 8,  annualAllotment: 18 },
    { type: "sick",       balance: 8,  used: 4,  annualAllotment: 12 },
    { type: "casual",     balance: 4,  used: 2,  annualAllotment: 6 },
    { type: "wfa",        balance: 30, used: 0,  annualAllotment: 30 },
  ]},
  t5: { employeeId: "t5", byType: [
    { type: "privileged", balance: 13, used: 5,  annualAllotment: 18 },
    { type: "sick",       balance: 6,  used: 6,  annualAllotment: 12 },
    { type: "casual",     balance: 3,  used: 3,  annualAllotment: 6 },
    { type: "wfa",        balance: 30, used: 0,  annualAllotment: 30 },
  ]},
  t6: { employeeId: "t6", byType: [
    { type: "privileged", balance: 13, used: 5,  annualAllotment: 18 },
    { type: "sick",       balance: 11, used: 1,  annualAllotment: 12 },
    { type: "casual",     balance: 6,  used: 0,  annualAllotment: 6 },
    { type: "wfa",        balance: 12, used: 18, annualAllotment: 30 },
  ]},
  t7: { employeeId: "t7", byType: [
    { type: "privileged", balance: 14, used: 4,  annualAllotment: 18 },
    { type: "sick",       balance: 10, used: 2,  annualAllotment: 12 },
    { type: "casual",     balance: 5,  used: 1,  annualAllotment: 6 },
    { type: "wfa",        balance: 30, used: 0,  annualAllotment: 30 },
  ]},
};

export function balancesFor(employeeId: string): EmployeeBalances | undefined {
  return BALANCES_BY_EMPLOYEE[employeeId];
}

/** Directory entry: a single team member with HR-relevant aggregates. */
export interface DirectoryEntry {
  member: TeamMember;
  balances: EmployeeBalances;
  ytdUsed: number;
  lastActivityLabel: string;
  /** Country code (assume India for the seeded team). */
  country: string;
}

export function buildDirectory(): DirectoryEntry[] {
  return TEAM_MEMBERS.map((m) => {
    const b = BALANCES_BY_EMPLOYEE[m.id] ?? BALANCES_BY_EMPLOYEE["self"];
    const ytdUsed = b.byType.reduce((s, x) => s + x.used, 0);
    // Try to pull the most recent activity from team or self requests.
    const candidates = [...TEAM_REQUESTS.filter((r) => r.employeeId === m.id)];
    if (m.id === "self") {
      candidates.push(...MY_REQUESTS.map((r) => ({
        id: r.id,
        employeeId: "self",
        employeeName: "Priya Singh",
        employeeInitials: "PS",
        employeeAvatar: "bg-brand",
        employeeTitle: "Senior Engineer",
        type: r.type,
        startDate: r.startDate,
        endDate: r.endDate,
        days: r.days,
        granularity: r.granularity,
        status: r.status,
        reason: r.reason,
        submittedOn: r.submittedOn,
        decidedOn: r.decidedOn,
      } as TeamRequest)));
    }
    const latest = candidates.sort((a, b2) => b2.submittedOn.localeCompare(a.submittedOn))[0];
    const lastActivityLabel = latest
      ? `${LEAVE_TYPE_MAP[latest.type].shortLabel} · ${new Date(latest.submittedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
      : "—";
    return {
      member: m,
      balances: b,
      ytdUsed,
      lastActivityLabel,
      country: "IN",
    };
  });
}

/* ── Capacity helpers (per-day team availability) ── */

export interface DayCapacity {
  iso: string;
  /** Teammates considered out (any leave overlapping this day). */
  outIds: string[];
  /** Total members considered in the cohort for this calculation. */
  total: number;
  /** % present (0–100). */
  pctPresent: number;
  /** True if a critical role drops below threshold. */
  criticalRoleBreached: boolean;
  /** Name of any critical role that fell below threshold. */
  breachedRole?: string;
}

export interface CapacityFilters {
  subTeam?: SubTeam | "all";
  role?: EmployeeRole | "all";
  /** When true, treat on-call rota as a critical role. */
  watchOnCall?: boolean;
}

const ON_CALL_MIN = 1; // at least 1 on-call eng must be in office
const CUSTOMER_FACING_MIN_PCT = 0.5;

/** Returns members matching the filters. */
export function filterTeam(members: TeamMember[], f: CapacityFilters): TeamMember[] {
  return members.filter((m) => {
    if (f.subTeam && f.subTeam !== "all" && m.subTeam !== f.subTeam) return false;
    if (f.role && f.role !== "all" && m.role !== f.role) return false;
    return true;
  });
}

/** True if a leave entry covers a given date. */
export function leaveCoversDate(l: { startDate: string; endDate: string }, iso: string): boolean {
  return l.startDate <= iso && l.endDate >= iso;
}

/**
 * Compute who's out from `team` on `iso` based on TEAM_LEAVES.
 * Pure function — call it for every day you want to colour.
 */
export function computeDayCapacity(
  iso: string,
  team: TeamMember[],
  leaves: { personId: string; startDate: string; endDate: string }[],
  filters: CapacityFilters = {},
): DayCapacity {
  const outIds = new Set<string>();
  for (const l of leaves) {
    if (leaveCoversDate(l, iso) && team.some((m) => m.id === l.personId)) outIds.add(l.personId);
  }
  const total = team.length;
  const present = Math.max(0, total - outIds.size);
  const pctPresent = total === 0 ? 100 : Math.round((present / total) * 100);

  // Critical role checks
  let criticalRoleBreached = false;
  let breachedRole: string | undefined;

  if (filters.watchOnCall) {
    const onCallTotal = team.filter((m) => m.isOnCall).length;
    const onCallOut = team.filter((m) => m.isOnCall && outIds.has(m.id)).length;
    const onCallPresent = onCallTotal - onCallOut;
    if (onCallTotal > 0 && onCallPresent < ON_CALL_MIN) {
      criticalRoleBreached = true;
      breachedRole = "On-call";
    }
  }

  const cfTotal = team.filter((m) => m.customerFacing).length;
  const cfOut = team.filter((m) => m.customerFacing && outIds.has(m.id)).length;
  if (cfTotal > 0 && (cfTotal - cfOut) / cfTotal < CUSTOMER_FACING_MIN_PCT && !criticalRoleBreached) {
    criticalRoleBreached = true;
    breachedRole = "Customer-facing";
  }

  return {
    iso,
    outIds: Array.from(outIds),
    total,
    pctPresent,
    criticalRoleBreached,
    breachedRole,
  };
}

/* ── Public holidays (India, FY26 Q2 sample) ── */

export interface PublicHoliday {
  date: string;
  name: string;
  region: string;
  /** "Optional" holidays employees can pick from. */
  optional?: boolean;
}

export const UPCOMING_HOLIDAYS: PublicHoliday[] = [
  { date: "2026-05-26", name: "Buddha Purnima",      region: "All India" },
  { date: "2026-06-17", name: "Eid al-Adha (Bakrid)",region: "All India" },
  { date: "2026-08-15", name: "Independence Day",    region: "All India" },
  { date: "2026-08-19", name: "Janmashtami",         region: "All India", optional: true },
  { date: "2026-08-27", name: "Onam",                region: "Kerala only", optional: true },
];

/* ── Smart suggestions from Planner / Wellbeing agents ── */

export type SuggestionKind = "planner" | "wellbeing" | "expiry" | "policy";

export interface AgentSuggestion {
  id: string;
  kind: SuggestionKind;
  source: string; // agent name
  title: string;
  body: string;
  /** Primary CTA. */
  primary: { label: string; intent: "request" | "view" | "plan" | "dismiss"; href?: string };
  /** Optional secondary CTA. */
  secondary?: { label: string; intent: "dismiss" | "snooze" };
}

export const SUGGESTIONS: AgentSuggestion[] = [
  {
    id: "sg1",
    kind: "wellbeing",
    source: "Wellbeing Agent",
    title: "You haven't taken time off in 4 months",
    body: "Your last full break was in Feb. Studies say a long weekend now beats a long break later. Want me to plan one around Buddha Purnima (May 26, Tue)?",
    primary: { label: "Plan a long weekend", intent: "plan" },
    secondary: { label: "Not now", intent: "snooze" },
  },
  {
    id: "sg2",
    kind: "expiry",
    source: "Planner Agent",
    title: "2 Casual Leave days will lapse on Dec 31",
    body: "You have 2 CL left and your team's quieter end of month. I can hold a tentative Fri–Mon slot you can confirm later.",
    primary: { label: "Hold a slot", intent: "plan" },
    secondary: { label: "Dismiss", intent: "dismiss" },
  },
  {
    id: "sg3",
    kind: "planner",
    source: "Planner Agent",
    title: "Bakrid (Jun 17) falls on a Wednesday",
    body: "Taking Mon–Tue or Thu–Fri turns it into a 5-day break. Both windows are clear in your team's calendar.",
    primary: { label: "See options", intent: "view" },
    secondary: { label: "Dismiss", intent: "dismiss" },
  },
];

/* ── Recent activity ── */

export type ActivityKind = "approved" | "submitted" | "balance" | "policy" | "cancelled" | "rejected";

export interface LeaveActivity {
  id: string;
  kind: ActivityKind;
  text: string;
  /** Relative time label like "2h ago", "Yesterday". */
  whenLabel: string;
}

export const RECENT_ACTIVITY: LeaveActivity[] = [
  { id: "a1", kind: "approved",  text: "Meera approved your WFA from Goa (Jun 2–6)", whenLabel: "Yesterday" },
  { id: "a2", kind: "balance",   text: "+1.5 PL credited (May accrual)",              whenLabel: "May 1" },
  { id: "a3", kind: "policy",    text: "Sick Leave policy updated — certificate now required from day 3 (was day 2)", whenLabel: "Apr 28" },
  { id: "a4", kind: "submitted", text: "You submitted Privileged Leave for May 22–23", whenLabel: "May 8" },
  { id: "a5", kind: "approved",  text: "Comp-Off credit added for working on Apr 14 (Ambedkar Jayanti)", whenLabel: "Apr 15" },
];

/* ── Policy checks for the conversational request preview ── */

export type CheckSeverity = "pass" | "warn" | "fail" | "info";

export interface PolicyCheck {
  id: string;
  /** Short headline like "Within probation rules". */
  label: string;
  /** Detail row visible on hover/expand. */
  detail: string;
  severity: CheckSeverity;
  /** Policy citation the Policy Explainer Agent would surface. */
  citation?: string;
  /** True if this is a hard block on submission. */
  blocking?: boolean;
}

const BASE_CHECKS: PolicyCheck[] = [
  { id: "probation",    label: "Within probation rules",         detail: "You completed probation on 14 Aug 2024 — all leave types unlocked.", severity: "pass", citation: "Policy §2.1" },
  { id: "balance",      label: "Sufficient balance",             detail: "Balance after this request stays above zero.", severity: "pass" },
  { id: "notice",       label: "Notice period met",              detail: "Submitted ≥ 3 working days in advance.", severity: "pass", citation: "Policy §3.2" },
  { id: "blackout",     label: "Not in blackout period",         detail: "No release-window or quarter-close blackout overlapping these dates.", severity: "pass", citation: "Policy §4.1" },
  { id: "coverage",     label: "Coverage available",             detail: "At least one peer engineer is online for your team.", severity: "pass" },
  { id: "documents",    label: "No supporting documents needed", detail: "Sick leaves under 3 consecutive days don't require a certificate.", severity: "pass", citation: "Policy §5.4" },
];

export function checksFor(type: LeaveTypeKey | undefined, opts: { days?: number; conflictsToday?: number } = {}): PolicyCheck[] {
  const out: PolicyCheck[] = BASE_CHECKS.map((c) => ({ ...c }));

  // Sick leave certificate rule
  if (type === "sick" && (opts.days ?? 0) >= 3) {
    const doc = out.find((c) => c.id === "documents");
    if (doc) {
      doc.label = "Medical certificate required";
      doc.detail = "Sick leave ≥ 3 consecutive days needs a certificate uploaded before HR final-approves.";
      doc.severity = "warn";
      doc.blocking = false;
    }
  }
  // Coverage flag if multiple teammates already out
  if ((opts.conflictsToday ?? 0) >= 2) {
    const cov = out.find((c) => c.id === "coverage");
    if (cov) {
      cov.label = `${opts.conflictsToday} other engineers already out`;
      cov.detail = "Aurora flagged this so you can confirm coverage with your manager.";
      cov.severity = "warn";
    }
  }
  // WFA in this slice always needs manager approval — surface as info
  if (type === "wfa") {
    out.push({
      id: "wfa-approval",
      label: "Manager approval required",
      detail: "Work-From-Anywhere requests need explicit manager sign-off (not just notification).",
      severity: "info",
      citation: "Policy §6.3",
    });
  }
  // Maternity special-case: not available to current user
  const t = LEAVE_TYPE_MAP[type ?? "privileged"];
  if (t && !t.available) {
    out.unshift({
      id: "not-eligible",
      label: `${t.label} not available`,
      detail: "This leave type isn't enabled for your current employment record.",
      severity: "fail",
      blocking: true,
    });
  }
  return out;
}

/* ── Coverage candidates the Coverage Agent might propose ── */

export interface CoverageCandidate {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  reason: string;
  /** Lower is better — agent picks the most rested teammate. */
  loadScore: number;
}

export const COVERAGE_CANDIDATES: CoverageCandidate[] = [
  { id: "c1", name: "Karan Mehta",   initials: "KM", avatarColor: "bg-brand",         reason: "Same project, light week ahead, on call rotation in 3 weeks.", loadScore: 2 },
  { id: "c2", name: "Devika Nair",   initials: "DN", avatarColor: "bg-brand-teal",    reason: "Owns the adjacent service; already covered for you in Feb.",   loadScore: 4 },
  { id: "c3", name: "Imran Hussain", initials: "IH", avatarColor: "bg-brand-purple",  reason: "Senior, but currently in a release crunch.",                    loadScore: 7 },
];

/* ── Holiday Negotiator: alternative window suggestions ── */

export interface AlternativeWindow {
  startDate: string;
  endDate: string;
  rationale: string;
}

/** Trivial stub: when there's a same-day conflict on the start, propose the next two windows. */
export function negotiateAlternatives(startISO: string): AlternativeWindow[] {
  const d = new Date(startISO);
  const plus = (n: number) => {
    const c = new Date(d);
    c.setDate(c.getDate() + n);
    return c.toISOString().slice(0, 10);
  };
  return [
    { startDate: plus(7), endDate: plus(7), rationale: "Same weekday next week — team's calendar is clear." },
    { startDate: plus(-2), endDate: plus(-2), rationale: "Two days earlier — fewer overlapping leaves." },
  ];
}

/* ── Co-Pilot recommendation (manager queue) ── */

export type CoPilotVerdict = "approve" | "review" | "block";

export interface CoPilotRec {
  verdict: CoPilotVerdict;
  /** Short label for the inline chip ("Approve — low impact"). */
  label: string;
  /** Sentence shown below the request when expanded. */
  rationale: string;
  /** Up to 2 facts the co-pilot cites. */
  facts: string[];
  /** 0–100. How confident the co-pilot is in its verdict. */
  confidence: number;
  /** 3–5 reasoning bullets surfaced on the detail page. */
  reasoning: string[];
  /** Suggested message to the employee. */
  suggestedMessage: string;
  /** One Manager Coach bias note (shown rarely). */
  coachNote?: string;
}

/* The co-pilot is intentionally rule-based: managers can guess what it will say
   from the facts alone. This makes the chip honest without an LLM. */
interface CoPilotContext {
  /** Other approved/pending requests overlapping the same range. */
  overlappingOnTeam: number;
  /** True if the request overlaps a known blackout window. */
  inBlackout: boolean;
  /** True if the type requires a certificate that's not attached. */
  missingCert: boolean;
}

const BLACKOUT_WINDOWS: { startISO: string; endISO: string; label: string }[] = [
  { startISO: "2026-06-27", endISO: "2026-07-01", label: "Quarter close" },
];

export function teamRequestContext(r: TeamRequest, otherRequests: TeamRequest[]): CoPilotContext {
  const overlapping = otherRequests.filter(
    (o) =>
      o.id !== r.id &&
      (o.status === "approved" || o.status === "pending") &&
      o.endDate >= r.startDate &&
      o.startDate <= r.endDate,
  ).length;
  const inBlackout = BLACKOUT_WINDOWS.some(
    (w) => w.endISO >= r.startDate && w.startISO <= r.endDate,
  );
  const missingCert = r.type === "sick" && r.days >= 3 && !r.needsCertificate ? true : false;
  return { overlappingOnTeam: overlapping, inBlackout, missingCert };
}

/** One-liner from the Manager Coach when we detect a pattern across requests. */
function coachNoteFor(r: TeamRequest, otherRequests: TeamRequest[]): string | undefined {
  // If most recent rejections are sick leave but most approvals are PL,
  // surface a gentle bias check.
  const decisions = otherRequests.filter(
    (o) => o.status === "approved" || o.status === "rejected",
  );
  const approvedPL = decisions.filter((o) => o.status === "approved" && o.type === "privileged").length;
  const rejectedSick = decisions.filter((o) => o.status === "rejected" && o.type === "sick").length;
  if (approvedPL >= 2 && rejectedSick >= 1 && r.type === "sick") {
    return "You approve PL faster than SL recently — worth confirming this isn't pattern bias.";
  }
  // If the same employee has 2+ rejections in the last 60 days, suggest a check-in.
  const recentReject = decisions.filter(
    (o) => o.employeeId === r.employeeId && o.status === "rejected",
  ).length;
  if (recentReject >= 2) {
    return `${r.employeeName.split(" ")[0]} has had multiple recent denials — consider a 1:1 to align on planning.`;
  }
  return undefined;
}

function suggestedMessageFor(
  r: TeamRequest,
  verdict: CoPilotVerdict,
  reasoning: string[],
): string {
  const first = r.employeeName.split(" ")[0];
  const dates =
    r.startDate === r.endDate
      ? new Date(r.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      : `${new Date(r.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}–${new Date(r.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
  if (verdict === "approve") {
    return `Hi ${first}, approved your leave for ${dates}. ${reasoning[0] ?? "Coverage looks fine."} Have a good break.`;
  }
  if (verdict === "review") {
    return `Hi ${first}, before I approve ${dates} — could you confirm ${reasoning[0]?.toLowerCase() ?? "the coverage plan"}? Happy to chat in our 1:1.`;
  }
  return `Hi ${first}, ${dates} overlaps a blackout window. Can we move this by a week? I'd like to keep your time off, just shifted.`;
}

export function recommendFor(r: TeamRequest, otherRequests: TeamRequest[]): CoPilotRec {
  const ctx = teamRequestContext(r, otherRequests);

  // Block first (hard policy)
  if (ctx.inBlackout) {
    const reasoning = [
      "Quarter-close blackout window (Jun 27 – Jul 1).",
      "Approving requires explicit HR sign-off per Policy §4.1.",
      "Suggest negotiating an alternative window the week after.",
    ];
    return {
      verdict: "block",
      label: "Block — blackout window",
      rationale: "This request overlaps a quarter-close blackout. Approving needs explicit HR sign-off.",
      facts: ["Quarter close: Jun 27 – Jul 1"],
      confidence: 95,
      reasoning,
      suggestedMessage: suggestedMessageFor(r, "block", reasoning),
      coachNote: coachNoteFor(r, otherRequests),
    };
  }

  // Review (soft flags)
  const reviewReasons: string[] = [];
  if (ctx.overlappingOnTeam >= 2) {
    reviewReasons.push(`${ctx.overlappingOnTeam} other engineers already out on these dates`);
  }
  if (r.days >= 5 && r.type === "privileged") {
    reviewReasons.push("5+ day break — confirm handover before approving");
  }
  if (r.type === "wfa" && r.days >= 5) {
    reviewReasons.push("Long WFA — confirm working hours overlap with team");
  }
  if (r.type === "sick" && r.days >= 3) {
    reviewReasons.push("Sick leave ≥ 3 days — medical certificate required");
  }
  if (reviewReasons.length > 0) {
    const reasoning: string[] = [];
    reasoning.push(reviewReasons[0]);
    if (reviewReasons[1]) reasoning.push(reviewReasons[1]);
    reasoning.push(`Notice period: submitted ${daysBetweenISO(r.submittedOn, r.startDate)} working days in advance.`);
    reasoning.push(
      ctx.overlappingOnTeam > 0
        ? `${ctx.overlappingOnTeam} teammate${ctx.overlappingOnTeam !== 1 ? "s" : ""} already out — verify coverage.`
        : "No other teammates already out.",
    );
    return {
      verdict: "review",
      label: `Review — ${reviewReasons[0].split(" — ")[0].split(" already")[0]}`,
      rationale: reviewReasons[0],
      facts: reviewReasons.slice(0, 2),
      confidence: 62,
      reasoning,
      suggestedMessage: suggestedMessageFor(r, "review", reasoning),
      coachNote: coachNoteFor(r, otherRequests),
    };
  }

  // Default: approve
  const reasoning = [
    ctx.overlappingOnTeam === 0
      ? `No coverage gap — ${r.type === "wfa" ? "WFA doesn't reduce availability" : "nobody else from your team is out these dates"}.`
      : `${ctx.overlappingOnTeam} teammate out — still within team norm.`,
    `Notice period: submitted ${daysBetweenISO(r.submittedOn, r.startDate)} working days in advance — comfortably above the 3-day minimum.`,
    `Balance is sufficient post-decision (${r.days} day${r.days !== 1 ? "s" : ""}).`,
    "No policy flags. No blackout overlap.",
    "Employee's recent leave pattern looks healthy — no clustering signals.",
  ];
  return {
    verdict: "approve",
    label: "Approve — low impact",
    rationale: "No conflicts on team calendar, balance is sufficient, no policy flags.",
    facts: [
      ctx.overlappingOnTeam === 0 ? "Nobody else out on these dates" : `${ctx.overlappingOnTeam} teammate out`,
      `${r.days} day${r.days !== 1 ? "s" : ""}`,
    ],
    confidence: 88,
    reasoning,
    suggestedMessage: suggestedMessageFor(r, "approve", reasoning),
    coachNote: coachNoteFor(r, otherRequests),
  };
}

function daysBetweenISO(aISO: string, bISO: string): number {
  const a = new Date(aISO);
  const b = new Date(bISO);
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}

/* ── Manager view: team-side requests + wellbeing + decisions log ── */

export const MANAGER_FIRST_NAME = "Raj";
export const MANAGER_FULL_NAME = "Raj Verma";
export const MANAGER_INITIALS = "RV";

export interface TeamRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  employeeAvatar: string;
  employeeTitle: string;
  type: LeaveTypeKey;
  startDate: string;
  endDate: string;
  days: number;
  granularity: "FULL" | "FH" | "SH" | "HOURS";
  status: RequestStatus;
  reason?: string;
  submittedOn: string;
  decidedOn?: string;
  needsCertificate?: boolean;
}

export const TEAM_REQUESTS: TeamRequest[] = [
  /* Pending — the manager's queue */
  { id: "tr-001", employeeId: "t7", employeeName: "Karan Mehta",   employeeInitials: "KM", employeeAvatar: "bg-brand",         employeeTitle: "Senior Engineer",
    type: "privileged", startDate: "2026-05-28", endDate: "2026-05-29", days: 2, granularity: "FULL", status: "pending",
    reason: "Sister's engagement in Jaipur.", submittedOn: "2026-05-09" },
  { id: "tr-002", employeeId: "t4", employeeName: "Anjali Menon",  employeeInitials: "AM", employeeAvatar: "bg-brand-teal",    employeeTitle: "Engineer",
    type: "sick",       startDate: "2026-05-12", endDate: "2026-05-14", days: 3, granularity: "FULL", status: "pending",
    reason: "Down with viral fever. Doctor recommended 3 days rest.", submittedOn: "2026-05-11", needsCertificate: true },
  { id: "tr-003", employeeId: "t6", employeeName: "Lakshmi Iyer",  employeeInitials: "LI", employeeAvatar: "bg-[#A3E635]",     employeeTitle: "Senior Engineer",
    type: "wfa",        startDate: "2026-05-25", endDate: "2026-05-29", days: 5, granularity: "FULL", status: "pending",
    reason: "Working from family home in Kochi.", submittedOn: "2026-05-10" },
  { id: "tr-004", employeeId: "t5", employeeName: "Rohan Gupta",   employeeInitials: "RG", employeeAvatar: "bg-destructive",   employeeTitle: "Engineer",
    type: "casual",     startDate: "2026-05-15", endDate: "2026-05-15", days: 0.5, granularity: "FH", status: "pending",
    reason: "Vehicle registration appointment.", submittedOn: "2026-05-11" },
  { id: "tr-005", employeeId: "t1", employeeName: "Arjun Iyer",    employeeInitials: "AI", employeeAvatar: "bg-warning",       employeeTitle: "Engineering Manager (peer)",
    type: "privileged", startDate: "2026-05-29", endDate: "2026-06-05", days: 6, granularity: "FULL", status: "pending",
    reason: "Family trip to Singapore (booked Jan).", submittedOn: "2026-05-08" },

  /* Recent decisions */
  { id: "tr-101", employeeId: "t2", employeeName: "Sneha Rao",     employeeInitials: "SR", employeeAvatar: "bg-brand-purple",  employeeTitle: "Senior Engineer",
    type: "wfa",        startDate: "2026-05-11", endDate: "2026-05-15", days: 5, granularity: "FULL", status: "approved",
    reason: "Working from Goa.", submittedOn: "2026-05-04", decidedOn: "2026-05-05" },
  { id: "tr-102", employeeId: "t3", employeeName: "Vikram Shah",   employeeInitials: "VS", employeeAvatar: "bg-success",       employeeTitle: "Engineer",
    type: "casual",     startDate: "2026-05-11", endDate: "2026-05-11", days: 0.5, granularity: "SH", status: "approved",
    submittedOn: "2026-05-08", decidedOn: "2026-05-08" },
  { id: "tr-103", employeeId: "t4", employeeName: "Anjali Menon",  employeeInitials: "AM", employeeAvatar: "bg-brand-teal",    employeeTitle: "Engineer",
    type: "casual",     startDate: "2026-04-30", endDate: "2026-04-30", days: 1, granularity: "FULL", status: "rejected",
    reason: "Personal errands.", submittedOn: "2026-04-28", decidedOn: "2026-04-29" },
];

/* ── Wellbeing signals ── */

export type WellbeingKind =
  | "no_leave_taken"
  | "sick_cluster"
  | "high_workload"
  | "back_to_back"
  | "weekend_bracketing";

export type WellbeingSeverity = "high" | "medium" | "low";

export interface WellbeingCitation {
  /** Short label shown as a chip. */
  label: string;
  /** Plain-language rationale rendered next to the chip. */
  rationale: string;
}

export interface WellbeingSignal {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  employeeAvatar: string;
  kind: WellbeingKind;
  /** Headline shown in the alert chip. */
  title: string;
  /** Body shown below. */
  body: string;
  /** Optional CTA — usually "Schedule 1:1" or "View pattern". */
  cta?: string;
  /** Severity drives sort and tint. */
  severity: WellbeingSeverity;
  /** Short citations the Wellbeing Agent surfaces. */
  citations: WellbeingCitation[];
  /** When the agent first detected this signal. */
  detectedAt: string;
}

export const WELLBEING_SIGNALS: WellbeingSignal[] = [
  {
    id: "wb-1", employeeId: "t7", employeeName: "Karan Mehta", employeeInitials: "KM", employeeAvatar: "bg-brand",
    kind: "no_leave_taken", severity: "high",
    title: "No PTO in 6 months",
    body: "Karan's last full break was in November. They have 11 PL days and 4 CL days unused.",
    cta: "Suggest leave",
    detectedAt: "2026-05-09T08:00:00",
    citations: [
      { label: "Last break: Nov 2025", rationale: "More than 180 days since last 2+ day break." },
      { label: "Unused balance: 15d", rationale: "11 PL + 4 CL days available; trending toward year-end pile-up." },
    ],
  },
  {
    id: "wb-2", employeeId: "t5", employeeName: "Rohan Gupta", employeeInitials: "RG", employeeAvatar: "bg-destructive",
    kind: "sick_cluster", severity: "high",
    title: "3 sick days in the last 30",
    body: "Rohan has taken 3 single-day sick leaves since April, all on Mondays. Worth a gentle check-in.",
    cta: "Schedule 1:1",
    detectedAt: "2026-05-10T08:00:00",
    citations: [
      { label: "Mondays: 3/3", rationale: "All recent sick days fell on Mondays — typical week-end recovery pattern." },
      { label: "Frequency rising", rationale: "1 sick day in March, 1 in April, 1 in May." },
    ],
  },
  {
    id: "wb-3", employeeId: "t3", employeeName: "Vikram Shah", employeeInitials: "VS", employeeAvatar: "bg-success",
    kind: "back_to_back", severity: "medium",
    title: "Three back-to-back release weeks",
    body: "Vikram has been on the release rotation 3 cycles in a row. Consider a rotation pause.",
    cta: "View load",
    detectedAt: "2026-05-08T08:00:00",
    citations: [
      { label: "Rotations: 3 cycles", rationale: "Apr 14, Apr 28, May 12 — no recovery week between." },
      { label: "Late-night activity", rationale: "Slack/Linear activity past 9 PM rose 35% over the period." },
    ],
  },
  {
    id: "wb-4", employeeId: "t4", employeeName: "Anjali Menon", employeeInitials: "AM", employeeAvatar: "bg-brand-teal",
    kind: "weekend_bracketing", severity: "medium",
    title: "Weekend-bracketing pattern",
    body: "Anjali has bracketed weekends 4 times in the last 2 months (Friday or Monday off). Could signal fatigue or schedule strain.",
    cta: "Share resources",
    detectedAt: "2026-05-11T08:00:00",
    citations: [
      { label: "4 bracket-days / 60d", rationale: "Above the team median of 1.2 per 60 days." },
      { label: "Half-days dominant", rationale: "3 of 4 are PM half-days on Fridays — short notice." },
    ],
  },
];

/* ── Team capacity sparkline (next 4 weeks) ── */

export interface CapacityPoint {
  weekStartISO: string;
  weekLabel: string;
  /** Effective headcount available (out of team size). */
  available: number;
  /** Team size (8 in the seed). */
  total: number;
  /** Days planned out across the team that week. */
  daysOut: number;
}

export const TEAM_CAPACITY_NEXT_4: CapacityPoint[] = [
  { weekStartISO: "2026-05-11", weekLabel: "May 11", available: 6.5, total: 8, daysOut: 7.5 },
  { weekStartISO: "2026-05-18", weekLabel: "May 18", available: 7,   total: 8, daysOut: 5   },
  { weekStartISO: "2026-05-25", weekLabel: "May 25", available: 5,   total: 8, daysOut: 15  },
  { weekStartISO: "2026-06-01", weekLabel: "Jun 1",  available: 6,   total: 8, daysOut: 10  },
];

/* ── Manager decisions log ── */

export interface DecisionLogEntry {
  id: string;
  /** Request id this decision is about. */
  requestId: string;
  employeeName: string;
  employeeInitials: string;
  employeeAvatar: string;
  decision: "approved" | "rejected";
  whenISO: string;
  whenLabel: string;
  summary: string;
  note?: string;
}

export const RECENT_DECISIONS: DecisionLogEntry[] = [
  { id: "dl-1", requestId: "tr-101", employeeName: "Sneha Rao",    employeeInitials: "SR", employeeAvatar: "bg-brand-purple", decision: "approved", whenISO: "2026-05-05T10:11:00", whenLabel: "May 5", summary: "WFA · May 11–15", note: "Approved. Coverage with Karan." },
  { id: "dl-2", requestId: "tr-102", employeeName: "Vikram Shah",  employeeInitials: "VS", employeeAvatar: "bg-success",      decision: "approved", whenISO: "2026-05-08T14:22:00", whenLabel: "May 8", summary: "CL half-day · May 11 PM" },
  { id: "dl-3", requestId: "tr-103", employeeName: "Anjali Menon", employeeInitials: "AM", employeeAvatar: "bg-brand-teal",   decision: "rejected", whenISO: "2026-04-29T09:00:00", whenLabel: "Apr 29", summary: "CL · Apr 30",                   note: "Quarter close that week — please retry the week after." },
];

/* ── Open work (mock Jira/Linear tickets keyed by teammate) ── */

export type WorkPriority = "P0" | "P1" | "P2" | "P3";
export type WorkState = "in_progress" | "review" | "blocked" | "done";

export interface WorkItem {
  id: string;
  title: string;
  priority: WorkPriority;
  state: WorkState;
  /** Due date ISO. */
  dueISO: string;
  /** External source for the link. */
  source: "JIRA" | "LINEAR";
}

export const OPEN_WORK_BY_EMPLOYEE: Record<string, WorkItem[]> = {
  t1: [ // Arjun Iyer
    { id: "ENG-1024", title: "Migrate payment service to gRPC", priority: "P1", state: "in_progress", dueISO: "2026-06-02", source: "JIRA" },
    { id: "ENG-1031", title: "Reduce checkout latency under 200ms", priority: "P0", state: "review",      dueISO: "2026-06-01", source: "JIRA" },
    { id: "ENG-1042", title: "Postmortem doc — May 4 outage",       priority: "P2", state: "in_progress", dueISO: "2026-05-30", source: "JIRA" },
  ],
  t4: [ // Anjali Menon
    { id: "ENG-1101", title: "Dashboard skeleton — feed module",    priority: "P1", state: "review",      dueISO: "2026-05-15", source: "JIRA" },
    { id: "ENG-1108", title: "Migrate to React 20 betas",           priority: "P2", state: "in_progress", dueISO: "2026-05-22", source: "JIRA" },
    { id: "ENG-1115", title: "Fix flaky test in CI for auth",       priority: "P1", state: "blocked",     dueISO: "2026-05-12", source: "JIRA" },
  ],
  t5: [ // Rohan Gupta
    { id: "LIN-432",  title: "Refactor leave-balance accrual job",  priority: "P1", state: "in_progress", dueISO: "2026-05-20", source: "LINEAR" },
    { id: "LIN-447",  title: "Investigate noisy alert: TPS dip",    priority: "P2", state: "in_progress", dueISO: "2026-05-18", source: "LINEAR" },
  ],
  t6: [ // Lakshmi Iyer
    { id: "ENG-1203", title: "Cassandra → ScyllaDB cutover plan",   priority: "P0", state: "review",      dueISO: "2026-05-27", source: "JIRA" },
    { id: "ENG-1212", title: "RFC: data retention v2",              priority: "P1", state: "in_progress", dueISO: "2026-06-04", source: "JIRA" },
    { id: "ENG-1218", title: "Pair with intern on profiling tools", priority: "P3", state: "in_progress", dueISO: "2026-05-29", source: "JIRA" },
  ],
  t7: [ // Karan Mehta
    { id: "ENG-1301", title: "Onboarding service v2 — design doc",  priority: "P1", state: "review",      dueISO: "2026-05-27", source: "JIRA" },
    { id: "ENG-1308", title: "Bug bash: assignments inbox",         priority: "P2", state: "in_progress", dueISO: "2026-05-26", source: "JIRA" },
    { id: "ENG-1315", title: "Add SLO dashboard for onboarding",    priority: "P2", state: "blocked",     dueISO: "2026-05-30", source: "JIRA" },
    { id: "ENG-1320", title: "Pair with Priya on coverage agent",   priority: "P3", state: "in_progress", dueISO: "2026-05-29", source: "JIRA" },
  ],
};

/* ── Business impact (per request: meetings, deliverables, on-call) ── */

export interface ImpactMeeting {
  id: string;
  title: string;
  whenISO: string;
  whenLabel: string;
  attendees: number;
}

export interface ImpactDeliverable {
  id: string;
  title: string;
  dueISO: string;
  dueLabel: string;
  /** What % of the deliverable this person owns. */
  ownership: number;
}

export interface ImpactOnCall {
  rotation: string;
  /** Whether the person is on the rota during the dates. */
  isOnCall: boolean;
  /** A backup teammate if a swap is needed. */
  backup?: string;
}

export interface BusinessImpact {
  meetings: ImpactMeeting[];
  deliverables: ImpactDeliverable[];
  onCall: ImpactOnCall | null;
}

export const IMPACT_BY_REQUEST: Record<string, BusinessImpact> = {
  "tr-001": {
    meetings: [
      { id: "m1", title: "Engineering all-hands",  whenISO: "2026-05-29T14:00:00", whenLabel: "Fri May 29, 2:00 PM", attendees: 28 },
      { id: "m2", title: "Onboarding service review", whenISO: "2026-05-28T11:00:00", whenLabel: "Thu May 28, 11:00 AM", attendees: 6 },
    ],
    deliverables: [
      { id: "d1", title: "Onboarding service v2 design doc", dueISO: "2026-05-27", dueLabel: "May 27 (day before leave)", ownership: 80 },
    ],
    onCall: { rotation: "Onboarding", isOnCall: false },
  },
  "tr-002": {
    meetings: [
      { id: "m1", title: "Feed module demo",       whenISO: "2026-05-13T15:30:00", whenLabel: "Wed May 13, 3:30 PM", attendees: 9 },
      { id: "m2", title: "Sprint retro",           whenISO: "2026-05-14T16:00:00", whenLabel: "Thu May 14, 4:00 PM", attendees: 8 },
    ],
    deliverables: [
      { id: "d1", title: "Auth flaky test fix", dueISO: "2026-05-12", dueLabel: "May 12 (day 1 of leave)", ownership: 100 },
    ],
    onCall: null,
  },
  "tr-003": {
    meetings: [
      { id: "m1", title: "ScyllaDB cutover dry run", whenISO: "2026-05-27T10:30:00", whenLabel: "Wed May 27, 10:30 AM", attendees: 5 },
    ],
    deliverables: [
      { id: "d1", title: "Cassandra → ScyllaDB cutover plan", dueISO: "2026-05-27", dueLabel: "May 27", ownership: 100 },
    ],
    onCall: { rotation: "Storage", isOnCall: true, backup: "Karan Mehta" },
  },
  "tr-004": {
    meetings: [
      { id: "m1", title: "1:1 with manager",       whenISO: "2026-05-15T11:00:00", whenLabel: "Fri May 15, 11:00 AM", attendees: 2 },
    ],
    deliverables: [],
    onCall: null,
  },
  "tr-005": {
    meetings: [
      { id: "m1", title: "Engineering all-hands",  whenISO: "2026-05-29T14:00:00", whenLabel: "Fri May 29, 2:00 PM", attendees: 28 },
      { id: "m2", title: "Postmortem review",      whenISO: "2026-06-01T10:00:00", whenLabel: "Mon Jun 1, 10:00 AM", attendees: 7 },
    ],
    deliverables: [
      { id: "d1", title: "Payment service gRPC migration", dueISO: "2026-06-02", dueLabel: "Jun 2 (during leave)", ownership: 100 },
      { id: "d2", title: "Checkout latency P0",           dueISO: "2026-06-01", dueLabel: "Jun 1 (during leave)", ownership: 60 },
    ],
    onCall: { rotation: "Payments", isOnCall: true, backup: "Devika Nair" },
  },
};

/* Default impact for requests we didn't seed individually. */
export function impactFor(r: TeamRequest): BusinessImpact {
  return IMPACT_BY_REQUEST[r.id] ?? { meetings: [], deliverables: [], onCall: null };
}

/* ── Employee 12-month leave history (manager view, per teammate) ── */

export interface HistoryStrip {
  /** Days taken, by type, in the last 12 months. */
  byType: { type: LeaveTypeKey; days: number }[];
  /** Per-month total days taken, oldest first (12 entries). */
  monthly: { monthLabel: string; days: number }[];
  /** Plain-language summary line. */
  summary: string;
}

export const HISTORY_BY_EMPLOYEE: Record<string, HistoryStrip> = {
  t7: { // Karan Mehta
    byType: [
      { type: "privileged", days: 4 },
      { type: "sick", days: 2 },
      { type: "casual", days: 1 },
    ],
    monthly: [
      { monthLabel: "Jun", days: 0 }, { monthLabel: "Jul", days: 0 }, { monthLabel: "Aug", days: 2 },
      { monthLabel: "Sep", days: 0 }, { monthLabel: "Oct", days: 0 }, { monthLabel: "Nov", days: 4 },
      { monthLabel: "Dec", days: 0 }, { monthLabel: "Jan", days: 1 }, { monthLabel: "Feb", days: 0 },
      { monthLabel: "Mar", days: 0 }, { monthLabel: "Apr", days: 0 }, { monthLabel: "May", days: 0 },
    ],
    summary: "7 days taken in the last 12 months — last full break was in November.",
  },
  t4: { // Anjali Menon
    byType: [
      { type: "privileged", days: 8 },
      { type: "sick", days: 4 },
      { type: "casual", days: 2 },
    ],
    monthly: [
      { monthLabel: "Jun", days: 1 }, { monthLabel: "Jul", days: 0 }, { monthLabel: "Aug", days: 1 },
      { monthLabel: "Sep", days: 4 }, { monthLabel: "Oct", days: 2 }, { monthLabel: "Nov", days: 0 },
      { monthLabel: "Dec", days: 3 }, { monthLabel: "Jan", days: 0 }, { monthLabel: "Feb", days: 1 },
      { monthLabel: "Mar", days: 1 }, { monthLabel: "Apr", days: 1 }, { monthLabel: "May", days: 0 },
    ],
    summary: "14 days taken in the last 12 months — consistent usage across types.",
  },
  t6: { // Lakshmi Iyer
    byType: [
      { type: "privileged", days: 5 },
      { type: "wfa", days: 18 },
      { type: "sick", days: 1 },
    ],
    monthly: [
      { monthLabel: "Jun", days: 5 }, { monthLabel: "Jul", days: 0 }, { monthLabel: "Aug", days: 2 },
      { monthLabel: "Sep", days: 0 }, { monthLabel: "Oct", days: 4 }, { monthLabel: "Nov", days: 0 },
      { monthLabel: "Dec", days: 0 }, { monthLabel: "Jan", days: 3 }, { monthLabel: "Feb", days: 5 },
      { monthLabel: "Mar", days: 0 }, { monthLabel: "Apr", days: 5 }, { monthLabel: "May", days: 0 },
    ],
    summary: "24 days taken in the last 12 months — heavy WFA usage, lightly distributed PL.",
  },
  t5: { // Rohan Gupta
    byType: [
      { type: "sick", days: 6 },
      { type: "casual", days: 3 },
      { type: "privileged", days: 5 },
    ],
    monthly: [
      { monthLabel: "Jun", days: 0 }, { monthLabel: "Jul", days: 2 }, { monthLabel: "Aug", days: 1 },
      { monthLabel: "Sep", days: 0 }, { monthLabel: "Oct", days: 1 }, { monthLabel: "Nov", days: 0 },
      { monthLabel: "Dec", days: 5 }, { monthLabel: "Jan", days: 0 }, { monthLabel: "Feb", days: 1 },
      { monthLabel: "Mar", days: 1 }, { monthLabel: "Apr", days: 1 }, { monthLabel: "May", days: 2 },
    ],
    summary: "14 days taken in the last 12 months — sick-day clusters on Mondays in Q2.",
  },
  t1: { // Arjun Iyer
    byType: [
      { type: "privileged", days: 11 },
      { type: "wfa", days: 6 },
      { type: "casual", days: 2 },
    ],
    monthly: [
      { monthLabel: "Jun", days: 0 }, { monthLabel: "Jul", days: 0 }, { monthLabel: "Aug", days: 3 },
      { monthLabel: "Sep", days: 6 }, { monthLabel: "Oct", days: 0 }, { monthLabel: "Nov", days: 1 },
      { monthLabel: "Dec", days: 5 }, { monthLabel: "Jan", days: 0 }, { monthLabel: "Feb", days: 2 },
      { monthLabel: "Mar", days: 0 }, { monthLabel: "Apr", days: 2 }, { monthLabel: "May", days: 0 },
    ],
    summary: "19 days taken in the last 12 months — pre-planned and well-spread.",
  },
};

export function historyFor(employeeId: string): HistoryStrip | undefined {
  return HISTORY_BY_EMPLOYEE[employeeId];
}

/* ── Direct-Report Detail patterns (manager-only) ── */

export interface WeekdayDistribution {
  /** Day-of-week buckets, Mon..Sun (0..6). Each entry: # of sick days that fell on that DOW. */
  sickByDow: number[];
  /** True if the manager-coach considers this pattern noteworthy. */
  patternNote?: string;
}

export interface NoticeSample {
  /** Working days between submitted and start. Negative = same-day. */
  daysOfNotice: number;
  type: LeaveTypeKey;
}

export interface ReportPattern {
  weekday: WeekdayDistribution;
  /** Up to 12 most recent samples of advance-notice. */
  notice: NoticeSample[];
}

export const PATTERNS_BY_EMPLOYEE: Record<string, ReportPattern> = {
  t7: { // Karan Mehta
    weekday: {
      sickByDow: [0, 1, 0, 0, 0, 0, 1],
      patternNote: "Sick days mostly fall on Mondays — worth a gentle check-in.",
    },
    notice: [
      { daysOfNotice: 19, type: "privileged" },
      { daysOfNotice: 7,  type: "casual" },
      { daysOfNotice: 14, type: "privileged" },
      { daysOfNotice: 0,  type: "sick" },
      { daysOfNotice: 21, type: "wfa" },
      { daysOfNotice: 10, type: "compoff" },
    ],
  },
  t4: { // Anjali Menon
    weekday: {
      sickByDow: [0, 1, 1, 0, 1, 0, 1],
    },
    notice: [
      { daysOfNotice: 30, type: "privileged" },
      { daysOfNotice: 14, type: "privileged" },
      { daysOfNotice: 3,  type: "casual" },
      { daysOfNotice: 0,  type: "sick" },
      { daysOfNotice: 1,  type: "sick" },
      { daysOfNotice: 0,  type: "sick" },
      { daysOfNotice: 12, type: "wfa" },
    ],
  },
  t5: { // Rohan Gupta
    weekday: {
      sickByDow: [3, 0, 0, 0, 0, 0, 3],
      patternNote: "All 6 sick days landed on Mondays — likely week-end recovery pattern.",
    },
    notice: [
      { daysOfNotice: 0,  type: "sick" },
      { daysOfNotice: 0,  type: "sick" },
      { daysOfNotice: 0,  type: "sick" },
      { daysOfNotice: 2,  type: "casual" },
      { daysOfNotice: 14, type: "privileged" },
    ],
  },
  t6: { // Lakshmi Iyer
    weekday: {
      sickByDow: [0, 0, 0, 0, 0, 0, 1],
    },
    notice: [
      { daysOfNotice: 28, type: "wfa" },
      { daysOfNotice: 21, type: "wfa" },
      { daysOfNotice: 30, type: "privileged" },
      { daysOfNotice: 21, type: "wfa" },
      { daysOfNotice: 7,  type: "compoff" },
    ],
  },
  t1: { // Arjun Iyer
    weekday: {
      sickByDow: [0, 0, 1, 0, 0, 0, 0],
    },
    notice: [
      { daysOfNotice: 45, type: "privileged" },
      { daysOfNotice: 30, type: "privileged" },
      { daysOfNotice: 14, type: "wfa" },
      { daysOfNotice: 21, type: "wfa" },
      { daysOfNotice: 3,  type: "casual" },
    ],
  },
};

export function patternFor(employeeId: string): ReportPattern | undefined {
  return PATTERNS_BY_EMPLOYEE[employeeId];
}

/* ── Delegation (manager-out routing) ── */

export interface DelegatePeer {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  /** Currently-pending count on their queue. Used to detect overload. */
  currentLoad: number;
  /** True if they're themselves out during the manager's delegation window. */
  outDuringWindow?: boolean;
}

export const DELEGATE_CANDIDATES: DelegatePeer[] = [
  { id: "d-arjun",     name: "Arjun Iyer",     initials: "AI", avatarColor: "bg-warning",      role: "Engineering Manager · Payments",   currentLoad: 2 },
  { id: "d-sneha",     name: "Sneha Rao",      initials: "SR", avatarColor: "bg-brand-purple", role: "Engineering Manager · Platform",   currentLoad: 1 },
  { id: "d-lakshmi",   name: "Lakshmi Iyer",   initials: "LI", avatarColor: "bg-[#A3E635]",    role: "Engineering Manager · Storage",    currentLoad: 0, outDuringWindow: true },
  { id: "d-anand",     name: "Anand Krishnan", initials: "AK", avatarColor: "bg-brand-teal",   role: "Director of Engineering (skip-level)", currentLoad: 5 },
];

/** Returns the canonical skip-level escalation candidate. */
export function defaultEscalationPeer(): DelegatePeer {
  return DELEGATE_CANDIDATES.find((c) => c.role.includes("Director")) ?? DELEGATE_CANDIDATES[0];
}

/** Threshold above which a peer is considered "overloaded" for escalation rule. */
export const PEER_OVERLOAD_THRESHOLD = 3;

/* ── Report helpers (Manager Reports page) ── */

export interface AbsencePoint {
  /** ISO date for the first of the month. */
  monthISO: string;
  monthLabel: string;
  /** Days lost across the team in the month. */
  daysLost: number;
  /** Working days available across the team for that month. */
  workingDaysAvail: number;
}

/* Six months of synthetic team absenteeism, oldest first. */
export const ABSENCE_LAST_6_MONTHS: AbsencePoint[] = [
  { monthISO: "2025-12-01", monthLabel: "Dec", daysLost: 28, workingDaysAvail: 184 },
  { monthISO: "2026-01-01", monthLabel: "Jan", daysLost: 14, workingDaysAvail: 168 },
  { monthISO: "2026-02-01", monthLabel: "Feb", daysLost: 12, workingDaysAvail: 152 },
  { monthISO: "2026-03-01", monthLabel: "Mar", daysLost: 22, workingDaysAvail: 184 },
  { monthISO: "2026-04-01", monthLabel: "Apr", daysLost: 18, workingDaysAvail: 176 },
  { monthISO: "2026-05-01", monthLabel: "May", daysLost: 24, workingDaysAvail: 176 },
];

/** Bradford Factor sample per direct report (synthetic but realistic). */
export interface BradfordEntry {
  employeeId: string;
  employeeName: string;
  initials: string;
  avatarColor: string;
  /** Spells of unplanned absence (sick instances). */
  spells: number;
  /** Total days of unplanned absence in the period. */
  totalDays: number;
  /** Bradford Factor = S² × D. */
  score: number;
  /** Band: green ≤50, amber 51–199, red ≥200. */
  band: "green" | "amber" | "red";
  /** Brief explanation surfaced as a tooltip / detail. */
  note: string;
}

function bandFor(score: number): BradfordEntry["band"] {
  if (score >= 200) return "red";
  if (score > 50) return "amber";
  return "green";
}

function bradford(name: string, employeeId: string, initials: string, avatarColor: string, spells: number, totalDays: number, note: string): BradfordEntry {
  const score = spells * spells * totalDays;
  return { employeeId, employeeName: name, initials, avatarColor, spells, totalDays, score, band: bandFor(score), note };
}

export const BRADFORD_LAST_12_MONTHS: BradfordEntry[] = [
  bradford("Karan Mehta",   "t7", "KM", "bg-brand",         2, 2, "2 single-day sick spells; both planned-ahead."),
  bradford("Rohan Gupta",   "t5", "RG", "bg-destructive",   3, 3, "3 Monday-shaped sick spells in last 30 days."),
  bradford("Anjali Menon",  "t4", "AM", "bg-brand-teal",    4, 4, "Frequent short absences plus weekend-bracketing."),
  bradford("Vikram Shah",   "t3", "VS", "bg-success",       1, 1, "Single sick day."),
  bradford("Sneha Rao",     "t2", "SR", "bg-brand-purple",  0, 0, "No unplanned absences in the period."),
  bradford("Lakshmi Iyer",  "t6", "LI", "bg-[#A3E635]",     1, 1, "Single sick day."),
  bradford("Arjun Iyer",    "t1", "AI", "bg-warning",       1, 1, "Single sick day."),
];

/** Team-wide leave distribution by type, in the last 12 months. */
export interface DistributionPoint {
  type: LeaveTypeKey;
  days: number;
}

export const DISTRIBUTION_BY_TYPE: DistributionPoint[] = [
  { type: "privileged", days: 56 },
  { type: "wfa",        days: 42 },
  { type: "sick",       days: 17 },
  { type: "casual",     days: 13 },
  { type: "compoff",    days: 4 },
];

/** Per-employee total days in the last 12 months. */
export interface DistributionByEmployee {
  employeeId: string;
  employeeName: string;
  initials: string;
  avatarColor: string;
  byType: { type: LeaveTypeKey; days: number }[];
  total: number;
}

const distEntry = (
  employeeId: string,
  employeeName: string,
  initials: string,
  avatarColor: string,
  byType: { type: LeaveTypeKey; days: number }[],
): DistributionByEmployee => ({
  employeeId,
  employeeName,
  initials,
  avatarColor,
  byType,
  total: byType.reduce((s, b) => s + b.days, 0),
});

export const DISTRIBUTION_BY_EMPLOYEE: DistributionByEmployee[] = [
  distEntry("t1", "Arjun Iyer",   "AI", "bg-warning",      [{ type: "privileged", days: 11 }, { type: "wfa", days: 6 }, { type: "casual", days: 2 }]),
  distEntry("t2", "Sneha Rao",    "SR", "bg-brand-purple", [{ type: "privileged", days: 8 },  { type: "wfa", days: 12 }]),
  distEntry("t3", "Vikram Shah",  "VS", "bg-success",      [{ type: "privileged", days: 6 },  { type: "casual", days: 3 }, { type: "sick", days: 1 }]),
  distEntry("t4", "Anjali Menon", "AM", "bg-brand-teal",   [{ type: "privileged", days: 8 },  { type: "sick", days: 4 }, { type: "casual", days: 2 }]),
  distEntry("t5", "Rohan Gupta",  "RG", "bg-destructive",  [{ type: "privileged", days: 5 },  { type: "sick", days: 6 }, { type: "casual", days: 3 }]),
  distEntry("t6", "Lakshmi Iyer", "LI", "bg-[#A3E635]",    [{ type: "wfa", days: 18 },         { type: "privileged", days: 5 }, { type: "sick", days: 1 }]),
  distEntry("t7", "Karan Mehta",  "KM", "bg-brand",        [{ type: "privileged", days: 4 },  { type: "sick", days: 2 }, { type: "casual", days: 1 }]),
];

/* All notice samples across the team (for the team-wide advance-notice histogram on Reports). */
export const TEAM_NOTICE_SAMPLES: NoticeSample[] = Object.values(PATTERNS_BY_EMPLOYEE)
  .flatMap((p) => p.notice);

/* ──────────────────────────────────────────────────────────────────
   HR / People Ops cockpit data
   ────────────────────────────────────────────────────────────────── */

export const HR_FIRST_NAME = "Anita";
export const HR_FULL_NAME = "Anita Sharma";

/* ── KPIs (org-wide) ── */

export interface HrKpi {
  /** Stable id for keys + ARIA. */
  id: string;
  label: string;
  /** Rendered value (already formatted). */
  value: string;
  /** Optional helper line. */
  sub?: string;
  /** Optional trend: positive number = up MoM, negative = down. Display only. */
  deltaPct?: number;
  /** Drill-down target. */
  href?: string;
  /** Token (success/warning/destructive/brand) for the icon tint. */
  tone: "success" | "warning" | "destructive" | "brand" | "neutral";
  /** Whether the trend direction is good or bad for this KPI. */
  trendDirection?: "good" | "bad";
}

export const HR_KPIS: HrKpi[] = [
  { id: "ot",  label: "On leave today",      value: "23",      sub: "of 412 employees",      tone: "brand",       href: "/leave/calendar" },
  { id: "ow",  label: "On leave this week",  value: "61",      sub: "across all sub-teams",  tone: "neutral" },
  { id: "ll",  label: "Leave liability",     value: "₹4.1 Cr", sub: "accrued, unused balance", deltaPct: 3.2,   trendDirection: "bad", tone: "warning",   href: "/leave/hr/reports/liability" },
  { id: "ul",  label: "Upcoming long leaves", value: "8",      sub: "≥ 10 days, next 60 days", tone: "neutral" },
  { id: "pa",  label: "Pending approvals",   value: "37",      sub: "org-wide, 6 over SLA",   tone: "destructive", deltaPct: -8, trendDirection: "good", href: "/leave/hr/requests?status=pending" },
  { id: "an",  label: "Anomalies flagged",   value: "5",       sub: "by Anomaly Agent",       tone: "warning",     href: "/leave/hr/anomalies" },
];

/* ── Country tiles ── */

export type ComplianceBand = "green" | "amber" | "red";

export interface CountryTile {
  code: string;
  name: string;
  flag: string;
  headcount: number;
  onLeaveToday: number;
  compliance: ComplianceBand;
  /** Plain-language status line. */
  status: string;
}

export const HR_COUNTRIES: CountryTile[] = [
  { code: "IN", name: "India",      flag: "🇮🇳", headcount: 312, onLeaveToday: 18, compliance: "green", status: "Up to date · POSH refresh done Mar 2026" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", headcount: 42,  onLeaveToday: 2,  compliance: "amber", status: "SMP rate update pending HR sign-off" },
  { code: "US", name: "United States", flag: "🇺🇸", headcount: 33,  onLeaveToday: 1,  compliance: "green", status: "FMLA tracking on schedule" },
  { code: "SG", name: "Singapore",  flag: "🇸🇬", headcount: 17,  onLeaveToday: 1,  compliance: "green", status: "MOM annual filing submitted" },
  { code: "DE", name: "Germany",    flag: "🇩🇪", headcount: 8,   onLeaveToday: 1,  compliance: "red",   status: "Works council consultation overdue (-9d)" },
];

/* ── Trends (leave volume by type, last 6 months) ── */

export interface LeaveTrendPoint {
  monthISO: string;
  monthLabel: string;
  /** Days by type for that month, org-wide. */
  byType: { type: LeaveTypeKey; days: number }[];
}

export const LEAVE_TRENDS_6M: LeaveTrendPoint[] = [
  { monthISO: "2025-12-01", monthLabel: "Dec",
    byType: [{ type: "privileged", days: 280 }, { type: "sick", days: 95 }, { type: "casual", days: 88 }, { type: "wfa", days: 140 }, { type: "compoff", days: 18 }] },
  { monthISO: "2026-01-01", monthLabel: "Jan",
    byType: [{ type: "privileged", days: 95 }, { type: "sick", days: 78 }, { type: "casual", days: 72 }, { type: "wfa", days: 120 }, { type: "compoff", days: 10 }] },
  { monthISO: "2026-02-01", monthLabel: "Feb",
    byType: [{ type: "privileged", days: 102 }, { type: "sick", days: 64 }, { type: "casual", days: 60 }, { type: "wfa", days: 110 }, { type: "compoff", days: 8 }] },
  { monthISO: "2026-03-01", monthLabel: "Mar",
    byType: [{ type: "privileged", days: 144 }, { type: "sick", days: 78 }, { type: "casual", days: 70 }, { type: "wfa", days: 132 }, { type: "compoff", days: 12 }] },
  { monthISO: "2026-04-01", monthLabel: "Apr",
    byType: [{ type: "privileged", days: 130 }, { type: "sick", days: 88 }, { type: "casual", days: 68 }, { type: "wfa", days: 138 }, { type: "compoff", days: 11 }] },
  { monthISO: "2026-05-01", monthLabel: "May",
    byType: [{ type: "privileged", days: 168 }, { type: "sick", days: 102 }, { type: "casual", days: 64 }, { type: "wfa", days: 152 }, { type: "compoff", days: 14 }] },
];

/* ── Anomalies ── */

export type AnomalySeverity = "high" | "medium" | "low";

export type AnomalyKind = "manager_dismissals" | "statutory_update" | "policy_violation" | "balance_cliff" | "data_drift";

export interface AnomalyChartPoint {
  /** Short label for the x-axis bar. */
  label: string;
  /** Numeric value for this row. */
  value: number;
  /** Optional highlight (renders the bar in the destructive tone). */
  highlight?: boolean;
}

export interface AnomalyPeerComparison {
  /** Aggregate label, e.g. "Team median". */
  label: string;
  /** The subject's value, formatted for display. */
  subjectValue: string;
  /** The peer baseline value, formatted for display. */
  peerValue: string;
  /** Ratio used to render the comparison bar (0..1 where 1 = subject is at peer level). */
  ratio: number;
  /** True if subject's value is *better* than peer (e.g., lower sick days). */
  subjectIsBetter?: boolean;
}

export interface Anomaly {
  id: string;
  kind: AnomalyKind;
  severity: AnomalySeverity;
  title: string;
  detail: string;
  /** Plain-language source for the chip ("Anomaly Agent · Compliance Watchdog"). */
  source: string;
  /** Optional drill-down link. */
  href?: string;
  detectedAt: string;
  /** Optional CTA label. */
  cta?: string;
  /** Subject of the anomaly (single employee or cohort). */
  subject?: {
    kind: "employee" | "cohort";
    id?: string;
    name: string;
    initials?: string;
    avatarColor?: string;
  };
  /** Mini pattern chart data shown on the detail. */
  chart?: { title: string; points: AnomalyChartPoint[] };
  /** Peer comparison row(s). */
  peerComparison?: AnomalyPeerComparison[];
  /** 0–100 confidence in the detection. */
  confidence?: number;
  /** Plain-language reasoning bullets. */
  reasoning?: string[];
  /** Suggested next step (manager 1:1, FMLA outreach, no action). */
  suggestedNextStep?: { label: string; rationale: string; tone: "brand" | "warning" | "success" | "neutral" };
}

export const SEEDED_ANOMALIES: Anomaly[] = [
  {
    id: "an-1", kind: "statutory_update", severity: "high",
    source: "Compliance Watchdog",
    title: "UK Statutory Maternity Pay rate updated",
    detail: "HMRC updated SMP standard rate to £187.18/week effective 6 Apr 2026. 3 active maternity cases will roll forward at the new rate.",
    detectedAt: "2026-05-10T09:30:00",
    href: "/leave/hr/compliance",
    cta: "Review affected cases",
    subject: { kind: "cohort", name: "UK · 3 maternity cases" },
    confidence: 99,
    reasoning: [
      "HMRC public announcement parsed on 10 May.",
      "3 active SMP cases on file (Sophie Lin, Hannah Becker, Lina Martens).",
      "All three are within the standard-rate window; weekly amount needs recalc.",
    ],
    suggestedNextStep: {
      label: "Recalculate three cases & notify payroll",
      rationale: "No employee-facing impact if updated before next pay cycle (29 May).",
      tone: "brand",
    },
  },
  {
    id: "an-2", kind: "policy_violation", severity: "medium",
    source: "Anomaly Agent",
    title: "4 sick leaves ≥ 3 days without medical certificate",
    detail: "Policy §5.4 requires cert from day 3. 4 requests in the last 30 days are missing it. Approvers should request it before close-out.",
    detectedAt: "2026-05-09T11:15:00",
    href: "/leave/manager",
    cta: "View list",
    subject: { kind: "cohort", name: "4 sick-leave cases" },
    confidence: 88,
    chart: {
      title: "Sick-leave length (days) — missing cert highlighted",
      points: [
        { label: "Case A", value: 3, highlight: true },
        { label: "Case B", value: 4, highlight: true },
        { label: "Case C", value: 3, highlight: true },
        { label: "Case D", value: 5, highlight: true },
      ],
    },
    peerComparison: [
      { label: "Cert-on-file rate (team)", subjectValue: "0%",  peerValue: "94%", ratio: 0,    subjectIsBetter: false },
    ],
    reasoning: [
      "All 4 cases have entries in Sick-leave but no certificate attachment on file.",
      "Policy §5.4 requires medical certificate from day 3 of any sick leave.",
      "Approvers may not have flagged this at approval — Policy Explainer can prompt them next time.",
    ],
    suggestedNextStep: {
      label: "Trigger cert-request nudges to all 4 employees",
      rationale: "Automated nudge from Aurora; reduces manager workload.",
      tone: "brand",
    },
  },
  {
    id: "an-3", kind: "balance_cliff", severity: "low",
    source: "Anomaly Agent",
    title: "31 employees risk losing CL on Dec 31",
    detail: "Casual Leave doesn't carry forward. 31 people sit at 4–6 unused days with 7 months left.",
    detectedAt: "2026-05-08T16:45:00",
    cta: "See exposure",
    subject: { kind: "cohort", name: "31 employees · India" },
    confidence: 95,
    chart: {
      title: "CL balance distribution (India cohort)",
      points: [
        { label: "0d", value: 12 },
        { label: "1d", value: 18 },
        { label: "2d", value: 22 },
        { label: "3d", value: 41 },
        { label: "4d", value: 31, highlight: true },
        { label: "5d", value: 22, highlight: true },
        { label: "6d", value: 9,  highlight: true },
      ],
    },
    suggestedNextStep: {
      label: "Enable auto-nudge for affected cohort",
      rationale: "Aurora can prompt employees to plan a CL day; no manager involvement needed.",
      tone: "brand",
    },
  },
  {
    id: "an-4", kind: "policy_violation", severity: "high",
    source: "Anomaly Agent",
    title: "Rohan Gupta — sick-day clustering on Mondays",
    detail: "8 of last 10 sick days have fallen on a Monday or first working day after a long weekend.",
    detectedAt: "2026-05-09T08:00:00",
    subject: { kind: "employee", id: "t5", name: "Rohan Gupta", initials: "RG", avatarColor: "bg-destructive" },
    confidence: 76,
    chart: {
      title: "Sick days by weekday — last 12 months",
      points: [
        { label: "Mon", value: 8, highlight: true },
        { label: "Tue", value: 1 },
        { label: "Wed", value: 0 },
        { label: "Thu", value: 0 },
        { label: "Fri", value: 1 },
        { label: "Sat", value: 0 },
        { label: "Sun", value: 0 },
      ],
    },
    peerComparison: [
      { label: "Sick days on Mondays (team median)", subjectValue: "8",  peerValue: "1", ratio: 1,   subjectIsBetter: false },
      { label: "Total sick days YTD (team median)",   subjectValue: "6", peerValue: "3", ratio: 0.5, subjectIsBetter: false },
    ],
    reasoning: [
      "Mondays carry 80% of the employee's sick-day load — well above team median (16%).",
      "Pattern correlates with weekends. Could indicate fatigue or weekend activity carry-over.",
      "Not a policy violation on its own — present as a wellbeing concern, not an accusation.",
    ],
    suggestedNextStep: {
      label: "Suggest manager 1:1 (private)",
      rationale: "Surface the pattern as a wellbeing concern, not a performance issue. The manager already has a Wellbeing Alert open for this signal.",
      tone: "warning",
    },
  },
  {
    id: "an-5", kind: "manager_dismissals", severity: "medium",
    source: "Anomaly Agent",
    title: "Manager A dismissed 4 wellbeing signals in 30 days",
    detail: "Above the cohort median (1 / 30 days). Worth a check-in with the manager on intent and patterns.",
    detectedAt: "2026-05-07T14:20:00",
    subject: { kind: "employee", name: "Raj Verma", initials: "RV", avatarColor: "bg-warning" },
    confidence: 62,
    peerComparison: [
      { label: "Dismissals per 30 days (manager median)", subjectValue: "4", peerValue: "1", ratio: 1, subjectIsBetter: false },
    ],
    reasoning: [
      "Sample size is small — 4 dismissals over 30 days isn't statistically severe yet.",
      "Reasons (when given) suggest pattern was situational, not systemic.",
      "Useful to surface, but treat as soft signal.",
    ],
    suggestedNextStep: {
      label: "No immediate action",
      rationale: "Monitor; if dismissals continue at this rate over 60 days, escalate to manager's manager.",
      tone: "neutral",
    },
  },
  {
    id: "an-6", kind: "data_drift", severity: "low",
    source: "Anomaly Agent",
    title: "Probation-period employees taking sick leave 2x team rate",
    detail: "Probationary employees took 1.8 sick days/employee in last 30d vs 0.9 baseline. Sample size is small — flag for awareness.",
    detectedAt: "2026-05-05T10:00:00",
    subject: { kind: "cohort", name: "11 probationary employees" },
    confidence: 54,
    peerComparison: [
      { label: "Sick days per employee (last 30d)", subjectValue: "1.8", peerValue: "0.9", ratio: 1, subjectIsBetter: false },
    ],
    suggestedNextStep: {
      label: "No action — monitor",
      rationale: "11-employee sample is too small for statistical confidence. Re-check at 60 days.",
      tone: "neutral",
    },
  },
];

/* ── Agent activity stream ── */

export interface AgentActivity {
  id: string;
  agent: string;
  /** Short colour token: brand / brand-purple / brand-teal / success / warning / destructive */
  tone: "brand" | "brand-purple" | "brand-teal" | "success" | "warning" | "destructive";
  whenLabel: string;
  whenISO: string;
  message: string;
}

export const HR_AGENT_STREAM: AgentActivity[] = [
  { id: "as-1",  agent: "Approval Co-Pilot",     tone: "brand",        whenLabel: "1m ago",  whenISO: "2026-05-11T11:32:00", message: "Recommended approve for 14 requests today (12 accepted, 2 reviewed)." },
  { id: "as-2",  agent: "Compliance Watchdog",   tone: "warning",      whenLabel: "8m ago",  whenISO: "2026-05-11T11:25:00", message: "Detected UK SMP rate update — flagged 3 affected maternity cases." },
  { id: "as-3",  agent: "Wellbeing Agent",       tone: "destructive",  whenLabel: "22m ago", whenISO: "2026-05-11T11:11:00", message: "Surfaced new signal for Rohan Gupta (sick cluster, Mondays)." },
  { id: "as-4",  agent: "Holiday Negotiator",    tone: "brand-purple", whenLabel: "34m ago", whenISO: "2026-05-11T10:59:00", message: "Proposed alternative dates for 2 conflicting requests in the Onboarding team." },
  { id: "as-5",  agent: "Policy Explainer",      tone: "brand-teal",   whenLabel: "1h ago",  whenISO: "2026-05-11T10:33:00", message: "Cited Policy §3.2 in 7 manager approval reviews." },
  { id: "as-6",  agent: "Planner Agent",         tone: "brand",        whenLabel: "1h ago",  whenISO: "2026-05-11T10:20:00", message: "Drafted long-weekend suggestion around Buddha Purnima for 84 employees." },
  { id: "as-7",  agent: "Coverage Agent",        tone: "brand-teal",   whenLabel: "2h ago",  whenISO: "2026-05-11T09:48:00", message: "Suggested Karan Mehta as delegate for 5 manager-out windows." },
  { id: "as-8",  agent: "Manager Coach",         tone: "warning",      whenLabel: "3h ago",  whenISO: "2026-05-11T08:50:00", message: "Surfaced bias-check note to 2 managers (PL/SL approval-time gap)." },
  { id: "as-9",  agent: "Approval Co-Pilot",     tone: "brand",        whenLabel: "4h ago",  whenISO: "2026-05-11T07:55:00", message: "Auto-routed 9 approvals during managers' delegation windows." },
  { id: "as-10", agent: "Compliance Watchdog",   tone: "success",      whenLabel: "5h ago",  whenISO: "2026-05-11T06:30:00", message: "Verified India POSH refresh records for Q1 — all clear." },
  { id: "as-11", agent: "Wellbeing Agent",       tone: "destructive",  whenLabel: "Yesterday", whenISO: "2026-05-10T18:00:00", message: "Marked 1 weekend-bracketing pattern as medium severity for Anjali Menon." },
  { id: "as-12", agent: "Anomaly Agent",         tone: "warning",      whenLabel: "Yesterday", whenISO: "2026-05-10T17:14:00", message: "31 employees flagged for end-of-year CL balance cliff." },
  { id: "as-13", agent: "Holiday Negotiator",    tone: "brand-purple", whenLabel: "Yesterday", whenISO: "2026-05-10T14:30:00", message: "Generated bridge-day options for 3 teams around the Aug 15 holiday cluster." },
  { id: "as-14", agent: "Planner Agent",         tone: "brand",        whenLabel: "Yesterday", whenISO: "2026-05-10T11:08:00", message: "Reminded 7 employees of upcoming optional holiday selection (Janmashtami)." },
  { id: "as-15", agent: "Policy Explainer",      tone: "brand-teal",   whenLabel: "2 days ago", whenISO: "2026-05-09T16:50:00", message: "Drafted plain-language summary of updated sick-leave certificate rule (Policy §5.4)." },
];

/* ── Needs your attention ── */

export type AttentionKind = "cert_expiring" | "statutory_deadline" | "policy_review_due" | "anomaly_spike" | "balance_cliff";

export interface AttentionItem {
  id: string;
  kind: AttentionKind;
  title: string;
  detail: string;
  dueLabel: string;
  /** Severity drives tint. */
  severity: AnomalySeverity;
  href?: string;
  cta: string;
}

export const HR_ATTENTION: AttentionItem[] = [
  {
    id: "at-1", kind: "statutory_deadline", severity: "high",
    title: "POSH annual report due in 12 days",
    detail: "India — submission to Internal Complaints Committee chair required by 31 May 2026.",
    dueLabel: "Due 31 May", cta: "Open template",
  },
  {
    id: "at-2", kind: "cert_expiring", severity: "medium",
    title: "3 medical certificates expire this week",
    detail: "Sick-leave certs over their 30-day retention window — confirm before purging.",
    dueLabel: "This week", cta: "Review",
    href: "/leave/manager",
  },
  {
    id: "at-3", kind: "policy_review_due", severity: "medium",
    title: "WFA policy 12-month review due",
    detail: "Policy was published Jun 2025 — review with leadership and refresh team-by-team override list.",
    dueLabel: "Due 4 Jun", cta: "Schedule review",
    href: "/leave/policies",
  },
  {
    id: "at-4", kind: "anomaly_spike", severity: "low",
    title: "Sick-leave volume up 16% MoM",
    detail: "Engineering and Customer Support carry most of the increase. May be flu season — keep monitoring.",
    dueLabel: "Investigate", cta: "Open trends",
  },
  {
    id: "at-5", kind: "balance_cliff", severity: "low",
    title: "31 employees risk year-end CL forfeit",
    detail: "Casual Leave doesn't carry forward. Auto-nudge can be enabled for affected employees.",
    dueLabel: "By Dec 1", cta: "Enable nudges",
  },
];

/* ──────────────────────────────────────────────────────────────────
   Org-wide requests (HR inbox)
   ────────────────────────────────────────────────────────────────── */

export type OrgRequestSource = "self" | "team" | "org";

export interface OrgRequest {
  id: string;
  source: OrgRequestSource;
  /** Country ISO code (matches HR_COUNTRIES.code). */
  country: string;
  subTeam: SubTeam;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  employeeAvatar: string;
  employeeTitle: string;
  /** Person currently expected to decide. */
  approverName: string;
  approverInitials: string;
  type: LeaveTypeKey;
  startDate: string;
  endDate: string;
  days: number;
  granularity: "FULL" | "FH" | "SH" | "HOURS";
  status: RequestStatus;
  reason?: string;
  submittedOn: string;
  decidedOn?: string;
  /** Days the request has been pending past the SLA target (4 working days). */
  overSlaBy?: number;
}

/* Seeded ~15 org-wide requests across 5 countries + 4 sub-teams. */
export const ORG_REQUESTS: OrgRequest[] = [
  /* India · already engaged through Manager Home + Priya */
  { id: "or-001", source: "org", country: "IN", subTeam: "Onboarding", employeeId: "in-rahul", employeeName: "Rahul Pillai",   employeeInitials: "RP", employeeAvatar: "bg-warning",      employeeTitle: "Engineer",            approverName: "Raj Verma",    approverInitials: "RV", type: "privileged", startDate: "2026-05-20", endDate: "2026-05-23", days: 4, granularity: "FULL", status: "pending",  reason: "Cousin's wedding in Kochi.",         submittedOn: "2026-05-04", overSlaBy: 2 },
  { id: "or-002", source: "org", country: "IN", subTeam: "Platform",   employeeId: "in-divya", employeeName: "Divya Krishnan", employeeInitials: "DK", employeeAvatar: "bg-brand-purple", employeeTitle: "Senior Engineer",     approverName: "Arjun Iyer",   approverInitials: "AI", type: "sick",       startDate: "2026-05-12", endDate: "2026-05-13", days: 2, granularity: "FULL", status: "approved", submittedOn: "2026-05-12",  decidedOn: "2026-05-12" },
  { id: "or-003", source: "org", country: "IN", subTeam: "Storage",    employeeId: "in-suresh",employeeName: "Suresh Iyer",    employeeInitials: "SI", employeeAvatar: "bg-[#A3E635]",    employeeTitle: "Staff Engineer",      approverName: "Anand Krishnan",approverInitials:"AK",type: "wfa",        startDate: "2026-05-26", endDate: "2026-06-06", days: 10,granularity: "FULL", status: "pending",  reason: "Working from family home in Cherthala.", submittedOn: "2026-05-08", overSlaBy: 0 },
  { id: "or-004", source: "org", country: "IN", subTeam: "Payments",   employeeId: "in-meera", employeeName: "Meera Sundaram", employeeInitials: "MS", employeeAvatar: "bg-brand-teal",   employeeTitle: "Senior Engineer",     approverName: "Arjun Iyer",   approverInitials: "AI", type: "casual",     startDate: "2026-05-19", endDate: "2026-05-19", days: 1, granularity: "FULL", status: "pending",  submittedOn: "2026-05-11", overSlaBy: 0 },
  { id: "or-005", source: "org", country: "IN", subTeam: "Onboarding", employeeId: "in-deepak",employeeName: "Deepak Reddy",   employeeInitials: "DR", employeeAvatar: "bg-success",      employeeTitle: "Engineering Manager", approverName: "Anand Krishnan",approverInitials:"AK",type: "privileged", startDate: "2026-06-15", endDate: "2026-06-26", days: 10,granularity: "FULL", status: "pending",  reason: "Family trip to Bali.",               submittedOn: "2026-05-02", overSlaBy: 7 },

  /* UK */
  { id: "or-010", source: "org", country: "UK", subTeam: "Platform",   employeeId: "uk-emma",  employeeName: "Emma Whitfield",  employeeInitials: "EW", employeeAvatar: "bg-brand-purple", employeeTitle: "Senior Engineer",  approverName: "James Cole",   approverInitials: "JC", type: "privileged", startDate: "2026-07-13", endDate: "2026-07-24", days: 10,granularity: "FULL", status: "approved", submittedOn: "2026-04-22", decidedOn: "2026-04-23" },
  { id: "or-011", source: "org", country: "UK", subTeam: "Payments",   employeeId: "uk-oliver",employeeName: "Oliver Patel",    employeeInitials: "OP", employeeAvatar: "bg-warning",      employeeTitle: "Engineer",         approverName: "James Cole",   approverInitials: "JC", type: "sick",       startDate: "2026-05-08", endDate: "2026-05-12", days: 3, granularity: "FULL", status: "pending",  reason: "Flu, GP cert attached.",            submittedOn: "2026-05-08", overSlaBy: 1 },
  { id: "or-012", source: "org", country: "UK", subTeam: "Storage",    employeeId: "uk-sophie",employeeName: "Sophie Lin",      employeeInitials: "SL", employeeAvatar: "bg-brand-teal",   employeeTitle: "Senior Engineer",  approverName: "James Cole",   approverInitials: "JC", type: "maternity",  startDate: "2026-06-01", endDate: "2026-12-01", days: 130,granularity:"FULL", status: "approved", submittedOn: "2026-03-15", decidedOn: "2026-03-18" },

  /* US */
  { id: "or-020", source: "org", country: "US", subTeam: "Onboarding", employeeId: "us-jordan",employeeName: "Jordan Reyes",    employeeInitials: "JR", employeeAvatar: "bg-success",      employeeTitle: "Senior Engineer",  approverName: "Lena Park",    approverInitials: "LP", type: "privileged", startDate: "2026-05-26", endDate: "2026-05-30", days: 5, granularity: "FULL", status: "pending",  reason: "Memorial Day weekend extension.",    submittedOn: "2026-05-06", overSlaBy: 0 },
  { id: "or-021", source: "org", country: "US", subTeam: "Platform",   employeeId: "us-taylor",employeeName: "Taylor Brooks",   employeeInitials: "TB", employeeAvatar: "bg-brand",        employeeTitle: "Engineer",         approverName: "Lena Park",    approverInitials: "LP", type: "sick",       startDate: "2026-05-07", endDate: "2026-05-07", days: 1, granularity: "FULL", status: "taken",    submittedOn: "2026-05-07",   decidedOn: "2026-05-07" },
  { id: "or-022", source: "org", country: "US", subTeam: "Payments",   employeeId: "us-morgan",employeeName: "Morgan Lee",      employeeInitials: "ML", employeeAvatar: "bg-destructive",  employeeTitle: "Engineering Manager", approverName: "Anand Krishnan", approverInitials:"AK", type: "privileged", startDate: "2026-06-30", endDate: "2026-07-04", days: 5, granularity: "FULL", status: "rejected", reason: "Quarter close week — please retry.", submittedOn: "2026-05-01", decidedOn: "2026-05-02" },

  /* Singapore */
  { id: "or-030", source: "org", country: "SG", subTeam: "Storage",    employeeId: "sg-wei",   employeeName: "Wei Min Tan",     employeeInitials: "WT", employeeAvatar: "bg-brand-purple", employeeTitle: "Staff Engineer",   approverName: "Anand Krishnan", approverInitials:"AK", type: "privileged", startDate: "2026-06-09", endDate: "2026-06-13", days: 5, granularity: "FULL", status: "pending",  reason: "Family time in Penang.",            submittedOn: "2026-05-09", overSlaBy: 0 },
  { id: "or-031", source: "org", country: "SG", subTeam: "Platform",   employeeId: "sg-aisha", employeeName: "Aisha Bte Rahman", employeeInitials:"AR", employeeAvatar: "bg-[#A3E635]",    employeeTitle: "Senior Engineer",  approverName: "Anand Krishnan", approverInitials:"AK", type: "casual",     startDate: "2026-05-14", endDate: "2026-05-14", days: 0.5,granularity:"FH",   status: "approved", submittedOn: "2026-05-12", decidedOn: "2026-05-13" },

  /* Germany */
  { id: "or-040", source: "org", country: "DE", subTeam: "Payments",   employeeId: "de-lukas", employeeName: "Lukas Bauer",      employeeInitials: "LB", employeeAvatar: "bg-warning",      employeeTitle: "Engineer",         approverName: "Hannah Becker", approverInitials:"HB", type: "privileged", startDate: "2026-07-06", endDate: "2026-07-31", days: 20,granularity: "FULL", status: "pending",  reason: "Sommerurlaub — family trip.",        submittedOn: "2026-04-25", overSlaBy: 11 },
  { id: "or-041", source: "org", country: "DE", subTeam: "Platform",   employeeId: "de-mia",   employeeName: "Mia Hoffmann",     employeeInitials: "MH", employeeAvatar: "bg-success",      employeeTitle: "Senior Engineer",  approverName: "Hannah Becker", approverInitials:"HB", type: "sick",       startDate: "2026-05-11", endDate: "2026-05-11", days: 1, granularity: "FULL", status: "taken",    submittedOn: "2026-05-11",  decidedOn: "2026-05-11" },
];

/* Helper: convert MY_REQUESTS + TEAM_REQUESTS into the unified OrgRequest shape. */
export function asOrgRequests(): OrgRequest[] {
  const fromTeam: OrgRequest[] = TEAM_REQUESTS.map((r) => ({
    id: r.id,
    source: "team",
    country: "IN",
    subTeam: "Onboarding",
    employeeId: r.employeeId,
    employeeName: r.employeeName,
    employeeInitials: r.employeeInitials,
    employeeAvatar: r.employeeAvatar,
    employeeTitle: r.employeeTitle,
    approverName: "Raj Verma",
    approverInitials: "RV",
    type: r.type,
    startDate: r.startDate,
    endDate: r.endDate,
    days: r.days,
    granularity: r.granularity,
    status: r.status,
    reason: r.reason,
    submittedOn: r.submittedOn,
    decidedOn: r.decidedOn,
  }));

  const fromSelf: OrgRequest[] = MY_REQUESTS.map((r) => ({
    id: r.id,
    source: "self",
    country: "IN",
    subTeam: "Onboarding",
    employeeId: "self",
    employeeName: "Priya Singh",
    employeeInitials: "PS",
    employeeAvatar: "bg-brand",
    employeeTitle: "Senior Engineer",
    approverName: r.approverName ?? "Meera Krishnan",
    approverInitials: r.approverInitials ?? "MK",
    type: r.type,
    startDate: r.startDate,
    endDate: r.endDate,
    days: r.days,
    granularity: r.granularity,
    status: r.status,
    reason: r.reason,
    submittedOn: r.submittedOn,
    decidedOn: r.decidedOn,
  }));

  return [...fromSelf, ...fromTeam, ...ORG_REQUESTS];
}

/* ──────────────────────────────────────────────────────────────────
   Agent Control Center seed
   ────────────────────────────────────────────────────────────────── */

export type AgentId =
  | "intake"
  | "policy_explainer"
  | "approval_copilot"
  | "coverage"
  | "wellbeing"
  | "compliance_watchdog"
  | "anomaly"
  | "planner"
  | "re_entry"
  | "holiday_negotiator"
  | "manager_coach";

export type AgentAutonomyLevel = "off" | "suggest" | "act_with_confirm" | "autonomous";

export interface AgentScope {
  /** Cohorts: 'all_employees', country codes, sub-team labels, etc. */
  cohorts: string[];
}

export interface AgentSeed {
  id: AgentId;
  name: string;
  purpose: string;
  defaultStatus: boolean;
  defaultAutonomy: AgentAutonomyLevel;
  defaultScope: AgentScope;
  /** Tone for the card icon. */
  tone: "brand" | "brand-purple" | "brand-teal" | "success" | "warning" | "destructive";
  /** Last 7 days: per-day decision count. */
  activity7d: number[];
  /** Last 30 days: accuracy vs human-override. 0–1. */
  accuracy30d: number;
  /** Last 30 days: override-rate. 0–1. */
  overrideRate30d: number;
  /** Up to 3 recent action lines (one-liner). */
  recentActions: { id: string; when: string; text: string }[];
}

export const AGENTS: AgentSeed[] = [
  {
    id: "intake", name: "Intake Agent", purpose: "Parses leave intent from natural language into a structured request.",
    defaultStatus: true, defaultAutonomy: "act_with_confirm", tone: "brand",
    defaultScope: { cohorts: ["all_employees"] },
    activity7d: [42, 38, 51, 47, 36, 12, 28], accuracy30d: 0.92, overrideRate30d: 0.06,
    recentActions: [
      { id: "ra-i-1", when: "2m ago",  text: "Parsed 'next Friday off' → Privileged Leave on 2026-05-22." },
      { id: "ra-i-2", when: "11m ago", text: "Couldn't parse 'sometime next week'; asked clarifying question." },
      { id: "ra-i-3", when: "1h ago",  text: "Handled half-day request from Vikram (PM, casual)." },
    ],
  },
  {
    id: "policy_explainer", name: "Policy Explainer", purpose: "Cites and explains policy rules in plain language.",
    defaultStatus: true, defaultAutonomy: "suggest", tone: "brand-teal",
    defaultScope: { cohorts: ["all_employees"] },
    activity7d: [28, 31, 22, 24, 19, 8, 15], accuracy30d: 0.97, overrideRate30d: 0.02,
    recentActions: [
      { id: "ra-pe-1", when: "8m ago",  text: "Cited Policy §3.2 (notice period) for 4 manager approvals." },
      { id: "ra-pe-2", when: "30m ago", text: "Drafted plain-language summary of updated sick-cert rule." },
      { id: "ra-pe-3", when: "Yesterday", text: "Answered 14 'why was I declined?' inline questions." },
    ],
  },
  {
    id: "approval_copilot", name: "Approval Co-Pilot", purpose: "Recommends approve/review/block on each pending request.",
    defaultStatus: true, defaultAutonomy: "act_with_confirm", tone: "brand",
    defaultScope: { cohorts: ["all_employees"] },
    activity7d: [58, 64, 49, 71, 55, 9, 23], accuracy30d: 0.89, overrideRate30d: 0.11,
    recentActions: [
      { id: "ra-ac-1", when: "1m ago",  text: "Recommended approve for 14 requests today (12 accepted, 2 reviewed)." },
      { id: "ra-ac-2", when: "1h ago",  text: "Flagged Lukas's 20-day Sommerurlaub for review (overlaps quarter close)." },
      { id: "ra-ac-3", when: "3h ago",  text: "Surfaced 2 sick-leave requests missing certificate before approval." },
    ],
  },
  {
    id: "coverage", name: "Coverage Agent", purpose: "Suggests delegates and validates coverage gaps.",
    defaultStatus: true, defaultAutonomy: "suggest", tone: "brand-teal",
    defaultScope: { cohorts: ["managers"] },
    activity7d: [22, 27, 18, 25, 21, 6, 14], accuracy30d: 0.85, overrideRate30d: 0.15,
    recentActions: [
      { id: "ra-c-1", when: "12m ago", text: "Proposed Karan Mehta as delegate for 5 manager-out windows." },
      { id: "ra-c-2", when: "1h ago",  text: "Detected coverage breach for May 29 (3 of 6 on Onboarding out)." },
      { id: "ra-c-3", when: "Yesterday", text: "Suggested rotation pause for Vikram (3 consecutive releases)." },
    ],
  },
  {
    id: "wellbeing", name: "Wellbeing Agent", purpose: "Detects wellbeing patterns and surfaces gentle nudges.",
    defaultStatus: true, defaultAutonomy: "suggest", tone: "destructive",
    defaultScope: { cohorts: ["all_employees"] },
    activity7d: [6, 8, 5, 4, 7, 2, 3], accuracy30d: 0.78, overrideRate30d: 0.22,
    recentActions: [
      { id: "ra-w-1", when: "22m ago", text: "Surfaced sick-cluster signal for Rohan Gupta (Mondays)." },
      { id: "ra-w-2", when: "Yesterday", text: "Detected weekend-bracketing pattern for Anjali Menon." },
      { id: "ra-w-3", when: "2d ago", text: "Suggested long-weekend plan for Karan (no PTO in 6 months)." },
    ],
  },
  {
    id: "compliance_watchdog", name: "Compliance Watchdog", purpose: "Detects statutory and regulatory changes across countries.",
    defaultStatus: true, defaultAutonomy: "suggest", tone: "warning",
    defaultScope: { cohorts: ["IN", "UK", "US", "SG", "DE"] },
    activity7d: [3, 1, 0, 2, 1, 0, 1], accuracy30d: 0.99, overrideRate30d: 0.01,
    recentActions: [
      { id: "ra-cw-1", when: "1h ago", text: "Detected UK SMP rate update — drafted redline for review." },
      { id: "ra-cw-2", when: "2d ago", text: "Confirmed India POSH refresh records for Q1." },
      { id: "ra-cw-3", when: "1w ago", text: "Spotted Germany Bavaria-only holiday addition (Pfingstmontag)." },
    ],
  },
  {
    id: "anomaly", name: "Anomaly Agent", purpose: "Watches for patterns that warrant a human review.",
    defaultStatus: true, defaultAutonomy: "suggest", tone: "warning",
    defaultScope: { cohorts: ["all_employees"] },
    activity7d: [4, 3, 5, 2, 6, 1, 2], accuracy30d: 0.74, overrideRate30d: 0.26,
    recentActions: [
      { id: "ra-an-1", when: "8m ago", text: "Flagged 4 sick leaves ≥3d without medical certificate." },
      { id: "ra-an-2", when: "1d ago", text: "Surfaced manager-dismissals pattern for Raj Verma." },
      { id: "ra-an-3", when: "2d ago", text: "31 employees risk losing CL on Dec 31 (balance cliff)." },
    ],
  },
  {
    id: "planner", name: "Planner Agent", purpose: "Suggests when to take leave; proposes bridge days around holidays.",
    defaultStatus: true, defaultAutonomy: "suggest", tone: "brand-purple",
    defaultScope: { cohorts: ["all_employees"] },
    activity7d: [16, 19, 22, 14, 17, 5, 12], accuracy30d: 0.86, overrideRate30d: 0.14,
    recentActions: [
      { id: "ra-p-1", when: "12m ago", text: "Drafted long-weekend suggestion around Buddha Purnima for 84 employees." },
      { id: "ra-p-2", when: "1h ago",  text: "Reminded 7 employees of Janmashtami optional holiday selection." },
      { id: "ra-p-3", when: "Yesterday", text: "Suggested bridge days around Aug 15 holiday cluster for 3 teams." },
    ],
  },
  {
    id: "re_entry", name: "Re-entry Agent", purpose: "Manages return-to-work cadence after long leaves.",
    defaultStatus: true, defaultAutonomy: "suggest", tone: "brand-teal",
    defaultScope: { cohorts: ["returning_from_long_leave"] },
    activity7d: [2, 1, 3, 2, 4, 1, 1], accuracy30d: 0.91, overrideRate30d: 0.09,
    recentActions: [
      { id: "ra-r-1", when: "Today",     text: "Drafted phased re-entry plan for Sophie Lin returning from maternity." },
      { id: "ra-r-2", when: "Yesterday", text: "Created a 'first-week ramp' checklist for Anjali post 2-week PL." },
      { id: "ra-r-3", when: "3d ago",    text: "Suggested removing on-call for first 7 days post-long-leave." },
    ],
  },
  {
    id: "holiday_negotiator", name: "Holiday Negotiator", purpose: "Proposes alternative dates when there's a conflict.",
    defaultStatus: true, defaultAutonomy: "suggest", tone: "brand-purple",
    defaultScope: { cohorts: ["all_employees"] },
    activity7d: [11, 8, 14, 9, 12, 3, 7], accuracy30d: 0.83, overrideRate30d: 0.17,
    recentActions: [
      { id: "ra-hn-1", when: "34m ago", text: "Proposed alternative dates for 2 conflicting requests in Onboarding." },
      { id: "ra-hn-2", when: "Yesterday", text: "Generated bridge-day options for 3 teams around the Aug 15 cluster." },
      { id: "ra-hn-3", when: "2d ago", text: "Suggested moving Lukas's leave by 1 week to dodge quarter-close." },
    ],
  },
  {
    id: "manager_coach", name: "Manager Coach", purpose: "Detects manager-action biases and surfaces gentle nudges.",
    defaultStatus: true, defaultAutonomy: "suggest", tone: "warning",
    defaultScope: { cohorts: ["managers"] },
    activity7d: [3, 4, 2, 3, 5, 1, 2], accuracy30d: 0.69, overrideRate30d: 0.31,
    recentActions: [
      { id: "ra-mc-1", when: "3h ago",  text: "Surfaced bias-check note to 2 managers (PL/SL approval-time gap)." },
      { id: "ra-mc-2", when: "Yesterday", text: "Suggested 1:1 for Raj re: recent rejection cluster." },
      { id: "ra-mc-3", when: "3d ago",  text: "Sent reminder about wellbeing-signal patterns to 4 managers." },
    ],
  },
];

/* ── Agent decisions log (for the detail page + decision trace) ── */

export type AgentDecisionOutcome = "executed" | "suggested" | "overridden" | "rejected";

export interface AgentDecision {
  id: string;
  agentId: AgentId;
  whenISO: string;
  whenLabel: string;
  /** One-line summary. */
  summary: string;
  outcome: AgentDecisionOutcome;
  /** Confidence 0–100. */
  confidence: number;
  /** Optional request the decision relates to. */
  requestId?: string;
}

export const AGENT_DECISIONS: AgentDecision[] = [
  { id: "ad-1",  agentId: "approval_copilot",  whenISO: "2026-05-11T11:32:00", whenLabel: "1m ago",  summary: "Recommended approve for Sneha Rao · WFA · May 11–15 (low impact).",                            outcome: "executed",    confidence: 92, requestId: "tr-101" },
  { id: "ad-2",  agentId: "approval_copilot",  whenISO: "2026-05-11T10:14:00", whenLabel: "1h ago",  summary: "Recommended review for Lukas Bauer · 20d Sommerurlaub (overlaps quarter close).",            outcome: "suggested",   confidence: 64, requestId: "or-040" },
  { id: "ad-3",  agentId: "compliance_watchdog", whenISO: "2026-05-11T10:25:00", whenLabel: "1h ago", summary: "Detected UK SMP standard-rate update (£187.18/wk effective 6 Apr 2026).",                  outcome: "suggested",   confidence: 99 },
  { id: "ad-4",  agentId: "wellbeing",         whenISO: "2026-05-11T11:11:00", whenLabel: "22m ago", summary: "Surfaced sick-cluster wellbeing signal for Rohan Gupta (8 of last 10 sick days on Monday).", outcome: "executed",    confidence: 76 },
  { id: "ad-5",  agentId: "anomaly",           whenISO: "2026-05-11T11:08:00", whenLabel: "25m ago", summary: "Flagged 4 sick leaves ≥3 days without medical certificate.",                                  outcome: "suggested",   confidence: 88 },
  { id: "ad-6",  agentId: "planner",           whenISO: "2026-05-11T10:20:00", whenLabel: "1h ago",  summary: "Drafted long-weekend suggestion around Buddha Purnima for 84 employees.",                       outcome: "executed",    confidence: 86 },
  { id: "ad-7",  agentId: "coverage",          whenISO: "2026-05-11T09:48:00", whenLabel: "2h ago",  summary: "Suggested Karan Mehta as delegate for Priya's WFA (Jun 2–6).",                                 outcome: "executed",    confidence: 82, requestId: "lr-002" },
  { id: "ad-8",  agentId: "manager_coach",     whenISO: "2026-05-11T08:50:00", whenLabel: "3h ago",  summary: "Surfaced bias-check note to Raj Verma (PL/SL approval-time gap).",                             outcome: "suggested",   confidence: 62 },
  { id: "ad-9",  agentId: "policy_explainer",  whenISO: "2026-05-11T10:33:00", whenLabel: "1h ago",  summary: "Cited Policy §3.2 in 7 manager approval reviews.",                                              outcome: "executed",    confidence: 97 },
  { id: "ad-10", agentId: "holiday_negotiator", whenISO: "2026-05-11T10:59:00", whenLabel: "34m ago", summary: "Proposed Wed/Thu alternative for 2 conflicting Onboarding requests.",                          outcome: "suggested",   confidence: 78, requestId: "tr-001" },
  { id: "ad-11", agentId: "re_entry",          whenISO: "2026-05-11T08:00:00", whenLabel: "Today",   summary: "Drafted phased re-entry plan for Sophie Lin (post 6-month maternity).",                        outcome: "suggested",   confidence: 90 },
  { id: "ad-12", agentId: "intake",            whenISO: "2026-05-11T11:30:00", whenLabel: "3m ago",  summary: "Parsed 'next Friday off' from Priya → PL on 2026-05-22, half-day false.",                      outcome: "executed",    confidence: 93, requestId: "lr-001" },
];

/* ── Decision trace seeds (1 per agent for now) ── */

export interface TraceTool {
  id: string;
  name: string;
  whenLabel: string;
  /** Plain-English summary of what was called. */
  summary: string;
  /** Tool kind for the icon. */
  kind: "policy_lookup" | "calendar_check" | "balance_check" | "history_fetch" | "agent_call" | "model_call";
  /** Result preview, JSON-ish line. */
  result: string;
}

export interface DecisionTrace {
  decisionId: string;
  /** Input the agent saw. */
  input: { label: string; value: string }[];
  /** Tools called in order. */
  tools: TraceTool[];
  /** Policy rules consulted (chip list). */
  policyRules: { id: string; label: string; outcome: "pass" | "warn" | "fail" }[];
  /** Plain-language reasoning bullets. */
  reasoning: string[];
  /** Output JSON. */
  output: string;
  /** Downstream effects. */
  effects: { id: string; label: string; detail: string }[];
}

export const DECISION_TRACES: Record<string, DecisionTrace> = {
  "ad-1": {
    decisionId: "ad-1",
    input: [
      { label: "Request", value: "Sneha Rao · WFA · May 11 → May 15" },
      { label: "Manager", value: "Raj Verma" },
      { label: "Days", value: "5 working days" },
    ],
    tools: [
      { id: "t1", name: "calendar_overlap_check", whenLabel: "+12ms",  kind: "calendar_check", summary: "Checked overlapping team leaves for May 11–15.", result: "{ overlaps: 1, names: ['Arjun (May 11 only)'] }" },
      { id: "t2", name: "policy_lookup",          whenLabel: "+18ms",  kind: "policy_lookup",  summary: "Looked up Policy §6.3 (WFA approval rules).",     result: "{ rule: 'manager approval required', auto: false }" },
      { id: "t3", name: "balance_check",          whenLabel: "+24ms",  kind: "balance_check",  summary: "Verified Sneha's WFA balance.",                   result: "{ balance: 18, after: 13, sufficient: true }" },
      { id: "t4", name: "history_fetch",          whenLabel: "+31ms",  kind: "history_fetch",  summary: "Pulled Sneha's 12-month leave history.",          result: "{ days: 14, by_type: { PL: 8, WFA: 6 } }" },
      { id: "t5", name: "model_call",             whenLabel: "+182ms", kind: "model_call",     summary: "Asked the recommendation model to score this case.", result: "{ verdict: 'approve', confidence: 0.92 }" },
    ],
    policyRules: [
      { id: "pr-1", label: "Policy §6.3 (WFA manager approval)", outcome: "warn" },
      { id: "pr-2", label: "Policy §3.2 (notice period ≥ 3d)",     outcome: "pass" },
      { id: "pr-3", label: "Policy §4.1 (blackout windows)",       outcome: "pass" },
      { id: "pr-4", label: "Policy §3.5 (balance floor)",          outcome: "pass" },
    ],
    reasoning: [
      "No team-wide coverage gap — only Arjun is out on May 11 (1 of 5 days).",
      "Notice period: 7 working days (well above the 3-day minimum).",
      "Balance after: 13 of 30 days WFA — comfortably above zero.",
      "WFA explicitly requires manager approval per Policy §6.3, so we recommend but don't auto-execute.",
    ],
    output: `{"verdict":"approve","label":"Approve — low impact","confidence":0.92,"facts":["Nobody else from your team is out these dates","5 days"]}`,
    effects: [
      { id: "ef-1", label: "Manager queue updated",  detail: "Approve chip pre-applied on Raj's queue for tr-101." },
      { id: "ef-2", label: "Notification scheduled", detail: "Sneha will be notified within 4h SLA window." },
    ],
  },
  "ad-3": {
    decisionId: "ad-3",
    input: [
      { label: "Source", value: "HMRC public announcement · 10 May 2026" },
      { label: "Topic", value: "Statutory Maternity Pay standard rate" },
      { label: "Country", value: "United Kingdom" },
    ],
    tools: [
      { id: "t1", name: "rss_feed_fetch",    whenLabel: "+8ms",   kind: "agent_call",     summary: "Read HMRC announcements RSS feed.",                                    result: "{ items: 1, latest: 'SMP rate update' }" },
      { id: "t2", name: "doc_parse",         whenLabel: "+34ms",  kind: "model_call",     summary: "Extracted rate, effective date, scope from doc.",                       result: "{ rate: '£187.18/wk', effective: '2026-04-06', scope: 'standard rate' }" },
      { id: "t3", name: "policy_lookup",     whenLabel: "+41ms",  kind: "policy_lookup",  summary: "Found internal UK SMP policy version 1.",                                result: "{ current: 'GBP 184.03/wk', version: 1 }" },
      { id: "t4", name: "case_count",        whenLabel: "+48ms",  kind: "history_fetch",  summary: "Counted active maternity cases in UK.",                                  result: "{ cases: 3, names: ['Sophie Lin', 'Hannah Becker', 'Lina Martens'] }" },
      { id: "t5", name: "redline_draft",     whenLabel: "+340ms", kind: "model_call",     summary: "Drafted policy redline for HR review.",                                  result: "{ doc: 'UK SMP v2 redline.md', changes: 2 }" },
    ],
    policyRules: [
      { id: "pr-1", label: "Statutory minimum (UK Maternity Allowance §4)", outcome: "warn" },
      { id: "pr-2", label: "Internal SMP rate policy v1",                    outcome: "warn" },
    ],
    reasoning: [
      "HMRC published a new SMP standard rate of £187.18/wk effective 6 Apr 2026.",
      "Our internal policy still references £184.03/wk — must update to comply.",
      "3 active maternity cases need recalculation before the next pay cycle.",
      "Drafted a clean redline and surfaced as anomaly + compliance feed item.",
    ],
    output: `{"type":"statutory_update","action":"draft_redline","cases_affected":3,"effective":"2026-04-06"}`,
    effects: [
      { id: "ef-1", label: "Anomaly surfaced",          detail: "an-1 created with high severity." },
      { id: "ef-2", label: "Compliance feed item",     detail: "cf-uk-smp filed pending HR approval." },
      { id: "ef-3", label: "Payroll notified",          detail: "Payroll system informed; awaiting redline approval before applying." },
    ],
  },
};

/* Default trace for decisions we didn't seed individually. */
export function defaultTraceFor(d: AgentDecision): DecisionTrace {
  return {
    decisionId: d.id,
    input: [
      { label: "Decision", value: d.summary },
      { label: "Confidence", value: `${d.confidence}%` },
      { label: "Outcome", value: d.outcome },
    ],
    tools: [
      { id: "t1", name: "agent_call",   whenLabel: "+0ms",   kind: "agent_call", summary: "Loaded decision context.", result: "{ ok: true }" },
      { id: "t2", name: "model_call",   whenLabel: "+120ms", kind: "model_call", summary: "Scored options via recommendation model.", result: `{ score: ${(d.confidence / 100).toFixed(2)} }` },
    ],
    policyRules: [],
    reasoning: [d.summary],
    output: JSON.stringify({ id: d.id, outcome: d.outcome, confidence: d.confidence / 100 }, null, 0),
    effects: [{ id: "ef-1", label: "Logged decision", detail: `Decision ${d.id} recorded in agent log.` }],
  };
}

/* ── Compliance Watchdog feed ── */

export type ComplianceItemStatus = "new" | "approved" | "dismissed" | "draft";
export type ComplianceItemKind = "statutory_rate" | "holiday_addition" | "law_change" | "filing_deadline";

export interface ComplianceItem {
  id: string;
  kind: ComplianceItemKind;
  severity: "high" | "medium" | "low";
  country: string;
  title: string;
  source: { label: string; url?: string };
  detectedAt: string;
  effectiveDate?: string;
  /** Plain-language summary. */
  summary: string;
  /** Drafted policy redline (multi-line text). */
  redline?: { before: string; after: string };
  /** Cases this would affect. */
  affectedCases?: number;
}

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: "cf-uk-smp", kind: "statutory_rate", severity: "high", country: "UK",
    title: "UK Statutory Maternity Pay rate update",
    source: { label: "HMRC announcement · 10 May 2026" },
    detectedAt: "2026-05-10T09:30:00",
    effectiveDate: "2026-04-06",
    summary: "Standard rate increased to £187.18/wk. 3 active maternity cases need recalculation before next pay cycle (29 May).",
    redline: {
      before: "SMP standard rate: £184.03 / week",
      after:  "SMP standard rate: £187.18 / week (effective 6 Apr 2026)",
    },
    affectedCases: 3,
  },
  {
    id: "cf-de-bavaria", kind: "holiday_addition", severity: "medium", country: "DE",
    title: "Bavaria adds Pfingstmontag to working calendar",
    source: { label: "Bayerischer Staatsanzeiger · 8 May 2026" },
    detectedAt: "2026-05-08T14:12:00",
    effectiveDate: "2026-05-25",
    summary: "Bavaria-only public holiday added (Whit Monday). Affects 4 employees in Munich.",
    redline: {
      before: "Holiday calendar DE: 9 federal holidays",
      after:  "Holiday calendar DE-BY: 10 holidays (added Pfingstmontag · 25 May)",
    },
    affectedCases: 4,
  },
  {
    id: "cf-in-posh", kind: "filing_deadline", severity: "high", country: "IN",
    title: "POSH annual report due in 12 days",
    source: { label: "Sexual Harassment of Women at Workplace Act, 2013 · §21" },
    detectedAt: "2026-05-09T08:00:00",
    effectiveDate: "2026-05-31",
    summary: "India — annual report to Internal Complaints Committee chair required by 31 May. Template available.",
    affectedCases: 1,
  },
  {
    id: "cf-us-fmla", kind: "law_change", severity: "low", country: "US",
    title: "DOL FMLA forms refresh",
    source: { label: "U.S. Department of Labor · 1 May 2026" },
    detectedAt: "2026-05-01T17:00:00",
    summary: "FMLA WH-380-E and WH-380-F forms revised. Update internal templates within 60 days.",
    redline: {
      before: "Form WH-380-E (rev. 2024)",
      after:  "Form WH-380-E (rev. 2026-05) — minor field changes",
    },
  },
  {
    id: "cf-sg-mom", kind: "filing_deadline", severity: "low", country: "SG",
    title: "MOM annual return — submitted",
    source: { label: "Singapore Ministry of Manpower · 30 Apr 2026" },
    detectedAt: "2026-04-30T10:00:00",
    summary: "Annual headcount and leave-policy filing acknowledged by MOM. No action required.",
  },
];

/* ──────────────────────────────────────────────────────────────────
   Reports & Analytics
   ────────────────────────────────────────────────────────────────── */

/** Pre-built dashboard descriptor (rendered as a tile on the hub). */
export interface PrebuiltDashboard {
  id: string;
  title: string;
  description: string;
  /** Sample chart data — small enough to render as a sparkline on the tile. */
  preview: number[];
  /** Optional dedicated drilldown route. */
  href?: string;
  tone: "brand" | "brand-purple" | "brand-teal" | "warning" | "destructive" | "success";
  /** Pinned-to-home order (lower number = higher slot). 0 = not pinned by default. */
  defaultPinOrder?: number;
}

export const PREBUILT_DASHBOARDS: PrebuiltDashboard[] = [
  {
    id: "absenteeism",   title: "Absenteeism",            description: "Days lost vs working days available, 6-month trend.",
    preview: [16, 8, 7, 12, 10, 14], tone: "warning",
  },
  {
    id: "by_type_loc",   title: "Leave by type / location / team", description: "Distribution across the org, last 12 months.",
    preview: [56, 42, 17, 13, 4],    tone: "brand",
  },
  {
    id: "bradford",      title: "Bradford Factor",         description: "Per-employee score with bands (Green ≤50 / Amber 51–199 / Red ≥200).",
    preview: [8, 27, 64, 1, 0, 1, 1], tone: "destructive",
  },
  {
    id: "liability",     title: "Leave liability",         description: "Accrued, paid out, encashment exposure with projection.",
    preview: [3.5, 3.8, 4.0, 4.1, 4.2, 4.1], tone: "warning",
    href: "/leave/hr/reports/liability", defaultPinOrder: 1,
  },
  {
    id: "utilisation",   title: "Utilisation by cohort",   description: "% allotment used by team/role/country.",
    preview: [42, 38, 51, 47, 36, 28, 41], tone: "brand-teal",
  },
  {
    id: "long_leave",    title: "Long-leave pipeline",     description: "Upcoming ≥10-day leaves and return-to-work dates.",
    preview: [2, 1, 3, 2, 4, 1, 1],   tone: "brand-purple",
  },
  {
    id: "compliance",    title: "Compliance",               description: "Per-country statutory status, last-audited timestamps, deadlines.",
    preview: [],                       tone: "success",
    href: "/leave/hr/reports/compliance", defaultPinOrder: 2,
  },
];

/* ── Custom report builder catalog ── */

export type ReportDimension =
  | "country"
  | "sub_team"
  | "role"
  | "leave_type"
  | "status"
  | "month"
  | "year"
  | "employee";

export type ReportMeasure =
  | "request_count"
  | "days_taken"
  | "days_pending"
  | "avg_days_per_employee"
  | "absenteeism_rate"
  | "bradford_score"
  | "liability_value";

export const REPORT_DIMENSIONS: { value: ReportDimension; label: string }[] = [
  { value: "country",    label: "Country" },
  { value: "sub_team",   label: "Sub-team" },
  { value: "role",       label: "Role" },
  { value: "leave_type", label: "Leave type" },
  { value: "status",     label: "Status" },
  { value: "month",      label: "Month" },
  { value: "year",       label: "Year" },
  { value: "employee",   label: "Employee" },
];

export const REPORT_MEASURES: { value: ReportMeasure; label: string; unit: string }[] = [
  { value: "request_count",         label: "Request count",       unit: "requests" },
  { value: "days_taken",            label: "Days taken",          unit: "days" },
  { value: "days_pending",          label: "Days pending",        unit: "days" },
  { value: "avg_days_per_employee", label: "Avg days / employee", unit: "days" },
  { value: "absenteeism_rate",      label: "Absenteeism rate",    unit: "%" },
  { value: "bradford_score",        label: "Bradford score",      unit: "score" },
  { value: "liability_value",       label: "Liability value",     unit: "INR" },
];

/* ── Liability dashboard seed ── */

export interface LiabilityCostCenter {
  id: string;
  name: string;
  country: string;
  headcount: number;
  /** Accrued liability in lakh INR (1L = 100,000). */
  accruedLakh: number;
  paidLakhYTD: number;
  encashmentLakhYTD: number;
}

export const LIABILITY_BY_COST_CENTER: LiabilityCostCenter[] = [
  { id: "cc-eng-on",   name: "Engineering · Onboarding", country: "IN", headcount: 38, accruedLakh: 142, paidLakhYTD: 18, encashmentLakhYTD: 7 },
  { id: "cc-eng-pl",   name: "Engineering · Platform",   country: "IN", headcount: 52, accruedLakh: 198, paidLakhYTD: 24, encashmentLakhYTD: 9 },
  { id: "cc-eng-py",   name: "Engineering · Payments",   country: "IN", headcount: 31, accruedLakh: 112, paidLakhYTD: 14, encashmentLakhYTD: 5 },
  { id: "cc-eng-st",   name: "Engineering · Storage",    country: "IN", headcount: 22, accruedLakh: 88,  paidLakhYTD: 10, encashmentLakhYTD: 4 },
  { id: "cc-cs",       name: "Customer Support",         country: "IN", headcount: 64, accruedLakh: 156, paidLakhYTD: 32, encashmentLakhYTD: 11 },
  { id: "cc-go-uk",    name: "Go-to-market · UK",        country: "UK", headcount: 42, accruedLakh: 92,  paidLakhYTD: 14, encashmentLakhYTD: 0 },
  { id: "cc-go-us",    name: "Go-to-market · US",        country: "US", headcount: 33, accruedLakh: 64,  paidLakhYTD: 11, encashmentLakhYTD: 0 },
  { id: "cc-go-sg",    name: "Go-to-market · APAC",      country: "SG", headcount: 17, accruedLakh: 30,  paidLakhYTD: 5,  encashmentLakhYTD: 0 },
  { id: "cc-eu-de",    name: "Engineering · Germany",    country: "DE", headcount: 8,  accruedLakh: 20,  paidLakhYTD: 3,  encashmentLakhYTD: 0 },
];

export interface LiabilityProjectionPoint {
  monthLabel: string;
  accruedLakh: number;
  /** Plain-language note (e.g. 'YE encashment cycle'). */
  note?: string;
}

export const LIABILITY_PROJECTION_12M: LiabilityProjectionPoint[] = [
  { monthLabel: "May", accruedLakh: 412 },
  { monthLabel: "Jun", accruedLakh: 420 },
  { monthLabel: "Jul", accruedLakh: 430 },
  { monthLabel: "Aug", accruedLakh: 438 },
  { monthLabel: "Sep", accruedLakh: 445 },
  { monthLabel: "Oct", accruedLakh: 451 },
  { monthLabel: "Nov", accruedLakh: 456 },
  { monthLabel: "Dec", accruedLakh: 412, note: "YE encashment cycle" },
  { monthLabel: "Jan", accruedLakh: 420 },
  { monthLabel: "Feb", accruedLakh: 426 },
  { monthLabel: "Mar", accruedLakh: 410, note: "FY close" },
  { monthLabel: "Apr", accruedLakh: 414 },
];

/* ── Compliance dashboard: per-country statutory floor checks ── */

export type StatutoryCheckOutcome = "pass" | "warn" | "fail" | "na";

export interface StatutoryCheck {
  id: string;
  label: string;
  outcome: StatutoryCheckOutcome;
  /** Optional citation snippet. */
  citation?: string;
  detail: string;
}

export interface CountryComplianceRow {
  country: string;
  /** Last audit timestamp ISO. */
  lastAuditedISO: string;
  /** Owner (HR partner). */
  owner: string;
  /** Number of overdue items. */
  overdueCount: number;
  /** Hard / soft check list. */
  checks: StatutoryCheck[];
}

export const COUNTRY_COMPLIANCE: CountryComplianceRow[] = [
  {
    country: "IN", owner: "Anita Sharma",   lastAuditedISO: "2026-05-09T11:00:00", overdueCount: 0,
    checks: [
      { id: "in-1", label: "Statutory leave floor ≥ 15d",         outcome: "pass", citation: "Factories Act 1948 §79", detail: "All employees ≥ 15 days allocated annual leave." },
      { id: "in-2", label: "POSH ICC active",                      outcome: "pass", citation: "POSH Act 2013 §4",       detail: "ICC composed; quarterly meetings on file." },
      { id: "in-3", label: "POSH annual report",                   outcome: "warn", citation: "POSH Act 2013 §21",      detail: "Due 31 May 2026 — 12 days remaining." },
      { id: "in-4", label: "Maternity 26 weeks",                   outcome: "pass", citation: "Maternity Benefit Act §5", detail: "Compliant for all eligible employees." },
    ],
  },
  {
    country: "UK", owner: "James Cole",     lastAuditedISO: "2026-05-10T09:30:00", overdueCount: 1,
    checks: [
      { id: "uk-1", label: "Annual leave ≥ 28d (incl. holidays)", outcome: "pass", citation: "Working Time Regs §13", detail: "All employees at 28+ days." },
      { id: "uk-2", label: "SMP rate up to date",                   outcome: "warn", citation: "HMRC announcement",      detail: "Rate updated to £187.18/wk on 6 Apr — redline pending HR sign-off." },
      { id: "uk-3", label: "SSP weekly amount tracked",             outcome: "pass", citation: "Statutory Sick Pay",     detail: "Current rate: £116.75/wk." },
    ],
  },
  {
    country: "US", owner: "Lena Park",      lastAuditedISO: "2026-05-08T14:00:00", overdueCount: 0,
    checks: [
      { id: "us-1", label: "FMLA tracking active",                  outcome: "pass", citation: "FMLA 29 U.S.C. §2611", detail: "12 employees enrolled; all tracked." },
      { id: "us-2", label: "FMLA forms current revision",           outcome: "warn", citation: "DOL WH-380-E (rev 2026-05)", detail: "Update templates within 60 days." },
      { id: "us-3", label: "State-level PTO floors",                outcome: "na",   detail: "No state with statutory PTO floor in our footprint." },
    ],
  },
  {
    country: "SG", owner: "Anand Krishnan", lastAuditedISO: "2026-05-01T10:00:00", overdueCount: 0,
    checks: [
      { id: "sg-1", label: "MOM annual return",                     outcome: "pass", citation: "Singapore MOM",         detail: "Submitted 30 Apr 2026 — acknowledged." },
      { id: "sg-2", label: "Childcare leave 6 days/yr",             outcome: "pass", citation: "Child Development Co-Savings Act", detail: "Allotment configured." },
    ],
  },
  {
    country: "DE", owner: "Hannah Becker",  lastAuditedISO: "2026-04-15T15:30:00", overdueCount: 1,
    checks: [
      { id: "de-1", label: "Annual leave ≥ 20d (5-day week)",       outcome: "pass", citation: "BUrlG §3",              detail: "All employees ≥ 24 days allotted." },
      { id: "de-2", label: "Works council consultation logged",     outcome: "fail", citation: "BetrVG §80",            detail: "Q1 consultation overdue by 9 days. Email partner immediately." },
      { id: "de-3", label: "Pfingstmontag (Bavaria) added",          outcome: "warn", citation: "Bayerischer Staatsanzeiger", detail: "Holiday calendar update pending." },
    ],
  },
];

/** Helper: aggregate counts for the dashboard header. */
export function complianceSummary(): { passing: number; warning: number; failing: number; total: number } {
  let passing = 0, warning = 0, failing = 0, total = 0;
  for (const row of COUNTRY_COMPLIANCE) {
    for (const c of row.checks) {
      if (c.outcome === "na") continue;
      total++;
      if (c.outcome === "pass") passing++;
      else if (c.outcome === "warn") warning++;
      else if (c.outcome === "fail") failing++;
    }
  }
  return { passing, warning, failing, total };
}

/* ──────────────────────────────────────────────────────────────────
   Audit log, DSAR, Scheduled Exports
   ────────────────────────────────────────────────────────────────── */

export type AuditEntity =
  | "leave_request"
  | "team_request"
  | "wellbeing_signal"
  | "anomaly"
  | "compliance_item"
  | "policy"
  | "balance"
  | "delegation"
  | "agent_config";

export type AuditAction =
  | "created"
  | "updated"
  | "submitted"
  | "approved"
  | "rejected"
  | "cancelled"
  | "force_approved"
  | "force_cancelled"
  | "reassigned"
  | "dismissed"
  | "escalated"
  | "marked_addressed"
  | "marked_investigating"
  | "ran_suggested"
  | "balance_adjusted"
  | "config_changed"
  | "exported";

export type AuditActorKind = "human" | "agent" | "system";

export interface AuditEntry {
  /** Sequence id (monotonic). */
  seq: number;
  /** Stable id (used as react key + hash input). */
  id: string;
  whenISO: string;
  whenLabel: string;
  /** Who performed the action. */
  actor: { kind: AuditActorKind; name: string; id?: string };
  entity: AuditEntity;
  /** Specific record affected. */
  entityId: string;
  action: AuditAction;
  /** Plain-language summary. */
  summary: string;
  /** Optional structured diff. */
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  /** Reason / note. */
  reason?: string;
}

/* Hand-seeded baseline so the audit page isn't empty on first load. */
export const AUDIT_BASELINE: AuditEntry[] = [
  {
    seq: 1, id: "ab-1", whenISO: "2026-05-04T15:22:00", whenLabel: "May 4, 3:22 PM",
    actor: { kind: "human", name: "Priya Singh", id: "self" },
    entity: "leave_request", entityId: "lr-002", action: "submitted",
    summary: "Priya submitted WFA for May 11–15.",
    after: { status: "pending", days: 5 },
    reason: "Working from Goa.",
  },
  {
    seq: 2, id: "ab-2", whenISO: "2026-05-05T10:11:00", whenLabel: "May 5, 10:11 AM",
    actor: { kind: "human", name: "Meera Krishnan", id: "mgr-meera" },
    entity: "leave_request", entityId: "lr-002", action: "approved",
    summary: "Meera approved lr-002.",
    before: { status: "pending" }, after: { status: "approved" },
    reason: "Approved. Coverage with Karan.",
  },
  {
    seq: 3, id: "ab-3", whenISO: "2026-05-08T11:02:00", whenLabel: "May 8, 11:02 AM",
    actor: { kind: "agent", name: "Approval Co-Pilot", id: "approval_copilot" },
    entity: "team_request", entityId: "tr-001", action: "ran_suggested",
    summary: "Approval Co-Pilot scored tr-001 as 'approve — low impact'.",
    after: { verdict: "approve", confidence: 0.92 },
  },
  {
    seq: 4, id: "ab-4", whenISO: "2026-05-09T11:15:00", whenLabel: "May 9, 11:15 AM",
    actor: { kind: "agent", name: "Anomaly Agent", id: "anomaly" },
    entity: "anomaly", entityId: "an-2", action: "created",
    summary: "Detected 4 sick leaves ≥ 3 days without medical certificate.",
    after: { severity: "medium", count: 4 },
  },
  {
    seq: 5, id: "ab-5", whenISO: "2026-05-10T09:30:00", whenLabel: "May 10, 9:30 AM",
    actor: { kind: "agent", name: "Compliance Watchdog", id: "compliance_watchdog" },
    entity: "compliance_item", entityId: "cf-uk-smp", action: "created",
    summary: "Detected UK SMP standard-rate update to £187.18/wk.",
    after: { rate: "£187.18/wk", effective: "2026-04-06" },
  },
  {
    seq: 6, id: "ab-6", whenISO: "2026-05-10T14:00:00", whenLabel: "May 10, 2:00 PM",
    actor: { kind: "human", name: "Anita Sharma", id: "hr-anita" },
    entity: "compliance_item", entityId: "cf-uk-smp", action: "updated",
    summary: "Anita reviewed UK SMP redline; awaiting payroll alignment.",
    before: { status: "new" }, after: { status: "draft" },
  },
  {
    seq: 7, id: "ab-7", whenISO: "2026-05-11T08:50:00", whenLabel: "May 11, 8:50 AM",
    actor: { kind: "agent", name: "Manager Coach", id: "manager_coach" },
    entity: "agent_config", entityId: "manager_coach", action: "ran_suggested",
    summary: "Surfaced bias-check note to 2 managers (PL/SL approval-time gap).",
    after: { managers_notified: 2 },
  },
  {
    seq: 8, id: "ab-8", whenISO: "2026-05-11T10:15:00", whenLabel: "May 11, 10:15 AM",
    actor: { kind: "human", name: "Anita Sharma", id: "hr-anita" },
    entity: "team_request", entityId: "tr-005", action: "force_approved",
    summary: "Anita force-approved tr-005 (Arjun · 6-day PL).",
    before: { status: "pending" }, after: { status: "approved" },
    reason: "HR override — pre-booked since January.",
  },
  {
    seq: 9, id: "ab-9", whenISO: "2026-05-11T10:42:00", whenLabel: "May 11, 10:42 AM",
    actor: { kind: "human", name: "Raj Verma", id: "mgr-raj" },
    entity: "delegation", entityId: "raj-delegation", action: "config_changed",
    summary: "Raj enabled always-on delegation to Arjun Iyer.",
    before: { alwaysOn: false }, after: { alwaysOn: true, peer: "Arjun Iyer" },
  },
  {
    seq: 10, id: "ab-10", whenISO: "2026-05-11T11:00:00", whenLabel: "May 11, 11:00 AM",
    actor: { kind: "system", name: "Scheduler", id: "system" },
    entity: "balance", entityId: "all_employees", action: "balance_adjusted",
    summary: "Monthly accrual run: +1.5 PL credited to 312 employees.",
    after: { credited: 312, type: "privileged" },
  },
];

/* ── DSAR ── */

export type DsarScope = "access" | "deletion" | "portability";
export type DsarStatus = "new" | "in_progress" | "awaiting_legal" | "completed" | "rejected";

export interface DsarRequest {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectInitials: string;
  subjectAvatar: string;
  /** Country of subject for jurisdiction routing. */
  country: string;
  scope: DsarScope;
  /** Plain summary of what was asked. */
  reason: string;
  /** Submitted by (could be the subject themselves or an attorney). */
  submittedByName: string;
  submittedOn: string;
  /** Deadline (legal — e.g. 30 days for GDPR). */
  dueDateISO: string;
  /** Assigned operator name (may be empty). */
  assigneeName?: string;
  /** Legal hold flag overrides deletion. */
  legalHold?: { reason: string; placedByName: string; placedOnISO: string };
  status: DsarStatus;
  /** Audit timeline specific to this DSAR (additional to global audit). */
  history: { id: string; whenLabel: string; actor: string; action: string; note?: string }[];
}

export const DSAR_REQUESTS: DsarRequest[] = [
  {
    id: "dsar-001", subjectId: "t5", subjectName: "Rohan Gupta", subjectInitials: "RG", subjectAvatar: "bg-destructive",
    country: "IN", scope: "access",
    reason: "Subject access request — full leave + wellbeing record for last 24 months.",
    submittedByName: "Rohan Gupta",
    submittedOn: "2026-05-08", dueDateISO: "2026-06-07",
    assigneeName: "Anita Sharma",
    status: "in_progress",
    history: [
      { id: "h1", whenLabel: "May 8, 9:00 AM",  actor: "Rohan Gupta",   action: "submitted",       note: "Self-submitted via /profile" },
      { id: "h2", whenLabel: "May 8, 11:30 AM", actor: "Anita Sharma", action: "assigned to self" },
      { id: "h3", whenLabel: "May 9, 2:15 PM", actor: "Anita Sharma",  action: "data package assembled (preview)", note: "Awaiting QA review before delivery." },
    ],
  },
  {
    id: "dsar-002", subjectId: "uk-emma", subjectName: "Emma Whitfield", subjectInitials: "EW", subjectAvatar: "bg-brand-purple",
    country: "UK", scope: "portability",
    reason: "GDPR Article 20 — portability to new employer.",
    submittedByName: "Emma Whitfield",
    submittedOn: "2026-05-01", dueDateISO: "2026-05-31",
    assigneeName: "James Cole",
    status: "completed",
    history: [
      { id: "h1", whenLabel: "May 1",  actor: "Emma Whitfield", action: "submitted" },
      { id: "h2", whenLabel: "May 3",  actor: "James Cole",     action: "assigned to self" },
      { id: "h3", whenLabel: "May 5",  actor: "James Cole",     action: "data package generated" },
      { id: "h4", whenLabel: "May 6",  actor: "Emma Whitfield", action: "downloaded package",   note: "Delivered as machine-readable JSON + PDF summary." },
      { id: "h5", whenLabel: "May 6",  actor: "James Cole",     action: "marked complete" },
    ],
  },
  {
    id: "dsar-003", subjectId: "us-jordan", subjectName: "Jordan Reyes", subjectInitials: "JR", subjectAvatar: "bg-success",
    country: "US", scope: "deletion",
    reason: "Post-separation deletion request.",
    submittedByName: "Jordan Reyes (via attorney)",
    submittedOn: "2026-05-09", dueDateISO: "2026-06-08",
    legalHold: { reason: "Active disciplinary investigation", placedByName: "Lena Park · Legal", placedOnISO: "2026-05-09" },
    status: "awaiting_legal",
    history: [
      { id: "h1", whenLabel: "May 9, 8:00 AM",  actor: "Attorney (Reyes)", action: "submitted on behalf of subject" },
      { id: "h2", whenLabel: "May 9, 9:00 AM",  actor: "Lena Park · Legal", action: "placed legal hold",            note: "Active disciplinary investigation — cannot delete until cleared." },
      { id: "h3", whenLabel: "May 9, 10:00 AM", actor: "Anita Sharma",     action: "marked awaiting legal",         note: "Will revisit after the May 22 hearing." },
    ],
  },
  {
    id: "dsar-004", subjectId: "de-lukas", subjectName: "Lukas Bauer", subjectInitials: "LB", subjectAvatar: "bg-warning",
    country: "DE", scope: "access",
    reason: "BDSG §15 access request.",
    submittedByName: "Lukas Bauer",
    submittedOn: "2026-05-11", dueDateISO: "2026-06-10",
    status: "new",
    history: [
      { id: "h1", whenLabel: "May 11, 3:14 PM", actor: "Lukas Bauer", action: "submitted" },
    ],
  },
  {
    id: "dsar-005", subjectId: "former-001", subjectName: "Vivek Bansal", subjectInitials: "VB", subjectAvatar: "bg-brand-purple",
    country: "IN", scope: "deletion",
    reason: "Right-to-erasure (DPDP Act).",
    submittedByName: "Vivek Bansal",
    submittedOn: "2026-04-12", dueDateISO: "2026-05-12",
    assigneeName: "Anita Sharma",
    status: "rejected",
    history: [
      { id: "h1", whenLabel: "Apr 12", actor: "Vivek Bansal",  action: "submitted" },
      { id: "h2", whenLabel: "Apr 14", actor: "Anita Sharma", action: "assigned to self" },
      { id: "h3", whenLabel: "Apr 20", actor: "Anita Sharma", action: "rejected", note: "Tax retention obligation (7 years) — cannot delete payroll records yet. Provided redacted access package instead." },
    ],
  },
];

/* ── Scheduled exports ── */

export type ExportDestinationKind = "payroll" | "warehouse" | "finance_erp";
export type ExportRunStatus = "success" | "failed" | "running";

export interface ExportRun {
  id: string;
  startedISO: string;
  durationMs: number;
  status: ExportRunStatus;
  rowsExported: number;
  errorMessage?: string;
}

export interface ExportDestination {
  id: string;
  name: string;
  kind: ExportDestinationKind;
  /** External system label (e.g. RazorpayX, Snowflake, NetSuite). */
  system: string;
  /** Country/region. */
  country?: string;
  /** Cron-style label, e.g. "Daily 02:00 IST". */
  cadenceLabel: string;
  /** ISO of next scheduled run. */
  nextRunISO: string;
  enabled: boolean;
  runs: ExportRun[];
}

export const SCHEDULED_EXPORTS: ExportDestination[] = [
  {
    id: "ex-payroll-in", name: "India payroll · monthly cycle", kind: "payroll", system: "RazorpayX Payroll",
    country: "IN", cadenceLabel: "Monthly · 22nd · 23:30 IST",
    nextRunISO: "2026-05-22T18:00:00",
    enabled: true,
    runs: [
      { id: "r1", startedISO: "2026-04-22T18:00:00", durationMs: 64_000, status: "success", rowsExported: 312 },
      { id: "r2", startedISO: "2026-03-22T18:00:00", durationMs: 71_000, status: "success", rowsExported: 308 },
      { id: "r3", startedISO: "2026-02-22T18:00:00", durationMs: 62_000, status: "success", rowsExported: 304 },
      { id: "r4", startedISO: "2026-01-22T18:00:00", durationMs: 88_000, status: "failed",  rowsExported: 0,   errorMessage: "Auth token expired. Rotated and retried successfully (+12m)." },
    ],
  },
  {
    id: "ex-payroll-uk", name: "UK payroll · monthly cycle", kind: "payroll", system: "PayFit UK",
    country: "UK", cadenceLabel: "Monthly · 27th · 18:00 GMT",
    nextRunISO: "2026-05-27T18:00:00",
    enabled: true,
    runs: [
      { id: "r1", startedISO: "2026-04-27T18:00:00", durationMs: 41_000, status: "success", rowsExported: 42 },
      { id: "r2", startedISO: "2026-03-27T18:00:00", durationMs: 39_000, status: "success", rowsExported: 41 },
    ],
  },
  {
    id: "ex-warehouse", name: "Analytics warehouse", kind: "warehouse", system: "Snowflake",
    cadenceLabel: "Hourly",
    nextRunISO: "2026-05-11T13:00:00",
    enabled: true,
    runs: [
      { id: "r1", startedISO: "2026-05-11T12:00:00", durationMs: 5_300,  status: "success", rowsExported: 1_842 },
      { id: "r2", startedISO: "2026-05-11T11:00:00", durationMs: 4_900,  status: "success", rowsExported: 1_799 },
      { id: "r3", startedISO: "2026-05-11T10:00:00", durationMs: 12_400, status: "failed",  rowsExported: 0,    errorMessage: "Network partition; retried at 10:12 successfully." },
      { id: "r4", startedISO: "2026-05-11T10:12:00", durationMs: 5_100,  status: "success", rowsExported: 1_780 },
    ],
  },
  {
    id: "ex-erp", name: "Finance GL · liability accruals", kind: "finance_erp", system: "NetSuite",
    cadenceLabel: "Monthly · last day · 19:00 IST",
    nextRunISO: "2026-05-31T13:30:00",
    enabled: true,
    runs: [
      { id: "r1", startedISO: "2026-04-30T13:30:00", durationMs: 18_400, status: "success", rowsExported: 9 },
      { id: "r2", startedISO: "2026-03-31T13:30:00", durationMs: 17_200, status: "success", rowsExported: 9 },
    ],
  },
];

/* ── Greeting helpers ── */

export const EMPLOYEE_FIRST_NAME = "Priya";

export function totalAvailable(balances: LeaveBalance[]): number {
  return balances
    .filter((b) => ["privileged", "casual", "compoff"].includes(b.type))
    .reduce((sum, b) => sum + b.balance, 0);
}

export function totalUsedYTD(balances: LeaveBalance[]): number {
  return balances.reduce((sum, b) => sum + b.used, 0);
}

/* ================================================================
   3.5.3 Roles & Permissions — RBAC matrix
   ================================================================ */

/** A single fine-grained capability that a role may or may not have. */
export type PermissionKey =
  | "leave.request.create"
  | "leave.request.cancel.self"
  | "leave.request.view.team"
  | "leave.request.view.org"
  | "leave.request.approve.team"
  | "leave.request.force_approve"
  | "leave.request.force_cancel"
  | "leave.request.reassign_approver"
  | "leave.calendar.view.team"
  | "leave.calendar.view.org"
  | "leave.policy.read"
  | "leave.policy.write"
  | "leave.balances.read.self"
  | "leave.balances.read.team"
  | "leave.balances.read.org"
  | "leave.balances.adjust"
  | "leave.wellbeing.view"
  | "leave.wellbeing.act"
  | "leave.anomalies.view"
  | "leave.anomalies.act"
  | "leave.agents.view"
  | "leave.agents.configure"
  | "leave.reports.view"
  | "leave.reports.build"
  | "leave.reports.export"
  | "leave.compliance.view"
  | "leave.compliance.act"
  | "leave.audit.view"
  | "leave.audit.export"
  | "leave.dsar.view"
  | "leave.dsar.act"
  | "leave.exports.view"
  | "leave.exports.configure"
  | "leave.tenant.read"
  | "leave.tenant.write"
  | "leave.roles.read"
  | "leave.roles.write";

export interface PermissionDef {
  key: PermissionKey;
  label: string;
  description: string;
  group: PermissionGroup;
}

export type PermissionGroup =
  | "Requests"
  | "Calendars & Balances"
  | "Wellbeing & Anomalies"
  | "Agents"
  | "Reports & Exports"
  | "Compliance & Audit"
  | "Tenant & Roles";

export const PERMISSIONS: PermissionDef[] = [
  { key: "leave.request.create",            group: "Requests", label: "Create requests",          description: "Submit a new leave request for self." },
  { key: "leave.request.cancel.self",       group: "Requests", label: "Cancel own request",       description: "Withdraw a pending or approved request before consumption." },
  { key: "leave.request.view.team",         group: "Requests", label: "View team requests",       description: "See requests from direct reports." },
  { key: "leave.request.view.org",          group: "Requests", label: "View all requests",        description: "See requests across the whole tenant." },
  { key: "leave.request.approve.team",      group: "Requests", label: "Approve team requests",    description: "Decide on direct-report requests within their SLA." },
  { key: "leave.request.force_approve",     group: "Requests", label: "Force-approve",            description: "Override manager and approve any pending request." },
  { key: "leave.request.force_cancel",      group: "Requests", label: "Force-cancel",             description: "Cancel any approved/pending request (with audit). " },
  { key: "leave.request.reassign_approver", group: "Requests", label: "Reassign approver",        description: "Route a request to a different approver." },

  { key: "leave.calendar.view.team",   group: "Calendars & Balances", label: "View team calendar",   description: "Heatmap and timeline for one team." },
  { key: "leave.calendar.view.org",    group: "Calendars & Balances", label: "View org calendar",    description: "Cross-team and cross-country calendar." },
  { key: "leave.policy.read",          group: "Calendars & Balances", label: "Read policies",        description: "View accrual rules, holidays, blackout windows." },
  { key: "leave.policy.write",         group: "Calendars & Balances", label: "Edit policies",        description: "Change accrual rates, holidays, carry-forward caps." },
  { key: "leave.balances.read.self",   group: "Calendars & Balances", label: "Read own balance",     description: "See own accrued, available, encashable units." },
  { key: "leave.balances.read.team",   group: "Calendars & Balances", label: "Read team balances",   description: "See balances for direct reports." },
  { key: "leave.balances.read.org",    group: "Calendars & Balances", label: "Read all balances",    description: "See balances across the tenant." },
  { key: "leave.balances.adjust",      group: "Calendars & Balances", label: "Adjust balances",      description: "Make compensatory adjustments (with audit)." },

  { key: "leave.wellbeing.view",   group: "Wellbeing & Anomalies", label: "View wellbeing signals", description: "See burnout-risk and pattern alerts." },
  { key: "leave.wellbeing.act",    group: "Wellbeing & Anomalies", label: "Act on wellbeing",       description: "Suggest leave, schedule 1:1, escalate." },
  { key: "leave.anomalies.view",   group: "Wellbeing & Anomalies", label: "View anomalies",         description: "See anomaly review queue." },
  { key: "leave.anomalies.act",    group: "Wellbeing & Anomalies", label: "Act on anomalies",       description: "Dismiss, escalate, mark investigating." },

  { key: "leave.agents.view",      group: "Agents", label: "View agents",      description: "Read agent definitions and recent decisions." },
  { key: "leave.agents.configure", group: "Agents", label: "Configure agents", description: "Toggle status, change autonomy, change scope." },

  { key: "leave.reports.view",    group: "Reports & Exports", label: "View reports",         description: "Read pre-built dashboards (liability, compliance, utilization)." },
  { key: "leave.reports.build",   group: "Reports & Exports", label: "Build reports",        description: "Use the no-code report builder." },
  { key: "leave.reports.export",  group: "Reports & Exports", label: "Export reports",       description: "Download CSV/PDF, push to warehouse." },
  { key: "leave.exports.view",    group: "Reports & Exports", label: "View scheduled exports", description: "See destinations and run history." },
  { key: "leave.exports.configure", group: "Reports & Exports", label: "Configure exports", description: "Pause, retry, change cadence, add destinations." },

  { key: "leave.compliance.view", group: "Compliance & Audit", label: "View compliance feed", description: "See watchdog alerts (jurisdictional, regulatory)." },
  { key: "leave.compliance.act",  group: "Compliance & Audit", label: "Act on compliance",    description: "Acknowledge, snooze, escalate compliance items." },
  { key: "leave.audit.view",      group: "Compliance & Audit", label: "View audit log",       description: "See every state change with before/after." },
  { key: "leave.audit.export",    group: "Compliance & Audit", label: "Export audit log",     description: "Download immutable audit trail." },
  { key: "leave.dsar.view",       group: "Compliance & Audit", label: "View DSAR queue",      description: "See data-subject access requests." },
  { key: "leave.dsar.act",        group: "Compliance & Audit", label: "Act on DSARs",         description: "Assign, place legal hold, mark complete." },

  { key: "leave.tenant.read",  group: "Tenant & Roles", label: "Read tenant settings",  description: "View branding, languages, residency, defaults." },
  { key: "leave.tenant.write", group: "Tenant & Roles", label: "Edit tenant settings",  description: "Change branding, fiscal year, autonomy defaults." },
  { key: "leave.roles.read",   group: "Tenant & Roles", label: "Read roles",            description: "View RBAC matrix and custom roles." },
  { key: "leave.roles.write",  group: "Tenant & Roles", label: "Edit roles",            description: "Create custom roles, change permission masks." },
];

export const PERMISSION_GROUPS: PermissionGroup[] = [
  "Requests",
  "Calendars & Balances",
  "Wellbeing & Anomalies",
  "Agents",
  "Reports & Exports",
  "Compliance & Audit",
  "Tenant & Roles",
];

export type RbacRoleId =
  | "super_admin"
  | "hr_ops"
  | "local_hr"
  | "manager"
  | "employee"
  | "finance"
  | "auditor"
  | string; // also allows custom-role ids like "custom-..."

export interface RbacRole {
  id: RbacRoleId;
  name: string;
  description: string;
  /** Built-in roles are immutable; custom roles can be edited. */
  builtIn: boolean;
  /** Color hint for the badge tint. */
  tone: "purple" | "teal" | "blue" | "amber" | "gray" | "red" | "green";
  /** Permissions granted to this role. */
  permissions: PermissionKey[];
  /** Approximate count of users with this role (for the matrix UI). */
  userCount: number;
}

export const BUILT_IN_ROLES: RbacRole[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full access to everything in the tenant. Reserved for platform owners.",
    builtIn: true,
    tone: "red",
    userCount: 2,
    permissions: PERMISSIONS.map((p) => p.key),
  },
  {
    id: "hr_ops",
    name: "HR Ops",
    description: "Org-wide people-ops: requests, balances, compliance, audit, reports.",
    builtIn: true,
    tone: "purple",
    userCount: 4,
    permissions: [
      "leave.request.create",
      "leave.request.cancel.self",
      "leave.request.view.team",
      "leave.request.view.org",
      "leave.request.force_approve",
      "leave.request.force_cancel",
      "leave.request.reassign_approver",
      "leave.calendar.view.team",
      "leave.calendar.view.org",
      "leave.policy.read",
      "leave.policy.write",
      "leave.balances.read.self",
      "leave.balances.read.team",
      "leave.balances.read.org",
      "leave.balances.adjust",
      "leave.wellbeing.view",
      "leave.anomalies.view",
      "leave.anomalies.act",
      "leave.agents.view",
      "leave.agents.configure",
      "leave.reports.view",
      "leave.reports.build",
      "leave.reports.export",
      "leave.compliance.view",
      "leave.compliance.act",
      "leave.audit.view",
      "leave.audit.export",
      "leave.dsar.view",
      "leave.dsar.act",
      "leave.exports.view",
      "leave.exports.configure",
      "leave.tenant.read",
      "leave.roles.read",
    ],
  },
  {
    id: "local_hr",
    name: "Local HR",
    description: "Country-scoped HR: cannot edit tenant settings, can act within their region.",
    builtIn: true,
    tone: "teal",
    userCount: 7,
    permissions: [
      "leave.request.create",
      "leave.request.cancel.self",
      "leave.request.view.team",
      "leave.request.view.org",
      "leave.request.force_approve",
      "leave.request.reassign_approver",
      "leave.calendar.view.team",
      "leave.calendar.view.org",
      "leave.policy.read",
      "leave.balances.read.self",
      "leave.balances.read.team",
      "leave.balances.read.org",
      "leave.balances.adjust",
      "leave.wellbeing.view",
      "leave.anomalies.view",
      "leave.anomalies.act",
      "leave.agents.view",
      "leave.reports.view",
      "leave.reports.export",
      "leave.compliance.view",
      "leave.compliance.act",
      "leave.audit.view",
      "leave.dsar.view",
      "leave.dsar.act",
      "leave.tenant.read",
      "leave.roles.read",
    ],
  },
  {
    id: "manager",
    name: "Manager",
    description: "Approve direct reports, see team capacity, get wellbeing alerts.",
    builtIn: true,
    tone: "amber",
    userCount: 38,
    permissions: [
      "leave.request.create",
      "leave.request.cancel.self",
      "leave.request.view.team",
      "leave.request.approve.team",
      "leave.calendar.view.team",
      "leave.policy.read",
      "leave.balances.read.self",
      "leave.balances.read.team",
      "leave.wellbeing.view",
      "leave.wellbeing.act",
      "leave.reports.view",
    ],
  },
  {
    id: "employee",
    name: "Employee",
    description: "Submit and view own requests, see team calendar (read-only).",
    builtIn: true,
    tone: "blue",
    userCount: 1_204,
    permissions: [
      "leave.request.create",
      "leave.request.cancel.self",
      "leave.calendar.view.team",
      "leave.policy.read",
      "leave.balances.read.self",
    ],
  },
  {
    id: "finance",
    name: "Finance",
    description: "Read liability dashboards and trigger ERP exports. No PII access.",
    builtIn: true,
    tone: "green",
    userCount: 3,
    permissions: [
      "leave.reports.view",
      "leave.reports.export",
      "leave.exports.view",
      "leave.exports.configure",
    ],
  },
  {
    id: "auditor",
    name: "Auditor",
    description: "Read-only access to audit log, compliance feed, and DSAR queue.",
    builtIn: true,
    tone: "gray",
    userCount: 1,
    permissions: [
      "leave.audit.view",
      "leave.audit.export",
      "leave.compliance.view",
      "leave.dsar.view",
      "leave.reports.view",
    ],
  },
];

/** Pre-seeded custom roles to demonstrate that the matrix supports them. */
export const SEEDED_CUSTOM_ROLES: RbacRole[] = [
  {
    id: "custom-payroll-readonly",
    name: "Payroll · Read-only",
    description: "External payroll vendor scoped to exports and reports.",
    builtIn: false,
    tone: "gray",
    userCount: 2,
    permissions: [
      "leave.reports.view",
      "leave.exports.view",
    ],
  },
];

/* ================================================================
   3.5.4 Tenant Settings
   ================================================================ */

export type DataResidency = "IN" | "EU" | "US" | "UK" | "APAC";
export type TenantAgentAutonomy = "Manual" | "Supervised" | "Autonomous";

export interface TenantBranding {
  /** Visible product label inside the app (header chip). */
  displayName: string;
  /** Legal name used on emails, PDFs. */
  legalName: string;
  /** Primary brand color HSL or hex (we accept any CSS color). */
  primaryColor: string;
  /** Accent color used on charts and pills. */
  accentColor: string;
  /** Whether to show the "Powered by O2S" footer in emails. */
  poweredByVisible: boolean;
  /** Optional support email shown to employees. */
  supportEmail: string;
}

export interface TenantLanguage {
  code: string;
  label: string;
}

export interface TenantFiscalYear {
  /** Month the fiscal year starts (1-12). */
  startMonth: number;
  /** Day of that month (usually 1). */
  startDay: number;
  /** Display label like "FY2026 (Apr 2026 → Mar 2027)". */
  label: string;
}

export interface TenantDataResidency {
  region: DataResidency;
  /** Sub-processors enabled per region. */
  subProcessors: string[];
  /** Whether cross-border transfers are permitted (with SCCs). */
  crossBorderTransfers: boolean;
}

export interface TenantAgentDefaults {
  /** Org-wide default autonomy level for new agents. */
  defaultAutonomy: TenantAgentAutonomy;
  /** Maximum autonomy level a manager can grant without HR co-sign. */
  managerMaxAutonomy: TenantAgentAutonomy;
  /** Default scope for new agents: "own_team" | "all". */
  defaultScope: "own_team" | "all";
  /** When true, any agent action must be co-signed by a human for the first 30 days. */
  shadowModeOnFirstActivation: boolean;
}

export interface TenantSettings {
  branding: TenantBranding;
  /** Active locales the tenant supports (employees can pick within these). */
  languages: TenantLanguage[];
  /** Default locale for new users. */
  defaultLanguage: string;
  fiscalYear: TenantFiscalYear;
  residency: TenantDataResidency;
  agentDefaults: TenantAgentDefaults;
}

export const AVAILABLE_LANGUAGES: TenantLanguage[] = [
  { code: "en-IN", label: "English (India)" },
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "hi-IN", label: "हिन्दी (Hindi)" },
  { code: "ta-IN", label: "தமிழ் (Tamil)" },
  { code: "de-DE", label: "Deutsch" },
  { code: "fr-FR", label: "Français" },
  { code: "es-ES", label: "Español" },
  { code: "ja-JP", label: "日本語" },
];

/* ================================================================
   3.2.1 Policy Builder + 3.2.2 Leave Types Library
   ================================================================ */

export type EmploymentType = "full_time" | "part_time" | "contractor" | "intern";
export type CohortCountry = "IN" | "UK" | "US" | "DE" | "SG";

export interface PolicyCohort {
  id: string;
  name: string;
  country: CohortCountry;
  employmentType: EmploymentType;
  /** Minimum job level (e.g., "L1" or "L4"). */
  minLevel?: string;
  /** Optional segment filter (e.g., "Engineering" or custom tag). */
  segment?: string;
  /** Approximate user count covered by this cohort. */
  userCount: number;
}

export const POLICY_COHORTS: PolicyCohort[] = [
  { id: "co-in-ft-all",  name: "India · Full-time",       country: "IN", employmentType: "full_time",  userCount: 842 },
  { id: "co-in-ft-l5",   name: "India · Full-time · L5+", country: "IN", employmentType: "full_time",  minLevel: "L5", userCount: 124 },
  { id: "co-in-pt",      name: "India · Part-time",       country: "IN", employmentType: "part_time",  userCount: 18 },
  { id: "co-in-intern",  name: "India · Interns",         country: "IN", employmentType: "intern",     userCount: 22 },
  { id: "co-in-contractor", name: "India · Contractors",  country: "IN", employmentType: "contractor", userCount: 36 },
  { id: "co-uk-ft",      name: "UK · Full-time",          country: "UK", employmentType: "full_time",  userCount: 42 },
  { id: "co-us-ft",      name: "US · Full-time",          country: "US", employmentType: "full_time",  userCount: 68 },
  { id: "co-de-ft",      name: "DE · Full-time",          country: "DE", employmentType: "full_time",  userCount: 9 },
  { id: "co-sg-ft",      name: "Singapore · Full-time",   country: "SG", employmentType: "full_time",  userCount: 11 },
];

export type EntitlementModel = "fixed" | "tenure_tiered" | "hours_worked";
export type AccrualCadence = "monthly_grant" | "annual_upfront" | "hours_based";

export interface TenureTier {
  /** Years of service (inclusive lower bound). */
  fromYears: number;
  /** Days per year for this tier. */
  daysPerYear: number;
}

export interface PolicyDocumentationRule {
  /** Minimum consecutive days that triggers documentation. */
  thresholdDays: number;
  /** What document is required. */
  docType: string;
}

export interface PolicyRule {
  /** Per-cohort policy id (cohort + leave type). */
  id: string;
  cohortId: string;
  leaveTypeKey: LeaveTypeKey;
  /** Display name override (defaults to LEAVE_TYPE_MAP[key].label). */
  nameOverride?: string;
  /** Total days per year for a fixed/tenured entitlement, or hours target for hours-worked. */
  daysPerYear: number;
  entitlementModel: EntitlementModel;
  tenureTiers?: TenureTier[];
  /** For hours_worked: accrue 1 day per N hours. */
  hoursPerDay?: number;
  accrualCadence: AccrualCadence;
  /** Maximum carryover days. 0 = no carryover. */
  carryoverMaxDays: number;
  /** Month/day when carryover expires (e.g., "12-31" = Dec 31, "03-31" = Mar 31). */
  carryoverExpiry?: string;
  encashable: boolean;
  /** Max days that can be encashed per year. */
  encashableMaxPerYear?: number;
  halfDayAllowed: boolean;
  /** True if leave is locked during probation. */
  probationGated: boolean;
  /** Probation period in months. */
  probationMonths?: number;
  documentation?: PolicyDocumentationRule[];
  /** Eligibility filters as readable strings. */
  eligibilityFilters: string[];
  /** Active version number. */
  version: number;
  /** ISO date when this version became effective. */
  effectiveFromISO: string;
  /** True if this rule is archived. */
  archived: boolean;
}

export interface PolicyRevision {
  id: string;
  policyId: string;
  version: number;
  authorName: string;
  whenISO: string;
  whenLabel: string;
  /** Short summary like "Added tenure tier 5+ → 24 days/yr". */
  summary: string;
  /** Diff payload for the side-by-side viewer. */
  changes: { field: string; before: string; after: string }[];
}

export const POLICY_RULES: PolicyRule[] = [
  {
    id: "pr-co-in-ft-all-privileged",
    cohortId: "co-in-ft-all",
    leaveTypeKey: "privileged",
    daysPerYear: 18,
    entitlementModel: "tenure_tiered",
    tenureTiers: [
      { fromYears: 0, daysPerYear: 18 },
      { fromYears: 3, daysPerYear: 21 },
      { fromYears: 5, daysPerYear: 24 },
    ],
    accrualCadence: "monthly_grant",
    carryoverMaxDays: 45,
    carryoverExpiry: "03-31",
    encashable: true,
    encashableMaxPerYear: 15,
    halfDayAllowed: true,
    probationGated: false,
    documentation: [],
    eligibilityFilters: ["Active employee", "Probation cleared"],
    version: 4,
    effectiveFromISO: "2026-04-01",
    archived: false,
  },
  {
    id: "pr-co-in-ft-all-sick",
    cohortId: "co-in-ft-all",
    leaveTypeKey: "sick",
    daysPerYear: 12,
    entitlementModel: "fixed",
    accrualCadence: "monthly_grant",
    carryoverMaxDays: 0,
    encashable: false,
    halfDayAllowed: true,
    probationGated: false,
    documentation: [
      { thresholdDays: 3, docType: "Medical certificate from registered practitioner" },
    ],
    eligibilityFilters: ["Active employee"],
    version: 2,
    effectiveFromISO: "2026-01-01",
    archived: false,
  },
  {
    id: "pr-co-in-ft-all-casual",
    cohortId: "co-in-ft-all",
    leaveTypeKey: "casual",
    daysPerYear: 6,
    entitlementModel: "fixed",
    accrualCadence: "monthly_grant",
    carryoverMaxDays: 0,
    encashable: false,
    halfDayAllowed: true,
    probationGated: true,
    probationMonths: 3,
    eligibilityFilters: ["Active employee"],
    version: 1,
    effectiveFromISO: "2025-04-01",
    archived: false,
  },
  {
    id: "pr-co-in-ft-all-maternity",
    cohortId: "co-in-ft-all",
    leaveTypeKey: "maternity",
    daysPerYear: 182,
    entitlementModel: "fixed",
    accrualCadence: "annual_upfront",
    carryoverMaxDays: 0,
    encashable: false,
    halfDayAllowed: false,
    probationGated: false,
    documentation: [
      { thresholdDays: 1, docType: "Medical certificate confirming pregnancy" },
    ],
    eligibilityFilters: ["Active employee", "Female", "≥80 days worked in last 12 months"],
    version: 1,
    effectiveFromISO: "2025-04-01",
    archived: false,
  },
  {
    id: "pr-co-in-ft-all-paternity",
    cohortId: "co-in-ft-all",
    leaveTypeKey: "paternity",
    daysPerYear: 10,
    entitlementModel: "fixed",
    accrualCadence: "annual_upfront",
    carryoverMaxDays: 0,
    encashable: false,
    halfDayAllowed: false,
    probationGated: false,
    eligibilityFilters: ["Active employee", "Male", "Within 6 months of childbirth"],
    version: 1,
    effectiveFromISO: "2025-04-01",
    archived: false,
  },
  {
    id: "pr-co-in-ft-all-compoff",
    cohortId: "co-in-ft-all",
    leaveTypeKey: "compoff",
    daysPerYear: 0,
    entitlementModel: "hours_worked",
    hoursPerDay: 8,
    accrualCadence: "hours_based",
    carryoverMaxDays: 0,
    encashable: false,
    halfDayAllowed: true,
    probationGated: false,
    eligibilityFilters: ["Active employee", "Worked on declared holiday or weekend"],
    version: 3,
    effectiveFromISO: "2026-04-01",
    archived: false,
  },
  {
    id: "pr-co-in-ft-all-wfa",
    cohortId: "co-in-ft-all",
    leaveTypeKey: "wfa",
    daysPerYear: 30,
    entitlementModel: "fixed",
    accrualCadence: "monthly_grant",
    carryoverMaxDays: 0,
    encashable: false,
    halfDayAllowed: false,
    probationGated: false,
    eligibilityFilters: ["Active employee", "Manager approval required"],
    version: 2,
    effectiveFromISO: "2026-04-01",
    archived: false,
  },
  {
    id: "pr-co-in-ft-all-bereavement",
    cohortId: "co-in-ft-all",
    leaveTypeKey: "bereavement",
    daysPerYear: 5,
    entitlementModel: "fixed",
    accrualCadence: "annual_upfront",
    carryoverMaxDays: 0,
    encashable: false,
    halfDayAllowed: false,
    probationGated: false,
    eligibilityFilters: ["Active employee", "Immediate family only"],
    version: 1,
    effectiveFromISO: "2025-04-01",
    archived: false,
  },
  // UK full-time
  {
    id: "pr-co-uk-ft-privileged",
    cohortId: "co-uk-ft",
    leaveTypeKey: "privileged",
    daysPerYear: 25,
    entitlementModel: "fixed",
    accrualCadence: "monthly_grant",
    carryoverMaxDays: 5,
    carryoverExpiry: "03-31",
    encashable: false,
    halfDayAllowed: true,
    probationGated: false,
    eligibilityFilters: ["Active employee"],
    version: 2,
    effectiveFromISO: "2026-01-01",
    archived: false,
  },
  {
    id: "pr-co-uk-ft-sick",
    cohortId: "co-uk-ft",
    leaveTypeKey: "sick",
    daysPerYear: 28,
    entitlementModel: "fixed",
    accrualCadence: "annual_upfront",
    carryoverMaxDays: 0,
    encashable: false,
    halfDayAllowed: false,
    probationGated: false,
    documentation: [
      { thresholdDays: 7, docType: "Self-certification (SC2)" },
      { thresholdDays: 8, docType: "Fit note from GP" },
    ],
    eligibilityFilters: ["Active employee"],
    version: 1,
    effectiveFromISO: "2025-04-06",
    archived: false,
  },
  // US full-time
  {
    id: "pr-co-us-ft-privileged",
    cohortId: "co-us-ft",
    leaveTypeKey: "privileged",
    daysPerYear: 15,
    entitlementModel: "tenure_tiered",
    tenureTiers: [
      { fromYears: 0, daysPerYear: 15 },
      { fromYears: 2, daysPerYear: 20 },
      { fromYears: 5, daysPerYear: 25 },
    ],
    accrualCadence: "monthly_grant",
    carryoverMaxDays: 5,
    carryoverExpiry: "12-31",
    encashable: false,
    halfDayAllowed: false,
    probationGated: true,
    probationMonths: 6,
    eligibilityFilters: ["Active employee", "Probation cleared"],
    version: 3,
    effectiveFromISO: "2026-01-01",
    archived: false,
  },
  // Intern policy (archived earlier version)
  {
    id: "pr-co-in-intern-privileged",
    cohortId: "co-in-intern",
    leaveTypeKey: "privileged",
    nameOverride: "Internship Privileged Leave",
    daysPerYear: 6,
    entitlementModel: "fixed",
    accrualCadence: "monthly_grant",
    carryoverMaxDays: 0,
    encashable: false,
    halfDayAllowed: true,
    probationGated: false,
    eligibilityFilters: ["Active intern"],
    version: 1,
    effectiveFromISO: "2025-04-01",
    archived: false,
  },
];

export const POLICY_REVISIONS: PolicyRevision[] = [
  {
    id: "rev-pl-v4",
    policyId: "pr-co-in-ft-all-privileged",
    version: 4,
    authorName: "Anita Verma",
    whenISO: "2026-03-12T11:30:00",
    whenLabel: "12 Mar 2026, 11:30 AM",
    summary: "Added L5+ tenure tier (24 days/yr from year 5).",
    changes: [
      { field: "tenureTiers[2]", before: "—", after: "5y → 24 days" },
      { field: "entitlementModel", before: "fixed", after: "tenure_tiered" },
    ],
  },
  {
    id: "rev-pl-v3",
    policyId: "pr-co-in-ft-all-privileged",
    version: 3,
    authorName: "Anita Verma",
    whenISO: "2025-09-04T15:10:00",
    whenLabel: "4 Sep 2025, 3:10 PM",
    summary: "Raised carryover cap 30 → 45 days; expiry moved to FY end.",
    changes: [
      { field: "carryoverMaxDays", before: "30", after: "45" },
      { field: "carryoverExpiry", before: "12-31", after: "03-31" },
    ],
  },
  {
    id: "rev-pl-v2",
    policyId: "pr-co-in-ft-all-privileged",
    version: 2,
    authorName: "Anita Verma",
    whenISO: "2025-04-01T09:00:00",
    whenLabel: "1 Apr 2025, 9:00 AM",
    summary: "Enabled encashment up to 15 days/yr.",
    changes: [
      { field: "encashable", before: "false", after: "true" },
      { field: "encashableMaxPerYear", before: "—", after: "15" },
    ],
  },
  {
    id: "rev-pl-v1",
    policyId: "pr-co-in-ft-all-privileged",
    version: 1,
    authorName: "System",
    whenISO: "2024-04-01T00:00:00",
    whenLabel: "1 Apr 2024",
    summary: "Initial policy: 18 days/yr, monthly accrual, 30-day carryover.",
    changes: [
      { field: "daysPerYear", before: "—", after: "18" },
      { field: "accrualCadence", before: "—", after: "monthly_grant" },
      { field: "carryoverMaxDays", before: "—", after: "30" },
    ],
  },
  {
    id: "rev-cl-v1",
    policyId: "pr-co-in-ft-all-casual",
    version: 1,
    authorName: "Anita Verma",
    whenISO: "2025-04-01T09:00:00",
    whenLabel: "1 Apr 2025, 9:00 AM",
    summary: "Initial casual leave: 6 days/yr, monthly grant, no carryover.",
    changes: [
      { field: "daysPerYear", before: "—", after: "6" },
      { field: "probationGated", before: "—", after: "true" },
    ],
  },
  {
    id: "rev-sick-v2",
    policyId: "pr-co-in-ft-all-sick",
    version: 2,
    authorName: "Anita Verma",
    whenISO: "2026-01-01T00:00:00",
    whenLabel: "1 Jan 2026",
    summary: "Required medical certificate after 3 consecutive days (was 5).",
    changes: [
      { field: "documentation[0].thresholdDays", before: "5", after: "3" },
    ],
  },
  {
    id: "rev-us-pl-v3",
    policyId: "pr-co-us-ft-privileged",
    version: 3,
    authorName: "Anita Verma",
    whenISO: "2025-12-15T14:00:00",
    whenLabel: "15 Dec 2025, 2:00 PM",
    summary: "Updated tenure tiers to match competitor benchmark.",
    changes: [
      { field: "tenureTiers[1]", before: "3y → 18", after: "2y → 20" },
      { field: "tenureTiers[2]", before: "5y → 22", after: "5y → 25" },
    ],
  },
];

export interface PolicySimulation {
  /** Number of employees covered. */
  affectedEmployees: number;
  /** Total day-balance delta across the cohort (positive = more days granted). */
  totalDaysDelta: number;
  /** Per-employee average delta. */
  avgDaysDeltaPerEmployee: number;
  /** Indicative liability change in INR. */
  liabilityDeltaINR: number;
  /** A few example employees to show in the preview. */
  sampleEmployees: { name: string; currentDays: number; newDays: number }[];
  /** Whether any active requests would be invalidated. */
  invalidRequestsCount: number;
  /** Warnings about jurisdictional or compliance impact. */
  warnings: string[];
}

/**
 * Roughly simulate the impact of changing a policy's daysPerYear.
 * Pure-function; safe to call during render.
 */
export function simulatePolicyChange(
  rule: PolicyRule,
  newDaysPerYear: number,
): PolicySimulation {
  const cohort = POLICY_COHORTS.find((c) => c.id === rule.cohortId);
  const affected = cohort?.userCount ?? 0;
  const delta = newDaysPerYear - rule.daysPerYear;
  const total = delta * affected;
  // Roughly: ₹3,500/day for IN; ₹8,000/day for UK/US/DE; ₹6,500/day for SG
  const ratePerDay = cohort?.country === "IN" ? 3_500 : cohort?.country === "SG" ? 6_500 : 8_000;
  return {
    affectedEmployees: affected,
    totalDaysDelta: total,
    avgDaysDeltaPerEmployee: delta,
    liabilityDeltaINR: Math.round(total * ratePerDay),
    sampleEmployees: [
      { name: "Priya Singh",     currentDays: rule.daysPerYear,     newDays: newDaysPerYear },
      { name: "Rajiv Kumar",     currentDays: rule.daysPerYear + 3, newDays: newDaysPerYear + 3 },
      { name: "Anita Verma",     currentDays: rule.daysPerYear + 6, newDays: newDaysPerYear + 6 },
    ],
    invalidRequestsCount: delta < 0 ? Math.max(0, Math.round(affected * 0.04)) : 0,
    warnings:
      delta < 0
        ? ["Reducing entitlements may breach prior-year notice requirements in some jurisdictions."]
        : delta > 5
        ? ["Large increases should be reviewed by Finance for liability impact."]
        : [],
  };
}

export const DEFAULT_TENANT_SETTINGS: TenantSettings = {
  branding: {
    displayName: "Latent Bridge",
    legalName: "Latent Bridge Pvt Ltd",
    primaryColor: "#7C3AED",
    accentColor: "#14B8A6",
    poweredByVisible: true,
    supportEmail: "people-ops@latentbridge.com",
  },
  languages: [
    { code: "en-IN", label: "English (India)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "hi-IN", label: "हिन्दी (Hindi)" },
  ],
  defaultLanguage: "en-IN",
  fiscalYear: {
    startMonth: 4,
    startDay: 1,
    label: "FY2026 (Apr 2026 → Mar 2027)",
  },
  residency: {
    region: "IN",
    subProcessors: ["AWS Mumbai (ap-south-1)", "Snowflake India", "Twilio India"],
    crossBorderTransfers: false,
  },
  agentDefaults: {
    defaultAutonomy: "Supervised",
    managerMaxAutonomy: "Supervised",
    defaultScope: "own_team",
    shadowModeOnFirstActivation: true,
  },
};
