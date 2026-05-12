/* ================================================================
   O2S Admin & Security — Types & Mock Data
   ================================================================
   Two-tier admin model:
     - Super Admin (Yatisphere)  → owns the SKU catalog + sets tenant entitlements
     - Tenant Admin              → manages users / roles / groups within entitlements

   Permission resolution per user:
     effective = (sum of role.permissions) ∪
                 (direct grants on the user) ∪
                 (sum of permissions from every group the user is in)
     ─ then filtered through the tenant entitlement gate.
   ================================================================ */

/* ── Modules & tiers (the SKU catalog) ───────────────────────── */

export type ModuleKey =
  | "talent"
  | "leave"
  | "delivery"
  | "finance"
  | "it"
  | "facilities"
  | "procurement"
  | "engage"
  | "knowledge"
  | "learning"
  | "legal"
  | "presales"
  | "people";

export type TierKey = "free" | "pro" | "enterprise";

export interface ModuleDef {
  key: ModuleKey;
  label: string;
  /** One-line product blurb. */
  blurb: string;
  /** Lucide icon name; consumer maps to the import. */
  iconName: string;
  /** Tailwind color class for accents. */
  accent: string;
  /** Tiers available for this module, in upgrade order. */
  tiers: TierKey[];
  /** Feature flags this module exposes, keyed by flag id. */
  features: ModuleFeature[];
}

export interface ModuleFeature {
  key: string;
  label: string;
  /** Minimum tier required to use this feature. */
  minTier: TierKey;
}

export const MODULES: ModuleDef[] = [
  {
    key: "talent",
    label: "Talent Acquisition",
    blurb: "Pipeline, requisitions, CV screening, interviews, offers.",
    iconName: "Users",
    accent: "text-brand-purple",
    tiers: ["free", "pro", "enterprise"],
    features: [
      { key: "talent.pipeline",   label: "Pipeline & candidates", minTier: "free" },
      { key: "talent.cv_screening", label: "AI CV screening",       minTier: "pro" },
      { key: "talent.interview_arena", label: "Interview Arena (panels)", minTier: "pro" },
      { key: "talent.agents",     label: "Recruiter Agents",      minTier: "enterprise" },
    ],
  },
  {
    key: "people",
    label: "People & HR",
    blurb: "Employee directory, onboarding, performance, OKRs.",
    iconName: "UserCircle",
    accent: "text-brand-teal",
    tiers: ["free", "pro", "enterprise"],
    features: [
      { key: "people.directory",  label: "Directory & profiles",  minTier: "free" },
      { key: "people.onboarding", label: "Onboarding workflows",  minTier: "pro" },
      { key: "people.performance",label: "Performance & reviews", minTier: "pro" },
      { key: "people.okrs",       label: "Goals & OKRs",          minTier: "pro" },
    ],
  },
  {
    key: "leave",
    label: "Leave Management",
    blurb: "Multi-country leave with agents, compliance, audit.",
    iconName: "Plane",
    accent: "text-brand",
    tiers: ["free", "pro", "enterprise"],
    features: [
      { key: "leave.requests",     label: "Requests + approvals", minTier: "free" },
      { key: "leave.calendar",     label: "Calendars + capacity", minTier: "free" },
      { key: "leave.policies",     label: "Policy builder",       minTier: "pro" },
      { key: "leave.agents",       label: "Leave Agents",         minTier: "pro" },
      { key: "leave.compliance",   label: "Compliance watchdog",  minTier: "enterprise" },
      { key: "leave.dsar",         label: "DSAR workflows",       minTier: "enterprise" },
    ],
  },
  {
    key: "delivery",
    label: "Delivery & PMO",
    blurb: "Projects, sprints, Gantt, capacity, releases.",
    iconName: "Kanban",
    accent: "text-warning",
    tiers: ["pro", "enterprise"],
    features: [
      { key: "delivery.projects",   label: "Projects & tasks",   minTier: "pro" },
      { key: "delivery.sprints",    label: "Sprints & boards",   minTier: "pro" },
      { key: "delivery.gantt",      label: "Gantt & dependencies", minTier: "pro" },
      { key: "delivery.portfolio",  label: "Portfolio rollups",  minTier: "enterprise" },
      { key: "delivery.agents",     label: "PM Agents",          minTier: "enterprise" },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    blurb: "Expenses, budgets, invoices, travel.",
    iconName: "DollarSign",
    accent: "text-success",
    tiers: ["free", "pro", "enterprise"],
    features: [
      { key: "finance.expenses",   label: "Expenses & receipts", minTier: "free" },
      { key: "finance.travel",     label: "Travel & per-diem",   minTier: "pro" },
      { key: "finance.budgets",    label: "Budgets & forecasts", minTier: "pro" },
      { key: "finance.invoices",   label: "Invoicing & AR",      minTier: "enterprise" },
    ],
  },
  {
    key: "it",
    label: "IT Operations",
    blurb: "Helpdesk, assets, licenses, provisioning.",
    iconName: "Monitor",
    accent: "text-brand",
    tiers: ["free", "pro", "enterprise"],
    features: [
      { key: "it.helpdesk",   label: "Helpdesk & tickets", minTier: "free" },
      { key: "it.assets",     label: "Asset tracking",     minTier: "pro" },
      { key: "it.licenses",   label: "License management", minTier: "pro" },
      { key: "it.provisioning", label: "Provisioning & access", minTier: "enterprise" },
    ],
  },
  {
    key: "facilities",
    label: "Facilities",
    blurb: "Desks, rooms, visitors.",
    iconName: "Building",
    accent: "text-muted-foreground",
    tiers: ["free", "pro"],
    features: [
      { key: "facilities.desks",    label: "Desk booking",    minTier: "free" },
      { key: "facilities.rooms",    label: "Room booking",    minTier: "free" },
      { key: "facilities.visitors", label: "Visitor management", minTier: "pro" },
    ],
  },
  {
    key: "procurement",
    label: "Procurement",
    blurb: "Requests, POs, suppliers.",
    iconName: "ShoppingCart",
    accent: "text-warning",
    tiers: ["pro", "enterprise"],
    features: [
      { key: "procurement.requests",   label: "Requests",  minTier: "pro" },
      { key: "procurement.orders",     label: "Purchase orders", minTier: "pro" },
      { key: "procurement.suppliers",  label: "Supplier mgmt", minTier: "enterprise" },
    ],
  },
  {
    key: "engage",
    label: "Engagement",
    blurb: "Feed, recognition, surveys, culture.",
    iconName: "Megaphone",
    accent: "text-success",
    tiers: ["free", "pro"],
    features: [
      { key: "engage.feed",        label: "Social feed",      minTier: "free" },
      { key: "engage.recognition", label: "Recognition",      minTier: "pro" },
      { key: "engage.surveys",     label: "Surveys & pulses", minTier: "pro" },
    ],
  },
  {
    key: "knowledge",
    label: "Knowledge",
    blurb: "Wiki, SOPs, templates.",
    iconName: "FileText",
    accent: "text-brand-teal",
    tiers: ["free", "pro", "enterprise"],
    features: [
      { key: "knowledge.wiki",      label: "Wiki",      minTier: "free" },
      { key: "knowledge.sops",      label: "SOPs",      minTier: "pro" },
      { key: "knowledge.templates", label: "Templates", minTier: "pro" },
    ],
  },
  {
    key: "learning",
    label: "Learning",
    blurb: "LMS, certifications, skills graph.",
    iconName: "BookOpen",
    accent: "text-[#A3E635]",
    tiers: ["pro", "enterprise"],
    features: [
      { key: "learning.catalog",        label: "Course catalog",  minTier: "pro" },
      { key: "learning.certifications", label: "Certifications",  minTier: "pro" },
      { key: "learning.skills",         label: "Skills graph",    minTier: "enterprise" },
    ],
  },
  {
    key: "legal",
    label: "Legal & Compliance",
    blurb: "Contracts, policies, cases, immigration.",
    iconName: "Scale",
    accent: "text-destructive",
    tiers: ["enterprise"],
    features: [
      { key: "legal.contracts",   label: "Contracts & CLM", minTier: "enterprise" },
      { key: "legal.compliance",  label: "Compliance",      minTier: "enterprise" },
      { key: "legal.immigration", label: "Immigration",     minTier: "enterprise" },
    ],
  },
  {
    key: "presales",
    label: "Pre-Sales & Proposals",
    blurb: "Pursuits, RFPs, capture, proposal authoring, orals.",
    iconName: "Target",
    accent: "text-brand-purple",
    tiers: ["pro", "enterprise"],
    features: [
      { key: "presales.pursuits",     label: "Pursuits & qualification", minTier: "pro" },
      { key: "presales.rfp",          label: "RFP / RFI workspace",      minTier: "pro" },
      { key: "presales.compliance",   label: "Compliance matrix",         minTier: "pro" },
      { key: "presales.authoring",    label: "Proposal authoring",        minTier: "pro" },
      { key: "presales.reviews",      label: "Pink / Red / Gold reviews", minTier: "enterprise" },
      { key: "presales.agents",       label: "Pre-Sales Agents",          minTier: "enterprise" },
    ],
  },
];

export const MODULE_MAP: Record<ModuleKey, ModuleDef> = Object.fromEntries(
  MODULES.map((m) => [m.key, m]),
) as Record<ModuleKey, ModuleDef>;

export const TIER_LABEL: Record<TierKey, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

export const TIER_RANK: Record<TierKey, number> = { free: 0, pro: 1, enterprise: 2 };

/* ── Tenant entitlement (what this tenant has purchased) ───── */

export interface TenantEntitlement {
  module: ModuleKey;
  tier: TierKey;
  /** ISO date the entitlement expires. */
  expiresOn: string;
  /** Optional per-feature opt-outs (rare; usually for compliance). */
  disabledFeatures?: string[];
  /** Approximate seats included. */
  seats: number;
}

export const TENANT_ENTITLEMENTS: TenantEntitlement[] = [
  { module: "talent",     tier: "enterprise", expiresOn: "2027-04-01", seats: 50  },
  { module: "people",     tier: "enterprise", expiresOn: "2027-04-01", seats: 2000 },
  { module: "leave",      tier: "enterprise", expiresOn: "2027-04-01", seats: 2000 },
  { module: "delivery",   tier: "pro",        expiresOn: "2027-04-01", seats: 200  },
  { module: "finance",    tier: "pro",        expiresOn: "2027-04-01", seats: 2000 },
  { module: "it",         tier: "pro",        expiresOn: "2027-04-01", seats: 2000 },
  { module: "facilities", tier: "free",       expiresOn: "2027-04-01", seats: 2000 },
  { module: "engage",     tier: "pro",        expiresOn: "2027-04-01", seats: 2000 },
  { module: "knowledge",  tier: "pro",        expiresOn: "2027-04-01", seats: 2000 },
  { module: "legal",      tier: "enterprise", expiresOn: "2027-04-01", seats: 50 },
  { module: "presales",   tier: "enterprise", expiresOn: "2027-04-01", seats: 80 },
  // NOT purchased: procurement, learning
];

/* ── Permission catalog ─────────────────────────────────────── */

/** Permissions are namespaced by module. Format: <module>.<entity>.<action>. */
export interface PermissionDef {
  key: string;
  /** The module this permission belongs to (matches the prefix). */
  module: ModuleKey | "platform";
  label: string;
  description: string;
  group: string;
  /** Minimum tier required to grant this permission (gates entitlement). */
  minTier?: TierKey;
}

export const PLATFORM_PERMISSIONS: PermissionDef[] = [
  { key: "platform.admin",                    module: "platform", group: "Platform",  label: "Tenant admin",           description: "Manage users, roles, groups for this tenant." },
  { key: "platform.entitlements.read",        module: "platform", group: "Platform",  label: "Read entitlements",       description: "View which modules + tiers this tenant owns." },
  { key: "platform.entitlements.write",       module: "platform", group: "Platform",  label: "Edit entitlements",       description: "Change module subscriptions (Super Admin only)." },
  { key: "platform.audit.read",               module: "platform", group: "Platform",  label: "Read admin audit",        description: "View admin-action audit log." },
  { key: "platform.audit.export",             module: "platform", group: "Platform",  label: "Export admin audit",      description: "Download audit log." },
  { key: "platform.users.read",               module: "platform", group: "Users",     label: "Read users",              description: "View tenant users." },
  { key: "platform.users.write",              module: "platform", group: "Users",     label: "Edit users",              description: "Invite, suspend, edit users." },
  { key: "platform.users.delete",             module: "platform", group: "Users",     label: "Delete users",            description: "Permanently delete user accounts." },
  { key: "platform.roles.read",               module: "platform", group: "Roles",     label: "Read roles",              description: "View RBAC roles and assignments." },
  { key: "platform.roles.write",              module: "platform", group: "Roles",     label: "Edit roles",              description: "Create, edit, delete roles." },
  { key: "platform.groups.read",              module: "platform", group: "Groups",    label: "Read groups",             description: "View user groups." },
  { key: "platform.groups.write",             module: "platform", group: "Groups",    label: "Edit groups",             description: "Create, edit, delete groups." },
];

// We collect leave permissions here so the new global system owns them.
export const LEAVE_PERMISSIONS: PermissionDef[] = [
  { key: "leave.request.create",            module: "leave", group: "Requests", label: "Create requests",          description: "Submit a new leave request for self." },
  { key: "leave.request.cancel.self",       module: "leave", group: "Requests", label: "Cancel own request",       description: "Withdraw a pending or approved request." },
  { key: "leave.request.view.team",         module: "leave", group: "Requests", label: "View team requests",       description: "See requests from direct reports." },
  { key: "leave.request.view.org",          module: "leave", group: "Requests", label: "View all requests",        description: "See requests across the tenant." },
  { key: "leave.request.approve.team",      module: "leave", group: "Requests", label: "Approve team requests",    description: "Decide on direct-report requests." },
  { key: "leave.request.force_approve",     module: "leave", group: "Requests", label: "Force-approve",            description: "Override manager decisions." },
  { key: "leave.request.force_cancel",      module: "leave", group: "Requests", label: "Force-cancel",             description: "Cancel any request (with audit)." },
  { key: "leave.request.reassign_approver", module: "leave", group: "Requests", label: "Reassign approver",        description: "Route a request to a different approver." },
  { key: "leave.calendar.view.team",        module: "leave", group: "Calendars", label: "View team calendar",      description: "Heatmap and timeline for one team." },
  { key: "leave.calendar.view.org",         module: "leave", group: "Calendars", label: "View org calendar",       description: "Cross-team calendar." },
  { key: "leave.policy.read",               module: "leave", group: "Policies",  label: "Read policies",           description: "View accrual rules, holidays.", minTier: "pro" },
  { key: "leave.policy.write",              module: "leave", group: "Policies",  label: "Edit policies",           description: "Change accrual rates, holidays.", minTier: "pro" },
  { key: "leave.balances.read.self",        module: "leave", group: "Balances",  label: "Read own balance",        description: "See own balances." },
  { key: "leave.balances.read.team",        module: "leave", group: "Balances",  label: "Read team balances",      description: "See balances for direct reports." },
  { key: "leave.balances.read.org",         module: "leave", group: "Balances",  label: "Read all balances",       description: "See balances across the tenant." },
  { key: "leave.balances.adjust",           module: "leave", group: "Balances",  label: "Adjust balances",         description: "Make compensatory adjustments." },
  { key: "leave.wellbeing.view",            module: "leave", group: "Wellbeing", label: "View wellbeing signals",  description: "See burnout-risk alerts." },
  { key: "leave.wellbeing.act",             module: "leave", group: "Wellbeing", label: "Act on wellbeing",        description: "Suggest leave, escalate." },
  { key: "leave.anomalies.view",            module: "leave", group: "Wellbeing", label: "View anomalies",          description: "See anomaly review queue." },
  { key: "leave.anomalies.act",             module: "leave", group: "Wellbeing", label: "Act on anomalies",        description: "Dismiss, escalate, investigate." },
  { key: "leave.agents.view",               module: "leave", group: "Agents",    label: "View agents",             description: "Read agent definitions and decisions.", minTier: "pro" },
  { key: "leave.agents.configure",          module: "leave", group: "Agents",    label: "Configure agents",        description: "Toggle status, change autonomy.", minTier: "pro" },
  { key: "leave.reports.view",              module: "leave", group: "Reports",   label: "View reports",            description: "Read pre-built dashboards." },
  { key: "leave.reports.build",             module: "leave", group: "Reports",   label: "Build reports",           description: "Use the no-code report builder." },
  { key: "leave.reports.export",            module: "leave", group: "Reports",   label: "Export reports",          description: "Download CSV/PDF." },
  { key: "leave.compliance.view",           module: "leave", group: "Compliance", label: "View compliance feed",   description: "See watchdog alerts.", minTier: "enterprise" },
  { key: "leave.compliance.act",            module: "leave", group: "Compliance", label: "Act on compliance",      description: "Acknowledge, escalate.", minTier: "enterprise" },
  { key: "leave.audit.view",                module: "leave", group: "Audit",     label: "View audit log",          description: "See every state change with before/after." },
  { key: "leave.audit.export",              module: "leave", group: "Audit",     label: "Export audit log",        description: "Download immutable audit trail." },
  { key: "leave.dsar.view",                 module: "leave", group: "Audit",     label: "View DSAR queue",         description: "See data-subject access requests.", minTier: "enterprise" },
  { key: "leave.dsar.act",                  module: "leave", group: "Audit",     label: "Act on DSARs",            description: "Assign, place legal hold.",       minTier: "enterprise" },
  { key: "leave.tenant.write",              module: "leave", group: "Tenant",    label: "Edit tenant settings",    description: "Change branding, defaults." },
];

export const DELIVERY_PERMISSIONS: PermissionDef[] = [
  { key: "delivery.project.read",      module: "delivery", group: "Projects", label: "Read projects",   description: "View project list and details." },
  { key: "delivery.project.write",     module: "delivery", group: "Projects", label: "Edit projects",   description: "Create or edit project charters." },
  { key: "delivery.project.delete",    module: "delivery", group: "Projects", label: "Delete projects", description: "Archive or delete projects." },
  { key: "delivery.task.read",         module: "delivery", group: "Tasks",    label: "Read tasks",      description: "View any task in entitled projects." },
  { key: "delivery.task.write",        module: "delivery", group: "Tasks",    label: "Edit tasks",      description: "Create, edit, comment on tasks." },
  { key: "delivery.sprint.read",       module: "delivery", group: "Sprints",  label: "Read sprints",    description: "View sprint plans + boards." },
  { key: "delivery.sprint.write",      module: "delivery", group: "Sprints",  label: "Edit sprints",    description: "Plan, modify, close sprints." },
  { key: "delivery.capacity.read",     module: "delivery", group: "Capacity", label: "Read capacity",   description: "View workload heatmaps." },
  { key: "delivery.capacity.write",    module: "delivery", group: "Capacity", label: "Edit allocations", description: "Book resources, change allocations." },
  { key: "delivery.portfolio.read",    module: "delivery", group: "Portfolio", label: "Read portfolio", description: "Portfolio rollups, RAG status.", minTier: "enterprise" },
  { key: "delivery.portfolio.write",   module: "delivery", group: "Portfolio", label: "Edit portfolio", description: "Approve / kill / re-prioritize.", minTier: "enterprise" },
];

export const TALENT_PERMISSIONS: PermissionDef[] = [
  { key: "talent.req.read",       module: "talent", group: "Requisitions", label: "Read requisitions",   description: "View open and historical reqs." },
  { key: "talent.req.write",      module: "talent", group: "Requisitions", label: "Edit requisitions",   description: "Create and edit reqs." },
  { key: "talent.req.approve",    module: "talent", group: "Requisitions", label: "Approve requisitions", description: "Sign off on opening a role." },
  { key: "talent.cand.read",      module: "talent", group: "Candidates",   label: "Read candidates",     description: "View candidate profiles." },
  { key: "talent.cand.write",     module: "talent", group: "Candidates",   label: "Edit candidates",     description: "Create / edit candidate records." },
  { key: "talent.interview.run",  module: "talent", group: "Interviews",   label: "Run interviews",      description: "Submit scorecards." },
  { key: "talent.offer.write",    module: "talent", group: "Offers",       label: "Issue offers",        description: "Generate and approve offers." },
];

export const PEOPLE_PERMISSIONS: PermissionDef[] = [
  { key: "people.directory.read",  module: "people", group: "Directory",   label: "Read directory",   description: "Browse employee profiles." },
  { key: "people.directory.write", module: "people", group: "Directory",   label: "Edit directory",   description: "Update employee data." },
  { key: "people.performance.read", module: "people", group: "Performance", label: "Read reviews",     description: "View performance reviews." },
  { key: "people.performance.write", module: "people", group: "Performance", label: "Edit reviews",   description: "Conduct and submit reviews." },
  { key: "people.okr.read",        module: "people", group: "OKRs",        label: "Read OKRs",         description: "View goals and OKRs." },
  { key: "people.okr.write",       module: "people", group: "OKRs",        label: "Edit OKRs",         description: "Create / edit OKRs." },
];

export const FINANCE_PERMISSIONS: PermissionDef[] = [
  { key: "finance.expense.read",  module: "finance", group: "Expenses", label: "Read expenses", description: "View expense reports." },
  { key: "finance.expense.write", module: "finance", group: "Expenses", label: "Submit expenses", description: "Submit own expenses." },
  { key: "finance.expense.approve", module: "finance", group: "Expenses", label: "Approve expenses", description: "Approve team expenses." },
  { key: "finance.budget.read",   module: "finance", group: "Budgets",  label: "Read budgets",  description: "View department budgets.", minTier: "pro" },
  { key: "finance.budget.write",  module: "finance", group: "Budgets",  label: "Edit budgets",  description: "Allocate and adjust budgets.", minTier: "pro" },
  { key: "finance.invoice.read",  module: "finance", group: "Invoices", label: "Read invoices", description: "View customer invoices.",  minTier: "enterprise" },
  { key: "finance.invoice.write", module: "finance", group: "Invoices", label: "Edit invoices", description: "Issue and edit invoices.", minTier: "enterprise" },
];

export const IT_PERMISSIONS: PermissionDef[] = [
  { key: "it.ticket.read",  module: "it", group: "Helpdesk", label: "Read tickets",  description: "View helpdesk tickets." },
  { key: "it.ticket.write", module: "it", group: "Helpdesk", label: "Edit tickets",  description: "Triage and resolve tickets." },
  { key: "it.asset.read",   module: "it", group: "Assets",   label: "Read assets",   description: "View IT assets.",       minTier: "pro" },
  { key: "it.asset.write",  module: "it", group: "Assets",   label: "Edit assets",   description: "Assign and retire assets.", minTier: "pro" },
];

export const LEGAL_PERMISSIONS: PermissionDef[] = [
  { key: "legal.matter.read",     module: "legal", group: "Matters",     label: "Read matters",      description: "View open and historical legal matters.",       minTier: "enterprise" },
  { key: "legal.matter.write",    module: "legal", group: "Matters",     label: "Edit matters",      description: "Open / update / close legal matters.",          minTier: "enterprise" },
  { key: "legal.contract.read",   module: "legal", group: "Contracts",   label: "Read contracts",    description: "View contract repository.",                       minTier: "enterprise" },
  { key: "legal.contract.draft",  module: "legal", group: "Contracts",   label: "Draft contracts",   description: "Create or redline contracts.",                    minTier: "enterprise" },
  { key: "legal.contract.sign",   module: "legal", group: "Contracts",   label: "Send for signature", description: "Route a contract for final signature.",          minTier: "enterprise" },
  { key: "legal.playbook.read",   module: "legal", group: "Playbooks",   label: "Read playbooks",    description: "Read clause-by-clause playbooks.",                minTier: "enterprise" },
  { key: "legal.playbook.write",  module: "legal", group: "Playbooks",   label: "Edit playbooks",    description: "Maintain playbooks and clause libraries.",        minTier: "enterprise" },
  { key: "legal.obligation.read", module: "legal", group: "Obligations", label: "Read obligations",  description: "View extracted obligations from signed contracts.", minTier: "enterprise" },
  { key: "legal.obligation.write",module: "legal", group: "Obligations", label: "Edit obligations",  description: "Assign owners, close obligations.",                minTier: "enterprise" },
  { key: "legal.compliance.read", module: "legal", group: "Compliance",  label: "Read compliance",   description: "View compliance feed and register.",              minTier: "enterprise" },
  { key: "legal.compliance.act",  module: "legal", group: "Compliance",  label: "Act on compliance", description: "Acknowledge, escalate, draft redlines.",          minTier: "enterprise" },
  { key: "legal.dsar.read",       module: "legal", group: "Privacy",     label: "Read DSARs",        description: "View data-subject access requests.",              minTier: "enterprise" },
  { key: "legal.dsar.act",        module: "legal", group: "Privacy",     label: "Act on DSARs",      description: "Run DSAR workflow, sign-off responses.",          minTier: "enterprise" },
  { key: "legal.spend.read",      module: "legal", group: "Spend",       label: "Read legal spend",  description: "View outside-counsel spend and invoices.",        minTier: "enterprise" },
  { key: "legal.spend.act",       module: "legal", group: "Spend",       label: "Act on legal spend", description: "Approve invoices, dispute lines.",               minTier: "enterprise" },
  { key: "legal.board.read",      module: "legal", group: "Board",       label: "Read board materials", description: "View board / committee materials.",            minTier: "enterprise" },
  { key: "legal.board.act",       module: "legal", group: "Board",       label: "Act on board materials", description: "Draft and finalise board materials.",        minTier: "enterprise" },
  { key: "legal.ethics.read",     module: "legal", group: "Ethics",      label: "Read ethics queue", description: "Restricted: hotline / whistleblower queue.",      minTier: "enterprise" },
  { key: "legal.ethics.act",      module: "legal", group: "Ethics",      label: "Act on ethics queue", description: "Restricted: triage / route ethics submissions.", minTier: "enterprise" },
];

export const PRESALES_PERMISSIONS: PermissionDef[] = [
  { key: "presales.pursuit.read",      module: "presales", group: "Pursuits",   label: "Read pursuits",       description: "View active and closed pursuits.",                       minTier: "pro" },
  { key: "presales.pursuit.write",     module: "presales", group: "Pursuits",   label: "Edit pursuits",       description: "Open, qualify, advance, or close pursuits.",             minTier: "pro" },
  { key: "presales.pursuit.bid_decide",module: "presales", group: "Pursuits",   label: "Bid/no-bid decision", description: "Record the formal bid/no-bid decision for a pursuit.",   minTier: "pro" },
  { key: "presales.rfp.read",          module: "presales", group: "RFPs",       label: "Read RFPs",           description: "View RFP / RFI / RFQ documents and decomposition.",      minTier: "pro" },
  { key: "presales.rfp.write",         module: "presales", group: "RFPs",       label: "Edit RFPs",           description: "Upload RFPs, edit compliance matrix and ownership.",     minTier: "pro" },
  { key: "presales.capture.read",      module: "presales", group: "Capture",    label: "Read capture plans",  description: "View capture plans, win themes, customer intel.",        minTier: "pro" },
  { key: "presales.capture.write",     module: "presales", group: "Capture",    label: "Edit capture plans",  description: "Author capture plans, edit win themes.",                 minTier: "pro" },
  { key: "presales.proposal.read",     module: "presales", group: "Proposals",  label: "Read proposals",      description: "View proposal drafts and sections.",                     minTier: "pro" },
  { key: "presales.proposal.write",    module: "presales", group: "Proposals",  label: "Author proposals",    description: "Edit and contribute to proposal sections.",              minTier: "pro" },
  { key: "presales.review.run",        module: "presales", group: "Reviews",    label: "Run pink/red/gold",   description: "Run pink/red/gold reviews and capture findings.",        minTier: "enterprise" },
  { key: "presales.pricing.read",      module: "presales", group: "Pricing",    label: "Read pricing",        description: "View pricing workbooks and win-probability curves.",     minTier: "pro" },
  { key: "presales.pricing.write",     module: "presales", group: "Pricing",    label: "Edit pricing",        description: "Edit pricing assumptions, run scenarios.",               minTier: "enterprise" },
  { key: "presales.submission.gate",   module: "presales", group: "Submission", label: "Submission gate",     description: "Final go/no-go on submission.",                          minTier: "pro" },
  { key: "presales.qna.act",           module: "presales", group: "Q&A",        label: "Manage Q&A",          description: "Route, draft, and dispatch evaluator Q&A responses.",     minTier: "pro" },
  { key: "presales.debrief.read",      module: "presales", group: "Debriefs",   label: "Read debriefs",       description: "View win/loss debriefs.",                                minTier: "pro" },
  { key: "presales.debrief.write",     module: "presales", group: "Debriefs",   label: "Edit debriefs",       description: "Conduct and finalise win/loss debriefs.",                minTier: "enterprise" },
  { key: "presales.library.read",      module: "presales", group: "Knowledge",  label: "Read library",        description: "Browse the proposal content library.",                   minTier: "pro" },
  { key: "presales.library.write",     module: "presales", group: "Knowledge",  label: "Curate library",      description: "Tag, refresh, and approve reusable content.",            minTier: "enterprise" },
];

export const ALL_PERMISSIONS: PermissionDef[] = [
  ...PLATFORM_PERMISSIONS,
  ...TALENT_PERMISSIONS,
  ...PEOPLE_PERMISSIONS,
  ...LEAVE_PERMISSIONS,
  ...DELIVERY_PERMISSIONS,
  ...FINANCE_PERMISSIONS,
  ...IT_PERMISSIONS,
  ...LEGAL_PERMISSIONS,
  ...PRESALES_PERMISSIONS,
];

export const PERMISSIONS_BY_MODULE: Record<string, PermissionDef[]> = ALL_PERMISSIONS.reduce(
  (acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push(p);
    return acc;
  },
  {} as Record<string, PermissionDef[]>,
);

/* ── Roles ──────────────────────────────────────────────────── */

export type RoleScope = "tenant" | "module" | "team";

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  builtIn: boolean;
  /** Scope of this role: tenant-wide, scoped to a single module, or to a team. */
  scope: RoleScope;
  /** When scope = "module", which module. */
  module?: ModuleKey;
  tone: "purple" | "teal" | "blue" | "amber" | "gray" | "red" | "green";
  permissions: string[];
  userCount: number;
}

export const BUILT_IN_ROLES: AdminRole[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full access platform-wide. Reserved for tenant owners.",
    builtIn: true,
    scope: "tenant",
    tone: "red",
    userCount: 2,
    permissions: ALL_PERMISSIONS.map((p) => p.key),
  },
  {
    id: "tenant_admin",
    name: "Tenant Admin",
    description: "Manages users, roles, groups, audit. Can't change entitlements.",
    builtIn: true,
    scope: "tenant",
    tone: "purple",
    userCount: 3,
    permissions: [
      "platform.admin",
      "platform.entitlements.read",
      "platform.audit.read",
      "platform.audit.export",
      "platform.users.read",
      "platform.users.write",
      "platform.users.delete",
      "platform.roles.read",
      "platform.roles.write",
      "platform.groups.read",
      "platform.groups.write",
    ],
  },
  {
    id: "hr_ops",
    name: "HR Ops",
    description: "Org-wide People + Leave operations.",
    builtIn: true,
    scope: "tenant",
    tone: "teal",
    userCount: 4,
    permissions: [
      ...PEOPLE_PERMISSIONS.map((p) => p.key),
      ...LEAVE_PERMISSIONS.filter((p) => p.key !== "leave.tenant.write").map((p) => p.key),
    ],
  },
  {
    id: "pmo_lead",
    name: "PMO Lead",
    description: "Portfolio, programs, projects, capacity.",
    builtIn: true,
    scope: "module",
    module: "delivery",
    tone: "amber",
    userCount: 2,
    permissions: DELIVERY_PERMISSIONS.map((p) => p.key),
  },
  {
    id: "delivery_manager",
    name: "Delivery Manager",
    description: "Run sprints, capacity, releases for own projects.",
    builtIn: true,
    scope: "module",
    module: "delivery",
    tone: "amber",
    userCount: 8,
    permissions: [
      "delivery.project.read",
      "delivery.project.write",
      "delivery.task.read",
      "delivery.task.write",
      "delivery.sprint.read",
      "delivery.sprint.write",
      "delivery.capacity.read",
      "delivery.capacity.write",
    ],
  },
  {
    id: "engineer",
    name: "Engineer",
    description: "IC working on assigned tasks and sprints.",
    builtIn: true,
    scope: "module",
    module: "delivery",
    tone: "blue",
    userCount: 64,
    permissions: [
      "delivery.project.read",
      "delivery.task.read",
      "delivery.task.write",
      "delivery.sprint.read",
      "delivery.capacity.read",
    ],
  },
  {
    id: "recruiter",
    name: "Recruiter",
    description: "Source, screen, schedule candidates.",
    builtIn: true,
    scope: "module",
    module: "talent",
    tone: "purple",
    userCount: 5,
    permissions: TALENT_PERMISSIONS.map((p) => p.key),
  },
  {
    id: "manager",
    name: "Manager",
    description: "Approve team requests, see capacity, run reviews.",
    builtIn: true,
    scope: "tenant",
    tone: "amber",
    userCount: 38,
    permissions: [
      "leave.request.create",
      "leave.request.cancel.self",
      "leave.request.view.team",
      "leave.request.approve.team",
      "leave.calendar.view.team",
      "leave.balances.read.self",
      "leave.balances.read.team",
      "leave.wellbeing.view",
      "leave.wellbeing.act",
      "leave.reports.view",
      "people.directory.read",
      "people.performance.read",
      "people.performance.write",
      "people.okr.read",
      "people.okr.write",
      "delivery.project.read",
      "delivery.task.read",
      "delivery.task.write",
      "delivery.capacity.read",
      "finance.expense.read",
      "finance.expense.approve",
    ],
  },
  {
    id: "employee",
    name: "Employee",
    description: "Default role: own requests, profile, learning.",
    builtIn: true,
    scope: "tenant",
    tone: "blue",
    userCount: 1_204,
    permissions: [
      "leave.request.create",
      "leave.request.cancel.self",
      "leave.calendar.view.team",
      "leave.balances.read.self",
      "leave.policy.read",
      "people.directory.read",
      "people.okr.read",
      "people.okr.write",
      "finance.expense.read",
      "finance.expense.write",
      "delivery.task.read",
      "delivery.task.write",
    ],
  },
  {
    id: "finance_lead",
    name: "Finance Lead",
    description: "Budgets, invoices, liability dashboards.",
    builtIn: true,
    scope: "module",
    module: "finance",
    tone: "green",
    userCount: 3,
    permissions: FINANCE_PERMISSIONS.map((p) => p.key),
  },
  {
    id: "auditor",
    name: "Auditor",
    description: "Read-only access to audit logs and compliance feeds.",
    builtIn: true,
    scope: "tenant",
    tone: "gray",
    userCount: 1,
    permissions: [
      "platform.audit.read",
      "platform.audit.export",
      "leave.audit.view",
      "leave.audit.export",
      "leave.compliance.view",
      "leave.dsar.view",
      "leave.reports.view",
    ],
  },
];

/* ── Groups (e.g. "APAC Engineering") ────────────────────────── */

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  /** Lucide icon hint. */
  iconName: string;
  /** Members are stored by user id. */
  memberIds: string[];
  /** Permissions granted to all members. */
  permissions: string[];
}

export const BUILT_IN_GROUPS: UserGroup[] = [
  {
    id: "g-apac-eng",
    name: "APAC Engineering",
    description: "All engineering ICs and EMs in India/SG/JP.",
    iconName: "Globe",
    memberIds: ["u-priya", "u-rajiv", "u-anil", "u-meera"],
    permissions: [
      "delivery.project.read",
      "delivery.task.read",
      "delivery.task.write",
      "delivery.sprint.read",
    ],
  },
  {
    id: "g-uk-people",
    name: "UK People Team",
    description: "UK HRBPs and local HR.",
    iconName: "Users",
    memberIds: ["u-james", "u-sophia"],
    permissions: [
      "leave.request.view.org",
      "leave.calendar.view.org",
      "leave.balances.read.org",
      "people.directory.write",
    ],
  },
  {
    id: "g-execs",
    name: "Executive Team",
    description: "C-level and VPs.",
    iconName: "Crown",
    memberIds: ["u-prashant", "u-anita"],
    permissions: [
      "delivery.portfolio.read",
      "delivery.portfolio.write",
      "finance.budget.read",
      "finance.budget.write",
    ],
  },
  {
    id: "g-on-call",
    name: "On-call rota (this week)",
    description: "Rotating; expires Sunday. Grants pager-duty access.",
    iconName: "Bell",
    memberIds: ["u-rajiv", "u-anil"],
    permissions: [
      "it.ticket.read",
      "it.ticket.write",
    ],
  },
];

/* ── Users ─────────────────────────────────────────────────────── */

export type UserStatus = "active" | "suspended" | "invited" | "offboarded";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  jobTitle: string;
  department: string;
  country: string;
  status: UserStatus;
  /** Role ids assigned to this user. */
  roleIds: string[];
  /** Direct permission grants on this user (override / additive). */
  directGrants: string[];
  /** ISO timestamp of last activity. */
  lastActiveISO: string;
  joinedISO: string;
  mfaEnabled: boolean;
  ssoLinked: boolean;
}

export const ADMIN_USERS: AdminUser[] = [
  {
    id: "u-prashant",
    name: "Prashant Singh",
    email: "prashant@latentbridge.com",
    initials: "PS",
    avatarColor: "bg-brand-purple",
    jobTitle: "CEO & Founder",
    department: "Executive",
    country: "IN",
    status: "active",
    roleIds: ["super_admin"],
    directGrants: [],
    lastActiveISO: "2026-05-11T08:30:00",
    joinedISO: "2025-01-01",
    mfaEnabled: true,
    ssoLinked: true,
  },
  {
    id: "u-anita",
    name: "Anita Verma",
    email: "anita.verma@latentbridge.com",
    initials: "AV",
    avatarColor: "bg-brand-teal",
    jobTitle: "VP People Ops",
    department: "People",
    country: "IN",
    status: "active",
    roleIds: ["tenant_admin", "hr_ops"],
    directGrants: ["leave.tenant.write"],
    lastActiveISO: "2026-05-11T07:55:00",
    joinedISO: "2025-02-15",
    mfaEnabled: true,
    ssoLinked: true,
  },
  {
    id: "u-priya",
    name: "Priya Singh",
    email: "priya.singh@latentbridge.com",
    initials: "PS",
    avatarColor: "bg-brand",
    jobTitle: "Senior Engineer",
    department: "Engineering",
    country: "IN",
    status: "active",
    roleIds: ["employee", "engineer"],
    directGrants: [],
    lastActiveISO: "2026-05-11T08:12:00",
    joinedISO: "2024-03-01",
    mfaEnabled: true,
    ssoLinked: true,
  },
  {
    id: "u-rajiv",
    name: "Rajiv Kumar",
    email: "rajiv.kumar@latentbridge.com",
    initials: "RK",
    avatarColor: "bg-warning",
    jobTitle: "Engineering Manager",
    department: "Engineering",
    country: "IN",
    status: "active",
    roleIds: ["manager", "delivery_manager"],
    directGrants: [],
    lastActiveISO: "2026-05-11T06:40:00",
    joinedISO: "2023-06-10",
    mfaEnabled: true,
    ssoLinked: true,
  },
  {
    id: "u-anil",
    name: "Anil Sharma",
    email: "anil.sharma@latentbridge.com",
    initials: "AS",
    avatarColor: "bg-success",
    jobTitle: "Head of Ops",
    department: "Operations",
    country: "IN",
    status: "active",
    roleIds: ["manager", "pmo_lead"],
    directGrants: ["delivery.portfolio.read"],
    lastActiveISO: "2026-05-10T22:15:00",
    joinedISO: "2023-04-01",
    mfaEnabled: true,
    ssoLinked: true,
  },
  {
    id: "u-meera",
    name: "Meera Krishnan",
    email: "meera.k@latentbridge.com",
    initials: "MK",
    avatarColor: "bg-brand-purple",
    jobTitle: "VP Engineering",
    department: "Engineering",
    country: "IN",
    status: "active",
    roleIds: ["manager"],
    directGrants: ["delivery.portfolio.read", "delivery.portfolio.write"],
    lastActiveISO: "2026-05-11T08:00:00",
    joinedISO: "2023-01-15",
    mfaEnabled: true,
    ssoLinked: true,
  },
  {
    id: "u-james",
    name: "James Whittaker",
    email: "james.w@latentbridge.com",
    initials: "JW",
    avatarColor: "bg-destructive",
    jobTitle: "HR Business Partner",
    department: "People",
    country: "UK",
    status: "active",
    roleIds: ["hr_ops"],
    directGrants: [],
    lastActiveISO: "2026-05-11T03:20:00",
    joinedISO: "2024-07-01",
    mfaEnabled: true,
    ssoLinked: true,
  },
  {
    id: "u-sophia",
    name: "Sophia Patel",
    email: "sophia.p@latentbridge.com",
    initials: "SP",
    avatarColor: "bg-brand-teal",
    jobTitle: "Recruiter (UK)",
    department: "People",
    country: "UK",
    status: "active",
    roleIds: ["recruiter"],
    directGrants: [],
    lastActiveISO: "2026-05-11T04:05:00",
    joinedISO: "2024-09-15",
    mfaEnabled: false,
    ssoLinked: true,
  },
  {
    id: "u-leo",
    name: "Leo Müller",
    email: "leo.m@latentbridge.com",
    initials: "LM",
    avatarColor: "bg-warning",
    jobTitle: "Auditor (External)",
    department: "External",
    country: "DE",
    status: "active",
    roleIds: ["auditor"],
    directGrants: [],
    lastActiveISO: "2026-05-09T15:00:00",
    joinedISO: "2026-01-15",
    mfaEnabled: true,
    ssoLinked: false,
  },
  {
    id: "u-grace",
    name: "Grace Liu",
    email: "grace.l@latentbridge.com",
    initials: "GL",
    avatarColor: "bg-brand",
    jobTitle: "Finance Lead",
    department: "Finance",
    country: "SG",
    status: "active",
    roleIds: ["finance_lead"],
    directGrants: [],
    lastActiveISO: "2026-05-11T00:30:00",
    joinedISO: "2024-04-01",
    mfaEnabled: true,
    ssoLinked: true,
  },
  {
    id: "u-noah",
    name: "Noah Williams",
    email: "noah.w@latentbridge.com",
    initials: "NW",
    avatarColor: "bg-blue-400",
    jobTitle: "Software Engineer",
    department: "Engineering",
    country: "US",
    status: "invited",
    roleIds: ["employee", "engineer"],
    directGrants: [],
    lastActiveISO: "2026-05-10T18:00:00",
    joinedISO: "2026-05-10",
    mfaEnabled: false,
    ssoLinked: false,
  },
  {
    id: "u-emma",
    name: "Emma Chen",
    email: "emma.c@latentbridge.com",
    initials: "EC",
    avatarColor: "bg-pink-400",
    jobTitle: "PM (suspended)",
    department: "Engineering",
    country: "IN",
    status: "suspended",
    roleIds: ["employee"],
    directGrants: [],
    lastActiveISO: "2026-04-22T11:00:00",
    joinedISO: "2024-11-01",
    mfaEnabled: true,
    ssoLinked: true,
  },
];

/* ── Audit log (admin actions) ─────────────────────────────── */

export interface AdminAuditEntry {
  id: string;
  whenISO: string;
  whenLabel: string;
  actorName: string;
  actorId: string;
  action:
    | "role_created" | "role_updated" | "role_deleted"
    | "user_invited" | "user_suspended" | "user_offboarded" | "user_role_changed"
    | "group_created" | "group_updated" | "group_deleted" | "group_member_added" | "group_member_removed"
    | "permission_granted" | "permission_revoked"
    | "entitlement_changed";
  /** Free-form summary line. */
  summary: string;
  /** Optional structured diff. */
  details?: { field: string; before: string; after: string }[];
}

export const ADMIN_AUDIT: AdminAuditEntry[] = [
  {
    id: "aa-001",
    whenISO: "2026-05-11T07:30:00",
    whenLabel: "11 May 2026, 7:30 AM",
    actorName: "Anita Verma",
    actorId: "u-anita",
    action: "user_role_changed",
    summary: "Granted role 'pmo_lead' to Anil Sharma.",
    details: [{ field: "roleIds", before: "[manager]", after: "[manager, pmo_lead]" }],
  },
  {
    id: "aa-002",
    whenISO: "2026-05-10T16:12:00",
    whenLabel: "10 May 2026, 4:12 PM",
    actorName: "Prashant Singh",
    actorId: "u-prashant",
    action: "entitlement_changed",
    summary: "Upgraded Delivery from Free → Pro.",
    details: [{ field: "delivery.tier", before: "free", after: "pro" }],
  },
  {
    id: "aa-003",
    whenISO: "2026-05-09T11:45:00",
    whenLabel: "9 May 2026, 11:45 AM",
    actorName: "Anita Verma",
    actorId: "u-anita",
    action: "user_invited",
    summary: "Invited Noah Williams (noah.w@latentbridge.com).",
  },
  {
    id: "aa-004",
    whenISO: "2026-05-08T09:15:00",
    whenLabel: "8 May 2026, 9:15 AM",
    actorName: "Anita Verma",
    actorId: "u-anita",
    action: "group_member_added",
    summary: "Added Rajiv Kumar to 'On-call rota (this week)'.",
  },
  {
    id: "aa-005",
    whenISO: "2026-05-07T15:00:00",
    whenLabel: "7 May 2026, 3:00 PM",
    actorName: "Anita Verma",
    actorId: "u-anita",
    action: "user_suspended",
    summary: "Suspended Emma Chen — pending HR review.",
  },
  {
    id: "aa-006",
    whenISO: "2026-05-05T12:30:00",
    whenLabel: "5 May 2026, 12:30 PM",
    actorName: "Anita Verma",
    actorId: "u-anita",
    action: "permission_granted",
    summary: "Granted direct permission 'delivery.portfolio.read' to Meera Krishnan.",
  },
];

/* ── Helpers ──────────────────────────────────────────────────── */

/** Returns the effective permission set for a user from roles + groups + direct grants. */
export function resolveEffectivePermissions(
  user: AdminUser,
  roles: AdminRole[],
  groups: UserGroup[],
): {
  permissions: string[];
  /** Map of permission key → why it was granted. */
  sources: Record<string, { kind: "role" | "group" | "direct"; sourceId: string; sourceLabel: string }[]>;
} {
  const sources: Record<string, { kind: "role" | "group" | "direct"; sourceId: string; sourceLabel: string }[]> = {};
  const add = (perm: string, src: { kind: "role" | "group" | "direct"; sourceId: string; sourceLabel: string }) => {
    if (!sources[perm]) sources[perm] = [];
    sources[perm].push(src);
  };
  for (const roleId of user.roleIds) {
    const r = roles.find((x) => x.id === roleId);
    if (!r) continue;
    for (const p of r.permissions) add(p, { kind: "role", sourceId: r.id, sourceLabel: r.name });
  }
  for (const g of groups) {
    if (!g.memberIds.includes(user.id)) continue;
    for (const p of g.permissions) add(p, { kind: "group", sourceId: g.id, sourceLabel: g.name });
  }
  for (const p of user.directGrants) {
    add(p, { kind: "direct", sourceId: user.id, sourceLabel: "Direct grant" });
  }
  return { permissions: Object.keys(sources), sources };
}

/** True when the entitlement covers this permission at the right tier. */
export function isPermissionEntitled(
  permKey: string,
  entitlements: TenantEntitlement[],
): boolean {
  const perm = ALL_PERMISSIONS.find((p) => p.key === permKey);
  if (!perm) return false;
  if (perm.module === "platform") return true; // platform perms are always available.
  const ent = entitlements.find((e) => e.module === perm.module);
  if (!ent) return false;
  if (perm.minTier && TIER_RANK[ent.tier] < TIER_RANK[perm.minTier]) return false;
  return true;
}
