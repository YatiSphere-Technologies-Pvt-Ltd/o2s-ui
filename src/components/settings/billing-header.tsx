"use client";

import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BillingHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Billing &amp; Subscription
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your plan, usage, and invoices.
        </p>
      </div>
      <Button variant="ghost" className="text-sm gap-2 shrink-0">
        <CreditCard className="size-4" />
        Manage Payment Methods
      </Button>
    </div>
  );
}
