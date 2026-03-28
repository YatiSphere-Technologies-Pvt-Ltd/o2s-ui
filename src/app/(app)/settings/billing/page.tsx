"use client";

import { BillingHeader } from "@/components/settings/billing-header";
import { PlanOverviewCard } from "@/components/settings/plan-overview-card";
import { UsageMetersRow } from "@/components/settings/usage-meters";
import { PlanComparison } from "@/components/settings/plan-comparison";
import { AddOnsSection } from "@/components/settings/add-ons-section";
import { PaymentMethodsSection } from "@/components/settings/payment-methods";
import { InvoiceHistory } from "@/components/settings/invoice-history";

export default function BillingPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <BillingHeader />
      <PlanOverviewCard />
      <UsageMetersRow />
      <PlanComparison />
      <AddOnsSection />
      <PaymentMethodsSection />
      <InvoiceHistory />
    </div>
  );
}
