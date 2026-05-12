"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  ChevronRight,
  DollarSign,
  Gauge,
  Receipt,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import { useFinanceStore } from "@/lib/finance-store";
import {
  computeProjectPnL,
  COST_CATEGORY_LABEL,
  COST_CATEGORY_TINT,
  CONTRACT_TYPE_LABEL,
  EVM_SNAPSHOTS,
  formatMoney,
} from "@/components/delivery/financial/data";
import { RAG_DOT } from "@/components/delivery/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPnLPage({ params }: PageProps) {
  const { id } = use(params);
  const { setScreen } = useScreen();
  const { findProject } = useDeliveryStore();
  const { budgetLines, revenueLines, invoices, purchaseOrders } = useFinanceStore();
  const [scenarioCost, setScenarioCost] = useState(1.0);
  const [scenarioRev, setScenarioRev] = useState(1.0);

  const project = findProject(id);
  const projectName = project?.name;

  useEffect(() => {
    if (!projectName) return;
    setScreen({ module: "Delivery", page: "Project P&L", recordId: id, recordLabel: projectName });
    return () => setScreen(null);
  }, [id, projectName, setScreen]);

  const pnl = useMemo(() => (project ? computeProjectPnL(project) : null), [project]);
  const lines = useMemo(() => budgetLines.filter((b) => b.projectId === id), [budgetLines, id]);
  const revs = useMemo(() => revenueLines.filter((r) => r.projectId === id), [revenueLines, id]);
  const projInvoices = useMemo(() => invoices.filter((i) => i.projectId === id), [invoices, id]);
  const projPos = useMemo(() => purchaseOrders.filter((p) => p.projectId === id), [purchaseOrders, id]);
  const evm = useMemo(() => EVM_SNAPSHOTS.find((e) => e.projectId === id), [id]);

  if (!project || !pnl) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Project not found</h1>
        <Link href="/delivery/financials" className="text-brand underline mt-3 inline-block">Back to financials</Link>
      </div>
    );
  }

  // Live scenario math
  const projectedEac = pnl.eacINR * scenarioCost;
  const projectedTotalRev = (pnl.revenueToDateINR + pnl.forecastRevenueINR) * scenarioRev;
  const projectedMargin = projectedTotalRev - projectedEac;
  const projectedMarginPct = projectedTotalRev === 0 ? 0 : (projectedMargin / projectedTotalRev) * 100;

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
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{project.name}</h1>
              <span className={`size-1.5 rounded-full ${RAG_DOT[project.rag]}`} />
              <Link href={`/delivery/projects/${project.id}`} className="text-[11px] text-brand hover:underline inline-flex items-center gap-1">
                Project hub
                <ChevronRight className="size-3" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">{project.customer ?? "Internal"} · {project.charter.startISO} → {project.charter.endISO}</p>
          </div>
        </div>
      </motion.div>

      {/* P&L headline */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <PnLTile icon={DollarSign} label="BAC (planned)"    value={formatMoney(pnl.bacINR, "INR", true)} tint="bg-brand/10 text-brand" />
        <PnLTile icon={Banknote}   label="Cost-to-date"     value={formatMoney(pnl.costToDateINR, "INR", true)} sub={`${Math.round((pnl.costToDateINR / pnl.bacINR) * 100)}% of BAC`} tint="bg-brand-teal/10 text-brand-teal" />
        <PnLTile icon={Banknote}   label="EAC (will land)" value={formatMoney(pnl.eacINR, "INR", true)} sub={
          <span className={pnl.varianceINR >= 0 ? "text-success" : "text-destructive"}>
            {pnl.varianceINR >= 0 ? "+" : ""}{pnl.variancePct.toFixed(1)}% vs BAC
          </span>
        } tint="bg-warning/10 text-warning" />
        <PnLTile icon={TrendingUp} label="ETC (remaining)" value={formatMoney(pnl.etcINR, "INR", true)} sub="EAC − cost-to-date" tint="bg-brand-purple/10 text-brand-purple" />
        <PnLTile icon={Gauge}      label="Projected margin"
          value={
            <span className={pnl.projectedMarginPct >= 25 ? "text-success" : pnl.projectedMarginPct >= 10 ? "text-warning" : pnl.projectedMarginPct < 0 ? "text-destructive" : "text-foreground"}>
              {pnl.revenueToDateINR + pnl.forecastRevenueINR === 0 ? "Internal" : `${pnl.projectedMarginPct.toFixed(1)}%`}
            </span>
          }
          sub={formatMoney(pnl.projectedMarginINR, "INR", true)} tint="bg-success/10 text-success" />
      </div>

      {/* EVM strip */}
      {evm && (
        <section className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold inline-flex items-center gap-1.5">
              <Gauge className="size-3" />
              Earned Value (EVM) · as of {evm.asOfISO}
            </p>
            <p className="text-[11px] text-muted-foreground">
              SPI {pnl.spi.toFixed(2)} · CPI {pnl.cpi.toFixed(2)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <EvmStat label="Planned (PV)"  value={formatMoney(evm.pv, "INR", true)} description="What we planned to deliver by now" />
            <EvmStat label="Earned (EV)"   value={formatMoney(evm.ev, "INR", true)} description="Value we actually delivered" />
            <EvmStat label="Actual (AC)"   value={formatMoney(evm.ac, "INR", true)} description="What we actually spent" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className={`rounded-lg p-2 ${pnl.spi < 0.92 ? "bg-destructive/10" : pnl.spi < 1 ? "bg-warning/10" : "bg-success/10"}`}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold inline-flex items-center gap-1.5">
                {pnl.spi < 1 ? <TrendingDown className="size-3" /> : <TrendingUp className="size-3" />}
                Schedule (SPI)
              </p>
              <p className="text-sm text-foreground">
                {pnl.spi < 0.92
                  ? `Behind schedule. Running at ${Math.round(pnl.spi * 100)}% of plan.`
                  : pnl.spi < 1
                  ? `Slightly behind. ${Math.round((1 - pnl.spi) * 100)}% delivery gap.`
                  : `On / ahead of schedule.`}
              </p>
            </div>
            <div className={`rounded-lg p-2 ${pnl.cpi < 0.92 ? "bg-destructive/10" : pnl.cpi < 1 ? "bg-warning/10" : "bg-success/10"}`}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold inline-flex items-center gap-1.5">
                {pnl.cpi < 1 ? <TrendingDown className="size-3" /> : <TrendingUp className="size-3" />}
                Cost (CPI)
              </p>
              <p className="text-sm text-foreground">
                {pnl.cpi < 0.92
                  ? `Over budget. ${Math.round((1 - pnl.cpi) * 100)}% cost overrun for value earned.`
                  : pnl.cpi < 1
                  ? `Slightly over. ~${Math.round((1 - pnl.cpi) * 100)}% cost gap.`
                  : `On / under budget.`}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Scenario sliders */}
      <section className="bg-card border border-border rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-3">What-if scenario</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-foreground flex items-center justify-between mb-1.5">
              Cost multiplier
              <span className="tabular-nums font-medium">{scenarioCost.toFixed(2)}×</span>
            </label>
            <input
              type="range"
              min="0.85"
              max="1.25"
              step="0.01"
              value={scenarioCost}
              onChange={(e) => setScenarioCost(parseFloat(e.target.value))}
              className="w-full accent-warning"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/70 tabular-nums">
              <span>−15% (great)</span>
              <span>+25% (downside)</span>
            </div>
          </div>
          <div>
            <label className="text-[11px] text-foreground flex items-center justify-between mb-1.5">
              Revenue multiplier
              <span className="tabular-nums font-medium">{scenarioRev.toFixed(2)}×</span>
            </label>
            <input
              type="range"
              min="0.70"
              max="1.20"
              step="0.01"
              value={scenarioRev}
              onChange={(e) => setScenarioRev(parseFloat(e.target.value))}
              className="w-full accent-success"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/70 tabular-nums">
              <span>−30% (lost scope)</span>
              <span>+20% (upsell)</span>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3">
          <ScenarioOut label="EAC under scenario" value={formatMoney(projectedEac, "INR", true)} />
          <ScenarioOut label="Revenue under scenario" value={formatMoney(projectedTotalRev, "INR", true)} />
          <ScenarioOut
            label="Margin under scenario"
            value={
              <span className={projectedMarginPct >= 25 ? "text-success" : projectedMarginPct >= 10 ? "text-warning" : projectedMarginPct < 0 ? "text-destructive" : "text-foreground"}>
                {projectedTotalRev === 0 ? "Internal" : `${projectedMarginPct.toFixed(1)}%`}
              </span>
            }
          />
        </div>
      </section>

      {/* Budget vs Actuals — by category */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Budget vs actuals by category</p>
          <p className="text-[11px] text-muted-foreground">Planned → Committed → Accrued → Actual.</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface-overlay/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              <th className="text-left px-4 py-2 font-semibold">Category</th>
              <th className="text-right px-3 py-2 font-semibold">Planned</th>
              <th className="text-right px-3 py-2 font-semibold">Committed</th>
              <th className="text-right px-3 py-2 font-semibold">Accrued</th>
              <th className="text-right px-3 py-2 font-semibold">Actual</th>
              <th className="text-right px-4 py-2 font-semibold">Variance</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => {
              const variance = l.plannedINR - l.actualINR;
              const variancePct = l.plannedINR === 0 ? 0 : (variance / l.plannedINR) * 100;
              return (
                <tr key={l.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${COST_CATEGORY_TINT[l.category]}`}>{COST_CATEGORY_LABEL[l.category]}</span>
                      {l.note && <span className="text-[10px] text-muted-foreground/70 truncate max-w-60">{l.note}</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-foreground">{formatMoney(l.plannedINR, "INR", true)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatMoney(l.committedINR, "INR", true)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatMoney(l.accruedINR, "INR", true)}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium text-foreground">{formatMoney(l.actualINR, "INR", true)}</td>
                  <td className={`px-4 py-2 text-right tabular-nums font-medium ${variance < 0 ? "text-destructive" : variancePct < 5 ? "text-warning" : "text-success"}`}>
                    {variance >= 0 ? "+" : ""}{variancePct.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-surface-overlay/30">
            <tr className="text-[11px] font-semibold">
              <td className="px-4 py-2 text-muted-foreground">Total</td>
              <td className="px-3 py-2 text-right tabular-nums text-foreground">{formatMoney(lines.reduce((s, l) => s + l.plannedINR, 0), "INR", true)}</td>
              <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatMoney(lines.reduce((s, l) => s + l.committedINR, 0), "INR", true)}</td>
              <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatMoney(lines.reduce((s, l) => s + l.accruedINR, 0), "INR", true)}</td>
              <td className="px-3 py-2 text-right tabular-nums text-foreground">{formatMoney(lines.reduce((s, l) => s + l.actualINR, 0), "INR", true)}</td>
              <td className="px-4 py-2"></td>
            </tr>
          </tfoot>
        </table>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue lines */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
              <TrendingUp className="size-4 text-success" />
              Revenue lines
            </p>
            <span className="text-[11px] text-muted-foreground">{revs.length}</span>
          </div>
          {revs.length === 0 ? (
            <p className="px-4 py-6 text-center text-[12px] text-muted-foreground italic">Internal project — no billable revenue.</p>
          ) : (
            <ul>
              {revs.map((r) => (
                <li key={r.id} className="px-4 py-2 border-b border-border last:border-b-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider bg-secondary text-foreground px-1.5 py-0.5 rounded">{CONTRACT_TYPE_LABEL[r.contractType]}</span>
                    <p className="text-[12px] text-foreground flex-1">{r.label}</p>
                    <p className="text-[12px] tabular-nums font-medium text-foreground">{formatMoney(r.amount, r.currency, true)}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 mt-0.5">
                    <span>Scheduled {r.scheduledISO}</span>
                    <span className={`px-1.5 py-0.5 rounded ${r.status === "paid" ? "bg-success/10 text-success" : r.status === "ready_to_invoice" ? "bg-warning/10 text-warning" : r.status === "invoiced" ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground"}`}>
                      {r.status.replace("_", " ")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Invoices + POs sidebar */}
        <section className="space-y-3">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                <Receipt className="size-4 text-brand" />
                Invoices
              </p>
              <Link href="/delivery/financials/invoices" className="text-[11px] text-brand hover:underline">All →</Link>
            </div>
            <ul>
              {projInvoices.length === 0 ? (
                <li className="px-4 py-6 text-center text-[12px] text-muted-foreground italic">No invoices yet.</li>
              ) : projInvoices.map((inv) => (
                <li key={inv.id} className="px-4 py-2 border-b border-border last:border-b-0 flex items-center gap-2">
                  <Link href={`/delivery/financials/invoices/${inv.id}`} className="flex-1 min-w-0 text-[12px] text-foreground hover:underline">
                    {inv.number}
                  </Link>
                  <span className="text-[11px] tabular-nums">{formatMoney(inv.total, inv.currency, true)}</span>
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${inv.status === "paid" ? "bg-success/10 text-success" : inv.status === "overdue" ? "bg-destructive/10 text-destructive" : "bg-secondary text-muted-foreground"}`}>{inv.status.replace("_", " ")}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                <ShoppingCart className="size-4 text-warning" />
                Open POs
              </p>
              <span className="text-[11px] text-muted-foreground">{projPos.length}</span>
            </div>
            <ul>
              {projPos.length === 0 ? (
                <li className="px-4 py-6 text-center text-[12px] text-muted-foreground italic">No POs.</li>
              ) : projPos.map((p) => (
                <li key={p.id} className="px-4 py-2 border-b border-border last:border-b-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] text-foreground flex-1 truncate">{p.description}</p>
                    <span className="text-[11px] tabular-nums text-foreground">{formatMoney(p.amount, p.currency, true)}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-secondary rounded overflow-hidden">
                      <div className="h-full bg-warning" style={{ width: `${Math.round((p.amountDrawn / p.amount) * 100)}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground tabular-nums">{Math.round((p.amountDrawn / p.amount) * 100)}% drawn</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Variance warnings */}
      {pnl.varianceINR < 0 && (
        <section className="bg-destructive/5 border border-destructive/30 rounded-xl p-4 flex items-start gap-3">
          <TriangleAlert className="size-4 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">EAC is over BAC by {Math.abs(pnl.variancePct).toFixed(1)}%</p>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              The Risk Sentinel agent is watching this. Common drivers: vendor PO sprawl, scope creep without
              charter update, or under-estimated complexity. Consider a budget reallocation, scope reduction, or
              change request to the sponsor.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function PnLTile({
  icon: Icon,
  label,
  value,
  sub,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tint: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1 inline-flex items-center gap-1.5">
        <span className={`size-5 rounded-md flex items-center justify-center ${tint}`}><Icon className="size-3" /></span>
        {label}
      </p>
      <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>}
    </div>
  );
}

function EvmStat({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-overlay/40 p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</p>
      <p className="text-lg font-bold text-foreground tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground/70 leading-snug mt-0.5">{description}</p>
    </div>
  );
}

function ScenarioOut({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</p>
      <p className="text-base font-bold text-foreground tabular-nums">{value}</p>
    </div>
  );
}
