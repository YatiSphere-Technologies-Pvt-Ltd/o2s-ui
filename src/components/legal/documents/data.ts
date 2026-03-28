/* ================================================================
   O2S Legal — Document Generation & Contract Intelligence
   ================================================================ */

export type DocTab = "sow" | "nda" | "comparison" | "obligations" | "renewals";

export const DOC_TABS: { key: DocTab; label: string; count?: number }[] = [
  { key: "sow", label: "SOW Builder" },
  { key: "nda", label: "NDA Workspace" },
  { key: "comparison", label: "Contract Comparison" },
  { key: "obligations", label: "Obligations" },
  { key: "renewals", label: "Renewals" },
];

/* ── SOW Types ── */

export type SOWStatus = "draft" | "internal_review" | "client_review" | "approved" | "executed" | "amended" | "expired";

export const SOW_STATUS_CONFIG: Record<SOWStatus, { label: string; dotClass: string; textClass: string; bgClass: string }> = {
  draft:           { label: "Draft",           dotClass: "bg-muted-foreground",    textClass: "text-muted-foreground",    bgClass: "bg-secondary" },
  internal_review: { label: "Internal Review", dotClass: "bg-warning",             textClass: "text-warning",             bgClass: "bg-warning/10" },
  client_review:   { label: "Client Review",   dotClass: "bg-brand-purple",         textClass: "text-brand-purple",         bgClass: "bg-brand-purple/10" },
  approved:        { label: "Approved",        dotClass: "bg-brand",               textClass: "text-brand",               bgClass: "bg-brand/10" },
  executed:        { label: "Executed",        dotClass: "bg-success",             textClass: "text-success",             bgClass: "bg-success/10" },
  amended:         { label: "Amended",         dotClass: "bg-info",                textClass: "text-info",                bgClass: "bg-info/10" },
  expired:         { label: "Expired",         dotClass: "bg-muted-foreground/40", textClass: "text-muted-foreground/40", bgClass: "bg-secondary" },
};

export const ENGAGEMENT_TYPES: Record<string, string> = {
  time_and_materials: "T&M",
  fixed_price: "Fixed Price",
  retainer: "Retainer",
  milestone_based: "Milestone",
  hybrid: "Hybrid",
};

export interface SOW {
  id: string;
  sowNumber: string;
  title: string;
  status: SOWStatus;
  version: number;
  client: string;
  clientContact: string;
  entity: string;
  engagementType: string;
  totalValue: string;
  currency: string;
  startDate: string;
  endDate: string;
  duration: string;
  linkedMSA: string | null;
  deliverables: number;
  milestones: number;
  resources: number;
  createdAt: string;
  aiSuggestions: number;
}

export const SOWS: SOW[] = [
  { id: "sow-001", sowNumber: "SOW-2026-001", title: "Cloud Infrastructure Migration — Phase 1", status: "executed", version: 2, client: "TechVista Corp", clientContact: "Robert Chen", entity: "Latent Bridge Inc (US)", engagementType: "time_and_materials", totalValue: "$384,000", currency: "USD", startDate: "Jan 15, 2026", endDate: "Jul 14, 2026", duration: "6 months", linkedMSA: "MSA-2025-012", deliverables: 4, milestones: 4, resources: 3, createdAt: "Jan 5, 2026", aiSuggestions: 0 },
  { id: "sow-002", sowNumber: "SOW-2026-002", title: "FinServ Data Analytics Platform", status: "executed", version: 1, client: "Apex Financial", clientContact: "Lisa Wong", entity: "Latent Bridge Inc (US)", engagementType: "fixed_price", totalValue: "$250,000", currency: "USD", startDate: "Feb 1, 2026", endDate: "Jun 30, 2026", duration: "5 months", linkedMSA: "MSA-2025-018", deliverables: 5, milestones: 3, resources: 4, createdAt: "Jan 20, 2026", aiSuggestions: 0 },
  { id: "sow-003", sowNumber: "SOW-2026-003", title: "Meridian Healthcare Data Migration", status: "draft", version: 1, client: "Meridian Healthcare", clientContact: "Patricia Adams", entity: "Latent Bridge Inc (US)", engagementType: "time_and_materials", totalValue: "$420,000", currency: "USD", startDate: "Apr 1, 2026", endDate: "Sep 30, 2026", duration: "6 months", linkedMSA: "MSA-2026-001", deliverables: 0, milestones: 0, resources: 0, createdAt: "Mar 25, 2026", aiSuggestions: 4 },
  { id: "sow-004", sowNumber: "SOW-2026-004", title: "RetailMax E-Commerce Modernization", status: "internal_review", version: 1, client: "RetailMax India", clientContact: "Suresh Iyer", entity: "Latent Bridge Pvt Ltd (India)", engagementType: "milestone_based", totalValue: "₹1.2 Cr", currency: "INR", startDate: "May 1, 2026", endDate: "Oct 31, 2026", duration: "6 months", linkedMSA: null, deliverables: 6, milestones: 5, resources: 5, createdAt: "Mar 20, 2026", aiSuggestions: 2 },
  { id: "sow-005", sowNumber: "SOW-2026-005", title: "GreenEnergy IoT Platform Support", status: "client_review", version: 2, client: "GreenEnergy Solutions", clientContact: "Ahmed Rashid", entity: "Latent Bridge DMCC (UAE)", engagementType: "retainer", totalValue: "AED 180,000", currency: "AED", startDate: "Apr 15, 2026", endDate: "Apr 14, 2027", duration: "12 months", linkedMSA: "MSA-2025-025", deliverables: 2, milestones: 0, resources: 2, createdAt: "Mar 15, 2026", aiSuggestions: 1 },
];

/* ── NDA Types ── */

export type NDAStatus = "draft" | "pending_counterparty" | "under_negotiation" | "pending_signature" | "executed" | "expired";

export const NDA_STATUS_CONFIG: Record<NDAStatus, { label: string; dotClass: string; textClass: string; bgClass: string }> = {
  draft:                { label: "Draft",              dotClass: "bg-muted-foreground",    textClass: "text-muted-foreground",    bgClass: "bg-secondary" },
  pending_counterparty: { label: "Pending Counterparty",dotClass: "bg-warning",            textClass: "text-warning",             bgClass: "bg-warning/10" },
  under_negotiation:    { label: "Under Negotiation",   dotClass: "bg-brand-purple",        textClass: "text-brand-purple",         bgClass: "bg-brand-purple/10" },
  pending_signature:    { label: "Pending Signature",   dotClass: "bg-brand",               textClass: "text-brand",               bgClass: "bg-brand/10" },
  executed:             { label: "Executed",            dotClass: "bg-success",             textClass: "text-success",             bgClass: "bg-success/10" },
  expired:              { label: "Expired",             dotClass: "bg-destructive",          textClass: "text-destructive",          bgClass: "bg-destructive/10" },
};

export const NDA_TYPE_LABELS: Record<string, string> = { mutual: "Mutual", one_way_discloser: "One-Way (We Disclose)", one_way_recipient: "One-Way (They Disclose)" };

export interface NDA {
  id: string;
  ndaNumber: string;
  type: string;
  typeLabel: string;
  status: NDAStatus;
  counterparty: string;
  counterpartyContact: string;
  entity: string;
  purpose: string;
  effectiveDate: string;
  expiryDate: string;
  duration: string;
  governingLaw: string;
  riskLevel: "standard" | "review_needed" | "high_risk";
  signatureStatus: string;
  createdAt: string;
}

export const NDAS: NDA[] = [
  { id: "nda-001", ndaNumber: "NDA-2026-015", type: "mutual", typeLabel: "Mutual", status: "executed", counterparty: "DataFlow Inc", counterpartyContact: "Sarah Mitchell", entity: "LB India", purpose: "Integration partnership for O2S platform", effectiveDate: "Mar 21, 2026", expiryDate: "Mar 20, 2028", duration: "24 months", governingLaw: "Delaware, USA", riskLevel: "standard", signatureStatus: "Fully Executed", createdAt: "Mar 20" },
  { id: "nda-002", ndaNumber: "NDA-2026-018", type: "mutual", typeLabel: "Mutual", status: "draft", counterparty: "GlobalTech Solutions", counterpartyContact: "Jennifer Walsh", entity: "LB India", purpose: "Strategic partnership discussion", effectiveDate: "—", expiryDate: "—", duration: "24 months", governingLaw: "India", riskLevel: "standard", signatureStatus: "Not Sent", createdAt: "Mar 26" },
  { id: "nda-003", ndaNumber: "NDA-2026-012", type: "mutual", typeLabel: "Mutual", status: "executed", counterparty: "Meridian Healthcare", counterpartyContact: "Patricia Adams", entity: "LB US", purpose: "Healthcare data migration project", effectiveDate: "Feb 1, 2026", expiryDate: "Feb 1, 2029", duration: "36 months", governingLaw: "Massachusetts, USA", riskLevel: "standard", signatureStatus: "Fully Executed", createdAt: "Jan 28" },
  { id: "nda-004", ndaNumber: "NDA-2026-019", type: "one_way_discloser", typeLabel: "One-Way (We Disclose)", status: "pending_signature", counterparty: "Innovate Labs", counterpartyContact: "Raj Malhotra", entity: "LB India", purpose: "Sharing O2S API documentation for integration POC", effectiveDate: "—", expiryDate: "—", duration: "12 months", governingLaw: "India", riskLevel: "standard", signatureStatus: "Sent — 1/2 Signed", createdAt: "Mar 24" },
  { id: "nda-005", ndaNumber: "NDA-2025-045", type: "mutual", typeLabel: "Mutual", status: "expired", counterparty: "OldPartner Co", counterpartyContact: "Tom Davis", entity: "LB India", purpose: "Previous partnership exploration", effectiveDate: "Mar 1, 2025", expiryDate: "Mar 1, 2026", duration: "12 months", governingLaw: "India", riskLevel: "standard", signatureStatus: "Expired", createdAt: "Feb 28, 2025" },
  { id: "nda-006", ndaNumber: "NDA-2026-020", type: "mutual", typeLabel: "Mutual", status: "under_negotiation", counterparty: "SecureVault Inc", counterpartyContact: "Maria Santos", entity: "LB US", purpose: "Security partnership — counterparty sent their NDA", effectiveDate: "—", expiryDate: "—", duration: "24 months", governingLaw: "California, USA", riskLevel: "review_needed", signatureStatus: "Under Review", createdAt: "Mar 25" },
];

/* ── Obligations ── */

export type ObligationStatus = "upcoming" | "active" | "overdue" | "completed" | "waived";

export const OBL_STATUS_CONFIG: Record<ObligationStatus, { label: string; dotClass: string; textClass: string }> = {
  upcoming:  { label: "Upcoming",  dotClass: "bg-brand",            textClass: "text-brand" },
  active:    { label: "Active",    dotClass: "bg-success",          textClass: "text-success" },
  overdue:   { label: "Overdue",   dotClass: "bg-destructive",      textClass: "text-destructive" },
  completed: { label: "Completed", dotClass: "bg-success",          textClass: "text-success" },
  waived:    { label: "Waived",    dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
};

export interface Obligation {
  id: string;
  title: string;
  contract: string;
  counterparty: string;
  type: string;
  direction: "ours" | "theirs" | "mutual";
  dueDate: string;
  status: ObligationStatus;
  assignedTo: string;
  aiExtracted: boolean;
  sourceClause: string | null;
}

export const OBLIGATIONS: Obligation[] = [
  { id: "obl-001", title: "Deliver Monthly Status Report", contract: "SOW-2026-001 (TechVista)", counterparty: "TechVista Corp", type: "Reporting", direction: "ours", dueDate: "Apr 5, 2026", status: "upcoming", assignedTo: "Kavitha Rao", aiExtracted: true, sourceClause: "Section 7.2: Service Provider shall deliver monthly status reports by the 5th of each month" },
  { id: "obl-002", title: "Pay Monthly Invoice", contract: "SOW-2026-001 (TechVista)", counterparty: "TechVista Corp", type: "Payment", direction: "theirs", dueDate: "Apr 15, 2026", status: "upcoming", assignedTo: "Finance Team", aiExtracted: true, sourceClause: "Section 8.1: Client shall pay invoices within 30 days" },
  { id: "obl-003", title: "Provide Database Access Credentials", contract: "SOW-2026-003 (Meridian)", counterparty: "Meridian Healthcare", type: "Delivery", direction: "theirs", dueDate: "Mar 25, 2026", status: "overdue", assignedTo: "Patricia Adams (Client)", aiExtracted: true, sourceClause: "Section 4.1: Client shall provide access to production database within 7 days of SOW execution" },
  { id: "obl-004", title: "Annual SOC 2 Report Submission", contract: "MSA-2025-012 (TechVista)", counterparty: "TechVista Corp", type: "Compliance", direction: "ours", dueDate: "Jun 30, 2026", status: "upcoming", assignedTo: "Prashant Singh", aiExtracted: true, sourceClause: "Section 12.3: Service Provider shall provide annual SOC 2 Type II report" },
  { id: "obl-005", title: "Renew Insurance Certificate", contract: "MSA-2025-018 (Apex)", counterparty: "Apex Financial", type: "Compliance", direction: "ours", dueDate: "Mar 20, 2026", status: "overdue", assignedTo: "Meera Krishnan", aiExtracted: false, sourceClause: null },
  { id: "obl-006", title: "Quarterly Business Review", contract: "SOW-2026-002 (Apex)", counterparty: "Apex Financial", type: "Reporting", direction: "mutual", dueDate: "Apr 30, 2026", status: "upcoming", assignedTo: "Prashant Singh", aiExtracted: true, sourceClause: "Section 9.1: Parties shall conduct QBR within 30 days of quarter end" },
  { id: "obl-007", title: "Data Deletion Post-Project", contract: "SOW-2026-001 (TechVista)", counterparty: "TechVista Corp", type: "Compliance", direction: "ours", dueDate: "Aug 14, 2026", status: "upcoming", assignedTo: "Kavitha Rao", aiExtracted: true, sourceClause: "Section 11.4: Service Provider shall delete all client data within 30 days of project completion" },
  { id: "obl-008", title: "Deliver Migration Assessment Report", contract: "SOW-2026-001 (TechVista)", counterparty: "TechVista Corp", type: "Delivery", direction: "ours", dueDate: "Feb 14, 2026", status: "completed", assignedTo: "Alex Rivera", aiExtracted: true, sourceClause: "Deliverable 1: Migration Assessment Report" },
];

/* ── Renewals ── */

export interface ContractRenewal {
  id: string;
  contractName: string;
  counterparty: string;
  contractType: string;
  entity: string;
  currentEndDate: string;
  autoRenew: boolean;
  noticeDueDate: string | null;
  daysUntilExpiry: number;
  annualValue: string;
  currency: string;
  decision: "pending" | "renew" | "renegotiate" | "terminate";
  alertLevel: "none" | "info" | "warning" | "urgent" | "critical";
  aiRecommendation: string | null;
}

export const RENEWALS: ContractRenewal[] = [
  { id: "rnw-001", contractName: "Vendor MSA — SkillBridge Tech", counterparty: "SkillBridge Technologies", contractType: "Vendor MSA", entity: "LB India", currentEndDate: "May 31, 2026", autoRenew: false, noticeDueDate: null, daysUntilExpiry: 65, annualValue: "₹18L", currency: "INR", decision: "pending", alertLevel: "warning", aiRecommendation: "Renegotiate — vendor performance score dropped to 58. Consider reduced fee rate or replacement." },
  { id: "rnw-002", contractName: "NDA — OldPartner Co", counterparty: "OldPartner Co", contractType: "NDA", entity: "LB India", currentEndDate: "Mar 1, 2026", autoRenew: false, noticeDueDate: null, daysUntilExpiry: -26, annualValue: "—", currency: "—", decision: "terminate", alertLevel: "critical", aiRecommendation: "Already expired. No active engagement. Let expire." },
  { id: "rnw-003", contractName: "MSA — TechVista Corp", counterparty: "TechVista Corp", contractType: "MSA", entity: "LB US", currentEndDate: "May 31, 2028", autoRenew: true, noticeDueDate: "Feb 28, 2028", daysUntilExpiry: 795, annualValue: "$384K", currency: "USD", decision: "renew", alertLevel: "none", aiRecommendation: "Active engagement, high-value client. Recommend renewal with 5% rate increase." },
  { id: "rnw-004", contractName: "Contractor Agreement — Ravi K.", counterparty: "Ravi Krishnamurthy", contractType: "Contractor", entity: "LB India", currentEndDate: "Sep 30, 2026", autoRenew: false, noticeDueDate: null, daysUntilExpiry: 187, annualValue: "₹18L", currency: "INR", decision: "pending", alertLevel: "info", aiRecommendation: "Good performer (70 score). Recommend renewal with same terms." },
  { id: "rnw-005", contractName: "GreenEnergy IoT Support Retainer", counterparty: "GreenEnergy Solutions", contractType: "SOW", entity: "LB UAE", currentEndDate: "Apr 14, 2027", autoRenew: true, noticeDueDate: "Jan 14, 2027", daysUntilExpiry: 383, annualValue: "AED 180K", currency: "AED", decision: "pending", alertLevel: "none", aiRecommendation: null },
  { id: "rnw-006", contractName: "NDA — TalentForce India", counterparty: "TalentForce India", contractType: "NDA", entity: "LB India", currentEndDate: "Oct 31, 2026", autoRenew: false, noticeDueDate: null, daysUntilExpiry: 218, annualValue: "—", currency: "—", decision: "pending", alertLevel: "info", aiRecommendation: "Active vendor relationship. Recommend renewal." },
];

export const RENEWAL_ALERT_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  none:     { label: "No Action",  colorClass: "text-muted-foreground", bgClass: "bg-secondary" },
  info:     { label: "Review",     colorClass: "text-brand",            bgClass: "bg-brand/10" },
  warning:  { label: "Warning",    colorClass: "text-warning",          bgClass: "bg-warning/10" },
  urgent:   { label: "Urgent",     colorClass: "text-[#FB923C]",        bgClass: "bg-[#FB923C]/10" },
  critical: { label: "Critical",   colorClass: "text-destructive",      bgClass: "bg-destructive/10" },
};

export const DECISION_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  pending:      { label: "Pending",      colorClass: "text-warning",          bgClass: "bg-warning/10" },
  renew:        { label: "Renew",        colorClass: "text-success",          bgClass: "bg-success/10" },
  renegotiate:  { label: "Renegotiate",  colorClass: "text-brand",            bgClass: "bg-brand/10" },
  terminate:    { label: "Terminate",    colorClass: "text-destructive",      bgClass: "bg-destructive/10" },
};

/* ── Comparison Mock ── */

export interface ComparisonResult {
  id: string;
  name: string;
  docA: string;
  docB: string;
  similarity: number;
  modified: number;
  added: number;
  removed: number;
  riskDelta: string;
  createdAt: string;
  aiSummary: string[];
}

export const COMPARISONS: ComparisonResult[] = [
  { id: "cmp-001", name: "Acme MSA v1 vs v2 Redline", docA: "Acme_MSA_v1.pdf", docB: "Acme_MSA_v2_redline.pdf", similarity: 82, modified: 7, added: 3, removed: 1, riskDelta: "+2 (Medium → High)", createdAt: "Mar 24", aiSummary: ["Liability cap reduced from 2x to 1x annual fees", "New auto-renewal clause with 90-day notice window", "IP ownership changed from work-for-hire to licensed"] },
  { id: "cmp-002", name: "Standard NDA vs SecureVault NDA", docA: "Standard_Mutual_NDA_v3.pdf", docB: "SecureVault_NDA_incoming.pdf", similarity: 68, modified: 12, added: 5, removed: 2, riskDelta: "+4 (Low → Medium)", createdAt: "Mar 25", aiSummary: ["Non-compete clause added (not in our standard)", "Broader definition of confidential information", "Shorter duration (12 vs our standard 24 months)"] },
];

/* ── KPIs ── */

export const DOC_KPIS = [
  { label: "Active SOWs", value: "5", subtext: "2 executed · 1 draft", positive: true },
  { label: "Active NDAs", value: "47", subtext: "5 pending signature", positive: true },
  { label: "Open Obligations", value: "6", subtext: "2 overdue", positive: false },
  { label: "Renewals (90d)", value: "2", subtext: "Action required", positive: false },
];

/* ── Counts ── */

export const DOC_COUNTS = {
  sows: SOWS.length,
  ndas: NDAS.length,
  obligations: OBLIGATIONS.filter((o) => o.status !== "completed" && o.status !== "waived").length,
  overdueObligations: OBLIGATIONS.filter((o) => o.status === "overdue").length,
  renewalsSoon: RENEWALS.filter((r) => r.daysUntilExpiry > 0 && r.daysUntilExpiry <= 90).length,
  comparisons: COMPARISONS.length,
};

/* ── NDA Risk Config ── */

export const NDA_RISK_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  standard:      { label: "Standard",     colorClass: "text-success",     bgClass: "bg-success/10" },
  review_needed: { label: "Review Needed",colorClass: "text-warning",     bgClass: "bg-warning/10" },
  high_risk:     { label: "High Risk",    colorClass: "text-destructive", bgClass: "bg-destructive/10" },
};
