"use client";

import { AlertTriangle } from "lucide-react";
import { COMPLIANCE_DATA, COMPLIANCE_ICON, type ComplianceRow } from "@/components/vendors/data";

const complianceSummary = [
  { label: "Compliant", count: COMPLIANCE_DATA.filter((c) => c.overallStatus === "compliant").length, colorClass: "text-success", bgClass: "bg-success/10" },
  { label: "Partially Compliant", count: COMPLIANCE_DATA.filter((c) => c.overallStatus === "partially_compliant").length, colorClass: "text-warning", bgClass: "bg-warning/10" },
  { label: "Non-Compliant", count: COMPLIANCE_DATA.filter((c) => c.overallStatus === "non_compliant").length, colorClass: "text-destructive", bgClass: "bg-destructive/10" },
  { label: "Pending", count: COMPLIANCE_DATA.filter((c) => c.overallStatus === "pending").length, colorClass: "text-muted-foreground", bgClass: "bg-secondary" },
];

const alertCount = COMPLIANCE_DATA.filter(
  (c) => c.overallStatus === "non_compliant" || c.overallStatus === "partially_compliant"
).length;

type ComplianceField = "nda" | "msa" | "insurance" | "gstin" | "pan" | "dataProtection" | "diversity";

const COMPLIANCE_COLUMNS: { key: ComplianceField; label: string }[] = [
  { key: "nda", label: "NDA" },
  { key: "msa", label: "MSA" },
  { key: "insurance", label: "Insurance" },
  { key: "gstin", label: "GSTIN" },
  { key: "pan", label: "PAN" },
  { key: "dataProtection", label: "Data Protection" },
  { key: "diversity", label: "Diversity" },
];

function ComplianceCell({ value }: { value: string }) {
  const config = COMPLIANCE_ICON[value] ?? COMPLIANCE_ICON["na"];
  return (
    <span className={`text-sm ${config.colorClass}`} title={value}>
      {config.icon}
    </span>
  );
}

export function ComplianceTab() {
  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-3">
        {complianceSummary.map((item) => (
          <div key={item.label} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${item.bgClass}`}>
            <span className={`text-lg font-semibold ${item.colorClass}`}>{item.count}</span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
        {alertCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10">
            <AlertTriangle className="size-4 text-destructive" />
            <span className="text-xs text-destructive font-medium">{alertCount} alerts</span>
          </div>
        )}
      </div>

      {/* Compliance matrix */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vendor</th>
                {COMPLIANCE_COLUMNS.map((col) => (
                  <th key={col.key} className="text-center px-4 py-3 font-medium text-muted-foreground">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPLIANCE_DATA.map((row) => {
                const borderClass =
                  row.overallStatus === "non_compliant"
                    ? "border-l-2 border-l-destructive"
                    : row.overallStatus === "partially_compliant"
                    ? "border-l-2 border-l-warning"
                    : "";

                return (
                  <tr
                    key={row.vendorId}
                    className={`border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${borderClass}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{row.vendorName}</p>
                      <p className="text-xs font-mono text-muted-foreground">{row.vendorId}</p>
                    </td>
                    {COMPLIANCE_COLUMNS.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-center">
                        <ComplianceCell value={row[col.key]} />
                      </td>
                    ))}
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
