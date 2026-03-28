"use client";

import { TERMINATION_TYPES } from "@/components/settings/people-hr/data";

const ALUMNI_OPTIONS = [
  "Enable alumni network portal",
  "Allow alumni to access job board",
  "Send quarterly alumni newsletter",
];

export function OffboardingTab() {
  return (
    <div className="space-y-5">
      {/* ── Offboarding Checklist Summary ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Offboarding Checklist
        </h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            <span className="font-mono text-foreground">18</span> tasks across
            the following categories:
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              "IT & Access",
              "Equipment Return",
              "Knowledge Transfer",
              "Finance & Payroll",
              "Benefits & COBRA",
              "Exit Interview",
              "Legal & Compliance",
            ].map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Termination Types ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Termination Types
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Type
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Notice Period
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Checklist
                </th>
                <th className="pb-2 text-xs font-medium text-muted-foreground">
                  Payout
                </th>
              </tr>
            </thead>
            <tbody>
              {TERMINATION_TYPES.map((tt) => (
                <tr
                  key={tt.type}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-1.5 pr-4 text-foreground">{tt.type}</td>
                  <td className="py-1.5 pr-4 text-muted-foreground">
                    {tt.noticePeriod}
                  </td>
                  <td className="py-1.5 pr-4 text-muted-foreground">
                    {tt.checklist}
                  </td>
                  <td className="py-1.5 text-muted-foreground">{tt.payout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Access Revocation ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Access Revocation
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="border border-border rounded-lg p-3">
            <p className="font-medium text-foreground mb-1">
              Voluntary Departure
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Email & SSO: Disabled on last day at 6:00 PM local</p>
              <p>Code repos: Read-only for 7 days, then revoked</p>
              <p>SaaS tools: Revoked on last day</p>
              <p>Building access: Revoked on last day</p>
            </div>
          </div>
          <div className="border border-border rounded-lg p-3">
            <p className="font-medium text-foreground mb-1">
              Involuntary Termination
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Email & SSO: Disabled immediately</p>
              <p>Code repos: Revoked immediately</p>
              <p>SaaS tools: Revoked immediately</p>
              <p>Building access: Revoked immediately</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Data Handling ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Data Handling & Retention
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Personal data</span>
            <span className="font-mono text-foreground">3 years</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Performance records</span>
            <span className="font-mono text-foreground">5 years</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Work product & docs</span>
            <span className="text-foreground">Indefinite</span>
          </div>
        </div>
      </div>

      {/* ── Alumni Network ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Alumni Network
        </h3>
        <div className="space-y-2.5">
          {ALUMNI_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2.5 text-sm text-foreground"
            >
              <input
                type="checkbox"
                defaultChecked={false}
                className="size-3.5 accent-brand rounded"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
