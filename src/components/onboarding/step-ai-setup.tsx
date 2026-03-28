"use client";

import { useState, useEffect } from "react";
import { AUTONOMY_PRESETS, AI_AGENTS } from "@/components/onboarding/data";
import type { AIAgentConfig } from "@/components/onboarding/data";

interface StepAISetupProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: (complete: boolean) => void;
}

const autonomyLevels: Record<string, { width: string; color: string }> = {
  "Full Auto": { width: "w-full", color: "bg-success" },
  "Supervised": { width: "w-4/5", color: "bg-brand" },
  "Approval Required": { width: "w-3/5", color: "bg-warning" },
  "Manual": { width: "w-[30%]", color: "bg-secondary" },
};

export function StepAISetup({ onComplete }: StepAISetupProps) {
  const [preset, setPreset] = useState("balanced");
  const [agents, setAgents] = useState<AIAgentConfig[]>(AI_AGENTS.map((a) => ({ ...a })));
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    onComplete(true);
  }, [onComplete]);

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const visibleAgents = showAll ? agents : agents.slice(0, 3);
  const hiddenAgents = showAll ? [] : agents.slice(3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">AI Agent Setup</h2>
        <p className="text-sm text-muted-foreground">Configure how much autonomy your AI agents have.</p>
      </div>

      {/* Autonomy presets */}
      <div className="grid grid-cols-3 gap-3">
        {AUTONOMY_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(p.id)}
            className={`relative bg-card border rounded-xl p-5 text-left cursor-pointer transition-all ${
              preset === p.id ? "border-brand bg-brand/5" : "border-border hover:border-brand/30"
            }`}
          >
            {p.recommended && (
              <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-md bg-brand/10 text-brand">
                Recommended
              </span>
            )}
            <div className="text-2xl mb-2">{p.icon}</div>
            <div className="text-sm font-medium text-foreground mb-1">{p.label}</div>
            <div className="text-xs text-muted-foreground">{p.description}</div>
          </button>
        ))}
      </div>

      {/* Agent list */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">AI Agents</h3>
        <div className="space-y-2">
          {visibleAgents.map((agent) => {
            const level = autonomyLevels[agent.defaultAutonomy] || autonomyLevels["Manual"];
            return (
              <div key={agent.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`size-2.5 rounded-full mt-1.5 shrink-0 ${agent.bgClass}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{agent.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{agent.description}</p>
                      {/* Autonomy bar */}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">{agent.defaultAutonomy}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary">
                          <div className={`h-full rounded-full ${level.color} ${level.width} transition-all`} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleAgent(agent.id)}
                    className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
                      agent.enabled ? "bg-brand" : "bg-secondary"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
                        agent.enabled ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Collapsed agents */}
          {!showAll && hiddenAgents.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="w-full bg-card border border-border rounded-lg p-3 text-center hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="flex -space-x-1">
                  {hiddenAgents.slice(0, 4).map((a) => (
                    <div key={a.id} className={`size-5 rounded-full ${a.bgClass} border-2 border-card`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  +{hiddenAgents.length} more agents
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
