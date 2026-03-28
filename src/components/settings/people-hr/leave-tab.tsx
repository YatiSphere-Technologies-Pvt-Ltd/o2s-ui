"use client";

import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LEAVE_TYPES,
  BLACKOUT_PERIODS,
  HOLIDAY_CALENDARS,
} from "@/components/settings/people-hr/data";

export function LeaveTab() {
  return (
    <div className="space-y-5">
      {/* ── Leave Types ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Leave Types</h3>
          <Button size="sm" variant="outline">
            <Plus className="size-3.5" />
            New Type
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Type
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Days
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Accrual
                </th>
                <th className="pb-2 text-xs font-medium text-muted-foreground text-center">
                  Paid
                </th>
              </tr>
            </thead>
            <tbody>
              {LEAVE_TYPES.map((lt) => (
                <tr
                  key={lt.name}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-1.5 pr-4 text-foreground">
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${lt.colorClass} shrink-0`}
                      />
                      {lt.name}
                    </span>
                  </td>
                  <td className="py-1.5 pr-4 font-mono text-muted-foreground">
                    {lt.days}
                  </td>
                  <td className="py-1.5 pr-4 text-muted-foreground">
                    {lt.accrual}
                  </td>
                  <td className="py-1.5 text-center text-muted-foreground">
                    {lt.paid ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Blackout Periods ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Blackout Periods
          </h3>
          <Button size="sm" variant="outline">
            <Plus className="size-3.5" />
            Add Blackout Period
          </Button>
        </div>
        <div className="space-y-2">
          {BLACKOUT_PERIODS.map((bp) => (
            <div
              key={bp.name}
              className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0"
            >
              <span className="text-foreground font-medium">{bp.name}</span>
              <span className="text-muted-foreground text-xs">
                {bp.dates} &middot; {bp.appliesTo}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Holiday Calendars ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Holiday Calendars
          </h3>
          <Button size="sm" variant="outline">
            <Plus className="size-3.5" />
            New Calendar
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {HOLIDAY_CALENDARS.map((cal) => (
            <div
              key={cal.name}
              className="border border-border rounded-lg p-3"
            >
              <p className="text-sm font-medium text-foreground">{cal.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {cal.locations}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                <span className="font-mono">{cal.days}</span> days
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Compliance Note ── */}
      <div className="bg-success/5 border-l-[3px] border-success p-3 rounded-r-lg">
        <p className="text-xs text-foreground font-medium mb-1">
          Compliance Status
        </p>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Check className="size-3 text-success shrink-0" />
            California: Compliant with state sick-leave and PTO payout laws
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Check className="size-3 text-success shrink-0" />
            India: Compliant with Shops and Establishment Act leave requirements
          </p>
        </div>
      </div>
    </div>
  );
}
