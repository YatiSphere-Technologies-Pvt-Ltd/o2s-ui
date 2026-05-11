"use client";

import Link from "next/link";
import { ArrowRight, Bot, Pause, Play, Sparkles } from "lucide-react";
import type { AgentAutonomyLevel, AgentSeed } from "@/components/leave/data";
import type { AgentEffectiveConfig } from "@/lib/leave-store";
import { Sparkline } from "@/components/leave/sparkline";

const TONE: Record<AgentSeed["tone"], { iconBg: string; iconColor: string; sparkColor: string }> = {
  brand:          { iconBg: "bg-brand/10",         iconColor: "text-brand",         sparkColor: "text-brand" },
  "brand-purple": { iconBg: "bg-brand-purple/10",  iconColor: "text-brand-purple",  sparkColor: "text-brand-purple" },
  "brand-teal":   { iconBg: "bg-brand-teal/10",    iconColor: "text-brand-teal",    sparkColor: "text-brand-teal" },
  success:        { iconBg: "bg-success/10",       iconColor: "text-success",       sparkColor: "text-success" },
  warning:        { iconBg: "bg-warning/10",       iconColor: "text-warning",       sparkColor: "text-warning" },
  destructive:    { iconBg: "bg-destructive/10",   iconColor: "text-destructive",   sparkColor: "text-destructive" },
};

const AUTONOMY_LABEL: Record<AgentAutonomyLevel, string> = {
  off:              "Off",
  suggest:          "Suggest only",
  act_with_confirm: "Act with confirm",
  autonomous:       "Autonomous",
};

const AUTONOMY_TINT: Record<AgentAutonomyLevel, { bg: string; color: string }> = {
  off:              { bg: "bg-secondary",         color: "text-muted-foreground" },
  suggest:          { bg: "bg-brand/10",          color: "text-brand" },
  act_with_confirm: { bg: "bg-brand-purple/10",   color: "text-brand-purple" },
  autonomous:       { bg: "bg-warning/10",        color: "text-warning" },
};

interface Props {
  entry: AgentEffectiveConfig;
  /** External pause (the global toggle). */
  globalPaused: boolean;
  onTogglePower: () => void;
}

export function AgentCard({ entry, globalPaused, onTogglePower }: Props) {
  const { agent, status, autonomy, isCustomised } = entry;
  const tone = TONE[agent.tone];
  const autonomyMeta = AUTONOMY_TINT[autonomy];

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-border/80 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`size-9 shrink-0 rounded-lg flex items-center justify-center ${tone.iconBg}`}>
          <Bot className={`size-4 ${tone.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground truncate">{agent.name}</h3>
            {isCustomised && (
              <span className="text-[9px] uppercase tracking-wider text-brand bg-brand/10 px-1.5 py-0.5 rounded">
                Customised
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{agent.purpose}</p>
        </div>

        <button
          onClick={onTogglePower}
          disabled={globalPaused}
          aria-pressed={status}
          title={globalPaused ? "All agents paused globally" : status ? "Pause this agent" : "Resume this agent"}
          className={`size-8 inline-flex items-center justify-center rounded-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            status
              ? "border-success/40 bg-success/10 text-success hover:bg-success/15"
              : "border-border bg-card text-muted-foreground hover:bg-surface-overlay"
          }`}
        >
          {status ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
        </button>
      </div>

      {/* Status row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${autonomyMeta.bg} ${autonomyMeta.color}`}>
          <Sparkles className="size-2.5" />
          {AUTONOMY_LABEL[autonomy]}
        </span>
        <span className="text-[10px] text-muted-foreground">
          Scope: <span className="text-foreground">{entry.scope.cohorts.join(", ")}</span>
        </span>
      </div>

      {/* Sparkline + metrics */}
      <div className="grid grid-cols-3 gap-3 items-center">
        <Sparkline values={agent.activity7d} color={tone.sparkColor} />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Accuracy</p>
          <p className="text-sm font-bold text-foreground tabular-nums">{Math.round(agent.accuracy30d * 100)}%</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Override</p>
          <p className="text-sm font-bold text-foreground tabular-nums">{Math.round(agent.overrideRate30d * 100)}%</p>
        </div>
      </div>

      {/* Recent actions */}
      <ul className="space-y-1.5 pt-3 border-t border-border">
        {agent.recentActions.map((a) => (
          <li key={a.id} className="text-[11px] text-foreground leading-snug flex items-start gap-2">
            <span className={`size-1 rounded-full bg-current ${tone.sparkColor} mt-1.5 shrink-0`} />
            <span className="flex-1">
              {a.text} <span className="text-muted-foreground/60">· {a.when}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <Link
        href={`/leave/hr/agents/${agent.id}`}
        className="inline-flex items-center justify-center gap-1.5 mt-1 h-9 rounded-lg border border-border bg-card text-xs text-foreground hover:bg-surface-overlay transition-colors"
      >
        Configure
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
