"use client";

import { Download, Eye, FileText, ChevronDown } from "lucide-react";
import {
  INVOICES,
  invoiceStatusConfig,
  formatCurrency,
} from "@/components/settings/data";
import { Button } from "@/components/ui/button";

export function InvoiceHistory() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Invoices</h2>
        <Button variant="ghost" size="sm" className="text-xs gap-1.5">
          <Download className="size-3" />
          Download All
          <ChevronDown className="size-3" />
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Invoice ID
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Description
                </th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Amount
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => {
                const statusCfg = invoiceStatusConfig(inv.status);

                return (
                  <tr
                    key={inv.id}
                    className="border-b border-border last:border-b-0 hover:bg-surface-overlay transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-foreground">
                      {inv.id}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {inv.date}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {inv.description}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`size-2 rounded-full shrink-0 ${statusCfg.dotClass}`}
                        />
                        <span className="text-foreground text-xs">
                          {statusCfg.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {inv.status === "paid" && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Download PDF"
                        >
                          <FileText className="size-3.5 text-muted-foreground" />
                        </Button>
                      )}
                      {inv.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-xs gap-1"
                        >
                          <Eye className="size-3" />
                          Preview
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing 1-{INVOICES.length} of {INVOICES.length} invoices
          </p>
        </div>
      </div>
    </div>
  );
}
