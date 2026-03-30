"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Bot,
  GitBranch,
  ScrollText,
  Shield,
  Sparkles,
  Globe,
} from "lucide-react";
import { EventCatalog } from "@/components/automation/event-catalog";
import { AgentRegistry } from "@/components/automation/agent-registry";
import { TriggerRules } from "@/components/automation/trigger-rules";
import { WebhookSubscriptions } from "@/components/automation/webhook-subscriptions";
import { ExecutionLogs } from "@/components/automation/execution-logs";
import { GlobalControls } from "@/components/automation/global-controls";
import { AutomationWizard } from "@/components/automation/automation-wizard";
import { Button } from "@/components/ui/button";
import {
  type AutomationTab,
  type AgentMode,
  type SystemEvent,
  type Agent,
  type TriggerRule,
  type WebhookSubscription,
  AUTOMATION_TABS,
  EVENTS,
  AGENTS,
  TRIGGER_RULES,
  WEBHOOKS,
  AGENT_RUNS,
} from "@/components/automation/data";

const TAB_ICONS: Record<AutomationTab, typeof Zap> = {
  events: Zap,
  agents: Bot,
  rules: GitBranch,
  webhooks: Globe,
  logs: ScrollText,
  controls: Shield,
};

const tabTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<AutomationTab>("rules");

  // State
  const [events, setEvents] = useState<SystemEvent[]>(EVENTS);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [rules, setRules] = useState<TriggerRule[]>(TRIGGER_RULES);
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>(WEBHOOKS);
  const [runs] = useState(AGENT_RUNS);
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [defaultMode, setDefaultMode] = useState<AgentMode>("assist");
  const [wizardOpen, setWizardOpen] = useState(false);

  // Event handlers
  const handleToggleEvent = useCallback((id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isActive: !e.isActive } : e))
    );
  }, []);

  const handleToggleAgent = useCallback((id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isEnabled: !a.isEnabled } : a))
    );
  }, []);

  const handleSetAgentMode = useCallback((id: string, mode: AgentMode) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, defaultMode: mode } : a))
    );
  }, []);

  const handleToggleRule = useCallback((id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  }, []);

  const handleSaveRule = useCallback((rule: TriggerRule) => {
    setRules((prev) => {
      const exists = prev.find((r) => r.id === rule.id);
      if (exists) {
        return prev.map((r) => (r.id === rule.id ? rule : r));
      }
      return [...prev, rule];
    });
  }, []);

  const handleDeleteRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleToggleWebhook = useCallback((id: string) => {
    setWebhooks((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "active" ? "paused" as const : "active" as const }
          : w
      )
    );
  }, []);

  const handleDeleteWebhook = useCallback((id: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // Stats
  const domainEventCount = events.filter((e) => e.layer === "domain" && e.isActive).length;
  const systemEventCount = events.filter((e) => e.layer === "system" && e.isActive).length;
  const integrationEventCount = events.filter((e) => e.layer === "integration" && e.isActive).length;
  const enabledAgentsCount = agents.filter((a) => a.isEnabled).length;
  const activeRulesCount = rules.filter((r) => r.isEnabled).length;
  const activeWebhooksCount = webhooks.filter((w) => w.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-teal flex items-center justify-center">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Agent Automation
              </h1>
              <p className="text-sm text-muted-foreground">
                Event-driven AI platform with extensible integrations
              </p>
            </div>
          </div>
          <Button
            onClick={() => setWizardOpen(true)}
            className="bg-gradient-to-r from-brand-purple to-brand-teal text-white font-semibold rounded-lg gap-2 cursor-pointer hover:opacity-90"
          >
            <Sparkles className="size-4" />
            New Automation
          </Button>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 mt-4 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <div
              className={`size-2 rounded-full ${
                masterEnabled ? "bg-success animate-pulse" : "bg-destructive"
              }`}
            />
            <span className={masterEnabled ? "text-success" : "text-destructive"}>
              {masterEnabled ? "Active" : "Paused"}
            </span>
          </div>
          <span className="text-muted-foreground/20">|</span>
          <span className="text-muted-foreground">
            {domainEventCount} domain · {systemEventCount} system · {integrationEventCount} integration events
          </span>
          <span className="text-muted-foreground/20">|</span>
          <span className="text-muted-foreground">{enabledAgentsCount} agents</span>
          <span className="text-muted-foreground/20">·</span>
          <span className="text-muted-foreground">{activeRulesCount} rules</span>
          <span className="text-muted-foreground/20">·</span>
          <span className="text-muted-foreground">{activeWebhooksCount} webhooks</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
        {AUTOMATION_TABS.map((tab) => {
          const Icon = TAB_ICONS[tab.key];
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-card text-foreground border border-border shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} {...tabTransition}>
          {activeTab === "events" && (
            <EventCatalog events={events} onToggleEvent={handleToggleEvent} />
          )}
          {activeTab === "agents" && (
            <AgentRegistry
              agents={agents}
              onToggleAgent={handleToggleAgent}
              onSetAgentMode={handleSetAgentMode}
            />
          )}
          {activeTab === "rules" && (
            <TriggerRules
              rules={rules}
              onToggleRule={handleToggleRule}
              onSaveRule={handleSaveRule}
              onDeleteRule={handleDeleteRule}
            />
          )}
          {activeTab === "webhooks" && (
            <WebhookSubscriptions
              webhooks={webhooks}
              onToggleWebhook={handleToggleWebhook}
              onDeleteWebhook={handleDeleteWebhook}
            />
          )}
          {activeTab === "logs" && <ExecutionLogs runs={runs} />}
          {activeTab === "controls" && (
            <GlobalControls
              masterEnabled={masterEnabled}
              onToggleMaster={() => setMasterEnabled((prev) => !prev)}
              defaultMode={defaultMode}
              onSetDefaultMode={setDefaultMode}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Automation Wizard */}
      <AnimatePresence>
        {wizardOpen && (
          <AutomationWizard
            open={wizardOpen}
            onClose={() => setWizardOpen(false)}
            onSave={(wizardState) => {
              // Convert wizard output to a TriggerRule
              const newRule: TriggerRule = {
                id: `rule-${Date.now()}`,
                name: wizardState.ruleName,
                event: wizardState.selectedEventId,
                conditions: wizardState.conditions,
                actionType: wizardState.outputWebhookEnabled ? "both" : "trigger_agent",
                agentId: wizardState.agentId,
                webhookId: null,
                mode: wizardState.mode,
                isEnabled: wizardState.isEnabled,
                priority: 1,
                createdAt: new Date().toISOString().split("T")[0],
                lastTriggered: null,
                triggerCount: 0,
              };
              setRules((prev) => [...prev, newRule]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
