"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BarChart3,
  CheckCircle2,
  DollarSign,
  FileText,
  Gauge,
  LayoutGrid,
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
  PORTFOLIOS,
  PROGRAMS,
  programsForPortfolio,
  projectsForProgram,
  RAG_DOT,
} from "@/components/delivery/data";
import {
  allProjectPnL,
  CONTRACT_TYPE_LABEL,
  formatMoney,
  type ProjectPnL,
} from "@/components/delivery/financial/data";

export default function FinancialsHubPage() {
  const { setScreen } = useScreen();
  const { projects } = useDeliveryStore();
  const { revenueLines, invoices, purchaseOrders, approvals } = useFinanceStore();

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Financials hub" });
    return () => setScreen(null);
  }, [setScreen]);

  const pnls = useMemo(() => allProjectPnL(), []);

  const totals = useMemo(() => {
    const bac = projects.reduce((s, p) => s + p.totalBudgetINR, 0);
    const cost = pnls.reduce((s, p) => s + p.costToDateINR, 0);
    const eac = pnls.reduce((s, p) => s + p.eacINR, 0);
    const rev = pnls.reduce((s, p) => s + p.revenueToDateINR, 0);
    const forecastRev = pnls.reduce((s, p) => s + p.forecastRevenueINR, 0);
    const margin = (rev + forecastRev) - eac;
    const marginPct = rev + forecastRev === 0 ? 0 : (margin / (rev + forecastRev)) * 100;
    return { bac, cost, eac, rev, forecastRev, margin, marginPct, variance: bac - eac };
  }, [projects, pnls]);

  const watchList = useMemo(
    () =>
      pnls
        .filter((p) => p.variancePct < -5 || p.cpi < 0.92 || p.spi < 0.92)
        .sort((a, b) => a.variancePct - b.variancePct),
    [pnls],
  );

  const readyToInvoice = revenueLines.filter((r) => r.status === "ready_to_invoice");
  const pendingPmApprovals = invoices.filter((i) => i.status === "pm_review");
  const pendingFinanceApprovals = invoices.filter((i) => i.status === "finance_review");
  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  const openPOs = purchaseOrders.filter((p) => p.status === "open" || p.status === "partial");
  const pendingTimesheetApprovals = approvals.filter((a) => a.status === "pending");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link href="/delivery" className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Financials &amp; commercials</h1>
            <p className="text-sm text-muted-foreground">
              Delivery × Finance cockpit. Budget vs actuals, EAC, EVM, P&amp;L, invoicing, vendor spend — all here.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={DollarSign} label="Total budget (BAC)" value={formatMoney(totals.bac, "INR", true)} sub={`${PROGRAMS.length} programs · ${projects.length} projects`} tint="bg-brand/10 text-brand" />
        <Kpi icon={Banknote}   label="Forecast at completion (EAC)" value={formatMoney(totals.eac, "INR", true)}
             sub={
               <span className={totals.variance >= 0 ? "text-success" : "text-destructive"}>
                 {totals.variance >= 0 ? "+" : ""}{formatMoney(totals.variance, "INR", true)} vs BAC
               </span>
             }
             tint="bg-warning/10 text-warning" />
        <Kpi icon={TrendingUp} label="Revenue booked + forecast" value={formatMoney(totals.rev + totals.forecastRev, "INR", true)}
             sub={`${formatMoney(totals.rev, "INR", true)} booked`} tint="bg-success/10 text-success" />
        <Kpi icon={Gauge}      label="Projected margin"
             value={
               <span className={totals.marginPct >= 25 ? "text-success" : totals.marginPct >= 10 ? "text-warning" : "text-destructive"}>
                 {totals.marginPct.toFixed(1)}%
               </span>
             }
             sub={formatMoney(totals.margin, "INR", true)} tint="bg-brand-purple/10 text-brand-purple" />
      </div>

      {/* Quick action / inbox tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Tile
          href="/delivery/financials/invoices"
          icon={Receipt}
          tone="brand"
          title="Ready to invoice"
          value={readyToInvoice.length.toString()}
          description={readyToInvoice.length > 0
            ? `${readyToInvoice.map((r) => formatMoney(r.amount, r.currency, true)).join(", ")} across ${new Set(readyToInvoice.map((r) => projects.find((p) => p.id === r.projectId)?.customer ?? "")).size || readyToInvoice.length} accounts.`
            : "Nothing waiting to bill."}
        />
        <Tile
          href="/delivery/financials/invoices"
          icon={CheckCircle2}
          tone="warning"
          title="Awaiting PM approval"
          value={pendingPmApprovals.length.toString()}
          description={pendingPmApprovals.length > 0 ? "Drafts blocked on PM sign-off before Finance review." : "Inbox clear."}
        />
        <Tile
          href="/delivery/financials/invoices"
          icon={CheckCircle2}
          tone="brand-purple"
          title="Awaiting Finance approval"
          value={pendingFinanceApprovals.length.toString()}
          description={pendingFinanceApprovals.length > 0 ? "PM signed. Finance gate before send." : "Inbox clear."}
        />
        <Tile
          href="/delivery/financials/invoices"
          icon={TriangleAlert}
          tone="destructive"
          title="Overdue"
          value={overdueInvoices.length.toString()}
          description={overdueInvoices.length > 0 ? "Customer hasn't paid. Collections needs eyes." : "All paid on time."}
        />
        <Tile
          href="/delivery/financials/procurement"
          icon={ShoppingCart}
          tone="warning"
          title="Open vendor POs"
          value={openPOs.length.toString()}
          description={`${formatMoney(openPOs.reduce((s, p) => s + p.amount - p.amountDrawn, 0), "INR", true)} undrawn. Watch for sprawl.`}
        />
        <Tile
          href="/delivery/financials/approvals"
          icon={FileText}
          tone="brand-teal"
          title="Timesheet approvals"
          value={pendingTimesheetApprovals.length.toString()}
          description="Across manager / project / client-bill layers."
        />
      </div>

      {/* Project P&L rollup */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground inline-flex items-center gap-2">
              <LayoutGrid className="size-4 text-muted-foreground" />
              Project P&amp;L
            </h2>
            <p className="text-[11px] text-muted-foreground">Each row clicks through to the full project P&amp;L view.</p>
          </div>
          <Link href="/delivery/financials/forecast" className="text-[11px] text-brand hover:underline inline-flex items-center gap-1">
            Forecast & scenarios
            <ArrowRight className="size-3" />
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface-overlay/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              <th className="text-left px-4 py-2 font-semibold">Project</th>
              <th className="text-right px-3 py-2 font-semibold">BAC</th>
              <th className="text-right px-3 py-2 font-semibold">Cost-to-date</th>
              <th className="text-right px-3 py-2 font-semibold">EAC</th>
              <th className="text-right px-3 py-2 font-semibold">Variance</th>
              <th className="text-right px-3 py-2 font-semibold">SPI / CPI</th>
              <th className="text-right px-3 py-2 font-semibold">Revenue</th>
              <th className="text-right px-3 py-2 font-semibold">Margin</th>
            </tr>
          </thead>
          <tbody>
            {pnls.map((p) => {
              const proj = projects.find((x) => x.id === p.projectId);
              if (!proj) return null;
              return (
                <tr key={p.projectId} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                  <td className="px-4 py-2.5">
                    <Link href={`/delivery/financials/projects/${p.projectId}`} className="group">
                      <div className="flex items-center gap-2">
                        <span className={`size-1.5 rounded-full ${RAG_DOT[proj.rag]}`} />
                        <p className="text-sm font-medium text-foreground group-hover:underline">{proj.name}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground/70">{proj.customer ?? "Internal"}</p>
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatMoney(p.bacINR, "INR", true)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatMoney(p.costToDateINR, "INR", true)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-medium text-foreground">{formatMoney(p.eacINR, "INR", true)}</td>
                  <td className={`px-3 py-2.5 text-right tabular-nums font-medium ${varianceTone(p)}`}>
                    {p.varianceINR >= 0 ? "+" : ""}{p.variancePct.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5 text-right text-[12px] tabular-nums">
                    <span className={spiTone(p.spi)}>{p.spi.toFixed(2)}</span>
                    <span className="text-muted-foreground/40 mx-0.5">/</span>
                    <span className={cpiTone(p.cpi)}>{p.cpi.toFixed(2)}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatMoney(p.revenueToDateINR, "INR", true)}</td>
                  <td className={`px-3 py-2.5 text-right tabular-nums font-medium ${p.projectedMarginPct >= 25 ? "text-success" : p.projectedMarginPct >= 10 ? "text-warning" : "text-destructive"}`}>
                    {p.projectedMarginINR === 0 && p.revenueToDateINR === 0 ? <span className="text-muted-foreground/40">Internal</span> : `${p.projectedMarginPct.toFixed(1)}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Watch list */}
      {watchList.length > 0 && (
        <section className="bg-card border border-warning/30 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-warning/10 border-b border-warning/30 flex items-center gap-2">
            <TriangleAlert className="size-4 text-warning" />
            <p className="text-sm font-semibold text-foreground">Watch list — {watchList.length} project(s) drifting</p>
          </div>
          <ul>
            {watchList.map((p) => {
              const proj = projects.find((x) => x.id === p.projectId);
              if (!proj) return null;
              return (
                <li key={p.projectId} className="border-b border-border last:border-b-0 px-4 py-2.5">
                  <Link href={`/delivery/financials/projects/${p.projectId}`} className="block">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{proj.name}</p>
                      <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${varianceTintFromPnL(p)}`}>
                        EAC variance {p.variancePct.toFixed(1)}%
                      </span>
                      {p.cpi < 0.92 && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive/10 text-destructive inline-flex items-center gap-1">
                          <TrendingDown className="size-2.5" />
                          CPI {p.cpi.toFixed(2)}
                        </span>
                      )}
                      {p.spi < 0.92 && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-warning/10 text-warning inline-flex items-center gap-1">
                          <TrendingDown className="size-2.5" />
                          SPI {p.spi.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Portfolio rollups */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-2 inline-flex items-center gap-2">
          <BarChart3 className="size-4 text-muted-foreground" />
          Portfolio rollups
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PORTFOLIOS.map((portfolio) => {
            const programIds = programsForPortfolio(portfolio.id).map((p) => p.id);
            const projectsHere = programIds.flatMap((pid) => projectsForProgram(pid));
            const portPnls = pnls.filter((p) => projectsHere.some((proj) => proj.id === p.projectId));
            const bac = portPnls.reduce((s, p) => s + p.bacINR, 0);
            const eac = portPnls.reduce((s, p) => s + p.eacINR, 0);
            const rev = portPnls.reduce((s, p) => s + p.revenueToDateINR + p.forecastRevenueINR, 0);
            const margin = rev - eac;
            return (
              <div key={portfolio.id} className="bg-card border border-border rounded-xl p-4">
                <p className="text-sm font-semibold text-foreground">{portfolio.name}</p>
                <p className="text-[11px] text-muted-foreground line-clamp-1">{portfolio.strategicTheme}</p>
                <ul className="mt-3 space-y-1 text-[12px]">
                  <li className="flex items-center justify-between"><span className="text-muted-foreground">BAC</span><span className="tabular-nums text-foreground">{formatMoney(bac, "INR", true)}</span></li>
                  <li className="flex items-center justify-between"><span className="text-muted-foreground">EAC</span><span className={`tabular-nums font-medium ${eac > bac ? "text-destructive" : "text-foreground"}`}>{formatMoney(eac, "INR", true)}</span></li>
                  <li className="flex items-center justify-between"><span className="text-muted-foreground">Revenue (rec + fcst)</span><span className="tabular-nums text-foreground">{formatMoney(rev, "INR", true)}</span></li>
                  <li className="flex items-center justify-between border-t border-border pt-1 mt-1"><span className="text-muted-foreground">Margin</span><span className={`tabular-nums font-semibold ${rev > 0 && margin / rev > 0.25 ? "text-success" : rev > 0 && margin / rev > 0.1 ? "text-warning" : margin <= 0 && rev > 0 ? "text-destructive" : "text-muted-foreground"}`}>{rev === 0 ? "Internal" : `${((margin / rev) * 100).toFixed(1)}%`}</span></li>
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Revenue lines preview */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Revenue lines</h2>
        </div>
        <ul>
          {revenueLines.slice(0, 6).map((r) => {
            const proj = projects.find((p) => p.id === r.projectId);
            return (
              <li key={r.id} className="px-4 py-2 border-b border-border last:border-b-0 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider bg-secondary text-foreground px-1.5 py-0.5 rounded">{CONTRACT_TYPE_LABEL[r.contractType]}</span>
                    <p className="text-[12px] text-foreground">{r.label}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{proj?.name} · {r.scheduledISO}</p>
                </div>
                <p className="text-[12px] tabular-nums font-medium text-foreground shrink-0">{formatMoney(r.amount, r.currency, true)}</p>
                <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${revStatusTint(r.status)}`}>{r.status.replace("_", " ")}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function varianceTone(p: ProjectPnL): string {
  if (p.variancePct < -10) return "text-destructive";
  if (p.variancePct < 0) return "text-warning";
  return "text-success";
}

function varianceTintFromPnL(p: ProjectPnL): string {
  if (p.variancePct < -10) return "bg-destructive/10 text-destructive";
  if (p.variancePct < 0) return "bg-warning/10 text-warning";
  return "bg-success/10 text-success";
}

function spiTone(spi: number): string {
  if (spi < 0.92) return "text-destructive font-medium";
  if (spi < 1.0) return "text-warning";
  return "text-success";
}

function cpiTone(cpi: number): string {
  return spiTone(cpi);
}

function revStatusTint(s: string): string {
  switch (s) {
    case "paid":              return "bg-success/10 text-success";
    case "invoiced":          return "bg-brand/10 text-brand";
    case "ready_to_invoice":  return "bg-warning/10 text-warning";
    case "forecast":          return "bg-secondary text-muted-foreground";
    case "blocked":           return "bg-destructive/10 text-destructive";
    default:                  return "bg-secondary text-muted-foreground";
  }
}

function Kpi({
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

function Tile({
  href,
  icon: Icon,
  title,
  value,
  description,
  tone,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
  tone: "brand" | "brand-purple" | "brand-teal" | "warning" | "destructive";
}) {
  const tints: Record<typeof tone, string> = {
    brand: "bg-brand/10 text-brand",
    "brand-purple": "bg-brand-purple/10 text-brand-purple",
    "brand-teal": "bg-brand-teal/10 text-brand-teal",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-xl p-4 hover:border-border/80 hover:bg-surface-overlay/30 transition-colors block"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`size-7 rounded-md flex items-center justify-center ${tints[tone]}`}><Icon className="size-3.5" /></span>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{title}</p>
      </div>
      <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{description}</p>
    </Link>
  );
}
