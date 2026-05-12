"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  FileSearch,
  Sparkles,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAgentTower } from "@/lib/agent-tower-store";
import { PRESALES_AGENT_REGISTRY } from "@/components/presales/agents";
import { AgentIcon } from "@/components/agents/agent-icon";
import {
  OUTCOME_LABEL,
  OUTCOME_TINT,
  TONE_TINT,
  type TraceTool,
} from "@/components/agents/types";

interface PageProps {
  params: Promise<{ id: string; did: string }>;
}

const TOOL_ICON: Record<TraceTool["kind"], React.ComponentType<{ className?: string }>> = {
  policy_lookup: FileSearch,
  data_fetch:    Database,
  model_call:    Sparkles,
  agent_call:    ChevronRight,
  external_api:  ExternalLink,
  calc:          Code2,
};

export default function PresalesDecisionTracePage({ params }: PageProps) {
  const { id, did } = use(params);
  const { setScreen } = useScreen();
  const tower = useAgentTower(PRESALES_AGENT_REGISTRY);

  const agent = tower.findAgent(id);
  const decision = tower.decisions.find((d) => d.id === did);
  const trace = tower.findTrace(did);

  const agentName = agent?.spec.name;
  const decId = decision?.id;

  useEffect(() => {
    if (!agentName || !decId) return;
    setScreen({ module: "Pre-Sales", page: "Decision trace", recordId: decId, recordLabel: `${agentName} · ${decId}` });
    return () => setScreen(null);
  }, [agentName, decId, setScreen]);

  if (!agent || !decision) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Decision not found</h1>
        <Link href={`/presales/agents/${id}`} className="text-brand underline mt-3 inline-block">
          Back to agent
        </Link>
      </div>
    );
  }

  const tint = TONE_TINT[agent.spec.tone];
  const outcomeTint = OUTCOME_TINT[decision.outcome];
  const outcomeLabel = OUTCOME_LABEL[decision.outcome];

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
            href={`/presales/agents/${id}`}
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-start gap-3">
            <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
              <AgentIcon name={agent.spec.iconName} className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground tracking-tight">{agent.spec.name}</h1>
                <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${outcomeTint}`}>
                  {outcomeLabel}
                </span>
                <code className="text-[10px] font-mono text-muted-foreground/60">{decision.id}</code>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl mt-0.5">{decision.summary}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mt-1.5 flex-wrap">
                <span>{decision.whenLabel}</span>
                <span>·</span>
                <span>{decision.confidence}% confidence</span>
                {decision.recordLabel && (
                  <>
                    <span>·</span>
                    <code className="font-mono">{decision.recordLabel}</code>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {decision.outcome === "pending_review" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => tower.approveDecision(decision.id)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-success/10 text-success border border-success/40 text-sm font-medium hover:bg-success/20 transition-colors"
            >
              <Check className="size-3.5" />
              Approve
            </button>
            <button
              onClick={() => tower.rejectDecision(decision.id)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/40 text-sm font-medium hover:bg-destructive/20 transition-colors"
            >
              <X className="size-3.5" />
              Reject
            </button>
          </div>
        )}
      </motion.div>

      {!trace && (
        <div className="bg-card border border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
          No trace recorded for this decision.
        </div>
      )}

      {trace && (
        <>
          {/* Input */}
          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-surface-overlay/40 border-b border-border">
              <p className="text-[11px] font-semibold text-foreground">Input</p>
            </div>
            <ul>
              {trace.input.map((row, i) => (
                <li key={i} className="px-4 py-2 border-b border-border last:border-b-0 flex items-center gap-3 text-[12px]">
                  <span className="text-muted-foreground min-w-24">{row.label}</span>
                  <code className="font-mono text-foreground">{row.value}</code>
                </li>
              ))}
            </ul>
          </section>

          {/* Tools called */}
          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-surface-overlay/40 border-b border-border">
              <p className="text-[11px] font-semibold text-foreground">Tools called ({trace.tools.length})</p>
            </div>
            <ol>
              {trace.tools.map((t, i) => {
                const Icon = TOOL_ICON[t.kind];
                return (
                  <li key={t.id} className="px-4 py-3 border-b border-border last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="size-7 rounded-md bg-secondary text-muted-foreground flex items-center justify-center shrink-0">
                        <Icon className="size-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                            Step {i + 1}
                          </span>
                          <p className="text-sm font-medium text-foreground">{t.name}</p>
                          <span className="text-[11px] text-muted-foreground tabular-nums">{t.whenLabel}</span>
                        </div>
                        <p className="text-[12px] text-muted-foreground leading-snug">{t.summary}</p>
                        <pre className="text-[11px] font-mono text-foreground bg-secondary/50 rounded px-2 py-1 mt-1.5 overflow-x-auto">{t.result}</pre>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Policy rules */}
          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-surface-overlay/40 border-b border-border">
              <p className="text-[11px] font-semibold text-foreground">Policy rules consulted</p>
            </div>
            <ul>
              {trace.policyRules.map((r) => (
                <li key={r.id} className="px-4 py-2 border-b border-border last:border-b-0 flex items-center gap-3 text-[12px]">
                  <span
                    className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      r.outcome === "pass"
                        ? "bg-success/10 text-success"
                        : r.outcome === "warn"
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {r.outcome}
                  </span>
                  <span className="text-foreground">{r.label}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Reasoning */}
          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-surface-overlay/40 border-b border-border">
              <p className="text-[11px] font-semibold text-foreground">Reasoning</p>
            </div>
            <ul className="px-4 py-3 space-y-1.5">
              {trace.reasoning.map((line, i) => (
                <li key={i} className="text-[12px] text-foreground flex items-start gap-2">
                  <span className="text-muted-foreground/60 mt-0.5">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Output */}
          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-surface-overlay/40 border-b border-border">
              <p className="text-[11px] font-semibold text-foreground">Output</p>
            </div>
            <pre className="px-4 py-3 text-[11px] font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(trace.output, null, 2)}
            </pre>
          </section>
        </>
      )}
    </div>
  );
}
