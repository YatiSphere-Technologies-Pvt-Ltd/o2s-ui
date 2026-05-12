/* ================================================================
   O2S — Azure-style RBAC
   ----------------------------------------------------------------
   Model:
     • Role            — a named bundle of permissions, owned by a
                         module (Pre-Sales, Legal, Delivery, …) or
                         by the platform itself.
     • RoleAssignment  — Principal × Role × Scope.
     • Scope           — tenant | module | record. Mirrors Azure
                         subscription → resource-group → resource.

   Every assignment answers exactly one question:
     "Which user has which role on which thing?"

   Effective permissions for a user are computed by walking every
   assignment that *applies* to a resource (tenant- and module-
   scoped assignments cascade down to records).

   This file ships the role catalog + seed assignments. The store
   layers user mutations on top.
   ================================================================ */

import {
  ALL_PERMISSIONS,
  DELIVERY_PERMISSIONS,
  FINANCE_PERMISSIONS,
  IT_PERMISSIONS,
  LEAVE_PERMISSIONS,
  LEGAL_PERMISSIONS,
  PEOPLE_PERMISSIONS,
  PRESALES_PERMISSIONS,
  TALENT_PERMISSIONS,
  PLATFORM_PERMISSIONS,
  type ModuleKey,
} from "@/components/admin/data";

/* ───────────────────────── Roles ───────────────────────── */

export type RbacScopeKind = "tenant" | "module" | "record";

/** A role is owned by a module (or by the platform). */
export type RoleOwner = ModuleKey | "platform";

export interface RbacRole {
  id: string;
  name: string;
  description: string;
  /** Which module this role belongs to. Platform roles can be assigned tenant-wide. */
  owner: RoleOwner;
  /** Built-in roles ship with the product; custom roles are tenant-authored. */
  builtIn: boolean;
  /** The permissions this role grants. */
  permissions: string[];
  /** Tone for chip colour. */
  tone: "purple" | "teal" | "blue" | "amber" | "gray" | "red" | "green";
  /** Where in the assignment UI to recommend this role's default scope (matches Azure conventions). */
  recommendedScopeKind: RbacScopeKind;
  /** Whether assigning this role at the record scope makes sense (e.g. Reader/Contributor yes; Owner usually module-level). */
  assignableAtRecord: boolean;
}

/* Per-module role helpers: most modules get a 4-level ladder
   (Reader / Contributor / Manager / Owner) — Azure pattern. */

function readerRole(module: ModuleKey, name: string, permKeys: string[]): RbacRole {
  return {
    id: `${module}.reader`,
    name,
    description: `Read-only access to ${module}.`,
    owner: module,
    builtIn: true,
    permissions: permKeys.filter((k) => k.endsWith(".read") || k.endsWith(".view")),
    tone: "blue",
    recommendedScopeKind: "module",
    assignableAtRecord: true,
  };
}

function contributorRole(module: ModuleKey, name: string, permKeys: string[]): RbacRole {
  return {
    id: `${module}.contributor`,
    name,
    description: `Read + write within ${module}, no admin actions.`,
    owner: module,
    builtIn: true,
    permissions: permKeys.filter((k) => !k.endsWith(".admin") && !k.endsWith(".tenant.write")),
    tone: "teal",
    recommendedScopeKind: "module",
    assignableAtRecord: true,
  };
}

function ownerRole(module: ModuleKey, name: string, permKeys: string[]): RbacRole {
  return {
    id: `${module}.owner`,
    name,
    description: `Full control over ${module} including configuration.`,
    owner: module,
    builtIn: true,
    permissions: permKeys,
    tone: "purple",
    recommendedScopeKind: "module",
    assignableAtRecord: false,
  };
}

/* ── Role catalog ───────────────────────────────────────── */

export const RBAC_ROLES: RbacRole[] = [
  /* ── Platform roles (cross-module) ── */
  {
    id: "platform.super_admin",
    name: "Super Admin",
    description: "Full access platform-wide. Reserved for tenant owners. Sees every assignment in every module.",
    owner: "platform",
    builtIn: true,
    permissions: ALL_PERMISSIONS.map((p) => p.key),
    tone: "red",
    recommendedScopeKind: "tenant",
    assignableAtRecord: false,
  },
  {
    id: "platform.tenant_admin",
    name: "Tenant Admin",
    description: "Manages users, roles, groups, audit. Can't change paid entitlements.",
    owner: "platform",
    builtIn: true,
    permissions: PLATFORM_PERMISSIONS.filter((p) => p.key !== "platform.entitlements.write").map((p) => p.key),
    tone: "purple",
    recommendedScopeKind: "tenant",
    assignableAtRecord: false,
  },
  {
    id: "platform.security_reader",
    name: "Security Reader",
    description: "Read-only access to audit log, permissions, role assignments.",
    owner: "platform",
    builtIn: true,
    permissions: [
      "platform.audit.read",
      "platform.audit.export",
      "platform.entitlements.read",
      "platform.users.read",
      "platform.roles.read",
      "platform.groups.read",
    ],
    tone: "gray",
    recommendedScopeKind: "tenant",
    assignableAtRecord: false,
  },

  /* ── Pre-Sales (Reader / Contributor / Manager / Owner) ── */
  readerRole("presales",      "Pre-Sales Reader",      PRESALES_PERMISSIONS.map((p) => p.key)),
  contributorRole("presales", "Pre-Sales Contributor", PRESALES_PERMISSIONS.map((p) => p.key)),
  {
    id: "presales.manager",
    name: "Pre-Sales Manager",
    description: "Capture management + bid/no-bid + submission gate. Cannot mint roles.",
    owner: "presales",
    builtIn: true,
    permissions: [
      ...PRESALES_PERMISSIONS.filter((p) => p.key !== "presales.library.write").map((p) => p.key),
    ],
    tone: "amber",
    recommendedScopeKind: "module",
    assignableAtRecord: true,
  },
  ownerRole("presales", "Pre-Sales Owner", PRESALES_PERMISSIONS.map((p) => p.key)),

  /* ── Legal ── */
  readerRole("legal",      "Legal Reader",      LEGAL_PERMISSIONS.map((p) => p.key)),
  contributorRole("legal", "Legal Counsel",     LEGAL_PERMISSIONS.map((p) => p.key)),
  {
    id: "legal.head_of_legal",
    name: "Head of Legal",
    description: "Contract sign-off, playbook authority, DSAR + compliance act, board materials.",
    owner: "legal",
    builtIn: true,
    permissions: [
      ...LEGAL_PERMISSIONS.filter((p) => !["legal.ethics.act", "legal.ethics.read"].includes(p.key)).map((p) => p.key),
    ],
    tone: "amber",
    recommendedScopeKind: "module",
    assignableAtRecord: true,
  },
  ownerRole("legal", "General Counsel", LEGAL_PERMISSIONS.map((p) => p.key)),

  /* ── Delivery ── */
  readerRole("delivery",      "Delivery Reader",      DELIVERY_PERMISSIONS.map((p) => p.key)),
  contributorRole("delivery", "Delivery Contributor", DELIVERY_PERMISSIONS.map((p) => p.key)),
  {
    id: "delivery.pm",
    name: "Project Manager",
    description: "Run a project end-to-end. Sprints, capacity, allocation, releases.",
    owner: "delivery",
    builtIn: true,
    permissions: [
      "delivery.project.read",
      "delivery.project.write",
      "delivery.task.read",
      "delivery.task.write",
      "delivery.sprint.read",
      "delivery.sprint.write",
      "delivery.capacity.read",
      "delivery.capacity.write",
      "delivery.release.read",
      "delivery.release.write",
    ].filter((k) => DELIVERY_PERMISSIONS.some((p) => p.key === k)),
    tone: "amber",
    recommendedScopeKind: "record",
    assignableAtRecord: true,
  },
  ownerRole("delivery", "PMO Owner", DELIVERY_PERMISSIONS.map((p) => p.key)),

  /* ── Talent ── */
  readerRole("talent",      "Talent Reader",      TALENT_PERMISSIONS.map((p) => p.key)),
  contributorRole("talent", "Recruiter",          TALENT_PERMISSIONS.map((p) => p.key)),
  ownerRole("talent",       "Talent Lead",        TALENT_PERMISSIONS.map((p) => p.key)),

  /* ── People ── */
  readerRole("people",      "People Reader",      PEOPLE_PERMISSIONS.map((p) => p.key)),
  contributorRole("people", "People Contributor", PEOPLE_PERMISSIONS.map((p) => p.key)),
  ownerRole("people",       "HR Owner",           PEOPLE_PERMISSIONS.map((p) => p.key)),

  /* ── Leave ── */
  readerRole("leave",      "Leave Reader",      LEAVE_PERMISSIONS.map((p) => p.key)),
  contributorRole("leave", "Leave Approver",    LEAVE_PERMISSIONS.map((p) => p.key)),
  ownerRole("leave",       "Leave Owner",       LEAVE_PERMISSIONS.map((p) => p.key)),

  /* ── Finance ── */
  readerRole("finance",      "Finance Reader",      FINANCE_PERMISSIONS.map((p) => p.key)),
  contributorRole("finance", "Finance Contributor", FINANCE_PERMISSIONS.map((p) => p.key)),
  ownerRole("finance",       "Finance Owner",       FINANCE_PERMISSIONS.map((p) => p.key)),

  /* ── IT ── */
  readerRole("it",      "IT Reader",      IT_PERMISSIONS.map((p) => p.key)),
  contributorRole("it", "IT Contributor", IT_PERMISSIONS.map((p) => p.key)),
  ownerRole("it",       "IT Owner",       IT_PERMISSIONS.map((p) => p.key)),
];

export function roleById(id: string): RbacRole | undefined {
  return RBAC_ROLES.find((r) => r.id === id);
}

export function rolesByOwner(owner: RoleOwner): RbacRole[] {
  return RBAC_ROLES.filter((r) => r.owner === owner);
}

/* ───────────────────────── Scope ─────────────────────────
   Tenant scope:  { kind: "tenant" }
   Module scope:  { kind: "module", module: "legal" }
   Record scope:  { kind: "record", module: "presales", recordType: "pursuit", recordId: "PRS-BOB-001", recordLabel: "Bank of Baroda — Fraud RFP" }
   ──────────────────────────────────────────────────────── */

export type RecordType =
  | "pursuit"
  | "contract"
  | "project"
  | "matter"
  | "playbook"
  | "template"
  | "policy"
  | "campaign";

export const RECORD_TYPE_LABEL: Record<RecordType, string> = {
  pursuit:   "Pursuit",
  contract:  "Contract",
  project:   "Project",
  matter:    "Matter",
  playbook:  "Playbook",
  template:  "Template",
  policy:    "Policy",
  campaign:  "Campaign",
};

export type AssignmentScope =
  | { kind: "tenant" }
  | { kind: "module"; module: ModuleKey }
  | { kind: "record"; module: ModuleKey; recordType: RecordType; recordId: string; recordLabel: string };

export function scopeLabel(s: AssignmentScope): string {
  if (s.kind === "tenant") return "Tenant (all modules)";
  if (s.kind === "module") return `Module: ${s.module}`;
  return `${RECORD_TYPE_LABEL[s.recordType]}: ${s.recordLabel}`;
}

export function scopeChip(s: AssignmentScope): string {
  if (s.kind === "tenant") return "Tenant";
  if (s.kind === "module") return s.module;
  return `${s.module}/${s.recordId}`;
}

/* ───────────────────────── Principals ─────────────────────────
   A principal can be a user or a group. Service identities can be
   added later — same shape, different tone.
   ──────────────────────────────────────────────────────────── */

export type PrincipalKind = "user" | "group";

/* ───────────────────────── Role assignment ───────────────────────── */

export interface RoleAssignment {
  id: string;
  principalKind: PrincipalKind;
  principalId: string;
  roleId: string;
  scope: AssignmentScope;
  /** Free-text reason captured at grant time. */
  reason?: string;
  /** When the assignment was created. */
  createdAtISO: string;
  /** Who created it. */
  createdBy: string;
  /** Optional explicit expiry (Azure PIM style). */
  expiresAtISO?: string;
}

/* ── Seed assignments — match the existing seeded users so the
     compat shim degrades gracefully. ─────────────────────────── */

export const SEED_ASSIGNMENTS: RoleAssignment[] = [
  /* Prashant — Super Admin (tenant) */
  {
    id: "ra-001",
    principalKind: "user",
    principalId: "u-prashant",
    roleId: "platform.super_admin",
    scope: { kind: "tenant" },
    reason: "Founder / tenant owner",
    createdAtISO: "2025-01-01T00:00:00.000Z",
    createdBy: "system",
  },
  /* Anita — Tenant Admin (tenant) + HR Owner (module: people / leave) */
  {
    id: "ra-002",
    principalKind: "user",
    principalId: "u-anita",
    roleId: "platform.tenant_admin",
    scope: { kind: "tenant" },
    reason: "VP People Ops — tenant administration",
    createdAtISO: "2025-02-15T00:00:00.000Z",
    createdBy: "u-prashant",
  },
  {
    id: "ra-003",
    principalKind: "user",
    principalId: "u-anita",
    roleId: "people.owner",
    scope: { kind: "module", module: "people" },
    createdAtISO: "2025-02-15T00:00:00.000Z",
    createdBy: "u-prashant",
  },
  {
    id: "ra-004",
    principalKind: "user",
    principalId: "u-anita",
    roleId: "leave.owner",
    scope: { kind: "module", module: "leave" },
    createdAtISO: "2025-02-15T00:00:00.000Z",
    createdBy: "u-prashant",
  },

  /* Rajesh Kumar — Pre-Sales Manager (module) + Capture lead on one pursuit (record) */
  {
    id: "ra-010",
    principalKind: "user",
    principalId: "u-rajesh",
    roleId: "presales.manager",
    scope: { kind: "module", module: "presales" },
    createdAtISO: "2025-08-10T00:00:00.000Z",
    createdBy: "u-anita",
    reason: "VP Sales — capture management across all pursuits.",
  },
  {
    id: "ra-011",
    principalKind: "user",
    principalId: "u-rajesh",
    roleId: "presales.contributor",
    scope: { kind: "record", module: "presales", recordType: "pursuit", recordId: "PRS-BOB-001", recordLabel: "Bank of Baroda — Fraud Analytics" },
    createdAtISO: "2026-05-04T00:00:00.000Z",
    createdBy: "u-anita",
    reason: "Must-win pursuit — record-scoped grant for explicit accountability.",
  },

  /* Aanya Iyer — Legal Counsel (module) + Pre-Sales Reader (module) */
  {
    id: "ra-020",
    principalKind: "user",
    principalId: "u-aanya",
    roleId: "legal.head_of_legal",
    scope: { kind: "module", module: "legal" },
    createdAtISO: "2025-06-01T00:00:00.000Z",
    createdBy: "u-prashant",
  },
  {
    id: "ra-021",
    principalKind: "user",
    principalId: "u-aanya",
    roleId: "presales.reader",
    scope: { kind: "module", module: "presales" },
    createdAtISO: "2025-09-12T00:00:00.000Z",
    createdBy: "u-anita",
    reason: "Read access to pursuits during commercial-terms review.",
  },

  /* Karthik Subramanian — Delivery PM on two projects (record) */
  {
    id: "ra-030",
    principalKind: "user",
    principalId: "u-karthik",
    roleId: "delivery.contributor",
    scope: { kind: "module", module: "delivery" },
    createdAtISO: "2025-04-04T00:00:00.000Z",
    createdBy: "u-anita",
  },
  {
    id: "ra-031",
    principalKind: "user",
    principalId: "u-karthik",
    roleId: "delivery.pm",
    scope: { kind: "record", module: "delivery", recordType: "project", recordId: "PRJ-BOB-001", recordLabel: "BoB Fraud Analytics — Phase 1" },
    createdAtISO: "2026-04-12T00:00:00.000Z",
    createdBy: "u-rajesh",
  },
  {
    id: "ra-032",
    principalKind: "user",
    principalId: "u-karthik",
    roleId: "delivery.pm",
    scope: { kind: "record", module: "delivery", recordType: "project", recordId: "PRJ-DBS-002", recordLabel: "DBS Wealth Mgmt — Phase 2" },
    createdAtISO: "2026-03-20T00:00:00.000Z",
    createdBy: "u-rajesh",
  },

  /* Sandeep Mehta — Pre-Sales Contributor (module) */
  {
    id: "ra-040",
    principalKind: "user",
    principalId: "u-sandeep",
    roleId: "presales.contributor",
    scope: { kind: "module", module: "presales" },
    createdAtISO: "2025-11-08T00:00:00.000Z",
    createdBy: "u-rajesh",
  },

  /* Priya Reddy — Legal Reader (module) + Delivery Contributor (module) */
  {
    id: "ra-050",
    principalKind: "user",
    principalId: "u-priya",
    roleId: "legal.reader",
    scope: { kind: "module", module: "legal" },
    createdAtISO: "2025-12-01T00:00:00.000Z",
    createdBy: "u-aanya",
  },
  {
    id: "ra-051",
    principalKind: "user",
    principalId: "u-priya",
    roleId: "delivery.contributor",
    scope: { kind: "module", module: "delivery" },
    createdAtISO: "2025-12-01T00:00:00.000Z",
    createdBy: "u-anita",
  },

  /* Sneha Iyer — People Contributor + Leave Approver */
  {
    id: "ra-060",
    principalKind: "user",
    principalId: "u-sneha",
    roleId: "people.contributor",
    scope: { kind: "module", module: "people" },
    createdAtISO: "2025-05-04T00:00:00.000Z",
    createdBy: "u-anita",
  },
  {
    id: "ra-061",
    principalKind: "user",
    principalId: "u-sneha",
    roleId: "leave.contributor",
    scope: { kind: "module", module: "leave" },
    createdAtISO: "2025-05-04T00:00:00.000Z",
    createdBy: "u-anita",
  },

  /* Sarah Whitley — Pre-Sales Contributor (module, UK entity) */
  {
    id: "ra-070",
    principalKind: "user",
    principalId: "u-sarah",
    roleId: "presales.contributor",
    scope: { kind: "module", module: "presales" },
    createdAtISO: "2025-11-22T00:00:00.000Z",
    createdBy: "u-rajesh",
  },

  /* Liam Chen — Pre-Sales Contributor + Pre-Sales Manager on one pursuit */
  {
    id: "ra-080",
    principalKind: "user",
    principalId: "u-liam",
    roleId: "presales.contributor",
    scope: { kind: "module", module: "presales" },
    createdAtISO: "2025-08-04T00:00:00.000Z",
    createdBy: "u-rajesh",
  },
  {
    id: "ra-081",
    principalKind: "user",
    principalId: "u-liam",
    roleId: "presales.manager",
    scope: { kind: "record", module: "presales", recordType: "pursuit", recordId: "PRS-SHELL-006", recordLabel: "Shell — Brent Pilot Phase 2" },
    createdAtISO: "2026-03-12T00:00:00.000Z",
    createdBy: "u-rajesh",
  },

  /* Meera Pillai — Finance Owner (module) */
  {
    id: "ra-090",
    principalKind: "user",
    principalId: "u-meera",
    roleId: "finance.owner",
    scope: { kind: "module", module: "finance" },
    createdAtISO: "2025-02-15T00:00:00.000Z",
    createdBy: "u-prashant",
  },

  /* Auditor — Security Reader (tenant) */
  {
    id: "ra-100",
    principalKind: "user",
    principalId: "u-auditor",
    roleId: "platform.security_reader",
    scope: { kind: "tenant" },
    createdAtISO: "2025-04-04T00:00:00.000Z",
    createdBy: "u-prashant",
    reason: "External auditor — read-only on audit + entitlement",
  },
];

/* ───────────────────────── Resolution ─────────────────────────
   Given a user + a target scope, return all effective permissions.
   Cascade rules:
     • tenant assignment    → applies to every resource everywhere
     • module assignment    → applies to every record in that module
     • record assignment    → applies only to that exact record

   When a caller wants "what can this user do generally on module X",
   pass { kind: "module", module: X }. The resolver unions tenant +
   module-scoped assignments.
   ──────────────────────────────────────────────────────────── */

export interface EffectiveAssignment {
  assignmentId: string;
  roleId: string;
  scope: AssignmentScope;
}

export function assignmentApplies(a: RoleAssignment, target: AssignmentScope): boolean {
  if (a.scope.kind === "tenant") return true;
  if (a.scope.kind === "module") {
    if (target.kind === "tenant") return false;
    return target.kind === "module" || target.kind === "record"
      ? a.scope.module === (target as Extract<AssignmentScope, { module: ModuleKey }>).module
      : false;
  }
  // record
  if (target.kind !== "record") return false;
  return a.scope.module === target.module && a.scope.recordId === target.recordId;
}

export function effectivePermissions(
  assignments: RoleAssignment[],
  target: AssignmentScope,
  resolveRole: (id: string) => RbacRole | undefined = roleById,
): { perms: Set<string>; via: EffectiveAssignment[] } {
  const perms = new Set<string>();
  const via: EffectiveAssignment[] = [];
  for (const a of assignments) {
    if (!assignmentApplies(a, target)) continue;
    const role = resolveRole(a.roleId);
    if (!role) continue;
    via.push({ assignmentId: a.id, roleId: a.roleId, scope: a.scope });
    for (const p of role.permissions) perms.add(p);
  }
  return { perms, via };
}

export function principalHasPermission(
  assignments: RoleAssignment[],
  permKey: string,
  target: AssignmentScope = { kind: "tenant" },
  resolveRole: (id: string) => RbacRole | undefined = roleById,
): boolean {
  return effectivePermissions(assignments, target, resolveRole).perms.has(permKey);
}
