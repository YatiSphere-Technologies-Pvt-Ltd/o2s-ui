"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import {
  PLANS,
  FEATURE_GROUPS,
  featureValue,
  formatCurrency,
} from "@/components/settings/data";
import { Button } from "@/components/ui/button";

type BillingCycle = "monthly" | "annual";

export function PlanComparison() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Toggle */}
      <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Compare Plans
        </h2>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              billingCycle === "monthly"
                ? "bg-brand text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              billingCycle === "annual"
                ? "bg-brand text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual
            <span className="text-success text-[10px] font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Column headers */}
          <thead>
            <tr className="border-t border-border">
              <th className="text-left p-4 w-[200px] text-muted-foreground font-medium text-xs uppercase tracking-wider">
                Feature
              </th>
              {PLANS.map((plan) => {
                const price =
                  billingCycle === "annual"
                    ? plan.priceAnnual
                    : plan.priceMonthly;
                const isCurrent = plan.current;
                const isEnterprise = plan.tier === "enterprise";

                return (
                  <th
                    key={plan.tier}
                    className={`p-4 text-center min-w-[180px] ${
                      isCurrent ? "bg-brand-purple/5" : ""
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {isCurrent && (
                        <span className="bg-brand-purple text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          Current Plan
                        </span>
                      )}
                      {isEnterprise && !isCurrent && (
                        <span className="bg-warning/10 text-warning text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          Best for Growing Teams
                        </span>
                      )}
                      <span className="text-foreground font-bold text-base">
                        {plan.name}
                      </span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-bold text-foreground">
                          {formatCurrency(price)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          /emp/mo
                        </span>
                      </div>
                      <Button
                        variant={isCurrent ? "secondary" : "default"}
                        size="sm"
                        className="mt-1 text-xs"
                        disabled={isCurrent}
                      >
                        {isCurrent
                          ? "Current Plan"
                          : plan.tier === "enterprise"
                            ? "Contact Sales"
                            : "Upgrade"}
                      </Button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {FEATURE_GROUPS.map((group) => (
              <React.Fragment key={group.label}>
                {/* Group header row */}
                <tr className="border-t border-border">
                  <td
                    colSpan={PLANS.length + 1}
                    className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold bg-secondary/40"
                  >
                    {group.label}
                  </td>
                </tr>
                {/* Feature rows */}
                {group.rows.map((row) => (
                  <tr
                    key={row.key}
                    className="border-t border-border hover:bg-surface-overlay transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.label}
                    </td>
                    {PLANS.map((plan) => {
                      const val = plan.features[row.key];
                      const fv = featureValue(val);
                      const isCurrent = plan.current;

                      return (
                        <td
                          key={`${plan.tier}-${row.key}`}
                          className={`px-4 py-3 text-center ${
                            isCurrent ? "bg-brand-purple/5" : ""
                          }`}
                        >
                          {fv.type === "check" && (
                            <Check className="size-4 text-success mx-auto" />
                          )}
                          {fv.type === "cross" && (
                            <X className="size-4 text-muted-foreground/40 mx-auto" />
                          )}
                          {fv.type === "text" && (
                            <span className="text-foreground text-sm">
                              {fv.text}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
