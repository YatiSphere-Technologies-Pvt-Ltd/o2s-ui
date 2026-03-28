/* ================================================================
   O2S Settings / Integrations Hub — Types, Mock Data & Helpers
   ================================================================ */

/* ── Types ── */

export type IntegrationCategory =
  | "ats_recruiting" | "hris_people" | "communication" | "productivity"
  | "payroll_benefits" | "identity_sso" | "developer" | "ai_analytics" | "background_check";

export type IntegrationStatus = "connected" | "available" | "coming_soon";
export type SyncStatus = "healthy" | "error" | "auth_expired" | "syncing" | "paused";
export type DataFlow = "inbound" | "outbound" | "bidirectional";
export type AgentId = "recruiter" | "compliance" | "analytics" | "onboarding" | "orchestrator";
export type WebhookStatus = "active" | "failing" | "paused" | "disabled";
export type ApiKeyScope = "full_access" | "read_only" | "custom";

export interface Integration {
  id: string;
  name: string;
  logoInitial: string;
  logoColor: string;
  category: IntegrationCategory;
  description: string;
  status: IntegrationStatus;
  popularity?: number;
  isAiEnhanced: boolean;
  isFeatured: boolean;
  expectedDate?: string;
  connection?: {
    connectedAt: string;
    connectedBy: string;
    authMethod: string;
    lastSync: string;
    syncStatus: SyncStatus;
    dataFlow: DataFlow;
    errorMessage?: string;
    aiAgentsUsing: AgentId[];
    monthlyActions: number;
  };
}

export interface OutgoingWebhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: WebhookStatus;
  healthPercent: number;
  lastFired: string;
  totalDeliveries: number;
  failedDeliveries: number;
  avgResponseTime: string;
}

export interface IncomingWebhook {
  id: string;
  name: string;
  endpointUrl: string;
  source: string;
  eventsReceived24h: number;
  lastReceived: string;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  environment: "live" | "test";
  scope: ApiKeyScope;
  scopeDetails?: string[];
  lastUsed: string;
  createdAt: string;
  createdBy: string;
  callsThisMonth: number;
  callLimit: number;
  expiresAt: string | null;
}

/* ── Category Config ── */

export const CATEGORIES: { key: IntegrationCategory | "all"; label: string; count?: number }[] = [
  { key: "all", label: "All" },
  { key: "ats_recruiting", label: "ATS & Recruiting" },
  { key: "hris_people", label: "HRIS & People" },
  { key: "communication", label: "Communication" },
  { key: "productivity", label: "Productivity" },
  { key: "payroll_benefits", label: "Payroll & Benefits" },
  { key: "identity_sso", label: "Identity & SSO" },
  { key: "developer", label: "Developer" },
  { key: "ai_analytics", label: "AI & Analytics" },
  { key: "background_check", label: "Background Check" },
];

export const CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  ats_recruiting: "ATS & Recruiting",
  hris_people: "HRIS & People",
  communication: "Communication",
  productivity: "Productivity",
  payroll_benefits: "Payroll & Benefits",
  identity_sso: "Identity & SSO",
  developer: "Developer",
  ai_analytics: "AI & Analytics",
  background_check: "Background Check",
};

/* ── Agent Config ── */

export const AGENT_CONFIG: Record<AgentId, { label: string; colorClass: string; bgClass: string }> = {
  recruiter:    { label: "Recruiter",    colorClass: "text-brand-purple", bgClass: "bg-brand-purple/15" },
  compliance:   { label: "Compliance",   colorClass: "text-destructive",  bgClass: "bg-destructive/15" },
  analytics:    { label: "Analytics",    colorClass: "text-brand",        bgClass: "bg-brand/15" },
  onboarding:   { label: "Onboarding",   colorClass: "text-brand-teal",   bgClass: "bg-brand-teal/15" },
  orchestrator: { label: "Orchestrator", colorClass: "text-success",      bgClass: "bg-success/15" },
};

/* ── Sync Status Config ── */

export const SYNC_STATUS_CONFIG: Record<SyncStatus, { label: string; dotClass: string; textClass: string }> = {
  healthy:      { label: "Connected",    dotClass: "bg-success",          textClass: "text-success" },
  error:        { label: "Sync Error",   dotClass: "bg-warning",          textClass: "text-warning" },
  auth_expired: { label: "Auth Expired", dotClass: "bg-destructive",      textClass: "text-destructive" },
  syncing:      { label: "Syncing",      dotClass: "bg-brand",            textClass: "text-brand" },
  paused:       { label: "Paused",       dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
};

export const WEBHOOK_STATUS_CONFIG: Record<WebhookStatus, { label: string; dotClass: string; textClass: string }> = {
  active:   { label: "Active",   dotClass: "bg-success",          textClass: "text-success" },
  failing:  { label: "Failing",  dotClass: "bg-warning",          textClass: "text-warning" },
  paused:   { label: "Paused",   dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
  disabled: { label: "Disabled", dotClass: "bg-muted-foreground/40", textClass: "text-muted-foreground/40" },
};

export const SCOPE_CONFIG: Record<ApiKeyScope, { label: string; colorClass: string; bgClass: string }> = {
  full_access: { label: "Full Access", colorClass: "text-warning",          bgClass: "bg-warning/10" },
  read_only:   { label: "Read Only",   colorClass: "text-brand",            bgClass: "bg-brand/10" },
  custom:      { label: "Custom",      colorClass: "text-success",          bgClass: "bg-success/10" },
};

export const DATA_FLOW_LABELS: Record<DataFlow, { label: string; icon: string }> = {
  inbound:       { label: "Inbound", icon: "←" },
  outbound:      { label: "Outbound", icon: "→" },
  bidirectional: { label: "Bidirectional", icon: "↔" },
};

/* ── Mock Data: Connected Integrations (12) ── */

export const CONNECTED_INTEGRATIONS: Integration[] = [
  { id: "slack", name: "Slack", logoInitial: "S", logoColor: "#E01E5A", category: "communication", description: "Send notifications, collect feedback, and enable AI agent communication through Slack channels.", status: "connected", popularity: 12400, isAiEnhanced: true, isFeatured: false, connection: { connectedAt: "Mar 1, 2026", connectedBy: "Prashant Singh", authMethod: "OAuth 2.0", lastSync: "2 min ago", syncStatus: "healthy", dataFlow: "bidirectional", aiAgentsUsing: ["recruiter", "orchestrator", "onboarding"], monthlyActions: 4280 } },
  { id: "google-workspace", name: "Google Workspace", logoInitial: "G", logoColor: "#4285F4", category: "productivity", description: "Sync calendars for interview scheduling, import employee data from Google Directory.", status: "connected", popularity: 15200, isAiEnhanced: true, isFeatured: false, connection: { connectedAt: "Feb 15, 2026", connectedBy: "Prashant Singh", authMethod: "OAuth 2.0", lastSync: "5 min ago", syncStatus: "healthy", dataFlow: "bidirectional", aiAgentsUsing: ["recruiter", "orchestrator", "analytics"], monthlyActions: 8920 } },
  { id: "linkedin", name: "LinkedIn Recruiter", logoInitial: "in", logoColor: "#0A66C2", category: "ats_recruiting", description: "Source candidates, sync InMail conversations, and import LinkedIn profiles.", status: "connected", popularity: 9800, isAiEnhanced: true, isFeatured: true, connection: { connectedAt: "Feb 20, 2026", connectedBy: "Prashant Singh", authMethod: "OAuth 2.0", lastSync: "15 min ago", syncStatus: "healthy", dataFlow: "bidirectional", aiAgentsUsing: ["recruiter", "analytics"], monthlyActions: 3450 } },
  { id: "okta", name: "Okta", logoInitial: "O", logoColor: "#007DC1", category: "identity_sso", description: "Single sign-on, automated user provisioning and deprovisioning via SCIM.", status: "connected", popularity: 5600, isAiEnhanced: false, isFeatured: false, connection: { connectedAt: "Jan 10, 2026", connectedBy: "Prashant Singh", authMethod: "SAML", lastSync: "1 hour ago", syncStatus: "healthy", dataFlow: "inbound", aiAgentsUsing: ["onboarding", "compliance"], monthlyActions: 620 } },
  { id: "bamboohr", name: "BambooHR", logoInitial: "B", logoColor: "#73C41D", category: "hris_people", description: "Sync employee records, time-off data, and org structure from BambooHR.", status: "connected", popularity: 7200, isAiEnhanced: true, isFeatured: false, connection: { connectedAt: "Feb 1, 2026", connectedBy: "Meera Patel", authMethod: "API Key", lastSync: "3 hours ago", syncStatus: "auth_expired", dataFlow: "bidirectional", errorMessage: "API key expired. Please re-authenticate.", aiAgentsUsing: ["analytics", "compliance", "onboarding"], monthlyActions: 2100 } },
  { id: "greenhouse", name: "Greenhouse", logoInitial: "G", logoColor: "#24A47F", category: "ats_recruiting", description: "Import candidates, sync pipeline stages, and unify recruiting workflows.", status: "connected", popularity: 8900, isAiEnhanced: true, isFeatured: true, connection: { connectedAt: "Mar 5, 2026", connectedBy: "Prashant Singh", authMethod: "OAuth 2.0", lastSync: "30 min ago", syncStatus: "healthy", dataFlow: "bidirectional", aiAgentsUsing: ["recruiter", "analytics", "orchestrator"], monthlyActions: 5670 } },
  { id: "notion", name: "Notion", logoInitial: "N", logoColor: "#787878", category: "productivity", description: "Sync offer letters, onboarding docs, and knowledge base articles.", status: "connected", popularity: 6400, isAiEnhanced: true, isFeatured: false, connection: { connectedAt: "Mar 10, 2026", connectedBy: "Prashant Singh", authMethod: "OAuth 2.0", lastSync: "1 hour ago", syncStatus: "healthy", dataFlow: "bidirectional", aiAgentsUsing: ["onboarding", "orchestrator"], monthlyActions: 890 } },
  { id: "zoom", name: "Zoom", logoInitial: "Z", logoColor: "#2D8CFF", category: "communication", description: "Auto-generate interview meeting links and sync recording transcripts.", status: "connected", popularity: 11200, isAiEnhanced: true, isFeatured: false, connection: { connectedAt: "Feb 25, 2026", connectedBy: "Prashant Singh", authMethod: "OAuth 2.0", lastSync: "20 min ago", syncStatus: "healthy", dataFlow: "bidirectional", aiAgentsUsing: ["recruiter", "analytics"], monthlyActions: 1240 } },
  { id: "docusign", name: "DocuSign", logoInitial: "D", logoColor: "#FFD800", category: "productivity", description: "Send offer letters and contracts for e-signature directly from O2S.", status: "connected", popularity: 7800, isAiEnhanced: false, isFeatured: false, connection: { connectedAt: "Mar 12, 2026", connectedBy: "Meera Patel", authMethod: "OAuth 2.0", lastSync: "4 hours ago", syncStatus: "healthy", dataFlow: "outbound", aiAgentsUsing: ["orchestrator", "onboarding"], monthlyActions: 340 } },
  { id: "gusto", name: "Gusto", logoInitial: "G", logoColor: "#F45D48", category: "payroll_benefits", description: "Sync payroll data, benefits enrollment, and tax documents.", status: "connected", popularity: 4200, isAiEnhanced: true, isFeatured: false, connection: { connectedAt: "Jan 20, 2026", connectedBy: "Prashant Singh", authMethod: "OAuth 2.0", lastSync: "6 hours ago", syncStatus: "healthy", dataFlow: "inbound", aiAgentsUsing: ["analytics", "compliance"], monthlyActions: 480 } },
  { id: "jira", name: "Jira", logoInitial: "J", logoColor: "#0052CC", category: "productivity", description: "Sync onboarding tasks and track IT provisioning tickets.", status: "connected", popularity: 8100, isAiEnhanced: false, isFeatured: false, connection: { connectedAt: "Mar 1, 2026", connectedBy: "Arjun Mehta", authMethod: "OAuth 2.0", lastSync: "45 min ago", syncStatus: "healthy", dataFlow: "bidirectional", aiAgentsUsing: ["onboarding", "orchestrator"], monthlyActions: 720 } },
  { id: "checkr", name: "Checkr", logoInitial: "C", logoColor: "#2962FF", category: "background_check", description: "Automated background checks triggered by pipeline stage transitions.", status: "connected", popularity: 3400, isAiEnhanced: true, isFeatured: false, connection: { connectedAt: "Feb 28, 2026", connectedBy: "Prashant Singh", authMethod: "API Key", lastSync: "2 days ago", syncStatus: "error", dataFlow: "bidirectional", errorMessage: "Rate limit exceeded. Retry at 2:30 PM.", aiAgentsUsing: ["recruiter", "compliance"], monthlyActions: 210 } },
];

/* ── Mock Data: Available Integrations (27) ── */

export const AVAILABLE_INTEGRATIONS: Integration[] = [
  { id: "lever", name: "Lever", logoInitial: "L", logoColor: "#46C1BE", category: "ats_recruiting", description: "Import candidates and sync recruiting pipeline from Lever.", status: "available", popularity: 6200, isAiEnhanced: true, isFeatured: false },
  { id: "ashby", name: "Ashby", logoInitial: "A", logoColor: "#6366F1", category: "ats_recruiting", description: "All-in-one recruiting platform integration with analytics sync.", status: "available", popularity: 3100, isAiEnhanced: true, isFeatured: false },
  { id: "indeed", name: "Indeed", logoInitial: "I", logoColor: "#2164F3", category: "ats_recruiting", description: "Post jobs to Indeed and import applicants automatically.", status: "available", popularity: 14200, isAiEnhanced: true, isFeatured: true },
  { id: "glassdoor", name: "Glassdoor", logoInitial: "G", logoColor: "#0CAA41", category: "ats_recruiting", description: "Monitor employer brand and sync job postings.", status: "available", popularity: 8700, isAiEnhanced: false, isFeatured: false },
  { id: "workday", name: "Workday", logoInitial: "W", logoColor: "#F57B20", category: "hris_people", description: "Enterprise HRIS sync for employee data, org structure, and compensation.", status: "available", popularity: 4800, isAiEnhanced: true, isFeatured: true },
  { id: "rippling", name: "Rippling", logoInitial: "R", logoColor: "#FFD166", category: "hris_people", description: "Unified HR, IT, and finance data sync.", status: "available", popularity: 5100, isAiEnhanced: true, isFeatured: false },
  { id: "personio", name: "Personio", logoInitial: "P", logoColor: "#5D3FD3", category: "hris_people", description: "European HR platform for absence, payroll, and people data.", status: "available", popularity: 3200, isAiEnhanced: true, isFeatured: false },
  { id: "microsoft-teams", name: "Microsoft Teams", logoInitial: "T", logoColor: "#6264A7", category: "communication", description: "Notifications, scheduling, and AI agent communication via Teams.", status: "available", popularity: 13500, isAiEnhanced: true, isFeatured: true },
  { id: "gmail", name: "Gmail", logoInitial: "M", logoColor: "#EA4335", category: "communication", description: "Send candidate communications and sync email threads.", status: "available", popularity: 14800, isAiEnhanced: true, isFeatured: false },
  { id: "calendly", name: "Calendly", logoInitial: "C", logoColor: "#006BFF", category: "productivity", description: "Self-service interview scheduling with automatic calendar sync.", status: "available", popularity: 9200, isAiEnhanced: true, isFeatured: true },
  { id: "google-drive", name: "Google Drive", logoInitial: "D", logoColor: "#0F9D58", category: "productivity", description: "Store and access resumes, offer letters, and HR documents.", status: "available", popularity: 12100, isAiEnhanced: false, isFeatured: false },
  { id: "dropbox", name: "Dropbox", logoInitial: "D", logoColor: "#0061FF", category: "productivity", description: "Document storage and sharing for HR workflows.", status: "available", popularity: 5400, isAiEnhanced: false, isFeatured: false },
  { id: "asana", name: "Asana", logoInitial: "A", logoColor: "#F06A6A", category: "productivity", description: "Task tracking for onboarding checklists and HR projects.", status: "available", popularity: 6700, isAiEnhanced: false, isFeatured: false },
  { id: "adp", name: "ADP", logoInitial: "A", logoColor: "#D0271D", category: "payroll_benefits", description: "Enterprise payroll and benefits administration sync.", status: "available", popularity: 6100, isAiEnhanced: true, isFeatured: false },
  { id: "deel", name: "Deel", logoInitial: "D", logoColor: "#3843D0", category: "payroll_benefits", description: "Global payroll and contractor management for distributed teams.", status: "available", popularity: 4500, isAiEnhanced: true, isFeatured: false },
  { id: "remote", name: "Remote.com", logoInitial: "R", logoColor: "#5840FF", category: "payroll_benefits", description: "EOR and global employment data sync.", status: "available", popularity: 3800, isAiEnhanced: false, isFeatured: false },
  { id: "azure-ad", name: "Azure AD / Entra ID", logoInitial: "A", logoColor: "#0078D4", category: "identity_sso", description: "Microsoft SSO and directory sync via SCIM.", status: "available", popularity: 9400, isAiEnhanced: false, isFeatured: false },
  { id: "onelogin", name: "OneLogin", logoInitial: "1", logoColor: "#02A8E0", category: "identity_sso", description: "Single sign-on and user lifecycle management.", status: "available", popularity: 2800, isAiEnhanced: false, isFeatured: false },
  { id: "github", name: "GitHub", logoInitial: "G", logoColor: "#6e7681", category: "developer", description: "Validate technical assessments and sync engineering team structure.", status: "available", popularity: 7600, isAiEnhanced: true, isFeatured: false },
  { id: "zapier", name: "Zapier", logoInitial: "Z", logoColor: "#FF4A00", category: "developer", description: "Connect O2S to 5,000+ apps with no-code automation.", status: "available", popularity: 11800, isAiEnhanced: false, isFeatured: true },
  { id: "make", name: "Make (Integromat)", logoInitial: "M", logoColor: "#6D00CC", category: "developer", description: "Visual workflow automation with O2S triggers and actions.", status: "available", popularity: 4900, isAiEnhanced: false, isFeatured: false },
  { id: "snowflake", name: "Snowflake", logoInitial: "S", logoColor: "#29B5E8", category: "ai_analytics", description: "Export O2S data to your Snowflake warehouse for custom analytics.", status: "available", popularity: 4200, isAiEnhanced: true, isFeatured: false },
  { id: "tableau", name: "Tableau", logoInitial: "T", logoColor: "#E97627", category: "ai_analytics", description: "Connect O2S data to Tableau dashboards for advanced visualization.", status: "available", popularity: 5600, isAiEnhanced: false, isFeatured: false },
  { id: "looker", name: "Looker", logoInitial: "L", logoColor: "#4285F4", category: "ai_analytics", description: "Push O2S metrics to Looker for unified business intelligence.", status: "available", popularity: 3900, isAiEnhanced: false, isFeatured: false },
  { id: "sterling", name: "Sterling", logoInitial: "S", logoColor: "#003366", category: "background_check", description: "Enterprise background screening and drug testing.", status: "available", popularity: 2900, isAiEnhanced: true, isFeatured: false },
  { id: "hireright", name: "HireRight", logoInitial: "H", logoColor: "#00A3E0", category: "background_check", description: "Global background verification and compliance.", status: "available", popularity: 2400, isAiEnhanced: true, isFeatured: false },
];

/* ── Mock Data: Coming Soon (6) ── */

export const COMING_SOON_INTEGRATIONS: Integration[] = [
  { id: "successfactors", name: "SAP SuccessFactors", logoInitial: "S", logoColor: "#0070F2", category: "hris_people", description: "Enterprise HCM suite integration.", status: "coming_soon", expectedDate: "Q2 2026", popularity: 3200, isAiEnhanced: true, isFeatured: false },
  { id: "oracle-hcm", name: "Oracle HCM Cloud", logoInitial: "O", logoColor: "#C74634", category: "hris_people", description: "Full Oracle HCM integration for enterprise.", status: "coming_soon", expectedDate: "Q2 2026", popularity: 2800, isAiEnhanced: true, isFeatured: false },
  { id: "darwinbox", name: "Darwinbox", logoInitial: "D", logoColor: "#FF6B35", category: "hris_people", description: "Asia-Pacific HRIS for emerging markets.", status: "coming_soon", expectedDate: "Q3 2026", popularity: 1800, isAiEnhanced: true, isFeatured: false },
  { id: "hibob", name: "HiBob", logoInitial: "H", logoColor: "#FF4F64", category: "hris_people", description: "Modern HRIS for mid-market companies.", status: "coming_soon", expectedDate: "Q3 2026", popularity: 2100, isAiEnhanced: true, isFeatured: false },
  { id: "power-bi", name: "Power BI", logoInitial: "P", logoColor: "#F2C811", category: "ai_analytics", description: "Microsoft BI integration for custom reporting.", status: "coming_soon", expectedDate: "Q2 2026", popularity: 4100, isAiEnhanced: false, isFeatured: false },
  { id: "trainual", name: "Trainual", logoInitial: "T", logoColor: "#6558F5", category: "productivity", description: "Training and SOPs linked to onboarding workflows.", status: "coming_soon", expectedDate: "Q3 2026", popularity: 1500, isAiEnhanced: true, isFeatured: false },
];

/* ── All Integrations Combined ── */

export const ALL_INTEGRATIONS: Integration[] = [
  ...CONNECTED_INTEGRATIONS,
  ...AVAILABLE_INTEGRATIONS,
  ...COMING_SOON_INTEGRATIONS,
];

/* ── Webhooks ── */

export const OUTGOING_WEBHOOKS: OutgoingWebhook[] = [
  { id: "wh_001", name: "Slack Notifications", url: "https://hooks.slack.com/services/T0XXXXX/B0XXXXX/xxxx", events: ["candidate.hired", "offer.extended", "interview.scheduled"], status: "active", healthPercent: 94, lastFired: "5 min ago", totalDeliveries: 1240, failedDeliveries: 74, avgResponseTime: "145ms" },
  { id: "wh_002", name: "BI Analytics Pipeline", url: "https://bi.acme-corp.com/webhooks/o2s", events: ["candidate.created", "candidate.stage_changed", "candidate.hired", "candidate.rejected", "job.published", "job.closed", "offer.accepted", "offer.declined"], status: "active", healthPercent: 99, lastFired: "1 hour ago", totalDeliveries: 8920, failedDeliveries: 12, avgResponseTime: "89ms" },
  { id: "wh_003", name: "PagerDuty Failure Alert", url: "https://events.pagerduty.com/integration/xxxx/enqueue", events: ["agent.error", "system.alert"], status: "failing", healthPercent: 34, lastFired: "3 days ago", totalDeliveries: 56, failedDeliveries: 37, avgResponseTime: "2400ms" },
  { id: "wh_004", name: "Custom ATS Sync", url: "https://internal.acme-corp.com/api/webhooks/hr", events: ["candidate.created", "candidate.stage_changed"], status: "active", healthPercent: 100, lastFired: "30 min ago", totalDeliveries: 420, failedDeliveries: 0, avgResponseTime: "67ms" },
  { id: "wh_005", name: "Compliance Logger", url: "https://compliance.acme-corp.com/audit/ingest", events: ["agent.action_completed", "agent.approval_requested", "agent.error", "employee.onboarded"], status: "active", healthPercent: 97, lastFired: "15 min ago", totalDeliveries: 3450, failedDeliveries: 103, avgResponseTime: "210ms" },
  { id: "wh_006", name: "Staging Test Hook", url: "https://staging.acme-corp.com/test/webhook", events: ["candidate.created"], status: "paused", healthPercent: 0, lastFired: "Never", totalDeliveries: 0, failedDeliveries: 0, avgResponseTime: "—" },
];

export const INCOMING_WEBHOOKS: IncomingWebhook[] = [
  { id: "iwh_001", name: "Greenhouse Candidate Sync", endpointUrl: "https://api.o2s.app/webhooks/in/gh_xxxx1234", source: "Greenhouse", eventsReceived24h: 42, lastReceived: "10 min ago" },
  { id: "iwh_002", name: "LinkedIn Apply", endpointUrl: "https://api.o2s.app/webhooks/in/li_xxxx5678", source: "LinkedIn", eventsReceived24h: 18, lastReceived: "45 min ago" },
  { id: "iwh_003", name: "Checkr Status Updates", endpointUrl: "https://api.o2s.app/webhooks/in/ck_xxxx9012", source: "Checkr", eventsReceived24h: 3, lastReceived: "2 hours ago" },
  { id: "iwh_004", name: "Custom Career Site", endpointUrl: "https://api.o2s.app/webhooks/in/cs_xxxx3456", source: "Custom", eventsReceived24h: 7, lastReceived: "1 hour ago" },
];

/* ── API Keys ── */

export const API_KEYS: ApiKey[] = [
  { id: "key_001", name: "Production", keyPreview: "o2s_live_••••7f3a", environment: "live", scope: "full_access", lastUsed: "2 min ago", createdAt: "Mar 1, 2026", createdBy: "Prashant Singh", callsThisMonth: 34500, callLimit: 100000, expiresAt: null },
  { id: "key_002", name: "Staging", keyPreview: "o2s_test_••••b2c1", environment: "test", scope: "read_only", lastUsed: "3 days ago", createdAt: "Feb 15, 2026", createdBy: "Arjun Mehta", callsThisMonth: 1200, callLimit: 50000, expiresAt: null },
  { id: "key_003", name: "CI/CD Pipeline", keyPreview: "o2s_live_••••9e4d", environment: "live", scope: "custom", scopeDetails: ["candidates:read", "candidates:write"], lastUsed: "Never", createdAt: "Mar 20, 2026", createdBy: "Prashant Singh", callsThisMonth: 0, callLimit: 10000, expiresAt: "Jun 20, 2026" },
  { id: "key_004", name: "Analytics Export", keyPreview: "o2s_live_••••d4e5", environment: "live", scope: "custom", scopeDetails: ["analytics:read", "people:read"], lastUsed: "6 hours ago", createdAt: "Jan 10, 2026", createdBy: "Meera Patel", callsThisMonth: 8900, callLimit: 50000, expiresAt: null },
];

/* ── Recommended Integrations (for AI section) ── */

export const RECOMMENDED = [
  { id: "calendly", name: "Calendly", logoInitial: "C", logoColor: "#006BFF", uplift: "+27% scheduling efficiency", metric: "scheduling" },
  { id: "indeed", name: "Indeed", logoInitial: "I", logoColor: "#2164F3", uplift: "+38% candidate volume", metric: "sourcing" },
  { id: "workday", name: "Workday", logoInitial: "W", logoColor: "#F57B20", uplift: "+43% data accuracy", metric: "people data" },
];

/* ── Webhook Events ── */

export const WEBHOOK_EVENT_GROUPS = [
  { group: "Candidates", events: ["candidate.created", "candidate.updated", "candidate.stage_changed", "candidate.rejected", "candidate.hired", "candidate.note_added"] },
  { group: "Jobs", events: ["job.created", "job.published", "job.closed", "job.updated"] },
  { group: "Offers", events: ["offer.extended", "offer.accepted", "offer.declined"] },
  { group: "Interviews", events: ["interview.scheduled", "interview.completed", "interview.feedback_submitted"] },
  { group: "AI Agents", events: ["agent.action_completed", "agent.error", "agent.approval_requested", "agent.confidence_low"] },
  { group: "People", events: ["employee.onboarded", "employee.offboarded"] },
  { group: "System", events: ["system.alert", "system.integration_error"] },
];

/* ── Helpers ── */

export const CONNECTED_COUNT = CONNECTED_INTEGRATIONS.length;
export const AVAILABLE_COUNT = AVAILABLE_INTEGRATIONS.length;
export const COMING_SOON_COUNT = COMING_SOON_INTEGRATIONS.length;
export const ERROR_INTEGRATIONS = CONNECTED_INTEGRATIONS.filter(
  (i) => i.connection?.syncStatus === "error" || i.connection?.syncStatus === "auth_expired"
);

export function healthBarColor(pct: number): string {
  if (pct >= 90) return "bg-success";
  if (pct >= 70) return "bg-warning";
  return "bg-destructive";
}

export function formatPopularity(n: number | undefined): string {
  if (!n) return "";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K companies`;
  return `${n} companies`;
}
