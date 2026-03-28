"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEPARTMENTS, LOCATIONS } from "@/components/settings/people-hr/data";
import type { Department } from "@/components/settings/people-hr/data";

type ChildDept = { name: string; head: string; employees: number };

function DeptNode({
  dept,
  isChild,
}: {
  dept: Department | ChildDept;
  isChild?: boolean;
}) {
  const colorClass = "colorClass" in dept ? dept.colorClass : "bg-border";
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="flex items-center gap-2">
        <span className={`size-2 rounded-full ${colorClass} shrink-0`} />
        <span className={isChild ? "text-muted-foreground" : "text-foreground font-medium"}>
          {dept.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {"head" in dept ? dept.head : ""}
        </span>
      </span>
      <span className="text-xs text-muted-foreground font-mono">
        {dept.employees}
      </span>
    </div>
  );
}

const REPORTING_RULES = [
  { label: "Every employee must have a manager", checked: true },
  { label: "Managers must be one level above reports", checked: true },
  { label: "Cross-department reporting allowed", checked: false },
  { label: "Skip-level reporting requires VP approval", checked: true },
];

const AI_FLAGS = [
  "Flag org-chart anomalies (orphaned nodes, excessive depth)",
  "Suggest rebalancing when span-of-control > 12",
  "Detect single-points-of-failure in management chain",
  "Alert on departments without backup leadership",
];

export function OrgStructureTab() {
  return (
    <div className="space-y-5">
      {/* ── Departments ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Departments</h3>
          <Button size="sm" variant="outline">
            <Plus className="size-3.5" />
            New Dept
          </Button>
        </div>
        <div className="space-y-0.5">
          {DEPARTMENTS.map((dept) => (
            <div key={dept.name}>
              <DeptNode dept={dept} />
              {dept.children && dept.children.length > 0 && (
                <div className="border-l-2 border-border ml-4 pl-4">
                  {dept.children.map((child) => (
                    <DeptNode key={child.name} dept={child} isChild />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Locations ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Locations</h3>
          <Button size="sm" variant="outline">
            <Plus className="size-3.5" />
            New Location
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Name
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Type
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Timezone
                </th>
                <th className="pb-2 text-xs font-medium text-muted-foreground text-right">
                  Employees
                </th>
              </tr>
            </thead>
            <tbody>
              {LOCATIONS.map((loc) => (
                <tr
                  key={loc.name}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-1.5 pr-4 text-foreground">{loc.name}</td>
                  <td className="py-1.5 pr-4">
                    <Badge variant="secondary">{loc.type}</Badge>
                  </td>
                  <td className="py-1.5 pr-4 text-muted-foreground font-mono text-xs">
                    {loc.timezone}
                  </td>
                  <td className="py-1.5 text-right font-mono text-muted-foreground">
                    {loc.employees}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Reporting Rules ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Reporting Rules
        </h3>
        <div className="space-y-2.5">
          {REPORTING_RULES.map((rule) => (
            <label
              key={rule.label}
              className="flex items-center gap-2.5 text-sm text-foreground"
            >
              <input
                type="checkbox"
                defaultChecked={rule.checked}
                className="size-3.5 accent-brand rounded"
              />
              {rule.label}
            </label>
          ))}
          <div className="flex gap-6 mt-2 text-xs text-muted-foreground">
            <span>
              Max hierarchy depth:{" "}
              <span className="font-mono text-foreground">8</span>
            </span>
            <span>
              Max direct reports:{" "}
              <span className="font-mono text-foreground">15</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── AI Flags ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          AI Flags
        </h3>
        <div className="space-y-2.5">
          {AI_FLAGS.map((flag) => (
            <label
              key={flag}
              className="flex items-center gap-2.5 text-sm text-foreground"
            >
              <input
                type="checkbox"
                defaultChecked
                className="size-3.5 accent-brand rounded"
              />
              {flag}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
