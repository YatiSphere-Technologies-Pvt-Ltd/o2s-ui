"use client";

import { Check, Clock, CircleDot } from "lucide-react";
import { OFFER } from "@/components/candidates/data";

function approvalIcon(status: string) {
  switch (status) {
    case "approved":
      return <Check className="size-3.5 text-success" />;
    case "pending":
      return <Clock className="size-3.5 text-warning" />;
    case "waiting":
      return <CircleDot className="size-3.5 text-muted-foreground" />;
    default:
      return <CircleDot className="size-3.5 text-muted-foreground" />;
  }
}

function approvalDotColor(status: string): string {
  switch (status) {
    case "approved":
      return "bg-success";
    case "pending":
      return "bg-warning";
    case "waiting":
      return "bg-secondary";
    default:
      return "bg-secondary";
  }
}

export function OfferTab() {
  if (!OFFER) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground mb-4">No offer created yet</p>
        <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium">
          Generate Offer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Offer Card */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold">
              Offer {OFFER.id}
            </h3>
            <p className="text-xs text-muted-foreground">
              Expires {OFFER.expirationDate} ({OFFER.daysToExpire} days
              remaining)
            </p>
          </div>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${OFFER.statusColorClass}`}
          >
            {OFFER.status}
          </span>
        </div>

        {/* Position Details */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Position Details
          </h4>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <span className="text-xs text-muted-foreground">Title</span>
              <p className="text-sm font-medium">{OFFER.title}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Department</span>
              <p className="text-sm font-medium">{OFFER.department}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Team</span>
              <p className="text-sm font-medium">{OFFER.team}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Manager</span>
              <p className="text-sm font-medium">{OFFER.manager}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Start Date</span>
              <p className="text-sm font-medium">{OFFER.startDate}</p>
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Compensation
          </h4>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <span className="text-xs text-muted-foreground">Base Salary</span>
              <p className="text-sm font-bold">{OFFER.baseSalary}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                Signing Bonus
              </span>
              <p className="text-sm font-bold">{OFFER.signingBonus}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                Performance Bonus
              </span>
              <p className="text-sm font-bold">{OFFER.performanceBonus}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Equity</span>
              <p className="text-sm font-bold">{OFFER.equity}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Relocation</span>
              <p className="text-sm font-bold">{OFFER.relocation}</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Benefits
          </h4>
          <ul className="space-y-1">
            {OFFER.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="size-3 text-success shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Approval Chain */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Approval Chain
          </h4>
          <div className="space-y-3">
            {OFFER.approvalChain.map((approver, i) => (
              <div key={approver.name} className="flex items-start gap-3">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`size-6 rounded-full flex items-center justify-center ${approvalDotColor(approver.status)}`}
                  >
                    {approvalIcon(approver.status)}
                  </div>
                  {i < OFFER.approvalChain.length - 1 && (
                    <div className="w-0.5 h-6 bg-border mt-1" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{approver.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {approver.role}
                    {approver.date && ` · ${approver.date}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
