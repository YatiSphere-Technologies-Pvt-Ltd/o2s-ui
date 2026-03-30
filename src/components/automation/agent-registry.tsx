"use client";

import { motion } from "framer-motion";
import { Bot, Zap, Shield } from "lucide-react";
import {
  type Agent,
  type AgentMode,
  agentColorGradient,
  modeColor,
  modeBgColor,
  modeLabel,
  modeDescription,
  getEventById,
} from "./data";

interface AgentRegistryProps {
  agents: Agent[];
  onToggleAgent: (id: string) => void;
  onSetAgentMode: (id: string, mode: AgentMode) => void;
}

const MODE_OPTIONS: AgentMode[] = ["auto", "assist", "manual"];

function ModeSelector({
  currentMode,
  onSelect,
}: {
  currentMode: AgentMode;
  onSelect: (mode: AgentMode) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5">
      {MODE_OPTIONS.map((mode) => {
        const isActive = currentMode === mode;
        return (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all duration-150 cursor-pointer ${
              isActive
                ? `${modeBgColor(mode)} ${modeColor(mode)}`
                : "text-muted-foreground/50 hover:text-muted-foreground"
            }`}
            title={modeDescription(mode)}
          >
            {modeLabel(mode)}
          </button>
        );
      })}
    </div>
  );
}

function AgentCard({
  agent,
  onToggle,
  onSetMode,
}: {
  agent: Agent;
  onToggle: () => void;
  onSetMode: (mode: AgentMode) => void;
}) {
  return (
    <div
      className={`rounded-xl border bg-card p-5 transition-all duration-200 ${
        agent.isEnabled
          ? "border-border"
          : "border-border/50 opacity-60"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`size-10 rounded-xl bg-gradient-to-br ${agentColorGradient(agent.color)} flex items-center justify-center`}
          >
            <Bot className="size-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {agent.name}
            </h3>
            <span
              className={`text-[10px] font-medium ${
                agent.isEnabled ? "text-success" : "text-muted-foreground"
              }`}
            >
              {agent.isEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${
            agent.isEnabled ? "bg-success" : "bg-secondary"
          }`}
        >
          <span
            className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              agent.isEnabled ? "translate-x-4.5" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-[11px] text-muted-foreground leading-snug mb-4">
        {agent.description}
      </p>

      {/* Mode selector */}
      <div className="mb-4">
        <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-2">
          Default Mode
        </span>
        <ModeSelector currentMode={agent.defaultMode} onSelect={onSetMode} />
      </div>

      {/* Allowed events */}
      <div>
        <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-2">
          Subscribed Events ({agent.allowedEvents.length})
        </span>
        <div className="flex flex-wrap gap-1.5">
          {agent.allowedEvents.map((evtId) => {
            const evt = getEventById(evtId);
            return (
              <span
                key={evtId}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-[9px] font-medium text-muted-foreground font-mono"
              >
                <Zap className="size-2.5" />
                {evt?.name || evtId}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AgentRegistry({
  agents,
  onToggleAgent,
  onSetAgentMode,
}: AgentRegistryProps) {
  const enabledCount = agents.filter((a) => a.isEnabled).length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>{enabledCount} enabled</span>
        <span className="text-muted-foreground/30">·</span>
        <span>{agents.length - enabledCount} disabled</span>
        <span className="text-muted-foreground/30">·</span>
        <span>{agents.length} total agents</span>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <AgentCard
              agent={agent}
              onToggle={() => onToggleAgent(agent.id)}
              onSetMode={(mode) => onSetAgentMode(agent.id, mode)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
