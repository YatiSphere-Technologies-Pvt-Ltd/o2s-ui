"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Check,
  Clock,
  Gauge,
  History,
  ListChecks,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  TrendingUp,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAgentTower } from "@/lib/agent-tower-store";
import { PRESALES_AGENT_REGISTRY } from "@/components/presales/agents";
import { AgentIcon } from "@/components/agents/agent-icon";
import { AgentSparkline } from "@/components/agents/sparkline";
import { DecisionRow } from "@/components/agents/decision-row";
import {
  AUTONOMY_DESCRIPTION,
  AUTONOMY_LABEL,
  TONE_TINT,
  TRIGGER_LABEL,
  type AgentAutonomy,
} from "@/components/agents/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

type Tab = "configure" | "performance" | "decisions" | "audit";

const TAB_META: Record<Tab, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  configure:   { label: "Configure",   icon: Sliders },
  performance: { label: "Performance", icon: Gauge },
  decisions:   { label: "Decisions",   icon: ListChecks },
  audit:       { label: "Audit",       icon: History },
};

export default function PresalesAgentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { setScreen } = useScreen();
  const tower = useAgentTower(PRESALES_AGENT_REGISTRY);
  const [tab, setTab] = useState<Tab>("configure");
  const [flash, setFlash] = useState<string | null>(null);

  const entry = tower.findAgent(id);
  const specName = entry?.spec.name;

  useEffect(() => {
    if (!specName) return;
    setScreen({ module: "Pre-Sales", page: "Agent detail", recordId: id, recordLabel: specName });
    return () => setScreen(null);
  }, [id, specName, setScreen]);

  const decisions = useMemo(
    () => tower.decisions.filter((d) => d.agentId === id),
    [tower.decisions, id],
  );

  const audit = useMemo(
    () => tower.audit.filter((a) => a.agentId === id || a.agentId === "_module"),
    [tower.audit, id],
  );

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Agent not found</h1>
        <Link href="/presales/agents" className="text-brand underline mt-3 inline-block">
          Back to tower
        </Link>
      </div>
    );
  }

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  const tint = TONE_TINT[entry.spec.tone];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/presales/agents"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-start gap-3">
            <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
              <AgentIcon name={entry.spec.iconName} className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">{entry.spec.name}</h1>
                {!entry.status && (
                  <span className="text-[10px] uppercase tracking-wider bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">
                    Paused
                  </span>
                )}
                {entry.isCustomised && (
                  <span className="text-[10px] uppercase tracking-wider bg-brand/10 text-brand px-1.5 py-0.5 rounded">
                    Customised
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl mt-0.5">{entry.spec.purpose}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {TRIGGER_LABEL[entry.spec.trigger]}
                  {entry.spec.triggerDetail && ` · ${entry.spec.triggerDetail}`}
                </span>
                <span>·</span>
                <span>Autonomy: {AUTONOMY_LABEL[entry.autonomy as AgentAutonomy]}</span>
                <span>·</span>
                <span>Scope: {entry.scope.cohorts.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              tower.setAgentConfig(id, { status: !entry.status });
              flashOnce(entry.status ? "Agent paused." : "Agent resumed.");
            }}
            className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-colors ${
              entry.status
                ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "border-success/40 bg-success/10 text-success hover:bg-success/20"
            }`}
          >
            {entry.status ? (
              <>
                <Pause className="size-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="size-3.5" />
                Resume
              </>
            )}
          </button>
          {entry.isCustomised && (
            <button
              onClick={() => {
                tower.resetAgent(id);
                flashOnce("Reset to defaults.");
              }}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-lg bg-success/10 border border-success/20 px-3 py-2 text-[12px] text-success flex items-center gap-2"
          >
            <Check className="size-3.5" />
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description card */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">What it does</p>
        <p className="text-sm text-foreground leading-relaxed">{entry.spec.description}</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiTile icon={Gauge}      label="Accuracy 30d"   value={`${Math.round(entry.spec.accuracy30d * 100)}%`}  trend="up" />
        <KpiTile icon={TrendingUp} label="Override rate"   value={`${Math.round(entry.spec.overrideRate30d * 100)}%`} trend={entry.spec.overrideRate30d > 0.15 ? "down" : "neutral"} />
        <KpiTile icon={ListChecks} label="Decisions (all)" value={decisions.length.toString()} trend="neutral" />
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">7-day activity</p>
          <div className="text-brand">
            <AgentSparkline data={entry.spec.activity7d} height={28} width={140} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {(Object.keys(TAB_META) as Tab[]).map((t) => {
          const meta = TAB_META[t];
          const Icon = meta.icon;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "configure" && (
        <ConfigureTab
          agentId={id}
          status={entry.status}
          autonomy={entry.autonomy as AgentAutonomy}
          scopeCohorts={entry.scope.cohorts}
          onAutonomy={(val) => {
            tower.setAgentConfig(id, { autonomy: val });
            flashOnce(`Autonomy set to ${AUTONOMY_LABEL[val]}.`);
          }}
          onScope={(cohorts) => {
            tower.setAgentConfig(id, { scope: { cohorts } });
            flashOnce("Scope updated.");
          }}
        />
      )}

      {tab === "performance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {entry.spec.kpis.map((k, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">{k.label}</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">{k.value}</p>
              {k.hint && <p className="text-[11px] text-muted-foreground mt-1">{k.hint}</p>}
            </div>
          ))}
          {entry.spec.kpis.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground italic text-center py-12">No KPIs configured.</p>
          )}
        </div>
      )}

      {tab === "decisions" && (
        <div>
          <ul className="bg-card border border-border rounded-xl overflow-hidden">
            {decisions.map((d) => (
              <DecisionRow
                key={d.id}
                decision={d}
                spec={entry.spec}
                traceHref={`/presales/agents/${id}/decisions/${d.id}`}
                onApprove={d.outcome === "pending_review" ? () => tower.approveDecision(d.id) : undefined}
                onReject={d.outcome === "pending_review" ? () => tower.rejectDecision(d.id) : undefined}
              />
            ))}
            {decisions.length === 0 && (
              <li className="px-4 py-12 text-center text-sm text-muted-foreground italic">No decisions logged yet.</li>
            )}
          </ul>
        </div>
      )}

      {tab === "audit" && (
        <ul className="bg-card border border-border rounded-xl overflow-hidden">
          {audit.map((a) => (
            <li key={a.id} className="px-4 py-2.5 border-b border-border last:border-b-0">
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="font-medium text-foreground">{a.action.replace(/_/g, " ")}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{a.whenLabel}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-foreground">{a.actor}</span>
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                <code className="font-mono text-destructive line-through">{a.before}</code>
                {" → "}
                <code className="font-mono text-success">{a.after}</code>
              </p>
              {a.note && <p className="text-[11px] text-foreground mt-1">{a.note}</p>}
            </li>
          ))}
          {audit.length === 0 && (
            <li className="px-4 py-12 text-center text-sm text-muted-foreground italic">No audit entries yet.</li>
          )}
        </ul>
      )}

      {/* Recent actions strip */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Recent actions</p>
        <ul className="bg-card border border-border rounded-xl overflow-hidden">
          {entry.spec.recentActions.map((r) => (
            <li key={r.id} className="px-3 py-2 border-b border-border last:border-b-0 flex items-start gap-3">
              <Bot className="size-3.5 text-muted-foreground/70 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-[12px] text-foreground leading-snug">{r.text}</p>
                <p className="text-[10px] text-muted-foreground/70">{r.when}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function KpiTile({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
}) {
  const tone = trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1 inline-flex items-center gap-1.5">
        <Icon className="size-3" />
        {label}
      </p>
      <p className={`text-xl font-bold tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}

function ConfigureTab({
  status,
  autonomy,
  scopeCohorts,
  onAutonomy,
  onScope,
}: {
  agentId: string;
  status: boolean;
  autonomy: AgentAutonomy;
  scopeCohorts: string[];
  onAutonomy: (val: AgentAutonomy) => void;
  onScope: (cohorts: string[]) => void;
}) {
  const [cohortsDraft, setCohortsDraft] = useState(scopeCohorts.join(", "));

  return (
    <div className="space-y-4">
      <section className="bg-card border border-border rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-3">Autonomy</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(Object.keys(AUTONOMY_LABEL) as AgentAutonomy[]).map((a) => (
            <button
              key={a}
              onClick={() => onAutonomy(a)}
              className={`text-left p-3 rounded-lg border transition-colors ${
                autonomy === a ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
              }`}
            >
              <p className="text-sm font-medium text-foreground">{AUTONOMY_LABEL[a]}</p>
              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{AUTONOMY_DESCRIPTION[a]}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-3">Scope (cohorts)</p>
        <input
          value={cohortsDraft}
          onChange={(e) => setCohortsDraft(e.target.value)}
          onBlur={() => onScope(cohortsDraft.split(",").map((s) => s.trim()).filter(Boolean))}
          placeholder="Comma-separated cohort labels"
          className="w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Currently scoped to: {scopeCohorts.length === 0 ? "none" : scopeCohorts.join(", ")}.
        </p>
      </section>

      <section className="bg-card border border-border rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Status</p>
        <p className="text-sm text-foreground">
          Currently <strong>{status ? "running" : "paused"}</strong>. Use the Pause/Resume button in the header to toggle.
        </p>
      </section>
    </div>
  );
}
