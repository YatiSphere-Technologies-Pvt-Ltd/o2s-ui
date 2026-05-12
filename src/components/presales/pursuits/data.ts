/* ================================================================
   Pre-Sales — Pursuit lifecycle (canonical 11 stages)
   ----------------------------------------------------------------
   Every pursuit moves through stages 0–10. Stage configuration
   (default tasks / deliverables / RACI / required gates) is canonical
   but tunable per pursuit type:
     RFP / RFQ / RFI / sole_source / partner_led / strategic / must_win

   This dataset powers:
     • /presales/pursuits          (list, KPIs, filters)
     • /presales/pursuits/[id]     (stage rail, tasks, deliverables,
                                    RACI, gates, debrief)
   ================================================================ */

/* ───────────────────────── Stage model ───────────────────────── */

export type StageKey =
  | "trigger"
  | "qualify"
  | "capture"
  | "solution"
  | "content"
  | "price"
  | "review"
  | "produce"
  | "post_submit"
  | "decision"
  | "knowledge";

export const STAGE_INDEX: Record<StageKey, number> = {
  trigger:     0,
  qualify:     1,
  capture:     2,
  solution:    3,
  content:     4,
  price:       5,
  review:      6,
  produce:     7,
  post_submit: 8,
  decision:    9,
  knowledge:   10,
};

export interface StageDef {
  key: StageKey;
  number: number;
  label: string;
  owner: string;
  goal: string;
  exitCriteria: string;
  defaultTasks: string[];
  defaultDeliverables: string[];
  defaultGate: GateDef | null;
}

export interface GateDef {
  /** Short label for the approval gate. */
  label: string;
  /** Default approver role label. */
  approverRole: string;
  /** Whether this gate is required to exit the stage (vs advisory). */
  required: boolean;
}

export const STAGES: StageDef[] = [
  {
    key: "trigger",
    number: 0,
    label: "Trigger",
    owner: "Sales / Account Mgmt / Partner",
    goal: "Capture the inbound RFP/RFI/RFQ or outbound lead.",
    exitCriteria: "Pursuit record created with intake details.",
    defaultTasks: [
      "Log pursuit source, customer, channel",
      "Attach RFP/intent documents (if any)",
      "Identify Capture Manager + Pre-Sales Lead",
    ],
    defaultDeliverables: ["Pursuit record", "Intake summary"],
    defaultGate: null,
  },
  {
    key: "qualify",
    number: 1,
    label: "Qualify (Go/No-Go)",
    owner: "Capture Manager + Pre-Sales Lead",
    goal: "Bid / no-bid decision.",
    exitCriteria: "Bid decision logged with rationale.",
    defaultTasks: [
      "Run Bid/No-Bid Agent",
      "Score fit / win-prob against analogues",
      "Estimate Cost of Pursuit",
      "Log decision + rationale",
    ],
    defaultDeliverables: ["Bid/No-Bid memo"],
    defaultGate: { label: "Bid decision sign-off", approverRole: "Pre-Sales Director", required: true },
  },
  {
    key: "capture",
    number: 2,
    label: "Capture & Plan",
    owner: "Capture Manager",
    goal: "Win strategy, capture team, schedule.",
    exitCriteria: "Capture plan approved; team confirmed.",
    defaultTasks: [
      "Draft capture plan (Capture Co-Pilot)",
      "Confirm capture team + RACI",
      "Schedule color reviews + milestones",
      "Lock win themes",
    ],
    defaultDeliverables: ["Capture plan", "Pursuit schedule", "Win themes"],
    defaultGate: { label: "Capture plan approval", approverRole: "Pre-Sales Lead", required: true },
  },
  {
    key: "solution",
    number: 3,
    label: "Solution Develop",
    owner: "Solution Architect + SMEs",
    goal: "Technical/service solution that answers the requirement.",
    exitCriteria: "Solution document baseline established.",
    defaultTasks: [
      "Architecture decisions",
      "Solution storyline aligned to win themes",
      "Risk register seeded by Risk Identifier",
      "SME sign-off on solution baseline",
    ],
    defaultDeliverables: ["Solution document v1", "Risk register"],
    defaultGate: { label: "Solution baseline", approverRole: "Solution Architect", required: true },
  },
  {
    key: "content",
    number: 4,
    label: "Content Develop",
    owner: "Proposal Manager",
    goal: "Draft all required sections.",
    exitCriteria: "Pink team review passed.",
    defaultTasks: [
      "Assign sections to authors",
      "First-Draft Author seeds sections",
      "Compliance Sentinel runs continuously",
      "Pink team review with Red-Team Agent",
    ],
    defaultDeliverables: ["Proposal draft (pink-ready)", "Compliance matrix at ≥ 95%"],
    defaultGate: { label: "Pink team pass", approverRole: "Proposal Manager", required: true },
  },
  {
    key: "price",
    number: 5,
    label: "Price & Commercial",
    owner: "Pricing + Commercial",
    goal: "Cost build-up, pricing strategy, T&Cs.",
    exitCriteria: "Pricing approved per DOA.",
    defaultTasks: [
      "Cost build-up + rate cards",
      "Pricing Co-Pilot win-prob curve",
      "Commercial T&Cs vs playbook",
      "DOA approvals collected",
    ],
    defaultDeliverables: ["Pricing workbook", "Commercial T&Cs", "DOA approvals"],
    defaultGate: { label: "Pricing & commercial approval", approverRole: "Commercial Director", required: true },
  },
  {
    key: "review",
    number: 6,
    label: "Review",
    owner: "Color teams",
    goal: "Red / Gold reviews against win themes and compliance.",
    exitCriteria: "Gold team approved.",
    defaultTasks: [
      "Red team review (Red-Team Agent)",
      "Address must-fixes",
      "Gold team review",
      "Capture sponsor sign-off",
    ],
    defaultDeliverables: ["Red review findings", "Gold review pack", "Final draft"],
    defaultGate: { label: "Gold review pass", approverRole: "Capture Sponsor", required: true },
  },
  {
    key: "produce",
    number: 7,
    label: "Produce & Submit",
    owner: "Proposal Manager",
    goal: "Package, validate, submit.",
    exitCriteria: "Submission acknowledged.",
    defaultTasks: [
      "Run Submission Validator (page/format/forms)",
      "Compile final package",
      "Submit via portal / courier",
      "Capture acknowledgement",
    ],
    defaultDeliverables: ["Final submission package", "Submission acknowledgement"],
    defaultGate: { label: "Submission gate", approverRole: "Proposal Manager", required: true },
  },
  {
    key: "post_submit",
    number: 8,
    label: "Post-Submit / Evaluation",
    owner: "Capture Manager",
    goal: "Q&A, orals, BAFO, clarifications.",
    exitCriteria: "Decision received.",
    defaultTasks: [
      "Evaluator Q&A response (Question Tracker)",
      "Orals prep (Orals Prep Agent) if shortlisted",
      "BAFO response (if requested)",
      "Maintain readiness through silence periods",
    ],
    defaultDeliverables: ["Q&A log", "Orals pack (if applicable)", "BAFO response (if applicable)"],
    defaultGate: null,
  },
  {
    key: "decision",
    number: 9,
    label: "Award / Loss / Withdraw",
    owner: "Sales + Pre-Sales",
    goal: "Handoff to delivery or debrief loss.",
    exitCriteria: "Debrief complete; lessons captured.",
    defaultTasks: [
      "Customer decision logged",
      "Win/Loss Synthesizer runs debrief",
      "If won: delivery handover packet",
      "If lost / withdrawn: debrief packet",
    ],
    defaultDeliverables: ["Win/Loss debrief", "Delivery handover (if won)"],
    defaultGate: { label: "Debrief sign-off", approverRole: "Pre-Sales Lead", required: true },
  },
  {
    key: "knowledge",
    number: 10,
    label: "Knowledge Reuse",
    owner: "Knowledge Owner",
    goal: "Tag, archive, index content for reuse.",
    exitCriteria: "Content indexed in library.",
    defaultTasks: [
      "Knowledge Curator tags reusable content",
      "Archive working files",
      "Update library freshness register",
    ],
    defaultDeliverables: ["Library entries", "Archived pursuit folder"],
    defaultGate: null,
  },
];

export function stageByKey(key: StageKey): StageDef {
  return STAGES.find((s) => s.key === key)!;
}

export function stageByNumber(n: number): StageDef | undefined {
  return STAGES.find((s) => s.number === n);
}

/* ───────────────────────── Pursuit types ───────────────────────── */

export type PursuitType =
  | "rfp"
  | "rfq"
  | "rfi"
  | "sole_source"
  | "partner_led"
  | "strategic"
  | "must_win";

export const PURSUIT_TYPE_LABEL: Record<PursuitType, string> = {
  rfp:          "RFP",
  rfq:          "RFQ",
  rfi:          "RFI",
  sole_source:  "Sole-source",
  partner_led:  "Partner-led",
  strategic:    "Strategic",
  must_win:     "Must-win",
};

export const PURSUIT_TYPE_TINT: Record<PursuitType, string> = {
  rfp:          "bg-brand/10 text-brand",
  rfq:          "bg-brand-teal/10 text-brand-teal",
  rfi:          "bg-secondary text-muted-foreground",
  sole_source:  "bg-brand-purple/10 text-brand-purple",
  partner_led:  "bg-warning/10 text-warning",
  strategic:    "bg-brand-purple/10 text-brand-purple",
  must_win:     "bg-destructive/10 text-destructive",
};

/** Per-type tuning of the canonical flow. */
export interface PursuitTypeRules {
  /** Stages skipped for this type (RFI typically skips Price). */
  skippedStages: StageKey[];
  /** Extra approval gates this type requires. Keyed by stage. */
  extraGates: { stage: StageKey; gate: GateDef }[];
  /** Default RACI overrides on top of the stage's default RACI. */
  raciOverrides?: { stage: StageKey; role: keyof RaciSlots; person: string }[];
  /** Notes shown on the pursuit detail. */
  note: string;
}

export const PURSUIT_TYPE_RULES: Record<PursuitType, PursuitTypeRules> = {
  rfp: {
    skippedStages: [],
    extraGates: [],
    note: "Standard RFP flow — all 11 stages, all default gates.",
  },
  rfq: {
    skippedStages: [],
    extraGates: [
      { stage: "price", gate: { label: "Commercial Director double-sign", approverRole: "Commercial Director", required: true } },
    ],
    note: "Quote-led — Pricing & Commercial gate is double-signed; lighter solution dev.",
  },
  rfi: {
    skippedStages: ["price"],
    extraGates: [],
    note: "Information-only — Price & Commercial stage is skipped.",
  },
  sole_source: {
    skippedStages: [],
    extraGates: [
      { stage: "qualify", gate: { label: "Conflict-of-interest check", approverRole: "Legal", required: true } },
    ],
    note: "Sole-source — competitor intel skipped; CoI check required at qualification.",
  },
  partner_led: {
    skippedStages: [],
    extraGates: [
      { stage: "capture", gate: { label: "Partner agreement check", approverRole: "Alliance Lead", required: true } },
    ],
    note: "Partner-led — Alliance Lead signs off the capture stage.",
  },
  strategic: {
    skippedStages: [],
    extraGates: [
      { stage: "qualify", gate: { label: "Exec Sponsor named", approverRole: "Exec Sponsor", required: true } },
    ],
    raciOverrides: [
      { stage: "review", role: "informed", person: "CEO" },
    ],
    note: "Strategic — exec sponsor named at qualification; CEO informed at color reviews.",
  },
  must_win: {
    skippedStages: [],
    extraGates: [
      { stage: "qualify", gate: { label: "Exec Sponsor + CEO + GC sign-off", approverRole: "CEO + GC", required: true } },
      { stage: "price",   gate: { label: "Margin variance approval (CFO)",   approverRole: "CFO", required: true } },
      { stage: "review",  gate: { label: "CEO chairs Gold review",            approverRole: "CEO", required: true } },
    ],
    raciOverrides: [
      { stage: "qualify", role: "accountable", person: "CEO" },
      { stage: "review",  role: "accountable", person: "CEO" },
    ],
    note: "Must-win — CEO accountable at qualify and review; CFO signs margin variances.",
  },
};

/* ───────────────────────── RACI + tasks + gates ───────────────────────── */

export interface RaciSlots {
  responsible: string;     // who does the work
  accountable: string;     // single accountable owner
  consulted: string[];
  informed: string[];
}

export interface PursuitTask {
  id: string;
  stage: StageKey;
  label: string;
  owner: string;
  dueISO?: string;
  status: "not_started" | "in_progress" | "blocked" | "done" | "skipped";
  /** Optional link back to a deliverable id. */
  deliverableId?: string;
  /** Optional link to an agent that drives this task. */
  agentId?: string;
}

export interface PursuitDeliverable {
  id: string;
  stage: StageKey;
  label: string;
  status: "missing" | "draft" | "in_review" | "approved";
  owner: string;
  /** A short text snippet of "what we have" — populated by agents typically. */
  snippet?: string;
  lastUpdatedISO?: string;
}

export interface PursuitGate {
  id: string;
  stage: StageKey;
  label: string;
  approverRole: string;
  approverName?: string;
  required: boolean;
  status: "pending" | "approved" | "rejected" | "waived";
  decidedISO?: string;
  comment?: string;
}

export interface PursuitAuditEntry {
  id: string;
  whenISO: string;
  whenLabel: string;
  actor: string;
  action: string;
  detail: string;
}

/* ───────────────────────── Pursuit record ───────────────────────── */

export interface PursuitRecord {
  id: string;
  name: string;
  customer: string;
  customerCountry: string;
  industry: string;
  type: PursuitType;
  source: "inbound_rfp" | "outbound" | "partner" | "referral" | "incumbent_extension";
  currentStage: StageKey;
  /** Cost of pursuit incurred so far in INR. */
  copInr: number;
  /** Estimated total contract value in INR. */
  tcvInr: number;
  /** Win-prob 0–1 (from Bid/No-Bid agent or PM judgment). */
  winProb: number;
  captureManager: string;
  preSalesLead: string;
  solutionArchitect?: string;
  proposalManager?: string;
  pricingLead?: string;
  execSponsor?: string;
  rfpReleasedISO?: string;
  submitDeadlineISO?: string;
  expectedDecisionISO?: string;
  /** Final outcome — only set when stage = decision or later. */
  outcome?: "won" | "lost" | "withdrawn" | "no_decision_yet";
  outcomeReason?: string;
  raciByStage: Partial<Record<StageKey, RaciSlots>>;
  tasks: PursuitTask[];
  deliverables: PursuitDeliverable[];
  gates: PursuitGate[];
  audit: PursuitAuditEntry[];
  tags: string[];
  /** Optional "must-win" badge override; convenience for the list page. */
  isMustWin?: boolean;
}

/* ───────────────────────── Helpers used during seeding ───────────────────────── */

function tasksFor(stage: StageKey, prefix: string, owner: string, statuses: PursuitTask["status"][]): PursuitTask[] {
  const def = stageByKey(stage);
  return def.defaultTasks.map((label, i) => ({
    id: `${prefix}-${stage}-t${i + 1}`,
    stage,
    label,
    owner,
    status: statuses[i] ?? "not_started",
  }));
}

function deliverableFor(stage: StageKey, prefix: string, idx: number, label: string, owner: string, status: PursuitDeliverable["status"], snippet?: string): PursuitDeliverable {
  return {
    id: `${prefix}-${stage}-d${idx}`,
    stage,
    label,
    status,
    owner,
    snippet,
    lastUpdatedISO: "2026-05-12",
  };
}

function gateFor(stage: StageKey, prefix: string, status: PursuitGate["status"], approverName?: string, comment?: string): PursuitGate | null {
  const def = stageByKey(stage).defaultGate;
  if (!def) return null;
  return {
    id: `${prefix}-${stage}-g`,
    stage,
    label: def.label,
    approverRole: def.approverRole,
    required: def.required,
    status,
    approverName,
    comment,
    decidedISO: status === "approved" || status === "rejected" ? "2026-05-10" : undefined,
  };
}

function audit(prefix: string, idx: number, action: string, detail: string, daysAgo: number, actor = "Anita Verma"): PursuitAuditEntry {
  const d = new Date(`2026-05-12T11:00:00`);
  d.setDate(d.getDate() - daysAgo);
  return {
    id: `${prefix}-a${idx}`,
    whenISO: d.toISOString(),
    whenLabel: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    actor,
    action,
    detail,
  };
}

/* ───────────────────────── Seeded pursuits ─────────────────────────
   12 pursuits spread across every stage 0–10.
   The richest pursuits (Bank of Baroda, Mahindra) get a full task /
   deliverable / gate / RACI / audit treatment. Earlier-stage and
   closed-stage pursuits get representative but lighter detail.
   ──────────────────────────────────────────────────────────────── */

export const PURSUITS: PursuitRecord[] = [
  /* === Stage 0: Trigger === */
  {
    id: "PRS-AVIVA-002",
    name: "Aviva — Renewals Modernization (RFI)",
    customer: "Aviva Insurance",
    customerCountry: "UK",
    industry: "Insurance",
    type: "rfi",
    source: "inbound_rfp",
    currentStage: "trigger",
    copInr: 35_000,
    tcvInr: 32_000_000,
    winProb: 0.18,
    captureManager: "Sarah Whitley",
    preSalesLead: "Aanya Iyer",
    rfpReleasedISO: "2026-05-11",
    submitDeadlineISO: "2026-05-30",
    expectedDecisionISO: "2026-07-15",
    outcome: "no_decision_yet",
    raciByStage: {
      trigger: { responsible: "Sarah Whitley", accountable: "Aanya Iyer", consulted: ["Liam Chen"], informed: ["CFO"] },
    },
    tasks: tasksFor("trigger", "PRS-AVIVA-002", "Sarah Whitley", ["done", "in_progress", "not_started"]),
    deliverables: [
      deliverableFor("trigger", "PRS-AVIVA-002", 1, "Pursuit record", "Sarah Whitley", "approved", "Created from inbound RFI on 2026-05-11."),
      deliverableFor("trigger", "PRS-AVIVA-002", 2, "Intake summary", "Sarah Whitley", "draft"),
    ],
    gates: [],
    audit: [
      audit("PRS-AVIVA-002", 1, "pursuit_created", "Pursuit opened from Aviva RFI inbound", 1, "Sarah Whitley"),
    ],
    tags: ["uk", "insurance", "rfi"],
  },

  /* === Stage 1: Qualify === */
  {
    id: "PRS-MM-001",
    name: "Mahindra — Group Cloud Migration (RFP)",
    customer: "Mahindra & Mahindra",
    customerCountry: "India",
    industry: "Automotive",
    type: "rfp",
    source: "inbound_rfp",
    currentStage: "qualify",
    copInr: 380_000,
    tcvInr: 44_000_000,
    winProb: 0.41,
    captureManager: "Anita Verma",
    preSalesLead: "Rajesh Kumar",
    rfpReleasedISO: "2026-05-04",
    submitDeadlineISO: "2026-05-28",
    expectedDecisionISO: "2026-07-05",
    outcome: "no_decision_yet",
    raciByStage: {
      qualify: { responsible: "Anita Verma", accountable: "Rajesh Kumar", consulted: ["CFO", "VP Delivery"], informed: ["CEO"] },
      capture: { responsible: "Anita Verma", accountable: "Rajesh Kumar", consulted: ["Solution Architect"], informed: ["CFO"] },
    },
    tasks: [
      ...tasksFor("trigger", "PRS-MM-001", "Anita Verma", ["done", "done", "done"]),
      ...tasksFor("qualify", "PRS-MM-001", "Anita Verma", ["done", "done", "in_progress", "not_started"]),
    ],
    deliverables: [
      deliverableFor("trigger", "PRS-MM-001", 1, "Pursuit record", "Anita Verma", "approved"),
      deliverableFor("trigger", "PRS-MM-001", 2, "Intake summary", "Anita Verma", "approved", "247 shall-statements decomposed; 3 mandatory forms."),
      deliverableFor("qualify", "PRS-MM-001", 1, "Bid/No-Bid memo", "Anita Verma", "draft", "Recommendation: BID (fit 78%, win-prob 41%, 3 strong analogues)."),
    ],
    gates: [
      gateFor("qualify", "PRS-MM-001", "pending", "Pre-Sales Director")!,
    ],
    audit: [
      audit("PRS-MM-001", 1, "pursuit_created", "RFP intake from Mahindra Group IT", 8),
      audit("PRS-MM-001", 2, "stage_advance", "Trigger → Qualify", 7),
      audit("PRS-MM-001", 3, "bid_score",       "Bid/No-Bid Agent recommended BID with rationale", 6),
    ],
    tags: ["india", "automotive", "cloud", "must-win-candidate"],
  },

  /* === Stage 2: Capture & Plan === */
  {
    id: "PRS-MAERSK-001",
    name: "Maersk — Predictive Ops Phase 2 (Strategic)",
    customer: "Maersk",
    customerCountry: "Denmark",
    industry: "Logistics",
    type: "strategic",
    source: "incumbent_extension",
    currentStage: "capture",
    copInr: 620_000,
    tcvInr: 28_000_000,
    winProb: 0.62,
    captureManager: "Sarah Whitley",
    preSalesLead: "Liam Chen",
    solutionArchitect: "Karthik Subramanian",
    proposalManager: "Anita Verma",
    execSponsor: "Vikram Nair",
    submitDeadlineISO: "2026-06-12",
    expectedDecisionISO: "2026-07-25",
    outcome: "no_decision_yet",
    raciByStage: {
      qualify: { responsible: "Sarah Whitley", accountable: "Liam Chen", consulted: ["Vikram Nair"], informed: ["CFO"] },
      capture: { responsible: "Sarah Whitley", accountable: "Liam Chen", consulted: ["Karthik Subramanian", "Vikram Nair"], informed: ["CEO"] },
    },
    tasks: [
      ...tasksFor("trigger", "PRS-MAERSK-001", "Sarah Whitley", ["done", "done", "done"]),
      ...tasksFor("qualify", "PRS-MAERSK-001", "Sarah Whitley", ["done", "done", "done", "done"]),
      ...tasksFor("capture", "PRS-MAERSK-001", "Sarah Whitley", ["done", "in_progress", "in_progress", "not_started"]),
    ],
    deliverables: [
      deliverableFor("qualify", "PRS-MAERSK-001", 1, "Bid/No-Bid memo", "Sarah Whitley", "approved", "Recommendation: BID — strong incumbent advantage, 62% win-prob."),
      deliverableFor("capture", "PRS-MAERSK-001", 1, "Capture plan v1", "Sarah Whitley", "in_review", "7 win themes locked; 4 ghosting moves identified."),
      deliverableFor("capture", "PRS-MAERSK-001", 2, "Pursuit schedule", "Sarah Whitley", "draft"),
    ],
    gates: [
      gateFor("qualify", "PRS-MAERSK-001", "approved", "Vikram Nair", "Approved 12 May — strong analogue, incumbent route.")!,
      gateFor("capture", "PRS-MAERSK-001", "pending", "Liam Chen")!,
      // Strategic-type extra gate
      { id: "PRS-MAERSK-001-qualify-g-strategic", stage: "qualify", label: "Exec Sponsor named", approverRole: "Exec Sponsor", required: true, status: "approved", approverName: "Vikram Nair", decidedISO: "2026-05-10" },
    ],
    audit: [
      audit("PRS-MAERSK-001", 1, "pursuit_created", "Incumbent extension opportunity logged", 21, "Sarah Whitley"),
      audit("PRS-MAERSK-001", 2, "stage_advance",   "Qualify gate approved by Vikram Nair", 2),
      audit("PRS-MAERSK-001", 3, "stage_advance",   "Capture stage opened", 2),
    ],
    tags: ["denmark", "logistics", "strategic", "incumbent"],
  },

  /* === Stage 3: Solution Develop === */
  {
    id: "PRS-BOB-001",
    name: "Bank of Baroda — Fraud Analytics (Must-Win RFP)",
    customer: "Bank of Baroda",
    customerCountry: "India",
    industry: "Banking",
    type: "must_win",
    source: "inbound_rfp",
    currentStage: "solution",
    copInr: 1_240_000,
    tcvInr: 58_000_000,
    winProb: 0.36,
    captureManager: "Rajesh Kumar",
    preSalesLead: "Aanya Iyer",
    solutionArchitect: "Karthik Subramanian",
    proposalManager: "Sandeep Mehta",
    execSponsor: "Prashant Singh",
    isMustWin: true,
    rfpReleasedISO: "2026-05-11",
    submitDeadlineISO: "2026-05-21",
    expectedDecisionISO: "2026-06-05",
    outcome: "no_decision_yet",
    raciByStage: {
      qualify:  { responsible: "Rajesh Kumar",        accountable: "Prashant Singh", consulted: ["Vikram Nair (GC)", "Meera Pillai (CFO)"], informed: ["Board"] },
      capture:  { responsible: "Rajesh Kumar",        accountable: "Aanya Iyer",     consulted: ["Karthik Subramanian"],                    informed: ["Prashant Singh"] },
      solution: { responsible: "Karthik Subramanian", accountable: "Aanya Iyer",     consulted: ["S. Hegde (SME)"],                          informed: ["Prashant Singh"] },
      content:  { responsible: "Sandeep Mehta",       accountable: "Aanya Iyer",     consulted: ["Karthik Subramanian"],                    informed: ["Prashant Singh"] },
      review:   { responsible: "Aanya Iyer",          accountable: "Prashant Singh", consulted: ["Vikram Nair (GC)"],                       informed: ["Board"] },
    },
    tasks: [
      ...tasksFor("trigger",  "PRS-BOB-001", "Rajesh Kumar",        ["done", "done", "done"]),
      ...tasksFor("qualify",  "PRS-BOB-001", "Rajesh Kumar",        ["done", "done", "done", "done"]),
      ...tasksFor("capture",  "PRS-BOB-001", "Rajesh Kumar",        ["done", "done", "done", "done"]),
      ...tasksFor("solution", "PRS-BOB-001", "Karthik Subramanian", ["done", "in_progress", "in_progress", "not_started"]),
    ],
    deliverables: [
      deliverableFor("trigger",  "PRS-BOB-001", 1, "Intake summary",          "Rajesh Kumar",        "approved", "247 shall-statements, 3 mandatory forms, submit 21 May 17:00 IST."),
      deliverableFor("qualify",  "PRS-BOB-001", 1, "Bid/No-Bid memo",          "Rajesh Kumar",        "approved", "BID — must-win deal. CEO + GC + CFO signed."),
      deliverableFor("capture",  "PRS-BOB-001", 1, "Capture plan",             "Rajesh Kumar",        "approved", "7 win themes; named team includes Karthik."),
      deliverableFor("solution", "PRS-BOB-001", 1, "Solution document v1",     "Karthik Subramanian", "draft",     "Architecture sketch: 3-tier; SHAP explainability; Kafka feeds."),
      deliverableFor("solution", "PRS-BOB-001", 2, "Risk register",            "Risk Identifier",     "in_review", "12 risks seeded; 2 red (data residency, model drift)."),
    ],
    gates: [
      gateFor("qualify", "PRS-BOB-001", "approved", "Prashant Singh", "Approved — must-win. CEO sponsor, GC + CFO sign-offs collected.")!,
      gateFor("capture", "PRS-BOB-001", "approved", "Aanya Iyer", "Capture plan locked. Win themes signed-off.")!,
      gateFor("solution","PRS-BOB-001", "pending",  "Karthik Subramanian")!,
      // Must-win extra gates
      { id: "PRS-BOB-001-qualify-g-must",   stage: "qualify", label: "Exec Sponsor + CEO + GC sign-off", approverRole: "CEO + GC",  required: true,  status: "approved", approverName: "Prashant Singh", decidedISO: "2026-05-04" },
    ],
    audit: [
      audit("PRS-BOB-001", 1, "pursuit_created",   "RFP intake via BoB e-procurement", 8, "Rajesh Kumar"),
      audit("PRS-BOB-001", 2, "agent_decision",   "RFP Decomposer extracted 247 reqs in 11 min", 8, "RFP Decomposer (agent)"),
      audit("PRS-BOB-001", 3, "gate_approved",    "Qualify gate approved by Prashant Singh", 8),
      audit("PRS-BOB-001", 4, "stage_advance",    "Trigger → Qualify → Capture", 7),
      audit("PRS-BOB-001", 5, "gate_approved",    "Capture plan approved by Aanya Iyer", 4),
      audit("PRS-BOB-001", 6, "stage_advance",    "Capture → Solution Develop", 3),
      audit("PRS-BOB-001", 7, "agent_decision",   "Risk Identifier seeded 12 risks (2 red)", 1, "Risk Identifier (agent)"),
    ],
    tags: ["india", "banking", "must-win", "fraud-analytics"],
  },

  /* === Stage 4: Content Develop === */
  {
    id: "PRS-DBS-003",
    name: "DBS — Onboarding Modernization (RFP)",
    customer: "DBS Bank",
    customerCountry: "Singapore",
    industry: "Banking",
    type: "rfp",
    source: "outbound",
    currentStage: "content",
    copInr: 580_000,
    tcvInr: 22_000_000,
    winProb: 0.48,
    captureManager: "Liam Chen",
    preSalesLead: "Rajesh Kumar",
    solutionArchitect: "Karthik Subramanian",
    proposalManager: "Sandeep Mehta",
    submitDeadlineISO: "2026-06-02",
    expectedDecisionISO: "2026-07-18",
    outcome: "no_decision_yet",
    raciByStage: {
      content: { responsible: "Sandeep Mehta", accountable: "Rajesh Kumar", consulted: ["Karthik Subramanian"], informed: [] },
    },
    tasks: [
      ...tasksFor("trigger",  "PRS-DBS-003", "Liam Chen",        ["done", "done", "done"]),
      ...tasksFor("qualify",  "PRS-DBS-003", "Liam Chen",        ["done", "done", "done", "done"]),
      ...tasksFor("capture",  "PRS-DBS-003", "Liam Chen",        ["done", "done", "done", "done"]),
      ...tasksFor("solution", "PRS-DBS-003", "Karthik Subramanian", ["done", "done", "done", "done"]),
      ...tasksFor("content",  "PRS-DBS-003", "Sandeep Mehta",    ["done", "in_progress", "in_progress", "not_started"]),
    ],
    deliverables: [
      deliverableFor("solution", "PRS-DBS-003", 1, "Solution document v1", "Karthik Subramanian", "approved"),
      deliverableFor("content",  "PRS-DBS-003", 1, "Proposal draft (pink-ready)", "Sandeep Mehta", "in_review", "Compliance Sentinel: 92% covered (203 / 220 reqs)."),
      deliverableFor("content",  "PRS-DBS-003", 2, "Compliance matrix",        "Compliance Builder", "in_review"),
    ],
    gates: [
      gateFor("qualify", "PRS-DBS-003", "approved", "Vikram Nair")!,
      gateFor("capture", "PRS-DBS-003", "approved", "Rajesh Kumar")!,
      gateFor("solution","PRS-DBS-003", "approved", "Karthik Subramanian")!,
      gateFor("content", "PRS-DBS-003", "pending",  "Sandeep Mehta")!,
    ],
    audit: [
      audit("PRS-DBS-003", 1, "pursuit_created", "Outbound — DBS onboarding initiative", 24, "Liam Chen"),
      audit("PRS-DBS-003", 2, "stage_advance",   "Solution baseline approved → Content Develop", 5),
    ],
    tags: ["singapore", "banking", "onboarding"],
  },

  /* === Stage 5: Price & Commercial === */
  {
    id: "PRS-KOTAK-004",
    name: "Kotak — Credit Risk Phase 3 (RFP)",
    customer: "Kotak Mahindra Bank",
    customerCountry: "India",
    industry: "Banking",
    type: "rfp",
    source: "incumbent_extension",
    currentStage: "price",
    copInr: 420_000,
    tcvInr: 18_500_000,
    winProb: 0.71,
    captureManager: "Anita Verma",
    preSalesLead: "Priya Reddy",
    solutionArchitect: "Karthik Subramanian",
    proposalManager: "Sandeep Mehta",
    pricingLead: "Meera Pillai",
    submitDeadlineISO: "2026-05-25",
    expectedDecisionISO: "2026-06-15",
    outcome: "no_decision_yet",
    raciByStage: {
      price: { responsible: "Meera Pillai", accountable: "Priya Reddy", consulted: ["Anita Verma"], informed: ["CFO"] },
    },
    tasks: [
      ...tasksFor("price", "PRS-KOTAK-004", "Meera Pillai", ["done", "done", "in_progress", "in_progress"]),
    ],
    deliverables: [
      deliverableFor("content", "PRS-KOTAK-004", 1, "Proposal draft (pink-passed)", "Sandeep Mehta", "approved"),
      deliverableFor("price",   "PRS-KOTAK-004", 1, "Pricing workbook",              "Meera Pillai", "draft",     "₹4.2 Cr base case at 26.4% margin; competitor hypothesis TCS ₹3.8 Cr."),
      deliverableFor("price",   "PRS-KOTAK-004", 2, "Commercial T&Cs",                "Meera Pillai", "in_review", "Payment Net 45 (Kotak standard) — within playbook."),
    ],
    gates: [
      gateFor("price", "PRS-KOTAK-004", "pending", "Meera Pillai")!,
    ],
    audit: [
      audit("PRS-KOTAK-004", 1, "stage_advance", "Content → Price & Commercial", 3),
    ],
    tags: ["india", "banking", "credit-risk", "incumbent"],
  },

  /* === Stage 6: Review === */
  {
    id: "PRS-AVIVA-001",
    name: "Aviva — Claims Analytics Refresh (RFQ)",
    customer: "Aviva Insurance",
    customerCountry: "UK",
    industry: "Insurance",
    type: "rfq",
    source: "inbound_rfp",
    currentStage: "review",
    copInr: 690_000,
    tcvInr: 19_800_000,
    winProb: 0.38,
    captureManager: "Sarah Whitley",
    preSalesLead: "Aanya Iyer",
    solutionArchitect: "Karthik Subramanian",
    proposalManager: "Sandeep Mehta",
    pricingLead: "Meera Pillai",
    submitDeadlineISO: "2026-05-18",
    expectedDecisionISO: "2026-06-20",
    outcome: "no_decision_yet",
    raciByStage: {
      review: { responsible: "Aanya Iyer", accountable: "Vikram Nair", consulted: ["Karthik Subramanian", "Meera Pillai"], informed: ["CFO"] },
    },
    tasks: [
      ...tasksFor("review", "PRS-AVIVA-001", "Aanya Iyer", ["done", "in_progress", "not_started", "not_started"]),
    ],
    deliverables: [
      deliverableFor("price", "PRS-AVIVA-001", 1, "Pricing workbook",  "Meera Pillai", "approved", "£3.2M proposal, 19% margin (below 26% target) — scope-trim being negotiated."),
      deliverableFor("review", "PRS-AVIVA-001", 1, "Red review findings", "Aanya Iyer", "in_review", "28 findings; 6 must-fixes (4 cleared, 2 outstanding: data residency, win-theme support §6)."),
      deliverableFor("review", "PRS-AVIVA-001", 2, "Final draft",         "Sandeep Mehta", "draft"),
    ],
    gates: [
      gateFor("price", "PRS-AVIVA-001", "approved", "Meera Pillai", "Approved at trimmed scope.")!,
      { id: "PRS-AVIVA-001-price-g-rfq", stage: "price", label: "Commercial Director double-sign", approverRole: "Commercial Director", required: true, status: "approved", approverName: "Meera Pillai", decidedISO: "2026-05-09" },
      gateFor("review", "PRS-AVIVA-001", "pending", "Vikram Nair")!,
    ],
    audit: [
      audit("PRS-AVIVA-001", 1, "agent_decision", "Red-Team Agent — 28 findings", 2, "Red-Team (agent)"),
      audit("PRS-AVIVA-001", 2, "stage_advance",   "Price approved → Review", 1),
    ],
    tags: ["uk", "insurance", "rfq", "margin-pressure"],
  },

  /* === Stage 7: Produce & Submit === */
  {
    id: "PRS-TATA-005",
    name: "Tata Consumer — Pricing Engine Phase 2 (RFP)",
    customer: "Tata Consumer Products",
    customerCountry: "India",
    industry: "Consumer Goods",
    type: "rfp",
    source: "incumbent_extension",
    currentStage: "produce",
    copInr: 280_000,
    tcvInr: 12_500_000,
    winProb: 0.74,
    captureManager: "Priya Reddy",
    preSalesLead: "Anita Verma",
    proposalManager: "Sandeep Mehta",
    submitDeadlineISO: "2026-05-14",
    expectedDecisionISO: "2026-06-10",
    outcome: "no_decision_yet",
    raciByStage: {
      produce: { responsible: "Sandeep Mehta", accountable: "Anita Verma", consulted: [], informed: ["Priya Reddy"] },
    },
    tasks: [
      ...tasksFor("produce", "PRS-TATA-005", "Sandeep Mehta", ["done", "in_progress", "not_started", "not_started"]),
    ],
    deliverables: [
      deliverableFor("review",  "PRS-TATA-005", 1, "Gold review pack",       "Anita Verma",   "approved"),
      deliverableFor("produce", "PRS-TATA-005", 1, "Final submission package","Sandeep Mehta", "draft", "Validator clean; awaiting CFO signature on covering letter."),
    ],
    gates: [
      gateFor("review",  "PRS-TATA-005", "approved", "Anita Verma")!,
      gateFor("produce", "PRS-TATA-005", "pending",  "Sandeep Mehta")!,
    ],
    audit: [
      audit("PRS-TATA-005", 1, "gate_approved", "Gold review pass — Anita Verma", 1),
      audit("PRS-TATA-005", 2, "stage_advance",  "Review → Produce & Submit", 1),
    ],
    tags: ["india", "consumer-goods", "fast-cycle"],
  },

  /* === Stage 8: Post-Submit === */
  {
    id: "PRS-SHELL-006",
    name: "Shell — Brent Pilot Phase 2 (Sole-Source)",
    customer: "Shell Energy Asia",
    customerCountry: "Singapore",
    industry: "Energy",
    type: "sole_source",
    source: "incumbent_extension",
    currentStage: "post_submit",
    copInr: 510_000,
    tcvInr: 24_000_000,
    winProb: 0.82,
    captureManager: "Liam Chen",
    preSalesLead: "Aanya Iyer",
    submitDeadlineISO: "2026-04-30",
    expectedDecisionISO: "2026-06-01",
    outcome: "no_decision_yet",
    raciByStage: {
      post_submit: { responsible: "Liam Chen", accountable: "Aanya Iyer", consulted: ["Karthik Subramanian"], informed: ["CFO"] },
    },
    tasks: [
      ...tasksFor("post_submit", "PRS-SHELL-006", "Liam Chen", ["in_progress", "not_started", "not_started", "in_progress"]),
    ],
    deliverables: [
      deliverableFor("produce", "PRS-SHELL-006", 1, "Final submission package", "Sandeep Mehta", "approved", "Submitted 30 Apr 17:00 SGT — acknowledged."),
      deliverableFor("post_submit", "PRS-SHELL-006", 1, "Q&A log", "Liam Chen", "draft", "5 evaluator questions inbound; 3 dispatched, 2 in draft."),
    ],
    gates: [
      gateFor("produce", "PRS-SHELL-006", "approved", "Sandeep Mehta")!,
      // sole-source extra
      { id: "PRS-SHELL-006-qualify-g-coi", stage: "qualify", label: "Conflict-of-interest check", approverRole: "Legal", required: true, status: "approved", approverName: "Vikram Nair", decidedISO: "2026-04-04" },
    ],
    audit: [
      audit("PRS-SHELL-006", 1, "submission_ack", "Submission acknowledged by Shell", 12),
      audit("PRS-SHELL-006", 2, "qa_received",    "Evaluator question 1 received", 6),
    ],
    tags: ["singapore", "energy", "sole-source", "incumbent"],
  },

  /* === Stage 9: Award / Loss / Withdraw — WON === */
  {
    id: "PRS-DBS-002",
    name: "DBS — Wealth Mgmt Phase 2 (Partner-Led)",
    customer: "DBS Bank",
    customerCountry: "Singapore",
    industry: "Banking",
    type: "partner_led",
    source: "partner",
    currentStage: "decision",
    copInr: 720_000,
    tcvInr: 31_000_000,
    winProb: 1.0,
    captureManager: "Rajesh Kumar",
    preSalesLead: "Aanya Iyer",
    outcome: "won",
    outcomeReason: "Industry references, price aggressiveness, named team. Partner introduction was decisive.",
    raciByStage: {
      decision: { responsible: "Aanya Iyer", accountable: "Rajesh Kumar", consulted: ["Vikram Nair"], informed: ["CEO"] },
    },
    tasks: [
      ...tasksFor("decision", "PRS-DBS-002", "Aanya Iyer", ["done", "done", "done", "skipped"]),
      ...tasksFor("knowledge","PRS-DBS-002", "Knowledge Curator", ["in_progress", "not_started", "not_started"]),
    ],
    deliverables: [
      deliverableFor("decision", "PRS-DBS-002", 1, "Win/Loss debrief", "Aanya Iyer", "approved", "Won. Drivers: industry refs, price aggressiveness, named team."),
      deliverableFor("decision", "PRS-DBS-002", 2, "Delivery handover packet", "Rajesh Kumar", "in_review"),
    ],
    gates: [
      gateFor("decision", "PRS-DBS-002", "approved", "Aanya Iyer", "Debrief signed — handover to Delivery in progress.")!,
      // partner-led extra
      { id: "PRS-DBS-002-capture-g-alliance", stage: "capture", label: "Partner agreement check", approverRole: "Alliance Lead", required: true, status: "approved", approverName: "Rajesh Kumar", decidedISO: "2026-03-10" },
    ],
    audit: [
      audit("PRS-DBS-002", 1, "outcome_logged", "Customer awarded the deal — won", 2),
      audit("PRS-DBS-002", 2, "agent_decision",  "Win/Loss Synthesizer closed debrief with 3 drivers", 1, "Win/Loss (agent)"),
    ],
    tags: ["singapore", "banking", "partner-led", "won"],
  },

  /* === Stage 9: Award / Loss / Withdraw — LOST === */
  {
    id: "PRS-CAP-007",
    name: "Capgemini-Incumbent — Bank of Singapore (RFP)",
    customer: "Bank of Singapore",
    customerCountry: "Singapore",
    industry: "Banking",
    type: "rfp",
    source: "inbound_rfp",
    currentStage: "decision",
    copInr: 540_000,
    tcvInr: 16_000_000,
    winProb: 0.0,
    captureManager: "Liam Chen",
    preSalesLead: "Aanya Iyer",
    outcome: "lost",
    outcomeReason: "Incumbent advantage and a missed evaluation criterion (§7.4 model audit cadence).",
    raciByStage: {
      decision: { responsible: "Aanya Iyer", accountable: "Liam Chen", consulted: [], informed: ["CFO"] },
    },
    tasks: tasksFor("decision", "PRS-CAP-007", "Aanya Iyer", ["done", "done", "skipped", "done"]),
    deliverables: [
      deliverableFor("decision", "PRS-CAP-007", 1, "Win/Loss debrief", "Aanya Iyer", "approved", "Lost. Drivers: incumbent advantage, missed evaluation criterion §7.4."),
    ],
    gates: [
      gateFor("decision", "PRS-CAP-007", "approved", "Aanya Iyer")!,
    ],
    audit: [
      audit("PRS-CAP-007", 1, "outcome_logged", "Customer awarded to Capgemini — lost", 4),
      audit("PRS-CAP-007", 2, "agent_decision",  "Win/Loss Synthesizer closed debrief", 3, "Win/Loss (agent)"),
    ],
    tags: ["singapore", "banking", "lost", "rfp"],
  },

  /* === Stage 9: Withdrawn === */
  {
    id: "PRS-MAERSK-002",
    name: "Maersk — Ops Platform Refresh (Withdrawn)",
    customer: "Maersk",
    customerCountry: "Denmark",
    industry: "Logistics",
    type: "rfp",
    source: "inbound_rfp",
    currentStage: "decision",
    copInr: 18_000,
    tcvInr: 0,
    winProb: 0.0,
    captureManager: "Sarah Whitley",
    preSalesLead: "Liam Chen",
    outcome: "withdrawn",
    outcomeReason: "No-Bid recommended by Bid/No-Bid Agent — no operational depth in shipping; estimated CoP ₹38L avoided.",
    raciByStage: {
      decision: { responsible: "Sarah Whitley", accountable: "Liam Chen", consulted: ["Aanya Iyer"], informed: [] },
    },
    tasks: tasksFor("qualify", "PRS-MAERSK-002", "Sarah Whitley", ["done", "done", "done", "done"]),
    deliverables: [
      deliverableFor("qualify", "PRS-MAERSK-002", 1, "Bid/No-Bid memo", "Sarah Whitley", "approved", "Recommendation: NO-BID. CoP avoided ~₹38L."),
    ],
    gates: [
      gateFor("qualify", "PRS-MAERSK-002", "approved", "Liam Chen", "No-Bid approved. CoP ₹38L avoided.")!,
    ],
    audit: [
      audit("PRS-MAERSK-002", 1, "agent_decision", "Bid/No-Bid Agent recommended NO-BID", 2, "Bid/No-Bid (agent)"),
      audit("PRS-MAERSK-002", 2, "outcome_logged", "Pursuit withdrawn", 1),
    ],
    tags: ["denmark", "logistics", "withdrawn", "no-bid"],
  },

  /* === Stage 10: Knowledge Reuse === */
  {
    id: "PRS-RZP-008",
    name: "Razorpay — Embedded Fraud (Won Q1)",
    customer: "Razorpay",
    customerCountry: "India",
    industry: "Fintech",
    type: "rfp",
    source: "outbound",
    currentStage: "knowledge",
    copInr: 320_000,
    tcvInr: 9_200_000,
    winProb: 1.0,
    captureManager: "Anita Verma",
    preSalesLead: "Priya Reddy",
    outcome: "won",
    outcomeReason: "Won — fraud-detection IP and proven Razorpay-adjacent reference.",
    raciByStage: {
      knowledge: { responsible: "Knowledge Curator", accountable: "Priya Reddy", consulted: [], informed: [] },
    },
    tasks: tasksFor("knowledge", "PRS-RZP-008", "Knowledge Curator", ["done", "done", "in_progress"]),
    deliverables: [
      deliverableFor("decision",  "PRS-RZP-008", 1, "Win/Loss debrief",   "Aanya Iyer",          "approved"),
      deliverableFor("knowledge", "PRS-RZP-008", 1, "Library entries",     "Knowledge Curator", "in_review", "6 reusable assets tagged; 1 case study promoted to gold."),
    ],
    gates: [
      gateFor("decision", "PRS-RZP-008", "approved", "Priya Reddy")!,
    ],
    audit: [
      audit("PRS-RZP-008", 1, "agent_decision", "Knowledge Curator promoted case study to gold library", 1, "Knowledge Curator (agent)"),
    ],
    tags: ["india", "fintech", "won", "knowledge"],
  },
];

/* ───────────────────────── Lookups ───────────────────────── */

export function pursuitById(id: string): PursuitRecord | undefined {
  return PURSUITS.find((p) => p.id === id);
}

export function stageProgress(p: PursuitRecord): number {
  return Math.round((STAGE_INDEX[p.currentStage] / (STAGES.length - 1)) * 100);
}

export function formatINR(n: number): string {
  if (n === 0) return "—";
  if (n >= 10_000_000) return "₹" + (n / 10_000_000).toFixed(2) + " Cr";
  if (n >= 100_000)    return "₹" + (n / 100_000).toFixed(1) + " L";
  return "₹" + n.toLocaleString("en-IN");
}

/** Days between today (May 12 2026) and a date. Negative = past. */
export function daysUntil(iso: string): number {
  const target = new Date(iso + "T12:00:00").getTime();
  const today  = new Date("2026-05-12T12:00:00").getTime();
  return Math.round((target - today) / 86_400_000);
}

/** All stages this pursuit's type *must* go through — excludes skipped. */
export function applicableStages(type: PursuitType): StageDef[] {
  const rules = PURSUIT_TYPE_RULES[type];
  return STAGES.filter((s) => !rules.skippedStages.includes(s.key));
}

/* ───────────────────────── Roll-up KPIs ───────────────────────── */

export const PURSUIT_KPIS = {
  total: PURSUITS.length,
  inFlight: PURSUITS.filter((p) => p.outcome === "no_decision_yet").length,
  won:      PURSUITS.filter((p) => p.outcome === "won").length,
  lost:     PURSUITS.filter((p) => p.outcome === "lost").length,
  withdrawn: PURSUITS.filter((p) => p.outcome === "withdrawn").length,
  mustWin:  PURSUITS.filter((p) => p.type === "must_win" || p.isMustWin).length,
  tcvInFlight: PURSUITS.filter((p) => p.outcome === "no_decision_yet").reduce((s, p) => s + p.tcvInr, 0),
  copYTD:      PURSUITS.reduce((s, p) => s + p.copInr, 0),
};
