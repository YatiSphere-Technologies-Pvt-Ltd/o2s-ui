"use client";

import { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Mail,
  Globe,
  Zap,
  Bot,
  Shield,
  ArrowRight,
  Plus,
  Trash2,
  AlertTriangle,
  Hash,
  Copy,
  Play,
  Sparkles,
  Send,
  Bell,
  FileJson,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  type SystemEvent,
  type Agent,
  type AgentMode,
  type RuleCondition,
  type ConditionOperator,
  type EventLayer,
  EVENTS,
  AGENTS,
  WEBHOOKS,
  CONDITION_FIELDS,
  CONDITION_OPERATORS,
  categoryLabel,
  categoryColor,
  categoryBgColor,
  layerLabel,
  layerColor,
  layerBgColor,
  modeLabel,
  modeColor,
  modeBgColor,
  modeDescription,
  getEventById,
  getAgentById,
} from "./data";

/* ── Types ── */

type InputType = "event" | "email" | "webhook";

interface EmailConfig {
  mailbox: string;
  allowedSenders: string;
  subjectKeywords: string;
}

interface WebhookInputConfig {
  endpointUrl: string;
  authType: "api_key" | "bearer" | "none";
  samplePayload: string;
}

interface FieldMapping {
  sourceField: string;
  targetField: string;
}

interface OutputWebhook {
  url: string;
  payloadMapping: string;
}

interface WizardState {
  inputType: InputType;
  emailConfig: EmailConfig;
  webhookInputConfig: WebhookInputConfig;
  selectedEventId: string;
  fieldMappings: FieldMapping[];
  conditions: RuleCondition[];
  agentId: string;
  mode: AgentMode;
  ruleName: string;
  outputWebhookEnabled: boolean;
  outputWebhook: OutputWebhook;
  outputNotification: boolean;
  isEnabled: boolean;
}

const INITIAL_STATE: WizardState = {
  inputType: "event",
  emailConfig: { mailbox: "", allowedSenders: "", subjectKeywords: "" },
  webhookInputConfig: {
    endpointUrl: "https://api.o2s.app/webhooks/inbound/" + Math.random().toString(36).slice(2, 10),
    authType: "api_key",
    samplePayload: '{\n  "candidateId": "123",\n  "role": "Backend Engineer",\n  "fitScore": 85\n}',
  },
  selectedEventId: "",
  fieldMappings: [],
  conditions: [],
  agentId: "",
  mode: "assist",
  ruleName: "",
  outputWebhookEnabled: false,
  outputWebhook: { url: "", payloadMapping: '{\n  "status": "processed"\n}' },
  outputNotification: false,
  isEnabled: true,
};

/* ── Constants ── */

const STEP_LABELS = ["Input Source", "Event Mapping", "Conditions", "Agent & Mode", "Outputs", "Review"];

const MAILBOXES = [
  { value: "hiring@company.com", label: "hiring@company.com" },
  { value: "recruiting@company.com", label: "recruiting@company.com" },
  { value: "resumes@company.com", label: "resumes@company.com" },
  { value: "jobs@company.com", label: "jobs@company.com" },
];

const SAMPLE_EMAIL_FIELDS = [
  "email.from", "email.subject", "email.body", "email.body.role",
  "email.body.candidate", "email.attachments", "email.date",
];

const SAMPLE_WEBHOOK_FIELDS = [
  "payload.candidateId", "payload.role", "payload.fitScore",
  "payload.source", "payload.stage", "payload.experience",
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const slideTransition = { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const };

/* ── Props ── */

interface AutomationWizardProps {
  open: boolean;
  onClose: () => void;
  onSave: (state: WizardState) => void;
}

/* ── Main Component ── */

export function AutomationWizard({ open, onClose, onSave }: AutomationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const update = useCallback(<K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const goNext = () => { setDirection(1); setCurrentStep((s) => Math.min(s + 1, 6)); };
  const goBack = () => { setDirection(-1); setCurrentStep((s) => Math.max(s - 1, 1)); };

  const selectedEvent = getEventById(state.selectedEventId);
  const selectedAgent = state.agentId ? getAgentById(state.agentId) : null;

  const availableAgents = useMemo(() => {
    if (!state.selectedEventId) return AGENTS.filter((a) => a.isEnabled);
    return AGENTS.filter((a) => a.isEnabled && a.allowedEvents.includes(state.selectedEventId));
  }, [state.selectedEventId]);

  const domainEvents = useMemo(() => EVENTS.filter((e) => e.layer === "domain" && e.isActive), []);

  // Validation per step
  const isStep1Valid = state.inputType === "event"
    ? true
    : state.inputType === "email"
      ? !!state.emailConfig.mailbox
      : !!state.webhookInputConfig.endpointUrl;

  const isStep2Valid = !!state.selectedEventId;
  const isStep3Valid = state.conditions.every((c) => c.value !== "");
  const isStep4Valid = !!state.agentId && !!state.ruleName.trim();
  const isStep5Valid = !state.outputWebhookEnabled || !!state.outputWebhook.url;

  const isCurrentStepValid = [false, isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid, isStep5Valid, true][currentStep];

  const handleSubmit = () => {
    onSave(state);
    setSubmitted(true);
  };

  const handleTest = () => {
    setTestResult(null);
    setTimeout(() => {
      setTestResult("Rule simulation successful — would match 3 candidates, agent would execute in " + state.mode + " mode.");
    }, 1500);
  };

  if (!open) return null;

  /* ════════════════════════════════════════
     Step Content Renderers
     ════════════════════════════════════════ */

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Select Input Source</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how this automation rule is triggered
        </p>
      </div>

      {/* Input type cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {([
          { key: "event" as InputType, icon: Zap, label: "System Event", desc: "Trigger from internal platform events" },
          { key: "email" as InputType, icon: Mail, label: "Email", desc: "Trigger when emails arrive at a mailbox" },
          { key: "webhook" as InputType, icon: Globe, label: "Webhook", desc: "Trigger via external API call" },
        ]).map((opt) => {
          const isSelected = state.inputType === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => update("inputType", opt.key)}
              className={`relative flex flex-col items-center p-5 rounded-xl border transition-all duration-150 cursor-pointer text-center ${
                isSelected
                  ? "border-brand bg-brand/[0.04] ring-1 ring-brand"
                  : "border-border hover:border-border hover:bg-secondary/20"
              }`}
            >
              <div className={`size-12 rounded-xl ${isSelected ? "bg-brand/10" : "bg-secondary/50"} flex items-center justify-center mb-3`}>
                <opt.icon className={`size-5 ${isSelected ? "text-brand" : "text-muted-foreground/40"}`} />
              </div>
              <span className="text-sm font-semibold text-foreground">{opt.label}</span>
              <p className="text-[11px] text-muted-foreground mt-1">{opt.desc}</p>
              {isSelected && <div className="absolute top-3 right-3 size-2 rounded-full bg-brand" />}
            </button>
          );
        })}
      </div>

      {/* Email config */}
      <AnimatePresence mode="wait">
        {state.inputType === "email" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="size-4 text-brand-purple" />
                Email Configuration
              </h3>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">Mailbox</label>
                <Select value={state.emailConfig.mailbox} onValueChange={(val) => update("emailConfig", { ...state.emailConfig, mailbox: val as string })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mailbox..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MAILBOXES.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">Allowed Senders (comma-separated)</label>
                <input
                  type="text"
                  value={state.emailConfig.allowedSenders}
                  onChange={(e) => update("emailConfig", { ...state.emailConfig, allowedSenders: e.target.value })}
                  placeholder="hr@partner.com, recruiter@agency.com"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">Subject Keywords (optional)</label>
                <input
                  type="text"
                  value={state.emailConfig.subjectKeywords}
                  onChange={(e) => update("emailConfig", { ...state.emailConfig, subjectKeywords: e.target.value })}
                  placeholder="application, resume, candidate"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand"
                />
              </div>
            </div>
          </motion.div>
        )}

        {state.inputType === "webhook" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Globe className="size-4 text-brand-teal" />
                Webhook Configuration
              </h3>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">Endpoint URL (auto-generated)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={state.webhookInputConfig.endpointUrl}
                    readOnly
                    className="flex-1 h-9 px-3 rounded-lg border border-border bg-secondary/30 text-sm text-muted-foreground font-mono outline-none"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard?.writeText(state.webhookInputConfig.endpointUrl)}
                    className="h-9 cursor-pointer"
                  >
                    <Copy className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">Auth Type</label>
                <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5 w-fit">
                  {(["api_key", "bearer", "none"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => update("webhookInputConfig", { ...state.webhookInputConfig, authType: t })}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        state.webhookInputConfig.authType === t ? "bg-brand/10 text-brand" : "text-muted-foreground/50"
                      }`}
                    >
                      {t === "api_key" ? "API Key" : t === "bearer" ? "Bearer" : "None"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">Sample Payload</label>
                <textarea
                  value={state.webhookInputConfig.samplePayload}
                  onChange={(e) => update("webhookInputConfig", { ...state.webhookInputConfig, samplePayload: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs text-foreground font-mono outline-none focus:border-brand resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderStep2 = () => {
    const sourceFields = state.inputType === "email" ? SAMPLE_EMAIL_FIELDS : state.inputType === "webhook" ? SAMPLE_WEBHOOK_FIELDS : [];
    const needsMapping = state.inputType !== "event";

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Map to Internal Event</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {needsMapping
              ? "Map external input fields to a platform event"
              : "Select which platform event triggers this rule"}
          </p>
        </div>

        {/* Event selection */}
        <div>
          <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
            Target Event
          </label>
          <Select value={state.selectedEventId} onValueChange={(val) => update("selectedEventId", val as string)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an event..." />
            </SelectTrigger>
            <SelectContent>
              {domainEvents.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name} ({categoryLabel(e.category)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedEvent && (
            <div className="mt-2 p-3 rounded-lg bg-secondary/30 border border-border/50">
              <p className="text-[11px] text-muted-foreground">{selectedEvent.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedEvent.payloadSchema.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-[9px] font-mono text-muted-foreground">
                    <Hash className="size-2.5" />{f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Field mapping (for email/webhook) */}
        {needsMapping && selectedEvent && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Field Mapping</h3>
              <button
                onClick={() => update("fieldMappings", [...state.fieldMappings, { sourceField: "", targetField: "" }])}
                className="flex items-center gap-1 text-[10px] text-brand hover:text-brand-teal transition-colors cursor-pointer font-medium"
              >
                <Plus className="size-3" />
                Add mapping
              </button>
            </div>

            {state.fieldMappings.length === 0 && (
              <p className="text-[11px] text-muted-foreground/40 italic py-2">
                No field mappings — add mappings to transform external data to event payload
              </p>
            )}

            {state.fieldMappings.map((mapping, i) => (
              <div key={i} className="flex items-center gap-2">
                <Select value={mapping.sourceField} onValueChange={(val) => {
                  const next = [...state.fieldMappings];
                  next[i] = { ...next[i], sourceField: val as string };
                  update("fieldMappings", next);
                }}>
                  <SelectTrigger size="sm" className="flex-1">
                    <SelectValue placeholder="Source field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceFields.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>

                <ArrowRight className="size-4 text-muted-foreground/30 shrink-0" />

                <Select value={mapping.targetField} onValueChange={(val) => {
                  const next = [...state.fieldMappings];
                  next[i] = { ...next[i], targetField: val as string };
                  update("fieldMappings", next);
                }}>
                  <SelectTrigger size="sm" className="flex-1">
                    <SelectValue placeholder="Target field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEvent.payloadSchema.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>

                <button
                  onClick={() => update("fieldMappings", state.fieldMappings.filter((_, j) => j !== i))}
                  className="size-8 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-colors cursor-pointer shrink-0"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Define Conditions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add conditions that must be met for this rule to execute (AND logic)
        </p>
      </div>

      {/* Conditions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            Conditions {state.conditions.length > 0 && `(${state.conditions.length})`}
          </span>
          <button
            onClick={() => update("conditions", [...state.conditions, { field: "fitScore", operator: ">" as ConditionOperator, value: "" }])}
            className="flex items-center gap-1 text-[10px] text-brand hover:text-brand-teal transition-colors cursor-pointer font-medium"
          >
            <Plus className="size-3" />
            Add condition
          </button>
        </div>

        {state.conditions.length === 0 && (
          <div className="p-6 rounded-xl border border-dashed border-border/50 text-center">
            <p className="text-xs text-muted-foreground/40">
              No conditions — rule triggers on every matching event
            </p>
            <button
              onClick={() => update("conditions", [{ field: "fitScore", operator: ">" as ConditionOperator, value: 75 }])}
              className="mt-3 text-[11px] text-brand hover:text-brand-teal transition-colors cursor-pointer font-medium"
            >
              + Add example: fitScore &gt; 75
            </button>
          </div>
        )}

        {state.conditions.map((cond, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-[9px] font-bold text-warning uppercase w-8 text-center shrink-0">
              {i === 0 ? "IF" : "AND"}
            </span>

            <Select value={cond.field} onValueChange={(val) => {
              const next = [...state.conditions];
              next[i] = { ...next[i], field: val as string };
              update("conditions", next);
            }}>
              <SelectTrigger className="flex-1 min-w-0">
                <SelectValue placeholder="Field..." />
              </SelectTrigger>
              <SelectContent>
                {CONDITION_FIELDS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={cond.operator} onValueChange={(val) => {
              const next = [...state.conditions];
              next[i] = { ...next[i], operator: val as ConditionOperator };
              update("conditions", next);
            }}>
              <SelectTrigger className="w-32 shrink-0">
                <SelectValue placeholder="Operator..." />
              </SelectTrigger>
              <SelectContent>
                {CONDITION_OPERATORS.map((op) => <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <input
              type="text"
              value={cond.value}
              onChange={(e) => {
                const next = [...state.conditions];
                const val = e.target.value;
                const numVal = Number(val);
                next[i] = { ...next[i], value: val === "" ? "" : isNaN(numVal) ? val : numVal };
                update("conditions", next);
              }}
              placeholder="Value"
              className="h-9 px-2 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand w-28 shrink-0"
            />

            <button
              onClick={() => update("conditions", state.conditions.filter((_, j) => j !== i))}
              className="size-9 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-colors cursor-pointer shrink-0"
            >
              <Trash2 className="size-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Select Agent & Mode</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose which AI agent executes and how it operates
        </p>
      </div>

      {/* Rule name */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
          Rule Name
        </label>
        <input
          type="text"
          value={state.ruleName}
          onChange={(e) => update("ruleName", e.target.value)}
          placeholder="e.g., High Fit Auto-Screen"
          className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
        />
      </div>

      {/* Agent selection */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
          Agent
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableAgents.map((agent) => {
            const isSelected = state.agentId === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => update("agentId", agent.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer text-left ${
                  isSelected
                    ? "border-brand bg-brand/[0.04] ring-1 ring-brand"
                    : "border-border hover:bg-secondary/20"
                }`}
              >
                <div className={`size-9 rounded-lg bg-gradient-to-br ${
                  agent.color === "purple" ? "from-brand-purple to-brand-purple/60" :
                  agent.color === "teal" ? "from-brand-teal to-brand-teal/60" :
                  agent.color === "blue" ? "from-brand to-brand/60" :
                  "from-warning to-warning/60"
                } flex items-center justify-center shrink-0`}>
                  <Bot className="size-4 text-white" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-foreground block">{agent.name}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">{agent.description}</span>
                </div>
                {isSelected && <div className="size-2 rounded-full bg-brand shrink-0 ml-auto" />}
              </button>
            );
          })}
        </div>
        {availableAgents.length === 0 && (
          <p className="text-[11px] text-warning italic py-2">
            No enabled agents available for the selected event
          </p>
        )}
      </div>

      {/* Mode selector */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
          Execution Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["auto", "assist", "manual"] as AgentMode[]).map((m) => {
            const isSelected = state.mode === m;
            return (
              <button
                key={m}
                onClick={() => update("mode", m)}
                className={`flex flex-col p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? `border-brand bg-brand/[0.04] ring-1 ring-brand`
                    : "border-border hover:bg-secondary/20"
                }`}
              >
                <span className={`text-sm font-semibold ${isSelected ? modeColor(m) : "text-foreground"}`}>
                  {modeLabel(m)}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {modeDescription(m)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Output Actions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Optionally send data to external systems after agent execution
        </p>
      </div>

      {/* Webhook output */}
      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="size-4 text-brand" />
            <span className="text-sm font-semibold text-foreground">Send Webhook</span>
          </div>
          <button
            onClick={() => update("outputWebhookEnabled", !state.outputWebhookEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer ${
              state.outputWebhookEnabled ? "bg-success" : "bg-secondary"
            }`}
          >
            <span className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              state.outputWebhookEnabled ? "translate-x-4.5" : "translate-x-1"
            }`} />
          </button>
        </div>

        <AnimatePresence>
          {state.outputWebhookEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden space-y-3"
            >
              <div>
                <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={state.outputWebhook.url}
                  onChange={(e) => update("outputWebhook", { ...state.outputWebhook, url: e.target.value })}
                  placeholder="https://external-system.com/webhook"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground font-mono placeholder:text-muted-foreground/40 outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
                  Payload Template (JSON)
                </label>
                <textarea
                  value={state.outputWebhook.payloadMapping}
                  onChange={(e) => update("outputWebhook", { ...state.outputWebhook, payloadMapping: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs text-foreground font-mono outline-none focus:border-brand resize-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notification output */}
      <div className="rounded-xl border border-border bg-card/50 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-warning" />
            <span className="text-sm font-semibold text-foreground">Send Notification</span>
          </div>
          <button
            onClick={() => update("outputNotification", !state.outputNotification)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer ${
              state.outputNotification ? "bg-success" : "bg-secondary"
            }`}
          >
            <span className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              state.outputNotification ? "translate-x-4.5" : "translate-x-1"
            }`} />
          </button>
        </div>
        {state.outputNotification && (
          <p className="text-[11px] text-muted-foreground mt-2">
            Slack and email notifications will be sent to the configured channels when this rule executes.
          </p>
        )}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Review & Create</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review your automation rule before saving
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        {/* Flow visualization */}
        <div className="space-y-3">
          {/* Input */}
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-brand-purple uppercase w-12 shrink-0">INPUT</span>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-purple/8 flex-1">
              {state.inputType === "event" && <Zap className="size-4 text-brand-purple" />}
              {state.inputType === "email" && <Mail className="size-4 text-brand-purple" />}
              {state.inputType === "webhook" && <Globe className="size-4 text-brand-purple" />}
              <span className="text-sm font-medium text-foreground capitalize">{state.inputType}</span>
              {state.inputType === "email" && state.emailConfig.mailbox && (
                <span className="text-xs text-muted-foreground ml-1">({state.emailConfig.mailbox})</span>
              )}
            </div>
          </div>

          {/* Event */}
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-brand uppercase w-12 shrink-0">EVENT</span>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand/8 flex-1">
              <Zap className="size-4 text-brand" />
              <span className="text-sm font-mono font-medium text-foreground">{selectedEvent?.name || "—"}</span>
            </div>
          </div>

          {/* Conditions */}
          {state.conditions.length > 0 && state.conditions.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[9px] font-bold text-warning uppercase w-12 shrink-0">{i === 0 ? "WHERE" : "AND"}</span>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/8 flex-1">
                <span className="text-sm text-foreground">
                  {CONDITION_FIELDS.find((f) => f.value === c.field)?.label} {c.operator} <span className="font-mono font-semibold">{c.value}</span>
                </span>
              </div>
            </div>
          ))}

          {/* Agent */}
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-success uppercase w-12 shrink-0">AGENT</span>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/8 flex-1">
              <Bot className="size-4 text-success" />
              <span className="text-sm font-medium text-foreground">{selectedAgent?.name || "—"}</span>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${modeBgColor(state.mode)} ${modeColor(state.mode)} ml-auto`}>
                {modeLabel(state.mode)}
              </span>
            </div>
          </div>

          {/* Outputs */}
          {(state.outputWebhookEnabled || state.outputNotification) && (
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold text-brand-teal uppercase w-12 shrink-0">OUTPUT</span>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-teal/8 flex-1 flex-wrap">
                {state.outputWebhookEnabled && (
                  <span className="inline-flex items-center gap-1 text-sm text-foreground">
                    <Send className="size-3.5 text-brand-teal" /> Webhook
                  </span>
                )}
                {state.outputNotification && (
                  <span className="inline-flex items-center gap-1 text-sm text-foreground">
                    <Bell className="size-3.5 text-warning" /> Notification
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Rule name */}
        <div className="border-t border-border/50 pt-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Rule Name</span>
            <p className="text-sm font-semibold text-foreground">{state.ruleName || "—"}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground/60">Status</span>
            <span className="text-xs font-semibold text-success">Enabled</span>
          </div>
        </div>
      </div>

      {/* Test button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleTest}
          variant="outline"
          className="gap-2 cursor-pointer"
        >
          <Play className="size-3.5" />
          Test Rule
        </Button>
        {testResult && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 p-3 rounded-lg bg-brand-purple/[0.04] border border-brand-purple/20 text-xs text-brand-purple"
          >
            <Sparkles className="size-3 inline mr-1.5" />
            {testResult}
          </motion.div>
        )}
      </div>
    </div>
  );

  const stepContent = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6];

  /* ════════════════════════════════════════
     Render
     ════════════════════════════════════════ */

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Wizard panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border z-50 flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 px-6 pt-5 pb-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-teal flex items-center justify-center">
                <Sparkles className="size-4 text-white" />
              </div>
              <h2 className="text-base font-semibold text-foreground">
                {submitted ? "Rule Created" : "Create Automation Rule"}
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
              <X className="size-4" />
            </Button>
          </div>

          {/* Stepper */}
          {!submitted && (
            <div className="flex items-center justify-between">
              {STEP_LABELS.map((label, idx) => {
                const step = idx + 1;
                const completed = step < currentStep;
                const current = step === currentStep;
                return (
                  <div key={label} className="flex items-center flex-1 last:flex-initial">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          if (step < currentStep) {
                            setDirection(-1);
                            setCurrentStep(step);
                          }
                        }}
                        className={`size-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                          completed
                            ? "bg-success text-white cursor-pointer"
                            : current
                              ? "bg-brand-purple text-white"
                              : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {completed ? <Check className="size-3.5" /> : step}
                      </button>
                      <span className="text-[9px] text-muted-foreground mt-1 whitespace-nowrap hidden sm:block">{label}</span>
                    </div>
                    {idx < STEP_LABELS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1.5 rounded-full ${step < currentStep ? "bg-success" : "bg-secondary"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 relative">
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="size-16 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                <Check className="size-8 text-success" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Rule Created Successfully</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                &ldquo;{state.ruleName}&rdquo; is now active. The {selectedAgent?.name} will execute in {modeLabel(state.mode)} mode when {selectedEvent?.name} is triggered.
              </p>
              <Button onClick={onClose} className="mt-6 bg-brand hover:bg-brand/90 text-white cursor-pointer">
                Done
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
              >
                {stepContent[currentStep - 1]()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="border-t border-border px-6 py-3 flex items-center gap-2 shrink-0">
            {currentStep > 1 && (
              <Button variant="outline" onClick={goBack} className="gap-1.5 cursor-pointer">
                <ChevronLeft className="size-3.5" />
                Back
              </Button>
            )}
            <div className="flex-1" />
            {currentStep < 6 ? (
              <Button
                onClick={goNext}
                disabled={!isCurrentStepValid}
                className="bg-brand hover:bg-brand/90 text-white gap-1.5 cursor-pointer disabled:opacity-40"
              >
                Continue
                <ChevronRight className="size-3.5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStep4Valid}
                className="bg-success hover:bg-success/90 text-white gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Check className="size-3.5" />
                Create Rule
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}
