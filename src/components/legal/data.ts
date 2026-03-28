/* ================================================================
   O2S Legal & Compliance — Contracts & Agreements
   Types & Mock Data
   ================================================================ */

export type LegalPage = "contracts" | "policies" | "compliance" | "documents" | "cases" | "immigration" | "dataProtection" | "spend";

export const LEGAL_SUB_NAV: { key: LegalPage; label: string; href: string }[] = [
  { key: "contracts", label: "Contracts", href: "/legal/contracts" },
  { key: "policies", label: "Policies", href: "/legal/policies" },
  { key: "compliance", label: "Compliance", href: "/legal/compliance" },
  { key: "documents", label: "Documents", href: "/legal/documents" },
  { key: "cases", label: "Cases", href: "/legal/cases" },
  { key: "immigration", label: "Immigration", href: "/legal/immigration" },
  { key: "dataProtection", label: "Data Protection", href: "/legal/data-protection" },
  { key: "spend", label: "Spend", href: "/legal/spend" },
];

export type ContractTab = "all" | "templates" | "clauses" | "signatures" | "analytics";

export const CONTRACT_TABS: { key: ContractTab; label: string; count?: number }[] = [
  { key: "all", label: "All Contracts" },
  { key: "templates", label: "Templates" },
  { key: "clauses", label: "Clause Library" },
  { key: "signatures", label: "Pending Signatures", count: 5 },
  { key: "analytics", label: "Analytics" },
];

/* ── Status Config ── */

export type ContractStatus = "draft" | "in_review" | "approved" | "pending_signatures" | "active" | "expired" | "terminated" | "superseded";
export type SignatureStatus = "not_sent" | "sent" | "partially_signed" | "fully_executed" | "declined" | "voided";

export const STATUS_CONFIG: Record<ContractStatus, { label: string; dotClass: string; textClass: string; bgClass: string }> = {
  draft:               { label: "Draft",              dotClass: "bg-muted-foreground",    textClass: "text-muted-foreground",    bgClass: "bg-secondary" },
  in_review:           { label: "In Review",          dotClass: "bg-warning",             textClass: "text-warning",             bgClass: "bg-warning/10" },
  approved:            { label: "Approved",           dotClass: "bg-brand",               textClass: "text-brand",               bgClass: "bg-brand/10" },
  pending_signatures:  { label: "Pending Signatures", dotClass: "bg-brand-purple",         textClass: "text-brand-purple",         bgClass: "bg-brand-purple/10" },
  active:              { label: "Active",             dotClass: "bg-success",             textClass: "text-success",             bgClass: "bg-success/10" },
  expired:             { label: "Expired",            dotClass: "bg-destructive",          textClass: "text-destructive",          bgClass: "bg-destructive/10" },
  terminated:          { label: "Terminated",         dotClass: "bg-muted-foreground/40", textClass: "text-muted-foreground/40", bgClass: "bg-secondary" },
  superseded:          { label: "Superseded",         dotClass: "bg-muted-foreground/40", textClass: "text-muted-foreground/40", bgClass: "bg-secondary" },
};

export const SIG_STATUS_CONFIG: Record<string, { label: string; icon: string; colorClass: string }> = {
  signed:  { label: "Signed",  icon: "✓", colorClass: "text-success" },
  pending: { label: "Pending", icon: "⏳", colorClass: "text-warning" },
  declined:{ label: "Declined",icon: "✗", colorClass: "text-destructive" },
  voided:  { label: "Voided",  icon: "—", colorClass: "text-muted-foreground" },
};

export const RISK_CONFIG: Record<string, { label: string; dotClass: string; textClass: string }> = {
  low:    { label: "Low",    dotClass: "bg-success",     textClass: "text-success" },
  medium: { label: "Medium", dotClass: "bg-warning",     textClass: "text-warning" },
  high:   { label: "High",   dotClass: "bg-destructive", textClass: "text-destructive" },
};

/* ── Contract Type Config ── */

export const CONTRACT_TYPE_LABELS: Record<string, string> = {
  employment_agreement: "Employment Agreement",
  offer_letter: "Offer Letter",
  contractor_agreement: "Contractor Agreement",
  nda_employee: "NDA (Employee)",
  nda_vendor: "NDA (Vendor)",
  nda_candidate: "NDA (Candidate)",
  ip_assignment: "IP Assignment",
  non_compete: "Non-Compete",
  amendment_letter: "Amendment Letter",
  separation_agreement: "Separation Agreement",
  internship_agreement: "Internship Agreement",
  vendor_msa: "Vendor MSA",
  vendor_sow: "Vendor SOW",
};

/* ── Mock Contracts ── */

export interface Contract {
  id: string;
  title: string;
  type: string;
  typeLabel: string;
  category: string;
  status: ContractStatus;
  partyA: { entity: string; signatory: string; signatoryTitle: string };
  partyB: { name: string; email: string; type: string; role?: string };
  jurisdiction: string;
  governingLaw: string;
  effectiveDate: string | null;
  expiryDate: string | null;
  createdAt: string;
  executedDate: string | null;
  signatures: { name: string; role: string; status: "signed" | "pending" | "declined" }[];
  signatureProgress: string;
  aiRiskScore: number;
  riskLevel: "low" | "medium" | "high";
  riskFlags: { clause: string; description: string; suggestion: string }[];
  financialTerms?: string;
  tags: string[];
}

export const CONTRACTS: Contract[] = [
  { id: "CTR-001", title: "Employment Agreement — Priya Sharma", type: "employment_agreement", typeLabel: "Employment Agreement", category: "employment", status: "active", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Prashant Singh", signatoryTitle: "CEO" }, partyB: { name: "Priya Sharma", email: "priya@latentbridge.com", type: "employee", role: "Sr Frontend Engineer" }, jurisdiction: "Maharashtra, India", governingLaw: "Indian Contract Act, 1872", effectiveDate: "Jan 15, 2023", expiryDate: null, createdAt: "Jan 10, 2023", executedDate: "Jan 12, 2023", signatures: [{ name: "Prashant Singh", role: "employer", status: "signed" }, { name: "Priya Sharma", role: "employee", status: "signed" }], signatureProgress: "2/2", aiRiskScore: 12, riskLevel: "low", riskFlags: [], financialTerms: "₹32,00,000 LPA", tags: ["employment", "engineering"] },
  { id: "CTR-002", title: "NDA — TalentForce India", type: "nda_vendor", typeLabel: "NDA (Vendor)", category: "confidentiality", status: "active", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Prashant Singh", signatoryTitle: "CEO" }, partyB: { name: "TalentForce India Pvt Ltd", email: "legal@talentforce.in", type: "vendor" }, jurisdiction: "Maharashtra, India", governingLaw: "Indian Contract Act, 1872", effectiveDate: "Nov 1, 2025", expiryDate: "Oct 31, 2026", createdAt: "Oct 25, 2025", executedDate: "Oct 28, 2025", signatures: [{ name: "Prashant Singh", role: "employer", status: "signed" }, { name: "Anika Sharma", role: "vendor", status: "signed" }], signatureProgress: "2/2", aiRiskScore: 8, riskLevel: "low", riskFlags: [], tags: ["vendor", "nda"] },
  { id: "CTR-015", title: "Separation Agreement — Vikram Rao", type: "separation_agreement", typeLabel: "Separation Agreement", category: "employment", status: "pending_signatures", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Prashant Singh", signatoryTitle: "CEO" }, partyB: { name: "Vikram Rao", email: "vikram.rao@email.com", type: "employee", role: "Sr Developer" }, jurisdiction: "Maharashtra, India", governingLaw: "Indian Contract Act, 1872", effectiveDate: null, expiryDate: null, createdAt: "Mar 15, 2026", executedDate: null, signatures: [{ name: "Prashant Singh", role: "employer", status: "signed" }, { name: "Vikram Rao", role: "employee", status: "pending" }], signatureProgress: "1/2", aiRiskScore: 72, riskLevel: "high", riskFlags: [{ clause: "Non-Compete (24 months)", description: "Exceeds typical enforceability in Maharashtra", suggestion: "Reduce to 12 months" }, { clause: "Garden Leave", description: "Missing — recommended for senior separations", suggestion: "Add garden leave clause" }], financialTerms: "₹6,00,000 severance", tags: ["separation", "engineering"] },
  { id: "CTR-048", title: "Employment Agreement — Ananya Sharma", type: "employment_agreement", typeLabel: "Employment Agreement", category: "employment", status: "pending_signatures", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Prashant Singh", signatoryTitle: "CEO" }, partyB: { name: "Ananya Sharma", email: "ananya@email.com", type: "employee", role: "Sr Frontend Developer" }, jurisdiction: "Maharashtra, India", governingLaw: "Indian Contract Act, 1872", effectiveDate: null, expiryDate: null, createdAt: "Mar 26, 2026", executedDate: null, signatures: [{ name: "Prashant Singh", role: "employer", status: "pending" }, { name: "Ananya Sharma", role: "employee", status: "pending" }, { name: "Meera Krishnan", role: "witness", status: "pending" }], signatureProgress: "0/3", aiRiskScore: 15, riskLevel: "low", riskFlags: [], financialTerms: "₹24,00,000 LPA", tags: ["employment", "engineering"] },
  { id: "CTR-003", title: "Contractor Agreement — Ravi K.", type: "contractor_agreement", typeLabel: "Contractor Agreement", category: "employment", status: "active", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Prashant Singh", signatoryTitle: "CEO" }, partyB: { name: "Ravi Krishnamurthy", email: "ravi.k@gmail.com", type: "contractor" }, jurisdiction: "Telangana, India", governingLaw: "Indian Contract Act, 1872", effectiveDate: "Oct 1, 2025", expiryDate: "Sep 30, 2026", createdAt: "Sep 25, 2025", executedDate: "Sep 28, 2025", signatures: [{ name: "Prashant Singh", role: "employer", status: "signed" }, { name: "Ravi Krishnamurthy", role: "contractor", status: "signed" }], signatureProgress: "2/2", aiRiskScore: 22, riskLevel: "low", riskFlags: [], financialTerms: "₹1,50,000/month", tags: ["contractor", "data-science"] },
  { id: "CTR-010", title: "NDA — DiverseTech Recruitment", type: "nda_vendor", typeLabel: "NDA (Vendor)", category: "confidentiality", status: "draft", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Prashant Singh", signatoryTitle: "CEO" }, partyB: { name: "DiverseTech Recruitment", email: "legal@diversetech.org", type: "vendor" }, jurisdiction: "Delhi, India", governingLaw: "Indian Contract Act, 1872", effectiveDate: null, expiryDate: null, createdAt: "Mar 20, 2026", executedDate: null, signatures: [], signatureProgress: "—", aiRiskScore: 10, riskLevel: "low", riskFlags: [], tags: ["vendor", "nda", "draft"] },
  { id: "CTR-005", title: "IP Assignment — All Employees", type: "ip_assignment", typeLabel: "IP Assignment", category: "employment", status: "active", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Prashant Singh", signatoryTitle: "CEO" }, partyB: { name: "All Employees", email: "—", type: "employee" }, jurisdiction: "India", governingLaw: "Indian Copyright Act, 1957", effectiveDate: "Jan 1, 2026", expiryDate: null, createdAt: "Dec 15, 2025", executedDate: "Dec 20, 2025", signatures: [{ name: "Prashant Singh", role: "employer", status: "signed" }], signatureProgress: "1/1", aiRiskScore: 5, riskLevel: "low", riskFlags: [], tags: ["ip", "standard"] },
  { id: "CTR-020", title: "Amendment — Salary Revision Priya S.", type: "amendment_letter", typeLabel: "Amendment Letter", category: "employment", status: "active", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Prashant Singh", signatoryTitle: "CEO" }, partyB: { name: "Priya Sharma", email: "priya@latentbridge.com", type: "employee", role: "Sr Frontend Engineer" }, jurisdiction: "Maharashtra, India", governingLaw: "Indian Contract Act, 1872", effectiveDate: "Jan 1, 2026", expiryDate: null, createdAt: "Dec 28, 2025", executedDate: "Dec 30, 2025", signatures: [{ name: "Prashant Singh", role: "employer", status: "signed" }, { name: "Priya Sharma", role: "employee", status: "signed" }], signatureProgress: "2/2", aiRiskScore: 3, riskLevel: "low", riskFlags: [], financialTerms: "₹28L → ₹32L LPA", tags: ["amendment", "compensation"] },
  { id: "CTR-006", title: "Vendor MSA — HireRight Global", type: "vendor_msa", typeLabel: "Vendor MSA", category: "vendor", status: "active", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Prashant Singh", signatoryTitle: "CEO" }, partyB: { name: "HireRight Global", email: "legal@hireright.com", type: "vendor" }, jurisdiction: "Delaware, USA", governingLaw: "State of Delaware", effectiveDate: "Jan 1, 2025", expiryDate: "Dec 31, 2026", createdAt: "Dec 20, 2024", executedDate: "Dec 28, 2024", signatures: [{ name: "Prashant Singh", role: "employer", status: "signed" }, { name: "Robert Chen", role: "vendor", status: "signed" }], signatureProgress: "2/2", aiRiskScore: 28, riskLevel: "low", riskFlags: [], tags: ["vendor", "msa", "executive-search"] },
  { id: "CTR-030", title: "Offer Letter — Liam Chen", type: "offer_letter", typeLabel: "Offer Letter", category: "employment", status: "pending_signatures", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Rajesh Kumar", signatoryTitle: "VP Engineering" }, partyB: { name: "Liam Chen", email: "liam.chen@email.com", type: "employee", role: "Sr Frontend Engineer" }, jurisdiction: "Maharashtra, India", governingLaw: "Indian Contract Act, 1872", effectiveDate: null, expiryDate: null, createdAt: "Mar 22, 2026", executedDate: null, signatures: [{ name: "Rajesh Kumar", role: "employer", status: "signed" }, { name: "Liam Chen", role: "employee", status: "pending" }], signatureProgress: "1/2", aiRiskScore: 8, riskLevel: "low", riskFlags: [], financialTerms: "₹42,00,000 LPA", tags: ["offer", "engineering"] },
  { id: "CTR-031", title: "NDA — Candidate Interview", type: "nda_candidate", typeLabel: "NDA (Candidate)", category: "confidentiality", status: "in_review", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Sarah Kim", signatoryTitle: "Recruiting Lead" }, partyB: { name: "Jessica Wang", email: "jessica@email.com", type: "external" }, jurisdiction: "California, USA", governingLaw: "State of California", effectiveDate: null, expiryDate: null, createdAt: "Mar 25, 2026", executedDate: null, signatures: [], signatureProgress: "—", aiRiskScore: 45, riskLevel: "medium", riskFlags: [{ clause: "Non-Disclosure Scope", description: "Broad scope may be challenged under California law", suggestion: "Narrow to specific project information only" }], tags: ["nda", "candidate", "us"] },
  { id: "CTR-032", title: "Employment Agreement — Maya Chen", type: "employment_agreement", typeLabel: "Employment Agreement", category: "employment", status: "pending_signatures", partyA: { entity: "Latent Bridge Technologies Pvt Ltd", signatory: "Prashant Singh", signatoryTitle: "CEO" }, partyB: { name: "Maya Chen", email: "maya.chen@email.com", type: "employee", role: "DevOps Engineer" }, jurisdiction: "Maharashtra, India", governingLaw: "Indian Contract Act, 1872", effectiveDate: null, expiryDate: null, createdAt: "Mar 20, 2026", executedDate: null, signatures: [{ name: "Prashant Singh", role: "employer", status: "signed" }, { name: "Maya Chen", role: "employee", status: "pending" }], signatureProgress: "1/2", aiRiskScore: 10, riskLevel: "low", riskFlags: [], financialTerms: "₹28,00,000 LPA", tags: ["employment", "engineering"] },
];

/* ── Templates ── */

export interface ContractTemplate {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  version: number;
  variables: number;
  usageCount: number;
  entities: string[];
  jurisdictions: string[];
  status: "active" | "draft" | "deprecated";
  lastUsed: string;
  createdAt: string;
}

export const TEMPLATES: ContractTemplate[] = [
  { id: "TMPL-001", name: "Standard Employment Agreement — India", type: "employment_agreement", typeLabel: "Employment Agreement", version: 3, variables: 12, usageCount: 87, entities: ["LB India"], jurisdictions: ["Maharashtra", "Karnataka", "Telangana"], status: "active", lastUsed: "3 days ago", createdAt: "Jan 2025" },
  { id: "TMPL-002", name: "Contractor Agreement — India", type: "contractor_agreement", typeLabel: "Contractor Agreement", version: 2, variables: 8, usageCount: 23, entities: ["LB India", "LB UAE"], jurisdictions: ["All India", "UAE"], status: "active", lastUsed: "2 weeks ago", createdAt: "Mar 2025" },
  { id: "TMPL-003", name: "NDA — Standard (All Jurisdictions)", type: "nda_employee", typeLabel: "NDA (Employee)", version: 5, variables: 4, usageCount: 312, entities: ["All"], jurisdictions: ["Global"], status: "active", lastUsed: "Today", createdAt: "Jun 2024" },
  { id: "TMPL-004", name: "Executive Employment Agreement — US", type: "employment_agreement", typeLabel: "Employment Agreement", version: 1, variables: 15, usageCount: 4, entities: ["LB US"], jurisdictions: ["California", "New York", "Delaware"], status: "active", lastUsed: "1 month ago", createdAt: "Sep 2025" },
  { id: "TMPL-005", name: "Separation Agreement — India", type: "separation_agreement", typeLabel: "Separation Agreement", version: 2, variables: 10, usageCount: 8, entities: ["LB India"], jurisdictions: ["All India"], status: "active", lastUsed: "1 week ago", createdAt: "Nov 2025" },
  { id: "TMPL-006", name: "Internship Agreement — India", type: "internship_agreement", typeLabel: "Internship Agreement", version: 1, variables: 6, usageCount: 12, entities: ["LB India"], jurisdictions: ["All India"], status: "active", lastUsed: "2 weeks ago", createdAt: "Jan 2026" },
  { id: "TMPL-007", name: "Vendor MSA — Global", type: "vendor_msa", typeLabel: "Vendor MSA", version: 2, variables: 11, usageCount: 6, entities: ["All"], jurisdictions: ["Global"], status: "active", lastUsed: "3 weeks ago", createdAt: "Aug 2025" },
  { id: "TMPL-008", name: "IP Assignment — Standard", type: "ip_assignment", typeLabel: "IP Assignment", version: 3, variables: 3, usageCount: 142, entities: ["All"], jurisdictions: ["Global"], status: "active", lastUsed: "Yesterday", createdAt: "Apr 2024" },
];

/* ── Clauses ── */

export interface ContractClause {
  id: string;
  title: string;
  shortName: string;
  category: string;
  riskLevel: "low" | "medium" | "high";
  jurisdictions: string[];
  usedInContracts: number;
  usedInTemplates: number;
  isRequired: boolean;
  description: string;
  enforcementNote?: string;
  status: "active" | "draft" | "deprecated";
}

export const CLAUSES: ContractClause[] = [
  { id: "CLS-001", title: "Non-Compete Restriction", shortName: "non_compete", category: "Non-Compete", riskLevel: "high", jurisdictions: ["India (MH)", "India (KA)", "US (CA)", "US (NY)"], usedInContracts: 45, usedInTemplates: 3, isRequired: false, description: "Restricts employee from competing post-employment", enforcementNote: "California: Generally unenforceable for employees", status: "active" },
  { id: "CLS-002", title: "Standard Confidentiality / NDA", shortName: "confidentiality", category: "Confidentiality", riskLevel: "low", jurisdictions: ["Global"], usedInContracts: 312, usedInTemplates: 8, isRequired: true, description: "Standard non-disclosure of proprietary information", status: "active" },
  { id: "CLS-003", title: "IP Assignment & Work Product", shortName: "ip_assignment", category: "IP Assignment", riskLevel: "low", jurisdictions: ["India", "US", "UAE"], usedInContracts: 234, usedInTemplates: 6, isRequired: true, description: "Assigns all work product and IP to the company", status: "active" },
  { id: "CLS-004", title: "Notice Period & Termination", shortName: "notice_period", category: "Termination", riskLevel: "low", jurisdictions: ["India", "US", "UAE", "UK"], usedInContracts: 198, usedInTemplates: 5, isRequired: true, description: "Defines notice period and termination conditions", status: "active" },
  { id: "CLS-005", title: "Non-Solicitation of Employees", shortName: "non_solicitation", category: "Non-Solicitation", riskLevel: "medium", jurisdictions: ["India", "US", "UAE"], usedInContracts: 89, usedInTemplates: 4, isRequired: false, description: "Prevents solicitation of company employees post-departure", enforcementNote: "Generally more enforceable than non-compete in India", status: "active" },
  { id: "CLS-006", title: "Governing Law & Jurisdiction", shortName: "governing_law", category: "Governing Law", riskLevel: "low", jurisdictions: ["Global"], usedInContracts: 312, usedInTemplates: 8, isRequired: true, description: "Specifies which law governs and which courts have jurisdiction", status: "active" },
  { id: "CLS-007", title: "Data Protection & Privacy", shortName: "data_protection", category: "Data Protection", riskLevel: "medium", jurisdictions: ["India", "EU", "US (CA)"], usedInContracts: 156, usedInTemplates: 6, isRequired: true, description: "GDPR/DPDP Act compliant data handling obligations", status: "active" },
  { id: "CLS-008", title: "Force Majeure", shortName: "force_majeure", category: "Force Majeure", riskLevel: "low", jurisdictions: ["Global"], usedInContracts: 78, usedInTemplates: 3, isRequired: false, description: "Excuses performance due to extraordinary events", status: "active" },
  { id: "CLS-009", title: "Indemnification", shortName: "indemnity", category: "Indemnity", riskLevel: "medium", jurisdictions: ["Global"], usedInContracts: 65, usedInTemplates: 4, isRequired: false, description: "Defines indemnification obligations between parties", status: "active" },
  { id: "CLS-010", title: "Dispute Resolution & Arbitration", shortName: "arbitration", category: "Dispute Resolution", riskLevel: "low", jurisdictions: ["India", "UAE", "Singapore"], usedInContracts: 112, usedInTemplates: 5, isRequired: false, description: "Mandates arbitration for dispute resolution", status: "active" },
];

/* ── Pending Signatures ── */

export const PENDING_SIGNATURES = CONTRACTS.filter((c) => c.status === "pending_signatures");

/* ── Analytics KPIs ── */

export const LEGAL_KPIS = [
  { label: "Active Contracts", value: "142", trend: "+12 this month", positive: true },
  { label: "Pending Signatures", value: "5", subtext: "2 overdue", positive: false },
  { label: "Expiring Soon", value: "8", subtext: "Within 30 days", positive: false },
  { label: "Avg Cycle Time", value: "3.2 days", trend: "-0.5 days", positive: true },
];

/* ── Analytics Chart Data ── */

export const CONTRACTS_BY_STATUS = [
  { status: "Active", count: 142, pct: 68 },
  { status: "Pending", count: 18, pct: 9 },
  { status: "Draft", count: 24, pct: 12 },
  { status: "Expired", count: 23, pct: 11 },
];

export const CONTRACTS_BY_TYPE = [
  { type: "Employment", count: 87 },
  { type: "NDA", count: 65 },
  { type: "Contractor", count: 28 },
  { type: "Separation", count: 12 },
  { type: "Amendment", count: 8 },
  { type: "Vendor MSA", count: 6 },
  { type: "IP Assignment", count: 1 },
];

export const SIG_TURNAROUND = [
  { type: "Employment", days: 3.2 },
  { type: "NDA", days: 1.5 },
  { type: "Separation", days: 5.8 },
  { type: "Contractor", days: 2.1 },
  { type: "Offer Letter", days: 1.8 },
];

/* ── Counts ── */

export const CONTRACT_COUNTS = {
  total: CONTRACTS.length,
  active: CONTRACTS.filter((c) => c.status === "active").length,
  pending: CONTRACTS.filter((c) => c.status === "pending_signatures").length,
  draft: CONTRACTS.filter((c) => c.status === "draft").length,
  expiringSoon: 8,
  templates: TEMPLATES.length,
  clauses: CLAUSES.length,
};
