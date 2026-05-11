/* ================================================================
   Reusable Agent Tower — shared types
   ================================================================
   Every module (Leave, Delivery, Talent, Finance, …) builds its own
   AgentRegistry on top of these types. The store + shell components
   then render against the registry uniformly.
   ================================================================ */

import type { ModuleKey } from "@/components/admin/data";

export type AgentAutonomy = "off" | "suggest" | "act_with_confirm" | "autonomous";

export const AUTONOMY_LABEL: Record<AgentAutonomy, string> = {
  off: "Off",
  suggest: "Suggest only",
  act_with_confirm: "Act with confirm",
  autonomous: "Autonomous",
};

export const AUTONOMY_DESCRIPTION: Record<AgentAutonomy, string> = {
  off: "Don't run this agent.",
  suggest: "Surface recommendations; never execute.",
  act_with_confirm: "Propose and ask a human to confirm before each action.",
  autonomous: "Act on low-risk tasks without prompting. Audit log records each call.",
};

/** What kicks the agent off. */
export type TriggerKind =
  | "continuous"
  | "scheduled"
  | "on_event"
  | "on_demand";

export const TRIGGER_LABEL: Record<TriggerKind, string> = {
  continuous: "Continuous",
  scheduled: "Scheduled",
  on_event: "On event",
  on_demand: "On demand",
};

export type AgentTone =
  | "brand"
  | "brand-purple"
  | "brand-teal"
  | "success"
  | "warning"
  | "destructive";

export const TONE_TINT: Record<AgentTone, string> = {
  "brand":         "bg-brand/10 text-brand",
  "brand-purple":  "bg-brand-purple/10 text-brand-purple",
  "brand-teal":    "bg-brand-teal/10 text-brand-teal",
  "success":       "bg-success/10 text-success",
  "warning":       "bg-warning/10 text-warning",
  "destructive":   "bg-destructive/10 text-destructive",
};

export interface AgentKpi {
  /** Short metric label. */
  label: string;
  /** Display value (already formatted, e.g. "+18% accuracy"). */
  value: string;
  /** Optional helper line. */
  hint?: string;
  /** Whether the change is positive, negative, or neutral. */
  trend: "up" | "down" | "neutral";
}

export interface AgentScope {
  /** Free-form scope labels (e.g. "all_projects", "manager-led", "EU only"). */
  cohorts: string[];
}

export interface AgentSpec {
  id: string;
  name: string;
  /** One-line purpose, surfaced on the tower card. */
  purpose: string;
  /** Longer description for the detail page. */
  description: string;
  /** What triggers this agent. */
  trigger: TriggerKind;
  /** Optional trigger detail (e.g. "Every Friday 17:00 IST"). */
  triggerDetail?: string;
  defaultStatus: boolean;
  defaultAutonomy: AgentAutonomy;
  defaultScope: AgentScope;
  tone: AgentTone;
  /** Lucide icon name; the shell resolves it. */
  iconName: string;
  /** Last 7-day per-day decision counts. */
  activity7d: number[];
  /** Accuracy 0–1 over last 30d. */
  accuracy30d: number;
  /** Override rate 0–1 over last 30d. */
  overrideRate30d: number;
  /** KPI(s) the agent optimises for. */
  kpis: AgentKpi[];
  /** Up to 3 recent action one-liners (most recent first). */
  recentActions: { id: string; when: string; text: string }[];
  /** Optional list of permissions the agent needs. */
  requiredPermissions?: string[];
}

export type AgentDecisionOutcome =
  | "executed"
  | "suggested"
  | "overridden"
  | "rejected"
  | "pending_review";

export const OUTCOME_TINT: Record<AgentDecisionOutcome, string> = {
  executed:       "bg-success/10 text-success",
  suggested:      "bg-brand/10 text-brand",
  overridden:     "bg-warning/10 text-warning",
  rejected:       "bg-destructive/10 text-destructive",
  pending_review: "bg-secondary text-muted-foreground",
};

export const OUTCOME_LABEL: Record<AgentDecisionOutcome, string> = {
  executed:       "Executed",
  suggested:      "Suggested",
  overridden:     "Overridden",
  rejected:       "Rejected",
  pending_review: "Awaiting review",
};

export interface AgentDecision {
  id: string;
  agentId: string;
  whenISO: string;
  whenLabel: string;
  summary: string;
  outcome: AgentDecisionOutcome;
  /** 0–100. */
  confidence: number;
  /** Optional record id this decision relates to (project id, task id, …). */
  recordId?: string;
  /** Optional record label for display. */
  recordLabel?: string;
}

export interface TraceTool {
  id: string;
  name: string;
  whenLabel: string;
  summary: string;
  kind:
    | "policy_lookup"
    | "data_fetch"
    | "model_call"
    | "agent_call"
    | "external_api"
    | "calc";
  result: string;
}

export interface DecisionTrace {
  decisionId: string;
  input: { label: string; value: string }[];
  tools: TraceTool[];
  policyRules: { id: string; label: string; outcome: "pass" | "warn" | "fail" }[];
  reasoning: string[];
  output: Record<string, unknown>;
}

/**
 * One module's registry. The store reads from this; pages reference it by module key.
 */
export interface AgentRegistry {
  module: ModuleKey;
  agents: AgentSpec[];
  decisions: AgentDecision[];
  traces: Record<string, DecisionTrace>;
}
