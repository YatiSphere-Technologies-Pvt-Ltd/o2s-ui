"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Bot, Zap, Clock, ArrowRight } from "lucide-react";
import {
  type AgentRun,
  type RunStatus,
  runStatusColor,
  runStatusBgColor,
  runStatusLabel,
  getAgentById,
  agentColorGradient,
} from "./data";

interface ExecutionLogsProps {
  runs: AgentRun[];
}

const STATUS_FILTERS: (RunStatus | "all")[] = [
  "all",
  "success",
  "failed",
  "running",
  "skipped",
];

export function ExecutionLogs({ runs }: ExecutionLogsProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RunStatus | "all">("all");

  const filtered = useMemo(() => {
    return runs.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const agent = getAgentById(r.agentId);
        if (
          !r.ruleName.toLowerCase().includes(q) &&
          !r.triggeredByEvent.toLowerCase().includes(q) &&
          !(agent?.name || "").toLowerCase().includes(q) &&
          !r.details.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [runs, statusFilter, search]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of runs) {
      counts[r.status] = (counts[r.status] || 0) + 1;
    }
    return counts;
  }, [runs]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors cursor-pointer ${
                statusFilter === s
                  ? "bg-brand-purple/15 text-brand-purple"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {s === "all" ? `All (${runs.length})` : `${runStatusLabel(s)} (${statusCounts[s] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* Log items */}
      <div className="space-y-2">
        {filtered.map((run, i) => {
          const agent = getAgentById(run.agentId);
          return (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card hover:bg-secondary/20 transition-colors"
            >
              {/* Agent avatar */}
              <div
                className={`size-8 rounded-lg bg-gradient-to-br ${agent ? agentColorGradient(agent.color) : "from-secondary to-secondary/60"} flex items-center justify-center shrink-0`}
              >
                <Bot className="size-4 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-foreground">
                    {agent?.name || run.agentId}
                  </span>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${runStatusBgColor(run.status)} ${runStatusColor(run.status)}`}
                  >
                    {runStatusLabel(run.status)}
                  </span>
                  {run.status === "running" && (
                    <div className="flex gap-0.5">
                      <span className="size-1 rounded-full bg-brand animate-pulse" />
                      <span className="size-1 rounded-full bg-brand animate-pulse [animation-delay:0.2s]" />
                      <span className="size-1 rounded-full bg-brand animate-pulse [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>

                {/* Trigger info */}
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
                  <Zap className="size-3 text-brand-purple/60" />
                  <span className="font-mono">{run.triggeredByEvent}</span>
                  <ArrowRight className="size-3 text-muted-foreground/30" />
                  <span>{run.ruleName}</span>
                </div>

                {/* Details */}
                <p className="text-[11px] text-muted-foreground/70 leading-snug">
                  {run.details}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground/40">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {run.timestamp}
                  </div>
                  {run.duration !== "—" && (
                    <span>Duration: {run.duration}</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40">
          <Clock className="size-8 mb-3" />
          <p className="text-sm">No execution logs match your filter</p>
        </div>
      )}
    </div>
  );
}
