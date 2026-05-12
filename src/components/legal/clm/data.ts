/* ================================================================
   O2S Legal — Contract Lifecycle Management (CLM)
   Section 4.2 of the Legal & Legal Ops module plan.

   This dataset powers eight surfaces:
     1. Templates & playbooks
     2. Authoring & drafting
     3. Review & redlining
     4. Negotiation workspace
     5. Approval workflows
     6. Signature
     7. Post-signature repository (search + metadata)
     8. Obligation tracker + renewal sentinel + amendments

   Everything is denormalised for read-side ease — pages compose from
   this without joining anywhere else.
   ================================================================ */

/* ───────────────────────── Common types ───────────────────────── */

export type ContractType =
  | "msa"
  | "sow"
  | "nda_mutual"
  | "nda_one_way"
  | "dpa"
  | "saas_subscription"
  | "vendor_services"
  | "employment"
  | "contractor"
  | "ip_licence"
  | "partner";

export const CONTRACT_TYPE_LABEL: Record<ContractType, string> = {
  msa:                "Master Services Agreement",
  sow:                "Statement of Work",
  nda_mutual:         "Mutual NDA",
  nda_one_way:        "One-way NDA",
  dpa:                "Data Processing Addendum",
  saas_subscription:  "SaaS Subscription",
  vendor_services:    "Vendor Services Agreement",
  employment:         "Employment Agreement",
  contractor:         "Contractor Agreement",
  ip_licence:         "IP Licence",
  partner:            "Partner / Channel",
};

export type ContractStatus =
  | "intake"           // a request has been raised; no draft yet
  | "drafting"         // a draft is being assembled / edited
  | "internal_review"  // legal / business reviewing
  | "out_to_counterparty"
  | "negotiation"      // redlines flying back and forth
  | "approval"         // routed through approver chain
  | "out_for_signature"
  | "active"           // signed and in force
  | "expiring_soon"    // active but within 90 days of expiry
  | "expired"
  | "terminated"
  | "superseded";

export const STATUS_LABEL: Record<ContractStatus, string> = {
  intake:               "Intake",
  drafting:             "Drafting",
  internal_review:      "Internal review",
  out_to_counterparty:  "Out to counterparty",
  negotiation:          "Negotiation",
  approval:             "Approval",
  out_for_signature:    "Out for signature",
  active:               "Active",
  expiring_soon:        "Expiring soon",
  expired:              "Expired",
  terminated:           "Terminated",
  superseded:           "Superseded",
};

export const STATUS_TINT: Record<ContractStatus, string> = {
  intake:               "bg-secondary text-muted-foreground",
  drafting:             "bg-secondary text-foreground",
  internal_review:      "bg-warning/10 text-warning",
  out_to_counterparty:  "bg-brand/10 text-brand",
  negotiation:          "bg-brand-purple/10 text-brand-purple",
  approval:             "bg-warning/10 text-warning",
  out_for_signature:    "bg-brand/10 text-brand",
  active:               "bg-success/10 text-success",
  expiring_soon:        "bg-warning/10 text-warning",
  expired:              "bg-destructive/10 text-destructive",
  terminated:           "bg-muted-foreground/10 text-muted-foreground",
  superseded:           "bg-muted-foreground/10 text-muted-foreground",
};

export type ContractRisk = "low" | "medium" | "high" | "critical";

export const RISK_TINT: Record<ContractRisk, string> = {
  low:      "bg-success/10 text-success",
  medium:   "bg-warning/10 text-warning",
  high:     "bg-destructive/10 text-destructive",
  critical: "bg-destructive text-destructive-foreground",
};

export type ClauseSeverity = "green" | "yellow" | "red";

export const CLAUSE_TINT: Record<ClauseSeverity, string> = {
  green:  "bg-success/10 text-success",
  yellow: "bg-warning/10 text-warning",
  red:    "bg-destructive/10 text-destructive",
};

export const CLAUSE_LABEL: Record<ClauseSeverity, string> = {
  green:  "Acceptable",
  yellow: "Caveat",
  red:    "Off-playbook",
};

/* ───────────────────────── Clause library ───────────────────────── */

export interface ClauseLibraryEntry {
  id: string;
  shortName: string;
  title: string;
  category:
    | "Confidentiality"
    | "Liability"
    | "Indemnity"
    | "IP"
    | "Data"
    | "Term"
    | "Payment"
    | "Termination"
    | "Governing law"
    | "Warranties"
    | "Insurance"
    | "Non-solicit";
  approvedLanguage: string;
  jurisdictions: string[];
  riskLevel: ContractRisk;
  usedInTemplates: number;
  usedInContracts: number;
  lastUpdated: string;
  ownerTeam: "Commercial" | "Privacy" | "Employment" | "Corporate";
}

export const CLAUSE_LIBRARY: ClauseLibraryEntry[] = [
  { id: "CL-001", shortName: "mutual_confidentiality", title: "Mutual confidentiality (3 years)", category: "Confidentiality", approvedLanguage: "Each party will hold the other party's Confidential Information in strict confidence for a period of three (3) years from the date of disclosure…", jurisdictions: ["India", "EU", "US", "UK", "UAE"], riskLevel: "low", usedInTemplates: 9, usedInContracts: 41, lastUpdated: "2026-02-10", ownerTeam: "Commercial" },
  { id: "CL-002", shortName: "ip_assignment", title: "IP assignment — work product", category: "IP", approvedLanguage: "All deliverables and work product created under this Agreement shall be the sole and exclusive property of the Customer upon full payment…", jurisdictions: ["India", "US", "UK"], riskLevel: "low", usedInTemplates: 6, usedInContracts: 23, lastUpdated: "2025-11-04", ownerTeam: "Commercial" },
  { id: "CL-003", shortName: "limitation_of_liability_12m", title: "LoL — 12 months fees cap, mutual", category: "Liability", approvedLanguage: "Each party's aggregate liability shall not exceed the fees paid in the twelve (12) months preceding the claim, save for breach of confidentiality, indemnity, or wilful misconduct…", jurisdictions: ["Global"], riskLevel: "medium", usedInTemplates: 7, usedInContracts: 28, lastUpdated: "2026-01-20", ownerTeam: "Commercial" },
  { id: "CL-004", shortName: "limitation_of_liability_unlimited", title: "LoL — unlimited (off-playbook)", category: "Liability", approvedLanguage: "(Off-playbook — used only with VP Legal approval). The party agrees to unlimited liability for…", jurisdictions: ["Global"], riskLevel: "critical", usedInTemplates: 0, usedInContracts: 1, lastUpdated: "2025-09-18", ownerTeam: "Commercial" },
  { id: "CL-005", shortName: "indemnity_ip", title: "IP indemnity — supplier indemnifies", category: "Indemnity", approvedLanguage: "Supplier shall defend, indemnify and hold harmless Customer against any third-party claim that the Deliverables infringe IP rights…", jurisdictions: ["Global"], riskLevel: "medium", usedInTemplates: 6, usedInContracts: 22, lastUpdated: "2025-12-12", ownerTeam: "Commercial" },
  { id: "CL-006", shortName: "indemnity_data_breach", title: "Data breach indemnity", category: "Indemnity", approvedLanguage: "Either party will indemnify the other for losses arising from its breach of Section X (Data Protection), including regulatory fines that are recoverable in law…", jurisdictions: ["EU", "UK", "India"], riskLevel: "high", usedInTemplates: 4, usedInContracts: 11, lastUpdated: "2026-03-02", ownerTeam: "Privacy" },
  { id: "CL-007", shortName: "gdpr_dpa", title: "Standard DPA (GDPR + DPDP)", category: "Data", approvedLanguage: "Processor will process Personal Data only on documented instructions from Controller, subject to Standard Contractual Clauses (Module 2) where transfers occur outside the EEA / India…", jurisdictions: ["EU", "India"], riskLevel: "high", usedInTemplates: 3, usedInContracts: 9, lastUpdated: "2026-04-01", ownerTeam: "Privacy" },
  { id: "CL-008", shortName: "termination_for_convenience_60", title: "Termination for convenience — 60 days", category: "Termination", approvedLanguage: "Customer may terminate this Agreement for convenience on sixty (60) days' written notice, subject to payment for work performed up to the termination date…", jurisdictions: ["Global"], riskLevel: "low", usedInTemplates: 5, usedInContracts: 18, lastUpdated: "2025-10-15", ownerTeam: "Commercial" },
  { id: "CL-009", shortName: "termination_for_convenience_30", title: "Termination for convenience — 30 days", category: "Termination", approvedLanguage: "Customer may terminate this Agreement for convenience on thirty (30) days' written notice…", jurisdictions: ["Global"], riskLevel: "medium", usedInTemplates: 2, usedInContracts: 6, lastUpdated: "2025-08-22", ownerTeam: "Commercial" },
  { id: "CL-010", shortName: "auto_renewal_12m_30d_notice", title: "Auto-renew 12 months — 30 days opt-out", category: "Term", approvedLanguage: "This Agreement shall automatically renew for successive twelve (12) month terms unless either party gives thirty (30) days' notice prior to the end of the then-current term…", jurisdictions: ["Global"], riskLevel: "medium", usedInTemplates: 4, usedInContracts: 14, lastUpdated: "2025-12-01", ownerTeam: "Commercial" },
  { id: "CL-011", shortName: "no_auto_renewal", title: "No auto-renewal", category: "Term", approvedLanguage: "This Agreement shall not auto-renew. Any renewal requires written agreement of both parties…", jurisdictions: ["Global"], riskLevel: "low", usedInTemplates: 3, usedInContracts: 8, lastUpdated: "2025-09-30", ownerTeam: "Commercial" },
  { id: "CL-012", shortName: "payment_30_net", title: "Payment — Net 30", category: "Payment", approvedLanguage: "Undisputed invoices shall be paid within thirty (30) days of receipt…", jurisdictions: ["Global"], riskLevel: "low", usedInTemplates: 8, usedInContracts: 29, lastUpdated: "2025-07-11", ownerTeam: "Commercial" },
  { id: "CL-013", shortName: "payment_45_net", title: "Payment — Net 45 (cap)", category: "Payment", approvedLanguage: "Undisputed invoices shall be paid within forty-five (45) days of receipt…", jurisdictions: ["Global"], riskLevel: "medium", usedInTemplates: 2, usedInContracts: 7, lastUpdated: "2025-10-28", ownerTeam: "Commercial" },
  { id: "CL-014", shortName: "governing_law_india", title: "Governing law — India / Mumbai courts", category: "Governing law", approvedLanguage: "This Agreement is governed by the laws of India. The courts at Mumbai shall have exclusive jurisdiction…", jurisdictions: ["India"], riskLevel: "low", usedInTemplates: 5, usedInContracts: 17, lastUpdated: "2026-02-22", ownerTeam: "Commercial" },
  { id: "CL-015", shortName: "governing_law_eng_wales", title: "Governing law — England & Wales", category: "Governing law", approvedLanguage: "This Agreement is governed by the laws of England and Wales. The courts of London shall have exclusive jurisdiction…", jurisdictions: ["UK", "EU"], riskLevel: "low", usedInTemplates: 3, usedInContracts: 9, lastUpdated: "2025-12-15", ownerTeam: "Commercial" },
  { id: "CL-016", shortName: "warranties_standard", title: "Standard warranties — services performed in workmanlike manner", category: "Warranties", approvedLanguage: "Supplier warrants that the Services shall be performed in a professional, workmanlike manner and in accordance with industry standards…", jurisdictions: ["Global"], riskLevel: "low", usedInTemplates: 6, usedInContracts: 21, lastUpdated: "2025-11-09", ownerTeam: "Commercial" },
  { id: "CL-017", shortName: "non_solicit_12", title: "Non-solicitation of personnel — 12 months", category: "Non-solicit", approvedLanguage: "During the Term and for twelve (12) months thereafter, neither party shall solicit for employment any personnel of the other party who was directly engaged on this Agreement…", jurisdictions: ["India", "US", "UK"], riskLevel: "medium", usedInTemplates: 4, usedInContracts: 12, lastUpdated: "2025-09-04", ownerTeam: "Employment" },
  { id: "CL-018", shortName: "insurance_5m", title: "Insurance — USD 5M E&O + Cyber", category: "Insurance", approvedLanguage: "Supplier shall maintain professional indemnity / errors and omissions and cyber liability insurance of not less than USD 5,000,000 per claim…", jurisdictions: ["Global"], riskLevel: "low", usedInTemplates: 4, usedInContracts: 15, lastUpdated: "2026-01-12", ownerTeam: "Commercial" },
];

export function clauseById(id: string): ClauseLibraryEntry | undefined {
  return CLAUSE_LIBRARY.find((c) => c.id === id);
}

/* ───────────────────────── Playbook ───────────────────────── */

export interface PlaybookPosition {
  id: string;
  clauseTopic: string;            // e.g. "Limitation of Liability"
  ideal: { summary: string; clauseId?: string };
  acceptable: { summary: string; clauseId?: string }[];
  unacceptable: { summary: string };
  approvalThreshold: "team_lead" | "head_of_legal" | "general_counsel";
  rationale: string;
  category: ClauseLibraryEntry["category"];
}

export const PLAYBOOK: PlaybookPosition[] = [
  {
    id: "PB-LOL",
    clauseTopic: "Limitation of Liability",
    ideal: { summary: "12-month fees cap, mutual, carve-outs for confidentiality, indemnity, wilful misconduct", clauseId: "CL-003" },
    acceptable: [
      { summary: "18-month fees cap, mutual, same carve-outs (head_of_legal sign-off)" },
      { summary: "12-month fees cap, mutual, no carve-out for confidentiality (head_of_legal sign-off)" },
    ],
    unacceptable: { summary: "Unlimited or 2× annual fees; one-way cap; carve-out only on supplier-side" },
    approvalThreshold: "head_of_legal",
    rationale: "12-month fees cap is consistent with insurance coverage and prior precedent. Anything above 18 months requires GC review.",
    category: "Liability",
  },
  {
    id: "PB-IND",
    clauseTopic: "Indemnity",
    ideal: { summary: "Supplier indemnifies for IP infringement and data breach; mutual indemnity for third-party claims arising from breach", clauseId: "CL-005" },
    acceptable: [
      { summary: "Supplier indemnifies only for IP infringement (head_of_legal sign-off if customer-side data is in scope)" },
    ],
    unacceptable: { summary: "Customer must indemnify supplier for use of supplier's standard product; no IP indemnity at all" },
    approvalThreshold: "head_of_legal",
    rationale: "IP indemnity is a baseline expectation in master agreements. Data breach indemnity is essential where personal data is processed.",
    category: "Indemnity",
  },
  {
    id: "PB-DATA",
    clauseTopic: "Data Protection",
    ideal: { summary: "Standard DPA (GDPR + DPDP) attached as schedule with SCCs Module 2 for cross-border transfers", clauseId: "CL-007" },
    acceptable: [
      { summary: "Supplier's DPA reviewed by Privacy team and substantially equivalent (privacy team sign-off)" },
    ],
    unacceptable: { summary: "No DPA; supplier-favourable DPA without SCCs; data resident outside contractual region" },
    approvalThreshold: "head_of_legal",
    rationale: "DPA is non-negotiable where any personal data is processed. Privacy must review supplier variants.",
    category: "Data",
  },
  {
    id: "PB-TERM",
    clauseTopic: "Termination for Convenience",
    ideal: { summary: "Customer may terminate on 60 days' notice; payment for work performed", clauseId: "CL-008" },
    acceptable: [
      { summary: "30 days' notice (team_lead sign-off)", clauseId: "CL-009" },
      { summary: "90 days' notice if fixed-fee project < 12 months (team_lead sign-off)" },
    ],
    unacceptable: { summary: "No termination for convenience; termination only by mutual agreement; > 180 days notice" },
    approvalThreshold: "team_lead",
    rationale: "Right to exit is essential. Shorter notice is acceptable for smaller engagements; longer notice only with strong justification.",
    category: "Termination",
  },
  {
    id: "PB-RENEW",
    clauseTopic: "Auto-renewal",
    ideal: { summary: "Auto-renew for 12 months unless 30 days' notice given; no price escalation tied to auto-renewal", clauseId: "CL-010" },
    acceptable: [
      { summary: "No auto-renewal — pure opt-in", clauseId: "CL-011" },
      { summary: "Auto-renew with CPI escalation capped at 5% (team_lead sign-off)" },
    ],
    unacceptable: { summary: "Auto-renew with uncapped price increase; opt-out window < 30 days; opt-out only by registered post" },
    approvalThreshold: "team_lead",
    rationale: "Auto-renewals trap us in deals if not surfaced. 30-day window aligns with renewal calendar workflow.",
    category: "Term",
  },
  {
    id: "PB-PAY",
    clauseTopic: "Payment terms",
    ideal: { summary: "Net 30 from receipt of undisputed invoice", clauseId: "CL-012" },
    acceptable: [
      { summary: "Net 45 (team_lead sign-off if customer's standard)", clauseId: "CL-013" },
    ],
    unacceptable: { summary: "Net 60+ as supplier; > Net 30 as customer; setoff clauses; payment tied to subjective customer satisfaction" },
    approvalThreshold: "team_lead",
    rationale: "Cash flow impact. Net 45 is a common customer ask and acceptable with sign-off; Net 60+ is not.",
    category: "Payment",
  },
  {
    id: "PB-GL",
    clauseTopic: "Governing law",
    ideal: { summary: "India / Mumbai courts when we contract from India entity", clauseId: "CL-014" },
    acceptable: [
      { summary: "England & Wales for EU / UK counterparties", clauseId: "CL-015" },
      { summary: "Delaware / NY for US counterparties (team_lead sign-off)" },
      { summary: "Singapore / SIAC for SE Asia counterparties (team_lead sign-off)" },
    ],
    unacceptable: { summary: "Jurisdictions with no enforcement treaty (e.g. certain offshore venues)" },
    approvalThreshold: "team_lead",
    rationale: "Enforceability and cost of disputes drive jurisdiction choice. Neutral seats acceptable for cross-border deals.",
    category: "Governing law",
  },
  {
    id: "PB-NS",
    clauseTopic: "Non-solicitation",
    ideal: { summary: "Mutual non-solicit of personnel directly engaged on the project — 12 months post-term", clauseId: "CL-017" },
    acceptable: [
      { summary: "6-month non-solicit (team_lead sign-off)" },
    ],
    unacceptable: { summary: "Blanket non-solicit covering all personnel; non-hire (rather than non-solicit) provisions" },
    approvalThreshold: "team_lead",
    rationale: "Targeted non-solicit is reasonable. Broad non-hire is anti-competitive and rarely enforceable in India.",
    category: "Non-solicit",
  },
  {
    id: "PB-INS",
    clauseTopic: "Insurance",
    ideal: { summary: "USD 5M Professional Indemnity + USD 5M Cyber, named insured includes Customer", clauseId: "CL-018" },
    acceptable: [
      { summary: "USD 2M PI / USD 2M Cyber if total contract value < USD 250K (team_lead sign-off)" },
    ],
    unacceptable: { summary: "No insurance; insurance below USD 1M; insurance excluding cyber for technology engagements" },
    approvalThreshold: "team_lead",
    rationale: "Insurance underwrites liability. Coverage levels scale with deal size.",
    category: "Insurance",
  },
];

export function playbookByTopic(topic: string): PlaybookPosition | undefined {
  return PLAYBOOK.find((p) => p.clauseTopic === topic);
}

/* ───────────────────────── Templates ───────────────────────── */

export interface TemplateVariable {
  key: string;
  label: string;
  kind: "text" | "currency" | "date" | "select" | "number";
  required: boolean;
  options?: string[];
  defaultValue?: string;
  help?: string;
}

export interface TemplateVersion {
  version: number;
  notes: string;
  releasedOn: string;
  releasedBy: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  type: ContractType;
  description: string;
  jurisdictionVariants: { jurisdiction: string; ownerTeam: string }[];
  variables: TemplateVariable[];
  /** Ordered clause ids that compose this template's first draft. */
  clauseIds: string[];
  /** Acceptable fallback clauses (e.g. 45-day payment instead of 30-day). */
  fallbackClauseIds: string[];
  playbookIds: string[];
  versions: TemplateVersion[];
  /** Number of contracts that have been generated from this template. */
  usageCount: number;
  status: "active" | "deprecated" | "draft";
  selfServeAllowed: boolean;
}

export const TEMPLATES: ContractTemplate[] = [
  {
    id: "TPL-MSA-IN",
    name: "Master Services Agreement — India (standard)",
    type: "msa",
    description: "Default outbound MSA for India entity. Covers services, deliverables, IP, liability, and renewals.",
    jurisdictionVariants: [
      { jurisdiction: "India", ownerTeam: "Commercial" },
      { jurisdiction: "Singapore", ownerTeam: "Commercial" },
    ],
    variables: [
      { key: "customerEntity", label: "Customer legal entity", kind: "text", required: true },
      { key: "customerAddress", label: "Customer registered address", kind: "text", required: true },
      { key: "currency", label: "Contract currency", kind: "select", required: true, options: ["INR", "USD", "EUR", "GBP", "AED"], defaultValue: "INR" },
      { key: "effectiveDate", label: "Effective date", kind: "date", required: true },
      { key: "initialTermMonths", label: "Initial term (months)", kind: "number", required: true, defaultValue: "12" },
      { key: "noticeDays", label: "Termination for convenience (days)", kind: "number", required: true, defaultValue: "60" },
    ],
    clauseIds: ["CL-001", "CL-002", "CL-003", "CL-005", "CL-007", "CL-008", "CL-010", "CL-012", "CL-014", "CL-016", "CL-017", "CL-018"],
    fallbackClauseIds: ["CL-009", "CL-013", "CL-011"],
    playbookIds: ["PB-LOL", "PB-IND", "PB-DATA", "PB-TERM", "PB-RENEW", "PB-PAY", "PB-GL", "PB-NS", "PB-INS"],
    versions: [
      { version: 1, notes: "Initial release", releasedOn: "2025-01-12", releasedBy: "Aanya Iyer" },
      { version: 2, notes: "DPDP-aligned data clause; mutual non-solicit", releasedOn: "2025-09-08", releasedBy: "Aanya Iyer" },
      { version: 3, notes: "Carve-outs for indemnity tightened", releasedOn: "2026-02-14", releasedBy: "Aanya Iyer" },
    ],
    usageCount: 31,
    status: "active",
    selfServeAllowed: false,
  },
  {
    id: "TPL-SOW-IN",
    name: "Statement of Work — India",
    type: "sow",
    description: "SOW that hangs off the MSA. Captures scope, deliverables, milestones, acceptance criteria.",
    jurisdictionVariants: [
      { jurisdiction: "India", ownerTeam: "Commercial" },
      { jurisdiction: "UAE", ownerTeam: "Commercial" },
    ],
    variables: [
      { key: "parentMsa", label: "Parent MSA reference", kind: "text", required: true },
      { key: "projectName", label: "Project name", kind: "text", required: true },
      { key: "scope", label: "Scope of work", kind: "text", required: true },
      { key: "feeModel", label: "Fee model", kind: "select", required: true, options: ["Fixed fee", "Time & materials", "Capped T&M"] },
      { key: "value", label: "Total value", kind: "currency", required: true },
      { key: "milestones", label: "Milestone schedule", kind: "text", required: false },
    ],
    clauseIds: ["CL-002", "CL-016"],
    fallbackClauseIds: [],
    playbookIds: ["PB-PAY"],
    versions: [
      { version: 1, notes: "Initial", releasedOn: "2025-01-12", releasedBy: "Aanya Iyer" },
      { version: 2, notes: "Acceptance criteria clarified; T&M cap option", releasedOn: "2025-11-22", releasedBy: "Aanya Iyer" },
    ],
    usageCount: 47,
    status: "active",
    selfServeAllowed: true,
  },
  {
    id: "TPL-NDA-M",
    name: "Mutual NDA — short form",
    type: "nda_mutual",
    description: "Two-page mutual NDA for early-stage discussions. Self-serve by business users.",
    jurisdictionVariants: [
      { jurisdiction: "India", ownerTeam: "Commercial" },
      { jurisdiction: "US", ownerTeam: "Commercial" },
      { jurisdiction: "EU", ownerTeam: "Commercial" },
    ],
    variables: [
      { key: "counterparty", label: "Counterparty", kind: "text", required: true },
      { key: "purpose", label: "Purpose / discussion topic", kind: "text", required: true },
      { key: "termMonths", label: "Confidentiality term (months)", kind: "number", required: true, defaultValue: "36" },
    ],
    clauseIds: ["CL-001", "CL-014"],
    fallbackClauseIds: ["CL-015"],
    playbookIds: ["PB-GL"],
    versions: [
      { version: 1, notes: "Initial", releasedOn: "2024-08-04", releasedBy: "Aanya Iyer" },
      { version: 2, notes: "US export-control reference added", releasedOn: "2025-10-01", releasedBy: "Aanya Iyer" },
      { version: 3, notes: "DPDP carve-out", releasedOn: "2026-03-15", releasedBy: "Aanya Iyer" },
    ],
    usageCount: 124,
    status: "active",
    selfServeAllowed: true,
  },
  {
    id: "TPL-NDA-1",
    name: "One-way NDA (we disclose)",
    type: "nda_one_way",
    description: "Use when we're sharing confidential information but counterparty isn't.",
    jurisdictionVariants: [{ jurisdiction: "Global", ownerTeam: "Commercial" }],
    variables: [
      { key: "counterparty", label: "Counterparty", kind: "text", required: true },
      { key: "purpose", label: "Purpose", kind: "text", required: true },
      { key: "termMonths", label: "Confidentiality term (months)", kind: "number", required: true, defaultValue: "60" },
    ],
    clauseIds: ["CL-001", "CL-014"],
    fallbackClauseIds: [],
    playbookIds: [],
    versions: [
      { version: 1, notes: "Initial", releasedOn: "2024-09-12", releasedBy: "Aanya Iyer" },
    ],
    usageCount: 38,
    status: "active",
    selfServeAllowed: true,
  },
  {
    id: "TPL-DPA",
    name: "Data Processing Addendum (GDPR + DPDP)",
    type: "dpa",
    description: "Annex to MSAs/SaaS contracts where personal data is processed.",
    jurisdictionVariants: [
      { jurisdiction: "EU", ownerTeam: "Privacy" },
      { jurisdiction: "India", ownerTeam: "Privacy" },
      { jurisdiction: "UK", ownerTeam: "Privacy" },
    ],
    variables: [
      { key: "parentAgreement", label: "Parent agreement", kind: "text", required: true },
      { key: "dataCategories", label: "Categories of data processed", kind: "text", required: true },
      { key: "transfersOutsideEEA", label: "Transfers outside EEA / India?", kind: "select", required: true, options: ["Yes", "No"] },
    ],
    clauseIds: ["CL-007", "CL-006"],
    fallbackClauseIds: [],
    playbookIds: ["PB-DATA", "PB-IND"],
    versions: [
      { version: 1, notes: "Initial DPA", releasedOn: "2024-06-01", releasedBy: "Ravi Menon" },
      { version: 2, notes: "DPDP-aligned schedule", releasedOn: "2025-12-04", releasedBy: "Ravi Menon" },
    ],
    usageCount: 18,
    status: "active",
    selfServeAllowed: false,
  },
  {
    id: "TPL-SAAS",
    name: "SaaS Subscription Agreement",
    type: "saas_subscription",
    description: "Customer subscription to our SaaS platform.",
    jurisdictionVariants: [
      { jurisdiction: "India", ownerTeam: "Commercial" },
      { jurisdiction: "Global", ownerTeam: "Commercial" },
    ],
    variables: [
      { key: "customerEntity", label: "Customer legal entity", kind: "text", required: true },
      { key: "plan", label: "Plan", kind: "select", required: true, options: ["Starter", "Growth", "Enterprise"] },
      { key: "seats", label: "Seats", kind: "number", required: true },
      { key: "annualFee", label: "Annual fee", kind: "currency", required: true },
    ],
    clauseIds: ["CL-001", "CL-003", "CL-007", "CL-010", "CL-012", "CL-014", "CL-016", "CL-018"],
    fallbackClauseIds: ["CL-008", "CL-013"],
    playbookIds: ["PB-LOL", "PB-DATA", "PB-RENEW", "PB-PAY", "PB-GL", "PB-INS"],
    versions: [
      { version: 1, notes: "Initial", releasedOn: "2025-02-20", releasedBy: "Aanya Iyer" },
      { version: 2, notes: "Auto-renew opt-out window extended to 30 days", releasedOn: "2025-11-12", releasedBy: "Aanya Iyer" },
    ],
    usageCount: 22,
    status: "active",
    selfServeAllowed: false,
  },
  {
    id: "TPL-VEND",
    name: "Vendor Services Agreement (we are customer)",
    type: "vendor_services",
    description: "Standard inbound vendor agreement.",
    jurisdictionVariants: [{ jurisdiction: "India", ownerTeam: "Commercial" }],
    variables: [
      { key: "vendor", label: "Vendor", kind: "text", required: true },
      { key: "services", label: "Services description", kind: "text", required: true },
      { key: "value", label: "Total value", kind: "currency", required: true },
      { key: "paymentTerms", label: "Payment terms", kind: "select", required: true, options: ["Net 30", "Net 45", "Net 60"], defaultValue: "Net 30" },
    ],
    clauseIds: ["CL-001", "CL-003", "CL-005", "CL-008", "CL-012", "CL-014", "CL-016", "CL-018"],
    fallbackClauseIds: ["CL-013"],
    playbookIds: ["PB-LOL", "PB-IND", "PB-TERM", "PB-PAY", "PB-GL", "PB-INS"],
    versions: [
      { version: 1, notes: "Initial", releasedOn: "2025-04-18", releasedBy: "Aanya Iyer" },
    ],
    usageCount: 14,
    status: "active",
    selfServeAllowed: false,
  },
];

export function templateById(id: string): ContractTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/* ───────────────────────── Counterparties ───────────────────────── */

export interface Counterparty {
  id: string;
  name: string;
  shortName: string;
  country: string;
  industry: string;
  /** Contracts (by id) we have or have had with them. */
  contractIds: string[];
  /** Friction & history — what they've historically pushed back on. */
  historicalPositions: { topic: string; theyPushFor: string; weAccepted: boolean }[];
  /** Total live ARR / value with us. */
  totalValueINR: number;
  riskTier: "tier_a" | "tier_b" | "tier_c";
  notes?: string;
}

export const COUNTERPARTIES: Counterparty[] = [
  { id: "CP-001", name: "Sumitomo Mitsui Banking Corporation",  shortName: "Sumitomo", country: "Japan",      industry: "Banking",       contractIds: ["CT-001", "CT-014"], historicalPositions: [{ topic: "Limitation of Liability", theyPushFor: "Unlimited for IP infringement; otherwise 2× annual fees", weAccepted: false }, { topic: "Data Protection", theyPushFor: "Customer-favourable DPA with onsite audit rights", weAccepted: true }], totalValueINR: 38_500_000, riskTier: "tier_a", notes: "Strategic banking client. Long sales cycle, conservative legal team." },
  { id: "CP-002", name: "Kotak Mahindra Bank",                   shortName: "Kotak",    country: "India",      industry: "Banking",       contractIds: ["CT-002", "CT-009", "CT-022"], historicalPositions: [{ topic: "Payment terms", theyPushFor: "Net 45", weAccepted: true }], totalValueINR: 72_000_000, riskTier: "tier_a" },
  { id: "CP-003", name: "Shell Energy Asia",                     shortName: "Shell",    country: "Singapore",  industry: "Energy",        contractIds: ["CT-003", "CT-016"], historicalPositions: [{ topic: "Governing law", theyPushFor: "English law / London arbitration", weAccepted: true }], totalValueINR: 24_000_000, riskTier: "tier_a" },
  { id: "CP-004", name: "Aviva Insurance",                       shortName: "Aviva",    country: "UK",         industry: "Insurance",     contractIds: ["CT-004"], historicalPositions: [{ topic: "Insurance", theyPushFor: "GBP 10M PI minimum", weAccepted: false }], totalValueINR: 18_500_000, riskTier: "tier_a" },
  { id: "CP-005", name: "Tata Consumer Products",                shortName: "Tata Consumer", country: "India", industry: "Consumer goods", contractIds: ["CT-005", "CT-021"], historicalPositions: [], totalValueINR: 9_800_000, riskTier: "tier_b" },
  { id: "CP-006", name: "Razorpay",                              shortName: "Razorpay", country: "India",      industry: "Fintech",       contractIds: ["CT-006", "CT-020"], historicalPositions: [{ topic: "Auto-renewal", theyPushFor: "No auto-renewal", weAccepted: true }], totalValueINR: 5_400_000, riskTier: "tier_b" },
  { id: "CP-007", name: "Maersk",                                shortName: "Maersk",   country: "Denmark",    industry: "Logistics",     contractIds: ["CT-007"], historicalPositions: [], totalValueINR: 14_200_000, riskTier: "tier_a" },
  { id: "CP-008", name: "DBS Bank",                              shortName: "DBS",      country: "Singapore",  industry: "Banking",       contractIds: ["CT-008", "CT-017"], historicalPositions: [{ topic: "Governing law", theyPushFor: "Singapore law / SIAC", weAccepted: true }], totalValueINR: 31_000_000, riskTier: "tier_a" },
  { id: "CP-009", name: "AWS",                                   shortName: "AWS",      country: "US",         industry: "Cloud",         contractIds: ["CT-010"], historicalPositions: [], totalValueINR: 22_400_000, riskTier: "tier_a", notes: "We're the customer. Their paper, click-through." },
  { id: "CP-010", name: "Workday",                               shortName: "Workday",  country: "US",         industry: "SaaS",          contractIds: ["CT-011"], historicalPositions: [], totalValueINR: 8_100_000, riskTier: "tier_b" },
  { id: "CP-011", name: "Salesforce",                            shortName: "Salesforce", country: "US",       industry: "SaaS",          contractIds: ["CT-012"], historicalPositions: [], totalValueINR: 6_400_000, riskTier: "tier_b" },
  { id: "CP-012", name: "DataDog",                               shortName: "DataDog",  country: "US",         industry: "Observability", contractIds: ["CT-019"], historicalPositions: [], totalValueINR: 3_200_000, riskTier: "tier_c" },
  { id: "CP-013", name: "Notion Labs",                           shortName: "Notion",   country: "US",         industry: "SaaS",          contractIds: ["CT-013"], historicalPositions: [], totalValueINR: 480_000, riskTier: "tier_c" },
  { id: "CP-014", name: "TalentForce India",                     shortName: "TalentForce", country: "India",   industry: "Staffing",      contractIds: ["CT-015"], historicalPositions: [], totalValueINR: 6_800_000, riskTier: "tier_b" },
  { id: "CP-015", name: "DPDP Office of India (regulator)",     shortName: "DPDP",     country: "India",      industry: "Regulator",     contractIds: [], historicalPositions: [], totalValueINR: 0, riskTier: "tier_a", notes: "Not a contract counterparty — kept for DPIA/audit linkage." },
  { id: "CP-016", name: "Adobe Inc.",                            shortName: "Adobe",    country: "US",         industry: "Software",      contractIds: ["CT-018"], historicalPositions: [], totalValueINR: 4_900_000, riskTier: "tier_c" },
  { id: "CP-017", name: "Atlassian",                             shortName: "Atlassian", country: "Australia", industry: "SaaS",          contractIds: ["CT-023"], historicalPositions: [], totalValueINR: 2_800_000, riskTier: "tier_c" },
  { id: "CP-018", name: "GitHub",                                shortName: "GitHub",   country: "US",         industry: "DevTools",      contractIds: ["CT-024"], historicalPositions: [], totalValueINR: 1_700_000, riskTier: "tier_c" },
  { id: "CP-019", name: "OpenAI",                                shortName: "OpenAI",   country: "US",         industry: "AI",            contractIds: ["CT-025"], historicalPositions: [{ topic: "Data Protection", theyPushFor: "No commitment to data residency", weAccepted: false }], totalValueINR: 7_200_000, riskTier: "tier_b" },
  { id: "CP-020", name: "Anthropic",                             shortName: "Anthropic", country: "US",        industry: "AI",            contractIds: ["CT-026"], historicalPositions: [], totalValueINR: 5_900_000, riskTier: "tier_b" },
  { id: "CP-021", name: "ICICI Lombard",                         shortName: "ICICI Lombard", country: "India", industry: "Insurance",     contractIds: ["CT-027"], historicalPositions: [], totalValueINR: 9_400_000, riskTier: "tier_b" },
  { id: "CP-022", name: "Mahindra & Mahindra",                   shortName: "M&M",      country: "India",      industry: "Automotive",    contractIds: ["CT-028"], historicalPositions: [], totalValueINR: 12_700_000, riskTier: "tier_b" },
  { id: "CP-023", name: "Bain & Company (subcontractor)",        shortName: "Bain",     country: "India",      industry: "Consulting",    contractIds: ["CT-029"], historicalPositions: [], totalValueINR: 4_100_000, riskTier: "tier_b" },
  { id: "CP-024", name: "PwC (audit)",                           shortName: "PwC",      country: "India",      industry: "Audit",         contractIds: ["CT-030"], historicalPositions: [], totalValueINR: 2_300_000, riskTier: "tier_c" },
];

export function counterpartyById(id: string): Counterparty | undefined {
  return COUNTERPARTIES.find((c) => c.id === id);
}

/* ───────────────────────── Contracts ───────────────────────── */

export interface ClauseDeviation {
  /** Clause topic this deviation is against. */
  topic: string;
  /** Snippet of the counterparty's proposed language. */
  cpLanguage: string;
  /** Our playbook equivalent. */
  ourLanguage: string;
  severity: ClauseSeverity;
  rationale: string;
  /** Whether the redline has been resolved (accepted/rejected) or is open. */
  status: "open" | "accepted_with_caveat" | "reverted_to_playbook" | "escalated";
  /** Suggested counter-position. */
  suggestedRedline?: string;
  playbookId?: string;
}

export interface NegotiationRound {
  id: string;
  round: number;
  whenISO: string;
  byParty: "us" | "counterparty";
  byPerson: string;
  changes: string;          // one-liner summary
  fileLabel: string;        // e.g. "MSA-Sumitomo-v3-redline.docx"
  deviationsAdded: number;
  deviationsResolved: number;
}

export interface SignatureRecord {
  party: "us" | "counterparty";
  signerName: string;
  signerTitle: string;
  status: "pending" | "signed" | "declined";
  signedAt?: string;
}

export interface ApprovalStep {
  id: string;
  step: number;
  approverRole: string;       // "Project legal", "Head of Legal", "GC", "CFO"
  approverName?: string;
  status: "pending" | "approved" | "rejected" | "skipped";
  whenISO?: string;
  comment?: string;
}

export interface AmendmentRecord {
  id: string;
  effectiveDate: string;
  summary: string;
  cumulativeValueChangeINR?: number;
}

export interface ContractRecord {
  id: string;
  title: string;
  type: ContractType;
  counterpartyId: string;
  templateId?: string;
  parentContractId?: string;  // for SOW → MSA, amendment → parent
  status: ContractStatus;
  risk: ContractRisk;
  ourEntity: "LB India" | "LB UK" | "LB UAE" | "LB US";
  governingLaw: string;
  jurisdiction: string;
  currency: "INR" | "USD" | "EUR" | "GBP" | "AED";
  valueINR: number;
  effectiveDate: string | null;
  expiryDate: string | null;
  termMonths: number | null;
  autoRenew: boolean;
  renewalNoticeDays: number | null;
  owner: { name: string; team: string };           // legal owner
  businessOwner: string;
  counterpartyOwner: string;
  createdAt: string;
  lastActivityAt: string;
  /** Negotiation round trail. */
  rounds: NegotiationRound[];
  /** Open & resolved clause deviations. */
  deviations: ClauseDeviation[];
  /** Approver chain — computed from risk × value. */
  approvalChain: ApprovalStep[];
  signatures: SignatureRecord[];
  amendments: AmendmentRecord[];
  /** Brief summary line used in lists / search. */
  summary: string;
  tags: string[];
}

const T = (iso: string) => iso; // brevity alias

export const CONTRACTS: ContractRecord[] = [
  /* === Active customer MSAs === */
  {
    id: "CT-001",
    title: "MSA — Sumitomo Mitsui Banking Corporation",
    type: "msa",
    counterpartyId: "CP-001",
    templateId: "TPL-MSA-IN",
    status: "negotiation",
    risk: "high",
    ourEntity: "LB India",
    governingLaw: "Japan (Tokyo arbitration)",
    jurisdiction: "Tokyo",
    currency: "USD",
    valueINR: 38_500_000,
    effectiveDate: null,
    expiryDate: null,
    termMonths: 24,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Aanya Iyer", team: "Commercial" },
    businessOwner: "Rajesh Kumar (VP Sales APAC)",
    counterpartyOwner: "Tanaka Ichiro (Procurement)",
    createdAt: "2026-03-18",
    lastActivityAt: "2026-05-09",
    rounds: [
      { id: "NR-001", round: 1, whenISO: T("2026-03-20"), byParty: "us",            byPerson: "Aanya Iyer",      changes: "Sent first draft from MSA-IN v3",                            fileLabel: "MSA-Sumitomo-v1.docx",         deviationsAdded: 0, deviationsResolved: 0 },
      { id: "NR-002", round: 2, whenISO: T("2026-04-08"), byParty: "counterparty",  byPerson: "Tanaka Ichiro",   changes: "12 redlines — LoL → 2× annual fees; mutual indemnity; audit rights", fileLabel: "MSA-Sumitomo-v2-redline.docx", deviationsAdded: 4, deviationsResolved: 0 },
      { id: "NR-003", round: 3, whenISO: T("2026-04-21"), byParty: "us",            byPerson: "Aanya Iyer",      changes: "Countered with 18-month cap; accepted audit rights with 30-day notice; tightened indemnity",       fileLabel: "MSA-Sumitomo-v3.docx",         deviationsAdded: 0, deviationsResolved: 2 },
      { id: "NR-004", round: 4, whenISO: T("2026-05-09"), byParty: "counterparty",  byPerson: "Tanaka Ichiro",   changes: "Accepted 18-month cap; pushed back on indemnity carve-out for sub-processors",                     fileLabel: "MSA-Sumitomo-v4-redline.docx", deviationsAdded: 1, deviationsResolved: 1 },
    ],
    deviations: [
      { topic: "Limitation of Liability", cpLanguage: "2× annual fees cap, mutual",                                    ourLanguage: "12-month fees cap",        severity: "yellow", rationale: "Within acceptable band per playbook with head_of_legal sign-off",   status: "accepted_with_caveat", suggestedRedline: "Hold at 18-month cap with confidentiality/indemnity carve-outs", playbookId: "PB-LOL" },
      { topic: "Indemnity",               cpLanguage: "Supplier indemnifies for all third-party claims including those by sub-processors", ourLanguage: "Supplier indemnifies for IP + data breach only", severity: "red",    rationale: "Off-playbook — sub-processor liability is not transferable. Requires GC sign-off if accepted.", status: "open", suggestedRedline: "Limit indemnity to IP infringement and data breach; sub-processor liability passes through supplier's own contracts.", playbookId: "PB-IND" },
      { topic: "Data Protection",         cpLanguage: "Onsite audit rights with 7 days' notice, twice annually",        ourLanguage: "Documentary audit via SOC 2; onsite only on material breach", severity: "yellow", rationale: "Customer is regulated banking — onsite audit is industry norm. Accept with 30-day notice.", status: "accepted_with_caveat", suggestedRedline: "Onsite audit, 30 days' notice, once annually, mutually-agreed auditor.", playbookId: "PB-DATA" },
    ],
    approvalChain: [
      { id: "AP-001", step: 1, approverRole: "Project Legal",  approverName: "Aanya Iyer",   status: "approved", whenISO: "2026-04-21", comment: "v3 ready for HoL review" },
      { id: "AP-002", step: 2, approverRole: "Head of Legal",  approverName: "Ravi Menon",   status: "pending" },
      { id: "AP-003", step: 3, approverRole: "General Counsel", approverName: "Vikram Nair", status: "pending" },
      { id: "AP-004", step: 4, approverRole: "CFO",            approverName: "Meera Pillai", status: "pending" },
    ],
    signatures: [],
    amendments: [],
    summary: "24-month MSA for retail banking analytics. 2 open redlines (indemnity). HoL review pending.",
    tags: ["customer", "banking", "high-value", "negotiation"],
  },

  {
    id: "CT-002",
    title: "MSA — Kotak Mahindra Bank",
    type: "msa",
    counterpartyId: "CP-002",
    templateId: "TPL-MSA-IN",
    status: "active",
    risk: "medium",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 72_000_000,
    effectiveDate: "2025-04-01",
    expiryDate: "2027-03-31",
    termMonths: 24,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Aanya Iyer", team: "Commercial" },
    businessOwner: "Anita Verma",
    counterpartyOwner: "Suresh Kapoor (Procurement)",
    createdAt: "2025-02-10",
    lastActivityAt: "2025-04-01",
    rounds: [
      { id: "NR-010", round: 1, whenISO: "2025-02-15", byParty: "us",           byPerson: "Aanya Iyer", changes: "Initial draft", fileLabel: "MSA-Kotak-v1.docx", deviationsAdded: 0, deviationsResolved: 0 },
      { id: "NR-011", round: 2, whenISO: "2025-03-05", byParty: "counterparty", byPerson: "Suresh Kapoor", changes: "Payment terms → Net 45; light redlines on indemnity", fileLabel: "MSA-Kotak-v2.docx", deviationsAdded: 2, deviationsResolved: 0 },
      { id: "NR-012", round: 3, whenISO: "2025-03-18", byParty: "us",           byPerson: "Aanya Iyer", changes: "Accepted Net 45; tightened indemnity", fileLabel: "MSA-Kotak-v3.docx", deviationsAdded: 0, deviationsResolved: 2 },
    ],
    deviations: [
      { topic: "Payment terms", cpLanguage: "Net 45", ourLanguage: "Net 30", severity: "yellow", rationale: "Kotak standard procurement term — acceptable with team_lead sign-off", status: "accepted_with_caveat", playbookId: "PB-PAY" },
    ],
    approvalChain: [
      { id: "AP-010", step: 1, approverRole: "Project Legal", approverName: "Aanya Iyer",  status: "approved", whenISO: "2025-03-18" },
      { id: "AP-011", step: 2, approverRole: "Head of Legal", approverName: "Ravi Menon",  status: "approved", whenISO: "2025-03-22" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh",   signerTitle: "CEO",                  status: "signed", signedAt: "2025-03-28" },
      { party: "counterparty", signerName: "Pradeep Iyer",     signerTitle: "Chief Procurement Officer", status: "signed", signedAt: "2025-03-30" },
    ],
    amendments: [
      { id: "AM-001", effectiveDate: "2025-09-01", summary: "Added cyber-fraud detection scope (+₹1.8 Cr)", cumulativeValueChangeINR: 18_000_000 },
    ],
    summary: "24-month MSA with Kotak. 2 SOWs hang off this. 1 amendment for fraud-detection scope expansion.",
    tags: ["customer", "banking", "active", "high-value"],
  },

  {
    id: "CT-003",
    title: "MSA — Shell Energy Asia",
    type: "msa",
    counterpartyId: "CP-003",
    templateId: "TPL-MSA-IN",
    status: "active",
    risk: "medium",
    ourEntity: "LB India",
    governingLaw: "England & Wales",
    jurisdiction: "London (LCIA arbitration)",
    currency: "USD",
    valueINR: 24_000_000,
    effectiveDate: "2025-07-15",
    expiryDate: "2027-07-14",
    termMonths: 24,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Aanya Iyer", team: "Commercial" },
    businessOwner: "Liam Chen",
    counterpartyOwner: "Singh Mehta (Vendor Mgmt)",
    createdAt: "2025-05-04",
    lastActivityAt: "2025-07-15",
    rounds: [],
    deviations: [
      { topic: "Governing law", cpLanguage: "England & Wales / LCIA", ourLanguage: "India / Mumbai courts", severity: "yellow", rationale: "Cross-border energy customer — neutral seat acceptable per playbook", status: "accepted_with_caveat", playbookId: "PB-GL" },
    ],
    approvalChain: [
      { id: "AP-020", step: 1, approverRole: "Project Legal", approverName: "Aanya Iyer", status: "approved", whenISO: "2025-06-22" },
      { id: "AP-021", step: 2, approverRole: "Head of Legal", approverName: "Ravi Menon", status: "approved", whenISO: "2025-07-02" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh",   signerTitle: "CEO",     status: "signed", signedAt: "2025-07-10" },
      { party: "counterparty", signerName: "Helena Bjornson",  signerTitle: "VP Operations APAC", status: "signed", signedAt: "2025-07-15" },
    ],
    amendments: [],
    summary: "Active MSA for predictive-maintenance analytics on offshore platforms.",
    tags: ["customer", "energy", "cross-border", "active"],
  },

  {
    id: "CT-004",
    title: "MSA — Aviva Insurance",
    type: "msa",
    counterpartyId: "CP-004",
    templateId: "TPL-MSA-IN",
    status: "internal_review",
    risk: "high",
    ourEntity: "LB UK",
    governingLaw: "England & Wales",
    jurisdiction: "London",
    currency: "GBP",
    valueINR: 18_500_000,
    effectiveDate: null,
    expiryDate: null,
    termMonths: 36,
    autoRenew: true,
    renewalNoticeDays: 90,
    owner: { name: "Aanya Iyer", team: "Commercial" },
    businessOwner: "Sarah Whitley",
    counterpartyOwner: "James O'Connor",
    createdAt: "2026-04-22",
    lastActivityAt: "2026-05-08",
    rounds: [
      { id: "NR-020", round: 1, whenISO: "2026-04-22", byParty: "counterparty", byPerson: "James O'Connor", changes: "Their paper — Aviva standard supplier agreement", fileLabel: "Aviva-supplier-agt-v1.docx", deviationsAdded: 6, deviationsResolved: 0 },
      { id: "NR-021", round: 2, whenISO: "2026-05-08", byParty: "us",           byPerson: "Aanya Iyer",     changes: "Returned with redlines — insurance cap; data residency; audit cadence", fileLabel: "Aviva-supplier-agt-v2-redline.docx", deviationsAdded: 0, deviationsResolved: 0 },
    ],
    deviations: [
      { topic: "Insurance", cpLanguage: "GBP 10M PI minimum + GBP 10M Cyber", ourLanguage: "USD 5M PI + USD 5M Cyber", severity: "red",    rationale: "Aviva is a regulated insurer — they request higher minimums. Push back to USD 7.5M as compromise.", status: "open", suggestedRedline: "Counter with USD 7.5M PI + USD 5M Cyber; rider scaling with deal value", playbookId: "PB-INS" },
      { topic: "Data Protection", cpLanguage: "EU data residency only — no India transfers", ourLanguage: "Standard SCC Module 2 transfers with safeguards", severity: "red", rationale: "Material to our delivery model — operations team in India processes the data", status: "escalated", suggestedRedline: "Propose pseudonymisation at source + India processing under SCCs", playbookId: "PB-DATA" },
      { topic: "Limitation of Liability", cpLanguage: "Unlimited for breach of confidentiality", ourLanguage: "12-month fees cap with carve-outs",   severity: "yellow", rationale: "Acceptable carve-out within playbook", status: "open", playbookId: "PB-LOL" },
      { topic: "Auto-renewal", cpLanguage: "Auto-renew with 90-day opt-out and CPI escalation uncapped", ourLanguage: "Auto-renew with 30-day opt-out, CPI capped at 5%", severity: "yellow", rationale: "Uncapped CPI escalation is unacceptable", status: "open", playbookId: "PB-RENEW" },
    ],
    approvalChain: [
      { id: "AP-030", step: 1, approverRole: "Project Legal", approverName: "Aanya Iyer",      status: "pending" },
      { id: "AP-031", step: 2, approverRole: "Head of Legal", approverName: "Ravi Menon",      status: "pending" },
      { id: "AP-032", step: 3, approverRole: "General Counsel", approverName: "Vikram Nair",   status: "pending" },
    ],
    signatures: [],
    amendments: [],
    summary: "Inbound on Aviva paper. 4 open deviations including 1 escalated to GC (data residency).",
    tags: ["customer", "insurance", "uk", "high-risk", "their-paper"],
  },

  {
    id: "CT-005",
    title: "MSA — Tata Consumer Products",
    type: "msa",
    counterpartyId: "CP-005",
    templateId: "TPL-MSA-IN",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 9_800_000,
    effectiveDate: "2025-01-15",
    expiryDate: "2026-07-14",
    termMonths: 18,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Anita Verma",
    counterpartyOwner: "Ankur Bhargav",
    createdAt: "2024-12-10",
    lastActivityAt: "2025-01-15",
    rounds: [],
    deviations: [],
    approvalChain: [
      { id: "AP-040", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-01-05" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh",   signerTitle: "CEO",                  status: "signed", signedAt: "2025-01-12" },
      { party: "counterparty", signerName: "Sunil Mathur",     signerTitle: "Procurement Director", status: "signed", signedAt: "2025-01-14" },
    ],
    amendments: [],
    summary: "18-month MSA — supply-chain optimisation pilot. Expires in <90 days (renewal candidate).",
    tags: ["customer", "consumer-goods", "active", "renewal-candidate"],
  },

  {
    id: "CT-006",
    title: "SaaS Subscription — Razorpay (Growth)",
    type: "saas_subscription",
    counterpartyId: "CP-006",
    templateId: "TPL-SAAS",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 5_400_000,
    effectiveDate: "2025-08-01",
    expiryDate: "2026-07-31",
    termMonths: 12,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Rajesh Kumar",
    counterpartyOwner: "Pooja Iyer",
    createdAt: "2025-07-08",
    lastActivityAt: "2025-08-01",
    rounds: [],
    deviations: [
      { topic: "Auto-renewal", cpLanguage: "No auto-renewal", ourLanguage: "Auto-renew + 30 day opt-out", severity: "green", rationale: "Counterparty's standard — within playbook", status: "accepted_with_caveat", playbookId: "PB-RENEW" },
    ],
    approvalChain: [
      { id: "AP-050", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-07-20" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh",   signerTitle: "CEO", status: "signed", signedAt: "2025-07-28" },
      { party: "counterparty", signerName: "Harshil Mathur",   signerTitle: "CEO", status: "signed", signedAt: "2025-07-30" },
    ],
    amendments: [],
    summary: "Subscription to our Growth plan — 25 seats. Renewal window opens July 2026.",
    tags: ["customer", "saas", "fintech", "active"],
  },

  {
    id: "CT-007",
    title: "MSA — Maersk",
    type: "msa",
    counterpartyId: "CP-007",
    templateId: "TPL-MSA-IN",
    status: "active",
    risk: "medium",
    ourEntity: "LB UK",
    governingLaw: "England & Wales",
    jurisdiction: "London",
    currency: "USD",
    valueINR: 14_200_000,
    effectiveDate: "2024-11-01",
    expiryDate: "2026-10-31",
    termMonths: 24,
    autoRenew: true,
    renewalNoticeDays: 60,
    owner: { name: "Aanya Iyer", team: "Commercial" },
    businessOwner: "Sarah Whitley",
    counterpartyOwner: "Erik Sorensen",
    createdAt: "2024-09-12",
    lastActivityAt: "2024-11-01",
    rounds: [],
    deviations: [],
    approvalChain: [
      { id: "AP-060", step: 1, approverRole: "Project Legal", approverName: "Aanya Iyer", status: "approved", whenISO: "2024-10-15" },
      { id: "AP-061", step: 2, approverRole: "Head of Legal", approverName: "Ravi Menon", status: "approved", whenISO: "2024-10-22" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh",   signerTitle: "CEO", status: "signed", signedAt: "2024-10-28" },
      { party: "counterparty", signerName: "Vincent Clerc",    signerTitle: "Chief Procurement", status: "signed", signedAt: "2024-10-30" },
    ],
    amendments: [],
    summary: "2-year MSA — logistics optimisation. Auto-renew in 5 months. Renewal Sentinel watching.",
    tags: ["customer", "logistics", "renewal-candidate", "active"],
  },

  {
    id: "CT-008",
    title: "MSA — DBS Bank",
    type: "msa",
    counterpartyId: "CP-008",
    templateId: "TPL-MSA-IN",
    status: "active",
    risk: "medium",
    ourEntity: "LB India",
    governingLaw: "Singapore",
    jurisdiction: "Singapore (SIAC)",
    currency: "USD",
    valueINR: 31_000_000,
    effectiveDate: "2025-06-01",
    expiryDate: "2028-05-31",
    termMonths: 36,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Aanya Iyer", team: "Commercial" },
    businessOwner: "Rajesh Kumar",
    counterpartyOwner: "Wei Lin Tan",
    createdAt: "2025-04-08",
    lastActivityAt: "2025-06-01",
    rounds: [],
    deviations: [
      { topic: "Governing law", cpLanguage: "Singapore / SIAC", ourLanguage: "India / Mumbai", severity: "yellow", rationale: "Acceptable per playbook for SE Asia customers", status: "accepted_with_caveat", playbookId: "PB-GL" },
    ],
    approvalChain: [
      { id: "AP-070", step: 1, approverRole: "Project Legal",  approverName: "Aanya Iyer",  status: "approved", whenISO: "2025-05-18" },
      { id: "AP-071", step: 2, approverRole: "Head of Legal",  approverName: "Ravi Menon",  status: "approved", whenISO: "2025-05-25" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh",   signerTitle: "CEO", status: "signed", signedAt: "2025-05-29" },
      { party: "counterparty", signerName: "Piyush Gupta",     signerTitle: "CEO", status: "signed", signedAt: "2025-06-01" },
    ],
    amendments: [],
    summary: "3-year strategic MSA — wealth-management analytics. Highest-value Singapore customer.",
    tags: ["customer", "banking", "cross-border", "high-value", "active"],
  },

  {
    id: "CT-009",
    title: "SOW-2025-007 — Kotak fraud detection scope",
    type: "sow",
    counterpartyId: "CP-002",
    templateId: "TPL-SOW-IN",
    parentContractId: "CT-002",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 18_000_000,
    effectiveDate: "2025-09-01",
    expiryDate: "2026-08-31",
    termMonths: 12,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Anita Verma",
    counterpartyOwner: "Suresh Kapoor",
    createdAt: "2025-08-12",
    lastActivityAt: "2025-09-01",
    rounds: [],
    deviations: [],
    approvalChain: [
      { id: "AP-080", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-08-25" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh", signerTitle: "CEO", status: "signed", signedAt: "2025-08-28" },
      { party: "counterparty", signerName: "Pradeep Iyer",   signerTitle: "CPO", status: "signed", signedAt: "2025-08-30" },
    ],
    amendments: [],
    summary: "Hangs off CT-002 (Kotak MSA). Fraud-detection model build + 12-month support.",
    tags: ["customer", "sow", "banking", "active"],
  },

  /* === Inbound (we are customer) === */
  {
    id: "CT-010",
    title: "AWS Enterprise Agreement",
    type: "saas_subscription",
    counterpartyId: "CP-009",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "Delaware, USA",
    jurisdiction: "Delaware",
    currency: "USD",
    valueINR: 22_400_000,
    effectiveDate: "2024-04-01",
    expiryDate: "2027-03-31",
    termMonths: 36,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Rahul Iyer (CIO)",
    counterpartyOwner: "AWS Acct Mgr",
    createdAt: "2024-02-10",
    lastActivityAt: "2024-04-01",
    rounds: [],
    deviations: [],
    approvalChain: [
      { id: "AP-090", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2024-03-12" },
      { id: "AP-091", step: 2, approverRole: "Head of Legal", approverName: "Ravi Menon", status: "approved", whenISO: "2024-03-18" },
      { id: "AP-092", step: 3, approverRole: "CFO",           approverName: "Meera Pillai", status: "approved", whenISO: "2024-03-25" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh",  signerTitle: "CEO", status: "signed", signedAt: "2024-03-28" },
      { party: "counterparty", signerName: "AWS click-through", signerTitle: "—",  status: "signed", signedAt: "2024-04-01" },
    ],
    amendments: [],
    summary: "AWS click-through. We are customer. Auto-renew in 11 months — renewal sentinel active.",
    tags: ["vendor", "cloud", "active", "their-paper"],
  },

  {
    id: "CT-011",
    title: "Workday HCM Subscription",
    type: "saas_subscription",
    counterpartyId: "CP-010",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "California, USA",
    jurisdiction: "San Francisco",
    currency: "USD",
    valueINR: 8_100_000,
    effectiveDate: "2025-03-01",
    expiryDate: "2027-02-28",
    termMonths: 24,
    autoRenew: true,
    renewalNoticeDays: 60,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Sneha Iyer (Head of People)",
    counterpartyOwner: "Workday Acct Mgr",
    createdAt: "2025-01-22",
    lastActivityAt: "2025-03-01",
    rounds: [],
    deviations: [
      { topic: "Auto-renewal", cpLanguage: "Auto-renew with 7% CPI", ourLanguage: "Auto-renew with 5% CPI cap", severity: "yellow", rationale: "Slightly above playbook — accepted given list-price discount", status: "accepted_with_caveat", playbookId: "PB-RENEW" },
    ],
    approvalChain: [
      { id: "AP-100", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-02-08" },
      { id: "AP-101", step: 2, approverRole: "Head of Legal", approverName: "Ravi Menon",  status: "approved", whenISO: "2025-02-14" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh", signerTitle: "CEO", status: "signed", signedAt: "2025-02-22" },
      { party: "counterparty", signerName: "Workday signer", signerTitle: "—",   status: "signed", signedAt: "2025-02-26" },
    ],
    amendments: [],
    summary: "HCM platform. 7% CPI escalation accepted given list-price discount.",
    tags: ["vendor", "saas", "hr-tech", "active"],
  },

  {
    id: "CT-012",
    title: "Salesforce Sales Cloud + Service Cloud",
    type: "saas_subscription",
    counterpartyId: "CP-011",
    status: "expiring_soon",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "California, USA",
    jurisdiction: "San Francisco",
    currency: "USD",
    valueINR: 6_400_000,
    effectiveDate: "2024-07-01",
    expiryDate: "2026-06-30",
    termMonths: 24,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Rajesh Kumar (VP Sales)",
    counterpartyOwner: "Salesforce Acct Mgr",
    createdAt: "2024-05-04",
    lastActivityAt: "2024-07-01",
    rounds: [],
    deviations: [],
    approvalChain: [
      { id: "AP-110", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2024-06-12" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh", signerTitle: "CEO", status: "signed", signedAt: "2024-06-22" },
      { party: "counterparty", signerName: "SF signer",      signerTitle: "—",   status: "signed", signedAt: "2024-06-28" },
    ],
    amendments: [],
    summary: "Expires in 49 days. Auto-renew unless we opt out by 2026-05-31. Renewal Sentinel: usage 92%, recommend renew.",
    tags: ["vendor", "saas", "crm", "expiring", "renewal-decision-needed"],
  },

  {
    id: "CT-013",
    title: "Notion Workspace (annual)",
    type: "saas_subscription",
    counterpartyId: "CP-013",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "California, USA",
    jurisdiction: "San Francisco",
    currency: "USD",
    valueINR: 480_000,
    effectiveDate: "2025-10-01",
    expiryDate: "2026-09-30",
    termMonths: 12,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Sneha Iyer",
    counterpartyOwner: "Notion (self-serve)",
    createdAt: "2025-09-22",
    lastActivityAt: "2025-10-01",
    rounds: [],
    deviations: [],
    approvalChain: [
      { id: "AP-120", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-09-28" },
    ],
    signatures: [
      { party: "us",           signerName: "Sneha Iyer",   signerTitle: "Head of People", status: "signed", signedAt: "2025-09-30" },
      { party: "counterparty", signerName: "Notion (click)", signerTitle: "—",            status: "signed", signedAt: "2025-10-01" },
    ],
    amendments: [],
    summary: "Self-serve click-through. Tier-C vendor.",
    tags: ["vendor", "saas", "active", "low-value"],
  },

  /* === NDAs === */
  {
    id: "CT-014",
    title: "Mutual NDA — Sumitomo (predecessor to CT-001)",
    type: "nda_mutual",
    counterpartyId: "CP-001",
    templateId: "TPL-NDA-M",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "Japan",
    jurisdiction: "Tokyo",
    currency: "INR",
    valueINR: 0,
    effectiveDate: "2026-02-08",
    expiryDate: "2029-02-07",
    termMonths: 36,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Aanya Iyer", team: "Commercial" },
    businessOwner: "Rajesh Kumar",
    counterpartyOwner: "Tanaka Ichiro",
    createdAt: "2026-02-04",
    lastActivityAt: "2026-02-08",
    rounds: [],
    deviations: [],
    approvalChain: [
      { id: "AP-130", step: 1, approverRole: "Project Legal", approverName: "Aanya Iyer", status: "approved", whenISO: "2026-02-06" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh", signerTitle: "CEO", status: "signed", signedAt: "2026-02-07" },
      { party: "counterparty", signerName: "Tanaka Ichiro",  signerTitle: "Procurement", status: "signed", signedAt: "2026-02-08" },
    ],
    amendments: [],
    summary: "Standard 3-year mutual NDA. Preceded MSA negotiation.",
    tags: ["nda", "customer", "active"],
  },

  {
    id: "CT-015",
    title: "Vendor MSA — TalentForce India (executive search)",
    type: "vendor_services",
    counterpartyId: "CP-014",
    templateId: "TPL-VEND",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 6_800_000,
    effectiveDate: "2025-05-15",
    expiryDate: "2026-05-14",
    termMonths: 12,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Sneha Iyer",
    counterpartyOwner: "Anika Sharma",
    createdAt: "2025-04-22",
    lastActivityAt: "2025-05-15",
    rounds: [],
    deviations: [],
    approvalChain: [
      { id: "AP-140", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-05-08" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh", signerTitle: "CEO", status: "signed", signedAt: "2025-05-12" },
      { party: "counterparty", signerName: "Anika Sharma",   signerTitle: "MD",  status: "signed", signedAt: "2025-05-14" },
    ],
    amendments: [],
    summary: "Executive search vendor. Renewal window opens 2026-04-14 (T-30).",
    tags: ["vendor", "staffing", "expiring", "active"],
  },

  {
    id: "CT-016",
    title: "SOW — Shell offshore platform pilot",
    type: "sow",
    counterpartyId: "CP-003",
    templateId: "TPL-SOW-IN",
    parentContractId: "CT-003",
    status: "active",
    risk: "medium",
    ourEntity: "LB India",
    governingLaw: "England & Wales",
    jurisdiction: "London",
    currency: "USD",
    valueINR: 12_400_000,
    effectiveDate: "2025-08-01",
    expiryDate: "2026-07-31",
    termMonths: 12,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Aanya Iyer", team: "Commercial" },
    businessOwner: "Liam Chen",
    counterpartyOwner: "Singh Mehta",
    createdAt: "2025-07-12",
    lastActivityAt: "2025-08-01",
    rounds: [],
    deviations: [],
    approvalChain: [
      { id: "AP-150", step: 1, approverRole: "Project Legal", approverName: "Aanya Iyer", status: "approved", whenISO: "2025-07-25" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh",  signerTitle: "CEO", status: "signed", signedAt: "2025-07-28" },
      { party: "counterparty", signerName: "Helena Bjornson", signerTitle: "VP Ops APAC", status: "signed", signedAt: "2025-07-30" },
    ],
    amendments: [],
    summary: "Predictive-maintenance pilot — first platform. Outcome-based fees.",
    tags: ["customer", "sow", "energy", "active"],
  },

  {
    id: "CT-017",
    title: "SOW — DBS wealth-mgmt analytics phase 1",
    type: "sow",
    counterpartyId: "CP-008",
    templateId: "TPL-SOW-IN",
    parentContractId: "CT-008",
    status: "active",
    risk: "medium",
    ourEntity: "LB India",
    governingLaw: "Singapore",
    jurisdiction: "Singapore",
    currency: "USD",
    valueINR: 14_500_000,
    effectiveDate: "2025-06-10",
    expiryDate: "2026-06-09",
    termMonths: 12,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Aanya Iyer", team: "Commercial" },
    businessOwner: "Rajesh Kumar",
    counterpartyOwner: "Wei Lin Tan",
    createdAt: "2025-06-02",
    lastActivityAt: "2025-06-10",
    rounds: [],
    deviations: [],
    approvalChain: [
      { id: "AP-160", step: 1, approverRole: "Project Legal", approverName: "Aanya Iyer", status: "approved", whenISO: "2025-06-05" },
      { id: "AP-161", step: 2, approverRole: "Head of Legal", approverName: "Ravi Menon", status: "approved", whenISO: "2025-06-07" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh", signerTitle: "CEO", status: "signed", signedAt: "2025-06-08" },
      { party: "counterparty", signerName: "Wei Lin Tan",    signerTitle: "VP Procurement", status: "signed", signedAt: "2025-06-10" },
    ],
    amendments: [],
    summary: "Phase 1 — segmentation + offer engine.",
    tags: ["customer", "sow", "banking", "active"],
  },

  /* === Smaller customer & vendor === */
  {
    id: "CT-018",
    title: "Adobe Creative Cloud — annual subscription",
    type: "saas_subscription",
    counterpartyId: "CP-016",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "California, USA",
    jurisdiction: "San Francisco",
    currency: "USD",
    valueINR: 4_900_000,
    effectiveDate: "2025-11-15",
    expiryDate: "2026-11-14",
    termMonths: 12,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Sneha Iyer",
    counterpartyOwner: "Adobe self-serve",
    createdAt: "2025-11-10",
    lastActivityAt: "2025-11-15",
    rounds: [],
    deviations: [],
    approvalChain: [{ id: "AP-170", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-11-12" }],
    signatures: [
      { party: "us",           signerName: "Sneha Iyer",     signerTitle: "Head of People", status: "signed", signedAt: "2025-11-14" },
      { party: "counterparty", signerName: "Adobe (click)",  signerTitle: "—",              status: "signed", signedAt: "2025-11-15" },
    ],
    amendments: [],
    summary: "60 seats of CC for design + marketing.",
    tags: ["vendor", "saas", "active"],
  },

  {
    id: "CT-019",
    title: "DataDog observability — annual",
    type: "saas_subscription",
    counterpartyId: "CP-012",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "New York, USA",
    jurisdiction: "New York",
    currency: "USD",
    valueINR: 3_200_000,
    effectiveDate: "2025-09-01",
    expiryDate: "2026-08-31",
    termMonths: 12,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Rahul Iyer",
    counterpartyOwner: "DataDog Acct Mgr",
    createdAt: "2025-08-18",
    lastActivityAt: "2025-09-01",
    rounds: [],
    deviations: [],
    approvalChain: [{ id: "AP-180", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-08-22" }],
    signatures: [
      { party: "us",           signerName: "Rahul Iyer", signerTitle: "CIO",        status: "signed", signedAt: "2025-08-28" },
      { party: "counterparty", signerName: "DataDog",    signerTitle: "—",          status: "signed", signedAt: "2025-09-01" },
    ],
    amendments: [],
    summary: "Production observability stack.",
    tags: ["vendor", "saas", "devtools", "active"],
  },

  {
    id: "CT-020",
    title: "DPA — Razorpay (annex to CT-006)",
    type: "dpa",
    counterpartyId: "CP-006",
    templateId: "TPL-DPA",
    parentContractId: "CT-006",
    status: "active",
    risk: "medium",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 0,
    effectiveDate: "2025-08-01",
    expiryDate: "2026-07-31",
    termMonths: 12,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Ravi Menon", team: "Privacy" },
    businessOwner: "Rajesh Kumar",
    counterpartyOwner: "Pooja Iyer",
    createdAt: "2025-07-12",
    lastActivityAt: "2025-08-01",
    rounds: [],
    deviations: [],
    approvalChain: [{ id: "AP-190", step: 1, approverRole: "Privacy Lead", approverName: "Ravi Menon", status: "approved", whenISO: "2025-07-25" }],
    signatures: [
      { party: "us",           signerName: "Ravi Menon",   signerTitle: "Head of Privacy", status: "signed", signedAt: "2025-07-29" },
      { party: "counterparty", signerName: "Harshil Mathur", signerTitle: "CEO", status: "signed", signedAt: "2025-07-31" },
    ],
    amendments: [],
    summary: "DPA hangs off CT-006. DPDP-aligned with SCC Module 2 for any EU transfers.",
    tags: ["dpa", "customer", "privacy", "active"],
  },

  {
    id: "CT-021",
    title: "SOW — Tata Consumer pricing pilot",
    type: "sow",
    counterpartyId: "CP-005",
    parentContractId: "CT-005",
    templateId: "TPL-SOW-IN",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 5_400_000,
    effectiveDate: "2025-02-01",
    expiryDate: "2025-12-31",
    termMonths: 11,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Anita Verma",
    counterpartyOwner: "Ankur Bhargav",
    createdAt: "2025-01-22",
    lastActivityAt: "2025-02-01",
    rounds: [],
    deviations: [],
    approvalChain: [{ id: "AP-200", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-01-28" }],
    signatures: [
      { party: "us",           signerName: "Prashant Singh", signerTitle: "CEO", status: "signed", signedAt: "2025-01-30" },
      { party: "counterparty", signerName: "Sunil Mathur",   signerTitle: "Procurement Director", status: "signed", signedAt: "2025-02-01" },
    ],
    amendments: [],
    summary: "Closed scope. Expired and not renewed.",
    tags: ["customer", "sow", "expired"],
  },

  {
    id: "CT-022",
    title: "SOW-2026-002 — Kotak credit-risk model refresh",
    type: "sow",
    counterpartyId: "CP-002",
    parentContractId: "CT-002",
    templateId: "TPL-SOW-IN",
    status: "out_for_signature",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 9_500_000,
    effectiveDate: null,
    expiryDate: null,
    termMonths: 8,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Anita Verma",
    counterpartyOwner: "Suresh Kapoor",
    createdAt: "2026-05-02",
    lastActivityAt: "2026-05-11",
    rounds: [],
    deviations: [],
    approvalChain: [
      { id: "AP-210", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2026-05-08" },
      { id: "AP-211", step: 2, approverRole: "Head of Legal", approverName: "Ravi Menon",  status: "approved", whenISO: "2026-05-10" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh", signerTitle: "CEO", status: "signed",  signedAt: "2026-05-11" },
      { party: "counterparty", signerName: "Pradeep Iyer",   signerTitle: "CPO", status: "pending" },
    ],
    amendments: [],
    summary: "Awaiting counterparty signature. Sent via DocuSign on 2026-05-11.",
    tags: ["customer", "sow", "banking", "pending-signature"],
  },

  {
    id: "CT-023",
    title: "Atlassian Cloud Suite",
    type: "saas_subscription",
    counterpartyId: "CP-017",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "California, USA",
    jurisdiction: "San Francisco",
    currency: "USD",
    valueINR: 2_800_000,
    effectiveDate: "2025-04-01",
    expiryDate: "2026-03-31",
    termMonths: 12,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Rahul Iyer",
    counterpartyOwner: "Atlassian (self-serve)",
    createdAt: "2025-03-12",
    lastActivityAt: "2025-04-01",
    rounds: [],
    deviations: [],
    approvalChain: [{ id: "AP-220", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-03-20" }],
    signatures: [
      { party: "us",           signerName: "Rahul Iyer",   signerTitle: "CIO", status: "signed", signedAt: "2025-03-28" },
      { party: "counterparty", signerName: "Atlassian",    signerTitle: "—",   status: "signed", signedAt: "2025-04-01" },
    ],
    amendments: [],
    summary: "Jira + Confluence + Bitbucket. Auto-renewed once already.",
    tags: ["vendor", "saas", "active"],
  },

  {
    id: "CT-024",
    title: "GitHub Enterprise Cloud",
    type: "saas_subscription",
    counterpartyId: "CP-018",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "California, USA",
    jurisdiction: "San Francisco",
    currency: "USD",
    valueINR: 1_700_000,
    effectiveDate: "2025-05-01",
    expiryDate: "2026-04-30",
    termMonths: 12,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Rahul Iyer",
    counterpartyOwner: "GitHub Acct Mgr",
    createdAt: "2025-04-08",
    lastActivityAt: "2025-05-01",
    rounds: [],
    deviations: [],
    approvalChain: [{ id: "AP-230", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-04-22" }],
    signatures: [
      { party: "us",           signerName: "Rahul Iyer",     signerTitle: "CIO", status: "signed", signedAt: "2025-04-28" },
      { party: "counterparty", signerName: "GitHub signer",  signerTitle: "—",   status: "signed", signedAt: "2025-05-01" },
    ],
    amendments: [],
    summary: "Source control + Copilot for engineering.",
    tags: ["vendor", "saas", "devtools", "active"],
  },

  {
    id: "CT-025",
    title: "OpenAI Enterprise API",
    type: "saas_subscription",
    counterpartyId: "CP-019",
    status: "negotiation",
    risk: "high",
    ourEntity: "LB India",
    governingLaw: "California, USA",
    jurisdiction: "San Francisco",
    currency: "USD",
    valueINR: 7_200_000,
    effectiveDate: null,
    expiryDate: null,
    termMonths: 12,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Ravi Menon", team: "Privacy" },
    businessOwner: "Rahul Iyer",
    counterpartyOwner: "OpenAI Acct Mgr",
    createdAt: "2026-04-04",
    lastActivityAt: "2026-05-10",
    rounds: [
      { id: "NR-100", round: 1, whenISO: "2026-04-04", byParty: "counterparty", byPerson: "OpenAI Acct Mgr", changes: "Their paper — Enterprise API agreement", fileLabel: "OpenAI-EAA-v1.pdf", deviationsAdded: 3, deviationsResolved: 0 },
      { id: "NR-101", round: 2, whenISO: "2026-05-10", byParty: "us",           byPerson: "Ravi Menon",     changes: "Redlined data residency + indemnity for outputs", fileLabel: "OpenAI-EAA-v2-redline.docx", deviationsAdded: 0, deviationsResolved: 0 },
    ],
    deviations: [
      { topic: "Data Protection", cpLanguage: "No data residency commitment; processed wherever capacity allows", ourLanguage: "Data resident in EU/US contractually", severity: "red", rationale: "Material — we have EU banking customers", status: "escalated", playbookId: "PB-DATA" },
      { topic: "Indemnity", cpLanguage: "Customer indemnifies OpenAI for misuse of outputs", ourLanguage: "OpenAI indemnifies for IP infringement of training data", severity: "red", rationale: "Standard ask for foundation model providers — has been refused", status: "open", playbookId: "PB-IND" },
      { topic: "Limitation of Liability", cpLanguage: "$25K cap or 12-month fees, whichever is lower", ourLanguage: "12-month fees cap", severity: "yellow", rationale: "Acceptable", status: "accepted_with_caveat", playbookId: "PB-LOL" },
    ],
    approvalChain: [
      { id: "AP-240", step: 1, approverRole: "Privacy Lead",     approverName: "Ravi Menon",  status: "approved", whenISO: "2026-05-10" },
      { id: "AP-241", step: 2, approverRole: "Head of Legal",    approverName: "Ravi Menon",  status: "pending" },
      { id: "AP-242", step: 3, approverRole: "General Counsel",  approverName: "Vikram Nair", status: "pending" },
    ],
    signatures: [],
    amendments: [],
    summary: "In negotiation. Data residency is the blocker. Escalated to GC.",
    tags: ["vendor", "ai", "negotiation", "high-risk"],
  },

  {
    id: "CT-026",
    title: "Anthropic Claude API — Enterprise",
    type: "saas_subscription",
    counterpartyId: "CP-020",
    status: "active",
    risk: "medium",
    ourEntity: "LB India",
    governingLaw: "California, USA",
    jurisdiction: "San Francisco",
    currency: "USD",
    valueINR: 5_900_000,
    effectiveDate: "2026-01-15",
    expiryDate: "2027-01-14",
    termMonths: 12,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Ravi Menon", team: "Privacy" },
    businessOwner: "Rahul Iyer",
    counterpartyOwner: "Anthropic Acct Mgr",
    createdAt: "2025-12-04",
    lastActivityAt: "2026-01-15",
    rounds: [],
    deviations: [
      { topic: "Data Protection", cpLanguage: "Zero data retention option enabled by default for Enterprise", ourLanguage: "Standard DPA", severity: "green", rationale: "Better than our ask", status: "accepted_with_caveat", playbookId: "PB-DATA" },
    ],
    approvalChain: [
      { id: "AP-250", step: 1, approverRole: "Privacy Lead",     approverName: "Ravi Menon", status: "approved", whenISO: "2025-12-22" },
      { id: "AP-251", step: 2, approverRole: "Head of Legal",    approverName: "Ravi Menon", status: "approved", whenISO: "2026-01-04" },
    ],
    signatures: [
      { party: "us",           signerName: "Prashant Singh",  signerTitle: "CEO", status: "signed", signedAt: "2026-01-12" },
      { party: "counterparty", signerName: "Anthropic signer", signerTitle: "—",  status: "signed", signedAt: "2026-01-15" },
    ],
    amendments: [],
    summary: "Zero-retention by default. Easiest enterprise AI negotiation we've done.",
    tags: ["vendor", "ai", "active", "privacy-strong"],
  },

  {
    id: "CT-027",
    title: "Group Insurance — ICICI Lombard",
    type: "vendor_services",
    counterpartyId: "CP-021",
    templateId: "TPL-VEND",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 9_400_000,
    effectiveDate: "2025-04-01",
    expiryDate: "2026-03-31",
    termMonths: 12,
    autoRenew: true,
    renewalNoticeDays: 60,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Sneha Iyer",
    counterpartyOwner: "Mahesh Nair",
    createdAt: "2025-03-04",
    lastActivityAt: "2025-04-01",
    rounds: [],
    deviations: [],
    approvalChain: [{ id: "AP-260", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-03-18" }],
    signatures: [
      { party: "us",           signerName: "Sneha Iyer",   signerTitle: "Head of People", status: "signed", signedAt: "2025-03-26" },
      { party: "counterparty", signerName: "Mahesh Nair",  signerTitle: "Sales Director", status: "signed", signedAt: "2025-03-30" },
    ],
    amendments: [
      { id: "AM-002", effectiveDate: "2025-10-01", summary: "Added 47 new joiners + 9 dependents (+₹4.2L premium)", cumulativeValueChangeINR: 420_000 },
    ],
    summary: "Group health + life. Renewal due in 28 days. Already negotiated 2026 renewal.",
    tags: ["vendor", "insurance", "active", "renewal-imminent"],
  },

  {
    id: "CT-028",
    title: "MSA — Mahindra & Mahindra",
    type: "msa",
    counterpartyId: "CP-022",
    templateId: "TPL-MSA-IN",
    status: "out_to_counterparty",
    risk: "medium",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 12_700_000,
    effectiveDate: null,
    expiryDate: null,
    termMonths: 24,
    autoRenew: true,
    renewalNoticeDays: 30,
    owner: { name: "Aanya Iyer", team: "Commercial" },
    businessOwner: "Anita Verma",
    counterpartyOwner: "Rakesh Mehta",
    createdAt: "2026-04-26",
    lastActivityAt: "2026-05-04",
    rounds: [
      { id: "NR-110", round: 1, whenISO: "2026-05-04", byParty: "us", byPerson: "Aanya Iyer", changes: "Initial draft sent", fileLabel: "MSA-MM-v1.docx", deviationsAdded: 0, deviationsResolved: 0 },
    ],
    deviations: [],
    approvalChain: [{ id: "AP-270", step: 1, approverRole: "Project Legal", approverName: "Aanya Iyer", status: "approved", whenISO: "2026-05-04" }],
    signatures: [],
    amendments: [],
    summary: "First draft sent on 2026-05-04. Awaiting counterparty redlines.",
    tags: ["customer", "automotive", "out-to-counterparty"],
  },

  {
    id: "CT-029",
    title: "Subcontractor MSA — Bain & Company",
    type: "vendor_services",
    counterpartyId: "CP-023",
    templateId: "TPL-VEND",
    status: "active",
    risk: "medium",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 4_100_000,
    effectiveDate: "2026-01-08",
    expiryDate: "2026-12-31",
    termMonths: 12,
    autoRenew: false,
    renewalNoticeDays: null,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Aanya Iyer",
    counterpartyOwner: "Rohan Bhatia",
    createdAt: "2025-12-12",
    lastActivityAt: "2026-01-08",
    rounds: [],
    deviations: [],
    approvalChain: [{ id: "AP-280", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-12-22" }],
    signatures: [
      { party: "us",           signerName: "Prashant Singh", signerTitle: "CEO", status: "signed", signedAt: "2026-01-04" },
      { party: "counterparty", signerName: "Rohan Bhatia",   signerTitle: "Partner", status: "signed", signedAt: "2026-01-07" },
    ],
    amendments: [],
    summary: "Bain on Sumitomo engagement as subcontractor. Back-to-back terms with CT-001.",
    tags: ["vendor", "subcontractor", "active"],
  },

  {
    id: "CT-030",
    title: "PwC — Annual statutory audit",
    type: "vendor_services",
    counterpartyId: "CP-024",
    templateId: "TPL-VEND",
    status: "active",
    risk: "low",
    ourEntity: "LB India",
    governingLaw: "India",
    jurisdiction: "Mumbai",
    currency: "INR",
    valueINR: 2_300_000,
    effectiveDate: "2025-07-01",
    expiryDate: "2026-06-30",
    termMonths: 12,
    autoRenew: true,
    renewalNoticeDays: 60,
    owner: { name: "Priya Reddy", team: "Commercial" },
    businessOwner: "Meera Pillai (CFO)",
    counterpartyOwner: "Vivek Sharma",
    createdAt: "2025-06-08",
    lastActivityAt: "2025-07-01",
    rounds: [],
    deviations: [],
    approvalChain: [{ id: "AP-290", step: 1, approverRole: "Project Legal", approverName: "Priya Reddy", status: "approved", whenISO: "2025-06-22" }],
    signatures: [
      { party: "us",           signerName: "Prashant Singh", signerTitle: "CEO", status: "signed", signedAt: "2025-06-26" },
      { party: "counterparty", signerName: "Vivek Sharma",   signerTitle: "Partner", status: "signed", signedAt: "2025-06-30" },
    ],
    amendments: [],
    summary: "Statutory audit. Renewal automatically extends unless we notify 60 days prior.",
    tags: ["vendor", "audit", "active"],
  },
];

export function contractById(id: string): ContractRecord | undefined {
  return CONTRACTS.find((c) => c.id === id);
}

/* ───────────────────────── Obligations ───────────────────────── */

export type ObligationKind =
  | "deliverable"
  | "sla"
  | "reporting"
  | "renewal_notice"
  | "payment"
  | "audit_right"
  | "restriction";

export const OBLIGATION_KIND_LABEL: Record<ObligationKind, string> = {
  deliverable:     "Deliverable",
  sla:             "SLA",
  reporting:       "Reporting",
  renewal_notice:  "Renewal notice",
  payment:         "Payment",
  audit_right:     "Audit right",
  restriction:     "Restriction",
};

export interface Obligation {
  id: string;
  contractId: string;
  kind: ObligationKind;
  description: string;
  ownerName: string;
  ownerTeam: string;
  /** Either a one-shot date or a recurring cadence. */
  dueDateISO?: string;
  cadence?: "monthly" | "quarterly" | "half_yearly" | "annual" | "on_event";
  /** Latest evaluation. */
  status: "on_track" | "due_soon" | "overdue" | "completed" | "waived";
  evidence?: string;
  extractedFromClause?: string;
  lastCheckedISO: string;
}

export const OBLIGATIONS: Obligation[] = [
  /* Kotak MSA + SOW obligations */
  { id: "OB-001", contractId: "CT-002", kind: "reporting",      description: "Monthly model performance + drift report (Section 7.2)",                  ownerName: "Anita Verma",   ownerTeam: "Delivery",  cadence: "monthly",   status: "on_track", evidence: "Apr 2026 report submitted 2026-05-02", extractedFromClause: "Section 7.2 — Reporting", lastCheckedISO: "2026-05-02" },
  { id: "OB-002", contractId: "CT-002", kind: "sla",            description: "99.5% uptime on fraud-detection API monthly",                              ownerName: "Rahul Iyer",    ownerTeam: "Engineering", cadence: "monthly", status: "due_soon", extractedFromClause: "Schedule A — SLAs", lastCheckedISO: "2026-05-10" },
  { id: "OB-003", contractId: "CT-002", kind: "renewal_notice", description: "Notify renewal intention 30 days before 2027-03-31",                        ownerName: "Aanya Iyer",    ownerTeam: "Commercial", dueDateISO: "2027-03-01", status: "on_track", extractedFromClause: "Section 12.1", lastCheckedISO: "2026-05-01" },
  { id: "OB-004", contractId: "CT-002", kind: "audit_right",    description: "Customer audit right — once annually, 30 days' notice",                    ownerName: "Aanya Iyer",    ownerTeam: "Commercial", cadence: "annual",   status: "on_track", extractedFromClause: "Section 9 — Audit", lastCheckedISO: "2026-04-15" },
  { id: "OB-005", contractId: "CT-009", kind: "deliverable",   description: "Phase 1 fraud-detection model deployed by 2026-03-31",                      ownerName: "Anita Verma",   ownerTeam: "Delivery",  dueDateISO: "2026-03-31", status: "completed", evidence: "Sign-off 2026-03-28", lastCheckedISO: "2026-03-28" },
  { id: "OB-006", contractId: "CT-009", kind: "deliverable",   description: "Phase 2 — model refresh + SHAP explainability dashboard",                  ownerName: "Anita Verma",   ownerTeam: "Delivery",  dueDateISO: "2026-06-30", status: "on_track", lastCheckedISO: "2026-05-08" },

  /* Sumitomo (still in negotiation — only one renewal-style obligation extracted from the redline) */
  { id: "OB-010", contractId: "CT-014", kind: "restriction",   description: "Confidentiality obligation — 3 years from disclosure",                      ownerName: "Aanya Iyer",    ownerTeam: "Commercial", dueDateISO: "2029-02-07", status: "on_track", extractedFromClause: "Section 4 — Confidentiality", lastCheckedISO: "2026-02-12" },

  /* Shell */
  { id: "OB-020", contractId: "CT-003", kind: "sla",            description: "<2 hour MTTR for P1 incidents",                                            ownerName: "Liam Chen",     ownerTeam: "Delivery",  cadence: "monthly",  status: "on_track", lastCheckedISO: "2026-05-08" },
  { id: "OB-021", contractId: "CT-003", kind: "reporting",      description: "Quarterly steering committee deck",                                        ownerName: "Liam Chen",     ownerTeam: "Delivery",  cadence: "quarterly", status: "due_soon", lastCheckedISO: "2026-04-30" },
  { id: "OB-022", contractId: "CT-016", kind: "deliverable",   description: "Pilot dashboard live for Brent platform by 2026-07-31",                    ownerName: "Liam Chen",     ownerTeam: "Delivery",  dueDateISO: "2026-07-31", status: "on_track", lastCheckedISO: "2026-05-09" },

  /* DBS */
  { id: "OB-030", contractId: "CT-008", kind: "reporting",      description: "Half-yearly compliance attestation",                                       ownerName: "Aanya Iyer",    ownerTeam: "Commercial", cadence: "half_yearly", status: "on_track", lastCheckedISO: "2026-04-30" },
  { id: "OB-031", contractId: "CT-017", kind: "deliverable",   description: "Phase 1 segmentation engine production go-live by 2026-04-30",            ownerName: "Rajesh Kumar",  ownerTeam: "Delivery",  dueDateISO: "2026-04-30", status: "completed", evidence: "Go-live confirmed 2026-04-28", lastCheckedISO: "2026-04-28" },

  /* Tata Consumer renewal candidate */
  { id: "OB-040", contractId: "CT-005", kind: "renewal_notice", description: "Notify renewal intention 60 days before 2026-07-14",                       ownerName: "Priya Reddy",   ownerTeam: "Commercial", dueDateISO: "2026-05-15", status: "due_soon", extractedFromClause: "Section 11", lastCheckedISO: "2026-05-09" },

  /* AWS */
  { id: "OB-050", contractId: "CT-010", kind: "renewal_notice", description: "Opt-out window — 30 days before 2027-03-31",                              ownerName: "Priya Reddy",   ownerTeam: "Commercial", dueDateISO: "2027-03-01", status: "on_track", lastCheckedISO: "2026-04-04" },
  { id: "OB-051", contractId: "CT-010", kind: "payment",        description: "Annual EDP commit — USD 200K minimum",                                     ownerName: "Meera Pillai",  ownerTeam: "Finance",   cadence: "annual",   status: "on_track", lastCheckedISO: "2026-04-15" },

  /* Salesforce (expiring) */
  { id: "OB-060", contractId: "CT-012", kind: "renewal_notice", description: "Opt-out by 2026-05-31 or auto-renew kicks in",                            ownerName: "Priya Reddy",   ownerTeam: "Commercial", dueDateISO: "2026-05-31", status: "due_soon", lastCheckedISO: "2026-05-10" },

  /* Workday */
  { id: "OB-070", contractId: "CT-011", kind: "renewal_notice", description: "Opt-out window — 60 days before 2027-02-28",                              ownerName: "Priya Reddy",   ownerTeam: "Commercial", dueDateISO: "2026-12-30", status: "on_track", lastCheckedISO: "2026-04-22" },
  { id: "OB-071", contractId: "CT-011", kind: "payment",        description: "Annual subscription due each anniversary",                                 ownerName: "Meera Pillai",  ownerTeam: "Finance",   cadence: "annual",   status: "on_track", lastCheckedISO: "2026-03-01" },

  /* Maersk */
  { id: "OB-080", contractId: "CT-007", kind: "renewal_notice", description: "Opt-out window — 60 days before 2026-10-31",                              ownerName: "Aanya Iyer",    ownerTeam: "Commercial", dueDateISO: "2026-09-01", status: "on_track", lastCheckedISO: "2026-04-28" },

  /* TalentForce — overdue */
  { id: "OB-090", contractId: "CT-015", kind: "renewal_notice", description: "Opt-out window — 30 days before 2026-05-14",                              ownerName: "Sneha Iyer",    ownerTeam: "People",    dueDateISO: "2026-04-14", status: "overdue", evidence: "Window passed — auto-renewed", lastCheckedISO: "2026-05-10" },

  /* ICICI Lombard */
  { id: "OB-100", contractId: "CT-027", kind: "renewal_notice", description: "60-day opt-out window before 2026-03-31",                                 ownerName: "Sneha Iyer",    ownerTeam: "People",    dueDateISO: "2026-01-30", status: "completed", evidence: "2026 renewal terms agreed 2026-01-25", lastCheckedISO: "2026-01-25" },
  { id: "OB-101", contractId: "CT-027", kind: "reporting",      description: "Monthly claims report",                                                    ownerName: "Sneha Iyer",    ownerTeam: "People",    cadence: "monthly",  status: "on_track", lastCheckedISO: "2026-04-30" },

  /* Atlassian + GitHub */
  { id: "OB-110", contractId: "CT-023", kind: "renewal_notice", description: "Auto-renew unless opt-out 30 days prior",                                 ownerName: "Priya Reddy",   ownerTeam: "Commercial", dueDateISO: "2026-03-02", status: "completed", evidence: "Renewed", lastCheckedISO: "2026-03-02" },
  { id: "OB-120", contractId: "CT-024", kind: "renewal_notice", description: "Auto-renew unless opt-out 30 days prior",                                 ownerName: "Priya Reddy",   ownerTeam: "Commercial", dueDateISO: "2026-04-01", status: "completed", evidence: "Renewed", lastCheckedISO: "2026-04-01" },

  /* DPA + Razorpay */
  { id: "OB-130", contractId: "CT-020", kind: "audit_right",    description: "DPDP regulator audit cooperation",                                         ownerName: "Ravi Menon",    ownerTeam: "Privacy",   cadence: "on_event", status: "on_track", lastCheckedISO: "2026-04-30" },

  /* Anthropic */
  { id: "OB-140", contractId: "CT-026", kind: "restriction",   description: "No training on customer prompts (zero data retention)",                    ownerName: "Ravi Menon",    ownerTeam: "Privacy",   cadence: "annual",   status: "on_track", lastCheckedISO: "2026-04-15" },

  /* Bain subcontractor */
  { id: "OB-150", contractId: "CT-029", kind: "deliverable",   description: "Final deliverables for Sumitomo engagement by 2026-12-15",                ownerName: "Aanya Iyer",    ownerTeam: "Commercial", dueDateISO: "2026-12-15", status: "on_track", lastCheckedISO: "2026-05-08" },

  /* PwC audit */
  { id: "OB-160", contractId: "CT-030", kind: "deliverable",   description: "Audit fieldwork complete by 2026-09-15",                                   ownerName: "Meera Pillai",  ownerTeam: "Finance",   dueDateISO: "2026-09-15", status: "on_track", lastCheckedISO: "2026-04-30" },

  /* OpenAI escalated */
  { id: "OB-170", contractId: "CT-025", kind: "restriction",   description: "Pending — data residency restriction must be resolved before any prod use", ownerName: "Ravi Menon",    ownerTeam: "Privacy",   status: "due_soon", lastCheckedISO: "2026-05-10" },
];

export function obligationsForContract(contractId: string): Obligation[] {
  return OBLIGATIONS.filter((o) => o.contractId === contractId);
}

/* ───────────────────────── Renewal Sentinel ───────────────────────── */

export type RenewalRecommendation = "renew" | "renegotiate" | "terminate" | "decision_pending";

export interface RenewalSignal {
  label: string;
  /** Either + (positive) or − (concern) or = (neutral). */
  tone: "positive" | "negative" | "neutral";
}

export interface RenewalEvent {
  id: string;
  contractId: string;
  eventDateISO: string;          // either expiry or auto-renewal date
  noticeWindowOpensISO: string;
  daysUntilEvent: number;
  /** From the contract: pure auto-renew, opt-in renew, or expiry. */
  kind: "auto_renew" | "opt_in_renew" | "expiry";
  recommendation: RenewalRecommendation;
  /** Usage / value signals driving the recommendation. */
  signals: RenewalSignal[];
  /** Alternative options considered. */
  alternatives: string[];
  /** Status of the human decision. */
  decisionStatus: "open" | "decided_renew" | "decided_renegotiate" | "decided_terminate";
  decisionBy?: string;
  decisionWhenISO?: string;
}

export const RENEWAL_EVENTS: RenewalEvent[] = [
  {
    id: "RV-001",
    contractId: "CT-005",
    eventDateISO: "2026-07-14",
    noticeWindowOpensISO: "2026-05-15",
    daysUntilEvent: 63,
    kind: "expiry",
    recommendation: "renegotiate",
    signals: [
      { label: "Usage: 78% of contracted scope consumed",       tone: "positive" },
      { label: "NPS from Tata Consumer team: 8.4 / 10",          tone: "positive" },
      { label: "Two scope-expansion requests in queue",          tone: "positive" },
      { label: "Margins under pressure — fixed-fee underrun",    tone: "negative" },
    ],
    alternatives: ["Renew flat with 5% uplift", "Renegotiate with hybrid T&M+fixed", "Convert to outcome-based"],
    decisionStatus: "open",
  },
  {
    id: "RV-002",
    contractId: "CT-007",
    eventDateISO: "2026-10-31",
    noticeWindowOpensISO: "2026-09-01",
    daysUntilEvent: 172,
    kind: "auto_renew",
    recommendation: "renew",
    signals: [
      { label: "Maersk renewed scope to 3 additional regions",   tone: "positive" },
      { label: "SLA compliance: 99.7% over last 12 months",      tone: "positive" },
      { label: "Pipeline: 2 additional SOWs being scoped",       tone: "positive" },
    ],
    alternatives: ["Auto-renew at current terms", "Renew with 5% uplift + expanded scope"],
    decisionStatus: "open",
  },
  {
    id: "RV-003",
    contractId: "CT-010",
    eventDateISO: "2027-03-31",
    noticeWindowOpensISO: "2027-03-01",
    daysUntilEvent: 322,
    kind: "auto_renew",
    recommendation: "renew",
    signals: [
      { label: "EDP commit utilisation: 134%",                   tone: "positive" },
      { label: "No realistic alternative at this scale",         tone: "neutral"  },
    ],
    alternatives: ["Renew as-is", "Negotiate larger EDP for deeper discount"],
    decisionStatus: "open",
  },
  {
    id: "RV-004",
    contractId: "CT-012",
    eventDateISO: "2026-06-30",
    noticeWindowOpensISO: "2026-05-31",
    daysUntilEvent: 49,
    kind: "auto_renew",
    recommendation: "renew",
    signals: [
      { label: "Active users: 92% of seats",                     tone: "positive" },
      { label: "Sales team dependency: critical",                tone: "positive" },
      { label: "CPI escalation: 7% (above playbook)",            tone: "negative" },
    ],
    alternatives: ["Renew at proposed terms", "Renegotiate seat count + escalation", "Migrate to HubSpot"],
    decisionStatus: "open",
  },
  {
    id: "RV-005",
    contractId: "CT-015",
    eventDateISO: "2026-05-14",
    noticeWindowOpensISO: "2026-04-14",
    daysUntilEvent: 2,
    kind: "auto_renew",
    recommendation: "terminate",
    signals: [
      { label: "Vendor delivered 3 placements in 12 months — 50% below target", tone: "negative" },
      { label: "Two alternative vendors better-priced",          tone: "negative" },
      { label: "Notice window MISSED — auto-renewal imminent",   tone: "negative" },
    ],
    alternatives: ["Escalate to terminate via material breach", "Let auto-renew and exit at next window"],
    decisionStatus: "open",
  },
  {
    id: "RV-006",
    contractId: "CT-018",
    eventDateISO: "2026-11-14",
    noticeWindowOpensISO: "2026-10-15",
    daysUntilEvent: 186,
    kind: "auto_renew",
    recommendation: "renew",
    signals: [
      { label: "Active users: 58 of 60 seats",                   tone: "positive" },
    ],
    alternatives: ["Auto-renew", "Negotiate seat reduction to 50"],
    decisionStatus: "open",
  },
  {
    id: "RV-007",
    contractId: "CT-023",
    eventDateISO: "2027-03-31",
    noticeWindowOpensISO: "2027-03-01",
    daysUntilEvent: 322,
    kind: "auto_renew",
    recommendation: "renew",
    signals: [{ label: "Engineering dependency: critical", tone: "positive" }],
    alternatives: ["Auto-renew"],
    decisionStatus: "open",
  },
  {
    id: "RV-008",
    contractId: "CT-027",
    eventDateISO: "2026-03-31",
    noticeWindowOpensISO: "2026-01-30",
    daysUntilEvent: -42,
    kind: "auto_renew",
    recommendation: "renew",
    signals: [{ label: "Renewed at 2026-01-25 with improved terms", tone: "positive" }],
    alternatives: [],
    decisionStatus: "decided_renew",
    decisionBy: "Sneha Iyer",
    decisionWhenISO: "2026-01-25",
  },
  {
    id: "RV-009",
    contractId: "CT-022",
    eventDateISO: "2027-01-14",
    noticeWindowOpensISO: "2026-12-30",
    daysUntilEvent: 247,
    kind: "auto_renew",
    recommendation: "renew",
    signals: [{ label: "First year — too early to evaluate alternatives", tone: "neutral" }],
    alternatives: ["Auto-renew"],
    decisionStatus: "open",
  },
];

export function renewalForContract(contractId: string): RenewalEvent | undefined {
  return RENEWAL_EVENTS.find((r) => r.contractId === contractId);
}

/* ───────────────────────── Repository facets ───────────────────────── */

export function counterpartyOptions(): { id: string; name: string }[] {
  return COUNTERPARTIES.map((c) => ({ id: c.id, name: c.name }));
}

export function statusFacets(): { status: ContractStatus; count: number }[] {
  const out = new Map<ContractStatus, number>();
  for (const c of CONTRACTS) {
    out.set(c.status, (out.get(c.status) ?? 0) + 1);
  }
  return Array.from(out.entries()).map(([status, count]) => ({ status, count }));
}

export function typeFacets(): { type: ContractType; count: number }[] {
  const out = new Map<ContractType, number>();
  for (const c of CONTRACTS) {
    out.set(c.type, (out.get(c.type) ?? 0) + 1);
  }
  return Array.from(out.entries()).map(([type, count]) => ({ type, count }));
}

/* ───────────────────────── Helpers ───────────────────────── */

export function formatINR(n: number): string {
  if (n === 0) return "—";
  if (n >= 10_000_000) return "₹" + (n / 10_000_000).toFixed(2) + " Cr";
  if (n >= 100_000)    return "₹" + (n / 100_000).toFixed(1) + " L";
  return "₹" + n.toLocaleString("en-IN");
}

export function daysBetween(aISO: string, bISO: string): number {
  const a = new Date(aISO + "T12:00:00").getTime();
  const b = new Date(bISO + "T12:00:00").getTime();
  return Math.round((b - a) / (24 * 60 * 60_000));
}

export const CLM_KPIS = {
  totalContracts: CONTRACTS.length,
  active: CONTRACTS.filter((c) => c.status === "active").length,
  inFlight: CONTRACTS.filter((c) => ["drafting", "internal_review", "out_to_counterparty", "negotiation", "approval", "out_for_signature", "intake"].includes(c.status)).length,
  pendingSignature: CONTRACTS.filter((c) => c.status === "out_for_signature").length,
  expiringSoon: RENEWAL_EVENTS.filter((r) => r.daysUntilEvent >= 0 && r.daysUntilEvent <= 90 && r.decisionStatus === "open").length,
  openObligations: OBLIGATIONS.filter((o) => o.status !== "completed" && o.status !== "waived").length,
  obligationsOverdue: OBLIGATIONS.filter((o) => o.status === "overdue").length,
  redDeviations: CONTRACTS.reduce((sum, c) => sum + c.deviations.filter((d) => d.severity === "red").length, 0),
};
