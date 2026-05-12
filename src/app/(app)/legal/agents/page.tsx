"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Filter as FilterIcon,
  Search,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAgentTower } from "@/lib/agent-tower-store";
import { LEGAL_AGENT_REGISTRY } from "@/components/legal/agents";
import { AgentCard } from "@/components/agents/agent-card";
import { DecisionRow } from "@/components/agents/decision-row";
import { TowerStats } from "@/components/agents/tower-stats";
import { TRIGGER_LABEL, type TriggerKind, type AgentAutonomy } from "@/components/agents/types";

export default function LegalAgentTowerPage() {
  const { setScreen } = useScreen();
  const tower = useAgentTower(LEGAL_AGENT_REGISTRY);
  const [query, setQuery] = useState("");
  const [triggerFilter, setTriggerFilter] = useState<TriggerKind | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "paused" | "customised">("all");

  useEffect(() => {
    setScreen({ module: "Legal", page: "Agent Tower" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tower.agents.filter((a) => {
      if (triggerFilter !== "all" && a.spec.trigger !== triggerFilter) return false;
      if (statusFilter === "live" && !a.status) return false;
      if (statusFilter === "paused" && a.status) return false;
      if (statusFilter === "customised" && !a.isCustomised) return false;
      if (!q) return true;
      return (
        a.spec.name.toLowerCase().includes(q) ||
        a.spec.purpose.toLowerCase().includes(q) ||
        a.spec.description.toLowerCase().includes(q)
      );
    });
  }, [tower.agents, query, triggerFilter, statusFilter]);

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
            href="/legal"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
              <Bot className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Legal · Agent Tower</h1>
              <p className="text-sm text-muted-foreground">
                17 named agents. Self-serve the 70%, judgment queue for the 30%.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <TowerStats
        live={tower.stats.live}
        total={tower.stats.total}
        customised={tower.stats.customised}
        last24h={tower.stats.last24h}
        pendingReview={tower.stats.pendingReview}
        accuracy={tower.stats.accuracy}
        overrideRate={tower.stats.overrideRate}
        globalPause={tower.globalPause}
        onGlobalToggle={() => tower.setGlobalPause(!tower.globalPause)}
      />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agent, purpose, behaviour…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterIcon className="size-3.5 text-muted-foreground" />
          <select
            value={triggerFilter}
            onChange={(e) => setTriggerFilter(e.target.value as TriggerKind | "all")}
            className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All triggers</option>
            <option value="continuous">{TRIGGER_LABEL.continuous}</option>
            <option value="scheduled">{TRIGGER_LABEL.scheduled}</option>
            <option value="on_event">{TRIGGER_LABEL.on_event}</option>
            <option value="on_demand">{TRIGGER_LABEL.on_demand}</option>
          </select>
          <div className="flex items-center gap-1">
            {(["all", "live", "paused", "customised"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`h-9 px-2.5 rounded-lg text-[11px] transition-colors ${
                  statusFilter === s ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((a) => (
          <AgentCard
            key={a.spec.id}
            spec={a.spec}
            status={a.status}
            autonomy={a.autonomy as AgentAutonomy}
            isCustomised={a.isCustomised}
            detailHref={`/legal/agents/${a.spec.id}`}
            onToggle={() => tower.setAgentConfig(a.spec.id, { status: !a.status })}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground italic text-center py-12">
            No agents match these filters.
          </p>
        )}
      </div>

      {/* Recent decisions feed */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-foreground">Recent decisions</h2>
          <p className="text-[11px] text-muted-foreground tabular-nums">{tower.decisions.length} total</p>
        </div>
        <ul className="bg-card border border-border rounded-xl overflow-hidden">
          {tower.decisions.slice(0, 12).map((d) => {
            const spec = tower.findAgent(d.agentId)?.spec;
            return (
              <DecisionRow
                key={d.id}
                decision={d}
                spec={spec}
                traceHref={`/legal/agents/${d.agentId}/decisions/${d.id}`}
                onApprove={d.outcome === "pending_review" ? () => tower.approveDecision(d.id) : undefined}
                onReject={d.outcome === "pending_review" ? () => tower.rejectDecision(d.id) : undefined}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
