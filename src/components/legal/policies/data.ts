/* ================================================================
   O2S Legal — Policy Hub Data
   ================================================================ */

export type PolicyTab = "all" | "handbook" | "acknowledgments" | "distribution" | "analytics";

export const POLICY_TABS: { key: PolicyTab; label: string; count?: number }[] = [
  { key: "all", label: "All Policies" },
  { key: "handbook", label: "Employee Handbook" },
  { key: "acknowledgments", label: "Acknowledgments" },
  { key: "distribution", label: "Distribution" },
  { key: "analytics", label: "Analytics" },
];

/* ── Status Config ── */

export type PolicyStatus = "draft" | "in_review" | "published" | "archived";
export type ReviewStatus = "current" | "due_soon" | "overdue";
export type AckStatus = "acknowledged" | "pending" | "overdue" | "waived";

export const STATUS_CONFIG: Record<PolicyStatus, { label: string; dotClass: string; textClass: string; bgClass: string }> = {
  draft:      { label: "Draft",     dotClass: "bg-muted-foreground",    textClass: "text-muted-foreground",    bgClass: "bg-secondary" },
  in_review:  { label: "In Review", dotClass: "bg-warning",             textClass: "text-warning",             bgClass: "bg-warning/10" },
  published:  { label: "Published", dotClass: "bg-success",             textClass: "text-success",             bgClass: "bg-success/10" },
  archived:   { label: "Archived",  dotClass: "bg-muted-foreground/40", textClass: "text-muted-foreground/40", bgClass: "bg-secondary" },
};

export const REVIEW_STATUS_CONFIG: Record<ReviewStatus, { label: string; colorClass: string; bgClass: string; icon: string }> = {
  current:  { label: "Current",   colorClass: "text-success",     bgClass: "bg-success/10",     icon: "✓" },
  due_soon: { label: "Due Soon",  colorClass: "text-warning",     bgClass: "bg-warning/10",     icon: "🟡" },
  overdue:  { label: "Overdue",   colorClass: "text-destructive", bgClass: "bg-destructive/10", icon: "🔴" },
};

export const CATEGORY_LABELS: Record<string, string> = {
  code_of_conduct: "Code of Conduct",
  anti_harassment: "Anti-Harassment",
  data_protection: "Data Protection",
  leave_policy: "Leave & Time Off",
  remote_work: "Remote Work",
  travel_expense: "Travel & Expense",
  information_security: "Information Security",
  social_media: "Social Media",
  conflict_of_interest: "Conflict of Interest",
  whistleblower: "Whistleblower",
  health_safety: "Health & Safety",
  equal_opportunity: "Equal Opportunity",
  ip_confidentiality: "IP & Confidentiality",
  compensation: "Compensation",
  performance_management: "Performance Management",
  grievance_redressal: "Grievance Redressal",
  byod: "BYOD",
  custom: "Custom",
};

/* ── Policy ── */

export interface Policy {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  status: PolicyStatus;
  currentVersion: number;
  entities: string[];
  ackRequired: boolean;
  ackType: string;
  ackStats: { total: number; acknowledged: number; pending: number; overdue: number };
  ackRate: number;
  reviewFrequency: string;
  reviewStatus: ReviewStatus;
  nextReviewDate: string;
  owner: string;
  effectiveDate: string;
  isPartOfHandbook: boolean;
  sortOrder: number;
  regulatoryBasis: string[];
  tags: string[];
}

export const POLICIES: Policy[] = [
  { id: "POL-001", title: "Code of Conduct", category: "code_of_conduct", categoryLabel: "Code of Conduct", description: "Organization-wide standards of behavior and ethical guidelines.", status: "published", currentVersion: 4, entities: ["All"], ackRequired: true, ackType: "Read & Confirm", ackStats: { total: 150, acknowledged: 138, pending: 8, overdue: 4 }, ackRate: 92, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Dec 2026", owner: "Meera Krishnan", effectiveDate: "Jan 2024", isPartOfHandbook: true, sortOrder: 2, regulatoryBasis: [], tags: ["core", "all-employees"] },
  { id: "POL-002", title: "Anti-Harassment & POSH Policy", category: "anti_harassment", categoryLabel: "Anti-Harassment", description: "Prevention of sexual harassment at workplace per POSH Act 2013.", status: "published", currentVersion: 3, entities: ["LB India"], ackRequired: true, ackType: "Read & Confirm", ackStats: { total: 150, acknowledged: 117, pending: 21, overdue: 12 }, ackRate: 78, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Aug 2026", owner: "Meera Krishnan", effectiveDate: "Jun 2024", isPartOfHandbook: true, sortOrder: 3, regulatoryBasis: ["POSH Act, 2013"], tags: ["posh", "india", "mandatory"] },
  { id: "POL-003", title: "Data Protection Policy (DPDP)", category: "data_protection", categoryLabel: "Data Protection", description: "Employee data handling per India DPDP Act, 2023.", status: "published", currentVersion: 1, entities: ["LB India"], ackRequired: true, ackType: "Digital Signature", ackStats: { total: 150, acknowledged: 68, pending: 72, overdue: 10 }, ackRate: 45, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Jan 2027", owner: "Meera Krishnan", effectiveDate: "Mar 2026", isPartOfHandbook: true, sortOrder: 8, regulatoryBasis: ["DPDP Act, 2023"], tags: ["data-protection", "new"] },
  { id: "POL-004", title: "Leave Policy", category: "leave_policy", categoryLabel: "Leave & Time Off", description: "Leave entitlements including earned, sick, casual, and special leaves.", status: "published", currentVersion: 5, entities: ["All"], ackRequired: true, ackType: "Read & Confirm", ackStats: { total: 150, acknowledged: 143, pending: 5, overdue: 2 }, ackRate: 95, reviewFrequency: "Annual", reviewStatus: "due_soon", nextReviewDate: "Jun 2026", owner: "Deepa Nair", effectiveDate: "Apr 2025", isPartOfHandbook: true, sortOrder: 5, regulatoryBasis: [], tags: ["leave", "core"] },
  { id: "POL-005", title: "Remote Work Policy", category: "remote_work", categoryLabel: "Remote Work", description: "Guidelines for remote and hybrid work arrangements.", status: "published", currentVersion: 2, entities: ["All"], ackRequired: true, ackType: "Read & Confirm", ackStats: { total: 185, acknowledged: 185, pending: 0, overdue: 0 }, ackRate: 100, reviewFrequency: "Annual", reviewStatus: "due_soon", nextReviewDate: "Apr 2026", owner: "Prashant Singh", effectiveDate: "Apr 2025", isPartOfHandbook: true, sortOrder: 6, regulatoryBasis: [], tags: ["remote", "hybrid"] },
  { id: "POL-006", title: "Information Security Policy", category: "information_security", categoryLabel: "Information Security", description: "Data security, access controls, and incident response procedures.", status: "published", currentVersion: 3, entities: ["All"], ackRequired: true, ackType: "Read & Confirm", ackStats: { total: 185, acknowledged: 172, pending: 10, overdue: 3 }, ackRate: 93, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Sep 2026", owner: "Prashant Singh", effectiveDate: "Mar 2025", isPartOfHandbook: true, sortOrder: 9, regulatoryBasis: [], tags: ["security", "it"] },
  { id: "POL-007", title: "Travel & Expense Policy", category: "travel_expense", categoryLabel: "Travel & Expense", description: "Travel booking, expense reporting, and reimbursement guidelines.", status: "published", currentVersion: 2, entities: ["All"], ackRequired: false, ackType: "—", ackStats: { total: 0, acknowledged: 0, pending: 0, overdue: 0 }, ackRate: 0, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Nov 2026", owner: "Deepa Nair", effectiveDate: "Jan 2025", isPartOfHandbook: true, sortOrder: 7, regulatoryBasis: [], tags: ["travel", "expense"] },
  { id: "POL-008", title: "IP & Confidentiality Policy", category: "ip_confidentiality", categoryLabel: "IP & Confidentiality", description: "Intellectual property rights, trade secrets, and confidentiality obligations.", status: "published", currentVersion: 2, entities: ["All"], ackRequired: true, ackType: "Digital Signature", ackStats: { total: 185, acknowledged: 180, pending: 5, overdue: 0 }, ackRate: 97, reviewFrequency: "Biannual", reviewStatus: "current", nextReviewDate: "Jul 2026", owner: "Meera Krishnan", effectiveDate: "Jun 2024", isPartOfHandbook: true, sortOrder: 10, regulatoryBasis: [], tags: ["ip", "confidentiality"] },
  { id: "POL-009", title: "Social Media Policy", category: "social_media", categoryLabel: "Social Media", description: "Guidelines for employee social media use related to the organization.", status: "published", currentVersion: 1, entities: ["All"], ackRequired: false, ackType: "—", ackStats: { total: 0, acknowledged: 0, pending: 0, overdue: 0 }, ackRate: 0, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Jan 2027", owner: "Prashant Singh", effectiveDate: "Sep 2025", isPartOfHandbook: true, sortOrder: 12, regulatoryBasis: [], tags: ["social-media"] },
  { id: "POL-010", title: "Whistleblower Policy", category: "whistleblower", categoryLabel: "Whistleblower", description: "Protected disclosure mechanism for reporting misconduct.", status: "published", currentVersion: 2, entities: ["All"], ackRequired: true, ackType: "Read & Confirm", ackStats: { total: 185, acknowledged: 170, pending: 10, overdue: 5 }, ackRate: 92, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Nov 2026", owner: "Meera Krishnan", effectiveDate: "Jan 2025", isPartOfHandbook: true, sortOrder: 14, regulatoryBasis: ["Companies Act 2013, S.177(9)"], tags: ["whistleblower", "mandatory"] },
  { id: "POL-011", title: "Equal Opportunity Policy", category: "equal_opportunity", categoryLabel: "Equal Opportunity", description: "Anti-discrimination and equal employment opportunity guidelines.", status: "published", currentVersion: 1, entities: ["All"], ackRequired: true, ackType: "Read & Confirm", ackStats: { total: 185, acknowledged: 178, pending: 7, overdue: 0 }, ackRate: 96, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Jan 2027", owner: "Meera Krishnan", effectiveDate: "Jun 2024", isPartOfHandbook: true, sortOrder: 4, regulatoryBasis: [], tags: ["eeo", "diversity"] },
  { id: "POL-012", title: "Health & Safety Policy", category: "health_safety", categoryLabel: "Health & Safety", description: "Workplace health, safety, and emergency procedures.", status: "published", currentVersion: 1, entities: ["All"], ackRequired: true, ackType: "Read & Confirm", ackStats: { total: 185, acknowledged: 182, pending: 3, overdue: 0 }, ackRate: 98, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Mar 2027", owner: "Deepa Nair", effectiveDate: "Mar 2025", isPartOfHandbook: true, sortOrder: 15, regulatoryBasis: [], tags: ["health", "safety"] },
  { id: "POL-013", title: "BYOD Policy", category: "byod", categoryLabel: "BYOD", description: "Bring your own device guidelines and security requirements.", status: "published", currentVersion: 1, entities: ["All"], ackRequired: false, ackType: "—", ackStats: { total: 0, acknowledged: 0, pending: 0, overdue: 0 }, ackRate: 0, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Sep 2026", owner: "Prashant Singh", effectiveDate: "Jun 2025", isPartOfHandbook: true, sortOrder: 11, regulatoryBasis: [], tags: ["byod", "it"] },
  { id: "POL-014", title: "Grievance Redressal Policy", category: "grievance_redressal", categoryLabel: "Grievance Redressal", description: "Process for employees to raise and resolve workplace grievances.", status: "published", currentVersion: 2, entities: ["All"], ackRequired: true, ackType: "Read & Confirm", ackStats: { total: 185, acknowledged: 175, pending: 8, overdue: 2 }, ackRate: 95, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Oct 2026", owner: "Meera Krishnan", effectiveDate: "Apr 2025", isPartOfHandbook: true, sortOrder: 13, regulatoryBasis: [], tags: ["grievance"] },
  { id: "POL-015", title: "US Equal Employment Opportunity", category: "equal_opportunity", categoryLabel: "Equal Opportunity", description: "EEO and anti-discrimination for US entity per Title VII and CA FEHA.", status: "published", currentVersion: 1, entities: ["LB US"], ackRequired: true, ackType: "Read & Confirm", ackStats: { total: 12, acknowledged: 12, pending: 0, overdue: 0 }, ackRate: 100, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Jan 2027", owner: "Sarah Mitchell", effectiveDate: "Sep 2025", isPartOfHandbook: true, sortOrder: 4, regulatoryBasis: ["Title VII", "CA FEHA"], tags: ["eeo", "us"] },
  { id: "POL-016", title: "Compensation Policy", category: "compensation", categoryLabel: "Compensation", description: "Pay structure, bands, reviews, and equity guidelines.", status: "published", currentVersion: 2, entities: ["All"], ackRequired: false, ackType: "—", ackStats: { total: 0, acknowledged: 0, pending: 0, overdue: 0 }, ackRate: 0, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Apr 2026", owner: "Deepa Nair", effectiveDate: "Jan 2026", isPartOfHandbook: false, sortOrder: 99, regulatoryBasis: [], tags: ["compensation", "hr-only"] },
  { id: "POL-017", title: "Conflict of Interest Policy", category: "conflict_of_interest", categoryLabel: "Conflict of Interest", description: "Disclosure and management of potential conflicts of interest.", status: "published", currentVersion: 1, entities: ["All"], ackRequired: true, ackType: "Read & Confirm", ackStats: { total: 185, acknowledged: 180, pending: 5, overdue: 0 }, ackRate: 97, reviewFrequency: "Biannual", reviewStatus: "current", nextReviewDate: "Dec 2026", owner: "Meera Krishnan", effectiveDate: "Jun 2025", isPartOfHandbook: false, sortOrder: 99, regulatoryBasis: [], tags: ["conflict", "ethics"] },
  { id: "POL-018", title: "Performance Management Policy", category: "performance_management", categoryLabel: "Performance Management", description: "Performance review framework, goals, feedback, and PIPs.", status: "draft", currentVersion: 1, entities: ["All"], ackRequired: false, ackType: "—", ackStats: { total: 0, acknowledged: 0, pending: 0, overdue: 0 }, ackRate: 0, reviewFrequency: "Annual", reviewStatus: "current", nextReviewDate: "Jan 2027", owner: "Deepa Nair", effectiveDate: "Apr 2026", isPartOfHandbook: false, sortOrder: 99, regulatoryBasis: [], tags: ["performance", "draft"] },
];

/* ── Distribution Campaigns ── */

export interface DistributionCampaign {
  id: string;
  name: string;
  policies: string[];
  recipients: number;
  sentAt: string;
  deadline: string;
  status: "draft" | "sent" | "completed";
  progress: { sent: number; opened: number; acknowledged: number; overdue: number };
}

export const CAMPAIGNS: DistributionCampaign[] = [
  { id: "CAMP-001", name: "DPDP Act Compliance — Policy Distribution", policies: ["Data Protection Policy (DPDP)"], recipients: 150, sentAt: "Mar 1, 2026", deadline: "Mar 31, 2026", status: "sent", progress: { sent: 150, opened: 112, acknowledged: 68, overdue: 10 } },
  { id: "CAMP-002", name: "Q1 2026 Policy Updates", policies: ["Code of Conduct (v4)", "Leave Policy (v5)"], recipients: 185, sentAt: "Jan 15, 2026", deadline: "Feb 15, 2026", status: "completed", progress: { sent: 185, opened: 180, acknowledged: 176, overdue: 4 } },
  { id: "CAMP-003", name: "New Hire Onboarding — March Cohort", policies: ["Code of Conduct", "POSH Policy", "IP & Confidentiality"], recipients: 4, sentAt: "Mar 20, 2026", deadline: "Apr 3, 2026", status: "sent", progress: { sent: 4, opened: 3, acknowledged: 2, overdue: 0 } },
];

/* ── Acknowledgment Summary (per-policy) ── */

export interface AckSummary {
  policyId: string;
  policyTitle: string;
  version: number;
  rate: number;
  total: number;
  acknowledged: number;
  pending: number;
  overdue: number;
}

export const ACK_SUMMARIES: AckSummary[] = POLICIES
  .filter((p) => p.ackRequired && p.status === "published")
  .map((p) => ({
    policyId: p.id,
    policyTitle: p.title,
    version: p.currentVersion,
    rate: p.ackRate,
    total: p.ackStats.total,
    acknowledged: p.ackStats.acknowledged,
    pending: p.ackStats.pending,
    overdue: p.ackStats.overdue,
  }))
  .sort((a, b) => a.rate - b.rate);

/* ── Overdue Employees ── */

export interface OverdueEmployee {
  name: string;
  department: string;
  entity: string;
  policiesOverdue: string[];
  daysOverdue: number;
}

export const OVERDUE_EMPLOYEES: OverdueEmployee[] = [
  { name: "Amit Kumar", department: "Sales", entity: "LB India", policiesOverdue: ["POSH", "DPDP", "Code of Conduct"], daysOverdue: 21 },
  { name: "Rahul Mehta", department: "Engineering", entity: "LB India", policiesOverdue: ["POSH", "DPDP"], daysOverdue: 14 },
  { name: "Sneha Patel", department: "Design", entity: "LB India", policiesOverdue: ["DPDP"], daysOverdue: 7 },
  { name: "Vikram Rao", department: "Engineering", entity: "LB India", policiesOverdue: ["POSH"], daysOverdue: 12 },
  { name: "Priya Nair", department: "Marketing", entity: "LB India", policiesOverdue: ["Code of Conduct", "DPDP"], daysOverdue: 8 },
];

/* ── Handbook Policies ── */

export const HANDBOOK_POLICIES = POLICIES
  .filter((p) => p.isPartOfHandbook && p.status === "published")
  .sort((a, b) => a.sortOrder - b.sortOrder);

/* ── KPIs ── */

export const POLICY_KPIS = [
  { label: "Total Policies", value: "18", subtext: "16 published", positive: true },
  { label: "Acknowledgment Rate", value: "85%", trend: "+3% this month", positive: true },
  { label: "Overdue Ack.", value: "23", subtext: "employees", positive: false },
  { label: "Due for Review", value: "3", subtext: "policies", positive: false },
];

/* ── Analytics ── */

export const ACK_BY_DEPT = [
  { dept: "Engineering", rate: 88 },
  { dept: "Design", rate: 95 },
  { dept: "Product", rate: 90 },
  { dept: "Sales", rate: 72 },
  { dept: "Marketing", rate: 80 },
  { dept: "HR", rate: 100 },
  { dept: "Finance", rate: 95 },
];

export const POLICIES_BY_STATUS = [
  { status: "Published", count: 16 },
  { status: "Draft", count: 2 },
  { status: "Archived", count: 4 },
];

export const UPCOMING_REVIEWS = [
  { policy: "Remote Work Policy", dueDate: "Apr 2026", status: "due_soon" as ReviewStatus },
  { policy: "Leave Policy", dueDate: "Jun 2026", status: "due_soon" as ReviewStatus },
  { policy: "POSH Policy", dueDate: "Aug 2026", status: "current" as ReviewStatus },
];

/* ── Counts ── */

export const POLICY_COUNTS = {
  total: POLICIES.length,
  published: POLICIES.filter((p) => p.status === "published").length,
  draft: POLICIES.filter((p) => p.status === "draft").length,
  handbookPolicies: HANDBOOK_POLICIES.length,
  totalOverdueEmployees: OVERDUE_EMPLOYEES.length,
  policiesDueForReview: POLICIES.filter((p) => p.reviewStatus === "due_soon" || p.reviewStatus === "overdue").length,
};

/* ── Helpers ── */

export function ackRateColor(rate: number): string {
  if (rate >= 90) return "text-success";
  if (rate >= 60) return "text-warning";
  return "text-destructive";
}

export function ackBarColor(rate: number): string {
  if (rate >= 90) return "bg-success";
  if (rate >= 60) return "bg-warning";
  return "bg-destructive";
}
