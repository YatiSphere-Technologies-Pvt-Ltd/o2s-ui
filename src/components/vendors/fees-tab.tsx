"use client";

import { Button } from "@/components/ui/button";
import { FEES, FEE_STATUS_CONFIG } from "@/components/vendors/data";

const feeSummary = [
  { label: "Total Committed", value: FEES.reduce((_, f) => _ + parseFloat(f.feeAmount.replace(/[₹L,]/g, "")), 0).toFixed(1) + "L", colorClass: "text-foreground", bgClass: "bg-secondary" },
  { label: "Paid", value: FEES.filter((f) => f.status === "paid").reduce((_, f) => _ + parseFloat(f.feeAmount.replace(/[₹L,]/g, "")), 0).toFixed(1) + "L", colorClass: "text-success", bgClass: "bg-success/10" },
  { label: "Outstanding", value: FEES.filter((f) => f.status === "pending" || f.status === "triggered" || f.status === "approved").reduce((_, f) => _ + parseFloat(f.feeAmount.replace(/[₹L,]/g, "")), 0).toFixed(1) + "L", colorClass: "text-warning", bgClass: "bg-warning/10" },
  { label: "Disputed", value: FEES.filter((f) => f.status === "disputed").reduce((_, f) => _ + parseFloat(f.feeAmount.replace(/[₹L,]/g, "")), 0).toFixed(1) + "L", colorClass: "text-destructive", bgClass: "bg-destructive/10" },
];

export function FeesTab() {
  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-3">
        {feeSummary.map((item) => (
          <div key={item.label} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${item.bgClass}`}>
            <span className={`text-lg font-semibold ${item.colorClass}`}>₹{item.value}</span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Fees table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">FEE ID</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vendor</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Candidate</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fee Amount</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Guarantee</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {FEES.map((fee) => {
                const status = FEE_STATUS_CONFIG[fee.status];
                const isDisputed = fee.status === "disputed";

                return (
                  <tr
                    key={fee.id}
                    className={`border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${
                      isDisputed ? "border-l-2 border-l-destructive" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{fee.id}</td>
                    <td className="px-4 py-3 text-foreground">{fee.vendorName}</td>
                    <td className="px-4 py-3 text-foreground font-medium">{fee.candidateName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fee.role}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{fee.feeAmount}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full ${status.dotClass}`} />
                        <span className={`text-xs font-medium ${status.textClass}`}>{status.label}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{fee.dueDate}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs text-foreground">{fee.guaranteeEnd}</p>
                        <p className="text-[10px] text-muted-foreground">{fee.guaranteeStatus}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {fee.status === "pending" && (
                          <Button variant="ghost" size="xs" className="text-success">Approve</Button>
                        )}
                        {fee.status === "disputed" && (
                          <Button variant="ghost" size="xs" className="text-destructive">Resolve</Button>
                        )}
                        <Button variant="ghost" size="xs">View</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
