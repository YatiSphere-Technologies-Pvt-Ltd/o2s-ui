"use client";

import { Lock, Plus, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  STANDARD_FIELDS,
  CUSTOM_FIELDS,
  EMPLOYMENT_TYPES,
} from "@/components/settings/people-hr/data";

export function ProfilesTab() {
  return (
    <div className="space-y-5">
      {/* ── Standard Fields ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Standard Fields
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Field
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Type
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground text-center">
                  Required
                </th>
                <th className="pb-2 text-xs font-medium text-muted-foreground text-center">
                  Visible
                </th>
              </tr>
            </thead>
            <tbody>
              {STANDARD_FIELDS.map((field) => (
                <tr
                  key={field.name}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-2 pr-4 text-foreground">
                    <span className="flex items-center gap-1.5">
                      {field.name}
                      {field.locked && (
                        <Lock className="size-3 text-muted-foreground" />
                      )}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {field.type}
                  </td>
                  <td className="py-2 pr-4 text-center">
                    <Circle
                      className={`size-3 mx-auto ${
                        field.required
                          ? "fill-success text-success"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </td>
                  <td className="py-2 text-center">
                    <Circle
                      className={`size-3 mx-auto ${
                        field.visible
                          ? "fill-success text-success"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Custom Fields ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Custom Fields
          </h3>
          <Button size="sm" variant="outline">
            <Plus className="size-3.5" />
            New Field
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Field
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Type
                </th>
                <th className="pb-2 text-xs font-medium text-muted-foreground">
                  Section
                </th>
              </tr>
            </thead>
            <tbody>
              {CUSTOM_FIELDS.map((field) => (
                <tr
                  key={field.name}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-1.5 pr-4 text-foreground">{field.name}</td>
                  <td className="py-1.5 pr-4 text-muted-foreground">
                    {field.type}
                  </td>
                  <td className="py-1.5 text-muted-foreground">
                    {field.section}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Employment Types ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Employment Types
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Type
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground text-center">
                  Benefits
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Leave Policy
                </th>
                <th className="pb-2 text-xs font-medium text-muted-foreground text-right">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              {EMPLOYMENT_TYPES.map((et) => (
                <tr
                  key={et.name}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-1.5 pr-4 text-foreground">
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${et.colorClass} shrink-0`}
                      />
                      {et.name}
                    </span>
                  </td>
                  <td className="py-1.5 pr-4 text-center text-muted-foreground">
                    {et.benefits ? "Yes" : "No"}
                  </td>
                  <td className="py-1.5 pr-4 text-muted-foreground">
                    {et.leave}
                  </td>
                  <td className="py-1.5 text-right font-mono text-muted-foreground">
                    {et.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
