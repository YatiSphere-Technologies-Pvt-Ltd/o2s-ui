"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Layers,
  Move,
  Search,
  TriangleAlert,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import { useFinanceStore } from "@/lib/finance-store";
import {
  COST_CATEGORY_LABEL,
  COST_CATEGORY_TINT,
  formatMoney,
  projectBudgetTotals,
  type BudgetLine,
  type CostCategory,
} from "@/components/delivery/financial/data";

export default function BudgetsPage() {
  const { setScreen } = useScreen();
  const { projects } = useDeliveryStore();
  const { budgetLines, reallocateBudget } = useFinanceStore();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CostCategory | "all">("all");
  const [reallocFrom, setReallocFrom] = useState<BudgetLine | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Budgets" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  const grouped = useMemo(() => {
    const map: Record<string, BudgetLine[]> = {};
    for (const l of budgetLines) {
      const q = query.trim().toLowerCase();
      const proj = projects.find((p) => p.id === l.projectId);
      if (!proj) continue;
      if (categoryFilter !== "all" && l.category !== categoryFilter) continue;
      if (q && !proj.name.toLowerCase().includes(q)) continue;
      if (!map[l.projectId]) map[l.projectId] = [];
      map[l.projectId].push(l);
    }
    return map;
  }, [budgetLines, projects, query, categoryFilter]);

  const orgTotals = useMemo(() => {
    const planned = budgetLines.reduce((s, l) => s + l.plannedINR, 0);
    const actual = budgetLines.reduce((s, l) => s + l.actualINR, 0);
    const committed = budgetLines.reduce((s, l) => s + l.committedINR, 0);
    const accrued = budgetLines.reduce((s, l) => s + l.accruedINR, 0);
    return { planned, committed, accrued, actual };
  }, [budgetLines]);

  const byCategory = useMemo(() => {
    const map: Record<CostCategory, { planned: number; actual: number }> = {
      labor: { planned: 0, actual: 0 },
      vendor: { planned: 0, actual: 0 },
      software: { planned: 0, actual: 0 },
      travel: { planned: 0, actual: 0 },
      infra: { planned: 0, actual: 0 },
      other: { planned: 0, actual: 0 },
    };
    for (const l of budgetLines) {
      map[l.category].planned += l.plannedINR;
      map[l.category].actual += l.actualINR;
    }
    return map;
  }, [budgetLines]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link href="/delivery/financials" className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Budgets</h1>
            <p className="text-sm text-muted-foreground">Planned → Committed → Accrued → Actual, per project, per category. Reallocate within a project.</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="rounded-lg bg-success/10 border border-success/20 px-3 py-2 text-[12px] text-success flex items-center gap-2">
            <Check className="size-3.5" />
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Org totals + by-category mini bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Org totals</p>
          <ul className="space-y-1.5 text-[12px]">
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Planned</span><span className="tabular-nums font-medium text-foreground">{formatMoney(orgTotals.planned, "INR", true)}</span></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Committed</span><span className="tabular-nums text-foreground">{formatMoney(orgTotals.committed, "INR", true)}</span></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Accrued</span><span className="tabular-nums text-foreground">{formatMoney(orgTotals.accrued, "INR", true)}</span></li>
            <li className="flex items-center justify-between border-t border-border pt-1.5 mt-1.5"><span className="text-muted-foreground">Actual</span><span className="tabular-nums font-semibold text-foreground">{formatMoney(orgTotals.actual, "INR", true)}</span></li>
          </ul>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 lg:col-span-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">By category — planned vs actual</p>
          <ul className="space-y-2">
            {(Object.keys(byCategory) as CostCategory[]).map((cat) => {
              const data = byCategory[cat];
              const pct = data.planned === 0 ? 0 : Math.round((data.actual / data.planned) * 100);
              return (
                <li key={cat} className="text-[12px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${COST_CATEGORY_TINT[cat]}`}>{COST_CATEGORY_LABEL[cat]}</span>
                    <span className="ml-auto tabular-nums text-muted-foreground">{formatMoney(data.actual, "INR", true)} / {formatMoney(data.planned, "INR", true)}</span>
                    <span className={`tabular-nums font-medium ${pct > 100 ? "text-destructive" : pct > 90 ? "text-warning" : "text-success"}`}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded overflow-hidden">
                    <div className={`h-full ${pct > 100 ? "bg-destructive" : pct > 90 ? "bg-warning" : "bg-success"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search project…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
        </div>
        <div className="flex items-center gap-1">
          {(["all", "labor", "vendor", "software", "travel", "infra", "other"] as const).map((c) => (
            <button key={c} onClick={() => setCategoryFilter(c)}
              className={`h-9 px-2.5 rounded-lg text-[11px] transition-colors ${
                categoryFilter === c ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}>
              {c === "all" ? "All" : COST_CATEGORY_LABEL[c as CostCategory]}
            </button>
          ))}
        </div>
      </div>

      {/* Per-project sections */}
      <div className="space-y-3">
        {Object.entries(grouped).map(([projectId, lines]) => {
          const project = projects.find((p) => p.id === projectId);
          if (!project) return null;
          const totals = projectBudgetTotals(projectId);
          const over = totals.actual > totals.planned;
          return (
            <section key={projectId} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <Link href={`/delivery/financials/projects/${project.id}`} className="text-sm font-semibold text-foreground hover:underline inline-flex items-center gap-2">
                    {project.name}
                    {over && <TriangleAlert className="size-3 text-destructive" />}
                  </Link>
                  <p className="text-[11px] text-muted-foreground">{project.customer ?? "Internal"}</p>
                </div>
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  {formatMoney(totals.actual, "INR", true)} / {formatMoney(totals.planned, "INR", true)}
                  <span className={`ml-2 font-medium ${over ? "text-destructive" : "text-success"}`}>{Math.round((totals.actual / totals.planned) * 100)}%</span>
                </p>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-surface-overlay/20 border-b border-border">
                  <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    <th className="text-left px-4 py-2 font-semibold">Category</th>
                    <th className="text-right px-3 py-2 font-semibold">Planned</th>
                    <th className="text-right px-3 py-2 font-semibold">Committed</th>
                    <th className="text-right px-3 py-2 font-semibold">Accrued</th>
                    <th className="text-right px-3 py-2 font-semibold">Actual</th>
                    <th className="text-right px-3 py-2 font-semibold">% used</th>
                    <th className="text-right px-4 py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l) => {
                    const pct = l.plannedINR === 0 ? 0 : Math.round((l.actualINR / l.plannedINR) * 100);
                    return (
                      <tr key={l.id} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                        <td className="px-4 py-2">
                          <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${COST_CATEGORY_TINT[l.category]}`}>{COST_CATEGORY_LABEL[l.category]}</span>
                          {l.note && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{l.note}</p>}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-foreground">{formatMoney(l.plannedINR, "INR", true)}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatMoney(l.committedINR, "INR", true)}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatMoney(l.accruedINR, "INR", true)}</td>
                        <td className="px-3 py-2 text-right tabular-nums font-medium text-foreground">{formatMoney(l.actualINR, "INR", true)}</td>
                        <td className={`px-3 py-2 text-right tabular-nums font-medium ${pct > 100 ? "text-destructive" : pct > 90 ? "text-warning" : "text-success"}`}>{pct}%</td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={() => setReallocFrom(l)} className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] text-brand hover:bg-brand/10 transition-colors">
                            <Move className="size-3" />
                            Reallocate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          );
        })}
        {Object.keys(grouped).length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-12">No budget lines match these filters.</p>
        )}
      </div>

      <AnimatePresence>
        {reallocFrom && (
          <ReallocateModal
            from={reallocFrom}
            candidates={budgetLines.filter((b) => b.projectId === reallocFrom.projectId && b.id !== reallocFrom.id)}
            onClose={() => setReallocFrom(null)}
            onConfirm={(toId, amount) => {
              const ok = reallocateBudget(reallocFrom.id, toId, amount);
              setReallocFrom(null);
              if (ok) flashOnce("Budget reallocated.");
              else flashOnce("Couldn't reallocate — check planned balance.");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ReallocateModal({
  from,
  candidates,
  onClose,
  onConfirm,
}: {
  from: BudgetLine;
  candidates: BudgetLine[];
  onClose: () => void;
  onConfirm: (toId: string, amountINR: number) => void;
}) {
  const [toId, setToId] = useState<string>(candidates[0]?.id ?? "");
  const [amount, setAmount] = useState<number>(Math.min(100_000, from.plannedINR));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md min-w-80"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground inline-flex items-center gap-2"><Move className="size-4" />Reallocate budget</h3>
            <p className="text-[11px] text-muted-foreground">{COST_CATEGORY_LABEL[from.category]} → another line in same project</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"><X className="size-4" /></button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="rounded-lg border border-border p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">From</p>
            <p className="text-sm text-foreground inline-flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${COST_CATEGORY_TINT[from.category]}`}>{COST_CATEGORY_LABEL[from.category]}</span>
              <span className="tabular-nums">{formatMoney(from.plannedINR, "INR", true)} planned</span>
            </p>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">To</span>
            <select value={toId} onChange={(e) => setToId(e.target.value)}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>{COST_CATEGORY_LABEL[c.category]} — {formatMoney(c.plannedINR, "INR", true)} planned</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Amount (INR)</span>
            <input type="number" min={0} max={from.plannedINR} value={amount} onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
            <p className="text-[10px] text-muted-foreground/70 mt-1">Max: {formatMoney(from.plannedINR, "INR", true)}</p>
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button onClick={onClose} className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">Cancel</button>
          <button onClick={() => onConfirm(toId, amount)} disabled={!toId || amount <= 0 || amount > from.plannedINR}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
            <Layers className="size-3.5" />
            Reallocate
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
