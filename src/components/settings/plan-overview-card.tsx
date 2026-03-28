"use client";

import { CURRENT_PLAN, formatCurrency } from "@/components/settings/data";
import { Button } from "@/components/ui/button";

export function PlanOverviewCard() {
  const plan = CURRENT_PLAN;

  return (
    <div className="bg-card border border-border rounded-xl p-6 border-t-[3px] border-t-brand-purple">
      {/* Plan badge + name + price */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="bg-brand-purple text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              PRO
            </span>
            <h2 className="text-lg font-bold text-foreground">
              {plan.name} Plan
            </h2>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(plan.pricePerEmployee)}
            </span>
            <span className="text-sm text-muted-foreground">
              / employee / month
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full font-medium">
              Billed annually
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            {plan.activeEmployees} active employees &times;{" "}
            {formatCurrency(plan.pricePerEmployee)} ={" "}
            {formatCurrency(plan.monthlyTotal)}/month
          </p>
        </div>
      </div>

      {/* Billing details inner card */}
      <div className="mt-5 bg-background rounded-lg p-4 border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground text-xs block mb-1">
              Billing Period
            </span>
            <span className="text-foreground font-medium">
              {plan.billingPeriod.start} &ndash; {plan.billingPeriod.end}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-xs block mb-1">
              Next Invoice
            </span>
            <span className="text-foreground font-medium">
              {plan.nextInvoice.date} &middot;{" "}
              {formatCurrency(plan.nextInvoice.estimatedAmount)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-xs block mb-1">
              Renewal Date
            </span>
            <span className="text-foreground font-medium">
              {plan.renewalDate} (auto-renew {plan.autoRenew ? "on" : "off"})
            </span>
          </div>
        </div>
      </div>

      {/* Savings callout */}
      <p className="mt-4 text-sm text-success font-medium">
        You&apos;re saving {formatCurrency(plan.annualSavings)}/year vs monthly
        billing ({plan.annualDiscount}% discount)
      </p>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button variant="ghost" className="text-brand text-sm">
          Change Plan
        </Button>
        <Button variant="ghost" className="text-sm">
          Switch to Monthly
        </Button>
        <div className="sm:ml-auto">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive text-sm"
          >
            Cancel Subscription
          </Button>
        </div>
      </div>
    </div>
  );
}
