"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  Copy,
  Globe2,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useRbacStore } from "@/lib/rbac-store";
import { MODULES, type ModuleKey } from "@/components/admin/data";
import type { RbacRole, RoleOwner } from "@/components/admin/rbac";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";

type OwnerFilter = "all" | RoleOwner;

const TONE_TINT: Record<RbacRole["tone"], string> = {
  red:    "bg-destructive/10 text-destructive",
  purple: "bg-brand-purple/10 text-brand-purple",
  teal:   "bg-brand-teal/10 text-brand-teal",
  blue:   "bg-brand/10 text-brand",
  amber:  "bg-warning/10 text-warning",
  green:  "bg-success/10 text-success",
  gray:   "bg-secondary text-muted-foreground",
};

interface RoleRow {
  role: RbacRole;
  assignmentCount: number;
  ownerLabel: string;
}

export default function RbacRolesPage() {
  const { setScreen } = useScreen();
  const { roles, cloneRole, deleteRole, assignmentRows, stats } = useRbacStore();
  const [owner, setOwner] = useState<OwnerFilter>("all");
  const [showCustomOnly, setShowCustomOnly] = useState(false);

  useEffect(() => {
    setScreen({ module: "Admin", page: "Roles" });
    return () => setScreen(null);
  }, [setScreen]);

  const data = useMemo<RoleRow[]>(() => {
    const counts = new Map<string, number>();
    for (const a of assignmentRows) counts.set(a.roleId, (counts.get(a.roleId) ?? 0) + 1);
    return roles
      .filter((r) => (owner === "all" ? true : r.owner === owner))
      .filter((r) => (showCustomOnly ? !r.builtIn : true))
      .map((r) => ({
        role: r,
        assignmentCount: counts.get(r.id) ?? 0,
        ownerLabel: r.owner === "platform" ? "Platform" : (MODULES.find((m) => m.key === r.owner)?.label ?? r.owner),
      }));
  }, [roles, assignmentRows, owner, showCustomOnly]);

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
      id: "owner",
      header: "Module",
      accessorFn: (r) => r.ownerLabel,
      cell: ({ row }) => {
        const r = row.original;
        const isPlatform = r.role.owner === "platform";
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${
            isPlatform ? "bg-destructive/10 text-destructive" : "bg-secondary text-muted-foreground"
          }`}>
            {isPlatform ? <Globe2 className="size-2.5" /> : <Building2 className="size-2.5" />}
            {r.ownerLabel}
          </span>
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
      accessorFn: (r) => r.role.description,
      cell: ({ row }) => (
        <p className="text-[12px] text-muted-foreground truncate max-w-96">{row.original.role.description}</p>
      ),
      enableSorting: false,
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
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Roles</h1>
              <p className="text-sm text-muted-foreground">
                Azure-style catalog. Each module ships built-in roles; clone any role to mint a custom one.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/rbac/assignments"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            Assignments
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Kpi label="Total roles" value={stats.totalRoles.toString()} />
        <Kpi label="Built-in" value={(stats.totalRoles - stats.customRoleCount).toString()} />
        <Kpi label="Custom" value={stats.customRoleCount.toString()} tone="brand-purple" />
        <Kpi label="Assignments" value={stats.totalAssignments.toString()} />
        <Kpi label="Principals" value={stats.principalsWithAccess.toString()} hint="Users with at least one role" />
      </div>

      <DataTable<RoleRow>
        columns={columns}
        data={data}
        searchPlaceholder="Search roles…"
        emptyLabel="No roles match these filters."
        initialPageSize={25}
        initialSort={[{ id: "name", desc: false }]}
        toolbar={
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value as OwnerFilter)}
              className="h-8 px-2 rounded-lg border border-input bg-card text-[11px] text-foreground"
            >
              <option value="all">All modules</option>
              <option value="platform">Platform</option>
              {MODULES.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCustomOnly((s) => !s)}
              className={`h-8 px-2.5 rounded-lg text-[11px] transition-colors ${
                showCustomOnly
                  ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/30"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Custom only
            </button>
          </div>
        }
      />
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone = "muted",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "muted" | "brand-purple";
}) {
  const toneClass = tone === "brand-purple" ? "text-brand-purple" : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
      <p className={`text-lg font-bold tabular-nums mt-0.5 ${toneClass}`}>{value}</p>
      {hint && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{hint}</p>}
    </div>
  );
}

// ModuleKey silenced if not referenced elsewhere.
void {} as unknown as ModuleKey;
