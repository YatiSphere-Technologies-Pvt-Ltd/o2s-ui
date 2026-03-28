"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  INVOICES,
  INVOICE_STATUS_CONFIG,
  aiScoreColor,
  aiScoreBg,
  type Invoice,
  type InvoiceStatus,
} from "@/components/legal/spend/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

const expandVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

type QuickFilter = "all" | "needs_review" | "ai_flagged" | "approved" | "paid";

const QUICK_FILTERS: { key: QuickFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs_review", label: "Needs Review" },
  { key: "ai_flagged", label: "AI Flagged" },
  { key: "approved", label: "Approved" },
  { key: "paid", label: "Paid" },
];

function filterInvoices(invoices: Invoice[], filter: QuickFilter): Invoice[] {
  switch (filter) {
    case "needs_review":
      return invoices.filter((i) =>
        (["received", "under_review"] as InvoiceStatus[]).includes(i.status)
      );
    case "ai_flagged":
      return invoices.filter((i) => i.status === "ai_flagged");
    case "approved":
      return invoices.filter((i) => i.status === "approved");
    case "paid":
      return invoices.filter((i) => i.status === "paid");
    default:
      return invoices;
  }
}

/* AI review details per invoice — hardcoded for realism */
const AI_DETAILS: Record<
  string,
  { summary: string; flags: string[]; savings: string; recommendation: string }
> = {
  "inv-001": {
    summary:
      "AI detected multiple billing irregularities in this invoice including excessive time entries for document review and a paralegal billed at associate rate.",
    flags: [
      "Block billing on 3 entries totaling 8.5 hours — recommend splitting",
      "Paralegal work billed at associate rate ($425/hr vs $200/hr expected)",
      "Travel time billed at full partner rate — outside engagement letter terms",
    ],
    savings: "$4,200",
    recommendation: "Dispute",
  },
  "inv-004": {
    summary:
      "Minor flag: One time entry description lacks sufficient detail for the billed amount.",
    flags: ["Vague entry: 'Research and analysis' — 4.2 hours at $750/hr"],
    savings: "$850",
    recommendation: "Approve with note",
  },
  "inv-005": {
    summary:
      "Fixed fee invoice with minor scope question flagged by AI.",
    flags: [
      "Deliverable 'competitive landscape analysis' may be outside agreed scope",
    ],
    savings: "$600",
    recommendation: "Approve with note",
  },
};

function InvoiceExpandedRow({ invoice }: { invoice: Invoice }) {
  const details = AI_DETAILS[invoice.id];
  if (!details) return null;

  return (
    <motion.tr {...expandVariants}>
      <td colSpan={12} className="px-6 py-4 bg-secondary/30">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-brand-purple">
            <Sparkles className="size-3.5" />
            AI Billing Review
          </div>
          <p className="text-xs text-muted-foreground">{details.summary}</p>
          {details.flags.length > 0 && (
            <div className="space-y-1.5">
              {details.flags.map((flag, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <AlertTriangle className="size-3 text-warning shrink-0 mt-0.5" />
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs text-muted-foreground">
              Savings identified:{" "}
              <span className="font-mono font-semibold text-success">
                {details.savings}
              </span>
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                details.recommendation === "Dispute"
                  ? "text-destructive bg-destructive/10"
                  : "text-warning bg-warning/10"
              }`}
            >
              {details.recommendation}
            </span>
          </div>
        </div>
      </td>
    </motion.tr>
  );
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const [expanded, setExpanded] = useState(false);
  const status = INVOICE_STATUS_CONFIG[invoice.status];
  const isFlagged = invoice.status === "ai_flagged";
  const hasDetails = AI_DETAILS[invoice.id] !== undefined;

  return (
    <>
      <tr
        className={`border-b border-border hover:bg-secondary/40 transition-colors cursor-pointer ${
          isFlagged ? "bg-destructive/5 border-l-[3px] border-l-destructive" : ""
        }`}
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        <td className="px-3 py-3 text-xs">
          {hasDetails && (
            <span className="inline-block mr-1">
              {expanded ? (
                <ChevronDown className="size-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="size-3 text-muted-foreground" />
              )}
            </span>
          )}
        </td>
        <td className="px-3 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
          {invoice.invoiceNumber}
        </td>
        <td className="px-3 py-3 text-sm text-foreground whitespace-nowrap">
          {invoice.firmName}
        </td>
        <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
          {invoice.engagementTitle}
        </td>
        <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
          {invoice.period}
        </td>
        <td className="px-3 py-3 font-mono text-sm text-foreground whitespace-nowrap">
          {invoice.totalAmount}
        </td>
        <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
          <div>F: {invoice.fees}</div>
          <div>E: {invoice.expenses}</div>
        </td>
        <td className="px-3 py-3">
          {invoice.aiScore !== null ? (
            <span
              className={`text-[10px] font-medium font-mono px-1.5 py-0.5 rounded-md ${aiScoreColor(
                invoice.aiScore
              )} ${aiScoreBg(invoice.aiScore)}`}
            >
              {invoice.aiScore}
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground">—</span>
          )}
        </td>
        <td className="px-3 py-3">
          {invoice.flagCount > 0 ? (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md text-destructive bg-destructive/10">
              {invoice.flagCount}
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground">0</span>
          )}
        </td>
        <td className="px-3 py-3">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${status.textClass} ${status.bgClass}`}
          >
            <span className={`size-1.5 rounded-full ${status.dotClass}`} />
            {status.label}
          </span>
        </td>
        <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
          {invoice.dueDate}
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center gap-1">
            {(invoice.status === "received" ||
              invoice.status === "under_review" ||
              invoice.status === "ai_flagged") && (
              <>
                <Button variant="outline" size="xs">
                  Review
                </Button>
                <Button variant="ghost" size="xs">
                  Approve
                </Button>
                {isFlagged && (
                  <Button variant="destructive" size="xs">
                    Dispute
                  </Button>
                )}
              </>
            )}
            {invoice.status === "approved" && (
              <span className="text-[10px] text-success">Approved</span>
            )}
            {invoice.status === "paid" && (
              <span className="text-[10px] text-muted-foreground">Paid</span>
            )}
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {expanded && hasDetails && (
          <InvoiceExpandedRow invoice={invoice} />
        )}
      </AnimatePresence>
    </>
  );
}

export function InvoicesTab() {
  const [filter, setFilter] = useState<QuickFilter>("all");
  const filtered = filterInvoices(INVOICES, filter);

  return (
    <motion.div {...fadeIn} className="space-y-4">
      {/* Quick filters */}
      <div className="flex items-center gap-1">
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              filter === f.key
                ? "bg-card text-foreground font-medium shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-card border border-border rounded-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <th className="px-3 py-2.5 font-medium w-6" />
              <th className="px-3 py-2.5 font-medium">Invoice #</th>
              <th className="px-3 py-2.5 font-medium">Firm</th>
              <th className="px-3 py-2.5 font-medium">Engagement</th>
              <th className="px-3 py-2.5 font-medium">Period</th>
              <th className="px-3 py-2.5 font-medium">Amount</th>
              <th className="px-3 py-2.5 font-medium">Fees / Exp</th>
              <th className="px-3 py-2.5 font-medium">AI Score</th>
              <th className="px-3 py-2.5 font-medium">Flags</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 font-medium">Due</th>
              <th className="px-3 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <InvoiceRow key={inv.id} invoice={inv} />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No invoices match this filter.
          </div>
        )}
      </div>
    </motion.div>
  );
}
