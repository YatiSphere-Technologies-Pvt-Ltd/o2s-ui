/* ================================================================
   O2S Legal — Compliance Dashboard Data
   ================================================================ */

export type ComplianceTab = "calendar" | "filings" | "jurisdictions" | "audit" | "analytics";

export const COMPLIANCE_TABS: { key: ComplianceTab; label: string; count?: number }[] = [
  { key: "calendar", label: "Calendar" },
  { key: "filings", label: "Filings" },
  { key: "jurisdictions", label: "Jurisdiction Map" },
  { key: "audit", label: "Audit Trail" },
  { key: "analytics", label: "Analytics" },
];

/* ── Filing Status Config ── */

export type FilingStatus = "upcoming" | "due_soon" | "overdue" | "in_progress" | "filed" | "acknowledged" | "not_applicable";

export const FILING_STATUS_CONFIG: Record<FilingStatus, { label: string; dotClass: string; textClass: string; bgClass: string }> = {
  upcoming:       { label: "Upcoming",       dotClass: "bg-brand",            textClass: "text-brand",            bgClass: "bg-brand/10" },
  due_soon:       { label: "Due Soon",       dotClass: "bg-warning",          textClass: "text-warning",          bgClass: "bg-warning/10" },
  overdue:        { label: "Overdue",        dotClass: "bg-destructive",      textClass: "text-destructive",      bgClass: "bg-destructive/10" },
  in_progress:    { label: "In Progress",    dotClass: "bg-brand-purple",     textClass: "text-brand-purple",     bgClass: "bg-brand-purple/10" },
  filed:          { label: "Filed",          dotClass: "bg-success",          textClass: "text-success",          bgClass: "bg-success/10" },
  acknowledged:   { label: "Acknowledged",   dotClass: "bg-success",          textClass: "text-success",          bgClass: "bg-success/10" },
  not_applicable: { label: "N/A",            dotClass: "bg-muted-foreground", textClass: "text-muted-foreground", bgClass: "bg-secondary" },
};

/* ── Filing ── */

export interface ComplianceFiling {
  id: string;
  entityName: string;
  entityId: string;
  country: string;
  jurisdiction: string;
  filingName: string;
  filingCode: string;
  category: string;
  authority: string;
  frequency: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  status: FilingStatus;
  filedDate: string | null;
  filedBy: string | null;
  acknowledgedRef: string | null;
  assignedTo: string;
  penaltyOnLate: boolean;
  penaltyDescription: string | null;
  penaltyAmount: number | null;
  penaltyCurrency: string | null;
  daysLateOrRemaining: number;
  aiNote: string | null;
}

export const FILINGS: ComplianceFiling[] = [
  { id: "FIL-023", entityName: "Latent Bridge Technologies Pvt Ltd", entityId: "ENT-001", country: "India", jurisdiction: "Maharashtra, India", filingName: "PF Monthly Return", filingCode: "IN-PF-MONTHLY", category: "Provident Fund", authority: "EPFO", frequency: "Monthly", periodStart: "Feb 1", periodEnd: "Feb 28", dueDate: "Mar 15", status: "overdue", filedDate: null, filedBy: null, acknowledgedRef: null, assignedTo: "Rekha Gupta", penaltyOnLate: true, penaltyDescription: "₹5,000/month + 12% interest", penaltyAmount: 5000, penaltyCurrency: "INR", daysLateOrRemaining: -11, aiNote: "PF interest rate revised to 8.15% for FY 2025-26. Ensure updated rate." },
  { id: "FIL-022", entityName: "Latent Bridge Technologies Pvt Ltd", entityId: "ENT-001", country: "India", jurisdiction: "Maharashtra, India", filingName: "ESI Monthly Return", filingCode: "IN-ESI-MONTHLY", category: "Employee Insurance", authority: "ESIC", frequency: "Monthly", periodStart: "Feb 1", periodEnd: "Feb 28", dueDate: "Mar 15", status: "filed", filedDate: "Mar 12", filedBy: "Rekha Gupta", acknowledgedRef: "ESI/MH/2026/02/00145", assignedTo: "Rekha Gupta", penaltyOnLate: true, penaltyDescription: "12% interest + ₹5,000/day", penaltyAmount: null, penaltyCurrency: null, daysLateOrRemaining: 0, aiNote: null },
  { id: "FIL-025", entityName: "Latent Bridge Technologies Pvt Ltd", entityId: "ENT-001", country: "India", jurisdiction: "Maharashtra, India", filingName: "Professional Tax Monthly", filingCode: "IN-PT-MONTHLY", category: "Professional Tax", authority: "MH PT Department", frequency: "Monthly", periodStart: "Mar 1", periodEnd: "Mar 31", dueDate: "Mar 31", status: "due_soon", filedDate: null, filedBy: null, acknowledgedRef: null, assignedTo: "Rekha Gupta", penaltyOnLate: true, penaltyDescription: "₹1,000/month delay", penaltyAmount: 1000, penaltyCurrency: "INR", daysLateOrRemaining: 4, aiNote: null },
  { id: "FIL-026", entityName: "Latent Bridge Technologies Pvt Ltd", entityId: "ENT-001", country: "India", jurisdiction: "India", filingName: "TDS Quarterly Return (Q4)", filingCode: "IN-TDS-QUARTERLY", category: "Income Tax TDS", authority: "Income Tax Department", frequency: "Quarterly", periodStart: "Jan 1", periodEnd: "Mar 31", dueDate: "Mar 31", status: "due_soon", filedDate: null, filedBy: null, acknowledgedRef: null, assignedTo: "Anil Kumar", penaltyOnLate: true, penaltyDescription: "₹200/day delay", penaltyAmount: null, penaltyCurrency: null, daysLateOrRemaining: 4, aiNote: null },
  { id: "FIL-021", entityName: "Latent Bridge Technologies Pvt Ltd", entityId: "ENT-001", country: "India", jurisdiction: "India", filingName: "GST Monthly Return (GSTR-3B)", filingCode: "IN-GST-MONTHLY", category: "GST", authority: "GST Portal", frequency: "Monthly", periodStart: "Feb 1", periodEnd: "Feb 28", dueDate: "Mar 10", status: "filed", filedDate: "Mar 8", filedBy: "Anil Kumar", acknowledgedRef: null, assignedTo: "Anil Kumar", penaltyOnLate: false, penaltyDescription: null, penaltyAmount: null, penaltyCurrency: null, daysLateOrRemaining: 0, aiNote: null },
  { id: "FIL-030", entityName: "Latent Bridge Technologies Pvt Ltd", entityId: "ENT-001", country: "India", jurisdiction: "India", filingName: "ROC Annual Filing", filingCode: "IN-ROC-ANNUAL", category: "Corporate Filing", authority: "MCA", frequency: "Annual", periodStart: "Apr 1, 2025", periodEnd: "Mar 31, 2026", dueDate: "Sep 30", status: "upcoming", filedDate: null, filedBy: null, acknowledgedRef: null, assignedTo: "Anil Kumar", penaltyOnLate: true, penaltyDescription: "₹100/day delay", penaltyAmount: null, penaltyCurrency: null, daysLateOrRemaining: 187, aiNote: null },
  { id: "FIL-031", entityName: "Latent Bridge Technologies Pvt Ltd", entityId: "ENT-001", country: "India", jurisdiction: "India", filingName: "POSH Annual Return", filingCode: "IN-POSH-ANNUAL", category: "POSH Compliance", authority: "District Officer", frequency: "Annual", periodStart: "Jan 1, 2025", periodEnd: "Dec 31, 2025", dueDate: "Dec 31", status: "upcoming", filedDate: null, filedBy: null, acknowledgedRef: null, assignedTo: "Meera Krishnan", penaltyOnLate: false, penaltyDescription: null, penaltyAmount: null, penaltyCurrency: null, daysLateOrRemaining: 279, aiNote: null },
  // US
  { id: "FIL-040", entityName: "Latent Bridge Inc", entityId: "ENT-002", country: "US", jurisdiction: "California, US", filingName: "EEO-1 Report", filingCode: "US-EEO1-ANNUAL", category: "EEO Reporting", authority: "EEOC", frequency: "Annual", periodStart: "Jan 1, 2025", periodEnd: "Dec 31, 2025", dueDate: "Jun 30", status: "upcoming", filedDate: null, filedBy: null, acknowledgedRef: null, assignedTo: "Sarah Mitchell", penaltyOnLate: false, penaltyDescription: null, penaltyAmount: null, penaltyCurrency: null, daysLateOrRemaining: 95, aiNote: null },
  { id: "FIL-041", entityName: "Latent Bridge Inc", entityId: "ENT-002", country: "US", jurisdiction: "US", filingName: "OSHA 300A Posting", filingCode: "US-OSHA-300A", category: "OSHA Compliance", authority: "OSHA", frequency: "Annual", periodStart: "Jan 1, 2025", periodEnd: "Dec 31, 2025", dueDate: "Mar 1", status: "filed", filedDate: "Feb 28", filedBy: "Sarah Mitchell", acknowledgedRef: null, assignedTo: "Sarah Mitchell", penaltyOnLate: true, penaltyDescription: "$15,625/violation", penaltyAmount: 15625, penaltyCurrency: "USD", daysLateOrRemaining: 0, aiNote: null },
  { id: "FIL-042", entityName: "Latent Bridge Inc", entityId: "ENT-002", country: "US", jurisdiction: "California, US", filingName: "CA State Tax (DE 9)", filingCode: "US-CA-STATE-TAX", category: "State Tax", authority: "California EDD", frequency: "Quarterly", periodStart: "Jan 1", periodEnd: "Mar 31", dueDate: "Apr 30", status: "upcoming", filedDate: null, filedBy: null, acknowledgedRef: null, assignedTo: "Mike Chen", penaltyOnLate: true, penaltyDescription: "Varies", penaltyAmount: null, penaltyCurrency: null, daysLateOrRemaining: 34, aiNote: null },
  { id: "FIL-043", entityName: "Latent Bridge Inc", entityId: "ENT-002", country: "US", jurisdiction: "US", filingName: "Federal Tax (Form 941)", filingCode: "US-FED-TAX-941", category: "Federal Tax", authority: "IRS", frequency: "Quarterly", periodStart: "Jan 1", periodEnd: "Mar 31", dueDate: "Apr 30", status: "upcoming", filedDate: null, filedBy: null, acknowledgedRef: null, assignedTo: "Mike Chen", penaltyOnLate: true, penaltyDescription: "5% of unpaid tax/month", penaltyAmount: null, penaltyCurrency: null, daysLateOrRemaining: 34, aiNote: null },
  // UAE
  { id: "FIL-050", entityName: "Latent Bridge DMCC", entityId: "ENT-003", country: "UAE", jurisdiction: "Dubai, UAE", filingName: "WPS Compliance Report", filingCode: "UAE-WPS-MONTHLY", category: "WPS Compliance", authority: "MOHRE", frequency: "Monthly", periodStart: "Mar 1", periodEnd: "Mar 31", dueDate: "Apr 20", status: "upcoming", filedDate: null, filedBy: null, acknowledgedRef: null, assignedTo: "Ahmed Al Rashid", penaltyOnLate: true, penaltyDescription: "AED 50,000 fine + establishment ban", penaltyAmount: 50000, penaltyCurrency: "AED", daysLateOrRemaining: 24, aiNote: null },
  { id: "FIL-051", entityName: "Latent Bridge DMCC", entityId: "ENT-003", country: "UAE", jurisdiction: "Dubai, UAE", filingName: "Labor Card Renewal", filingCode: "UAE-LABOR-CARD", category: "Labor Card", authority: "MOHRE", frequency: "Annual", periodStart: "—", periodEnd: "—", dueDate: "Mar 15", status: "filed", filedDate: "Mar 10", filedBy: "Ahmed Al Rashid", acknowledgedRef: null, assignedTo: "Ahmed Al Rashid", penaltyOnLate: false, penaltyDescription: null, penaltyAmount: null, penaltyCurrency: null, daysLateOrRemaining: 0, aiNote: null },
  { id: "FIL-052", entityName: "Latent Bridge DMCC", entityId: "ENT-003", country: "UAE", jurisdiction: "Dubai, UAE", filingName: "End of Service Provision", filingCode: "UAE-EOS-PROVISION", category: "End of Service", authority: "Internal", frequency: "Monthly", periodStart: "Mar 1", periodEnd: "Mar 31", dueDate: "Mar 1", status: "filed", filedDate: "Mar 1", filedBy: "Finance Team", acknowledgedRef: null, assignedTo: "Finance Team", penaltyOnLate: false, penaltyDescription: null, penaltyAmount: null, penaltyCurrency: null, daysLateOrRemaining: 0, aiNote: null },
];

/* ── Jurisdiction Profiles ── */

export interface JurisdictionProfile {
  entityName: string;
  entityId: string;
  country: string;
  jurisdiction: string;
  colorClass: string;
  score: number;
  totalFilings: number;
  filed: number;
  overdue: number;
  upcoming: number;
  dueSoon: number;
  registrations: { type: string; number: string; status: "active" | "expired" | "pending" }[];
  complianceOfficer: string;
}

export const JURISDICTION_PROFILES: JurisdictionProfile[] = [
  { entityName: "Latent Bridge Technologies Pvt Ltd", entityId: "ENT-001", country: "India", jurisdiction: "Maharashtra, India", colorClass: "border-brand-purple", score: 87, totalFilings: 7, filed: 3, overdue: 1, upcoming: 1, dueSoon: 2, registrations: [{ type: "PF Registration", number: "MHPUN0012345", status: "active" }, { type: "ESI Registration", number: "31000123456", status: "active" }, { type: "PT Registration", number: "PTMH001234", status: "active" }, { type: "S&E License", number: "SE/MH/PUN/2024/001", status: "active" }], complianceOfficer: "Rekha Gupta" },
  { entityName: "Latent Bridge Inc", entityId: "ENT-002", country: "US", jurisdiction: "California, US", colorClass: "border-brand", score: 100, totalFilings: 4, filed: 2, overdue: 0, upcoming: 2, dueSoon: 0, registrations: [{ type: "EIN", number: "XX-XXXXXXX", status: "active" }, { type: "CA EDD Number", number: "XXX-XXXX-X", status: "active" }], complianceOfficer: "Sarah Mitchell" },
  { entityName: "Latent Bridge DMCC", entityId: "ENT-003", country: "UAE", jurisdiction: "Dubai, UAE", colorClass: "border-success", score: 100, totalFilings: 3, filed: 2, overdue: 0, upcoming: 1, dueSoon: 0, registrations: [{ type: "Trade License", number: "DMCC-XXXX-2024", status: "active" }, { type: "Labor Card", number: "MOL-XXXX-2026", status: "active" }], complianceOfficer: "Ahmed Al Rashid" },
];

/* ── Audit Trail ── */

export interface AuditEntry {
  id: string;
  date: string;
  time: string;
  actor: string;
  isAI: boolean;
  action: string;
  detail: string;
  entity: string;
  filingId: string | null;
  hasDocument: boolean;
}

export const AUDIT_TRAIL: AuditEntry[] = [
  { id: "aud1", date: "Mar 26", time: "10:42 AM", actor: "Compliance Agent", isAI: true, action: "Sent overdue escalation", detail: "PF Monthly Return (Feb 2026) escalated to CEO", entity: "LB India", filingId: "FIL-023", hasDocument: false },
  { id: "aud2", date: "Mar 22", time: "09:15 AM", actor: "Rekha Gupta", isAI: false, action: "Marked ESI Monthly Return as Filed", detail: "Reference: ESI/MH/2026/02/00145", entity: "LB India", filingId: "FIL-022", hasDocument: true },
  { id: "aud3", date: "Mar 18", time: "02:30 PM", actor: "Compliance Agent", isAI: true, action: "Sent overdue reminder", detail: "PF Monthly Return to Rekha Gupta + Meera Krishnan", entity: "LB India", filingId: "FIL-023", hasDocument: false },
  { id: "aud4", date: "Mar 18", time: "11:00 AM", actor: "Anil Kumar", isAI: false, action: "Uploaded supporting documents", detail: "GST Monthly Return (Feb 2026): GST_Workbook_Feb.xlsx", entity: "LB India", filingId: "FIL-021", hasDocument: true },
  { id: "aud5", date: "Mar 14", time: "09:00 AM", actor: "Compliance Agent", isAI: true, action: "Sent 1-day reminder", detail: "PF Monthly Return to Rekha Gupta", entity: "LB India", filingId: "FIL-023", hasDocument: false },
  { id: "aud6", date: "Mar 10", time: "04:30 PM", actor: "Ahmed Al Rashid", isAI: false, action: "Marked Labor Card Renewal as Filed", detail: "Filed ahead of deadline", entity: "LB UAE", filingId: "FIL-051", hasDocument: true },
  { id: "aud7", date: "Mar 8", time: "11:30 AM", actor: "Anil Kumar", isAI: false, action: "Marked GST Monthly Return as Filed", detail: "Filed 2 days early", entity: "LB India", filingId: "FIL-021", hasDocument: true },
  { id: "aud8", date: "Mar 1", time: "09:00 AM", actor: "Finance Team", isAI: false, action: "Marked EOS Provision as Filed", detail: "Monthly provision recorded", entity: "LB UAE", filingId: "FIL-052", hasDocument: false },
  { id: "aud9", date: "Feb 28", time: "05:00 PM", actor: "Sarah Mitchell", isAI: false, action: "Marked OSHA 300A as Filed", detail: "Posted as required", entity: "LB US", filingId: "FIL-041", hasDocument: true },
  { id: "aud10", date: "Feb 15", time: "10:00 AM", actor: "Compliance Agent", isAI: true, action: "Regulatory update detected", detail: "Maharashtra minimum wage revised effective Apr 2026", entity: "LB India", filingId: null, hasDocument: false },
];

/* ── KPIs ── */

export const COMPLIANCE_KPIS = [
  { label: "Overall Score", value: "94%", trend: "+2% vs last quarter", positive: true, isScore: true },
  { label: "On-Time Filing Rate", value: "96.2%", trend: "+1.5% vs quarter", positive: true },
  { label: "Due This Month", value: "7", subtext: "3 filed · 4 pending", positive: true },
  { label: "Overdue Filings", value: "1", subtext: "PF Feb (LB India)", positive: false },
  { label: "Penalty Exposure", value: "₹15,000", trend: "↓ vs last month", positive: true },
];

/* ── Analytics Data ── */

export const FILING_BY_STATUS = [
  { status: "Filed On Time", count: 38, pct: 90.5 },
  { status: "Filed Late", count: 2, pct: 4.8 },
  { status: "Overdue", count: 1, pct: 2.4 },
  { status: "Upcoming", count: 1, pct: 2.4 },
];

export const FILING_BY_CATEGORY = [
  { category: "PF", onTime: 10, late: 2 },
  { category: "ESI", onTime: 12, late: 0 },
  { category: "PT", onTime: 12, late: 0 },
  { category: "GST", onTime: 12, late: 0 },
  { category: "TDS", onTime: 3, late: 1 },
  { category: "WPS", onTime: 11, late: 0 },
];

export const ENTITY_SCORES = [
  { entity: "LB India", score: 87, colorClass: "bg-brand-purple" },
  { entity: "LB US", score: 100, colorClass: "bg-brand" },
  { entity: "LB UAE", score: 100, colorClass: "bg-success" },
];

/* ── Counts ── */

export const COMPLIANCE_COUNTS = {
  totalFilings: FILINGS.length,
  filed: FILINGS.filter((f) => f.status === "filed" || f.status === "acknowledged").length,
  overdue: FILINGS.filter((f) => f.status === "overdue").length,
  dueSoon: FILINGS.filter((f) => f.status === "due_soon").length,
  upcoming: FILINGS.filter((f) => f.status === "upcoming").length,
  entities: JURISDICTION_PROFILES.length,
};

/* ── Calendar Data ── */

export interface CalendarFiling {
  day: number;
  filingName: string;
  entity: string;
  country: string;
  status: FilingStatus;
}

export const MARCH_CALENDAR: CalendarFiling[] = [
  { day: 1, filingName: "EOS Provision", entity: "LB UAE", country: "UAE", status: "filed" },
  { day: 1, filingName: "OSHA 300A", entity: "LB US", country: "US", status: "filed" },
  { day: 7, filingName: "ESI (Feb)", entity: "LB India", country: "India", status: "filed" },
  { day: 8, filingName: "GST (Feb)", entity: "LB India", country: "India", status: "filed" },
  { day: 10, filingName: "Labor Card", entity: "LB UAE", country: "UAE", status: "filed" },
  { day: 15, filingName: "PF Return (Feb)", entity: "LB India", country: "India", status: "overdue" },
  { day: 15, filingName: "ESI Return (Feb)", entity: "LB India", country: "India", status: "filed" },
  { day: 25, filingName: "TDS (Q4)", entity: "LB India", country: "India", status: "due_soon" },
  { day: 31, filingName: "Professional Tax", entity: "LB India", country: "India", status: "due_soon" },
  { day: 31, filingName: "ROC Filing", entity: "LB India", country: "India", status: "upcoming" },
];
