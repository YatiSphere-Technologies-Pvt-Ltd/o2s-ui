"use client";

import { useCallback, useMemo } from "react";
import {
  AGENTS,
  AUDIT_BASELINE,
  BUILT_IN_ROLES,
  COMMENTS_BY_REQUEST,
  COMPLIANCE_ITEMS,
  DEFAULT_TENANT_SETTINGS,
  DELEGATE_CANDIDATES,
  DSAR_REQUESTS,
  POLICY_REVISIONS,
  POLICY_RULES,
  HR_FULL_NAME,
  MANAGER_FULL_NAME,
  MANAGER_INITIALS,
  MY_REQUESTS,
  PEER_OVERLOAD_THRESHOLD,
  RECENT_DECISIONS,
  SCHEDULED_EXPORTS,
  SEEDED_ANOMALIES,
  SEEDED_CUSTOM_ROLES,
  TEAM_REQUESTS,
  WELLBEING_SIGNALS,
  asOrgRequests,
  defaultEscalationPeer,
  type AgentAutonomyLevel,
  type AgentId,
  type AgentScope,
  type AgentSeed,
  type Anomaly,
  type AnomalySeverity,
  type AuditEntry,
  type ComplianceItemStatus,
  type DecisionLogEntry,
  type DelegatePeer,
  type DsarRequest,
  type DsarStatus,
  type ExportDestination,
  type ExportRun,
  type LeaveComment,
  type LeaveRequest,
  type OrgRequest,
  type PermissionKey,
  type PolicyRevision,
  type PolicyRule,
  type RbacRole,
  type RequestStatus,
  type TeamRequest,
  type TenantSettings,
  type WellbeingSignal,
} from "@/components/leave/data";
import { useLocalStorage } from "@/lib/use-local-storage";

/**
 * Mutable overlay on top of the seed MY_REQUESTS + COMMENTS_BY_REQUEST.
 * We keep the seed as the immutable source of truth and store only the
 * deltas: status changes plus newly added comments.
 */
export type SignalStatus = "active" | "addressed" | "dismissed" | "escalated";

export type SignalActionKind =
  | "viewed"
  | "suggested_leave"
  | "scheduled_one_on_one"
  | "shared_resources"
  | "marked_addressed"
  | "dismissed"
  | "escalated";

export interface SignalAuditEntry {
  /** Action id. */
  id: string;
  kind: SignalActionKind;
  whenISO: string;
  whenLabel: string;
  note?: string;
}

export interface SignalActionState {
  status: SignalStatus;
  audit: SignalAuditEntry[];
}

export interface DelegationWindow {
  id: string;
  startISO: string; // YYYY-MM-DD
  endISO: string;
  reason?: string;
}

export interface DelegationSettings {
  /** When true, route approvals to alwaysOnPeerId whenever the manager hasn't approved within their SLA. */
  alwaysOn: boolean;
  alwaysOnPeerId: string | null;
  escalationPeerId: string | null;
  /** Manager is fully delegating while on leave during these windows. */
  scheduledWindows: DelegationWindow[];
}

const DEFAULT_DELEGATION: DelegationSettings = {
  alwaysOn: false,
  alwaysOnPeerId: null,
  escalationPeerId: defaultEscalationPeer().id,
  scheduledWindows: [],
};

export type AnomalyStatus = "active" | "investigating" | "dismissed" | "escalated";

export type AnomalyActionKind =
  | "viewed"
  | "marked_investigating"
  | "ran_suggested_step"
  | "dismissed"
  | "escalated";

export interface AnomalyAuditEntry {
  id: string;
  kind: AnomalyActionKind;
  whenISO: string;
  whenLabel: string;
  actor: string;
  note?: string;
}

export interface AnomalyActionState {
  status: AnomalyStatus;
  audit: AnomalyAuditEntry[];
}

export type HrInterventionKind = "force_approve" | "force_cancel" | "reassign_approver";

export interface HrIntervention {
  id: string;
  requestId: string;
  kind: HrInterventionKind;
  /** ISO timestamp when HR intervened. */
  whenISO: string;
  whenLabel: string;
  note?: string;
  /** For reassign actions, the new approver's display name. */
  newApproverName?: string;
  newApproverInitials?: string;
}

interface LeaveOverlay {
  statusOverrides: Record<string, { status: RequestStatus; decidedOn: string }>;
  newComments: LeaveComment[];
  /** Team requests the manager has acted on. Keyed by team request id. */
  teamDecisions: Record<string, { status: RequestStatus; decidedOn: string; note?: string }>;
  /** Decisions log entries the manager added on top of the seeded ones. */
  newDecisionLog: DecisionLogEntry[];
  /** Wellbeing alerts the manager dismissed (legacy, retained for back-compat). */
  dismissedSignals: string[];
  /** Wellbeing signal lifecycle map keyed by signal id. */
  signalActions: Record<string, SignalActionState>;
  /** Manager delegation preferences. */
  delegation: DelegationSettings;
  /** HR-level intervention overlay: latest applied per request id. */
  orgOverrides: Record<string, {
    status?: RequestStatus;
    decidedOn?: string;
    approverName?: string;
    approverInitials?: string;
  }>;
  /** Chronological log of HR interventions. */
  hrInterventions: HrIntervention[];
  /** Anomaly lifecycle (active/investigating/dismissed/escalated) + per-anomaly audit. */
  anomalyActions: Record<string, AnomalyActionState>;
  /** Per-agent runtime config overlay (keyed by AgentId). */
  agentConfigs: Record<string, AgentConfigOverride>;
  /** Global pause for all agents. */
  globalAgentPause: boolean;
  /** Compliance feed item lifecycle (keyed by item id). */
  complianceActions: Record<string, ComplianceActionState>;
  /** Warehouse sync settings. */
  warehouseSync: WarehouseSyncSettings;
  /** Pinned dashboard ids in display order. */
  pinnedReports: string[];
  /** DSAR lifecycle overrides keyed by DSAR id. */
  dsarOverrides: Record<string, DsarOverride>;
  /** Scheduled-export runs added on top of seed (most recent first). */
  newExportRuns: Record<string, ExportRun[]>;
  /** Per-destination enabled override. */
  exportEnabled: Record<string, boolean>;
  /** Tenant-wide settings overlay (branding, languages, residency, agent defaults). */
  tenantSettings: TenantSettings;
  /** Permission patches applied on top of built-in roles. */
  rolePatches: Record<string, PermissionKey[]>;
  /** Custom roles created by HR/Admin (in addition to SEEDED_CUSTOM_ROLES). */
  customRoles: RbacRole[];
  /** Custom-role ids that have been deleted (used to hide seeded ones too). */
  deletedRoleIds: string[];
  /** Policy rule patches keyed by rule id (full replacement payload). */
  policyPatches: Record<string, PolicyRule>;
  /** Newly created policy rules. */
  newPolicies: PolicyRule[];
  /** Policy rule ids that have been archived in the overlay. */
  archivedPolicyIds: string[];
  /** Newly recorded policy revisions (most recent first). */
  newPolicyRevisions: PolicyRevision[];
}

export interface DsarOverride {
  status?: DsarStatus;
  assigneeName?: string;
  /** New legal hold flag. */
  legalHold?: { reason: string; placedByName: string; placedOnISO: string } | null;
  /** Extra history entries appended after this row was saved. */
  history?: { id: string; whenLabel: string; actor: string; action: string; note?: string }[];
}

export type WarehouseConnector = "off" | "snowflake" | "bigquery" | "databricks";
export type WarehouseInterval = "hourly" | "daily" | "weekly" | "manual";

export interface WarehouseSyncSettings {
  connector: WarehouseConnector;
  /** Masked connection string (just the visible prefix). */
  connectionLabel: string;
  interval: WarehouseInterval;
  /** ISO timestamp of last successful sync. */
  lastSyncedISO?: string;
}

const DEFAULT_WAREHOUSE: WarehouseSyncSettings = {
  connector: "off",
  connectionLabel: "",
  interval: "daily",
};

export interface AgentConfigOverride {
  status?: boolean;
  autonomy?: AgentAutonomyLevel;
  scope?: AgentScope;
}

export interface AgentEffectiveConfig {
  agent: AgentSeed;
  status: boolean;
  autonomy: AgentAutonomyLevel;
  scope: AgentScope;
  /** True when the manager has explicitly customised this agent. */
  isCustomised: boolean;
}

export interface ComplianceActionState {
  status: ComplianceItemStatus;
  whenISO?: string;
  whenLabel?: string;
  note?: string;
}

const DEFAULT_OVERLAY: LeaveOverlay = {
  statusOverrides: {},
  newComments: [],
  teamDecisions: {},
  newDecisionLog: [],
  dismissedSignals: [],
  signalActions: {},
  delegation: DEFAULT_DELEGATION,
  orgOverrides: {},
  hrInterventions: [],
  anomalyActions: {},
  agentConfigs: {},
  globalAgentPause: false,
  complianceActions: {},
  warehouseSync: DEFAULT_WAREHOUSE,
  pinnedReports: ["liability", "compliance"],
  dsarOverrides: {},
  newExportRuns: {},
  exportEnabled: {},
  tenantSettings: DEFAULT_TENANT_SETTINGS,
  rolePatches: {},
  customRoles: [],
  deletedRoleIds: [],
  policyPatches: {},
  newPolicies: [],
  archivedPolicyIds: [],
  newPolicyRevisions: [],
};

/**
 * Apply defaults to a possibly-stale stored overlay so reads never trip on
 * missing fields (the schema grew over time and older browser sessions can
 * still hold values from earlier versions).
 */
function normalizeOverlay(raw: Partial<LeaveOverlay> | undefined | null): LeaveOverlay {
  const r = raw ?? {};
  return {
    statusOverrides: r.statusOverrides ?? {},
    newComments: r.newComments ?? [],
    teamDecisions: r.teamDecisions ?? {},
    newDecisionLog: r.newDecisionLog ?? [],
    dismissedSignals: r.dismissedSignals ?? [],
    signalActions: r.signalActions ?? {},
    delegation: r.delegation ?? DEFAULT_DELEGATION,
    orgOverrides: r.orgOverrides ?? {},
    hrInterventions: r.hrInterventions ?? [],
    anomalyActions: r.anomalyActions ?? {},
    agentConfigs: r.agentConfigs ?? {},
    globalAgentPause: r.globalAgentPause ?? false,
    complianceActions: r.complianceActions ?? {},
    warehouseSync: r.warehouseSync ?? DEFAULT_WAREHOUSE,
    pinnedReports: r.pinnedReports ?? ["liability", "compliance"],
    dsarOverrides: r.dsarOverrides ?? {},
    newExportRuns: r.newExportRuns ?? {},
    exportEnabled: r.exportEnabled ?? {},
    tenantSettings: r.tenantSettings ?? DEFAULT_TENANT_SETTINGS,
    rolePatches: r.rolePatches ?? {},
    customRoles: r.customRoles ?? [],
    deletedRoleIds: r.deletedRoleIds ?? [],
    policyPatches: r.policyPatches ?? {},
    newPolicies: r.newPolicies ?? [],
    archivedPolicyIds: r.archivedPolicyIds ?? [],
    newPolicyRevisions: r.newPolicyRevisions ?? [],
  };
}

export function useLeaveStore() {
  const [rawOverlay, setRawOverlay] = useLocalStorage<LeaveOverlay>("o2s.leaveOverlay", DEFAULT_OVERLAY);
  const overlay = useMemo(() => normalizeOverlay(rawOverlay), [rawOverlay]);

  /**
   * Wraps the raw setter so updater functions always receive a normalised `prev`.
   * Lets older browser sessions (with partial overlays in localStorage) merge cleanly.
   */
  const setOverlay = useCallback(
    (v: LeaveOverlay | ((prev: LeaveOverlay) => LeaveOverlay)) => {
      if (typeof v === "function") {
        setRawOverlay((prev) => (v as (p: LeaveOverlay) => LeaveOverlay)(normalizeOverlay(prev)));
      } else {
        setRawOverlay(v);
      }
    },
    [setRawOverlay],
  );

  const requests = useMemo<LeaveRequest[]>(() => {
    return MY_REQUESTS.map((r) => {
      const ov = overlay.statusOverrides[r.id];
      if (!ov) return r;
      return { ...r, status: ov.status, decidedOn: ov.decidedOn };
    });
  }, [overlay.statusOverrides]);

  const commentsByRequest = useMemo(() => {
    const map: Record<string, LeaveComment[]> = {};
    for (const [id, list] of Object.entries(COMMENTS_BY_REQUEST)) {
      map[id] = [...list];
    }
    for (const c of overlay.newComments) {
      if (!map[c.requestId]) map[c.requestId] = [];
      map[c.requestId].push(c);
    }
    for (const id of Object.keys(map)) {
      map[id].sort((a, b) => a.whenISO.localeCompare(b.whenISO));
    }
    return map;
  }, [overlay.newComments]);

  const cancel = useCallback(
    (id: string) => {
      setOverlay((prev) => ({
        ...prev,
        statusOverrides: {
          ...prev.statusOverrides,
          [id]: { status: "cancelled", decidedOn: new Date().toISOString() },
        },
      }));
    },
    [setOverlay],
  );

  const addComment = useCallback(
    (
      requestId: string,
      body: string,
      author = "Priya Singh",
      authorInitials = "PS",
      authorRole: LeaveComment["authorRole"] = "employee",
    ) => {
      const now = new Date();
      const c: LeaveComment = {
        id: `cm-${requestId}-${now.getTime()}`,
        requestId,
        author,
        authorInitials,
        authorRole,
        whenISO: now.toISOString(),
        whenLabel: now.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + ", " + now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
        body,
      };
      setOverlay((prev) => ({
        ...prev,
        newComments: [...prev.newComments, c],
      }));
    },
    [setOverlay],
  );

  const resetOverlay = useCallback(() => setOverlay(DEFAULT_OVERLAY), [setOverlay]);

  const findRequest = useCallback(
    (id: string): LeaveRequest | undefined => requests.find((r) => r.id === id),
    [requests],
  );

  /* ── Manager-side: team requests + decisions log + dismissed signals ── */

  const teamRequests = useMemo<TeamRequest[]>(() => {
    return TEAM_REQUESTS.map((r) => {
      const ov = overlay.teamDecisions[r.id];
      if (!ov) return r;
      return { ...r, status: ov.status, decidedOn: ov.decidedOn };
    });
  }, [overlay.teamDecisions]);

  const decisionLog = useMemo<DecisionLogEntry[]>(() => {
    return [...overlay.newDecisionLog, ...RECENT_DECISIONS].sort((a, b) =>
      b.whenISO.localeCompare(a.whenISO),
    );
  }, [overlay.newDecisionLog]);

  const wellbeingSignals = useMemo(() => {
    return WELLBEING_SIGNALS.map((s) => {
      const explicit = overlay.signalActions[s.id];
      const state: SignalActionState =
        explicit ?? {
          status: overlay.dismissedSignals.includes(s.id) ? "dismissed" : "active",
          audit: [],
        };
      return { signal: s, state };
    });
  }, [overlay.signalActions, overlay.dismissedSignals]);

  const activeSignals = useMemo<WellbeingSignal[]>(
    () => wellbeingSignals.filter((x) => x.state.status === "active").map((x) => x.signal),
    [wellbeingSignals],
  );

  const decideTeamRequest = useCallback(
    (
      id: string,
      decision: "approved" | "rejected",
      note?: string,
    ) => {
      const r = TEAM_REQUESTS.find((x) => x.id === id);
      if (!r) return;
      const now = new Date();
      const iso = now.toISOString();
      const whenLabel = now.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      setOverlay((prev) => ({
        ...prev,
        teamDecisions: {
          ...prev.teamDecisions,
          [id]: { status: decision, decidedOn: iso, note },
        },
        newDecisionLog: [
          {
            id: `dl-${now.getTime()}`,
            requestId: id,
            employeeName: r.employeeName,
            employeeInitials: r.employeeInitials,
            employeeAvatar: r.employeeAvatar,
            decision,
            whenISO: iso,
            whenLabel,
            summary: `${r.type.toUpperCase()} · ${r.startDate}${r.startDate === r.endDate ? "" : ` – ${r.endDate}`}`,
            note,
          },
          ...prev.newDecisionLog,
        ],
      }));
    },
    [setOverlay],
  );

  const decideTeamRequestsBulk = useCallback(
    (ids: string[], decision: "approved" | "rejected", note?: string) => {
      if (ids.length === 0) return;
      const now = new Date();
      const whenLabel = now.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      setOverlay((prev) => {
        const newDecisions = { ...prev.teamDecisions };
        const newLogEntries: DecisionLogEntry[] = [];
        for (const id of ids) {
          const r = TEAM_REQUESTS.find((x) => x.id === id);
          if (!r) continue;
          const iso = new Date(now.getTime() + newLogEntries.length).toISOString();
          newDecisions[id] = { status: decision, decidedOn: iso, note };
          newLogEntries.push({
            id: `dl-${now.getTime()}-${newLogEntries.length}`,
            requestId: id,
            employeeName: r.employeeName,
            employeeInitials: r.employeeInitials,
            employeeAvatar: r.employeeAvatar,
            decision,
            whenISO: iso,
            whenLabel,
            summary: `${r.type.toUpperCase()} · ${r.startDate}${r.startDate === r.endDate ? "" : ` – ${r.endDate}`}`,
            note,
          });
        }
        return {
          ...prev,
          teamDecisions: newDecisions,
          newDecisionLog: [...newLogEntries, ...prev.newDecisionLog],
        };
      });
    },
    [setOverlay],
  );

  const dismissSignal = useCallback(
    (id: string) => {
      // Back-compat shim for Manager Home's compact card.
      setOverlay((prev) => ({
        ...prev,
        dismissedSignals: prev.dismissedSignals.includes(id)
          ? prev.dismissedSignals
          : [...prev.dismissedSignals, id],
        signalActions: {
          ...prev.signalActions,
          [id]: {
            status: "dismissed",
            audit: [
              ...((prev.signalActions[id]?.audit) ?? []),
              {
                id: `sg-${Date.now()}`,
                kind: "dismissed",
                whenISO: new Date().toISOString(),
                whenLabel: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
              },
            ],
          },
        },
      }));
    },
    [setOverlay],
  );

  const recordSignalAction = useCallback(
    (
      signalId: string,
      kind: SignalActionKind,
      opts: { note?: string; newStatus?: SignalStatus } = {},
    ) => {
      const now = new Date();
      const audit: SignalAuditEntry = {
        id: `sg-${now.getTime()}`,
        kind,
        whenISO: now.toISOString(),
        whenLabel:
          now.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
          ", " +
          now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
        note: opts.note,
      };
      setOverlay((prev) => {
        const existing = prev.signalActions[signalId] ?? { status: "active" as SignalStatus, audit: [] };
        return {
          ...prev,
          signalActions: {
            ...prev.signalActions,
            [signalId]: {
              status: opts.newStatus ?? existing.status,
              audit: [...existing.audit, audit],
            },
          },
        };
      });
    },
    [setOverlay],
  );

  /* ── Delegation ── */

  const delegation = useMemo(() => overlay.delegation ?? DEFAULT_DELEGATION, [overlay.delegation]);

  /** Returns the peer who should receive the manager's approvals right now, if any. */
  const activeDelegate: { peer: DelegatePeer; reason: "scheduled" | "always_on"; window?: DelegationWindow } | null = useMemo(() => {
    const todayISO = new Date().toISOString().slice(0, 10);
    // Scheduled window wins over always-on
    const win = delegation.scheduledWindows.find((w) => w.startISO <= todayISO && todayISO <= w.endISO);
    if (win && delegation.alwaysOnPeerId) {
      const peer = DELEGATE_CANDIDATES.find((c) => c.id === delegation.alwaysOnPeerId);
      if (peer) return { peer, reason: "scheduled", window: win };
    }
    if (delegation.alwaysOn && delegation.alwaysOnPeerId) {
      const peer = DELEGATE_CANDIDATES.find((c) => c.id === delegation.alwaysOnPeerId);
      if (peer) return { peer, reason: "always_on" };
    }
    return null;
  }, [delegation]);

  /** The escalation target if the peer is overloaded/out. Otherwise null. */
  const escalationTriggered: { peer: DelegatePeer; cause: "peer_overloaded" | "peer_out" } | null = useMemo(() => {
    if (!activeDelegate) return null;
    const peer = activeDelegate.peer;
    const escalation = DELEGATE_CANDIDATES.find((c) => c.id === delegation.escalationPeerId) ?? defaultEscalationPeer();
    if (peer.outDuringWindow) return { peer: escalation, cause: "peer_out" };
    if (peer.currentLoad >= PEER_OVERLOAD_THRESHOLD) return { peer: escalation, cause: "peer_overloaded" };
    return null;
  }, [activeDelegate, delegation.escalationPeerId]);

  const setDelegation = useCallback(
    (next: Partial<DelegationSettings>) => {
      setOverlay((prev) => ({
        ...prev,
        delegation: { ...(prev.delegation ?? DEFAULT_DELEGATION), ...next },
      }));
    },
    [setOverlay],
  );

  const addDelegationWindow = useCallback(
    (w: Omit<DelegationWindow, "id">) => {
      const id = `dw-${Date.now()}`;
      setOverlay((prev) => ({
        ...prev,
        delegation: {
          ...(prev.delegation ?? DEFAULT_DELEGATION),
          scheduledWindows: [...(prev.delegation?.scheduledWindows ?? []), { ...w, id }],
        },
      }));
    },
    [setOverlay],
  );

  const removeDelegationWindow = useCallback(
    (id: string) => {
      setOverlay((prev) => ({
        ...prev,
        delegation: {
          ...(prev.delegation ?? DEFAULT_DELEGATION),
          scheduledWindows: (prev.delegation?.scheduledWindows ?? []).filter((w) => w.id !== id),
        },
      }));
    },
    [setOverlay],
  );

  /* ── HR anomalies (combines seeded with derived signals) ── */

  /* ── Org-wide requests (HR inbox) ── */

  const orgRequests = useMemo<OrgRequest[]>(() => {
    return asOrgRequests().map((r) => {
      // self requests honour the existing employee-side overrides.
      const selfOv = r.source === "self" ? overlay.statusOverrides[r.id] : undefined;
      // team requests honour the manager's team decisions.
      const teamOv = r.source === "team" ? overlay.teamDecisions[r.id] : undefined;
      // org/team/self can all be intervened on by HR.
      const hrOv = overlay.orgOverrides[r.id];

      const status = hrOv?.status ?? selfOv?.status ?? teamOv?.status ?? r.status;
      const decidedOn = hrOv?.decidedOn ?? selfOv?.decidedOn ?? teamOv?.decidedOn ?? r.decidedOn;
      const approverName = hrOv?.approverName ?? r.approverName;
      const approverInitials = hrOv?.approverInitials ?? r.approverInitials;

      return { ...r, status, decidedOn, approverName, approverInitials };
    });
  }, [overlay.statusOverrides, overlay.teamDecisions, overlay.orgOverrides]);

  const hrInterventions = useMemo(() => overlay.hrInterventions, [overlay.hrInterventions]);

  const forceApproveRequest = useCallback(
    (requestId: string, note?: string) => {
      const now = new Date();
      const iso = now.toISOString();
      const whenLabel = now.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      setOverlay((prev) => ({
        ...prev,
        orgOverrides: {
          ...prev.orgOverrides,
          [requestId]: { ...(prev.orgOverrides[requestId] ?? {}), status: "approved", decidedOn: iso },
        },
        hrInterventions: [
          { id: `hi-${now.getTime()}`, requestId, kind: "force_approve", whenISO: iso, whenLabel, note },
          ...prev.hrInterventions,
        ],
      }));
    },
    [setOverlay],
  );

  const forceCancelRequest = useCallback(
    (requestId: string, note?: string) => {
      const now = new Date();
      const iso = now.toISOString();
      const whenLabel = now.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      setOverlay((prev) => ({
        ...prev,
        orgOverrides: {
          ...prev.orgOverrides,
          [requestId]: { ...(prev.orgOverrides[requestId] ?? {}), status: "cancelled", decidedOn: iso },
        },
        hrInterventions: [
          { id: `hi-${now.getTime()}`, requestId, kind: "force_cancel", whenISO: iso, whenLabel, note },
          ...prev.hrInterventions,
        ],
      }));
    },
    [setOverlay],
  );

  const reassignApprover = useCallback(
    (
      requestId: string,
      newApproverName: string,
      newApproverInitials: string,
      note?: string,
    ) => {
      const now = new Date();
      const iso = now.toISOString();
      const whenLabel = now.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      setOverlay((prev) => ({
        ...prev,
        orgOverrides: {
          ...prev.orgOverrides,
          [requestId]: {
            ...(prev.orgOverrides[requestId] ?? {}),
            approverName: newApproverName,
            approverInitials: newApproverInitials,
          },
        },
        hrInterventions: [
          {
            id: `hi-${now.getTime()}`,
            requestId,
            kind: "reassign_approver",
            whenISO: iso,
            whenLabel,
            note,
            newApproverName,
            newApproverInitials,
          },
          ...prev.hrInterventions,
        ],
      }));
    },
    [setOverlay],
  );

  const hrAnomalies = useMemo<Anomaly[]>(() => {
    const list: Anomaly[] = [...SEEDED_ANOMALIES];

    // Derive a manager-action anomaly if dismissals are unusually heavy.
    const dismissedCount = Object.values(overlay.signalActions).filter(
      (s) => s.status === "dismissed",
    ).length;
    if (dismissedCount >= 2) {
      list.unshift({
        id: "an-derived-mgr-dismissals",
        kind: "manager_dismissals",
        severity: "medium",
        source: "Anomaly Agent",
        title: `Manager dismissed ${dismissedCount} wellbeing signals this period`,
        detail:
          "Above the cohort median (1 / month). Worth a check-in with the manager on intent and patterns. Reasons (if given) are retained on the signal audit.",
        detectedAt: new Date().toISOString(),
        cta: "Review pattern",
      });
    }

    // Sort: severity high → low, then most-recent first.
    const rank: Record<AnomalySeverity, number> = { high: 0, medium: 1, low: 2 };
    return list.sort((a, b) => {
      if (rank[a.severity] !== rank[b.severity]) return rank[a.severity] - rank[b.severity];
      return b.detectedAt.localeCompare(a.detectedAt);
    });
  }, [overlay.signalActions]);

  /** Anomaly queue: every anomaly paired with its lifecycle state. */
  const anomalyQueue = useMemo(() => {
    return hrAnomalies.map((a) => {
      const state =
        overlay.anomalyActions[a.id] ?? ({ status: "active", audit: [] } as AnomalyActionState);
      return { anomaly: a, state };
    });
  }, [hrAnomalies, overlay.anomalyActions]);

  const recordAnomalyAction = useCallback(
    (
      anomalyId: string,
      kind: AnomalyActionKind,
      opts: { note?: string; newStatus?: AnomalyStatus; actor?: string } = {},
    ) => {
      const now = new Date();
      const audit: AnomalyAuditEntry = {
        id: `aa-${now.getTime()}`,
        kind,
        whenISO: now.toISOString(),
        whenLabel:
          now.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
          ", " +
          now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
        actor: opts.actor ?? HR_FULL_NAME,
        note: opts.note,
      };
      setOverlay((prev) => {
        const existing = prev.anomalyActions[anomalyId] ?? { status: "active" as AnomalyStatus, audit: [] };
        return {
          ...prev,
          anomalyActions: {
            ...prev.anomalyActions,
            [anomalyId]: {
              status: opts.newStatus ?? existing.status,
              audit: [...existing.audit, audit],
            },
          },
        };
      });
    },
    [setOverlay],
  );

  /* ── Agent configs ── */

  const agents = useMemo<AgentEffectiveConfig[]>(() => {
    return AGENTS.map((seed) => {
      const o = overlay.agentConfigs[seed.id];
      const status = !overlay.globalAgentPause && (o?.status ?? seed.defaultStatus);
      const autonomy = o?.autonomy ?? seed.defaultAutonomy;
      const scope = o?.scope ?? seed.defaultScope;
      const isCustomised =
        !!o && (o.status !== undefined || o.autonomy !== undefined || o.scope !== undefined);
      return { agent: seed, status, autonomy, scope, isCustomised };
    });
  }, [overlay.agentConfigs, overlay.globalAgentPause]);

  const findAgent = useCallback(
    (id: AgentId) => agents.find((a) => a.agent.id === id),
    [agents],
  );

  const setAgentConfig = useCallback(
    (id: AgentId, next: AgentConfigOverride) => {
      setOverlay((prev) => ({
        ...prev,
        agentConfigs: {
          ...prev.agentConfigs,
          [id]: { ...(prev.agentConfigs[id] ?? {}), ...next },
        },
      }));
    },
    [setOverlay],
  );

  const resetAgentConfig = useCallback(
    (id: AgentId) => {
      setOverlay((prev) => {
        const next = { ...prev.agentConfigs };
        delete next[id];
        return { ...prev, agentConfigs: next };
      });
    },
    [setOverlay],
  );

  const setGlobalAgentPause = useCallback(
    (paused: boolean) => {
      setOverlay((prev) => ({ ...prev, globalAgentPause: paused }));
    },
    [setOverlay],
  );

  /* ── Compliance Watchdog ── */

  const complianceFeed = useMemo(() => {
    return COMPLIANCE_ITEMS.map((item) => {
      const state =
        overlay.complianceActions[item.id] ?? ({ status: "new" } as ComplianceActionState);
      return { item, state };
    });
  }, [overlay.complianceActions]);

  const recordComplianceAction = useCallback(
    (id: string, status: ComplianceItemStatus, note?: string) => {
      const now = new Date();
      setOverlay((prev) => ({
        ...prev,
        complianceActions: {
          ...prev.complianceActions,
          [id]: {
            status,
            whenISO: now.toISOString(),
            whenLabel: now.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
            note,
          },
        },
      }));
    },
    [setOverlay],
  );

  /* ── Warehouse sync + pinned reports ── */

  const warehouseSync = useMemo(() => overlay.warehouseSync ?? DEFAULT_WAREHOUSE, [overlay.warehouseSync]);
  const pinnedReports = useMemo(() => overlay.pinnedReports, [overlay.pinnedReports]);

  const setWarehouseSync = useCallback(
    (next: Partial<WarehouseSyncSettings>) => {
      setOverlay((prev) => ({
        ...prev,
        warehouseSync: { ...(prev.warehouseSync ?? DEFAULT_WAREHOUSE), ...next },
      }));
    },
    [setOverlay],
  );

  const togglePinnedReport = useCallback(
    (id: string) => {
      setOverlay((prev) => ({
        ...prev,
        pinnedReports: prev.pinnedReports.includes(id)
          ? prev.pinnedReports.filter((x) => x !== id)
          : [...prev.pinnedReports, id],
      }));
    },
    [setOverlay],
  );

  /* ── Audit log (derived) ── */

  const auditLog = useMemo<AuditEntry[]>(() => {
    const derived: AuditEntry[] = [];
    let seq = (AUDIT_BASELINE[AUDIT_BASELINE.length - 1]?.seq ?? 0) + 1;

    function add(entry: Omit<AuditEntry, "seq">) {
      derived.push({ ...entry, seq: seq++ });
    }

    // Manager team decisions
    for (const [id, ov] of Object.entries(overlay.teamDecisions)) {
      add({
        id: `der-td-${id}`,
        whenISO: ov.decidedOn,
        whenLabel: new Date(ov.decidedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }),
        actor: { kind: "human", name: MANAGER_FULL_NAME, id: "mgr-raj" },
        entity: "team_request",
        entityId: id,
        action: ov.status === "approved" ? "approved" : ov.status === "rejected" ? "rejected" : "updated",
        summary: `Manager ${ov.status} request ${id}.`,
        before: { status: "pending" },
        after: { status: ov.status },
        reason: ov.note,
      });
    }

    // Employee status overrides
    for (const [id, ov] of Object.entries(overlay.statusOverrides)) {
      add({
        id: `der-so-${id}`,
        whenISO: ov.decidedOn,
        whenLabel: new Date(ov.decidedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }),
        actor: { kind: "human", name: "Priya Singh", id: "self" },
        entity: "leave_request",
        entityId: id,
        action: ov.status === "cancelled" ? "cancelled" : "updated",
        summary: `Employee ${ov.status} ${id}.`,
        after: { status: ov.status },
      });
    }

    // HR interventions
    for (const it of overlay.hrInterventions) {
      add({
        id: `der-hi-${it.id}`,
        whenISO: it.whenISO,
        whenLabel: it.whenLabel,
        actor: { kind: "human", name: HR_FULL_NAME, id: "hr-anita" },
        entity: "team_request",
        entityId: it.requestId,
        action: it.kind === "force_approve" ? "force_approved" : it.kind === "force_cancel" ? "force_cancelled" : "reassigned",
        summary:
          it.kind === "reassign_approver"
            ? `HR reassigned approver of ${it.requestId} to ${it.newApproverName}.`
            : `HR ${it.kind.replace("_", " ")} ${it.requestId}.`,
        reason: it.note,
        after: it.kind === "reassign_approver" ? { approver: it.newApproverName } : { status: it.kind === "force_approve" ? "approved" : "cancelled" },
      });
    }

    // Wellbeing signal actions
    for (const [signalId, state] of Object.entries(overlay.signalActions)) {
      for (const ev of state.audit) {
        add({
          id: `der-sa-${ev.id}`,
          whenISO: ev.whenISO,
          whenLabel: ev.whenLabel,
          actor: { kind: "human", name: MANAGER_FULL_NAME, id: "mgr-raj" },
          entity: "wellbeing_signal",
          entityId: signalId,
          action:
            ev.kind === "dismissed"
              ? "dismissed"
              : ev.kind === "escalated"
              ? "escalated"
              : ev.kind === "marked_addressed"
              ? "marked_addressed"
              : "updated",
          summary: `Manager ${ev.kind.replace(/_/g, " ")} ${signalId}.`,
          reason: ev.note,
        });
      }
    }

    // Anomaly actions
    for (const [aid, state] of Object.entries(overlay.anomalyActions)) {
      for (const ev of state.audit) {
        add({
          id: `der-aa-${ev.id}`,
          whenISO: ev.whenISO,
          whenLabel: ev.whenLabel,
          actor: { kind: "human", name: ev.actor, id: "hr-anita" },
          entity: "anomaly",
          entityId: aid,
          action:
            ev.kind === "dismissed"
              ? "dismissed"
              : ev.kind === "escalated"
              ? "escalated"
              : ev.kind === "marked_investigating"
              ? "marked_investigating"
              : ev.kind === "ran_suggested_step"
              ? "ran_suggested"
              : "updated",
          summary: `HR ${ev.kind.replace(/_/g, " ")} ${aid}.`,
          reason: ev.note,
        });
      }
    }

    // Compliance actions
    for (const [cid, state] of Object.entries(overlay.complianceActions)) {
      if (!state.whenISO) continue;
      add({
        id: `der-ca-${cid}`,
        whenISO: state.whenISO,
        whenLabel: state.whenLabel ?? "",
        actor: { kind: "human", name: HR_FULL_NAME, id: "hr-anita" },
        entity: "compliance_item",
        entityId: cid,
        action: state.status === "approved" ? "approved" : state.status === "dismissed" ? "dismissed" : "updated",
        summary: `HR ${state.status} compliance item ${cid}.`,
        reason: state.note,
      });
    }

    // Agent config changes
    for (const [agentId, override] of Object.entries(overlay.agentConfigs)) {
      add({
        id: `der-ac-${agentId}-${Object.keys(override).join(",")}`,
        whenISO: new Date().toISOString(),
        whenLabel: "Just now",
        actor: { kind: "human", name: HR_FULL_NAME, id: "hr-anita" },
        entity: "agent_config",
        entityId: agentId,
        action: "config_changed",
        summary: `Agent ${agentId} configured: ${Object.keys(override).join(", ")}.`,
        after: override as Record<string, unknown>,
      });
    }

    // Merge baseline + derived, sort desc by time + seq.
    const merged: AuditEntry[] = [...AUDIT_BASELINE, ...derived];
    merged.sort((a, b) => {
      if (a.whenISO === b.whenISO) return b.seq - a.seq;
      return a.whenISO < b.whenISO ? 1 : -1;
    });
    return merged;
  }, [
    overlay.teamDecisions,
    overlay.statusOverrides,
    overlay.hrInterventions,
    overlay.signalActions,
    overlay.anomalyActions,
    overlay.complianceActions,
    overlay.agentConfigs,
  ]);

  /* ── DSAR ── */

  const dsars = useMemo<DsarRequest[]>(() => {
    return DSAR_REQUESTS.map((r) => {
      const ov = overlay.dsarOverrides[r.id];
      if (!ov) return r;
      return {
        ...r,
        status: ov.status ?? r.status,
        assigneeName: ov.assigneeName ?? r.assigneeName,
        legalHold: ov.legalHold !== undefined ? ov.legalHold ?? undefined : r.legalHold,
        history: [...r.history, ...(ov.history ?? [])],
      };
    });
  }, [overlay.dsarOverrides]);

  const findDsar = useCallback(
    (id: string) => dsars.find((d) => d.id === id),
    [dsars],
  );

  const updateDsar = useCallback(
    (id: string, patch: DsarOverride) => {
      setOverlay((prev) => ({
        ...prev,
        dsarOverrides: {
          ...prev.dsarOverrides,
          [id]: { ...(prev.dsarOverrides[id] ?? {}), ...patch },
        },
      }));
    },
    [setOverlay],
  );

  const appendDsarHistory = useCallback(
    (id: string, entry: { actor: string; action: string; note?: string }) => {
      const now = new Date();
      const e = {
        id: `h-${now.getTime()}`,
        whenLabel: now.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }),
        actor: entry.actor,
        action: entry.action,
        note: entry.note,
      };
      setOverlay((prev) => ({
        ...prev,
        dsarOverrides: {
          ...prev.dsarOverrides,
          [id]: {
            ...(prev.dsarOverrides[id] ?? {}),
            history: [...(prev.dsarOverrides[id]?.history ?? []), e],
          },
        },
      }));
    },
    [setOverlay],
  );

  /* ── Scheduled exports ── */

  const exports_ = useMemo<ExportDestination[]>(() => {
    return SCHEDULED_EXPORTS.map((d) => {
      const enabled = overlay.exportEnabled[d.id] ?? d.enabled;
      const extra = overlay.newExportRuns[d.id] ?? [];
      const runs = [...extra, ...d.runs].slice(0, 20);
      return { ...d, enabled, runs };
    });
  }, [overlay.exportEnabled, overlay.newExportRuns]);

  const toggleExportEnabled = useCallback(
    (id: string, enabled: boolean) => {
      setOverlay((prev) => ({
        ...prev,
        exportEnabled: { ...prev.exportEnabled, [id]: enabled },
      }));
    },
    [setOverlay],
  );

  const runExportNow = useCallback(
    (id: string) => {
      const now = new Date();
      const run: ExportRun = {
        id: `r-${now.getTime()}`,
        startedISO: now.toISOString(),
        durationMs: 5_000 + Math.floor(Math.random() * 6_000),
        status: "success",
        rowsExported: 100 + Math.floor(Math.random() * 1_900),
      };
      setOverlay((prev) => ({
        ...prev,
        newExportRuns: { ...prev.newExportRuns, [id]: [run, ...(prev.newExportRuns[id] ?? [])] },
      }));
    },
    [setOverlay],
  );

  /* ── Roles (RBAC matrix + custom roles) ── */

  const roles = useMemo<RbacRole[]>(() => {
    const deleted = new Set(overlay.deletedRoleIds);
    const merged: RbacRole[] = [];

    for (const r of BUILT_IN_ROLES) {
      if (deleted.has(r.id)) continue;
      const patch = overlay.rolePatches[r.id];
      merged.push(patch ? { ...r, permissions: patch } : r);
    }
    for (const r of [...SEEDED_CUSTOM_ROLES, ...overlay.customRoles]) {
      if (deleted.has(r.id)) continue;
      const patch = overlay.rolePatches[r.id];
      merged.push(patch ? { ...r, permissions: patch } : r);
    }
    return merged;
  }, [overlay.rolePatches, overlay.customRoles, overlay.deletedRoleIds]);

  const findRole = useCallback((id: string) => roles.find((r) => r.id === id), [roles]);

  const togglePermission = useCallback(
    (roleId: string, perm: PermissionKey) => {
      setOverlay((prev) => {
        const all = [...BUILT_IN_ROLES, ...SEEDED_CUSTOM_ROLES, ...prev.customRoles];
        const role = all.find((r) => r.id === roleId);
        if (!role) return prev;
        // built-in Super Admin is locked: cannot edit.
        if (role.id === "super_admin") return prev;
        const base = prev.rolePatches[roleId] ?? role.permissions;
        const next = base.includes(perm)
          ? base.filter((p) => p !== perm)
          : [...base, perm];
        return { ...prev, rolePatches: { ...prev.rolePatches, [roleId]: next } };
      });
    },
    [setOverlay],
  );

  const resetRolePermissions = useCallback(
    (roleId: string) => {
      setOverlay((prev) => {
        const next = { ...prev.rolePatches };
        delete next[roleId];
        return { ...prev, rolePatches: next };
      });
    },
    [setOverlay],
  );

  const createCustomRole = useCallback(
    (input: Omit<RbacRole, "id" | "builtIn" | "userCount">) => {
      const id = `custom-${Date.now()}`;
      const role: RbacRole = { ...input, id, builtIn: false, userCount: 0 };
      setOverlay((prev) => ({ ...prev, customRoles: [...prev.customRoles, role] }));
      return role;
    },
    [setOverlay],
  );

  const deleteRole = useCallback(
    (roleId: string) => {
      setOverlay((prev) => {
        // Built-in roles can be soft-hidden; custom roles get filtered from customRoles too.
        const customRoles = prev.customRoles.filter((r) => r.id !== roleId);
        const rolePatches = { ...prev.rolePatches };
        delete rolePatches[roleId];
        return {
          ...prev,
          customRoles,
          rolePatches,
          deletedRoleIds: prev.deletedRoleIds.includes(roleId)
            ? prev.deletedRoleIds
            : [...prev.deletedRoleIds, roleId],
        };
      });
    },
    [setOverlay],
  );

  /* ── Tenant settings ── */

  const tenantSettings = useMemo(() => overlay.tenantSettings, [overlay.tenantSettings]);

  const updateTenantSettings = useCallback(
    (patch: Partial<TenantSettings>) => {
      setOverlay((prev) => ({
        ...prev,
        tenantSettings: { ...prev.tenantSettings, ...patch },
      }));
    },
    [setOverlay],
  );

  const resetTenantSettings = useCallback(() => {
    setOverlay((prev) => ({ ...prev, tenantSettings: DEFAULT_TENANT_SETTINGS }));
  }, [setOverlay]);

  /* ── Policies (3.2.1 + 3.2.2) ── */

  const policies = useMemo<PolicyRule[]>(() => {
    const archived = new Set(overlay.archivedPolicyIds);
    const merged: PolicyRule[] = [];
    for (const rule of POLICY_RULES) {
      const patched = overlay.policyPatches[rule.id] ?? rule;
      merged.push({ ...patched, archived: archived.has(rule.id) ? true : patched.archived });
    }
    for (const rule of overlay.newPolicies) {
      merged.push({ ...rule, archived: archived.has(rule.id) ? true : rule.archived });
    }
    return merged;
  }, [overlay.policyPatches, overlay.newPolicies, overlay.archivedPolicyIds]);

  const findPolicy = useCallback(
    (id: string) => policies.find((p) => p.id === id),
    [policies],
  );

  const policyRevisions = useMemo<PolicyRevision[]>(() => {
    return [...overlay.newPolicyRevisions, ...POLICY_REVISIONS].sort((a, b) =>
      b.whenISO.localeCompare(a.whenISO),
    );
  }, [overlay.newPolicyRevisions]);

  /**
   * Diff two rules and return an array of human-readable change rows. Used by
   * both the inline diff viewer and the revision logger.
   */
  function diffPolicy(prev: PolicyRule, next: PolicyRule) {
    const changes: { field: string; before: string; after: string }[] = [];
    const stringify = (v: unknown): string => {
      if (v === undefined || v === null) return "—";
      if (Array.isArray(v)) return v.length === 0 ? "—" : JSON.stringify(v);
      return String(v);
    };
    const keys: (keyof PolicyRule)[] = [
      "daysPerYear",
      "entitlementModel",
      "accrualCadence",
      "carryoverMaxDays",
      "carryoverExpiry",
      "encashable",
      "encashableMaxPerYear",
      "halfDayAllowed",
      "probationGated",
      "probationMonths",
      "hoursPerDay",
      "tenureTiers",
      "documentation",
      "eligibilityFilters",
    ];
    for (const k of keys) {
      const a = stringify(prev[k]);
      const b = stringify(next[k]);
      if (a !== b) changes.push({ field: String(k), before: a, after: b });
    }
    return changes;
  }

  const savePolicy = useCallback(
    (next: PolicyRule, summary: string) => {
      setOverlay((prev) => {
        const existing =
          prev.policyPatches[next.id] ??
          POLICY_RULES.find((r) => r.id === next.id) ??
          prev.newPolicies.find((r) => r.id === next.id);
        const changes = existing ? diffPolicy(existing, next) : [];
        const version = (existing?.version ?? 0) + 1;
        const now = new Date();
        const newRule: PolicyRule = { ...next, version, effectiveFromISO: next.effectiveFromISO };
        const isExistingBase = POLICY_RULES.some((r) => r.id === next.id);
        const rev: PolicyRevision = {
          id: `rev-${next.id}-${now.getTime()}`,
          policyId: next.id,
          version,
          authorName: HR_FULL_NAME,
          whenISO: now.toISOString(),
          whenLabel:
            now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
            ", " +
            now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
          summary: summary || `Updated ${changes.length} fields.`,
          changes,
        };
        return {
          ...prev,
          policyPatches: isExistingBase ? { ...prev.policyPatches, [next.id]: newRule } : prev.policyPatches,
          newPolicies: isExistingBase
            ? prev.newPolicies
            : prev.newPolicies.some((r) => r.id === next.id)
            ? prev.newPolicies.map((r) => (r.id === next.id ? newRule : r))
            : [...prev.newPolicies, newRule],
          newPolicyRevisions: [rev, ...prev.newPolicyRevisions],
        };
      });
    },
    [setOverlay],
  );

  const rollbackPolicy = useCallback(
    (policyId: string, toVersion: number) => {
      const all = [...POLICY_REVISIONS, ...overlay.newPolicyRevisions].filter((r) => r.policyId === policyId);
      const target = all.find((r) => r.version === toVersion);
      if (!target) return;
      const now = new Date();
      const rev: PolicyRevision = {
        id: `rev-rb-${policyId}-${now.getTime()}`,
        policyId,
        version: ((policies.find((p) => p.id === policyId)?.version) ?? 0) + 1,
        authorName: HR_FULL_NAME,
        whenISO: now.toISOString(),
        whenLabel:
          now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
          ", " +
          now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
        summary: `Rolled back to v${toVersion}.`,
        changes: [{ field: "version", before: `v${policies.find((p) => p.id === policyId)?.version ?? 0}`, after: `v${toVersion} (restored)` }],
      };
      setOverlay((prev) => ({
        ...prev,
        newPolicyRevisions: [rev, ...prev.newPolicyRevisions],
      }));
    },
    [overlay.newPolicyRevisions, policies, setOverlay],
  );

  const archivePolicy = useCallback(
    (id: string) => {
      setOverlay((prev) => ({
        ...prev,
        archivedPolicyIds: prev.archivedPolicyIds.includes(id)
          ? prev.archivedPolicyIds
          : [...prev.archivedPolicyIds, id],
      }));
    },
    [setOverlay],
  );

  const unarchivePolicy = useCallback(
    (id: string) => {
      setOverlay((prev) => ({
        ...prev,
        archivedPolicyIds: prev.archivedPolicyIds.filter((x) => x !== id),
      }));
    },
    [setOverlay],
  );

  const clonePolicy = useCallback(
    (sourceId: string, targetCohortId: string) => {
      const src = policies.find((p) => p.id === sourceId);
      if (!src) return null;
      const id = `pr-${targetCohortId}-${src.leaveTypeKey}-clone-${Date.now()}`;
      const clone: PolicyRule = {
        ...src,
        id,
        cohortId: targetCohortId,
        version: 1,
        effectiveFromISO: new Date().toISOString().slice(0, 10),
        archived: false,
      };
      setOverlay((prev) => ({
        ...prev,
        newPolicies: [...prev.newPolicies, clone],
        newPolicyRevisions: [
          {
            id: `rev-clone-${id}`,
            policyId: id,
            version: 1,
            authorName: HR_FULL_NAME,
            whenISO: new Date().toISOString(),
            whenLabel: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            summary: `Cloned from ${src.id}.`,
            changes: [{ field: "cohortId", before: src.cohortId, after: targetCohortId }],
          },
          ...prev.newPolicyRevisions,
        ],
      }));
      return clone;
    },
    [policies, setOverlay],
  );

  return {
    /* employee */
    requests,
    commentsByRequest,
    findRequest,
    cancel,
    addComment,
    /* manager */
    teamRequests,
    decisionLog,
    wellbeingSignals,
    activeSignals,
    decideTeamRequest,
    decideTeamRequestsBulk,
    dismissSignal,
    recordSignalAction,
    /* delegation */
    delegation,
    activeDelegate,
    escalationTriggered,
    setDelegation,
    addDelegationWindow,
    removeDelegationWindow,
    /* hr */
    hrAnomalies,
    anomalyQueue,
    recordAnomalyAction,
    orgRequests,
    hrInterventions,
    forceApproveRequest,
    forceCancelRequest,
    reassignApprover,
    /* agents */
    agents,
    findAgent,
    setAgentConfig,
    resetAgentConfig,
    globalAgentPause: overlay.globalAgentPause,
    setGlobalAgentPause,
    /* compliance */
    complianceFeed,
    recordComplianceAction,
    /* reports */
    warehouseSync,
    setWarehouseSync,
    pinnedReports,
    togglePinnedReport,
    /* audit + dsar + exports */
    auditLog,
    dsars,
    findDsar,
    updateDsar,
    appendDsarHistory,
    scheduledExports: exports_,
    toggleExportEnabled,
    runExportNow,
    /* roles + tenant */
    roles,
    findRole,
    togglePermission,
    resetRolePermissions,
    createCustomRole,
    deleteRole,
    tenantSettings,
    updateTenantSettings,
    resetTenantSettings,
    /* policies */
    policies,
    findPolicy,
    policyRevisions,
    savePolicy,
    rollbackPolicy,
    archivePolicy,
    unarchivePolicy,
    clonePolicy,
    /* misc */
    resetOverlay,
    managerName: MANAGER_FULL_NAME,
    managerInitials: MANAGER_INITIALS,
  };
}
