"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Filter as FilterIcon,
  Plus,
  Receipt,
  Search,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import { useFinanceStore } from "@/lib/finance-store";
import {
  ERP_LABEL,
  formatMoney,
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_TINT,
  type InvoiceStatus,
} from "@/components/delivery/financial/data";

export default function InvoicesListPage() {
  const { setScreen } = useScreen();
  const { invoices } = useFinanceStore();
  const { projects } = useDeliveryStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Invoices" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter((i) => {
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (!q) return true;
      return (
        i.number.toLowerCase().includes(q) ||
        i.customer.toLowerCase().includes(q) ||
        (projects.find((p) => p.id === i.projectId)?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [invoices, query, statusFilter, projects]);

  const counts = useMemo(() => ({
    all: invoices.length,
    draft: invoices.filter((i) => i.status === "draft").length,
    pm_review: invoices.filter((i) => i.status === "pm_review").length,
    finance_review: invoices.filter((i) => i.status === "finance_review").length,
    sent: invoices.filter((i) => i.status === "sent").length,
    paid: invoices.filter((i) => i.status === "paid").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
  }), [invoices]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link href="/delivery/financials" className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Invoices</h1>
            <p className="text-sm text-muted-foreground">PM approval → Finance approval → ERP push → send. {invoices.length} invoices.</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="size-3.5" />
          New invoice
        </button>
      </motion.div>

      {/* Status tiles */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
        {(["all", "draft", "pm_review", "finance_review", "sent", "paid", "overdue"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-left p-3 rounded-lg border transition-colors ${
              statusFilter === s ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
              {s === "all" ? "All" : INVOICE_STATUS_LABEL[s]}
            </p>
            <p className="text-xl font-bold text-foreground tabular-nums mt-1">{counts[s]}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search invoice, customer, project…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
        </div>
        <FilterIcon className="size-3.5 text-muted-foreground" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-overlay/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              <th className="text-left px-4 py-2 font-semibold">Invoice</th>
              <th className="text-left px-3 py-2 font-semibold">Customer</th>
              <th className="text-left px-3 py-2 font-semibold">Project</th>
              <th className="text-right px-3 py-2 font-semibold">Total</th>
              <th className="text-center px-3 py-2 font-semibold">Status</th>
              <th className="text-left px-3 py-2 font-semibold">Issued / Due</th>
              <th className="text-left px-3 py-2 font-semibold">ERP</th>
              <th className="text-right px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => {
              const proj = projects.find((p) => p.id === inv.projectId);
              return (
                <tr key={inv.id} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                  <td className="px-4 py-2">
                    <Link href={`/delivery/financials/invoices/${inv.id}`} className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-2">
                      <Receipt className="size-3.5 text-muted-foreground" />
                      {inv.number}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-[12px] text-foreground">{inv.customer}</td>
                  <td className="px-3 py-2 text-[12px] text-muted-foreground">{proj?.shortName ?? "—"}</td>
                  <td className="px-3 py-2 text-right text-[12px] tabular-nums font-medium text-foreground">{formatMoney(inv.total, inv.currency, true)}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${INVOICE_STATUS_TINT[inv.status]}`}>
                      {INVOICE_STATUS_LABEL[inv.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[11px] text-muted-foreground tabular-nums">
                    {inv.issuedISO ? <p>{inv.issuedISO}</p> : <p className="text-muted-foreground/60">—</p>}
                    {inv.dueISO ? <p>Due {inv.dueISO}</p> : <p className="text-muted-foreground/60">—</p>}
                  </td>
                  <td className="px-3 py-2 text-[11px]">
                    {inv.erp?.pushed ? (
                      <span className="inline-flex items-center gap-1 text-success">
                        <span className="size-1.5 rounded-full bg-success" />
                        {ERP_LABEL[inv.erp.destination]} · {inv.erp.externalRef}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60">Not pushed</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/delivery/financials/invoices/${inv.id}`} aria-label="Open">
                      <ChevronRight className="size-4 text-muted-foreground/40 inline" />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground italic">No invoices match these filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
