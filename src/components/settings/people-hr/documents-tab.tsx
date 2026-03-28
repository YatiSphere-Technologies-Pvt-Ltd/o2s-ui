"use client";

import { Plus, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOCUMENT_TEMPLATES } from "@/components/settings/people-hr/data";

const COMPLIANCE_TRACKING = [
  { label: "I-9 verification (within 3 days of hire)", alertDays: 3, checked: true },
  { label: "W-4 / W-9 tax forms", alertDays: 7, checked: true },
  { label: "State tax withholding forms", alertDays: 7, checked: true },
  { label: "Benefits enrollment deadline", alertDays: 30, checked: true },
  { label: "Visa / work authorization expiry", alertDays: 90, checked: true },
  { label: "Annual policy acknowledgements", alertDays: 14, checked: true },
];

export function DocumentsTab() {
  return (
    <div className="space-y-5">
      {/* ── Document Templates ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Document Templates
          </h3>
          <Button size="sm" variant="outline">
            <Plus className="size-3.5" />
            New Template
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Template
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Category
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground text-center">
                  E-Sign
                </th>
                <th className="pb-2 text-xs font-medium text-muted-foreground text-right">
                  Used
                </th>
              </tr>
            </thead>
            <tbody>
              {DOCUMENT_TEMPLATES.map((doc) => (
                <tr
                  key={doc.name}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-1.5 pr-4 text-foreground">{doc.name}</td>
                  <td className="py-1.5 pr-4 text-muted-foreground">
                    {doc.category}
                  </td>
                  <td className="py-1.5 pr-4 text-center">
                    <Circle
                      className={`size-3 mx-auto ${
                        doc.eSign
                          ? "fill-success text-success"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </td>
                  <td className="py-1.5 text-right font-mono text-muted-foreground">
                    {doc.used}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Compliance Tracking ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Compliance Tracking
        </h3>
        <div className="space-y-2.5">
          {COMPLIANCE_TRACKING.map((item) => (
            <label
              key={item.label}
              className="flex items-center gap-2.5 text-sm text-foreground"
            >
              <input
                type="checkbox"
                defaultChecked={item.checked}
                className="size-3.5 accent-brand rounded"
              />
              <span>
                {item.label}
                <span className="text-xs text-muted-foreground ml-1.5">
                  (alert {item.alertDays}d before)
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ── E-Signature Settings ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          E-Signature Settings
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Provider</span>
            <span className="text-foreground">DocuSign</span>
          </div>
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="flex items-center gap-2.5 text-foreground">
              <input
                type="checkbox"
                defaultChecked
                className="size-3.5 accent-brand rounded"
              />
              Auto-send offer letters for signature
            </label>
            <label className="flex items-center gap-2.5 text-foreground">
              <input
                type="checkbox"
                defaultChecked
                className="size-3.5 accent-brand rounded"
              />
              Auto-send NDA on hire confirmation
            </label>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-muted-foreground">Reminder after</span>
            <span className="font-mono text-foreground">48 hours</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Escalation after</span>
            <span className="font-mono text-foreground">5 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
