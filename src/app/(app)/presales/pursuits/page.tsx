"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Filter as FilterIcon,
  Plus,
  Search,
  Target,
  Trophy,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { usePursuitsStore } from "@/lib/pursuits-store";
import {
  PURSUIT_TYPE_LABEL,
  PURSUIT_TYPE_TINT,
  STAGES,
  daysUntil,
  formatINR,
  stageByKey,
  stageProgress,
  type PursuitRecord,
  type PursuitType,
  type StageKey,
} from "@/components/presales/pursuits/data";

type OutcomeFilter = "all" | "in_flight" | "won" | "lost" | "withdrawn";

export default function PursuitsListPage() {
  const { setScreen } = useScreen();
  const { pursuits, stats } = usePursuitsStore();
  const [query, setQuery] = useState("");
  const [outcome, setOutcome] = useState<OutcomeFilter>("in_flight");
  const [stage, setStage] = useState<StageKey | "all">("all");
  const [type, setType] = useState<PursuitType | "all">("all");

  useEffect(() => {
    setScreen({ module: "Pre-Sales", page: "Pursuits" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pursuits
      .filter((p) => {
        if (outcome === "in_flight") {
          if (p.outcome !== "no_decision_yet") return false;
        } else if (outcome !== "all" && p.outcome !== outcome) return false;
        if (stage !== "all" && p.currentStage !== stage) return false;
        if (type !== "all" && p.type !== type) return false;
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.customer.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        // In-flight: by submit deadline asc; closed: by audit recency desc
        if (a.outcome === "no_decision_yet" && b.outcome === "no_decision_yet") {
          const ad = a.submitDeadlineISO ?? "9999-12-31";
          const bd = b.submitDeadlineISO ?? "9999-12-31";
          return ad.localeCompare(bd);
        }
        if (a.outcome === "no_decision_yet") return -1;
        if (b.outcome === "no_decision_yet") return 1;
        return 0;
      });
  }, [pursuits, query, outcome, stage, type]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/presales"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
              <Target className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Pursuits</h1>
              <p className="text-sm text-muted-foreground">
                Canonical lifecycle — 11 stages from RFP intake to knowledge reuse.
              </p>
            </div>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand-purple text-white text-sm font-medium hover:bg-brand-purple/90 transition-colors"
          title="New pursuit (capture form is the next slice)"
        >
          <Plus className="size-3.5" />
          New pursuit
        </button>
      </motion.div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Kpi label="Total" value={stats.total.toString()} hint="all pursuits" />
        <Kpi label="In flight" value={stats.inFlight.toString()} hint="not yet decided" tone="brand-purple" />
        <Kpi label="Won" value={stats.won.toString()} tone="success" />
        <Kpi label="Lost" value={stats.lost.toString()} tone="destructive" />
        <Kpi label="TCV in flight" value={formatINR(stats.tcvInFlight)} hint="Pipeline value" />
        <Kpi label="CoP YTD" value={formatINR(stats.copYTD)} hint="Cost of pursuit incurred" />
      </div>

      {/* Stage facets */}
      <div className="bg-card border border-border rounded-xl p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mr-1">In flight by stage</p>
          <button
            onClick={() => setStage("all")}
            className={`h-7 px-2 rounded text-[11px] transition-colors ${
              stage === "all" ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/30" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {STAGES.map((s) => {
            const count = stats.byStage.get(s.key) ?? 0;
            if (count === 0) return null;
            return (
              <button
                key={s.key}
                onClick={() => setStage(s.key)}
                className={`h-7 px-2 rounded text-[11px] transition-colors inline-flex items-center gap-1.5 ${
                  stage === s.key
                    ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/30"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.number}. {s.label}
                <span className="text-[10px] tabular-nums text-foreground/60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pursuit, customer, id, tags…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <FilterIcon className="size-3.5 text-muted-foreground" />
        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value as OutcomeFilter)}
          className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
        >
          <option value="in_flight">In flight</option>
          <option value="all">All</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as PursuitType | "all")}
          className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
        >
          <option value="all">All types</option>
          {(Object.keys(PURSUIT_TYPE_LABEL) as PursuitType[]).map((t) => (
            <option key={t} value={t}>
              {PURSUIT_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <ul className="bg-card border border-border rounded-xl overflow-hidden">
        {filtered.map((p) => (
          <PursuitRow key={p.id} pursuit={p} />
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-12 text-center text-sm text-muted-foreground italic">
            No pursuits match these filters.
          </li>
        )}
      </ul>
    </div>
  );
}

function PursuitRow({ pursuit }: { pursuit: PursuitRecord }) {
  const stage = stageByKey(pursuit.currentStage);
  const progress = stageProgress(pursuit);
  const days = pursuit.submitDeadlineISO ? daysUntil(pursuit.submitDeadlineISO) : null;
  const dayClass =
    days === null
      ? "text-muted-foreground/60"
      : days < 0
        ? "text-destructive"
        : days <= 7
          ? "text-warning"
          : "text-muted-foreground";
  return (
    <li className="border-b border-border last:border-b-0">
      <Link
        href={`/presales/pursuits/${pursuit.id}`}
        className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-3 hover:bg-surface-overlay/40 transition-colors items-center"
      >
        <div className="md:col-span-5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-foreground truncate">{pursuit.name}</p>
            <code className="text-[10px] font-mono text-muted-foreground/60">{pursuit.id}</code>
            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${PURSUIT_TYPE_TINT[pursuit.type]}`}>
              {PURSUIT_TYPE_LABEL[pursuit.type]}
            </span>
            {(pursuit.type === "must_win" || pursuit.isMustWin) && (
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium inline-flex items-center gap-1">
                <Trophy className="size-2.5" />
                Must-win
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70 mt-0.5 flex-wrap">
            <span>{pursuit.customer}</span>
            <span>·</span>
            <span>{pursuit.industry}</span>
            <span>·</span>
            <span>{pursuit.customerCountry}</span>
          </div>
        </div>
        <div className="md:col-span-3 min-w-0">
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-foreground font-medium">{stage.number}.</span>
            <span className="text-foreground truncate">{stage.label}</span>
          </div>
          <div className="h-1 bg-secondary rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-brand-purple" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="md:col-span-2 text-[12px] tabular-nums">
          <p className="text-foreground font-mono">{formatINR(pursuit.tcvInr)}</p>
          <p className="text-[10px] text-muted-foreground">Win-prob {Math.round(pursuit.winProb * 100)}%</p>
        </div>
        <div className="md:col-span-2 text-right text-[11px] flex md:justify-end items-center gap-1">
          {pursuit.outcome === "won" && <span className="text-success font-medium">Won</span>}
          {pursuit.outcome === "lost" && <span className="text-destructive font-medium">Lost</span>}
          {pursuit.outcome === "withdrawn" && <span className="text-muted-foreground font-medium">Withdrawn</span>}
          {pursuit.outcome === "no_decision_yet" && days !== null && (
            <span className={dayClass}>
              {pursuit.submitDeadlineISO} <span className="text-muted-foreground/50">({days >= 0 ? `${days}d` : `${Math.abs(days)}d ago`})</span>
            </span>
          )}
          <ChevronRight className="size-3.5 text-muted-foreground/40 ml-1 hidden md:inline" />
        </div>
      </Link>
    </li>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone = "muted",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "muted" | "success" | "warning" | "destructive" | "brand-purple";
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : tone === "destructive"
          ? "text-destructive"
          : tone === "brand-purple"
            ? "text-brand-purple"
            : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
      <p className={`text-lg font-bold tabular-nums mt-0.5 ${toneClass}`}>{value}</p>
      {hint && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{hint}</p>}
    </div>
  );
}
