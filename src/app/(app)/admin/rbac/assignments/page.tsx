"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Globe2,
  Layers,
  Plus,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useRbacStore, type AssignmentRow } from "@/lib/rbac-store";
import { ADMIN_USERS, MODULES, type ModuleKey } from "@/components/admin/data";
import {
  RECORD_TYPE_LABEL,
  type AssignmentScope,
  type RecordType,
} from "@/components/admin/rbac";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";

type ScopeFilter = "all" | "tenant" | "module" | "record";

export default function AssignmentsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto py-12 text-sm text-muted-foreground">Loading…</div>}>
      <AssignmentsPageInner />
    </Suspense>
  );
}

function AssignmentsPageInner() {
  const { setScreen } = useScreen();
  const { roles, assignmentRows, grantRole, revokeAssignment } = useRbacStore();
  const sp = useSearchParams();

  const initialRole = sp.get("role") ?? "all";
  const initialModule = sp.get("module") ?? "all";

  const [roleFilter, setRoleFilter] = useState(initialRole);
  const [moduleFilter, setModuleFilter] = useState(initialModule);
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setScreen({ module: "Admin", page: "Role assignments" });
    return () => setScreen(null);
  }, [setScreen]);

  const data = useMemo<AssignmentRow[]>(() => {
    return assignmentRows.filter((a) => {
      if (roleFilter !== "all" && a.roleId !== roleFilter) return false;
      if (moduleFilter !== "all") {
        if (a.scope.kind === "tenant") {
          // tenant cascades — keep
        } else if (a.scope.module !== moduleFilter) return false;
      }
      if (scopeFilter !== "all" && a.scope.kind !== scopeFilter) return false;
      return true;
    });
  }, [assignmentRows, roleFilter, moduleFilter, scopeFilter]);

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
      cell: ({ row }) => {
        const a = row.original;
        return (
          <Link
            href={`/admin/rbac/roles/${encodeURIComponent(a.role.id)}`}
            className="text-sm text-foreground hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {a.role.name}
          </Link>
        );
      },
    },
    {
      id: "roleOwner",
      header: "Owner",
      accessorFn: (a) => a.role.owner,
      cell: ({ row }) => (
        <span className="text-[11px] text-muted-foreground capitalize">
          {row.original.role.owner === "platform"
            ? "Platform"
            : MODULES.find((m) => m.key === row.original.role.owner)?.label ?? row.original.role.owner}
        </span>
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
      accessorFn: (a) => {
        if (a.scope.kind === "tenant") return "all";
        if (a.scope.kind === "module") return a.scope.module;
        return a.scope.recordId;
      },
      cell: ({ row }) => {
        const s = row.original.scope;
        if (s.kind === "tenant") return <span className="text-[11px] text-muted-foreground">All modules</span>;
        if (s.kind === "module") {
          return <span className="text-[11px] text-foreground">{MODULES.find((m) => m.key === s.module)?.label ?? s.module}</span>;
        }
        return (
          <div className="text-[11px] min-w-0">
            <p className="text-foreground truncate max-w-72">{s.recordLabel}</p>
            <p className="text-[10px] text-muted-foreground/70 truncate">
              {MODULES.find((m) => m.key === s.module)?.label ?? s.module} · {RECORD_TYPE_LABEL[s.recordType]} · <code className="font-mono">{s.recordId}</code>
            </p>
          </div>
        );
      },
    },
    {
      id: "reason",
      header: "Reason",
      enableSorting: false,
      accessorFn: (a) => a.reason ?? "",
      cell: ({ row }) => (
        row.original.reason
          ? <p className="text-[11px] text-muted-foreground italic truncate max-w-64">{row.original.reason}</p>
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
  ], [revokeAssignment]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/admin"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
              <Shield className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Role assignments</h1>
              <p className="text-sm text-muted-foreground">
                Every principal × role × scope. Tenant assignments cascade to every module; module assignments to every record in that module.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand-purple text-white text-sm font-medium hover:bg-brand-purple/90 transition-colors"
        >
          <Plus className="size-3.5" />
          Add assignment
        </button>
      </motion.div>

      {showForm && (
        <AddAssignmentForm
          onClose={() => setShowForm(false)}
          onGrant={(p) => {
            grantRole(p);
            setShowForm(false);
          }}
        />
      )}

      <DataTable<AssignmentRow>
        columns={columns}
        data={data}
        searchPlaceholder="Search principal, role, target…"
        emptyLabel="No assignments match these filters."
        initialPageSize={25}
        initialSort={[{ id: "principal", desc: false }]}
        toolbar={
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-8 px-2 rounded-lg border border-input bg-card text-[11px] text-foreground max-w-44"
            >
              <option value="all">All roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="h-8 px-2 rounded-lg border border-input bg-card text-[11px] text-foreground"
            >
              <option value="all">All modules</option>
              {MODULES.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value as ScopeFilter)}
              className="h-8 px-2 rounded-lg border border-input bg-card text-[11px] text-foreground"
            >
              <option value="all">All scopes</option>
              <option value="tenant">Tenant</option>
              <option value="module">Module</option>
              <option value="record">Record</option>
            </select>
          </div>
        }
      />
    </div>
  );
}

function ScopeChip({ scope }: { scope: AssignmentScope }) {
  if (scope.kind === "tenant") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium bg-destructive/10 text-destructive">
        <Globe2 className="size-2.5" />
        Tenant
      </span>
    );
  }
  if (scope.kind === "module") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium bg-brand-purple/10 text-brand-purple">
        <Building2 className="size-2.5" />
        Module
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium bg-brand-teal/10 text-brand-teal">
      <Layers className="size-2.5" />
      Record
    </span>
  );
}

function AddAssignmentForm({
  onClose,
  onGrant,
}: {
  onClose: () => void;
  onGrant: (p: {
    principalKind: "user" | "group";
    principalId: string;
    roleId: string;
    scope: AssignmentScope;
    reason?: string;
  }) => void;
}) {
  const { roles } = useRbacStore();
  const [principalId, setPrincipalId] = useState(ADMIN_USERS[0]?.id ?? "");
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "");
  const [scopeKind, setScopeKind] = useState<"tenant" | "module" | "record">("module");
  const [scopeModule, setScopeModule] = useState<ModuleKey>("presales");
  const [recordType, setRecordType] = useState<RecordType>("pursuit");
  const [recordId, setRecordId] = useState("");
  const [recordLabel, setRecordLabel] = useState("");
  const [reason, setReason] = useState("");

  // Suggest scope-kind from role's recommendation when role changes.
  useEffect(() => {
    const role = roles.find((r) => r.id === roleId);
    if (role) setScopeKind(role.recommendedScopeKind);
  }, [roleId, roles]);

  const role = roles.find((r) => r.id === roleId);

  function submit() {
    let scope: AssignmentScope;
    if (scopeKind === "tenant") scope = { kind: "tenant" };
    else if (scopeKind === "module") scope = { kind: "module", module: scopeModule };
    else {
      if (!recordId || !recordLabel) {
        window.alert("Provide record id + label for a record-scoped grant.");
        return;
      }
      scope = { kind: "record", module: scopeModule, recordType, recordId, recordLabel };
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
        <p className="text-sm font-semibold text-foreground">New role assignment</p>
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
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name} ({r.owner === "platform" ? "platform" : r.owner})</option>
            ))}
          </select>
          {role && <p className="text-[10px] text-muted-foreground/70 mt-1">{role.description}</p>}
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Scope</label>
        <div className="mt-1 flex items-center gap-1.5">
          {(["tenant", "module", "record"] as const).map((k) => {
            const disabled = k === "record" && role && !role.assignableAtRecord;
            return (
              <button
                key={k}
                onClick={() => setScopeKind(k)}
                disabled={!!disabled}
                title={disabled ? "This role can't be assigned at the record scope" : undefined}
                className={`h-8 px-3 rounded text-[11px] transition-colors capitalize ${
                  scopeKind === k
                    ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/30"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {k}
              </button>
            );
          })}
        </div>
        {scopeKind !== "tenant" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <select
              value={scopeModule}
              onChange={(e) => setScopeModule(e.target.value as ModuleKey)}
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
            >
              {MODULES.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
            {scopeKind === "record" && (
              <>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value as RecordType)}
                  className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
                >
                  {(Object.keys(RECORD_TYPE_LABEL) as RecordType[]).map((t) => (
                    <option key={t} value={t}>{RECORD_TYPE_LABEL[t]}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
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
              </>
            )}
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
