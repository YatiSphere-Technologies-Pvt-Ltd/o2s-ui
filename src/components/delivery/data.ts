/* ================================================================
   O2S Delivery & PMO — Types & Mock Data
   ================================================================
   Three-tier hierarchy: Portfolio → Program → Project → Work items.
   Hybrid methodology support: Waterfall (Gantt), Agile (Scrum), Kanban.
   ================================================================ */

export type Methodology = "waterfall" | "scrum" | "kanban" | "hybrid";

export const METHODOLOGY_LABEL: Record<Methodology, string> = {
  waterfall: "Waterfall",
  scrum: "Scrum",
  kanban: "Kanban",
  hybrid: "Hybrid",
};

export type RagStatus = "green" | "amber" | "red";

export const RAG_TINT: Record<RagStatus, string> = {
  green: "bg-success/10 text-success",
  amber: "bg-warning/10 text-warning",
  red:   "bg-destructive/10 text-destructive",
};

export const RAG_DOT: Record<RagStatus, string> = {
  green: "bg-success",
  amber: "bg-warning",
  red:   "bg-destructive",
};

export type WorkItemStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "in_review"
  | "blocked"
  | "done"
  | "cancelled";

export const STATUS_LABEL: Record<WorkItemStatus, string> = {
  backlog: "Backlog",
  todo: "To do",
  in_progress: "In progress",
  in_review: "In review",
  blocked: "Blocked",
  done: "Done",
  cancelled: "Cancelled",
};

export const STATUS_TINT: Record<WorkItemStatus, string> = {
  backlog:     "bg-secondary text-muted-foreground",
  todo:        "bg-secondary text-foreground",
  in_progress: "bg-brand/10 text-brand",
  in_review:   "bg-brand-purple/10 text-brand-purple",
  blocked:     "bg-destructive/10 text-destructive",
  done:        "bg-success/10 text-success",
  cancelled:   "bg-secondary text-muted-foreground/70",
};

export type WorkItemKind = "epic" | "story" | "task" | "subtask" | "bug" | "chore";

export const KIND_TINT: Record<WorkItemKind, string> = {
  epic:    "bg-brand-purple/10 text-brand-purple",
  story:   "bg-brand/10 text-brand",
  task:    "bg-brand-teal/10 text-brand-teal",
  subtask: "bg-secondary text-muted-foreground",
  bug:     "bg-destructive/10 text-destructive",
  chore:   "bg-warning/10 text-warning",
};

export type Priority = "p0" | "p1" | "p2" | "p3";
export const PRIORITY_LABEL: Record<Priority, string> = { p0: "P0", p1: "P1", p2: "P2", p3: "P3" };
export const PRIORITY_TINT: Record<Priority, string> = {
  p0: "bg-destructive/10 text-destructive",
  p1: "bg-warning/10 text-warning",
  p2: "bg-brand/10 text-brand",
  p3: "bg-secondary text-muted-foreground",
};

export type DependencyKind = "FS" | "SS" | "FF" | "SF";
export const DEPENDENCY_LABEL: Record<DependencyKind, string> = {
  FS: "Finish-to-Start",
  SS: "Start-to-Start",
  FF: "Finish-to-Finish",
  SF: "Start-to-Finish",
};

export type EstimateUnit = "points" | "tshirt" | "hours" | "dollars";
export const ESTIMATE_UNIT_LABEL: Record<EstimateUnit, string> = {
  points: "Story points",
  tshirt: "T-shirt size",
  hours: "Hours",
  dollars: "Dollars",
};

/* ── People (delivery scope) ────────────────────────────────── */

export interface Person {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  jobTitle: string;
  /** Hours per working day. */
  workingHours: number;
  /** Country for working pattern. */
  country: string;
  /** Skills with 1–5 proficiency. */
  skills: { skill: string; proficiency: 1 | 2 | 3 | 4 | 5 }[];
  /** ISO date ranges when this person is on leave (joined with HR module's source of truth). */
  onLeave: { startISO: string; endISO: string; kind: string }[];
}

export const PEOPLE: Person[] = [
  {
    id: "p-priya", name: "Priya Singh", initials: "PS", avatarColor: "bg-brand",
    jobTitle: "Senior Engineer", workingHours: 8, country: "IN",
    skills: [
      { skill: "TypeScript", proficiency: 5 },
      { skill: "React",      proficiency: 5 },
      { skill: "GraphQL",    proficiency: 4 },
      { skill: "AWS",        proficiency: 3 },
    ],
    onLeave: [{ startISO: "2026-06-02", endISO: "2026-06-06", kind: "WFA" }],
  },
  {
    id: "p-rajiv", name: "Rajiv Kumar", initials: "RK", avatarColor: "bg-warning",
    jobTitle: "Engineering Manager", workingHours: 8, country: "IN",
    skills: [
      { skill: "Architecture",  proficiency: 5 },
      { skill: "Java",          proficiency: 5 },
      { skill: "Payments",      proficiency: 5 },
      { skill: "Leadership",    proficiency: 4 },
    ],
    onLeave: [],
  },
  {
    id: "p-anil", name: "Anil Sharma", initials: "AS", avatarColor: "bg-success",
    jobTitle: "Head of Ops", workingHours: 8, country: "IN",
    skills: [
      { skill: "Program management", proficiency: 5 },
      { skill: "Risk",               proficiency: 5 },
      { skill: "Stakeholders",       proficiency: 5 },
    ],
    onLeave: [{ startISO: "2026-07-06", endISO: "2026-07-10", kind: "Privileged" }],
  },
  {
    id: "p-meera", name: "Meera Krishnan", initials: "MK", avatarColor: "bg-brand-purple",
    jobTitle: "VP Engineering", workingHours: 8, country: "IN",
    skills: [
      { skill: "Architecture", proficiency: 5 },
      { skill: "Strategy",     proficiency: 5 },
    ],
    onLeave: [],
  },
  {
    id: "p-sneha", name: "Sneha Rao", initials: "SR", avatarColor: "bg-brand-teal",
    jobTitle: "Backend Engineer", workingHours: 8, country: "IN",
    skills: [
      { skill: "Go",           proficiency: 5 },
      { skill: "Kafka",        proficiency: 4 },
      { skill: "Architecture", proficiency: 3 },
    ],
    onLeave: [],
  },
  {
    id: "p-vikram", name: "Vikram Joshi", initials: "VJ", avatarColor: "bg-destructive",
    jobTitle: "PM (Phoenix)", workingHours: 8, country: "IN",
    skills: [
      { skill: "Product",  proficiency: 5 },
      { skill: "Discovery", proficiency: 4 },
    ],
    onLeave: [],
  },
  {
    id: "p-james", name: "James Whittaker", initials: "JW", avatarColor: "bg-blue-400",
    jobTitle: "Senior Engineer", workingHours: 7.5, country: "UK",
    skills: [
      { skill: "Python",  proficiency: 5 },
      { skill: "Data engineering", proficiency: 5 },
      { skill: "Spark", proficiency: 4 },
    ],
    onLeave: [],
  },
  {
    id: "p-sophia", name: "Sophia Patel", initials: "SP", avatarColor: "bg-pink-400",
    jobTitle: "Frontend Engineer", workingHours: 7.5, country: "UK",
    skills: [
      { skill: "React",      proficiency: 5 },
      { skill: "Design systems", proficiency: 5 },
      { skill: "Accessibility",   proficiency: 4 },
    ],
    onLeave: [],
  },
  {
    id: "p-noah", name: "Noah Williams", initials: "NW", avatarColor: "bg-brand",
    jobTitle: "Software Engineer", workingHours: 8, country: "US",
    skills: [
      { skill: "TypeScript", proficiency: 4 },
      { skill: "Node",       proficiency: 4 },
    ],
    onLeave: [],
  },
  {
    id: "p-leo", name: "Leo Müller", initials: "LM", avatarColor: "bg-warning",
    jobTitle: "Security Engineer", workingHours: 8, country: "DE",
    skills: [
      { skill: "AppSec",       proficiency: 5 },
      { skill: "Compliance",   proficiency: 4 },
    ],
    onLeave: [],
  },
  {
    id: "p-grace", name: "Grace Liu", initials: "GL", avatarColor: "bg-brand",
    jobTitle: "Finance Partner (Delivery)", workingHours: 8, country: "SG",
    skills: [
      { skill: "Finance",   proficiency: 5 },
      { skill: "Budgeting", proficiency: 5 },
    ],
    onLeave: [],
  },
  {
    id: "p-aisha", name: "Aisha Khan", initials: "AK", avatarColor: "bg-brand-purple",
    jobTitle: "PM (new)", workingHours: 8, country: "IN",
    skills: [
      { skill: "Product", proficiency: 3 },
      { skill: "Discovery", proficiency: 3 },
    ],
    onLeave: [],
  },
];

export const PEOPLE_MAP: Record<string, Person> = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));

/* ── Portfolios → Programs → Projects ───────────────────────── */

export interface Portfolio {
  id: string;
  name: string;
  strategicTheme: string;
  description: string;
  /** Sum of program budgets (INR). */
  budgetINR: number;
  ownerId: string;
}

export const PORTFOLIOS: Portfolio[] = [
  {
    id: "po-growth",
    name: "Growth Bets",
    strategicTheme: "Top-line growth + new markets",
    description: "Revenue-driving programs: payments, new geos, marketplace.",
    budgetINR: 42_000_000,
    ownerId: "p-meera",
  },
  {
    id: "po-platform",
    name: "Platform & Reliability",
    strategicTheme: "Foundations + cost-to-serve",
    description: "Infra, data, security, observability, dev-experience.",
    budgetINR: 28_000_000,
    ownerId: "p-rajiv",
  },
  {
    id: "po-compliance",
    name: "Compliance & Trust",
    strategicTheme: "Regulatory + customer trust",
    description: "DPDP, SOC 2, customer-facing compliance commitments.",
    budgetINR: 15_000_000,
    ownerId: "p-anil",
  },
];

export interface Program {
  id: string;
  portfolioId: string;
  name: string;
  description: string;
  ownerId: string;
  /** RAG aggregated across child projects. */
  rag: RagStatus;
  /** ISO date range. */
  startISO: string;
  endISO: string;
  budgetINR: number;
}

export const PROGRAMS: Program[] = [
  {
    id: "pr-payments",
    portfolioId: "po-growth",
    name: "Payments Modernisation",
    description: "Replace legacy gateway, settle T+0 across IN/UK/SG.",
    ownerId: "p-rajiv",
    rag: "amber",
    startISO: "2026-01-01",
    endISO: "2026-12-31",
    budgetINR: 24_000_000,
  },
  {
    id: "pr-newmarket",
    portfolioId: "po-growth",
    name: "New Market Entry · APAC",
    description: "Launch in Singapore + Japan; localisation + partner integrations.",
    ownerId: "p-meera",
    rag: "green",
    startISO: "2026-03-01",
    endISO: "2026-10-31",
    budgetINR: 18_000_000,
  },
  {
    id: "pr-infra",
    portfolioId: "po-platform",
    name: "Infra Hardening",
    description: "Multi-region failover, observability, runbook automation.",
    ownerId: "p-rajiv",
    rag: "green",
    startISO: "2026-02-01",
    endISO: "2026-09-30",
    budgetINR: 18_000_000,
  },
  {
    id: "pr-dataplatform",
    portfolioId: "po-platform",
    name: "DataMesh",
    description: "Federated data platform; self-serve analytics; product-led.",
    ownerId: "p-meera",
    rag: "green",
    startISO: "2026-04-01",
    endISO: "2027-03-31",
    budgetINR: 10_000_000,
  },
  {
    id: "pr-dpdp",
    portfolioId: "po-compliance",
    name: "DPDP Readiness",
    description: "India Digital Personal Data Protection Act compliance posture.",
    ownerId: "p-anil",
    rag: "red",
    startISO: "2026-01-01",
    endISO: "2026-06-30",
    budgetINR: 6_000_000,
  },
  {
    id: "pr-soc2",
    portfolioId: "po-compliance",
    name: "SOC 2 Type II",
    description: "Type II observation window + audit.",
    ownerId: "p-leo",
    rag: "amber",
    startISO: "2026-02-01",
    endISO: "2026-12-31",
    budgetINR: 9_000_000,
  },
];

export const PROGRAMS_MAP: Record<string, Program> = Object.fromEntries(PROGRAMS.map((p) => [p.id, p]));

export interface ProjectCharter {
  goal: string;
  scopeIn: string[];
  scopeOut: string[];
  successMetrics: string[];
  sponsor: string;
  budgetINR: number;
  startISO: string;
  endISO: string;
}

export interface Project {
  id: string;
  programId: string;
  name: string;
  shortName: string;
  customer?: string;
  methodology: Methodology;
  rag: RagStatus;
  /** Composite health 0–100. */
  health: number;
  /** Trend over last 4 weeks. */
  healthTrend: number[];
  /** Budget spent vs total. */
  spentINR: number;
  totalBudgetINR: number;
  charter: ProjectCharter;
  /** PM in charge. */
  pmId: string;
  /** People assigned to the team. */
  teamIds: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "p-phoenix",
    programId: "pr-payments",
    name: "Phoenix Migration",
    shortName: "Phoenix",
    customer: "Internal",
    methodology: "hybrid",
    rag: "amber",
    health: 64,
    healthTrend: [78, 76, 71, 64],
    spentINR: 8_400_000,
    totalBudgetINR: 14_000_000,
    charter: {
      goal: "Replace legacy payments gateway with the new platform across IN/UK/SG markets.",
      scopeIn: [
        "Card + UPI + SEPA + FAST rails",
        "Webhook compatibility shim for 12 months",
        "Settlement reconciliation parity",
        "Customer migration playbook",
      ],
      scopeOut: [
        "Net-new merchant onboarding flow (separate project)",
        "Crypto rails",
        "JP market (in New Market Entry · APAC)",
      ],
      successMetrics: [
        "100% volume migrated by 2026-11-30",
        "Reconciliation parity ≥99.97%",
        "Latency p95 ≤350ms (was 720ms)",
      ],
      sponsor: "Meera Krishnan",
      budgetINR: 14_000_000,
      startISO: "2026-01-15",
      endISO: "2026-11-30",
    },
    pmId: "p-vikram",
    teamIds: ["p-rajiv", "p-priya", "p-sneha", "p-leo", "p-james"],
  },
  {
    id: "p-acme",
    programId: "pr-payments",
    name: "Acme Bank Phase 2",
    shortName: "Acme",
    customer: "Acme Bank",
    methodology: "scrum",
    rag: "green",
    health: 82,
    healthTrend: [74, 76, 79, 82],
    spentINR: 3_200_000,
    totalBudgetINR: 6_500_000,
    charter: {
      goal: "Extend Acme Bank integration to include corporate banking + AR automation.",
      scopeIn: [
        "Corporate accounts onboarding",
        "AR automation hooks",
        "Multi-currency settlement",
      ],
      scopeOut: [
        "Retail banking (covered by Phase 1)",
        "Loan origination",
      ],
      successMetrics: [
        "Go-live by 2026-09-30",
        "Customer NPS ≥45",
        "Throughput +35%",
      ],
      sponsor: "Vikram Joshi",
      budgetINR: 6_500_000,
      startISO: "2026-03-01",
      endISO: "2026-10-31",
    },
    pmId: "p-aisha",
    teamIds: ["p-priya", "p-sneha", "p-sophia"],
  },
  {
    id: "p-jp-launch",
    programId: "pr-newmarket",
    name: "Japan Launch",
    shortName: "JP Launch",
    customer: "Internal",
    methodology: "waterfall",
    rag: "green",
    health: 86,
    healthTrend: [82, 84, 85, 86],
    spentINR: 4_800_000,
    totalBudgetINR: 11_000_000,
    charter: {
      goal: "Launch O2S in Japan with PayPay + LINE Pay rails; ja-JP localisation; PMI partner.",
      scopeIn: [
        "ja-JP locale + currency + holidays",
        "PayPay + LINE Pay rails",
        "PMI go-to-market partnership",
        "JP-specific compliance review",
      ],
      scopeOut: [
        "Customer-facing mobile app (deferred)",
        "Korea launch (separate program)",
      ],
      successMetrics: [
        "Launched by 2026-09-30",
        "First-month revenue ≥¥40M",
        "5 anchor merchants live",
      ],
      sponsor: "Meera Krishnan",
      budgetINR: 11_000_000,
      startISO: "2026-04-15",
      endISO: "2026-09-30",
    },
    pmId: "p-aisha",
    teamIds: ["p-meera", "p-james", "p-sophia"],
  },
  {
    id: "p-datamesh",
    programId: "pr-dataplatform",
    name: "DataMesh v1",
    shortName: "DataMesh",
    customer: "Internal",
    methodology: "scrum",
    rag: "green",
    health: 88,
    healthTrend: [84, 86, 87, 88],
    spentINR: 1_800_000,
    totalBudgetINR: 10_000_000,
    charter: {
      goal: "Federated data platform with self-serve analytics for product teams.",
      scopeIn: [
        "Data contracts framework",
        "Self-serve catalog",
        "First 3 domains migrated (Payments, People, Talent)",
      ],
      scopeOut: [
        "Warehouse replacement",
        "Streaming analytics (Phase 2)",
      ],
      successMetrics: [
        "3 domains live by 2026-12-31",
        "Analyst lead-time −60%",
        "Data SLA ≥99.5%",
      ],
      sponsor: "Meera Krishnan",
      budgetINR: 10_000_000,
      startISO: "2026-04-01",
      endISO: "2027-03-31",
    },
    pmId: "p-vikram",
    teamIds: ["p-rajiv", "p-james", "p-sneha"],
  },
  {
    id: "p-infra-mr",
    programId: "pr-infra",
    name: "Multi-region failover",
    shortName: "MR Failover",
    customer: "Internal",
    methodology: "kanban",
    rag: "green",
    health: 84,
    healthTrend: [80, 82, 83, 84],
    spentINR: 2_100_000,
    totalBudgetINR: 5_000_000,
    charter: {
      goal: "Active-active multi-region across ap-south-1 + eu-central-1.",
      scopeIn: [
        "Region-aware routing",
        "Cross-region replication",
        "Failover runbook + 2 game days",
      ],
      scopeOut: [
        "US region (next FY)",
        "Edge POPs",
      ],
      successMetrics: [
        "RTO ≤5 min",
        "RPO ≤30 sec",
        "0 unplanned customer-visible failures during the game days",
      ],
      sponsor: "Rajiv Kumar",
      budgetINR: 5_000_000,
      startISO: "2026-02-01",
      endISO: "2026-08-31",
    },
    pmId: "p-rajiv",
    teamIds: ["p-rajiv", "p-sneha", "p-leo"],
  },
  {
    id: "p-dpdp",
    programId: "pr-dpdp",
    name: "DPDP Readiness",
    shortName: "DPDP",
    customer: "Internal",
    methodology: "waterfall",
    rag: "red",
    health: 52,
    healthTrend: [68, 62, 56, 52],
    spentINR: 4_200_000,
    totalBudgetINR: 6_000_000,
    charter: {
      goal: "Be DPDP-ready across product, vendors, and processes by 2026-06-30.",
      scopeIn: [
        "Data inventory + categorisation",
        "DSAR workflows (built)",
        "Vendor DPAs",
        "Consent management",
      ],
      scopeOut: [
        "GDPR delta (already done)",
        "CCPA",
      ],
      successMetrics: [
        "100% data inventory accuracy",
        "All P0 vendors with signed DPAs",
        "Consent capture ≥99.5%",
      ],
      sponsor: "Anil Sharma",
      budgetINR: 6_000_000,
      startISO: "2026-01-01",
      endISO: "2026-06-30",
    },
    pmId: "p-anil",
    teamIds: ["p-anil", "p-leo"],
  },
];

export const PROJECTS_MAP: Record<string, Project> = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));

/* ── Work items (epics → stories → tasks → subtasks) ────────── */

export interface WorkItem {
  id: string;
  projectId: string;
  parentId?: string;
  kind: WorkItemKind;
  title: string;
  description?: string;
  status: WorkItemStatus;
  priority: Priority;
  assigneeIds: string[];
  /** Cross-project: other projects this work feeds. */
  alsoServesProjectIds?: string[];
  /** Estimate value + unit. */
  estimate?: { value: number; unit: EstimateUnit };
  /** Hours actually spent. */
  actualHours?: number;
  /** Schedule for Gantt. */
  startISO?: string;
  endISO?: string;
  /** Sprint membership (if any). */
  sprintId?: string;
  /** Release (if any). */
  releaseId?: string;
  /** Labels. */
  labels?: string[];
  /** RICE/WSJF scoring for backlog prioritisation. */
  rice?: { reach: number; impact: number; confidence: number; effort: number };
  wsjf?: { businessValue: number; timeCriticality: number; riskReduction: number; jobSize: number };
}

/** RICE composite. */
export function riceScore(r: { reach: number; impact: number; confidence: number; effort: number }) {
  if (!r || r.effort === 0) return 0;
  return Math.round((r.reach * r.impact * r.confidence) / r.effort);
}

/** WSJF composite. */
export function wsjfScore(w: { businessValue: number; timeCriticality: number; riskReduction: number; jobSize: number }) {
  if (!w || w.jobSize === 0) return 0;
  return Math.round(((w.businessValue + w.timeCriticality + w.riskReduction) / w.jobSize) * 10) / 10;
}

/** Convert estimate to hours using simple rules. */
export function estimateToHours(e?: { value: number; unit: EstimateUnit }): number {
  if (!e) return 0;
  switch (e.unit) {
    case "hours":   return e.value;
    case "points":  return e.value * 4; // 1 point = 4 hours
    case "tshirt":  return [0, 4, 8, 16, 32, 64][Math.min(5, Math.max(0, e.value))] ?? 8;
    case "dollars": return Math.round(e.value / 100); // $100/hr proxy
  }
}

export const WORK_ITEMS: WorkItem[] = [
  /* ── Phoenix Migration epics & stories ── */
  { id: "w-px-ep1", projectId: "p-phoenix", kind: "epic", title: "UPI rail migration", status: "in_progress", priority: "p0", assigneeIds: ["p-rajiv"], startISO: "2026-02-01", endISO: "2026-08-31", labels: ["payments", "in"] },
  { id: "w-px-s1",  projectId: "p-phoenix", parentId: "w-px-ep1", kind: "story", title: "Reconcile UPI settlements with NPCI feed", status: "in_progress", priority: "p0", assigneeIds: ["p-sneha"], estimate: { value: 8, unit: "points" }, actualHours: 24, startISO: "2026-05-01", endISO: "2026-05-22", sprintId: "s-phoenix-14", labels: ["upi", "settlement"], rice: { reach: 8, impact: 3, confidence: 80, effort: 8 } },
  { id: "w-px-s2",  projectId: "p-phoenix", parentId: "w-px-ep1", kind: "story", title: "Webhook compatibility shim — UPI events", status: "in_review", priority: "p0", assigneeIds: ["p-priya"], estimate: { value: 5, unit: "points" }, actualHours: 18, startISO: "2026-04-15", endISO: "2026-05-10", sprintId: "s-phoenix-14", labels: ["upi", "shim"], rice: { reach: 9, impact: 3, confidence: 95, effort: 5 } },
  { id: "w-px-s3",  projectId: "p-phoenix", parentId: "w-px-ep1", kind: "story", title: "OAuth migration for merchant API", status: "todo", priority: "p1", assigneeIds: ["p-priya"], estimate: { value: 8, unit: "points" }, startISO: "2026-05-15", endISO: "2026-06-10", sprintId: "s-phoenix-14", labels: ["auth"], rice: { reach: 6, impact: 2, confidence: 70, effort: 8 } },
  { id: "w-px-ep2", projectId: "p-phoenix", kind: "epic", title: "Card rails parity", status: "todo", priority: "p1", assigneeIds: ["p-rajiv"], startISO: "2026-06-01", endISO: "2026-10-31", labels: ["payments", "cards"] },
  { id: "w-px-s4",  projectId: "p-phoenix", parentId: "w-px-ep2", kind: "story", title: "3DS challenge flow", status: "backlog", priority: "p1", assigneeIds: ["p-priya"], estimate: { value: 13, unit: "points" }, labels: ["cards", "auth"], rice: { reach: 9, impact: 3, confidence: 60, effort: 13 } },
  { id: "w-px-s5",  projectId: "p-phoenix", parentId: "w-px-ep2", kind: "story", title: "Network tokenisation", status: "backlog", priority: "p2", assigneeIds: ["p-sneha"], estimate: { value: 8, unit: "points" }, labels: ["cards"], rice: { reach: 5, impact: 2, confidence: 50, effort: 8 } },
  { id: "w-px-bug1",projectId: "p-phoenix", kind: "bug", title: "Settlement timestamp off by 5h30m on JP merchants", status: "blocked", priority: "p0", assigneeIds: ["p-sneha"], actualHours: 6, sprintId: "s-phoenix-14", labels: ["urgent", "settlement"] },

  /* ── Acme Bank stories ── */
  { id: "w-ac-ep1", projectId: "p-acme", kind: "epic", title: "Corporate accounts onboarding", status: "in_progress", priority: "p0", assigneeIds: ["p-priya"], startISO: "2026-03-15", endISO: "2026-08-31", labels: ["corporate"] },
  { id: "w-ac-s1",  projectId: "p-acme", parentId: "w-ac-ep1", kind: "story", title: "KYB document collection workflow", status: "in_progress", priority: "p0", assigneeIds: ["p-sophia"], estimate: { value: 5, unit: "points" }, actualHours: 12, startISO: "2026-05-01", endISO: "2026-05-15", sprintId: "s-acme-7", labels: ["kyb"], rice: { reach: 6, impact: 3, confidence: 85, effort: 5 } },
  { id: "w-ac-s2",  projectId: "p-acme", parentId: "w-ac-ep1", kind: "story", title: "Multi-signatory approval flow", status: "in_review", priority: "p0", assigneeIds: ["p-priya"], estimate: { value: 8, unit: "points" }, actualHours: 22, startISO: "2026-04-20", endISO: "2026-05-08", sprintId: "s-acme-7", labels: ["approval"], rice: { reach: 6, impact: 3, confidence: 80, effort: 8 } },
  { id: "w-ac-s3",  projectId: "p-acme", parentId: "w-ac-ep1", kind: "story", title: "Multi-currency settlement display", status: "todo", priority: "p1", assigneeIds: ["p-sneha"], estimate: { value: 5, unit: "points" }, sprintId: "s-acme-7", labels: ["fx"], alsoServesProjectIds: ["p-phoenix"], rice: { reach: 7, impact: 2, confidence: 75, effort: 5 } },
  { id: "w-ac-s4",  projectId: "p-acme", parentId: "w-ac-ep1", kind: "story", title: "AR automation hooks", status: "backlog", priority: "p2", assigneeIds: ["p-priya"], estimate: { value: 13, unit: "points" }, labels: ["ar"], wsjf: { businessValue: 7, timeCriticality: 4, riskReduction: 3, jobSize: 5 } },

  /* ── JP launch ── */
  { id: "w-jp-ep1", projectId: "p-jp-launch", kind: "epic", title: "ja-JP locale", status: "in_progress", priority: "p0", assigneeIds: ["p-sophia"], startISO: "2026-04-15", endISO: "2026-07-31", labels: ["i18n"] },
  { id: "w-jp-s1",  projectId: "p-jp-launch", parentId: "w-jp-ep1", kind: "story", title: "Translation memory + product copy", status: "in_progress", priority: "p0", assigneeIds: ["p-sophia"], estimate: { value: "M" === "M" ? 3 : 0, unit: "tshirt" }, actualHours: 28, startISO: "2026-05-01", endISO: "2026-05-31", labels: ["copy"], rice: { reach: 8, impact: 2, confidence: 90, effort: 3 } },
  { id: "w-jp-s2",  projectId: "p-jp-launch", parentId: "w-jp-ep1", kind: "story", title: "JPY currency + tax rules", status: "todo", priority: "p0", assigneeIds: ["p-james"], estimate: { value: 5, unit: "points" }, startISO: "2026-05-12", endISO: "2026-05-30", labels: ["currency"], wsjf: { businessValue: 9, timeCriticality: 8, riskReduction: 3, jobSize: 5 } },
  { id: "w-jp-ep2", projectId: "p-jp-launch", kind: "epic", title: "PayPay + LINE Pay rails", status: "todo", priority: "p0", assigneeIds: ["p-meera"], startISO: "2026-06-01", endISO: "2026-09-30", labels: ["payments", "jp"] },

  /* ── DataMesh ── */
  { id: "w-dm-ep1", projectId: "p-datamesh", kind: "epic", title: "Data contracts framework", status: "in_progress", priority: "p0", assigneeIds: ["p-james"], startISO: "2026-04-01", endISO: "2026-08-31", labels: ["contracts"] },
  { id: "w-dm-s1",  projectId: "p-datamesh", parentId: "w-dm-ep1", kind: "story", title: "Contract spec + linter", status: "in_progress", priority: "p0", assigneeIds: ["p-james"], estimate: { value: 8, unit: "points" }, actualHours: 30, startISO: "2026-04-15", endISO: "2026-05-30", labels: ["spec"], rice: { reach: 9, impact: 3, confidence: 90, effort: 8 } },
  { id: "w-dm-s2",  projectId: "p-datamesh", parentId: "w-dm-ep1", kind: "story", title: "Migrate Payments domain", status: "todo", priority: "p1", assigneeIds: ["p-sneha"], estimate: { value: 13, unit: "points" }, alsoServesProjectIds: ["p-phoenix"], wsjf: { businessValue: 8, timeCriticality: 6, riskReduction: 4, jobSize: 6 } },

  /* ── Multi-region failover ── */
  { id: "w-mr-ep1", projectId: "p-infra-mr", kind: "epic", title: "Region-aware routing", status: "in_progress", priority: "p0", assigneeIds: ["p-rajiv"], labels: ["routing"], startISO: "2026-02-15", endISO: "2026-06-30" },
  { id: "w-mr-s1",  projectId: "p-infra-mr", parentId: "w-mr-ep1", kind: "story", title: "Anycast DNS + GSLB", status: "in_progress", priority: "p0", assigneeIds: ["p-sneha"], estimate: { value: 8, unit: "points" }, actualHours: 22, labels: ["dns"], rice: { reach: 9, impact: 3, confidence: 70, effort: 8 } },
  { id: "w-mr-s2",  projectId: "p-infra-mr", parentId: "w-mr-ep1", kind: "story", title: "Cross-region replication for Postgres", status: "in_review", priority: "p0", assigneeIds: ["p-rajiv"], estimate: { value: 13, unit: "points" }, actualHours: 40, labels: ["db"], rice: { reach: 9, impact: 3, confidence: 60, effort: 13 } },
  { id: "w-mr-s3",  projectId: "p-infra-mr", parentId: "w-mr-ep1", kind: "story", title: "Game day #1 dry run", status: "todo", priority: "p1", assigneeIds: ["p-rajiv"], estimate: { value: 5, unit: "points" }, labels: ["gameday"] },

  /* ── DPDP readiness ── */
  { id: "w-dp-ep1", projectId: "p-dpdp", kind: "epic", title: "Vendor DPAs", status: "in_progress", priority: "p0", assigneeIds: ["p-anil"], startISO: "2026-03-01", endISO: "2026-06-15", labels: ["vendors"] },
  { id: "w-dp-s1",  projectId: "p-dpdp", parentId: "w-dp-ep1", kind: "story", title: "P0 vendor DPA signatures (32 vendors)", status: "in_progress", priority: "p0", assigneeIds: ["p-anil"], estimate: { value: 21, unit: "points" }, actualHours: 80, labels: ["dpa"], rice: { reach: 9, impact: 3, confidence: 70, effort: 21 } },
  { id: "w-dp-s2",  projectId: "p-dpdp", parentId: "w-dp-ep1", kind: "story", title: "Consent management UX overhaul", status: "blocked", priority: "p0", assigneeIds: ["p-sophia"], estimate: { value: 8, unit: "points" }, actualHours: 12, labels: ["consent"], rice: { reach: 9, impact: 3, confidence: 60, effort: 8 } },
];

export const WORK_ITEMS_MAP: Record<string, WorkItem> = Object.fromEntries(WORK_ITEMS.map((w) => [w.id, w]));

export function workItemsForProject(projectId: string): WorkItem[] {
  return WORK_ITEMS.filter((w) => w.projectId === projectId);
}

/* ── Dependencies ────────────────────────────────────────────── */

export interface Dependency {
  id: string;
  fromId: string;
  toId: string;
  kind: DependencyKind;
  /** True if either side is in a different project. */
  crossProject: boolean;
  /** When auto-detected by the Dependency Tracker agent. */
  autoDetected: boolean;
  /** Last known status (ok / at_risk / broken). */
  status: "ok" | "at_risk" | "broken";
  note?: string;
}

export const DEPENDENCIES: Dependency[] = [
  { id: "d-1", fromId: "w-ac-s3", toId: "w-px-s4", kind: "FS", crossProject: true,  autoDetected: true,  status: "at_risk", note: "Acme multi-currency settlement depends on Phoenix card-rails parity." },
  { id: "d-2", fromId: "w-dm-s2", toId: "w-px-ep1", kind: "FS", crossProject: true, autoDetected: true,  status: "ok",       note: "DataMesh payments-domain migration needs Phoenix UPI epic to settle." },
  { id: "d-3", fromId: "w-mr-s2", toId: "w-mr-s1",  kind: "FS", crossProject: false, autoDetected: false, status: "ok" },
  { id: "d-4", fromId: "w-dp-s1", toId: "w-dp-s2",  kind: "FS", crossProject: false, autoDetected: false, status: "broken", note: "DPDP consent UX is blocked on a vendor DPA refresh that pushed right." },
  { id: "d-5", fromId: "w-px-s1", toId: "w-px-bug1",kind: "FF", crossProject: false, autoDetected: false, status: "at_risk" },
  { id: "d-6", fromId: "w-jp-s2", toId: "w-jp-s1",  kind: "SS", crossProject: false, autoDetected: false, status: "ok" },
];

/* ── Sprints ────────────────────────────────────────────────── */

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  startISO: string;
  endISO: string;
  status: "future" | "active" | "closed";
  /** Velocity (story points). */
  committedPoints: number;
  completedPoints: number;
  /** Scope changes mid-sprint. */
  scopeChanges: { addedPoints: number; removedPoints: number };
}

export const SPRINTS: Sprint[] = [
  {
    id: "s-phoenix-14",
    projectId: "p-phoenix",
    name: "Phoenix Sprint 14",
    goal: "Close UPI shim + settle reconciliation parity to 99.9%.",
    startISO: "2026-05-05",
    endISO: "2026-05-18",
    status: "active",
    committedPoints: 28,
    completedPoints: 13,
    scopeChanges: { addedPoints: 5, removedPoints: 0 },
  },
  {
    id: "s-phoenix-15",
    projectId: "p-phoenix",
    name: "Phoenix Sprint 15",
    goal: "Begin card rails parity work; start 3DS challenge flow.",
    startISO: "2026-05-19",
    endISO: "2026-06-01",
    status: "future",
    committedPoints: 0,
    completedPoints: 0,
    scopeChanges: { addedPoints: 0, removedPoints: 0 },
  },
  {
    id: "s-acme-7",
    projectId: "p-acme",
    name: "Acme Sprint 7",
    goal: "Close KYB + multi-sig; start multi-currency display.",
    startISO: "2026-05-05",
    endISO: "2026-05-18",
    status: "active",
    committedPoints: 18,
    completedPoints: 8,
    scopeChanges: { addedPoints: 0, removedPoints: 0 },
  },
  {
    id: "s-dm-3",
    projectId: "p-datamesh",
    name: "DataMesh Sprint 3",
    goal: "Ship contract spec v1 + linter prototype.",
    startISO: "2026-05-05",
    endISO: "2026-05-18",
    status: "active",
    committedPoints: 13,
    completedPoints: 6,
    scopeChanges: { addedPoints: 0, removedPoints: 0 },
  },
];

export const SPRINTS_MAP: Record<string, Sprint> = Object.fromEntries(SPRINTS.map((s) => [s.id, s]));

/* ── Allocations & capacity ──────────────────────────────────── */

export interface Allocation {
  id: string;
  personId: string;
  projectId: string;
  /** ISO week start (Monday). */
  weekISO: string;
  /** Allocation as % of person's working hours. */
  pct: number;
  /** "soft" = tentative; "hard" = committed. */
  kind: "soft" | "hard";
}

/** Build allocations for the next ~6 weeks across all team members. */
function makeAllocations(): Allocation[] {
  const weeks = ["2026-05-04", "2026-05-11", "2026-05-18", "2026-05-25", "2026-06-01", "2026-06-08"];
  const seed: { personId: string; projectId: string; pcts: number[] }[] = [
    { personId: "p-rajiv",  projectId: "p-phoenix",   pcts: [40, 40, 30, 30, 30, 30] },
    { personId: "p-rajiv",  projectId: "p-infra-mr", pcts: [30, 30, 40, 40, 40, 40] },
    { personId: "p-rajiv",  projectId: "p-datamesh", pcts: [20, 20, 20, 20, 20, 20] },
    { personId: "p-priya",  projectId: "p-phoenix",  pcts: [80, 70, 70, 70, 50, 50] },
    { personId: "p-priya",  projectId: "p-acme",     pcts: [20, 30, 30, 30, 50, 50] },
    { personId: "p-sneha",  projectId: "p-phoenix",  pcts: [60, 60, 50, 50, 50, 50] },
    { personId: "p-sneha",  projectId: "p-infra-mr", pcts: [40, 40, 50, 50, 50, 50] },
    { personId: "p-sneha",  projectId: "p-datamesh", pcts: [0,  0,  20, 20, 30, 30] }, // intentional over-allocation W22+
    { personId: "p-sophia", projectId: "p-acme",     pcts: [70, 70, 70, 60, 50, 50] },
    { personId: "p-sophia", projectId: "p-jp-launch",pcts: [30, 30, 30, 40, 50, 50] },
    { personId: "p-sophia", projectId: "p-dpdp",     pcts: [0,  10, 10, 10, 10, 10] },
    { personId: "p-james",  projectId: "p-datamesh", pcts: [70, 70, 70, 70, 60, 60] },
    { personId: "p-james",  projectId: "p-jp-launch",pcts: [30, 30, 30, 30, 40, 40] },
    { personId: "p-leo",    projectId: "p-phoenix",  pcts: [40, 40, 30, 30, 30, 30] },
    { personId: "p-leo",    projectId: "p-infra-mr", pcts: [30, 30, 40, 40, 40, 40] },
    { personId: "p-leo",    projectId: "p-dpdp",     pcts: [30, 30, 30, 30, 30, 30] },
    { personId: "p-anil",   projectId: "p-dpdp",     pcts: [80, 80, 70, 70, 60, 60] },
    { personId: "p-meera",  projectId: "p-jp-launch",pcts: [50, 50, 50, 50, 50, 50] },
    { personId: "p-vikram", projectId: "p-phoenix",  pcts: [80, 80, 80, 80, 80, 80] },
    { personId: "p-vikram", projectId: "p-datamesh", pcts: [20, 20, 20, 20, 20, 20] },
    { personId: "p-aisha",  projectId: "p-acme",     pcts: [60, 60, 60, 60, 60, 60] },
    { personId: "p-aisha",  projectId: "p-jp-launch",pcts: [40, 40, 40, 40, 40, 40] },
    { personId: "p-noah",   projectId: "p-phoenix",  pcts: [70, 70, 70, 70, 70, 70] },
  ];
  const out: Allocation[] = [];
  for (const s of seed) {
    s.pcts.forEach((pct, i) => {
      if (pct === 0) return;
      const kind = i >= 4 ? "soft" : "hard"; // last two weeks are tentative
      out.push({
        id: `al-${s.personId}-${s.projectId}-${weeks[i]}`,
        personId: s.personId,
        projectId: s.projectId,
        weekISO: weeks[i],
        pct,
        kind,
      });
    });
  }
  return out;
}

export const ALLOCATIONS: Allocation[] = makeAllocations();

export function allocationWeeks(): string[] {
  return Array.from(new Set(ALLOCATIONS.map((a) => a.weekISO))).sort();
}

export function personAllocationByWeek(personId: string, weekISO: string): { total: number; rows: Allocation[] } {
  const rows = ALLOCATIONS.filter((a) => a.personId === personId && a.weekISO === weekISO);
  return { total: rows.reduce((s, a) => s + a.pct, 0), rows };
}

/* ── Time tracking ───────────────────────────────────────────── */

export type TimeEntryKind = "manual" | "timer" | "calendar" | "integration";

export interface TimeEntry {
  id: string;
  personId: string;
  projectId: string;
  workItemId?: string;
  dateISO: string;
  hours: number;
  kind: TimeEntryKind;
  billable: boolean;
  note?: string;
  status: "draft" | "submitted" | "approved" | "rejected";
}

export const TIME_ENTRIES: TimeEntry[] = [
  { id: "te-1",  personId: "p-priya",  projectId: "p-phoenix", workItemId: "w-px-s2", dateISO: "2026-05-11", hours: 6,  kind: "timer",       billable: false, note: "Webhook shim review + fixes", status: "submitted" },
  { id: "te-2",  personId: "p-priya",  projectId: "p-acme",    workItemId: "w-ac-s2", dateISO: "2026-05-11", hours: 2,  kind: "manual",      billable: true,  note: "Multi-sig flow walkthrough", status: "submitted" },
  { id: "te-3",  personId: "p-sneha",  projectId: "p-phoenix", workItemId: "w-px-bug1",dateISO: "2026-05-11", hours: 4,  kind: "timer",       billable: false, note: "JP timestamp bug RCA", status: "submitted" },
  { id: "te-4",  personId: "p-sneha",  projectId: "p-infra-mr",workItemId: "w-mr-s1", dateISO: "2026-05-11", hours: 4,  kind: "timer",       billable: false, note: "GSLB config dry-run", status: "submitted" },
  { id: "te-5",  personId: "p-sophia", projectId: "p-acme",    workItemId: "w-ac-s1", dateISO: "2026-05-11", hours: 7.5,kind: "timer",       billable: true,  note: "KYB UX iteration", status: "submitted" },
  { id: "te-6",  personId: "p-james",  projectId: "p-datamesh",workItemId: "w-dm-s1", dateISO: "2026-05-11", hours: 7.5,kind: "calendar",    billable: false, note: "Contract spec session", status: "submitted" },
  { id: "te-7",  personId: "p-rajiv",  projectId: "p-phoenix",                       dateISO: "2026-05-11", hours: 2,  kind: "calendar",    billable: false, note: "Steering committee", status: "submitted" },
  { id: "te-8",  personId: "p-rajiv",  projectId: "p-infra-mr",                      dateISO: "2026-05-11", hours: 4,  kind: "integration", billable: false, note: "PR reviews (auto-imported from GitHub)", status: "submitted" },
  { id: "te-9",  personId: "p-anil",   projectId: "p-dpdp",    workItemId: "w-dp-s1", dateISO: "2026-05-11", hours: 8,  kind: "manual",      billable: false, note: "Vendor DPA follow-ups", status: "submitted" },
  { id: "te-10", personId: "p-priya",  projectId: "p-phoenix", workItemId: "w-px-s2", dateISO: "2026-05-08", hours: 7,  kind: "timer",       billable: false, status: "approved" },
  { id: "te-11", personId: "p-leo",    projectId: "p-phoenix",                       dateISO: "2026-05-11", hours: 3,  kind: "manual",      billable: false, note: "Security review (signed off)", status: "submitted" },
  { id: "te-12", personId: "p-noah",   projectId: "p-phoenix",                       dateISO: "2026-05-11", hours: 7,  kind: "timer",       billable: false, status: "draft" },
];

/* ── Releases ────────────────────────────────────────────────── */

export type ReleaseCadence = "weekly" | "fortnightly" | "monthly" | "feature_driven";
export type ReleaseStatus = "planned" | "in_progress" | "shipped" | "rolled_back";

export const RELEASE_STATUS_TINT: Record<ReleaseStatus, string> = {
  planned:     "bg-secondary text-muted-foreground",
  in_progress: "bg-brand/10 text-brand",
  shipped:     "bg-success/10 text-success",
  rolled_back: "bg-destructive/10 text-destructive",
};

export interface Release {
  id: string;
  projectId: string;
  name: string;
  version: string;
  cadence: ReleaseCadence;
  shipDateISO: string;
  status: ReleaseStatus;
  /** Work item ids included in this release. */
  workItemIds: string[];
  /** Auto-drafted release notes (markdown-ish). */
  draftNotes: string;
}

export const RELEASES: Release[] = [
  {
    id: "rel-px-r12",
    projectId: "p-phoenix",
    name: "Phoenix R12 — UPI shim",
    version: "12.0.0",
    cadence: "fortnightly",
    shipDateISO: "2026-05-22",
    status: "in_progress",
    workItemIds: ["w-px-s2"],
    draftNotes:
      "## Phoenix R12 — UPI shim\n\n**What's new**\n- Webhook compatibility shim for UPI events now in production (parity with legacy gateway).\n- 24 webhook event types covered; ack-rate 100% in staging.\n\n**Known issues**\n- Settlement timestamp off-by-5h30m on JP-tagged merchants (Phoenix-bug-1, tracking).\n\n**Migration notes**\n- No customer changes required.",
  },
  {
    id: "rel-px-r13",
    projectId: "p-phoenix",
    name: "Phoenix R13 — Reconciliation parity",
    version: "13.0.0",
    cadence: "fortnightly",
    shipDateISO: "2026-06-05",
    status: "planned",
    workItemIds: ["w-px-s1"],
    draftNotes: "",
  },
  {
    id: "rel-ac-r4",
    projectId: "p-acme",
    name: "Acme R4 — Corporate accounts",
    version: "4.0.0",
    cadence: "feature_driven",
    shipDateISO: "2026-05-25",
    status: "in_progress",
    workItemIds: ["w-ac-s1", "w-ac-s2"],
    draftNotes:
      "## Acme R4 — Corporate accounts\n\n**What's new**\n- Corporate accounts KYB workflow.\n- Multi-signatory approval flow (2-of-N + escalation).\n\n**Customer impact**\n- Existing retail integrations unaffected.\n- New corporate API documented at /docs/v4/corporate.",
  },
  {
    id: "rel-dm-r2",
    projectId: "p-datamesh",
    name: "DataMesh R2 — Contracts v1",
    version: "2.0.0",
    cadence: "monthly",
    shipDateISO: "2026-06-01",
    status: "planned",
    workItemIds: ["w-dm-s1"],
    draftNotes: "",
  },
  {
    id: "rel-mr-r6",
    projectId: "p-infra-mr",
    name: "MR Failover R6 — GSLB",
    version: "6.0.0",
    cadence: "feature_driven",
    shipDateISO: "2026-05-20",
    status: "in_progress",
    workItemIds: ["w-mr-s1", "w-mr-s2"],
    draftNotes:
      "## MR Failover R6 — GSLB\n\n**What's new**\n- Anycast DNS + GSLB online for ap-south-1 + eu-central-1.\n- Cross-region Postgres replication enabled (read-only secondary).\n\n**Operational notes**\n- Game day #1 scheduled for 2026-06-12.",
  },
];

/* ── Documents & artifacts ───────────────────────────────────── */

export type DocumentKind =
  | "charter"
  | "brd"
  | "sow"
  | "design_doc"
  | "decision_log"
  | "meeting_notes"
  | "runbook"
  | "retro";

export const DOC_KIND_LABEL: Record<DocumentKind, string> = {
  charter: "Charter",
  brd: "BRD",
  sow: "SOW",
  design_doc: "Design doc",
  decision_log: "Decision log",
  meeting_notes: "Meeting notes",
  runbook: "Runbook",
  retro: "Retro",
};

export interface DeliveryDocument {
  id: string;
  projectId: string;
  title: string;
  kind: DocumentKind;
  authorId: string;
  updatedISO: string;
  /** External link or internal anchor. */
  link: string;
  source: "internal" | "notion" | "confluence" | "sharepoint";
}

export const DOCUMENTS: DeliveryDocument[] = [
  { id: "doc-1",  projectId: "p-phoenix", title: "Phoenix Migration — Charter v3",      kind: "charter",       authorId: "p-vikram", updatedISO: "2026-05-03", link: "#",                            source: "internal" },
  { id: "doc-2",  projectId: "p-phoenix", title: "UPI shim — design doc",                kind: "design_doc",    authorId: "p-priya",  updatedISO: "2026-04-22", link: "https://notion.so/upi-shim",   source: "notion" },
  { id: "doc-3",  projectId: "p-phoenix", title: "Steering committee · 2026-05-09",      kind: "meeting_notes", authorId: "p-vikram", updatedISO: "2026-05-09", link: "https://confluence.local/x", source: "confluence" },
  { id: "doc-4",  projectId: "p-phoenix", title: "Decision log",                          kind: "decision_log",  authorId: "p-vikram", updatedISO: "2026-05-09", link: "#",                            source: "internal" },
  { id: "doc-5",  projectId: "p-acme",    title: "Acme Bank — SOW v2",                    kind: "sow",           authorId: "p-aisha",  updatedISO: "2026-04-15", link: "https://sharepoint.local/sow",source: "sharepoint" },
  { id: "doc-6",  projectId: "p-acme",    title: "Acme Phase 2 — Charter",                kind: "charter",       authorId: "p-aisha",  updatedISO: "2026-03-04", link: "#",                            source: "internal" },
  { id: "doc-7",  projectId: "p-datamesh",title: "Data contracts framework",              kind: "design_doc",    authorId: "p-james",  updatedISO: "2026-05-06", link: "https://notion.so/dm-contracts",source: "notion" },
  { id: "doc-8",  projectId: "p-jp-launch",title: "JP Launch · BRD",                       kind: "brd",           authorId: "p-aisha",  updatedISO: "2026-04-28", link: "#",                            source: "internal" },
  { id: "doc-9",  projectId: "p-infra-mr",title: "MR Failover — Runbook",                  kind: "runbook",       authorId: "p-rajiv",  updatedISO: "2026-05-08", link: "https://confluence.local/rb",source: "confluence" },
  { id: "doc-10", projectId: "p-dpdp",    title: "DPDP — Retro (mid-program)",             kind: "retro",         authorId: "p-anil",   updatedISO: "2026-05-01", link: "#",                            source: "internal" },
];

/* ── Project templates ───────────────────────────────────────── */

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  methodology: Methodology;
  /** Lucide icon name. */
  iconName: string;
  tone: "brand" | "brand-purple" | "brand-teal" | "warning" | "success" | "destructive" | "gray";
  /** What kicks off when this template is used. */
  produces: {
    charterFields: string[];
    epics: string[];
    artifacts: DocumentKind[];
    sprints?: number;
  };
}

export const TEMPLATES: ProjectTemplate[] = [
  {
    id: "tpl-waterfall",
    name: "Waterfall Delivery",
    description: "Stage-gated delivery with explicit phases, sign-offs, and a single critical path. Good for compliance, infra, regulated rollouts.",
    methodology: "waterfall",
    iconName: "Construction",
    tone: "warning",
    produces: {
      charterFields: ["Goal", "Scope in/out", "Success metrics", "Sponsor", "Budget", "Phase gates"],
      epics: ["Discovery", "Design", "Build", "Test", "Launch", "Close"],
      artifacts: ["charter", "brd", "design_doc", "runbook", "retro"],
    },
  },
  {
    id: "tpl-agile-product",
    name: "Agile Product",
    description: "Scrum with 2-week sprints, sprint zero, definition of ready/done, and a discovery dual-track.",
    methodology: "scrum",
    iconName: "Sparkles",
    tone: "brand",
    produces: {
      charterFields: ["Goal", "Outcomes (OKRs)", "Personas", "Sponsor"],
      epics: ["Sprint 0", "Discovery", "MVP", "Iteration 1", "Iteration 2"],
      artifacts: ["charter", "design_doc", "decision_log", "retro"],
      sprints: 4,
    },
  },
  {
    id: "tpl-onboarding",
    name: "Customer Onboarding",
    description: "End-to-end customer onboarding playbook: kickoff, configuration, integration, training, go-live, hypercare.",
    methodology: "hybrid",
    iconName: "UserPlus",
    tone: "brand-teal",
    produces: {
      charterFields: ["Customer", "Use cases", "Stakeholders", "Go-live date", "Hypercare window"],
      epics: ["Kickoff", "Configuration", "Integration", "Training", "Go-live", "Hypercare"],
      artifacts: ["charter", "sow", "design_doc", "runbook", "retro"],
    },
  },
  {
    id: "tpl-marketing",
    name: "Marketing Campaign",
    description: "Multi-channel campaign template with creative, channels, measurement, and post-campaign analysis.",
    methodology: "kanban",
    iconName: "Megaphone",
    tone: "brand-purple",
    produces: {
      charterFields: ["Campaign goal", "Channels", "Audience", "Budget", "KPIs"],
      epics: ["Creative", "Channels", "Launch", "Measure", "Post-mortem"],
      artifacts: ["charter", "meeting_notes", "retro"],
    },
  },
  {
    id: "tpl-mna",
    name: "M&A Integration",
    description: "Day 1 / 100 / 365 integration playbook covering people, systems, processes, customer, regulatory.",
    methodology: "waterfall",
    iconName: "Shuffle",
    tone: "destructive",
    produces: {
      charterFields: ["Acquired entity", "Day 1 must-have list", "100-day plan", "365-day plan", "Integration sponsor"],
      epics: ["People", "Systems", "Processes", "Customer", "Regulatory", "Communications"],
      artifacts: ["charter", "brd", "design_doc", "runbook", "decision_log", "retro"],
    },
  },
  {
    id: "tpl-compliance",
    name: "Compliance Program",
    description: "Regulator-facing programs (SOC 2 / DPDP / GDPR). Evidence-driven, audit-ready.",
    methodology: "waterfall",
    iconName: "ShieldCheck",
    tone: "destructive",
    produces: {
      charterFields: ["Regulation", "Scope", "Audit window", "Sponsor", "Evidence custodians"],
      epics: ["Scoping", "Controls design", "Evidence", "Internal audit", "External audit"],
      artifacts: ["charter", "design_doc", "decision_log", "runbook", "retro"],
    },
  },
];

/* ── Helpers ─────────────────────────────────────────────────── */

export function projectsForProgram(programId: string): Project[] {
  return PROJECTS.filter((p) => p.programId === programId);
}

export function programsForPortfolio(portfolioId: string): Program[] {
  return PROGRAMS.filter((p) => p.portfolioId === portfolioId);
}

export function rollupProgramRag(programId: string): RagStatus {
  const projects = projectsForProgram(programId);
  if (projects.some((p) => p.rag === "red")) return "red";
  if (projects.some((p) => p.rag === "amber")) return "amber";
  return "green";
}

export function rollupPortfolioRag(portfolioId: string): RagStatus {
  const programs = programsForPortfolio(portfolioId);
  if (programs.some((p) => p.rag === "red")) return "red";
  if (programs.some((p) => p.rag === "amber")) return "amber";
  return "green";
}

export function totalsForPortfolio(portfolioId: string) {
  const programs = programsForPortfolio(portfolioId);
  const projects = programs.flatMap((p) => projectsForProgram(p.id));
  const budget = projects.reduce((s, p) => s + p.totalBudgetINR, 0);
  const spent = projects.reduce((s, p) => s + p.spentINR, 0);
  return { projectCount: projects.length, programCount: programs.length, budget, spent };
}

/** Aggregate week capacity, returning over-allocated rows. */
export function workloadHeatmap() {
  const weeks = allocationWeeks();
  return PEOPLE.map((person) => {
    const weeksData = weeks.map((w) => {
      const { total, rows } = personAllocationByWeek(person.id, w);
      return { weekISO: w, total, rows };
    });
    return { person, weeks: weeksData };
  });
}
