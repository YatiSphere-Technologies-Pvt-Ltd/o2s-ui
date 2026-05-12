"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Gauge,
  Handshake,
  Layers,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useFinanceStore } from "@/lib/finance-store";
import {
  allProjectPnL,
  CONTRACT_TYPE_LABEL,
  PIPELINE,
  PROJECTS,
  SCENARIO_COST_MULT,
  SCENARIO_LABEL,
  SCENARIO_REV_MULT,
  formatMoney,
  toINR,
  type ForecastScenario,
} from "@/components/delivery/financial/data";

export default function ForecastPage() {
  const { setScreen } = useScreen();
  const { scenario, setScenario } = useFinanceStore();

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Forecast" });
    return () => setScreen(null);
  }, [setScreen]);

  const baseData = useMemo(() => {
    const pnls = allProjectPnL();
    return pnls.map((p) => {
      const proj = PROJECTS.find((x) => x.id === p.projectId)!;
      const totalRev = p.revenueToDateINR + p.forecastRevenueINR;
      return { ...p, project: proj, totalRev };
    });
  }, []);

  const scenarioData = useMemo(() => {
    const costMult = SCENARIO_COST_MULT[scenario];
    const revMult = SCENARIO_REV_MULT[scenario];
    return baseData.map((d) => ({
      ...d,
      sEac: d.eacINR * costMult,
      sRev: d.totalRev * revMult,
    }));
  }, [baseData, scenario]);

  const totals = useMemo(() => {
    const eac = scenarioData.reduce((s, d) => s + d.sEac, 0);
    const rev = scenarioData.reduce((s, d) => s + d.sRev, 0);
    return { eac, rev, margin: rev - eac, marginPct: rev === 0 ? 0 : ((rev - eac) / rev) * 100 };
  }, [scenarioData]);

  const baseTotals = useMemo(() => {
    const eac = baseData.reduce((s, d) => s + d.eacINR, 0);
    const rev = baseData.reduce((s, d) => s + d.totalRev, 0);
    return { eac, rev, margin: rev - eac, marginPct: rev === 0 ? 0 : ((rev - eac) / rev) * 100 };
  }, [baseData]);

  // Pipeline → forecast revenue feed
  const pipeRev = useMemo(() => {
    return PIPELINE.reduce((s, p) => s + p.forecastedRevenueINR * (p.probabilityPct / 100), 0);
  }, []);

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Forecast &amp; scenarios</h1>
            <p className="text-sm text-muted-foreground">Revenue + cost forecast under base / optimistic / downside. Pipeline-to-project handoff carries forecasted revenue forward.</p>
          </div>
        </div>
      </motion.div>

      {/* Scenario picker */}
      <section className="bg-card border border-border rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Scenario</p>
        <div className="grid grid-cols-3 gap-2">
          {(["base", "optimistic", "downside"] as ForecastScenario[]).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`text-left p-3 rounded-lg border transition-colors ${
                scenario === s ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
              }`}
            >
              <p className="text-sm font-medium text-foreground">{SCENARIO_LABEL[s]}</p>
              <p className="text-[11px] text-muted-foreground">
                Costs × {SCENARIO_COST_MULT[s]} · Revenue × {SCENARIO_REV_MULT[s]}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Headline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ForecastTile icon={Layers} label="Cost (EAC)" value={formatMoney(totals.eac, "INR", true)} delta={totals.eac - baseTotals.eac} negativeIsGood tint="bg-warning/10 text-warning" />
        <ForecastTile icon={TrendingUp} label="Revenue" value={formatMoney(totals.rev, "INR", true)} delta={totals.rev - baseTotals.rev} tint="bg-success/10 text-success" />
        <ForecastTile icon={Gauge} label="Margin"
          value={
            <span className={totals.marginPct >= 25 ? "text-success" : totals.marginPct >= 10 ? "text-warning" : "text-destructive"}>
              {totals.marginPct.toFixed(1)}%
            </span>
          }
          delta={totals.margin - baseTotals.margin}
          tint="bg-brand-purple/10 text-brand-purple"
        />
        <ForecastTile icon={Handshake} label="Pipeline-weighted forecast" value={formatMoney(pipeRev, "INR", true)} sub="From sales pipeline (× probability)" tint="bg-brand/10 text-brand" />
      </div>

      {/* Per-project under scenario */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <p className="text-sm font-semibold text-foreground">By project — {SCENARIO_LABEL[scenario]} scenario</p>
          <p className="text-[11px] text-muted-foreground">Each project re-priced with current scenario multipliers.</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface-overlay/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              <th className="text-left px-4 py-2 font-semibold">Project</th>
              <th className="text-right px-3 py-2 font-semibold">EAC (base)</th>
              <th className="text-right px-3 py-2 font-semibold">EAC (scenario)</th>
              <th className="text-right px-3 py-2 font-semibold">Rev (base)</th>
              <th className="text-right px-3 py-2 font-semibold">Rev (scenario)</th>
              <th className="text-right px-4 py-2 font-semibold">Δ Margin</th>
            </tr>
          </thead>
          <tbody>
            {scenarioData.map((d) => {
              const baseMargin = d.totalRev - d.eacINR;
              const sMargin = d.sRev - d.sEac;
              const delta = sMargin - baseMargin;
              return (
                <tr key={d.projectId} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                  <td className="px-4 py-2">
                    <Link href={`/delivery/financials/projects/${d.projectId}`} className="text-sm text-foreground hover:underline">{d.project.name}</Link>
                    <p className="text-[10px] text-muted-foreground/70">{d.project.customer ?? "Internal"}</p>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatMoney(d.eacINR, "INR", true)}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium text-foreground">{formatMoney(d.sEac, "INR", true)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{d.totalRev === 0 ? "—" : formatMoney(d.totalRev, "INR", true)}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium text-foreground">{d.sRev === 0 ? "—" : formatMoney(d.sRev, "INR", true)}</td>
                  <td className={`px-4 py-2 text-right tabular-nums font-medium ${delta >= 0 ? "text-success" : "text-destructive"}`}>
                    {d.totalRev === 0 ? <span className="text-muted-foreground/40">Internal</span> : `${delta >= 0 ? "+" : ""}${formatMoney(delta, "INR", true)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Pipeline handoff */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground inline-flex items-center gap-2"><Handshake className="size-4 text-brand" />Pipeline → Project handoff</p>
            <p className="text-[11px] text-muted-foreground">Closed-won opportunities spawn projects with forecasted revenue carried forward. Stage + probability tracked here so finance sees revenue forming.</p>
          </div>
          <span className="text-[11px] text-muted-foreground tabular-nums">{PIPELINE.length} opportunities</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface-overlay/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              <th className="text-left px-4 py-2 font-semibold">Opportunity</th>
              <th className="text-left px-3 py-2 font-semibold">Customer</th>
              <th className="text-left px-3 py-2 font-semibold">Contract</th>
              <th className="text-right px-3 py-2 font-semibold">Forecast</th>
              <th className="text-center px-3 py-2 font-semibold">Stage</th>
              <th className="text-right px-3 py-2 font-semibold">Prob</th>
              <th className="text-right px-3 py-2 font-semibold">Weighted</th>
              <th className="text-right px-4 py-2 font-semibold">Close</th>
            </tr>
          </thead>
          <tbody>
            {PIPELINE.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-2 text-[12px] text-foreground">{p.name}</td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">{p.customer}</td>
                <td className="px-3 py-2">
                  <span className="text-[10px] uppercase tracking-wider bg-secondary text-foreground px-1.5 py-0.5 rounded">{CONTRACT_TYPE_LABEL[p.contractType]}</span>
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-foreground">{formatMoney(p.forecastedRevenueINR, "INR", true)}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${stageTint(p.stage)}`}>{p.stage.replace("_", " ")}</span>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="h-1.5 w-12 bg-secondary rounded overflow-hidden">
                      <div className={`h-full ${p.probabilityPct >= 70 ? "bg-success" : p.probabilityPct >= 50 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${p.probabilityPct}%` }} />
                    </div>
                    <span className="text-[11px] tabular-nums text-foreground">{p.probabilityPct}%</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-medium text-foreground">{formatMoney(p.forecastedRevenueINR * p.probabilityPct / 100, "INR", true)}</td>
                <td className="px-4 py-2 text-right text-[11px] text-muted-foreground tabular-nums">{p.closeISO}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-surface-overlay/30">
            <tr className="text-[11px] font-semibold">
              <td colSpan={6} className="px-4 py-2 text-muted-foreground text-right">Pipeline-weighted total</td>
              <td className="px-3 py-2 text-right tabular-nums text-foreground">{formatMoney(pipeRev, "INR", true)}</td>
              <td className="px-4 py-2"></td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Auto-spawn callout */}
      <section className="bg-card border border-dashed border-border rounded-xl p-4 flex items-start gap-3">
        <Target className="size-4 text-brand-purple shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-foreground font-medium">Auto-spawn projects on close-won</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            When a pipeline opportunity hits <strong>closed_won</strong> in the CRM, Delivery auto-spawns a project from the matching template. The forecasted revenue and contract terms (T&amp;M / fixed / milestone) flow forward into the project P&amp;L. Configure this in{" "}
            <Link href="/delivery/templates" className="text-brand underline">Templates</Link>{" "}
            <ArrowRight className="size-3 inline" />.
          </p>
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground/60 flex items-start gap-2 pt-1">
        <Sparkles className="size-3 mt-0.5" />
        <span>Forecast multipliers are a coarse what-if. For per-line scenario edits, use the project P&amp;L page.</span>
      </p>
    </div>
  );
}

function stageTint(stage: string): string {
  switch (stage) {
    case "closed_won":  return "bg-success/10 text-success";
    case "commit":      return "bg-brand/10 text-brand";
    case "proposal":    return "bg-warning/10 text-warning";
    case "discovery":   return "bg-secondary text-muted-foreground";
    case "closed_lost": return "bg-destructive/10 text-destructive";
    default:            return "bg-secondary text-muted-foreground";
  }
}

function ForecastTile({
  icon: Icon,
  label,
  value,
  sub,
  delta,
  negativeIsGood,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  sub?: string;
  delta?: number;
  negativeIsGood?: boolean;
  tint: string;
}) {
  const showDelta = typeof delta === "number" && Math.abs(delta) > 0.5;
  const good = showDelta ? (negativeIsGood ? delta! < 0 : delta! > 0) : false;
  // toINR is imported only to use it indirectly elsewhere
  void toINR;
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1 inline-flex items-center gap-1.5">
        <span className={`size-5 rounded-md flex items-center justify-center ${tint}`}><Icon className="size-3" /></span>
        {label}
      </p>
      <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
      {showDelta ? (
        <p className={`text-[10px] mt-0.5 inline-flex items-center gap-1 ${good ? "text-success" : "text-destructive"}`}>
          {good ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
          {delta! >= 0 ? "+" : ""}{formatMoney(delta!, "INR", true)} vs base
        </p>
      ) : sub ? (
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>
      ) : null}
    </div>
  );
}
