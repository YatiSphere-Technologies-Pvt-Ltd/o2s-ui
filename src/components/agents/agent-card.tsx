"use client";

import Link from "next/link";
import { ChevronRight, Pause, Play } from "lucide-react";
import { AgentIcon } from "./agent-icon";
import { AgentSparkline } from "./sparkline";
import {
  AUTONOMY_LABEL,
  TONE_TINT,
  TRIGGER_LABEL,
  type AgentSpec,
  type AgentAutonomy,
} from "./types";

interface Props {
  spec: AgentSpec;
  status: boolean;
  autonomy: AgentAutonomy;
  isCustomised: boolean;
  detailHref: string;
  onToggle: () => void;
}

export function AgentCard({ spec, status, autonomy, isCustomised, detailHref, onToggle }: Props) {
  const tint = TONE_TINT[spec.tone];

  return (
    <Link
      href={detailHref}
      className={`group block bg-card border rounded-xl p-4 hover:border-border/80 transition-colors ${
        status ? "border-border" : "border-border opacity-70"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
          <AgentIcon name={spec.iconName} className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground">{spec.name}</h3>
            {!status && (
              <span className="text-[9px] uppercase tracking-wider bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">
                Paused
              </span>
            )}
            {isCustomised && status && (
              <span className="text-[9px] uppercase tracking-wider bg-brand/10 text-brand px-1.5 py-0.5 rounded">
                Customised
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{spec.purpose}</p>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          aria-label={status ? "Pause agent" : "Resume agent"}
          className={`size-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
            status
              ? "bg-success/10 text-success hover:bg-success/20"
              : "bg-secondary text-muted-foreground hover:bg-surface-overlay"
          }`}
        >
          {status ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </button>
      </div>

      {/* Metadata strip */}
      <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground/80">
        <span className="inline-flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-current opacity-60" />
          {TRIGGER_LABEL[spec.trigger]}
        </span>
        <span>·</span>
        <span>{AUTONOMY_LABEL[autonomy]}</span>
        <span className="ml-auto inline-flex items-center gap-1 text-foreground">
          <span className="opacity-60">7d</span>
          <span className={spec.tone === "warning" ? "text-warning" : "text-brand"}>
            <AgentSparkline data={spec.activity7d} />
          </span>
        </span>
      </div>

      {/* KPI line */}
      {spec.kpis[0] && (
        <div className="mt-2 pt-2 border-t border-border flex items-center gap-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
            {spec.kpis[0].label}
          </p>
          <p className="text-sm font-bold text-foreground ml-auto tabular-nums">{spec.kpis[0].value}</p>
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground/70 inline-flex items-center gap-1">
          <span className="opacity-60">Accuracy 30d</span>
          <span className="font-semibold text-foreground tabular-nums">
            {Math.round(spec.accuracy30d * 100)}%
          </span>
        </span>
        <ChevronRight className="size-3.5 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
      </div>
    </Link>
  );
}
