"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  CalendarCheck,
  Check,
  Database,
  GitBranch,
  Sparkles,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import {
  AGENTS,
  AGENT_DECISIONS,
  DECISION_TRACES,
  defaultTraceFor,
  type AgentId,
  type TraceTool,
} from "@/components/leave/data";

interface PageProps {
  params: Promise<{ id: string; decisionId: string }>;
}

const TOOL_ICON: Record<TraceTool["kind"], React.ComponentType<{ className?: string }>> = {
  policy_lookup:  Wrench,
  calendar_check: CalendarCheck,
  balance_check:  Wallet,
  history_fetch:  Database,
  agent_call:     GitBranch,
  model_call:     Brain,
};

const RULE_META: Record<"pass" | "warn" | "fail", { tint: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pass: { tint: "bg-success/10",     color: "text-success",     icon: Check },
  warn: { tint: "bg-warning/10",     color: "text-warning",     icon: Sparkles },
  fail: { tint: "bg-destructive/10", color: "text-destructive", icon: X },
};

export default function DecisionTracePage({ params }: PageProps) {
  const { id, decisionId } = use(params);
  const { setScreen } = useScreen();

  const agent = AGENTS.find((a) => a.id === (id as AgentId));
  const decision = AGENT_DECISIONS.find((d) => d.id === decisionId);
  const trace = decision
    ? DECISION_TRACES[decisionId] ?? defaultTraceFor(decision)
    : undefined;

  const agentName = agent?.name;
  const decId = decision?.id;
  useEffect(() => {
    if (!agentName || !decId) return;
    setScreen({
      module: "Leave",
      page: "Decision trace",
      recordId: decId,
      recordLabel: `${agentName} · ${decId}`,
    });
    return () => setScreen(null);
  }, [agentName, decId, setScreen]);

  if (!agent || !decision || !trace) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Decision not found</h1>
        <p className="text-sm text-muted-foreground mt-2">
          No trace recorded for <code>{decisionId}</code>.
        </p>
        <Link
          href={`/leave/hr/agents/${id}`}
          className="inline-flex items-center gap-1.5 mt-6 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to agent
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3 flex-wrap"
      >
        <Link
          href={`/leave/hr/agents/${id}`}
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {agent.name} · decision {decision.id}
            </span>
            <span className={`text-[10px] uppercase tracking-wider ${decision.outcome === "executed" ? "text-success" : decision.outcome === "suggested" ? "text-brand" : decision.outcome === "overridden" ? "text-warning" : "text-destructive"}`}>
              {decision.outcome}
            </span>
            <span className="text-[10px] text-foreground">{decision.confidence}% confident</span>
            <span className="text-[10px] text-muted-foreground">· {decision.whenLabel}</span>
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight leading-snug">{decision.summary}</h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input */}
          <Section title="Input">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-xs">
              {trace.input.map((i) => (
                <div key={i.label}>
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{i.label}</dt>
                  <dd className="text-foreground mt-0.5">{i.value}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* Tools called */}
          <Section title="Tools called">
            <ol className="space-y-3">
              {trace.tools.map((t, i) => {
                const Icon = TOOL_ICON[t.kind];
                return (
                  <li key={t.id} className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="size-7 rounded-md bg-surface-overlay flex items-center justify-center">
                        <Icon className="size-3.5 text-muted-foreground" />
                      </div>
                      {i < trace.tools.length - 1 && (
                        <span className="w-px flex-1 bg-border mt-1 min-h-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <p className="text-xs font-mono text-foreground">{t.name}</p>
                        <span className="text-[10px] text-muted-foreground/60 tabular-nums">{t.whenLabel}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{t.summary}</p>
                      <pre className="text-[10px] font-mono text-muted-foreground/80 mt-1.5 px-2 py-1 rounded bg-secondary/50 overflow-x-auto">
                        {t.result}
                      </pre>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Section>

          {/* Reasoning */}
          <Section title="Model reasoning">
            <ul className="space-y-2 text-xs">
              {trace.reasoning.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground leading-relaxed">
                  <span className="size-1 rounded-full bg-current text-muted-foreground/40 mt-1.5 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Output */}
          <Section title="Output">
            <pre className="text-[11px] font-mono text-foreground p-3 rounded-lg bg-secondary/50 overflow-x-auto whitespace-pre-wrap">
              {prettifyJson(trace.output)}
            </pre>
          </Section>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-6">
          {/* Policy rules */}
          <Section title="Policy rules consulted">
            {trace.policyRules.length === 0 ? (
              <p className="text-[11px] text-muted-foreground italic">No policy rules consulted.</p>
            ) : (
              <ul className="space-y-1.5">
                {trace.policyRules.map((r) => {
                  const m = RULE_META[r.outcome];
                  const Icon = m.icon;
                  return (
                    <li key={r.id} className={`flex items-start gap-2 p-2 rounded-md ${m.tint}`}>
                      <Icon className={`size-3.5 shrink-0 mt-0.5 ${m.color}`} />
                      <div className="flex-1 min-w-0 text-[11px]">
                        <p className="text-foreground leading-snug">{r.label}</p>
                        <p className={`text-[10px] uppercase tracking-wider ${m.color}`}>{r.outcome}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          {/* Downstream effects */}
          <Section title="Downstream effects">
            <ul className="space-y-2 text-xs">
              {trace.effects.map((e) => (
                <li key={e.id} className="flex items-start gap-2 text-foreground">
                  <Sparkles className="size-3 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{e.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{e.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          {decision.requestId && (
            <Section title="Related request">
              <Link
                href={`/leave/${decision.requestId.startsWith("tr-") ? "manager/" + decision.requestId : decision.requestId}`}
                className="text-[11px] text-brand hover:underline"
              >
                Open request {decision.requestId} →
              </Link>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-3">{title}</h3>
      {children}
    </section>
  );
}

function prettifyJson(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch {
    return s;
  }
}
