"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  CircleDollarSign,
  Globe,
  Receipt,
  Sparkles,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useFinanceStore } from "@/lib/finance-store";
import {
  CURRENCY_SYMBOL,
  PROJECTS,
  formatMoney,
  type BillRate,
  type Currency,
} from "@/components/delivery/financial/data";
import { PEOPLE_MAP } from "@/components/delivery/data";

export default function RatesPage() {
  const { setScreen } = useScreen();
  const { costRates, billRates } = useFinanceStore();
  const [tab, setTab] = useState<"cost" | "bill">("cost");
  const [showHistorical, setShowHistorical] = useState(false);

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Rate cards" });
    return () => setScreen(null);
  }, [setScreen]);

  const today = "2026-05-12";

  const filteredCost = useMemo(() => {
    return costRates.filter((r) => showHistorical ? true : (!r.effectiveToISO || r.effectiveToISO >= today));
  }, [costRates, showHistorical]);

  const filteredBill = useMemo(() => {
    return billRates.filter((r) => showHistorical ? true : (!r.effectiveToISO || r.effectiveToISO >= today));
  }, [billRates, showHistorical]);

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Rate cards</h1>
            <p className="text-sm text-muted-foreground">Cost rates (what people cost us) and bill rates (what we charge clients). Effective-dated, multi-currency.</p>
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={showHistorical} onChange={(e) => setShowHistorical(e.target.checked)} className="accent-brand" />
          Show historical / expired
        </label>
      </motion.div>

      <div className="flex items-center gap-1 border-b border-border">
        {(["cost", "bill"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "cost" ? <CircleDollarSign className="size-3.5" /> : <Receipt className="size-3.5" />}
            {t === "cost" ? "Cost rates" : "Bill rates"}
          </button>
        ))}
      </div>

      {tab === "cost" && (
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Cost rates ({filteredCost.length})</p>
            <p className="text-[11px] text-muted-foreground">Person-pinned rates override role/location rates. History is preserved for invoice reconstruction.</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface-overlay/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                <th className="text-left px-4 py-2 font-semibold">Scope</th>
                <th className="text-right px-3 py-2 font-semibold">Hourly cost</th>
                <th className="text-left px-3 py-2 font-semibold">Effective</th>
                <th className="text-left px-3 py-2 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredCost.map((r) => {
                const person = r.personId ? PEOPLE_MAP[r.personId] : null;
                const expired = r.effectiveToISO && r.effectiveToISO < today;
                return (
                  <tr key={r.id} className={`border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors ${expired ? "opacity-60" : ""}`}>
                    <td className="px-4 py-2">
                      {person ? (
                        <div className="flex items-center gap-2">
                          <span className={`size-6 rounded-full ${person.avatarColor} text-white text-[9px] font-bold flex items-center justify-center`}>{person.initials}</span>
                          <div className="min-w-0">
                            <p className="text-[12px] text-foreground">{person.name}</p>
                            <p className="text-[10px] text-muted-foreground/70">Person-pinned</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="size-6 rounded bg-secondary text-muted-foreground flex items-center justify-center text-[10px] font-bold"><Globe className="size-3" /></span>
                          <div>
                            <p className="text-[12px] text-foreground">{r.role}</p>
                            <p className="text-[10px] text-muted-foreground/70">{r.location && `${r.location} · `}Role/location</p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <p className="text-[12px] tabular-nums font-medium text-foreground">{CURRENCY_SYMBOL[r.currency]}{r.hourlyCost.toLocaleString("en-IN")}/hr</p>
                      <p className="text-[10px] text-muted-foreground/70 tabular-nums">≈ {formatMoney(r.hourlyCost * (r.currency === "INR" ? 1 : 84), "INR", true)}/hr</p>
                    </td>
                    <td className="px-3 py-2 text-[11px] text-muted-foreground tabular-nums">
                      <p className="inline-flex items-center gap-1"><Calendar className="size-2.5" />{r.effectiveFromISO}</p>
                      <p>{r.effectiveToISO ? `→ ${r.effectiveToISO}` : <span className="text-success">Active</span>}</p>
                    </td>
                    <td className="px-3 py-2 text-[11px] text-muted-foreground">{r.note ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {tab === "bill" && (
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Bill rates ({filteredBill.length})</p>
            <p className="text-[11px] text-muted-foreground">Per customer + project. Person-pinned wins over role-scoped. Fixed or markup-based.</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface-overlay/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                <th className="text-left px-4 py-2 font-semibold">Customer · Project</th>
                <th className="text-left px-3 py-2 font-semibold">Scope</th>
                <th className="text-right px-3 py-2 font-semibold">Bill rate</th>
                <th className="text-left px-3 py-2 font-semibold">Type</th>
                <th className="text-left px-3 py-2 font-semibold">Effective</th>
              </tr>
            </thead>
            <tbody>
              {filteredBill.map((r: BillRate) => {
                const person = r.personId ? PEOPLE_MAP[r.personId] : null;
                const project = r.projectId ? PROJECTS.find((p) => p.id === r.projectId) : undefined;
                const expired = r.effectiveToISO && r.effectiveToISO < today;
                return (
                  <tr key={r.id} className={`border-b border-border last:border-b-0 ${expired ? "opacity-60" : ""}`}>
                    <td className="px-4 py-2">
                      <p className="text-[12px] text-foreground">{r.customer ?? "—"}</p>
                      <p className="text-[10px] text-muted-foreground/70">{project?.name ?? "—"}</p>
                    </td>
                    <td className="px-3 py-2 text-[12px] text-foreground">
                      {person ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`size-5 rounded-full ${person.avatarColor} text-white text-[8px] font-bold flex items-center justify-center`}>{person.initials}</span>
                          {person.name}
                        </span>
                      ) : r.role ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <p className="text-[12px] tabular-nums font-medium text-foreground">{CURRENCY_SYMBOL[r.currency as Currency]}{r.hourlyBill.toLocaleString("en-IN")}/hr</p>
                      {r.markupPct && <p className="text-[10px] text-muted-foreground/70">+{r.markupPct}% over cost</p>}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${r.fixed ? "bg-brand/10 text-brand" : "bg-warning/10 text-warning"}`}>
                        {r.fixed ? "Fixed" : "Markup"}
                      </span>
                      {r.personId && <span className="ml-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple">Person-pinned</span>}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-muted-foreground tabular-nums">
                      {r.effectiveFromISO}{r.effectiveToISO ? ` → ${r.effectiveToISO}` : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      <p className="text-[11px] text-muted-foreground/60 flex items-start gap-2 pt-2">
        <Sparkles className="size-3 mt-0.5" />
        <span>Rates are versioned: when an invoice is regenerated, the rate that was effective on the work date is used — not today&apos;s rate.</span>
      </p>

      <div className="flex items-center justify-end">
        <Link href="/delivery/financials" className="text-[11px] text-brand hover:underline inline-flex items-center gap-1">
          Back to financials
          <ChevronRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
