"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  ShieldCheck,
  BarChart3,
  UserCheck,
  Star,
  BookOpen,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  AGENTS,
  STATUS_CONFIG,
  AUTONOMY_LEVELS,
} from "@/components/settings/ai-data";
import type { Agent, AutonomyLevel } from "@/components/settings/ai-data";

const AGENT_ICONS: Record<string, LucideIcon> = {
  recruiter: Search,
  compliance: ShieldCheck,
  analytics: BarChart3,
  onboarding: UserCheck,
  performance: Star,
  policy: BookOpen,
  orchestrator: Workflow,
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

function AgentCard({ agent }: { agent: Agent }) {
  const [enabled, setEnabled] = useState(agent.enabled);
  const [autonomy, setAutonomy] = useState<AutonomyLevel>(agent.autonomyLevel);
  const Icon = AGENT_ICONS[agent.id] ?? FileText;
  const statusCfg = STATUS_CONFIG[agent.status];
  const maxSparkline = Math.max(...agent.activitySparkline, 1);

  return (
    <div
      className={`relative bg-card border-l-[3px] ${agent.borderClass} border border-border rounded-xl p-5 hover:shadow-lg transition-all ${
        agent.comingSoon ? "opacity-60" : ""
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`size-10 rounded-lg ${agent.bgClass}/10 flex items-center justify-center shrink-0`}
          >
            <Icon className={`size-5 ${agent.colorClass}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground truncate">
                {agent.name}
              </span>
              <span
                className={`flex items-center gap-1 text-[10px] font-medium ${statusCfg.textClass}`}
              >
                <span
                  className={`size-1.5 rounded-full ${statusCfg.dotClass} inline-block`}
                />
                {statusCfg.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {agent.description}
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        {!agent.comingSoon && (
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={`relative shrink-0 w-9 h-5 rounded-full transition-colors ${
              enabled ? "bg-success" : "bg-secondary"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform ${
                enabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        )}
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {agent.metrics.map((m) => (
          <div
            key={m.label}
            className="bg-background rounded-lg p-2 text-center"
          >
            <div className="text-sm font-bold text-foreground">{m.value}</div>
            <div className="text-[10px] text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Autonomy level */}
      <div className="mt-4 flex rounded-md overflow-hidden">
        {AUTONOMY_LEVELS.map((level) => {
          const isActive = autonomy === level.key;
          const activeColors = level.colorClass
            .split(" ")
            .map((c) => {
              if (c.startsWith("bg-")) return c + "/20";
              return c;
            })
            .join(" ");

          return (
            <button
              key={level.key}
              type="button"
              disabled={agent.comingSoon}
              onClick={() => setAutonomy(level.key)}
              className={`flex-1 py-1.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? activeColors
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {level.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Activity sparkline */}
      <div className="flex items-end gap-[2px] mt-4 h-6">
        {agent.activitySparkline.map((value, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-sm ${agent.bgClass}`}
            style={{
              height: `${Math.max((value / maxSparkline) * 24, 1)}px`,
            }}
          />
        ))}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <button
          type="button"
          className="text-sm text-brand hover:underline"
          disabled={agent.comingSoon}
        >
          Configure
        </button>
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-foreground"
          disabled={agent.comingSoon}
        >
          View Logs
        </button>
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-foreground"
          disabled={agent.comingSoon}
        >
          {agent.status === "paused" ? "Resume" : "Pause"}
        </button>
      </div>

      {/* Coming soon overlay */}
      {agent.comingSoon && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <span className="bg-secondary text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
            Coming in Phase 3
          </span>
        </div>
      )}
    </div>
  );
}

export function AgentCardsGrid() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">AI Agents</h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {AGENTS.map((agent) => (
          <motion.div key={agent.id} variants={cardVariants}>
            <AgentCard agent={agent} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
