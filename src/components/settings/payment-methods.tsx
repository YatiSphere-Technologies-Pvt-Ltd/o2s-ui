"use client";

import { CreditCard, Plus, Pencil } from "lucide-react";
import {
  PAYMENT_METHODS,
  BILLING_INFO,
} from "@/components/settings/data";
import { Button } from "@/components/ui/button";

function cardTypeLabel(type: string): string {
  switch (type) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "Amex";
    default:
      return type;
  }
}

export function PaymentMethodsSection() {
  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Payment Methods
        </h2>

        <div className="flex flex-col gap-3">
          {PAYMENT_METHODS.map((pm) => (
            <div
              key={pm.id}
              className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Card icon */}
              <div className="flex items-center justify-center size-10 rounded-lg bg-secondary shrink-0">
                <CreditCard className="size-5 text-foreground" />
              </div>

              {/* Card info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">
                    {cardTypeLabel(pm.type)} ending in {pm.last4}
                  </span>
                  {pm.isDefault && (
                    <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Default
                    </span>
                  )}
                  {pm.expiryWarning && (
                    <span className="bg-warning/10 text-warning text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Expiring Soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pm.name} &middot; Expires {pm.expiry}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" className="text-xs">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  Remove
                </Button>
                {!pm.isDefault && (
                  <Button variant="ghost" size="sm" className="text-xs">
                    Make Default
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="mt-3 text-sm gap-2 text-brand">
          <Plus className="size-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Billing Info */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Billing Information
          </h2>
          <Button variant="ghost" size="sm" className="text-xs gap-1.5">
            <Pencil className="size-3" />
            Edit
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block mb-1">
                Company
              </span>
              <span className="text-foreground font-medium">
                {BILLING_INFO.company}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">
                Billing Email
              </span>
              <span className="text-foreground font-medium">
                {BILLING_INFO.billingEmail}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">
                Address
              </span>
              <span className="text-foreground font-medium">
                {BILLING_INFO.address}, {BILLING_INFO.city},{" "}
                {BILLING_INFO.state} {BILLING_INFO.postalCode}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">
                Tax ID (GSTIN)
              </span>
              <span className="text-foreground font-medium font-mono text-xs">
                {BILLING_INFO.taxId}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
