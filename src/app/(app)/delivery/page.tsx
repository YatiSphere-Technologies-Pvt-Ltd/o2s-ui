"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Building2,
  ChevronRight,
  DollarSign,
  Kanban,
  LayoutGrid,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import { useAgentTower } from "@/lib/agent-tower-store";
import { DELIVERY_AGENT_REGISTRY } from "@/components/delivery/agents";
import {
  PEOPLE_MAP,
  PORTFOLIOS,
  programsForPortfolio,
  projectsForProgram,
  RAG_DOT,
  RAG_TINT,
  rollupPortfolioRag,
  rollupProgramRag,
  totalsForPortfolio,
  type Portfolio,
} from "@/components/delivery/data";

export default function DeliveryHomePage() {
  const { setScreen } = useScreen();
  const { projects } = useDeliveryStore();
  const { stats: agentStats } = useAgentTower(DELIVERY_AGENT_REGISTRY);

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Portfolio overview" });
    return () => setScreen(null);
  }, [setScreen]);

  const totals = useMemo(() => {
    const budget = projects.reduce((s, p) => s + p.totalBudgetINR, 0);
    const spent = projects.reduce((s, p) => s + p.spentINR, 0);
    return { budget, spent };
  }, [projects]);

  const red = projects.filter((p) => p.rag === "red").length;
  const amber = projects.filter((p) => p.rag === "amber").length;
  const green = projects.filter((p) => p.rag === "green").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <Kanban className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Delivery &amp; PMO</h1>
            <p className="text-sm text-muted-foreground">
              Portfolios roll up programs by strategic theme. Programs roll up projects. Today: {projects.length}{" "}
              active projects.
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Building2} label="Portfolios" value={PORTFOLIOS.length.toString()} tint="bg-brand-purple/10 text-brand-purple" />
        <Stat icon={LayoutGrid} label="Active projects" value={projects.length.toString()} tint="bg-brand/10 text-brand"
              sub={`${green} green · ${amber} amber · ${red} red`} />
        <Stat icon={DollarSign} label="Total budget" value={inrShort(totals.budget)} tint="bg-success/10 text-success"
              sub={`${Math.round((totals.spent / totals.budget) * 100)}% spent`} />
        <Link
          href="/delivery/agents"
          className="bg-card border border-border rounded-xl p-3 hover:border-border/80 transition-colors block"
        >
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1 inline-flex items-center gap-1.5">
            <Bot className="size-3" />
            Agent Tower
          </p>
          <p className="text-xl font-bold text-foreground tabular-nums">
            {agentStats.live}/{agentStats.total} <span className="text-[11px] font-normal text-muted-foreground">live</span>
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            {agentStats.last24h} decisions · {Math.round(agentStats.accuracy * 100)}% accuracy
          </p>
        </Link>
      </div>

      {/* Portfolios */}
      {PORTFOLIOS.map((p) => (
        <PortfolioBlock key={p.id} portfolio={p} />
      ))}
    </div>
  );
}

function PortfolioBlock({ portfolio }: { portfolio: Portfolio }) {
  const programs = programsForPortfolio(portfolio.id);
  const rag = rollupPortfolioRag(portfolio.id);
  const totals = totalsForPortfolio(portfolio.id);
  const owner = PEOPLE_MAP[portfolio.ownerId];

  return (
    <section className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 min-w-0">
          <span className={`size-2 rounded-full ${RAG_DOT[rag]} mt-2`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-foreground">{portfolio.name}</h2>
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${RAG_TINT[rag]}`}>{rag}</span>
            </div>
            <p className="text-[12px] text-muted-foreground">{portfolio.strategicTheme}</p>
            <p className="text-[11px] text-muted-foreground/70 mt-0.5">{portfolio.description}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Owner</p>
          <p className="text-[12px] text-foreground">{owner?.name}</p>
          <p className="text-[11px] text-muted-foreground tabular-nums mt-1.5">
            ₹{inrShort(totals.spent)} / {inrShort(totals.budget)} · {totals.projectCount} projects
          </p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {programs.map((program) => {
          const projects = projectsForProgram(program.id);
          const programRag = rollupProgramRag(program.id);
          return (
            <div key={program.id} className="px-4 py-3">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`size-1.5 rounded-full ${RAG_DOT[programRag]}`} />
                <p className="text-sm font-semibold text-foreground">{program.name}</p>
                <span className="text-[10px] text-muted-foreground/70">·</span>
                <span className="text-[10px] text-muted-foreground">{program.description}</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {projects.map((proj) => (
                  <li key={proj.id}>
                    <Link
                      href={`/delivery/projects/${proj.id}`}
                      className="block p-3 rounded-lg border border-border hover:border-border/80 hover:bg-surface-overlay/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`size-1.5 rounded-full ${RAG_DOT[proj.rag]}`} />
                        <p className="text-sm font-medium text-foreground truncate">{proj.name}</p>
                        <ChevronRight className="ml-auto size-3 text-muted-foreground/40" />
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground tabular-nums">
                        <span>Health {proj.health}</span>
                        <span>·</span>
                        <span>
                          ₹{inrShort(proj.spentINR)} / {inrShort(proj.totalBudgetINR)}
                        </span>
                        <span className="ml-auto inline-flex items-center gap-1">
                          {proj.healthTrend[proj.healthTrend.length - 1] >= proj.healthTrend[0] ? (
                            <TrendingUp className="size-3 text-success" />
                          ) : (
                            <TrendingDown className="size-3 text-destructive" />
                          )}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  tint: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1 inline-flex items-center gap-1.5">
        <span className={`size-5 rounded-md flex items-center justify-center ${tint}`}>
          <Icon className="size-3" />
        </span>
        {label}
      </p>
      <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>}
    </div>
  );
}

function inrShort(n: number): string {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
