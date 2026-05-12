"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  Copy,
  FileLock2,
  Globe2,
  Layers,
  Plus,
  Shield,
  Sparkles,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useRbacStore, type AssignmentRow } from "@/lib/rbac-store";
import {
  ADMIN_USERS,
  ALL_PERMISSIONS,
  MODULES,
  type ModuleKey,
  type PermissionDef,
} from "@/components/admin/data";
import {
  RECORD_TYPE_LABEL,
  type AssignmentScope,
  type RbacRole,
  type RecordType,
} from "@/components/admin/rbac";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";

const TONE_TINT: Record<RbacRole["tone"], string> = {
  red:    "bg-destructive/10 text-destructive",
  purple: "bg-brand-purple/10 text-brand-purple",
  teal:   "bg-brand-teal/10 text-brand-teal",
  blue:   "bg-brand/10 text-brand",
  amber:  "bg-warning/10 text-warning",
  green:  "bg-success/10 text-success",
  gray:   "bg-secondary text-muted-foreground",
};

/**
 * Per-module RBAC surface.
 *
 * - Roles tab: only roles owned by this module.
 * - Assignments tab: only assignments whose scope is this module
 *   (module-scoped or record-scoped). Tenant-cascade grants are shown
 *   read-only on the side as "inherited from tenant".
 * - Permissions tab: every permission defined for this module.
 *
 * Module owners use this. Super Admin keeps the cross-module view at
 * /admin/rbac/*.
 */
export interface ModuleAccessPageProps {
  module: ModuleKey;
  moduleLabel: string;
  /** Module home href for the back-link. */
  homeHref: string;
  /** Accent class for the icon tile (e.g. "bg-destructive/10 text-destructive"). */
  accent: string;
  /** Lucide icon for the page header. */
  icon: React.ComponentType<{ className?: string }>;
}

export function ModuleAccessPage(props: ModuleAccessPageProps) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto py-12 text-sm text-muted-foreground">Loading…</div>}>
      <ModuleAccessPageInner {...props} />
    </Suspense>
  );
}

type Tab = "roles" | "assignments" | "permissions";

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "roles",       label: "Roles",       icon: UserCheck },
  { key: "assignments", label: "Assignments", icon: Shield },
  { key: "permissions", label: "Permissions", icon: FileLock2 },
];

function ModuleAccessPageInner({ module, moduleLabel, homeHref, accent, icon: Icon }: ModuleAccessPageProps) {
  const { setScreen } = useScreen();
  const sp = useSearchParams();
  const initialTab = (sp.get("tab") as Tab) ?? "roles";

  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    setScreen({ module: moduleLabel, page: "Access control" });
    return () => setScreen(null);
  }, [moduleLabel, setScreen]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href={homeHref}
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-start gap-3">
          <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
            <Icon className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{moduleLabel} · Access control</h1>
            <p className="text-sm text-muted-foreground">
              Roles, assignments, and permissions specific to this module. Tenant-wide grants cascade in automatically.
            </p>
          </div>
        </div>
        <Link
          href={`/admin/rbac/assignments?module=${module}`}
          className="ml-auto inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm text-foreground hover:bg-surface-overlay transition-colors"
        >
          Super Admin view
          <ChevronRight className="size-3.5" />
        </Link>
      </motion.div>

      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map(({ key, label, icon: TabIcon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === key
                ? "text-brand-purple border-brand-purple font-medium"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <TabIcon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      {tab === "roles" && <RolesTab module={module} moduleLabel={moduleLabel} />}
      {tab === "assignments" && <AssignmentsTab module={module} moduleLabel={moduleLabel} />}
      {tab === "permissions" && <PermissionsTab module={module} />}
    </div>
  );
}

/* ───────────────────────── Roles tab ───────────────────────── */

interface RoleRow {
  role: RbacRole;
  assignmentCount: number;
}

function RolesTab({ module, moduleLabel }: { module: ModuleKey; moduleLabel: string }) {
  const { roles, cloneRole, deleteRole, assignmentRows } = useRbacStore();

  const data = useMemo<RoleRow[]>(() => {
    const counts = new Map<string, number>();
    for (const a of assignmentRows) counts.set(a.roleId, (counts.get(a.roleId) ?? 0) + 1);
    return roles
      .filter((r) => r.owner === module)
      .map((r) => ({ role: r, assignmentCount: counts.get(r.id) ?? 0 }));
  }, [roles, assignmentRows, module]);

  const columns = useMemo<ColumnDef<RoleRow, unknown>[]>(() => [
    {
      id: "name",
      header: "Role",
      accessorFn: (r) => r.role.name,
      cell: ({ row }) => {
        const r = row.original.role;
        return (
          <div className="min-w-0 py-1.5">
            <Link href={`/admin/rbac/roles/${encodeURIComponent(r.id)}`} className="text-sm font-medium text-foreground hover:underline">
              {r.name}
            </Link>
            <p className="text-[10px] font-mono text-muted-foreground/60 truncate max-w-72">{r.id}</p>
          </div>
        );
      },
    },
    {
      id: "kind",
      header: "Kind",
      accessorFn: (r) => (r.role.builtIn ? "built_in" : "custom"),
      cell: ({ row }) => {
        const r = row.original.role;
        return (
          <span className={`inline-flex items-center text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${TONE_TINT[r.tone]}`}>
            {r.builtIn ? "Built-in" : "Custom"}
          </span>
        );
      },
    },
    {
      id: "description",
      header: "Description",
      enableSorting: false,
      accessorFn: (r) => r.role.description,
      cell: ({ row }) => (
        <p className="text-[12px] text-muted-foreground truncate max-w-96">{row.original.role.description}</p>
      ),
    },
    {
      id: "permCount",
      header: "Perms",
      accessorFn: (r) => r.role.permissions.length,
      cell: ({ row }) => (
        <span className="text-[12px] tabular-nums text-foreground">{row.original.role.permissions.length}</span>
      ),
    },
    {
      id: "scope",
      header: "Default scope",
      accessorFn: (r) => r.role.recommendedScopeKind,
      cell: ({ row }) => (
        <span className="text-[11px] capitalize text-foreground">{row.original.role.recommendedScopeKind}</span>
      ),
    },
    {
      id: "atRecord",
      header: "At-record?",
      accessorFn: (r) => r.role.assignableAtRecord,
      cell: ({ row }) => (
        row.original.role.assignableAtRecord
          ? <Check className="size-3.5 text-success" />
          : <span className="text-muted-foreground/60 text-[11px]">No</span>
      ),
    },
    {
      id: "assignments",
      header: "Assigned",
      accessorFn: (r) => r.assignmentCount,
      cell: ({ row }) => (
        <Link
          href={`/admin/rbac/assignments?role=${encodeURIComponent(row.original.role.id)}`}
          className="text-[12px] tabular-nums text-brand hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.assignmentCount}
        </Link>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const r = row.original.role;
        return (
          <div className="flex items-center gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                const name = window.prompt(`Clone "${r.name}" as…`, `${r.name} (custom)`);
                if (name) cloneRole(r.id, name);
              }}
              className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] bg-secondary text-foreground hover:bg-surface-overlay transition-colors"
              title="Clone role"
            >
              <Copy className="size-3" />
              Clone
            </button>
            <Link
              href={`/admin/rbac/roles/${encodeURIComponent(r.id)}`}
              className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-colors"
            >
              <Sparkles className="size-3" />
              Edit
            </Link>
            {!r.builtIn && (
              <button
                onClick={() => {
                  if (window.confirm(`Delete custom role "${r.name}"?`)) deleteRole(r.id);
                }}
                className="p-1 rounded text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label="Delete role"
              >
                <Trash2 className="size-3" />
              </button>
            )}
          </div>
        );
      },
    },
  ], [cloneRole, deleteRole]);

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground">
        {data.length} role{data.length === 1 ? "" : "s"} owned by {moduleLabel}. Cross-module / platform roles are managed at <Link href="/admin/rbac/roles" className="text-brand hover:underline">/admin/rbac/roles</Link>.
      </p>
      <DataTable<RoleRow>
        columns={columns}
        data={data}
        searchPlaceholder={`Search ${moduleLabel} roles…`}
        emptyLabel={`${moduleLabel} doesn't ship any built-in roles yet.`}
        initialSort={[{ id: "name", desc: false }]}
        initialPageSize={25}
      />
    </div>
  );
}

/* ───────────────────────── Assignments tab ───────────────────────── */

type ScopeFilter = "all" | "module" | "record";

function AssignmentsTab({ module, moduleLabel }: { module: ModuleKey; moduleLabel: string }) {
  const { assignmentRows, roles, grantRole, revokeAssignment } = useRbacStore();
  const sp = useSearchParams();
  const initialRole = sp.get("role") ?? "all";

  const [roleFilter, setRoleFilter] = useState(initialRole);
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [showForm, setShowForm] = useState(false);

  // Module-scoped assignments only — tenant-cascade rows live in the side card.
  const moduleData = useMemo(() => {
    return assignmentRows.filter((a) => {
      if (a.scope.kind === "tenant") return false;
      if (a.scope.module !== module) return false;
      if (roleFilter !== "all" && a.roleId !== roleFilter) return false;
      if (scopeFilter !== "all" && a.scope.kind !== scopeFilter) return false;
      return true;
    });
  }, [assignmentRows, module, roleFilter, scopeFilter]);

  const tenantCascade = useMemo(
    () => assignmentRows.filter((a) => a.scope.kind === "tenant"),
    [assignmentRows],
  );

  // Roles assignable in this module (module-owned + platform).
  const assignableRoles = useMemo(
    () => roles.filter((r) => r.owner === module || r.owner === "platform"),
    [roles, module],
  );

  const columns = useMemo<ColumnDef<AssignmentRow, unknown>[]>(() => [
    {
      id: "principal",
      header: "Principal",
      accessorFn: (a) => a.principalLabel,
      cell: ({ row }) => {
        const a = row.original;
        return (
          <div className="min-w-0 py-1.5">
            <p className="text-sm text-foreground truncate">{a.principalLabel}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{a.principalKind}</p>
          </div>
        );
      },
    },
    {
      id: "role",
      header: "Role",
      accessorFn: (a) => a.role.name,
      cell: ({ row }) => (
        <Link
          href={`/admin/rbac/roles/${encodeURIComponent(row.original.role.id)}`}
          className="text-sm text-foreground hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.role.name}
        </Link>
      ),
    },
    {
      id: "scope",
      header: "Scope",
      accessorFn: (a) => a.scope.kind,
      cell: ({ row }) => <ScopeChip scope={row.original.scope} />,
    },
    {
      id: "target",
      header: "Target",
      enableSorting: false,
      accessorFn: (a) => (a.scope.kind === "record" ? a.scope.recordId : ""),
      cell: ({ row }) => {
        const s = row.original.scope;
        if (s.kind === "module") return <span className="text-[11px] text-muted-foreground">All of {moduleLabel}</span>;
        if (s.kind === "record") {
          return (
            <div className="text-[11px] min-w-0">
              <p className="text-foreground truncate max-w-72">{s.recordLabel}</p>
              <p className="text-[10px] text-muted-foreground/70 truncate">
                {RECORD_TYPE_LABEL[s.recordType]} · <code className="font-mono">{s.recordId}</code>
              </p>
            </div>
          );
        }
        return <span className="text-[11px] text-muted-foreground/40">—</span>;
      },
    },
    {
      id: "reason",
      header: "Reason",
      enableSorting: false,
      accessorFn: (a) => a.reason ?? "",
      cell: ({ row }) => (
        row.original.reason
          ? <span className="text-[11px] text-muted-foreground italic truncate max-w-64 inline-block">{row.original.reason}</span>
          : <span className="text-[11px] text-muted-foreground/40">—</span>
      ),
    },
    {
      id: "granted",
      header: "Granted",
      accessorFn: (a) => a.createdAtISO,
      cell: ({ row }) => (
        <span className="text-[11px] text-muted-foreground tabular-nums">{row.original.createdAtISO.slice(0, 10)}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const a = row.original;
        return (
          <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                if (window.confirm(`Revoke ${a.role.name} from ${a.principalLabel}?`)) revokeAssignment(a.id);
              }}
              className="p-1 rounded text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Revoke"
              title="Revoke assignment"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        );
      },
    },
  ], [moduleLabel, revokeAssignment]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-[11px] text-muted-foreground">
            {moduleData.length} module-scoped assignment{moduleData.length === 1 ? "" : "s"}.
          </p>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand-purple text-white text-sm font-medium hover:bg-brand-purple/90 transition-colors"
          >
            <Plus className="size-3.5" />
            Add assignment
          </button>
        </div>

        {showForm && (
          <AddAssignmentForm
            module={module}
            moduleLabel={moduleLabel}
            assignableRoles={assignableRoles}
            onClose={() => setShowForm(false)}
            onGrant={(p) => {
              grantRole(p);
              setShowForm(false);
            }}
          />
        )}

        <DataTable<AssignmentRow>
          columns={columns}
          data={moduleData}
          searchPlaceholder={`Search ${moduleLabel} assignments…`}
          emptyLabel="No module-scoped assignments. Grant one above."
          initialSort={[{ id: "principal", desc: false }]}
          initialPageSize={25}
          toolbar={
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-8 px-2 rounded-lg border border-input bg-card text-[11px] text-foreground max-w-44"
              >
                <option value="all">All roles</option>
                {assignableRoles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value as ScopeFilter)}
                className="h-8 px-2 rounded-lg border border-input bg-card text-[11px] text-foreground"
              >
                <option value="all">All scopes</option>
                <option value="module">Module</option>
                <option value="record">Record</option>
              </select>
            </div>
          }
        />
      </div>

      <div className="space-y-3">
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
            <Globe2 className="size-3.5 text-destructive" />
            <p className="text-[11px] font-semibold text-foreground">Inherited from tenant</p>
            <span className="text-[10px] text-muted-foreground ml-auto">{tenantCascade.length}</span>
          </header>
          <ul>
            {tenantCascade.slice(0, 8).map((a) => (
              <li key={a.id} className="px-3 py-2 border-b border-border last:border-b-0 text-[12px]">
                <div className="flex items-center gap-2">
                  <p className="text-foreground truncate flex-1">{a.principalLabel}</p>
                  <Link
                    href={`/admin/rbac/roles/${encodeURIComponent(a.role.id)}`}
                    className="text-muted-foreground hover:underline truncate"
                  >
                    {a.role.name}
                  </Link>
                </div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Cascades from tenant scope</p>
              </li>
            ))}
            {tenantCascade.length === 0 && (
              <li className="px-3 py-4 text-center text-[11px] text-muted-foreground italic">No tenant-wide grants.</li>
            )}
          </ul>
        </section>

        <p className="text-[10px] text-muted-foreground/70 leading-snug">
          Tenant-scoped grants (e.g. Super Admin) apply here automatically and can&apos;t be revoked from this view.
          Go to <Link href="/admin/rbac/assignments" className="text-brand hover:underline">/admin/rbac/assignments</Link> to manage them.
        </p>
      </div>
    </div>
  );
}

function ScopeChip({ scope }: { scope: AssignmentScope }) {
  if (scope.kind === "module") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium bg-brand-purple/10 text-brand-purple">
        <Building2 className="size-2.5" />
        Module
      </span>
    );
  }
  if (scope.kind === "record") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium bg-brand-teal/10 text-brand-teal">
        <Layers className="size-2.5" />
        Record
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium bg-destructive/10 text-destructive">
      <Globe2 className="size-2.5" />
      Tenant
    </span>
  );
}

/* ───────────────────────── Permissions tab ───────────────────────── */

function PermissionsTab({ module }: { module: ModuleKey }) {
  const data = useMemo(() => ALL_PERMISSIONS.filter((p) => p.module === module), [module]);

  const columns = useMemo<ColumnDef<PermissionDef, unknown>[]>(() => [
    {
      id: "key",
      header: "Permission",
      accessorFn: (p) => p.key,
      cell: ({ row }) => (
        <code className="text-[11px] font-mono text-foreground">{row.original.key}</code>
      ),
    },
    {
      id: "label",
      header: "Label",
      accessorFn: (p) => p.label,
      cell: ({ row }) => (
        <span className="text-[12px] text-foreground">{row.original.label}</span>
      ),
    },
    {
      id: "group",
      header: "Group",
      accessorFn: (p) => p.group,
      cell: ({ row }) => (
        <span className="text-[11px] text-muted-foreground">{row.original.group}</span>
      ),
    },
    {
      id: "description",
      header: "Description",
      enableSorting: false,
      accessorFn: (p) => p.description,
      cell: ({ row }) => (
        <p className="text-[11px] text-muted-foreground truncate max-w-96">{row.original.description}</p>
      ),
    },
    {
      id: "minTier",
      header: "Min tier",
      accessorFn: (p) => p.minTier ?? "—",
      cell: ({ row }) => (
        <span className="text-[11px] capitalize text-muted-foreground">{row.original.minTier ?? "—"}</span>
      ),
    },
  ], []);

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground">
        {data.length} permission{data.length === 1 ? "" : "s"} defined for this module.
      </p>
      <DataTable<PermissionDef>
        columns={columns}
        data={data}
        searchPlaceholder="Search permissions…"
        emptyLabel="No permissions defined."
        initialSort={[{ id: "group", desc: false }]}
        initialPageSize={50}
      />
    </div>
  );
}

/* ───────────────────────── Add assignment form ───────────────────────── */

function AddAssignmentForm({
  module,
  moduleLabel,
  assignableRoles,
  onClose,
  onGrant,
}: {
  module: ModuleKey;
  moduleLabel: string;
  assignableRoles: RbacRole[];
  onClose: () => void;
  onGrant: (p: {
    principalKind: "user" | "group";
    principalId: string;
    roleId: string;
    scope: AssignmentScope;
    reason?: string;
  }) => void;
}) {
  const [principalId, setPrincipalId] = useState(ADMIN_USERS[0]?.id ?? "");
  const [roleId, setRoleId] = useState(assignableRoles[0]?.id ?? "");
  const [scopeKind, setScopeKind] = useState<"module" | "record">("module");
  const [recordType, setRecordType] = useState<RecordType>("pursuit");
  const [recordId, setRecordId] = useState("");
  const [recordLabel, setRecordLabel] = useState("");
  const [reason, setReason] = useState("");

  // Default scope-kind tracks the chosen role's recommendation (clamped to module/record).
  useEffect(() => {
    const role = assignableRoles.find((r) => r.id === roleId);
    if (!role) return;
    if (role.recommendedScopeKind === "record" && role.assignableAtRecord) setScopeKind("record");
    else setScopeKind("module");
  }, [roleId, assignableRoles]);

  const role = assignableRoles.find((r) => r.id === roleId);

  function submit() {
    if (!role) return;
    let scope: AssignmentScope;
    if (scopeKind === "module") {
      scope = { kind: "module", module };
    } else {
      if (!recordId || !recordLabel) {
        window.alert("Provide record id + label for a record-scoped grant.");
        return;
      }
      scope = { kind: "record", module, recordType, recordId, recordLabel };
    }
    onGrant({
      principalKind: "user",
      principalId,
      roleId,
      scope,
      reason: reason.trim() || undefined,
    });
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <header className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">New {moduleLabel} role assignment</p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Principal</label>
          <select
            value={principalId}
            onChange={(e) => setPrincipalId(e.target.value)}
            className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground"
          >
            {ADMIN_USERS.map((u) => (
              <option key={u.id} value={u.id}>{u.name} — {u.jobTitle}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Role</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground"
          >
            {assignableRoles.map((r) => (
              <option key={r.id} value={r.id}>{r.name} ({r.owner === "platform" ? "platform" : r.owner})</option>
            ))}
          </select>
          {role && <p className="text-[10px] text-muted-foreground/70 mt-1">{role.description}</p>}
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Scope</label>
        <div className="mt-1 flex items-center gap-1.5">
          <button
            onClick={() => setScopeKind("module")}
            className={`h-8 px-3 rounded text-[11px] transition-colors ${
              scopeKind === "module"
                ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/30"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            All of {moduleLabel}
          </button>
          <button
            onClick={() => setScopeKind("record")}
            disabled={!!role && !role.assignableAtRecord}
            title={role && !role.assignableAtRecord ? "This role can't be assigned at the record scope" : undefined}
            className={`h-8 px-3 rounded text-[11px] transition-colors ${
              scopeKind === "record"
                ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/30"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            Single record
          </button>
        </div>
        {scopeKind === "record" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value as RecordType)}
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
            >
              {(Object.keys(RECORD_TYPE_LABEL) as RecordType[]).map((t) => (
                <option key={t} value={t}>{RECORD_TYPE_LABEL[t]}</option>
              ))}
            </select>
            <input
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
              placeholder="Record id (e.g. PRS-BOB-001)"
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
            />
            <input
              value={recordLabel}
              onChange={(e) => setRecordLabel(e.target.value)}
              placeholder="Record label"
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
            />
          </div>
        )}
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Reason (optional)</label>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why this grant? Surfaces in audit + my-access."
          className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button onClick={onClose} className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
        <button
          onClick={submit}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand-purple text-white text-sm font-medium hover:bg-brand-purple/90 transition-colors"
        >
          Grant role
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/* Silence unused MODULES import — used for Module label lookups indirectly. */
void MODULES;
