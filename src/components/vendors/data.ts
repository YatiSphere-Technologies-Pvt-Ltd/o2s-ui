/* ================================================================
   O2S Vendor Management — Types & Mock Data
   ================================================================ */

export type VendorTab = "all" | "submissions" | "assignments" | "fees" | "performance" | "compliance";

export const VENDOR_TABS: { key: VendorTab; label: string; count?: number }[] = [
  { key: "all", label: "All Vendors" },
  { key: "submissions", label: "Submissions", count: 15 },
  { key: "assignments", label: "Assignments", count: 34 },
  { key: "fees", label: "Fees & Invoices" },
  { key: "performance", label: "Performance" },
  { key: "compliance", label: "Compliance" },
];

/* ── Types ── */

export type VendorStatus = "active" | "pending_onboarding" | "suspended" | "inactive" | "blocked";
export type VendorTier = "platinum" | "gold" | "silver" | "standard";
export type FeeStatus = "paid" | "pending" | "disputed" | "triggered" | "approved";
export type SubmissionStatus = "pending_review" | "under_review" | "accepted" | "rejected" | "duplicate" | "on_hold";

export const STATUS_CONFIG: Record<VendorStatus, { label: string; dotClass: string; textClass: string }> = {
  active:              { label: "Active",    dotClass: "bg-success",          textClass: "text-success" },
  pending_onboarding:  { label: "Onboarding",dotClass: "bg-warning",          textClass: "text-warning" },
  suspended:           { label: "Suspended", dotClass: "bg-destructive",      textClass: "text-destructive" },
  inactive:            { label: "Inactive",  dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
  blocked:             { label: "Blocked",   dotClass: "bg-destructive",      textClass: "text-destructive" },
};

export const TIER_CONFIG: Record<VendorTier, { label: string; colorClass: string; bgClass: string; icon: string }> = {
  platinum: { label: "Platinum", colorClass: "text-foreground",       bgClass: "bg-foreground/10", icon: "⭐" },
  gold:     { label: "Gold",     colorClass: "text-warning",          bgClass: "bg-warning/10",    icon: "⭐" },
  silver:   { label: "Silver",   colorClass: "text-muted-foreground", bgClass: "bg-secondary",     icon: "◆" },
  standard: { label: "Standard", colorClass: "text-muted-foreground/60", bgClass: "bg-secondary",  icon: "◇" },
};

export const SUBMISSION_STATUS_CONFIG: Record<SubmissionStatus, { label: string; dotClass: string; textClass: string }> = {
  pending_review: { label: "Pending Review", dotClass: "bg-warning",          textClass: "text-warning" },
  under_review:   { label: "Under Review",   dotClass: "bg-brand",            textClass: "text-brand" },
  accepted:       { label: "Accepted",       dotClass: "bg-success",          textClass: "text-success" },
  rejected:       { label: "Rejected",       dotClass: "bg-destructive",      textClass: "text-destructive" },
  duplicate:      { label: "Duplicate",      dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
  on_hold:        { label: "On Hold",        dotClass: "bg-info",             textClass: "text-info" },
};

export const FEE_STATUS_CONFIG: Record<FeeStatus, { label: string; dotClass: string; textClass: string }> = {
  paid:      { label: "Paid",      dotClass: "bg-success",     textClass: "text-success" },
  pending:   { label: "Pending",   dotClass: "bg-warning",     textClass: "text-warning" },
  approved:  { label: "Approved",  dotClass: "bg-brand",       textClass: "text-brand" },
  triggered: { label: "Triggered", dotClass: "bg-info",        textClass: "text-info" },
  disputed:  { label: "Disputed",  dotClass: "bg-destructive", textClass: "text-destructive" },
};

/* ── Vendor ── */

export interface Vendor {
  id: string;
  companyName: string;
  type: string;
  tier: VendorTier;
  status: VendorStatus;
  specializations: string[];
  primaryContact: { name: string; email: string; phone: string; role: string };
  location: string;
  operatingRegions: string[];
  feeModel: string;
  defaultRate: string;
  contractStatus: string;
  contractEnd: string;
  guaranteePeriod: number;
  performanceScore: number;
  activeAssignments: number;
  totalSubmissions: number;
  submitToInterviewRate: number;
  submitToHireRate: number;
  totalFeesPaid: string;
  outstandingFees: string;
  onboardedAt: string;
  accountManager: string;
}

export const VENDORS: Vendor[] = [
  { id: "VND-001", companyName: "TalentForce India Pvt Ltd", type: "Staffing Agency", tier: "gold", status: "active", specializations: ["Frontend", "Backend", "Full Stack", "DevOps"], primaryContact: { name: "Anika Sharma", email: "anika@talentforce.in", phone: "+91 98765 43210", role: "Account Manager" }, location: "Mumbai, India", operatingRegions: ["India", "SE Asia"], feeModel: "Percentage", defaultRate: "15%", contractStatus: "Active", contractEnd: "Dec 2026", guaranteePeriod: 90, performanceScore: 82, activeAssignments: 5, totalSubmissions: 48, submitToInterviewRate: 42, submitToHireRate: 8.3, totalFeesPaid: "₹4.2L", outstandingFees: "₹1.8L", onboardedAt: "Apr 2025", accountManager: "Sarah Kim" },
  { id: "VND-002", companyName: "HireRight Global Executive Search", type: "Executive Search", tier: "platinum", status: "active", specializations: ["Executive", "VP+", "C-Suite", "Engineering Leadership"], primaryContact: { name: "Robert Chen", email: "robert@hireright.com", phone: "+1 415 555 0199", role: "Managing Director" }, location: "San Francisco, USA", operatingRegions: ["Global"], feeModel: "Percentage", defaultRate: "18%", contractStatus: "Active", contractEnd: "Dec 2026", guaranteePeriod: 180, performanceScore: 91, activeAssignments: 2, totalSubmissions: 12, submitToInterviewRate: 58, submitToHireRate: 25, totalFeesPaid: "₹12.0L", outstandingFees: "₹0", onboardedAt: "Jan 2025", accountManager: "Sarah Kim" },
  { id: "VND-003", companyName: "SkillBridge Technologies", type: "Staffing Agency", tier: "silver", status: "active", specializations: ["Frontend", "Backend", "QA", "Support"], primaryContact: { name: "Deepak Joshi", email: "deepak@skillbridge.co.in", phone: "+91 87654 32109", role: "Business Head" }, location: "Pune, India", operatingRegions: ["India"], feeModel: "Percentage", defaultRate: "12%", contractStatus: "Active", contractEnd: "May 2026", guaranteePeriod: 60, performanceScore: 58, activeAssignments: 3, totalSubmissions: 39, submitToInterviewRate: 22, submitToHireRate: 5.1, totalFeesPaid: "₹1.8L", outstandingFees: "₹0.6L", onboardedAt: "Jun 2025", accountManager: "Amit Patel" },
  { id: "VND-004", companyName: "Campus Connect India", type: "University Partner", tier: "standard", status: "active", specializations: ["Interns", "Freshers", "Graduate Programs"], primaryContact: { name: "Meera Patel", email: "meera@campusconnect.edu.in", phone: "+91 76543 21098", role: "Partnership Lead" }, location: "Bangalore, India", operatingRegions: ["India"], feeModel: "Flat Fee", defaultRate: "₹50K", contractStatus: "Active", contractEnd: "Jul 2026", guaranteePeriod: 30, performanceScore: 75, activeAssignments: 1, totalSubmissions: 16, submitToInterviewRate: 35, submitToHireRate: 12.5, totalFeesPaid: "₹0.5L", outstandingFees: "₹0", onboardedAt: "Aug 2025", accountManager: "Kavitha Menon" },
  { id: "VND-005", companyName: "DiverseTech Recruitment", type: "Diversity Partner", tier: "gold", status: "pending_onboarding", specializations: ["Diversity Hiring", "Women in Tech", "Disability Inclusion"], primaryContact: { name: "Fatima Khan", email: "fatima@diversetech.org", phone: "+91 65432 10987", role: "Director" }, location: "Delhi, India", operatingRegions: ["India", "Middle East"], feeModel: "Percentage", defaultRate: "14%", contractStatus: "Draft", contractEnd: "—", guaranteePeriod: 90, performanceScore: 0, activeAssignments: 0, totalSubmissions: 0, submitToInterviewRate: 0, submitToHireRate: 0, totalFeesPaid: "₹0", outstandingFees: "₹0", onboardedAt: "Mar 2026", accountManager: "Kavitha Menon" },
  { id: "VND-006", companyName: "Ravi Krishnamurthy (Freelance)", type: "Freelance Recruiter", tier: "standard", status: "active", specializations: ["Data Science", "ML Engineering", "Analytics"], primaryContact: { name: "Ravi Krishnamurthy", email: "ravi.k@gmail.com", phone: "+91 54321 09876", role: "Freelancer" }, location: "Hyderabad, India", operatingRegions: ["India"], feeModel: "Flat Fee", defaultRate: "₹1.5L", contractStatus: "Active", contractEnd: "Dec 2026", guaranteePeriod: 60, performanceScore: 70, activeAssignments: 1, totalSubmissions: 8, submitToInterviewRate: 38, submitToHireRate: 12.5, totalFeesPaid: "₹1.5L", outstandingFees: "₹0", onboardedAt: "Oct 2025", accountManager: "Amit Patel" },
];

/* ── Submissions ── */

export interface VendorSubmission {
  id: string;
  vendorId: string;
  vendorName: string;
  submittedBy: string;
  candidateName: string;
  candidateInitials: string;
  requisition: string;
  requisitionId: string;
  slotInfo: string;
  experience: string;
  currentRole: string;
  currentCompany: string;
  expectedCtc: string;
  noticePeriod: string;
  location: string;
  status: SubmissionStatus;
  submittedAt: string;
  aiMatchScore: number | null;
  isDuplicate: boolean;
  vendorNotes: string;
}

export const SUBMISSIONS: VendorSubmission[] = [
  { id: "SUB-034", vendorId: "VND-001", vendorName: "TalentForce India", submittedBy: "Anika Sharma", candidateName: "Rahul Verma", candidateInitials: "RV", requisition: "Sr Frontend Engineer", requisitionId: "REQ-2026-001", slotInfo: "Slot 1: Pune", experience: "6 years", currentRole: "Senior Dev", currentCompany: "TCS", expectedCtc: "₹42L", noticePeriod: "60 days", location: "Pune", status: "pending_review", submittedAt: "2 hours ago", aiMatchScore: 79, isDuplicate: false, vendorNotes: "Strong candidate, worked on large-scale React apps. Motivated to move to product company." },
  { id: "SUB-033", vendorId: "VND-003", vendorName: "SkillBridge Tech", submittedBy: "Deepak Joshi", candidateName: "Meera Iyer", candidateInitials: "MI", requisition: "Sr Frontend Engineer", requisitionId: "REQ-2026-001", slotInfo: "Slot 2: Kopa", experience: "5 years", currentRole: "Frontend Lead", currentCompany: "Wipro", expectedCtc: "₹38L", noticePeriod: "30 days", location: "Kopa", status: "pending_review", submittedAt: "5 hours ago", aiMatchScore: 72, isDuplicate: false, vendorNotes: "Led frontend team of 4. Experience with React and Angular." },
  { id: "SUB-032", vendorId: "VND-001", vendorName: "TalentForce India", submittedBy: "Anika Sharma", candidateName: "Arjun Nair", candidateInitials: "AN", requisition: "Backend Engineer", requisitionId: "REQ-2026-002", slotInfo: "Slot 2: Pune", experience: "4 years", currentRole: "Backend Dev", currentCompany: "Infosys", expectedCtc: "₹30L", noticePeriod: "90 days", location: "Pune", status: "under_review", submittedAt: "1 day ago", aiMatchScore: 68, isDuplicate: false, vendorNotes: "Java and Python experience. Some AWS exposure." },
  { id: "SUB-031", vendorId: "VND-002", vendorName: "HireRight Global", submittedBy: "Robert Chen", candidateName: "Jessica Wang", candidateInitials: "JW", requisition: "VP Engineering", requisitionId: "REQ-2026-004", slotInfo: "Slot 1: Bangalore", experience: "15 years", currentRole: "Sr Director Eng", currentCompany: "Uber", expectedCtc: "₹85L", noticePeriod: "60 days", location: "San Francisco", status: "accepted", submittedAt: "3 days ago", aiMatchScore: 88, isDuplicate: false, vendorNotes: "Strong engineering leader. Built 200-person org at Uber." },
  { id: "SUB-030", vendorId: "VND-003", vendorName: "SkillBridge Tech", submittedBy: "Deepak Joshi", candidateName: "Rohit Saxena", candidateInitials: "RS", requisition: "Backend Engineer", requisitionId: "REQ-2026-002", slotInfo: "Slot 3: Remote", experience: "3 years", currentRole: "Developer", currentCompany: "HCL", expectedCtc: "₹25L", noticePeriod: "30 days", location: "Remote", status: "rejected", submittedAt: "4 days ago", aiMatchScore: 45, isDuplicate: false, vendorNotes: "Java developer with some Node.js." },
  { id: "SUB-029", vendorId: "VND-001", vendorName: "TalentForce India", submittedBy: "Anika Sharma", candidateName: "Priya Desai", candidateInitials: "PD", requisition: "Sr Frontend Engineer", requisitionId: "REQ-2026-001", slotInfo: "Slot 1: Pune", experience: "6 years", currentRole: "Sr Software Eng", currentCompany: "Razorpay", expectedCtc: "₹45L", noticePeriod: "30 days", location: "Bangalore", status: "duplicate", submittedAt: "5 days ago", aiMatchScore: 81, isDuplicate: true, vendorNotes: "Strong Razorpay experience." },
];

/* ── Assignments ── */

export interface VendorAssignment {
  id: string;
  vendorId: string;
  vendorName: string;
  requisitionId: string;
  requisition: string;
  slotInfo: string;
  feeRate: string;
  exclusive: boolean;
  assignedAt: string;
  deadline: string | null;
  status: "active" | "paused" | "completed" | "cancelled";
  submitted: number;
  shortlisted: number;
  interviewed: number;
  hired: number;
}

export const ASSIGNMENTS: VendorAssignment[] = [
  { id: "ASN-001", vendorId: "VND-001", vendorName: "TalentForce India", requisitionId: "REQ-2026-001", requisition: "Sr Frontend Engineer", slotInfo: "Slot 1: Pune", feeRate: "15%", exclusive: false, assignedAt: "Jan 22", deadline: "Mar 30", status: "active", submitted: 5, shortlisted: 2, interviewed: 2, hired: 0 },
  { id: "ASN-002", vendorId: "VND-003", vendorName: "SkillBridge Tech", requisitionId: "REQ-2026-001", requisition: "Sr Frontend Engineer", slotInfo: "Slot 1: Pune", feeRate: "12%", exclusive: false, assignedAt: "Feb 1", deadline: "Mar 30", status: "active", submitted: 3, shortlisted: 1, interviewed: 1, hired: 0 },
  { id: "ASN-003", vendorId: "VND-001", vendorName: "TalentForce India", requisitionId: "REQ-2026-001", requisition: "Sr Frontend Engineer", slotInfo: "Slot 2: Kopa", feeRate: "15%", exclusive: false, assignedAt: "Feb 15", deadline: null, status: "active", submitted: 2, shortlisted: 0, interviewed: 0, hired: 0 },
  { id: "ASN-004", vendorId: "VND-001", vendorName: "TalentForce India", requisitionId: "REQ-2026-002", requisition: "Backend Engineer", slotInfo: "Slot 2: Pune", feeRate: "15%", exclusive: false, assignedAt: "Jan 25", deadline: "Apr 15", status: "active", submitted: 4, shortlisted: 2, interviewed: 1, hired: 0 },
  { id: "ASN-005", vendorId: "VND-002", vendorName: "HireRight Global", requisitionId: "REQ-2026-004", requisition: "VP Engineering", slotInfo: "Slot 1: Bangalore", feeRate: "18%", exclusive: true, assignedAt: "Dec 15", deadline: "Apr 30", status: "active", submitted: 3, shortlisted: 2, interviewed: 2, hired: 0 },
  { id: "ASN-006", vendorId: "VND-006", vendorName: "Ravi K. (Freelance)", requisitionId: "REQ-2026-014", requisition: "Data Engineer", slotInfo: "Slot 1: Remote", feeRate: "₹1.5L flat", exclusive: false, assignedAt: "Mar 5", deadline: "May 31", status: "active", submitted: 2, shortlisted: 1, interviewed: 0, hired: 0 },
];

/* ── Fees ── */

export interface VendorFee {
  id: string;
  vendorId: string;
  vendorName: string;
  candidateName: string;
  role: string;
  feeAmount: string;
  currency: string;
  status: FeeStatus;
  dueDate: string;
  guaranteeEnd: string;
  guaranteeStatus: string;
}

export const FEES: VendorFee[] = [
  { id: "FEE-001", vendorId: "VND-001", vendorName: "TalentForce India", candidateName: "Vikram Patel", role: "Backend Engineer", feeAmount: "₹5.25L", currency: "INR", status: "paid", dueDate: "Mar 15", guaranteeEnd: "Jun 15", guaranteeStatus: "Active" },
  { id: "FEE-002", vendorId: "VND-002", vendorName: "HireRight Global", candidateName: "Sarah Chen", role: "VP Engineering", feeAmount: "₹12.0L", currency: "INR", status: "pending", dueDate: "Apr 30", guaranteeEnd: "Sep 30", guaranteeStatus: "Not started" },
  { id: "FEE-003", vendorId: "VND-003", vendorName: "SkillBridge Tech", candidateName: "Priya Desai", role: "Frontend Engineer", feeAmount: "₹3.6L", currency: "INR", status: "disputed", dueDate: "—", guaranteeEnd: "May 15", guaranteeStatus: "Claim raised" },
  { id: "FEE-004", vendorId: "VND-001", vendorName: "TalentForce India", candidateName: "Ananya Reddy", role: "Product Manager", feeAmount: "₹4.2L", currency: "INR", status: "triggered", dueDate: "May 15", guaranteeEnd: "Aug 15", guaranteeStatus: "Not started" },
  { id: "FEE-005", vendorId: "VND-004", vendorName: "Campus Connect", candidateName: "Amit Kumar", role: "Intern", feeAmount: "₹0.5L", currency: "INR", status: "paid", dueDate: "Feb 28", guaranteeEnd: "Mar 30", guaranteeStatus: "Expired" },
];

/* ── Compliance ── */

export interface ComplianceRow {
  vendorId: string;
  vendorName: string;
  nda: "passed" | "failed" | "pending" | "expired";
  msa: "passed" | "failed" | "pending" | "expired";
  insurance: "passed" | "failed" | "pending" | "expired" | "expiring" | "na";
  gstin: "passed" | "pending";
  pan: "passed" | "pending";
  dataProtection: "passed" | "pending";
  diversity: "passed" | "pending" | "na";
  overallStatus: "compliant" | "partially_compliant" | "non_compliant" | "pending";
}

export const COMPLIANCE_DATA: ComplianceRow[] = [
  { vendorId: "VND-001", vendorName: "TalentForce India", nda: "passed", msa: "passed", insurance: "passed", gstin: "passed", pan: "passed", dataProtection: "passed", diversity: "na", overallStatus: "compliant" },
  { vendorId: "VND-002", vendorName: "HireRight Global", nda: "passed", msa: "passed", insurance: "expiring", gstin: "passed", pan: "passed", dataProtection: "passed", diversity: "passed", overallStatus: "partially_compliant" },
  { vendorId: "VND-003", vendorName: "SkillBridge Tech", nda: "expired", msa: "passed", insurance: "expiring", gstin: "passed", pan: "passed", dataProtection: "pending", diversity: "na", overallStatus: "non_compliant" },
  { vendorId: "VND-004", vendorName: "Campus Connect", nda: "passed", msa: "passed", insurance: "na", gstin: "passed", pan: "passed", dataProtection: "passed", diversity: "passed", overallStatus: "compliant" },
  { vendorId: "VND-005", vendorName: "DiverseTech", nda: "pending", msa: "pending", insurance: "pending", gstin: "pending", pan: "pending", dataProtection: "pending", diversity: "passed", overallStatus: "pending" },
  { vendorId: "VND-006", vendorName: "Ravi K. (Freelance)", nda: "passed", msa: "passed", insurance: "na", gstin: "passed", pan: "passed", dataProtection: "passed", diversity: "na", overallStatus: "compliant" },
];

export const COMPLIANCE_ICON: Record<string, { icon: string; colorClass: string }> = {
  passed: { icon: "✅", colorClass: "text-success" },
  failed: { icon: "🔴", colorClass: "text-destructive" },
  expired: { icon: "🔴", colorClass: "text-destructive" },
  expiring: { icon: "⚠", colorClass: "text-warning" },
  pending: { icon: "⏳", colorClass: "text-warning" },
  na: { icon: "—", colorClass: "text-muted-foreground/40" },
};

/* ── Performance Rankings ── */

export const VENDOR_RANKINGS = VENDORS
  .filter((v) => v.status === "active" && v.performanceScore > 0)
  .sort((a, b) => b.performanceScore - a.performanceScore);

/* ── Counts ── */

export const VENDOR_COUNTS = {
  total: VENDORS.length,
  active: VENDORS.filter((v) => v.status === "active").length,
  activeAssignments: ASSIGNMENTS.filter((a) => a.status === "active").length,
  pendingSubmissions: SUBMISSIONS.filter((s) => s.status === "pending_review" || s.status === "under_review").length,
};

/* ── Helpers ── */

export function perfScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-brand";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

export function perfBarColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-brand";
  if (score >= 40) return "bg-warning";
  return "bg-destructive";
}

export function matchScoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-brand";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}
