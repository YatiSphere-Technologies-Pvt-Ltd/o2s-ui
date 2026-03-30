"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Trash2,
  Zap,
  Bot,
  Hash,
  ChevronDown,
  ArrowRight,
  AlertTriangle,
  Pencil,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type TriggerRule,
  type RuleCondition,
  type AgentMode,
  type RuleActionType,
  type ConditionOperator,
  type SystemEvent,
  type Agent,
  modeColor,
  modeBgColor,
  modeLabel,
  getEventById,
  getAgentById,
  getWebhookById,
  categoryColor,
  categoryBgColor,
  categoryLabel,
  actionTypeLabel,
  CONDITION_FIELDS,
  CONDITION_OPERATORS,
  EVENTS,
  AGENTS,
  WEBHOOKS,
} from "./data";

/* ── Condition Builder ── */

interface ConditionBuilderProps {
  conditions: RuleCondition[];
  onChange: (conditions: RuleCondition[]) => void;
}

function ConditionBuilder({ conditions, onChange }: ConditionBuilderProps) {
  const addCondition = () => {
    onChange([...conditions, { field: "fitScore", operator: ">", value: "" }]);
  };

  const updateCondition = (index: number, updates: Partial<RuleCondition>) => {
    const next = conditions.map((c, i) =>
      i === index ? { ...c, ...updates } : c
    );
    onChange(next);
  };

  const removeCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
          Conditions {conditions.length > 0 && `(${conditions.length})`}
        </span>
        <button
          type="button"
          onClick={addCondition}
          className="flex items-center gap-1 text-[10px] text-brand hover:text-brand-teal transition-colors cursor-pointer font-medium"
        >
          <Plus className="size-3" />
          Add condition
        </button>
      </div>

      {conditions.length === 0 && (
        <p className="text-[11px] text-muted-foreground/40 italic py-2">
          No conditions — rule triggers on every matching event
        </p>
      )}

      {conditions.map((cond, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2"
        >
          {i > 0 && (
            <span className="text-[9px] font-bold text-warning uppercase w-8 text-center shrink-0">
              AND
            </span>
          )}
          {i === 0 && <span className="w-8 shrink-0" />}

          {/* Field */}
          <Select value={cond.field} onValueChange={(val) => updateCondition(i, { field: val as string })}>
            <SelectTrigger size="sm" className="flex-1 min-w-0">
              <SelectValue placeholder="Field..." />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_FIELDS.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Operator */}
          <Select value={cond.operator} onValueChange={(val) => updateCondition(i, { operator: val as ConditionOperator })}>
            <SelectTrigger size="sm" className="w-28 shrink-0">
              <SelectValue placeholder="Op..." />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_OPERATORS.map((op) => (
                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Value */}
          <input
            type="text"
            value={cond.value}
            onChange={(e) => {
              const val = e.target.value;
              const numVal = Number(val);
              updateCondition(i, {
                value: val === "" ? "" : isNaN(numVal) ? val : numVal,
              });
            }}
            placeholder="Value"
            className="h-8 px-2 rounded-md border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand w-24 shrink-0"
          />

          <button
            type="button"
            onClick={() => removeCondition(i)}
            className="size-8 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-colors cursor-pointer shrink-0"
          >
            <X className="size-3.5" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Trigger Rule Form (Drawer) ── */

interface TriggerRuleFormProps {
  rule: TriggerRule | null;
  onSave: (rule: TriggerRule) => void;
  onClose: () => void;
  existingRules: TriggerRule[];
}

function TriggerRuleForm({
  rule,
  onSave,
  onClose,
  existingRules,
}: TriggerRuleFormProps) {
  const isEdit = !!rule;

  const [name, setName] = useState(rule?.name ?? "");
  const [event, setEvent] = useState(rule?.event ?? "");
  const [conditions, setConditions] = useState<RuleCondition[]>(
    rule?.conditions ?? []
  );
  const [actionType, setActionType] = useState<RuleActionType>(rule?.actionType ?? "trigger_agent");
  const [agentId, setAgentId] = useState(rule?.agentId ?? "");
  const [webhookId, setWebhookId] = useState(rule?.webhookId ?? "");
  const [mode, setMode] = useState<AgentMode>(rule?.mode ?? "assist");
  const [isEnabled, setIsEnabled] = useState(rule?.isEnabled ?? true);
  const [priority, setPriority] = useState(rule?.priority ?? 1);

  const activeEvents = EVENTS.filter((e) => e.isActive);
  const selectedEvent = getEventById(event);
  const availableAgents = AGENTS.filter(
    (a) => a.isEnabled && a.allowedEvents.includes(event)
  );
  const needsAgent = actionType === "trigger_agent" || actionType === "both";
  const needsWebhook = actionType === "send_webhook" || actionType === "both";

  const errors = useMemo(() => {
    const errs: string[] = [];
    if (!name.trim()) errs.push("Rule name is required");
    if (!event) errs.push("Select an event");
    if (needsAgent && !agentId) errs.push("Select an agent");
    if (needsWebhook && !webhookId) errs.push("Select a webhook");
    if (selectedEvent && !selectedEvent.isActive)
      errs.push("Selected event is disabled");
    if (conditions.some((c) => c.value === ""))
      errs.push("All condition values must be filled");

    const isDuplicate = existingRules.some(
      (r) =>
        r.id !== rule?.id &&
        r.event === event &&
        r.agentId === agentId &&
        r.isEnabled &&
        needsAgent
    );
    if (isDuplicate) errs.push("A rule with this event + agent already exists");

    return errs;
  }, [name, event, agentId, webhookId, actionType, needsAgent, needsWebhook, selectedEvent, conditions, existingRules, rule]);

  const handleSubmit = () => {
    if (errors.length > 0) return;
    onSave({
      id: rule?.id ?? `rule-${Date.now()}`,
      name: name.trim(),
      event,
      conditions,
      actionType,
      agentId: needsAgent ? agentId : null,
      webhookId: needsWebhook ? webhookId : null,
      mode,
      isEnabled,
      priority,
      createdAt: rule?.createdAt ?? new Date().toISOString().split("T")[0],
      lastTriggered: rule?.lastTriggered ?? null,
      triggerCount: rule?.triggerCount ?? 0,
    });
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-border z-50 flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? "Edit Trigger Rule" : "Create Trigger Rule"}
          </h2>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
          {/* Rule Name */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
              Rule Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., High Fit Auto-Screen"
              className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
            />
          </div>

          {/* Event Selection */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
              When Event
            </label>
            <Select value={event} onValueChange={(val) => { setEvent(val as string); setAgentId(""); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an event..." />
              </SelectTrigger>
              <SelectContent>
                {activeEvents.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name} ({categoryLabel(e.category)})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEvent && (
              <p className="text-[11px] text-muted-foreground mt-1.5">
                {selectedEvent.description}
              </p>
            )}
          </div>

          {/* Conditions */}
          <ConditionBuilder conditions={conditions} onChange={setConditions} />

          {/* Action Type */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
              Action Type
            </label>
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5 w-fit">
              {(["trigger_agent", "send_webhook", "both"] as RuleActionType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActionType(t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    actionType === t
                      ? "bg-brand/10 text-brand"
                      : "text-muted-foreground/50 hover:text-muted-foreground"
                  }`}
                >
                  {actionTypeLabel(t)}
                </button>
              ))}
            </div>
          </div>

          {/* Agent Selection */}
          {needsAgent && (
            <div>
              <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
                Then Trigger Agent
              </label>
              {!event ? (
                <p className="text-[11px] text-muted-foreground/40 italic">
                  Select an event first
                </p>
              ) : availableAgents.length === 0 ? (
                <p className="text-[11px] text-warning italic">
                  No enabled agents subscribe to this event
                </p>
              ) : (
                <Select value={agentId} onValueChange={(val) => setAgentId(val as string)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an agent..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAgents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Webhook Selection */}
          {needsWebhook && (
            <div>
              <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
                Send Webhook
              </label>
              <Select value={webhookId} onValueChange={(val) => setWebhookId(val as string)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a webhook..." />
                </SelectTrigger>
                <SelectContent>
                  {WEBHOOKS.filter((w) => w.status !== "error").map((w) => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Mode */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
              Execution Mode
            </label>
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5 w-fit">
              {(["auto", "assist", "manual"] as AgentMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    mode === m
                      ? `${modeBgColor(m)} ${modeColor(m)}`
                      : "text-muted-foreground/50 hover:text-muted-foreground"
                  }`}
                >
                  {modeLabel(m)}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
              Priority (1 = highest)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value) || 1)}
              className="w-20 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground outline-none focus:border-brand"
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
              Enabled
            </span>
            <button
              type="button"
              onClick={() => setIsEnabled(!isEnabled)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                isEnabled ? "bg-success" : "bg-secondary"
              }`}
            >
              <span
                className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isEnabled ? "translate-x-4.5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Validation errors */}
          {errors.length > 0 && (
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 space-y-1">
              {errors.map((err, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-destructive"
                >
                  <AlertTriangle className="size-3 shrink-0" />
                  {err}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center gap-3 p-5 border-t border-border">
          <Button
            onClick={handleSubmit}
            disabled={errors.length > 0}
            className="flex-1 h-10 bg-brand hover:bg-brand/90 text-white font-semibold rounded-lg cursor-pointer disabled:opacity-40"
          >
            {isEdit ? "Save Changes" : "Create Rule"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="h-10 rounded-lg cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </>
  );
}

/* ── Trigger Rule Card ── */

function TriggerRuleCard({
  rule,
  onToggle,
  onEdit,
  onDelete,
  onSimulate,
}: {
  rule: TriggerRule;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSimulate: () => void;
}) {
  const evt = getEventById(rule.event);
  const agent = rule.agentId ? getAgentById(rule.agentId) : null;
  const webhook = rule.webhookId ? getWebhookById(rule.webhookId) : null;

  return (
    <div
      className={`rounded-xl border bg-card p-4 transition-all duration-200 ${
        rule.isEnabled ? "border-border" : "border-border/50 opacity-60"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {rule.name}
            </h3>
            <span
              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${modeBgColor(rule.mode)} ${modeColor(rule.mode)}`}
            >
              {modeLabel(rule.mode)}
            </span>
            <span className="text-[9px] text-muted-foreground/40 font-mono">
              P{rule.priority}
            </span>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${
            rule.isEnabled ? "bg-success" : "bg-secondary"
          }`}
        >
          <span
            className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              rule.isEnabled ? "translate-x-4.5" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Flow visualization: WHEN → AND → THEN */}
      <div className="space-y-2 mb-4">
        {/* Event */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-brand-purple uppercase w-10 shrink-0">
            WHEN
          </span>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50">
            <Zap className={`size-3 ${evt ? categoryColor(evt.category) : "text-muted-foreground"}`} />
            <span className="text-[11px] font-mono font-medium text-foreground">
              {evt?.name || rule.event}
            </span>
          </div>
        </div>

        {/* Conditions */}
        {rule.conditions.map((cond, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-warning uppercase w-10 shrink-0">
              AND
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50">
              <span className="text-[11px] text-muted-foreground">
                {CONDITION_FIELDS.find((f) => f.value === cond.field)?.label || cond.field}
              </span>
              <span className="text-[11px] font-mono text-warning">
                {cond.operator}
              </span>
              <span className="text-[11px] font-mono font-semibold text-foreground">
                {cond.value}
              </span>
            </div>
          </div>
        ))}

        {/* Agent action */}
        {agent && (
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-success uppercase w-10 shrink-0">
              THEN
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50">
              <Bot className="size-3 text-brand-teal" />
              <span className="text-[11px] font-medium text-foreground">
                {agent.name}
              </span>
            </div>
          </div>
        )}

        {/* Webhook action */}
        {webhook && (
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-brand uppercase w-10 shrink-0">
              {agent ? "ALSO" : "THEN"}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-brand/8">
              <ArrowRight className="size-3 text-brand" />
              <span className="text-[11px] font-medium text-foreground">
                {webhook.name}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stats + Actions */}
      <div className="flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50">
          <span>{rule.triggerCount} executions</span>
          {rule.lastTriggered && (
            <>
              <span>·</span>
              <span>Last: {rule.lastTriggered}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onSimulate}
            className="size-7 flex items-center justify-center rounded-md hover:bg-brand/10 text-muted-foreground/40 hover:text-brand transition-colors cursor-pointer"
            title="Simulate"
          >
            <Play className="size-3" />
          </button>
          <button
            onClick={onEdit}
            className="size-7 flex items-center justify-center rounded-md hover:bg-secondary text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil className="size-3" />
          </button>
          <button
            onClick={onDelete}
            className="size-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Trigger Rules List ── */

interface TriggerRulesProps {
  rules: TriggerRule[];
  onToggleRule: (id: string) => void;
  onSaveRule: (rule: TriggerRule) => void;
  onDeleteRule: (id: string) => void;
}

export function TriggerRules({
  rules,
  onToggleRule,
  onSaveRule,
  onDeleteRule,
}: TriggerRulesProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TriggerRule | null>(null);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  const handleEdit = (rule: TriggerRule) => {
    setEditingRule(rule);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingRule(null);
    setFormOpen(true);
  };

  const handleSave = (rule: TriggerRule) => {
    onSaveRule(rule);
    setFormOpen(false);
    setEditingRule(null);
  };

  const handleSimulate = (id: string) => {
    setSimulatingId(id);
    setTimeout(() => setSimulatingId(null), 2000);
  };

  const enabledCount = rules.filter((r) => r.isEnabled).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{enabledCount} active rules</span>
          <span className="text-muted-foreground/30">·</span>
          <span>{rules.length} total</span>
        </div>
        <Button
          onClick={handleCreate}
          className="h-8 bg-brand hover:bg-brand/90 text-white text-xs font-semibold rounded-lg gap-1.5 cursor-pointer"
        >
          <Plus className="size-3.5" />
          New Rule
        </Button>
      </div>

      {/* Rules grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rules.map((rule, i) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
          >
            <TriggerRuleCard
              rule={rule}
              onToggle={() => onToggleRule(rule.id)}
              onEdit={() => handleEdit(rule)}
              onDelete={() => onDeleteRule(rule.id)}
              onSimulate={() => handleSimulate(rule.id)}
            />
            {/* Simulation result */}
            <AnimatePresence>
              {simulatingId === rule.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-3 rounded-lg bg-brand-purple/[0.04] border border-brand-purple/20 text-xs text-brand-purple">
                    <span className="font-semibold">Simulation:</span> Rule
                    would match 3 candidates in current pipeline. Agent would
                    execute in {rule.mode} mode.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40">
          <Zap className="size-8 mb-3" />
          <p className="text-sm">No trigger rules configured</p>
          <Button
            onClick={handleCreate}
            variant="outline"
            className="mt-4 text-xs cursor-pointer"
          >
            <Plus className="size-3.5 mr-1.5" />
            Create your first rule
          </Button>
        </div>
      )}

      {/* Form Drawer */}
      <AnimatePresence>
        {formOpen && (
          <TriggerRuleForm
            rule={editingRule}
            onSave={handleSave}
            onClose={() => {
              setFormOpen(false);
              setEditingRule(null);
            }}
            existingRules={rules}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
