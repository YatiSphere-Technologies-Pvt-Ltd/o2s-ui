"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Building2, ChevronRight, Globe2, Layers, Shield } from "lucide-react";
import { useRbacStore, type AssignmentRow } from "@/lib/rbac-store";
import type { ModuleKey } from "@/components/admin/data";
import { RECORD_TYPE_LABEL } from "@/components/admin/rbac";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";

/**
 * Per-module access control panel. Compact table-per-lane: tenant
 * cascade in, direct module grants, record-specific grants.
 */
export function ModuleAccessPanel({
  module,
  moduleLabel,
}: {
  module: ModuleKey;
  moduleLabel: string;
}) {
  const { assignmentsForScope } = useRbacStore();
  const rows = assignmentsForScope({ kind: "module", module });

  const tenantRows = useMemo(() => rows.filter((r) => r.scope.kind === "tenant"), [rows]);
  const moduleRows = useMemo(() => rows.filter((r) => r.scope.kind === "module"), [rows]);
  const recordRows = useMemo(() => rows.filter((r) => r.scope.kind === "record"), [rows]);

  return (
    <section className="space-y-3">
      <header className="flex items-center gap-2">
        <Shield className="size-3.5 text-muted-foreground" />
        <p className="text-[11px] font-semibold text-foreground">Access control — {moduleLabel}</p>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {rows.length} effective grant{rows.length === 1 ? "" : "s"}
        </span>
        <Link
          href={`/admin/rbac/assignments?module=${module}`}
          className="text-[11px] text-brand hover:underline inline-flex items-center gap-1"
        >
          Manage
          <ChevronRight className="size-3" />
        </Link>
      </header>

      <AccessLane
        icon={Globe2}
        label="Tenant-wide (cascade in)"
        tone="text-destructive"
        rows={tenantRows}
        emptyLabel="No tenant-wide grants."
        showTarget={false}
      />
      <AccessLane
        icon={Building2}
        label={`Module — ${moduleLabel}`}
        tone="text-brand-purple"
        rows={moduleRows}
        emptyLabel="No module-scoped grants."
        showTarget={false}
      />
      <AccessLane
        icon={Layers}
        label="Record-specific"
        tone="text-brand-teal"
        rows={recordRows}
        emptyLabel="No record-scoped grants."
        showTarget={true}
      />
    </section>
  );
}

function AccessLane({
  icon: Icon,
  label,
  tone,
  rows,
  emptyLabel,
  showTarget,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone: string;
  rows: AssignmentRow[];
  emptyLabel: string;
  showTarget: boolean;
}) {
  const columns = useMemo<ColumnDef<AssignmentRow, unknown>[]>(() => {
    const base: ColumnDef<AssignmentRow, unknown>[] = [
      {
        id: "principal",
        header: "Principal",
        accessorFn: (a) => a.principalLabel,
        cell: ({ row }) => (
          <span className="text-[12px] text-foreground">{row.original.principalLabel}</span>
        ),
      },
      {
        id: "role",
        header: "Role",
        accessorFn: (a) => a.role.name,
        cell: ({ row }) => (
          <Link
            href={`/admin/rbac/roles/${encodeURIComponent(row.original.role.id)}`}
            className="text-[12px] text-foreground hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.role.name}
          </Link>
        ),
      },
      {
        id: "perms",
        header: "Perms",
        accessorFn: (a) => a.role.permissions.length,
        cell: ({ row }) => (
          <span className="text-[11px] tabular-nums text-muted-foreground">{row.original.role.permissions.length}</span>
        ),
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
    ];
    if (showTarget) {
      base.splice(2, 0, {
        id: "target",
        header: "Record",
        enableSorting: false,
        accessorFn: (a) => (a.scope.kind === "record" ? a.scope.recordId : ""),
        cell: ({ row }) => {
          const s = row.original.scope;
          if (s.kind !== "record") return <span className="text-[11px] text-muted-foreground/40">—</span>;
          return (
            <div className="min-w-0">
              <p className="text-[11px] text-foreground truncate max-w-72">{s.recordLabel}</p>
              <p className="text-[10px] text-muted-foreground/70 truncate">
                {RECORD_TYPE_LABEL[s.recordType]} · <code className="font-mono">{s.recordId}</code>
              </p>
            </div>
          );
        },
      });
    }
    return base;
  }, [showTarget]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={`size-3 ${tone}`} />
        <p className="text-[10px] uppercase tracking-wider text-foreground font-semibold">{label}</p>
        <span className="text-[10px] text-muted-foreground ml-auto tabular-nums">{rows.length}</span>
      </div>
      <DataTable<AssignmentRow>
        columns={columns}
        data={rows}
        pageable={false}
        emptyLabel={emptyLabel}
        dense
        hideToolbar
      />
    </div>
  );
}
