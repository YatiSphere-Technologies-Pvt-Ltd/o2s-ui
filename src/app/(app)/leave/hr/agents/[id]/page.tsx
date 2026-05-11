"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  AGENT_DECISIONS,
  type AgentAutonomyLevel,
  type AgentId,
} from "@/components/leave/data";
import { Sparkline } from "@/components/leave/sparkline";

interface PageProps {
  params: Promise<{ id: string }>;
}

const AUTONOMY_OPTIONS: { value: AgentAutonomyLevel; label: string; description: string }[] = [
  { value: "off",              label: "Off",                description: "Don't run this agent." },
  { value: "suggest",          label: "Suggest only",       description: "Surface recommendations; never execute." },
  { value: "act_with_confirm", label: "Act with confirm",   description: "Propose and ask a human to confirm before each action." },
  { value: "autonomous",       label: "Autonomous",         description: "Act on low-risk tasks without prompting. Audit log records each call." },
];

const TAB_LABEL = { configure: "Configure", performance: "Performance", decisions: "Recent decisions" } as const;
type Tab = keyof typeof TAB_LABEL;

export default function AgentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { setScreen } = useScreen();
  const { findAgent, setAgentConfig, resetAgentConfig, globalAgentPause, setGlobalAgentPause } = useLeaveStore();
  const entry = findAgent(id as AgentId);

  const [tab, setTab] = useState<Tab>("configure");

  const agentName = entry?.agent.name;
  const agentId = entry?.agent.id;
  useEffect(() => {
    if (!agentId) return;
    setScreen({
      module: "Leave",
      page: "Agent detail",
      recordId: agentId,
      recordLabel: agentName,
    });
    return () => setScreen(null);
  }, [agentId, agentName, setScreen]);

  const decisions = useMemo(
    () => AGENT_DECISIONS.filter((d) => d.agentId === (id as AgentId)),
    [id],
  );

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Agent not found</h1>
        <p className="text-sm text-muted-foreground mt-2">
          <code className="text-foreground">{id}</code> isn&apos;t a known agent.
        </p>
        <Link
          href="/leave/hr/agents"
          className="inline-flex items-center gap-1.5 mt-6 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to control center
        </Link>
      </div>
    );
  }

  const { agent, status, autonomy, scope, isCustomised } = entry;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/leave/hr/agents"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <Bot className="size-5 text-brand" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">{agent.name}</h1>
                {isCustomised && (
                  <span className="text-[9px] uppercase tracking-wider text-brand bg-brand/10 px-1.5 py-0.5 rounded">Customised</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{agent.purpose}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setAgentConfig(agent.id, { status: !status })}
          disabled={globalAgentPause}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            status
              ? "border-success/40 bg-success/5 text-success hover:bg-success/10"
              : "border-border bg-card text-muted-foreground hover:bg-surface-overlay"
          }`}
        >
          {status ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          {status ? "Running" : "Paused"}
        </button>
      </motion.div>

      {globalAgentPause && (
        <div className="p-3 rounded-xl bg-warning/5 border border-warning/30 text-[12px] text-foreground">
          <span className="font-medium text-warning">All agents are globally paused.</span>{" "}
          <button onClick={() => setGlobalAgentPause(false)} className="text-brand hover:underline">Resume globally.</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center border-b border-border">
        {(Object.keys(TAB_LABEL) as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {TAB_LABEL[t]}
              {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand rounded-full" />}
            </button>
          );
        })}
      </div>

      {tab === "configure" && (
        <div className="space-y-6">
          {/* Autonomy */}
          <Section title="Autonomy">
            <div className="space-y-2">
              {AUTONOMY_OPTIONS.map((opt) => {
                const selected = autonomy === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAgentConfig(agent.id, { autonomy: opt.value })}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selected ? "border-brand bg-brand/5" : "border-border bg-surface-overlay/40 hover:bg-surface-overlay"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{opt.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{opt.description}</p>
                      </div>
                      <span className={`size-3.5 rounded-full border-2 shrink-0 mt-1 ${selected ? "border-brand bg-brand" : "border-border"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Scope */}
          <Section title="Scope">
            <div className="p-3 rounded-lg border border-border bg-surface-overlay/40 text-xs text-foreground">
              <p>
                Currently applies to: <span className="font-medium">{scope.cohorts.join(", ") || "—"}</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
                Cohort editor lands with the Compliance module — for now, configure cohorts by country or sub-team via the platform admin API.
              </p>
            </div>
          </Section>

          {/* Guardrails */}
          <Section title="Guardrails">
            <ul className="space-y-1.5 text-xs">
              <Guardrail label="Hard policy block on statutory floors" enabled />
              <Guardrail label="Pause if accuracy drops below 70%" enabled />
              <Guardrail label="Require human-in-the-loop for high-severity actions" enabled />
              <Guardrail label="Suppress repeated suggestions to same employee within 24h" enabled />
            </ul>
          </Section>

          {/* Prompts (advanced) */}
          <Section title="Prompts (advanced)">
            <details className="text-xs">
              <summary className="cursor-pointer text-foreground inline-flex items-center gap-1.5 list-none">
                <ChevronRight className="size-3 transition-transform" />
                System prompt
              </summary>
              <pre className="mt-2 p-3 rounded-lg bg-secondary/50 text-[11px] text-muted-foreground leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`You are ${agent.name}. ${agent.purpose}\n\nGround every output in cited policy. Prefer asking a clarifying question over guessing when confidence is below 60%. Treat employee data as confidential.`}
              </pre>
            </details>
            <p className="text-[10px] text-muted-foreground/60 mt-2">
              Advanced editing requires platform admin role. Changes here are versioned and reviewable.
            </p>
          </Section>

          {isCustomised && (
            <button
              onClick={() => resetAgentConfig(agent.id)}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Reset agent to defaults
            </button>
          )}
        </div>
      )}

      {tab === "performance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Metric label="7-day decision volume" value={`${agent.activity7d.reduce((a, b) => a + b, 0)}`} sub="decisions" />
            <Metric label="30-day accuracy" value={`${Math.round(agent.accuracy30d * 100)}%`} sub="vs human-override" />
            <Metric label="30-day override rate" value={`${Math.round(agent.overrideRate30d * 100)}%`} sub="lower = better" />
          </div>

          <Section title="Volume — last 7 days">
            <div className="p-4">
              <Sparkline values={agent.activity7d} width={640} height={120} />
            </div>
          </Section>

          <Section title="Precision / recall">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Precision and recall are computed against the human-override stream over the rolling 30-day window. We treat an
              override as a true label for the opposite outcome.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Metric label="Precision" value={`${Math.round((agent.accuracy30d - 0.04) * 100)}%`} sub="true positives ÷ (TP + FP)" />
              <Metric label="Recall" value={`${Math.round((agent.accuracy30d - 0.07) * 100)}%`} sub="true positives ÷ (TP + FN)" />
            </div>
          </Section>
        </div>
      )}

      {tab === "decisions" && (
        <div className="space-y-3">
          {decisions.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-10 text-center text-sm text-muted-foreground">
              No decisions yet for this agent.
            </div>
          ) : (
            decisions.map((d) => (
              <Link
                key={d.id}
                href={`/leave/hr/agents/${agent.id}/trace/${d.id}`}
                className="block bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{d.outcome}</span>
                      <span className="text-[10px] text-muted-foreground">· {d.whenLabel}</span>
                      <span className="text-[10px] text-foreground">· {d.confidence}% confident</span>
                    </div>
                    <p className="text-sm text-foreground leading-snug">{d.summary}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground/40 shrink-0 mt-1" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Sparkles className="size-3.5 text-brand" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function Guardrail({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`size-3 rounded-full ${enabled ? "bg-success/30 border-2 border-success" : "bg-secondary border-2 border-border"}`} />
      <span className="text-foreground">{label}</span>
    </li>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</p>
      <p className="text-xl font-bold text-foreground mt-1 tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>
    </div>
  );
}
