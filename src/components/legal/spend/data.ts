/* ================================================================
   O2S Legal — Outside Counsel & Legal Spend
   ================================================================ */

export type SpendTab = "firms" | "engagements" | "invoices" | "budget" | "analytics";

export const SPEND_TABS: { key: SpendTab; label: string; count?: number }[] = [
  { key: "firms", label: "Law Firms" },
  { key: "engagements", label: "Engagements" },
  { key: "invoices", label: "Invoices", count: 3 },
  { key: "budget", label: "Budget" },
  { key: "analytics", label: "Analytics" },
];

/* ── Firm Config ── */

export type FirmTier = "panel" | "preferred" | "approved" | "ad_hoc";
export type FirmStatus = "active" | "inactive" | "under_review";

export const TIER_CONFIG: Record<FirmTier, { label: string; colorClass: string; bgClass: string; borderClass: string }> = {
  panel:     { label: "Panel",     colorClass: "text-destructive",      bgClass: "bg-destructive/10", borderClass: "border-l-destructive" },
  preferred: { label: "Preferred", colorClass: "text-brand-purple",     bgClass: "bg-brand-purple/10", borderClass: "border-l-brand-purple" },
  approved:  { label: "Approved",  colorClass: "text-brand",            bgClass: "bg-brand/10", borderClass: "border-l-brand" },
  ad_hoc:    { label: "Ad Hoc",    colorClass: "text-muted-foreground", bgClass: "bg-secondary", borderClass: "border-l-muted-foreground" },
};

export const FIRM_STATUS_CONFIG: Record<FirmStatus, { label: string; dotClass: string }> = {
  active:       { label: "Active",       dotClass: "bg-success" },
  inactive:     { label: "Inactive",     dotClass: "bg-muted-foreground" },
  under_review: { label: "Under Review", dotClass: "bg-warning" },
};

/* ── Invoice Config ── */

export type InvoiceStatus = "received" | "under_review" | "ai_flagged" | "approved" | "disputed" | "paid" | "rejected";

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, { label: string; dotClass: string; textClass: string; bgClass: string }> = {
  received:     { label: "Received",     dotClass: "bg-brand",            textClass: "text-brand",            bgClass: "bg-brand/10" },
  under_review: { label: "Under Review", dotClass: "bg-warning",          textClass: "text-warning",          bgClass: "bg-warning/10" },
  ai_flagged:   { label: "AI Flagged",   dotClass: "bg-destructive",      textClass: "text-destructive",      bgClass: "bg-destructive/10" },
  approved:     { label: "Approved",     dotClass: "bg-success",          textClass: "text-success",          bgClass: "bg-success/10" },
  disputed:     { label: "Disputed",     dotClass: "bg-destructive",      textClass: "text-destructive",      bgClass: "bg-destructive/10" },
  paid:         { label: "Paid",         dotClass: "bg-success",          textClass: "text-success",          bgClass: "bg-success/10" },
  rejected:     { label: "Rejected",     dotClass: "bg-muted-foreground", textClass: "text-muted-foreground", bgClass: "bg-secondary" },
};

export type EngagementStatus = "active" | "paused" | "completed" | "terminated";

export const ENGAGEMENT_STATUS_CONFIG: Record<EngagementStatus, { label: string; dotClass: string; textClass: string }> = {
  active:     { label: "Active",     dotClass: "bg-success",          textClass: "text-success" },
  paused:     { label: "Paused",     dotClass: "bg-warning",          textClass: "text-warning" },
  completed:  { label: "Completed",  dotClass: "bg-brand-teal",       textClass: "text-brand-teal" },
  terminated: { label: "Terminated", dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
};

/* ── Law Firms ── */

export interface LawFirm {
  id: string;
  name: string;
  tier: FirmTier;
  status: FirmStatus;
  description: string;
  headquarters: string;
  offices: string[];
  practiceAreas: string[];
  primaryContact: { name: string; title: string; email: string };
  negotiatedDiscount: number;
  performanceRating: number;
  ytdSpend: string;
  lastYearSpend: string;
  currency: string;
  activeEngagements: number;
  rateCardSummary: { role: string; negotiatedRate: string }[];
}

export const FIRMS: LawFirm[] = [
  { id: "firm-001", name: "Morrison & Foerster LLP", tier: "panel", status: "active", description: "Global firm with leading IP litigation and patent prosecution practice.", headquarters: "San Francisco, CA", offices: ["SF", "NYC", "DC", "Tokyo", "London"], practiceAreas: ["IP", "Litigation", "Corporate"], primaryContact: { name: "Jennifer Park", title: "Partner, IP Litigation", email: "jpark@mofo.com" }, negotiatedDiscount: 12, performanceRating: 4.8, ytdSpend: "$185,000", lastYearSpend: "$320,000", currency: "USD", activeEngagements: 1, rateCardSummary: [{ role: "Partner", negotiatedRate: "$750/hr" }, { role: "Sr Associate", negotiatedRate: "$550/hr" }, { role: "Associate", negotiatedRate: "$425/hr" }] },
  { id: "firm-002", name: "AZB & Partners", tier: "panel", status: "active", description: "India's leading full-service law firm for regulatory, corporate, and employment matters.", headquarters: "Mumbai, India", offices: ["Mumbai", "Delhi", "Bangalore", "Pune"], practiceAreas: ["Regulatory", "Corporate", "Employment", "Tax", "Data Privacy"], primaryContact: { name: "Rahul Makhija", title: "Partner, Regulatory", email: "r.makhija@azbpartners.com" }, negotiatedDiscount: 14, performanceRating: 4.5, ytdSpend: "₹45L", lastYearSpend: "₹82L", currency: "INR", activeEngagements: 1, rateCardSummary: [{ role: "Partner", negotiatedRate: "₹30K/hr" }, { role: "Sr Associate", negotiatedRate: "₹19K/hr" }] },
  { id: "firm-003", name: "Al Tamimi & Company", tier: "preferred", status: "active", description: "Leading Middle East law firm for UAE employment, commercial, and regulatory.", headquarters: "Dubai, UAE", offices: ["Dubai", "Abu Dhabi", "Riyadh", "Doha"], practiceAreas: ["Employment", "Corporate", "Regulatory", "Immigration"], primaryContact: { name: "Samir Kantaria", title: "Partner, Employment", email: "s.kantaria@tamimi.com" }, negotiatedDiscount: 10, performanceRating: 4.2, ytdSpend: "AED 32K", lastYearSpend: "AED 55K", currency: "AED", activeEngagements: 0, rateCardSummary: [{ role: "Partner", negotiatedRate: "AED 2,200/hr" }, { role: "Sr Associate", negotiatedRate: "AED 1,600/hr" }] },
  { id: "firm-004", name: "Baker & McKenzie", tier: "approved", status: "active", description: "Global firm used for cross-border M&A and international employment advice.", headquarters: "Chicago, IL", offices: ["Chicago", "London", "Hong Kong", "Singapore"], practiceAreas: ["Corporate", "Employment", "Tax"], primaryContact: { name: "David Chen", title: "Partner, Employment", email: "d.chen@bakermckenzie.com" }, negotiatedDiscount: 8, performanceRating: 4.0, ytdSpend: "$42,000", lastYearSpend: "$65,000", currency: "USD", activeEngagements: 1, rateCardSummary: [{ role: "Partner", negotiatedRate: "$680/hr" }, { role: "Associate", negotiatedRate: "$420/hr" }] },
  { id: "firm-005", name: "Khaitan & Co", tier: "approved", status: "active", description: "Leading India firm for employment disputes and labor law advisory.", headquarters: "Mumbai, India", offices: ["Mumbai", "Delhi", "Kolkata", "Bangalore"], practiceAreas: ["Employment", "Litigation"], primaryContact: { name: "Sudha Raghunathan", title: "Partner, Employment", email: "s.raghunathan@khaitanco.com" }, negotiatedDiscount: 10, performanceRating: 4.3, ytdSpend: "₹18L", lastYearSpend: "₹35L", currency: "INR", activeEngagements: 0, rateCardSummary: [{ role: "Partner", negotiatedRate: "₹25K/hr" }] },
];

/* ── Engagements ── */

export interface Engagement {
  id: string;
  engagementNumber: string;
  firmId: string;
  firmName: string;
  status: EngagementStatus;
  title: string;
  practiceArea: string;
  linkedMatter: string | null;
  feeArrangement: string;
  budget: string;
  actualSpend: string;
  budgetUtilization: number;
  leadPartner: string;
  startDate: string;
  endDate: string | null;
  totalInvoiced: string;
  outstandingBalance: string;
}

export const ENGAGEMENTS: Engagement[] = [
  { id: "eng-001", engagementNumber: "ENG-2026-001", firmId: "firm-001", firmName: "Morrison & Foerster LLP", status: "active", title: "Patent Defense — NeuralTech Inc v. Latent Bridge", practiceArea: "IP Litigation", linkedMatter: "MTR-001: NeuralTech Patent Dispute", feeArrangement: "Hourly", budget: "$250,000", actualSpend: "$185,000", budgetUtilization: 74, leadPartner: "Jennifer Park", startDate: "Feb 15, 2026", endDate: null, totalInvoiced: "$185,000", outstandingBalance: "$43,590" },
  { id: "eng-002", engagementNumber: "ENG-2026-002", firmId: "firm-002", firmName: "AZB & Partners", status: "active", title: "SEBI Regulatory Inquiry — ESOP Compliance", practiceArea: "Regulatory", linkedMatter: "MTR-003: SEBI Inquiry", feeArrangement: "Hourly", budget: "₹15L", actualSpend: "₹8.2L", budgetUtilization: 55, leadPartner: "Rahul Makhija", startDate: "Mar 5, 2026", endDate: null, totalInvoiced: "₹8.2L", outstandingBalance: "₹2.4L" },
  { id: "eng-003", engagementNumber: "ENG-2026-003", firmId: "firm-004", firmName: "Baker & McKenzie", status: "active", title: "Employment Advisory — US Expansion", practiceArea: "Employment", linkedMatter: null, feeArrangement: "Blended", budget: "$60,000", actualSpend: "$42,000", budgetUtilization: 70, leadPartner: "David Chen", startDate: "Jan 10, 2026", endDate: "Jun 30, 2026", totalInvoiced: "$42,000", outstandingBalance: "$0" },
  { id: "eng-004", engagementNumber: "ENG-2025-008", firmId: "firm-002", firmName: "AZB & Partners", status: "completed", title: "DPDP Act Implementation Advisory", practiceArea: "Data Privacy", linkedMatter: null, feeArrangement: "Fixed Fee", budget: "₹5L", actualSpend: "₹5L", budgetUtilization: 100, leadPartner: "Rahul Makhija", startDate: "Nov 1, 2025", endDate: "Feb 28, 2026", totalInvoiced: "₹5L", outstandingBalance: "₹0" },
  { id: "eng-005", engagementNumber: "ENG-2026-004", firmId: "firm-001", firmName: "Morrison & Foerster LLP", status: "active", title: "IP Portfolio Review & Strategy", practiceArea: "IP", linkedMatter: null, feeArrangement: "Fixed Fee", budget: "$35,000", actualSpend: "$22,000", budgetUtilization: 63, leadPartner: "Jennifer Park", startDate: "Mar 1, 2026", endDate: "May 31, 2026", totalInvoiced: "$22,000", outstandingBalance: "$0" },
  { id: "eng-006", engagementNumber: "ENG-2026-005", firmId: "firm-004", firmName: "Baker & McKenzie", status: "active", title: "Cross-Border Employment Compliance Review", practiceArea: "Employment", linkedMatter: null, feeArrangement: "Hourly", budget: "$25,000", actualSpend: "$8,500", budgetUtilization: 34, leadPartner: "David Chen", startDate: "Mar 15, 2026", endDate: "Jun 30, 2026", totalInvoiced: "$8,500", outstandingBalance: "$0" },
];

/* ── Invoices ── */

export interface Invoice {
  id: string;
  invoiceNumber: string;
  firmName: string;
  engagementTitle: string;
  period: string;
  totalAmount: string;
  fees: string;
  expenses: string;
  currency: string;
  status: InvoiceStatus;
  aiScore: number | null;
  flagCount: number;
  aiSavings: string | null;
  dueDate: string;
  receivedDate: string;
}

export const INVOICES: Invoice[] = [
  { id: "inv-001", invoiceNumber: "INV-MF-2026-0042", firmName: "Morrison & Foerster LLP", engagementTitle: "Patent Defense — NeuralTech", period: "Mar 1–31, 2026", totalAmount: "$43,590", fees: "$42,350", expenses: "$1,240", currency: "USD", status: "ai_flagged", aiScore: 72, flagCount: 3, aiSavings: "$4,200", dueDate: "Apr 15", receivedDate: "Apr 3" },
  { id: "inv-002", invoiceNumber: "INV-AZB-2026-018", firmName: "AZB & Partners", engagementTitle: "SEBI Regulatory Inquiry", period: "Mar 1–31, 2026", totalAmount: "₹2.4L", fees: "₹2.3L", expenses: "₹10K", currency: "INR", status: "received", aiScore: null, flagCount: 0, aiSavings: null, dueDate: "Apr 20", receivedDate: "Apr 5" },
  { id: "inv-003", invoiceNumber: "INV-BM-2026-009", firmName: "Baker & McKenzie", engagementTitle: "Employment Advisory — US Expansion", period: "Feb 1–28, 2026", totalAmount: "$18,500", fees: "$17,800", expenses: "$700", currency: "USD", status: "approved", aiScore: 91, flagCount: 0, aiSavings: "$0", dueDate: "Mar 30", receivedDate: "Mar 10" },
  { id: "inv-004", invoiceNumber: "INV-MF-2026-0038", firmName: "Morrison & Foerster LLP", engagementTitle: "Patent Defense — NeuralTech", period: "Feb 1–28, 2026", totalAmount: "$38,200", fees: "$37,100", expenses: "$1,100", currency: "USD", status: "paid", aiScore: 85, flagCount: 1, aiSavings: "$850", dueDate: "Mar 15", receivedDate: "Mar 2" },
  { id: "inv-005", invoiceNumber: "INV-MF-2026-0041", firmName: "Morrison & Foerster LLP", engagementTitle: "IP Portfolio Review", period: "Mar 1–31, 2026", totalAmount: "$22,000", fees: "$22,000", expenses: "$0", currency: "USD", status: "under_review", aiScore: 88, flagCount: 1, aiSavings: "$600", dueDate: "Apr 20", receivedDate: "Apr 4" },
];

/* ── Budget ── */

export interface BudgetCategory {
  category: string;
  budget: string;
  actual: string;
  forecast: string;
  variance: string;
  variancePositive: boolean;
}

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { category: "Outside Counsel Fees", budget: "$500K", actual: "$330K", forecast: "$490K", variance: "-$10K", variancePositive: true },
  { category: "Court Costs", budget: "$60K", actual: "$39K", forecast: "$55K", variance: "-$5K", variancePositive: true },
  { category: "Expert Fees", budget: "$80K", actual: "$58K", forecast: "$95K", variance: "+$15K", variancePositive: false },
  { category: "E-Discovery", budget: "$40K", actual: "$24K", forecast: "$35K", variance: "-$5K", variancePositive: true },
  { category: "Internal Legal", budget: "$40K", actual: "$19K", forecast: "$30K", variance: "-$10K", variancePositive: true },
  { category: "Travel & Other", budget: "$30K", actual: "$15K", forecast: "$25K", variance: "-$5K", variancePositive: true },
];

export const BUDGET_TOTALS = {
  totalBudget: "$750K",
  totalActual: "$485K",
  totalForecast: "$720K",
  totalVariance: "-$30K",
  variancePositive: true,
  utilization: 65,
};

export const ACCRUALS = [
  { firm: "Morrison & Foerster LLP", engagement: "Patent Defense", amount: "$28,000", period: "Mar 2026" },
  { firm: "AZB & Partners", engagement: "SEBI Inquiry", amount: "₹8L", period: "Mar 2026" },
  { firm: "Baker & McKenzie", engagement: "Mediation Prep", amount: "$6,000", period: "Mar 2026" },
];

/* ── Analytics ── */

export const SPEND_BY_FIRM = [
  { firm: "Morrison & Foerster", spend: 185000, pct: 38 },
  { firm: "AZB & Partners", spend: 45000, pct: 9 },
  { firm: "Baker & McKenzie", spend: 42000, pct: 9 },
  { firm: "Al Tamimi", spend: 32000, pct: 7 },
  { firm: "Khaitan & Co", spend: 18000, pct: 4 },
  { firm: "Other", spend: 163000, pct: 33 },
];

export const SPEND_BY_TYPE = [
  { type: "IP / Patent", pct: 42 },
  { type: "Regulatory", pct: 18 },
  { type: "Employment", pct: 22 },
  { type: "Corporate", pct: 10 },
  { type: "Data Privacy", pct: 8 },
];

/* ── KPIs ── */

export const SPEND_KPIS = [
  { label: "YTD Spend", value: "$485K", subtext: "of $750K budget (65%)", positive: true },
  { label: "Active Engagements", value: "6", subtext: "across 4 firms", positive: true },
  { label: "Pending Invoices", value: "3", subtext: "$68K total", positive: false },
  { label: "AI Savings", value: "$12,400", subtext: "YTD from billing review", positive: true },
];

/* ── Counts ── */

export const SPEND_COUNTS = {
  firms: FIRMS.length,
  activeFirms: FIRMS.filter((f) => f.status === "active").length,
  engagements: ENGAGEMENTS.length,
  activeEngagements: ENGAGEMENTS.filter((e) => e.status === "active").length,
  pendingInvoices: INVOICES.filter((i) => ["received", "under_review", "ai_flagged"].includes(i.status)).length,
  totalPendingAmount: "$68K",
};

/* ── Helpers ── */

export function aiScoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

export function aiScoreBg(score: number | null): string {
  if (score === null) return "bg-secondary";
  if (score >= 80) return "bg-success/10";
  if (score >= 50) return "bg-warning/10";
  return "bg-destructive/10";
}

export function budgetBarColor(utilization: number): string {
  if (utilization >= 90) return "bg-destructive";
  if (utilization >= 70) return "bg-warning";
  return "bg-success";
}

export function ratingStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - half);
}
