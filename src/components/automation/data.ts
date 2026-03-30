/* ================================================================
   Agent Automation Control Plane — Types, Mock Data & Helpers
   Event-Driven AI Platform with Extensible Integrations
   ================================================================ */

/* ── Core Types ── */

export type EventCategory =
  | "candidate"
  | "requisition"
  | "interview"
  | "decision"
  | "system";

export type EventLayer = "domain" | "system" | "integration";

export type EventSource = "system" | "agent" | "user" | "external";

export interface SystemEvent {
  id: string;
  name: string;
  category: EventCategory;
  layer: EventLayer;
  version: string;
  source: EventSource;
  description: string;
  isActive: boolean;
  payloadSchema: string[];
}

export type AgentMode = "auto" | "assist" | "manual";

export interface Agent {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  defaultMode: AgentMode;
  allowedEvents: string[];
  color: "purple" | "teal" | "blue" | "warning";
}

export type ConditionOperator = ">" | "<" | "=" | ">=" | "<=" | "!=" | "contains";

export interface RuleCondition {
  field: string;
  operator: ConditionOperator;
  value: string | number;
}

export type RuleActionType = "trigger_agent" | "send_webhook" | "both";

export interface TriggerRule {
  id: string;
  name: string;
  event: string;
  conditions: RuleCondition[];
  actionType: RuleActionType;
  agentId: string | null;
  webhookId: string | null;
  mode: AgentMode;
  isEnabled: boolean;
  priority: number;
  createdAt: string;
  lastTriggered: string | null;
  triggerCount: number;
}

export type RunStatus = "success" | "failed" | "running" | "skipped";

export interface AgentRun {
  id: string;
  agentId: string;
  triggeredByEvent: string;
  ruleId: string;
  ruleName: string;
  status: RunStatus;
  timestamp: string;
  duration: string;
  details: string;
  webhookSent?: boolean;
}

/* ── Webhook / Integration Types ── */

export type WebhookStatus = "active" | "paused" | "error";

export interface WebhookSubscription {
  id: string;
  name: string;
  url: string;
  secret: string;
  subscribedEvents: string[];
  status: WebhookStatus;
  retryPolicy: "none" | "linear" | "exponential";
  maxRetries: number;
  createdAt: string;
  lastDelivery: string | null;
  successRate: number;
  totalDeliveries: number;
}

export type WebhookDeliveryStatus = "delivered" | "failed" | "retrying" | "pending";

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  webhookName: string;
  event: string;
  status: WebhookDeliveryStatus;
  statusCode: number | null;
  timestamp: string;
  duration: string;
  attempt: number;
  payload: string;
  response: string;
}

/* ── Tab Types ── */

export type AutomationTab =
  | "events"
  | "agents"
  | "rules"
  | "webhooks"
  | "logs"
  | "controls";

export const AUTOMATION_TABS: { key: AutomationTab; label: string }[] = [
  { key: "events", label: "Event Catalog" },
  { key: "agents", label: "Agent Registry" },
  { key: "rules", label: "Trigger Rules" },
  { key: "webhooks", label: "Webhooks" },
  { key: "logs", label: "Execution Logs" },
  { key: "controls", label: "Global Controls" },
];

/* ══════════════════════════════════════════════
   Helper Functions
   ══════════════════════════════════════════════ */

export function categoryLabel(cat: EventCategory): string {
  switch (cat) {
    case "candidate": return "Candidate";
    case "requisition": return "Requisition";
    case "interview": return "Interview";
    case "decision": return "Decision";
    case "system": return "System";
  }
}

export function categoryColor(cat: EventCategory): string {
  switch (cat) {
    case "candidate": return "text-brand-purple";
    case "requisition": return "text-brand";
    case "interview": return "text-brand-teal";
    case "decision": return "text-warning";
    case "system": return "text-muted-foreground";
  }
}

export function categoryBgColor(cat: EventCategory): string {
  switch (cat) {
    case "candidate": return "bg-brand-purple/10";
    case "requisition": return "bg-brand/10";
    case "interview": return "bg-brand-teal/10";
    case "decision": return "bg-warning/10";
    case "system": return "bg-secondary";
  }
}

export function layerLabel(layer: EventLayer): string {
  switch (layer) {
    case "domain": return "Domain";
    case "system": return "System";
    case "integration": return "Integration";
  }
}

export function layerColor(layer: EventLayer): string {
  switch (layer) {
    case "domain": return "text-brand-purple";
    case "system": return "text-brand-teal";
    case "integration": return "text-brand";
  }
}

export function layerBgColor(layer: EventLayer): string {
  switch (layer) {
    case "domain": return "bg-brand-purple/10";
    case "system": return "bg-brand-teal/10";
    case "integration": return "bg-brand/10";
  }
}

export function layerDescription(layer: EventLayer): string {
  switch (layer) {
    case "domain": return "Business-level events visible to admins. Human-understandable lifecycle events.";
    case "system": return "Fine-grained internal signals for agent chaining, scoring, and debugging.";
    case "integration": return "Publishable, versioned events for webhooks and external system integrations.";
  }
}

export function sourceLabel(source: EventSource): string {
  switch (source) {
    case "system": return "System";
    case "agent": return "Agent";
    case "user": return "User";
    case "external": return "External";
  }
}

export function modeColor(mode: AgentMode): string {
  switch (mode) {
    case "auto": return "text-success";
    case "assist": return "text-warning";
    case "manual": return "text-muted-foreground";
  }
}

export function modeBgColor(mode: AgentMode): string {
  switch (mode) {
    case "auto": return "bg-success/10";
    case "assist": return "bg-warning/10";
    case "manual": return "bg-secondary";
  }
}

export function modeLabel(mode: AgentMode): string {
  switch (mode) {
    case "auto": return "Auto";
    case "assist": return "Assist";
    case "manual": return "Manual";
  }
}

export function modeDescription(mode: AgentMode): string {
  switch (mode) {
    case "auto": return "Executes without human approval";
    case "assist": return "Prepares action, requires human approval";
    case "manual": return "Human must manually trigger";
  }
}

export function runStatusColor(status: RunStatus): string {
  switch (status) {
    case "success": return "text-success";
    case "failed": return "text-destructive";
    case "running": return "text-brand";
    case "skipped": return "text-muted-foreground";
  }
}

export function runStatusBgColor(status: RunStatus): string {
  switch (status) {
    case "success": return "bg-success/10";
    case "failed": return "bg-destructive/10";
    case "running": return "bg-brand/10";
    case "skipped": return "bg-secondary";
  }
}

export function runStatusLabel(status: RunStatus): string {
  switch (status) {
    case "success": return "Success";
    case "failed": return "Failed";
    case "running": return "Running";
    case "skipped": return "Skipped";
  }
}

export function agentColorGradient(color: Agent["color"]): string {
  switch (color) {
    case "purple": return "from-brand-purple to-brand-purple/60";
    case "teal": return "from-brand-teal to-brand-teal/60";
    case "blue": return "from-brand to-brand/60";
    case "warning": return "from-warning to-warning/60";
  }
}

export function webhookStatusColor(status: WebhookStatus): string {
  switch (status) {
    case "active": return "text-success";
    case "paused": return "text-warning";
    case "error": return "text-destructive";
  }
}

export function webhookStatusBgColor(status: WebhookStatus): string {
  switch (status) {
    case "active": return "bg-success/10";
    case "paused": return "bg-warning/10";
    case "error": return "bg-destructive/10";
  }
}

export function deliveryStatusColor(status: WebhookDeliveryStatus): string {
  switch (status) {
    case "delivered": return "text-success";
    case "failed": return "text-destructive";
    case "retrying": return "text-warning";
    case "pending": return "text-brand";
  }
}

export function deliveryStatusBgColor(status: WebhookDeliveryStatus): string {
  switch (status) {
    case "delivered": return "bg-success/10";
    case "failed": return "bg-destructive/10";
    case "retrying": return "bg-warning/10";
    case "pending": return "bg-brand/10";
  }
}

export function deliveryStatusLabel(status: WebhookDeliveryStatus): string {
  switch (status) {
    case "delivered": return "Delivered";
    case "failed": return "Failed";
    case "retrying": return "Retrying";
    case "pending": return "Pending";
  }
}

export function actionTypeLabel(type: RuleActionType): string {
  switch (type) {
    case "trigger_agent": return "Agent Only";
    case "send_webhook": return "Webhook Only";
    case "both": return "Agent + Webhook";
  }
}

export function getEventById(id: string): SystemEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

export function getWebhookById(id: string): WebhookSubscription | undefined {
  return WEBHOOKS.find((w) => w.id === id);
}

export const CONDITION_FIELDS = [
  { value: "fitScore", label: "Fit Score" },
  { value: "experience", label: "Years of Experience" },
  { value: "salary", label: "Salary Expectation" },
  { value: "urgency", label: "Urgency Level" },
  { value: "panelScore", label: "Panel Score" },
  { value: "source", label: "Source" },
  { value: "stage", label: "Pipeline Stage" },
  { value: "daysSinceApplied", label: "Days Since Applied" },
  { value: "interviewCount", label: "Interview Count" },
  { value: "referralFlag", label: "Is Referral" },
  { value: "riskScore", label: "Risk Score" },
  { value: "sentimentScore", label: "Sentiment Score" },
];

export const CONDITION_OPERATORS: { value: ConditionOperator; label: string }[] = [
  { value: ">", label: "greater than" },
  { value: "<", label: "less than" },
  { value: "=", label: "equals" },
  { value: ">=", label: "greater or equal" },
  { value: "<=", label: "less or equal" },
  { value: "!=", label: "not equal" },
  { value: "contains", label: "contains" },
];

/* ══════════════════════════════════════════════
   Layer 1: Domain Events (Business Meaning)
   Human-understandable lifecycle events
   ══════════════════════════════════════════════ */

const DOMAIN_EVENTS: SystemEvent[] = [
  // Candidate Lifecycle
  { id: "evt-candidate-created", name: "Candidate.Created", category: "candidate", layer: "domain", version: "v1", source: "system", description: "A new candidate profile is created in the system", isActive: true, payloadSchema: ["candidateId", "source", "requisitionId"] },
  { id: "evt-candidate-enriched", name: "Candidate.Profile.Enriched", category: "candidate", layer: "domain", version: "v1", source: "agent", description: "Candidate profile has been enriched with additional data from external sources", isActive: true, payloadSchema: ["candidateId", "enrichedFields", "source"] },
  { id: "evt-candidate-matched", name: "Candidate.MatchedToRequisition", category: "candidate", layer: "domain", version: "v1", source: "agent", description: "Candidate is matched to an open requisition based on fit analysis", isActive: true, payloadSchema: ["candidateId", "requisitionId", "fitScore"] },
  { id: "evt-candidate-shortlisted", name: "Candidate.Shortlisted", category: "candidate", layer: "domain", version: "v1", source: "user", description: "Candidate is added to the shortlist for a specific role", isActive: true, payloadSchema: ["candidateId", "requisitionId", "shortlistedBy"] },
  { id: "evt-candidate-advanced", name: "Candidate.AdvancedStage", category: "candidate", layer: "domain", version: "v1", source: "user", description: "Candidate moves to the next pipeline stage", isActive: true, payloadSchema: ["candidateId", "fromStage", "toStage"] },
  { id: "evt-candidate-rejected", name: "Candidate.Rejected", category: "candidate", layer: "domain", version: "v1", source: "user", description: "Candidate is rejected at any stage of the pipeline", isActive: true, payloadSchema: ["candidateId", "stage", "reason", "rejectedBy"] },
  { id: "evt-candidate-offer-extended", name: "Candidate.OfferExtended", category: "candidate", layer: "domain", version: "v1", source: "user", description: "An offer letter is generated and sent to the candidate", isActive: true, payloadSchema: ["candidateId", "offerId", "compensation"] },
  { id: "evt-candidate-offer-accepted", name: "Candidate.OfferAccepted", category: "candidate", layer: "domain", version: "v1", source: "user", description: "Candidate accepts the offer and is marked for onboarding", isActive: true, payloadSchema: ["candidateId", "offerId", "startDate"] },
  { id: "evt-candidate-droppedoff", name: "Candidate.DroppedOff", category: "candidate", layer: "domain", version: "v1", source: "system", description: "Candidate becomes unresponsive or withdraws from the process", isActive: true, payloadSchema: ["candidateId", "lastStage", "daysSilent"] },

  // Requisition Lifecycle
  { id: "evt-req-created", name: "Requisition.Created", category: "requisition", layer: "domain", version: "v1", source: "user", description: "A new job requisition is created with position details", isActive: true, payloadSchema: ["requisitionId", "title", "department", "headcount"] },
  { id: "evt-req-approved", name: "Requisition.Approved", category: "requisition", layer: "domain", version: "v1", source: "user", description: "Requisition receives all required approvals and is ready for sourcing", isActive: true, payloadSchema: ["requisitionId", "approvedBy", "budget"] },
  { id: "evt-req-published", name: "Requisition.Published", category: "requisition", layer: "domain", version: "v1", source: "system", description: "Requisition is published to job boards and career page", isActive: true, payloadSchema: ["requisitionId", "channels", "publishedAt"] },
  { id: "evt-req-onhold", name: "Requisition.OnHold", category: "requisition", layer: "domain", version: "v1", source: "user", description: "Requisition is temporarily paused due to budget or strategy changes", isActive: true, payloadSchema: ["requisitionId", "reason", "pausedBy"] },
  { id: "evt-req-closed", name: "Requisition.Closed", category: "requisition", layer: "domain", version: "v1", source: "system", description: "Requisition is closed — all positions filled or cancelled", isActive: true, payloadSchema: ["requisitionId", "reason", "filledCount"] },

  // Interview Lifecycle
  { id: "evt-interview-scheduled", name: "Interview.Scheduled", category: "interview", layer: "domain", version: "v1", source: "agent", description: "An interview slot is confirmed for candidate and panel", isActive: true, payloadSchema: ["interviewId", "candidateId", "panelIds", "scheduledAt"] },
  { id: "evt-interview-rescheduled", name: "Interview.Rescheduled", category: "interview", layer: "domain", version: "v1", source: "user", description: "A previously scheduled interview is moved to a new time", isActive: true, payloadSchema: ["interviewId", "oldTime", "newTime", "reason"] },
  { id: "evt-interview-completed", name: "Interview.Completed", category: "interview", layer: "domain", version: "v1", source: "system", description: "Interview session has ended and is awaiting feedback", isActive: true, payloadSchema: ["interviewId", "candidateId", "duration"] },
  { id: "evt-interview-feedback", name: "Interview.Feedback.Submitted", category: "interview", layer: "domain", version: "v1", source: "user", description: "An interviewer submits their scorecard and notes", isActive: true, payloadSchema: ["interviewId", "interviewerId", "score", "recommendation"] },
  { id: "evt-interview-conflict", name: "Interview.PanelConflictDetected", category: "interview", layer: "domain", version: "v1", source: "agent", description: "A scheduling conflict is detected among panel members", isActive: true, payloadSchema: ["interviewId", "conflictingPanelIds", "suggestedSlots"] },

  // Decision Lifecycle
  { id: "evt-decision-created", name: "Decision.Created", category: "decision", layer: "domain", version: "v1", source: "agent", description: "A new hiring decision is generated from interview data", isActive: true, payloadSchema: ["decisionId", "candidateId", "requisitionId"] },
  { id: "evt-decision-pending", name: "Decision.Pending", category: "decision", layer: "domain", version: "v1", source: "system", description: "Decision is queued in the Command Center for human review", isActive: true, payloadSchema: ["decisionId", "urgency", "recommendation"] },
  { id: "evt-decision-approved", name: "Decision.Approved", category: "decision", layer: "domain", version: "v1", source: "user", description: "Hiring decision is approved by the decision maker", isActive: true, payloadSchema: ["decisionId", "approvedBy", "notes"] },
  { id: "evt-decision-rejected", name: "Decision.Rejected", category: "decision", layer: "domain", version: "v1", source: "user", description: "Hiring decision is rejected with reasons", isActive: true, payloadSchema: ["decisionId", "rejectedBy", "reason"] },
  { id: "evt-decision-escalated", name: "Decision.Escalated", category: "decision", layer: "domain", version: "v1", source: "user", description: "Decision is escalated to a higher authority for review", isActive: true, payloadSchema: ["decisionId", "escalatedTo", "reason"] },

  // System Signals
  { id: "evt-sla-breached", name: "SLA.Breached", category: "system", layer: "domain", version: "v1", source: "system", description: "An SLA metric has been breached for a requisition or process", isActive: true, payloadSchema: ["entityId", "entityType", "slaType", "breachedAt"] },
  { id: "evt-candidate-inactive", name: "Candidate.Inactive", category: "system", layer: "domain", version: "v1", source: "system", description: "Candidate has been inactive beyond the configured threshold", isActive: true, payloadSchema: ["candidateId", "lastActivityAt", "daysSilent"] },
  { id: "evt-pipeline-stalled", name: "Pipeline.Stalled", category: "system", layer: "domain", version: "v1", source: "system", description: "A requisition pipeline has no movement for an extended period", isActive: true, payloadSchema: ["requisitionId", "stalledSince", "candidateCount"] },
  { id: "evt-high-dropoff", name: "HighDropoff.Detected", category: "system", layer: "domain", version: "v1", source: "agent", description: "Unusually high candidate dropoff rate detected at a specific stage", isActive: true, payloadSchema: ["requisitionId", "stage", "dropoffRate", "benchmark"] },
];

/* ══════════════════════════════════════════════
   Layer 2: System Events (Fine-Grained Signals)
   Internal signals for agent chaining & debugging
   ══════════════════════════════════════════════ */

const SYSTEM_EVENTS: SystemEvent[] = [
  // Candidate Deep Signals
  { id: "evt-score-updated", name: "Candidate.Score.Updated", category: "candidate", layer: "system", version: "v1", source: "agent", description: "Candidate composite score recalculated after new data", isActive: true, payloadSchema: ["candidateId", "oldScore", "newScore", "trigger"] },
  { id: "evt-fitscore-calculated", name: "Candidate.FitScore.Calculated", category: "candidate", layer: "system", version: "v1", source: "agent", description: "Initial fit score generated from resume and requirements analysis", isActive: true, payloadSchema: ["candidateId", "requisitionId", "fitScore", "breakdown"] },
  { id: "evt-riskscore-updated", name: "Candidate.RiskScore.Updated", category: "candidate", layer: "system", version: "v1", source: "agent", description: "Candidate risk assessment updated based on new signals", isActive: true, payloadSchema: ["candidateId", "riskScore", "riskFactors"] },
  { id: "evt-embedding-generated", name: "Candidate.Embedding.Generated", category: "candidate", layer: "system", version: "v1", source: "agent", description: "Vector embedding created for semantic matching", isActive: true, payloadSchema: ["candidateId", "embeddingModel", "dimensions"] },
  { id: "evt-source-identified", name: "Candidate.Source.Identified", category: "candidate", layer: "system", version: "v1", source: "agent", description: "Candidate sourcing channel identified and attributed", isActive: true, payloadSchema: ["candidateId", "source", "channel", "campaign"] },

  // Interview Signals
  { id: "evt-sentiment-analysed", name: "Interview.Sentiment.Analysed", category: "interview", layer: "system", version: "v1", source: "agent", description: "Sentiment analysis completed on interview recording", isActive: true, payloadSchema: ["interviewId", "sentimentScore", "highlights", "concerns"] },
  { id: "evt-transcript-generated", name: "Interview.Transcript.Generated", category: "interview", layer: "system", version: "v1", source: "agent", description: "Interview recording transcribed and processed", isActive: true, payloadSchema: ["interviewId", "wordCount", "speakerSegments"] },
  { id: "evt-score-normalized", name: "Interview.Score.Normalized", category: "interview", layer: "system", version: "v1", source: "agent", description: "Raw interview scores normalized across panel members", isActive: false, payloadSchema: ["interviewId", "rawScores", "normalizedScore"] },

  // Agent Signals
  { id: "evt-agent-started", name: "Agent.Run.Started", category: "system", layer: "system", version: "v1", source: "system", description: "An AI agent begins execution of a triggered rule", isActive: true, payloadSchema: ["runId", "agentId", "ruleId", "eventId"] },
  { id: "evt-agent-completed", name: "Agent.Run.Completed", category: "system", layer: "system", version: "v1", source: "system", description: "Agent execution finished successfully", isActive: true, payloadSchema: ["runId", "agentId", "duration", "output"] },
  { id: "evt-agent-failed", name: "Agent.Run.Failed", category: "system", layer: "system", version: "v1", source: "system", description: "Agent execution encountered an error", isActive: true, payloadSchema: ["runId", "agentId", "error", "stackTrace"] },
  { id: "evt-agent-output", name: "Agent.Output.Generated", category: "system", layer: "system", version: "v1", source: "agent", description: "Agent produced an output artifact (report, score, recommendation)", isActive: true, payloadSchema: ["runId", "agentId", "outputType", "outputRef"] },
];

/* ══════════════════════════════════════════════
   Layer 3: Integration Events (External Facing)
   Publishable, versioned, webhook-friendly events
   ══════════════════════════════════════════════ */

const INTEGRATION_EVENTS: SystemEvent[] = [
  { id: "int-candidate-created", name: "candidate.created", category: "candidate", layer: "integration", version: "v1", source: "system", description: "Publishable event when a candidate is created — webhook-ready", isActive: true, payloadSchema: ["id", "name", "email", "source", "createdAt"] },
  { id: "int-candidate-shortlisted", name: "candidate.shortlisted", category: "candidate", layer: "integration", version: "v1", source: "system", description: "Publishable event when a candidate is shortlisted", isActive: true, payloadSchema: ["id", "requisitionId", "fitScore", "shortlistedAt"] },
  { id: "int-candidate-rejected", name: "candidate.rejected", category: "candidate", layer: "integration", version: "v1", source: "system", description: "Publishable event when a candidate is rejected", isActive: true, payloadSchema: ["id", "stage", "reason", "rejectedAt"] },
  { id: "int-offer-extended", name: "offer.extended", category: "candidate", layer: "integration", version: "v1", source: "system", description: "Publishable event when an offer is extended", isActive: true, payloadSchema: ["candidateId", "offerId", "compensation", "extendedAt"] },
  { id: "int-offer-accepted", name: "offer.accepted", category: "candidate", layer: "integration", version: "v1", source: "system", description: "Publishable event when an offer is accepted", isActive: true, payloadSchema: ["candidateId", "offerId", "startDate", "acceptedAt"] },
  { id: "int-interview-completed", name: "interview.completed", category: "interview", layer: "integration", version: "v1", source: "system", description: "Publishable event when an interview is completed", isActive: true, payloadSchema: ["interviewId", "candidateId", "type", "completedAt"] },
  { id: "int-decision-approved", name: "decision.approved", category: "decision", layer: "integration", version: "v1", source: "system", description: "Publishable event when a hiring decision is approved", isActive: true, payloadSchema: ["decisionId", "candidateId", "approvedBy", "approvedAt"] },
  { id: "int-requisition-published", name: "requisition.published", category: "requisition", layer: "integration", version: "v1", source: "system", description: "Publishable event when a requisition goes live", isActive: true, payloadSchema: ["requisitionId", "title", "department", "publishedAt"] },
  { id: "int-requisition-closed", name: "requisition.closed", category: "requisition", layer: "integration", version: "v1", source: "system", description: "Publishable event when a requisition is closed", isActive: true, payloadSchema: ["requisitionId", "reason", "filledCount", "closedAt"] },
];

/* ── Combined Events ── */

export const EVENTS: SystemEvent[] = [
  ...DOMAIN_EVENTS,
  ...SYSTEM_EVENTS,
  ...INTEGRATION_EVENTS,
];

/* ── Mock Data: Agents ── */

export const AGENTS: Agent[] = [
  {
    id: "agent-sourcing",
    name: "Sourcing Agent",
    description: "Discovers and engages passive candidates through multiple channels. Handles outreach, follow-ups, and talent pool enrichment.",
    isEnabled: true,
    defaultMode: "auto",
    allowedEvents: ["evt-req-approved", "evt-req-created", "evt-sla-breached", "evt-candidate-droppedoff", "evt-pipeline-stalled"],
    color: "purple",
  },
  {
    id: "agent-screening",
    name: "Screening Agent",
    description: "Reviews applications, parses resumes, and generates fit scores. Applies screening criteria and produces shortlists.",
    isEnabled: true,
    defaultMode: "auto",
    allowedEvents: ["evt-candidate-created", "evt-candidate-shortlisted", "evt-req-approved", "evt-fitscore-calculated"],
    color: "teal",
  },
  {
    id: "agent-interview",
    name: "Interview Agent",
    description: "Manages interview scheduling, sends reminders, coordinates panel availability, and compiles feedback.",
    isEnabled: true,
    defaultMode: "assist",
    allowedEvents: ["evt-candidate-shortlisted", "evt-candidate-advanced", "evt-interview-completed", "evt-interview-feedback", "evt-interview-conflict"],
    color: "blue",
  },
  {
    id: "agent-scoring",
    name: "Scoring Agent",
    description: "Generates composite candidate scores from interview feedback, resume analysis, and cultural fit indicators.",
    isEnabled: true,
    defaultMode: "auto",
    allowedEvents: ["evt-interview-completed", "evt-interview-feedback", "evt-candidate-advanced", "evt-sentiment-analysed", "evt-transcript-generated"],
    color: "purple",
  },
  {
    id: "agent-compliance",
    name: "Compliance Agent",
    description: "Audits hiring processes for regulatory compliance, ensures equal opportunity adherence, and manages background checks.",
    isEnabled: true,
    defaultMode: "auto",
    allowedEvents: ["evt-candidate-offer-extended", "evt-candidate-offer-accepted", "evt-req-created", "evt-agent-failed", "evt-sla-breached"],
    color: "warning",
  },
  {
    id: "agent-outreach",
    name: "Outreach Agent",
    description: "Sends personalized communications to candidates including status updates, rejection letters, and engagement campaigns.",
    isEnabled: false,
    defaultMode: "assist",
    allowedEvents: ["evt-candidate-rejected", "evt-candidate-offer-extended", "evt-candidate-offer-accepted", "evt-candidate-droppedoff", "evt-candidate-inactive"],
    color: "teal",
  },
];

/* ── Mock Data: Webhooks ── */

export const WEBHOOKS: WebhookSubscription[] = [
  {
    id: "wh-001",
    name: "HRMS Sync (Workday)",
    url: "https://api.workday.com/webhooks/o2s-events",
    secret: "whsec_••••••••••••",
    subscribedEvents: ["int-candidate-shortlisted", "int-offer-accepted", "int-offer-extended", "int-requisition-closed"],
    status: "active",
    retryPolicy: "exponential",
    maxRetries: 5,
    createdAt: "2026-03-10",
    lastDelivery: "5 min ago",
    successRate: 99.2,
    totalDeliveries: 1247,
  },
  {
    id: "wh-002",
    name: "Background Check Provider",
    url: "https://api.checkr.com/hooks/o2s",
    secret: "whsec_••••••••••••",
    subscribedEvents: ["int-offer-extended", "int-candidate-created"],
    status: "active",
    retryPolicy: "linear",
    maxRetries: 3,
    createdAt: "2026-03-12",
    lastDelivery: "2 hours ago",
    successRate: 97.8,
    totalDeliveries: 342,
  },
  {
    id: "wh-003",
    name: "Slack Notifications",
    url: "https://hooks.slack.com/services/T0XXX/B0XXX/xxxxx",
    secret: "whsec_••••••••••••",
    subscribedEvents: ["int-candidate-shortlisted", "int-interview-completed", "int-decision-approved"],
    status: "active",
    retryPolicy: "none",
    maxRetries: 0,
    createdAt: "2026-03-14",
    lastDelivery: "12 min ago",
    successRate: 100,
    totalDeliveries: 856,
  },
  {
    id: "wh-004",
    name: "Analytics Data Lake",
    url: "https://ingest.analytics-corp.io/events",
    secret: "whsec_••••••••••••",
    subscribedEvents: ["int-candidate-created", "int-candidate-shortlisted", "int-candidate-rejected", "int-interview-completed", "int-offer-accepted", "int-requisition-published", "int-requisition-closed"],
    status: "paused",
    retryPolicy: "exponential",
    maxRetries: 10,
    createdAt: "2026-03-18",
    lastDelivery: "3 days ago",
    successRate: 94.1,
    totalDeliveries: 2103,
  },
];

/* ── Mock Data: Webhook Deliveries ── */

export const WEBHOOK_DELIVERIES: WebhookDelivery[] = [
  { id: "del-001", webhookId: "wh-001", webhookName: "HRMS Sync (Workday)", event: "candidate.shortlisted", status: "delivered", statusCode: 200, timestamp: "5 min ago", duration: "340ms", attempt: 1, payload: '{"id":"cand-123","requisitionId":"req-089","fitScore":87}', response: '{"received":true}' },
  { id: "del-002", webhookId: "wh-003", webhookName: "Slack Notifications", event: "interview.completed", status: "delivered", statusCode: 200, timestamp: "12 min ago", duration: "120ms", attempt: 1, payload: '{"interviewId":"int-456","candidateId":"cand-789"}', response: '{"ok":true}' },
  { id: "del-003", webhookId: "wh-002", webhookName: "Background Check Provider", event: "offer.extended", status: "delivered", statusCode: 201, timestamp: "2 hours ago", duration: "890ms", attempt: 1, payload: '{"candidateId":"cand-234","offerId":"off-567"}', response: '{"checkId":"chk-890","status":"initiated"}' },
  { id: "del-004", webhookId: "wh-004", webhookName: "Analytics Data Lake", event: "candidate.created", status: "failed", statusCode: 503, timestamp: "3 days ago", duration: "5200ms", attempt: 3, payload: '{"id":"cand-345","source":"linkedin"}', response: '{"error":"Service unavailable"}' },
  { id: "del-005", webhookId: "wh-001", webhookName: "HRMS Sync (Workday)", event: "offer.accepted", status: "delivered", statusCode: 200, timestamp: "1 day ago", duration: "450ms", attempt: 1, payload: '{"candidateId":"cand-111","startDate":"2026-04-15"}', response: '{"synced":true,"workdayId":"WD-8901"}' },
  { id: "del-006", webhookId: "wh-003", webhookName: "Slack Notifications", event: "decision.approved", status: "retrying", statusCode: 429, timestamp: "15 min ago", duration: "—", attempt: 2, payload: '{"decisionId":"dec-002","candidateId":"cand-456"}', response: '{"error":"rate_limited","retry_after":30}' },
];

/* ── Mock Data: Trigger Rules (updated with webhook support) ── */

export const TRIGGER_RULES: TriggerRule[] = [
  {
    id: "rule-001",
    name: "High Fit Auto-Screen",
    event: "evt-candidate-created",
    conditions: [{ field: "fitScore", operator: ">", value: 75 }],
    actionType: "trigger_agent",
    agentId: "agent-screening",
    webhookId: null,
    mode: "auto",
    isEnabled: true,
    priority: 1,
    createdAt: "2026-03-15",
    lastTriggered: "2 hours ago",
    triggerCount: 247,
  },
  {
    id: "rule-002",
    name: "Schedule Interview for Shortlisted",
    event: "evt-candidate-shortlisted",
    conditions: [
      { field: "fitScore", operator: ">", value: 70 },
      { field: "interviewCount", operator: "=", value: 0 },
    ],
    actionType: "both",
    agentId: "agent-interview",
    webhookId: "wh-001",
    mode: "assist",
    isEnabled: true,
    priority: 2,
    createdAt: "2026-03-15",
    lastTriggered: "45 min ago",
    triggerCount: 89,
  },
  {
    id: "rule-003",
    name: "Score After Interview",
    event: "evt-interview-completed",
    conditions: [],
    actionType: "trigger_agent",
    agentId: "agent-scoring",
    webhookId: null,
    mode: "auto",
    isEnabled: true,
    priority: 1,
    createdAt: "2026-03-16",
    lastTriggered: "1 hour ago",
    triggerCount: 156,
  },
  {
    id: "rule-004",
    name: "SLA Breach — Source More Candidates",
    event: "evt-sla-breached",
    conditions: [{ field: "daysSinceApplied", operator: ">", value: 25 }],
    actionType: "trigger_agent",
    agentId: "agent-sourcing",
    webhookId: null,
    mode: "auto",
    isEnabled: true,
    priority: 1,
    createdAt: "2026-03-18",
    lastTriggered: "3 hours ago",
    triggerCount: 12,
  },
  {
    id: "rule-005",
    name: "Compliance Check + HRMS Sync on Offer",
    event: "evt-candidate-offer-extended",
    conditions: [],
    actionType: "both",
    agentId: "agent-compliance",
    webhookId: "wh-001",
    mode: "auto",
    isEnabled: true,
    priority: 1,
    createdAt: "2026-03-18",
    lastTriggered: "6 hours ago",
    triggerCount: 34,
  },
  {
    id: "rule-006",
    name: "Rejection Outreach",
    event: "evt-candidate-rejected",
    conditions: [{ field: "stage", operator: "!=", value: "applied" }],
    actionType: "trigger_agent",
    agentId: "agent-outreach",
    webhookId: null,
    mode: "assist",
    isEnabled: false,
    priority: 3,
    createdAt: "2026-03-20",
    lastTriggered: null,
    triggerCount: 0,
  },
  {
    id: "rule-007",
    name: "Stalled Pipeline Alert + Analytics",
    event: "evt-pipeline-stalled",
    conditions: [{ field: "daysSinceApplied", operator: ">", value: 14 }],
    actionType: "both",
    agentId: "agent-sourcing",
    webhookId: "wh-004",
    mode: "auto",
    isEnabled: true,
    priority: 2,
    createdAt: "2026-03-22",
    lastTriggered: "1 day ago",
    triggerCount: 8,
  },
];

/* ── Mock Data: Execution Logs ── */

export const AGENT_RUNS: AgentRun[] = [
  { id: "run-001", agentId: "agent-screening", triggeredByEvent: "Candidate.Created", ruleId: "rule-001", ruleName: "High Fit Auto-Screen", status: "success", timestamp: "2 min ago", duration: "1.2s", details: "Screened 3 applications, 2 passed threshold", webhookSent: false },
  { id: "run-002", agentId: "agent-interview", triggeredByEvent: "Candidate.Shortlisted", ruleId: "rule-002", ruleName: "Schedule Interview for Shortlisted", status: "success", timestamp: "15 min ago", duration: "3.4s", details: "Scheduled panel interview for Sarah Chen — webhook sent to Workday", webhookSent: true },
  { id: "run-003", agentId: "agent-scoring", triggeredByEvent: "Interview.Completed", ruleId: "rule-003", ruleName: "Score After Interview", status: "success", timestamp: "45 min ago", duration: "2.1s", details: "Generated composite score 87/100 for Marcus Johnson", webhookSent: false },
  { id: "run-004", agentId: "agent-sourcing", triggeredByEvent: "SLA.Breached", ruleId: "rule-004", ruleName: "SLA Breach — Source More Candidates", status: "running", timestamp: "1 hour ago", duration: "—", details: "Expanding search parameters for ML Engineer role", webhookSent: false },
  { id: "run-005", agentId: "agent-compliance", triggeredByEvent: "Candidate.OfferExtended", ruleId: "rule-005", ruleName: "Compliance Check + HRMS Sync on Offer", status: "success", timestamp: "2 hours ago", duration: "4.8s", details: "Compliance passed — webhook sent to Workday for offer sync", webhookSent: true },
  { id: "run-006", agentId: "agent-screening", triggeredByEvent: "Candidate.Created", ruleId: "rule-001", ruleName: "High Fit Auto-Screen", status: "failed", timestamp: "3 hours ago", duration: "0.3s", details: "Resume parsing failed — unsupported file format (.pages)", webhookSent: false },
  { id: "run-007", agentId: "agent-sourcing", triggeredByEvent: "Pipeline.Stalled", ruleId: "rule-007", ruleName: "Stalled Pipeline Alert + Analytics", status: "success", timestamp: "5 hours ago", duration: "2.7s", details: "Added 6 candidates to pipeline — webhook sent to analytics data lake", webhookSent: true },
  { id: "run-008", agentId: "agent-scoring", triggeredByEvent: "Interview.Completed", ruleId: "rule-003", ruleName: "Score After Interview", status: "skipped", timestamp: "6 hours ago", duration: "0.1s", details: "Skipped — insufficient interview data (1 of 3 scorecards submitted)", webhookSent: false },
  { id: "run-009", agentId: "agent-interview", triggeredByEvent: "Candidate.Shortlisted", ruleId: "rule-002", ruleName: "Schedule Interview for Shortlisted", status: "success", timestamp: "8 hours ago", duration: "5.1s", details: "Batch scheduled 3 QA Lead panel interviews — webhook sent to Workday", webhookSent: true },
  { id: "run-010", agentId: "agent-compliance", triggeredByEvent: "Agent.Run.Failed", ruleId: "rule-005", ruleName: "Compliance Check + HRMS Sync on Offer", status: "success", timestamp: "1 day ago", duration: "1.9s", details: "Audit triggered by screening agent error — no compliance impact found", webhookSent: false },
];

/* ── Filtering ── */

export type QueueFilter = "all" | "critical" | "offers" | "advances" | "shortlists";

export function filterDecisions(decisions: any[], filter: QueueFilter): any[] {
  const pending = decisions.filter((d: any) => d.status === "pending");
  switch (filter) {
    case "all": return pending;
    case "critical": return pending.filter((d: any) => d.urgency === "critical" || d.urgency === "high");
    case "offers": return pending.filter((d: any) => d.type === "approve_offer");
    case "advances": return pending.filter((d: any) => d.type === "advance_candidate");
    case "shortlists": return pending.filter((d: any) => d.type === "approve_shortlist" || d.type === "schedule_interview");
    default: return pending;
  }
}
