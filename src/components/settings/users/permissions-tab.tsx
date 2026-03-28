"use client";

import { Check, Eye } from "lucide-react";
import {
  PERMISSION_MATRIX,
  MATRIX_ROLE_COLUMNS,
} from "@/components/settings/users/data";

function PermissionCell({ value }: { value: string }) {
  switch (value) {
    case "✅":
      return <Check className="size-3.5 text-success mx-auto" />;
    case "🔵D":
      return (
        <span className="inline-flex items-center justify-center size-5 rounded text-[10px] font-bold bg-brand/10 text-brand">
          D
        </span>
      );
    case "🔵R":
      return (
        <span className="inline-flex items-center justify-center size-5 rounded text-[10px] font-bold bg-brand/10 text-brand">
          R
        </span>
      );
    case "👁️":
      return <Eye className="size-3.5 text-muted-foreground mx-auto" />;
    case "—":
    default:
      return (
        <span className="text-muted-foreground/30 text-sm">&mdash;</span>
      );
  }
}

export function PermissionsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 bg-card text-left px-4 py-3 text-xs font-medium text-muted-foreground min-w-[200px]">
                Permission
              </th>
              {MATRIX_ROLE_COLUMNS.map((role) => (
                <th
                  key={role}
                  className="px-3 py-3 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                >
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSION_MATRIX.map((group) => (
              <PermissionGroupRows key={group.category} group={group} />
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground px-1">
        <div className="flex items-center gap-1.5">
          <Check className="size-3 text-success" />
          <span>Full access</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center size-4 rounded text-[9px] font-bold bg-brand/10 text-brand">
            D
          </span>
          <span>Department-scoped</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center size-4 rounded text-[9px] font-bold bg-brand/10 text-brand">
            R
          </span>
          <span>Direct reports only</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="size-3 text-muted-foreground" />
          <span>View only</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground/30">&mdash;</span>
          <span>No access</span>
        </div>
      </div>
    </div>
  );
}

function PermissionGroupRows({
  group,
}: {
  group: (typeof PERMISSION_MATRIX)[number];
}) {
  return (
    <>
      {/* Category header */}
      <tr>
        <td
          colSpan={MATRIX_ROLE_COLUMNS.length + 1}
          className="bg-secondary/40 px-4 py-2 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground"
        >
          {group.category}
        </td>
      </tr>

      {/* Permission rows */}
      {group.permissions.map((perm) => (
        <tr
          key={perm.name}
          className="border-b border-border last:border-b-0 hover:bg-surface-overlay transition-colors"
        >
          <td className="sticky left-0 z-10 bg-card px-4 py-2.5 text-xs text-foreground">
            {perm.name}
          </td>
          {MATRIX_ROLE_COLUMNS.map((role) => (
            <td key={role} className="px-3 py-2.5 text-center">
              <PermissionCell value={perm.roles[role] ?? "—"} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
