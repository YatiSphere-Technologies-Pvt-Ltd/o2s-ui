"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
import type {
  AgentAutonomy,
  AgentDecision,
  AgentDecisionOutcome,
  AgentRegistry,
  AgentScope,
  AgentSpec,
} from "@/components/agents/types";

interface AgentConfigOverride {
  status?: boolean;
  autonomy?: AgentAutonomy;
  scope?: AgentScope;
}

export interface AgentAuditEntry {
  id: string;
  agentId: string;
  whenISO: string;
  whenLabel: string;
  actor: string;
  action: "status_changed" | "autonomy_changed" | "scope_changed" | "reset" | "global_pause" | "global_resume";
  before: string;
  after: string;
  note?: string;
}

interface TowerOverlay {
  /** Per-agent config patches. */
  agentConfigs: Record<string, AgentConfigOverride>;
  /** Module-wide kill switch. */
  globalPause: boolean;
  /** Decisions humans have overridden (decisionId → "approve" | "reject"). */
  decisionOverrides: Record<string, "approved" | "rejected">;
  /** Audit log appended by the user. */
  audit: AgentAuditEntry[];
}

const DEFAULT_OVERLAY: TowerOverlay = {
  agentConfigs: {},
  globalPause: false,
  decisionOverrides: {},
  audit: [],
};

function normalize(raw: Partial<TowerOverlay> | undefined | null): TowerOverlay {
  const r = raw ?? {};
  return {
    agentConfigs: r.agentConfigs ?? {},
    globalPause: r.globalPause ?? false,
    decisionOverrides: r.decisionOverrides ?? {},
    audit: r.audit ?? [],
  };
}

export interface EffectiveAgent {
  spec: AgentSpec;
  status: boolean;
  autonomy: AgentAutonomy;
  scope: AgentScope;
  isCustomised: boolean;
}

/**
 * Reusable hook. Each module wires its own registry and gets a typed
 * agent tower store. Persistence is namespaced by registry.module.
 */
export function useAgentTower(registry: AgentRegistry) {
  const key = `o2s.agentTower.${registry.module}`;
  const [rawOverlay, setRawOverlay] = useLocalStorage<TowerOverlay>(key, DEFAULT_OVERLAY);
  const overlay = useMemo(() => normalize(rawOverlay), [rawOverlay]);

  const setOverlay = useCallback(
    (v: TowerOverlay | ((prev: TowerOverlay) => TowerOverlay)) => {
      if (typeof v === "function") {
        setRawOverlay((prev) => (v as (p: TowerOverlay) => TowerOverlay)(normalize(prev)));
      } else {
        setRawOverlay(v);
      }
    },
    [setRawOverlay],
  );

  function logAudit(entry: Omit<AgentAuditEntry, "id" | "whenISO" | "whenLabel" | "actor">): AgentAuditEntry {
    const now = new Date();
    return {
      id: `aa-${now.getTime()}`,
      whenISO: now.toISOString(),
      whenLabel:
        now.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
        ", " +
        now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
      actor: "Anita Verma",
      ...entry,
    };
  }

  const agents = useMemo<EffectiveAgent[]>(() => {
    return registry.agents.map((spec) => {
      const o = overlay.agentConfigs[spec.id];
      const status = overlay.globalPause ? false : o?.status ?? spec.defaultStatus;
      const autonomy = o?.autonomy ?? spec.defaultAutonomy;
      const scope = o?.scope ?? spec.defaultScope;
      const isCustomised =
        !!o && (o.status !== undefined || o.autonomy !== undefined || o.scope !== undefined);
      return { spec, status, autonomy, scope, isCustomised };
    });
  }, [overlay.agentConfigs, overlay.globalPause, registry.agents]);

  const findAgent = useCallback(
    (id: string): EffectiveAgent | undefined => agents.find((a) => a.spec.id === id),
    [agents],
  );

  const setAgentConfig = useCallback(
    (id: string, patch: AgentConfigOverride) => {
      setOverlay((prev) => {
        const before = prev.agentConfigs[id] ?? {};
        const spec = registry.agents.find((s) => s.id === id);
        if (!spec) return prev;
        const auditRows: AgentAuditEntry[] = [];
        if (patch.status !== undefined && patch.status !== (before.status ?? spec.defaultStatus)) {
          auditRows.push(
            logAudit({
              agentId: id,
              action: "status_changed",
              before: String(before.status ?? spec.defaultStatus),
              after: String(patch.status),
            }),
          );
        }
        if (patch.autonomy !== undefined && patch.autonomy !== (before.autonomy ?? spec.defaultAutonomy)) {
          auditRows.push(
            logAudit({
              agentId: id,
              action: "autonomy_changed",
              before: before.autonomy ?? spec.defaultAutonomy,
              after: patch.autonomy,
            }),
          );
        }
        if (patch.scope !== undefined) {
          auditRows.push(
            logAudit({
              agentId: id,
              action: "scope_changed",
              before: (before.scope ?? spec.defaultScope).cohorts.join(", "),
              after: patch.scope.cohorts.join(", "),
            }),
          );
        }
        return {
          ...prev,
          agentConfigs: { ...prev.agentConfigs, [id]: { ...before, ...patch } },
          audit: [...auditRows, ...prev.audit],
        };
      });
    },
    [registry.agents, setOverlay],
  );

  const resetAgent = useCallback(
    (id: string) => {
      setOverlay((prev) => {
        const next = { ...prev.agentConfigs };
        delete next[id];
        const audit = logAudit({ agentId: id, action: "reset", before: "customised", after: "defaults" });
        return { ...prev, agentConfigs: next, audit: [audit, ...prev.audit] };
      });
    },
    [setOverlay],
  );

  const setGlobalPause = useCallback(
    (paused: boolean) => {
      setOverlay((prev) => ({
        ...prev,
        globalPause: paused,
        audit: [
          logAudit({
            agentId: "_module",
            action: paused ? "global_pause" : "global_resume",
            before: paused ? "running" : "paused",
            after: paused ? "paused" : "running",
          }),
          ...prev.audit,
        ],
      }));
    },
    [setOverlay],
  );

  /* ── Decisions feed ── */

  const decisions = useMemo<AgentDecision[]>(() => {
    return registry.decisions
      .map<AgentDecision>((d) => {
        const ov = overlay.decisionOverrides[d.id];
        if (!ov) return d;
        const outcome: AgentDecisionOutcome = ov === "approved" ? "executed" : "rejected";
        return { ...d, outcome };
      })
      .sort((a, b) => b.whenISO.localeCompare(a.whenISO));
  }, [registry.decisions, overlay.decisionOverrides]);

  const approveDecision = useCallback(
    (id: string) => {
      setOverlay((prev) => ({
        ...prev,
        decisionOverrides: { ...prev.decisionOverrides, [id]: "approved" },
      }));
    },
    [setOverlay],
  );

  const rejectDecision = useCallback(
    (id: string) => {
      setOverlay((prev) => ({
        ...prev,
        decisionOverrides: { ...prev.decisionOverrides, [id]: "rejected" },
      }));
    },
    [setOverlay],
  );

  /* ── Stats ── */

  // Snapshot "now" once at hook mount so the memo stays pure across renders.
  const [nowMs] = useState(() => Date.now());

  const stats = useMemo(() => {
    const live = agents.filter((a) => a.status).length;
    const total = agents.length;
    const customised = agents.filter((a) => a.isCustomised).length;
    const last24h = decisions.filter(
      (d) => nowMs - new Date(d.whenISO).getTime() < 24 * 60 * 60_000,
    ).length;
    const pendingReview = decisions.filter((d) => d.outcome === "pending_review").length;
    const overrideRate =
      agents.length === 0
        ? 0
        : agents.reduce((sum, a) => sum + a.spec.overrideRate30d, 0) / agents.length;
    const accuracy =
      agents.length === 0
        ? 0
        : agents.reduce((sum, a) => sum + a.spec.accuracy30d, 0) / agents.length;
    return {
      live,
      total,
      customised,
      last24h,
      pendingReview,
      overrideRate,
      accuracy,
      globalPause: overlay.globalPause,
    };
  }, [agents, decisions, overlay.globalPause, nowMs]);

  return {
    agents,
    findAgent,
    setAgentConfig,
    resetAgent,
    globalPause: overlay.globalPause,
    setGlobalPause,
    decisions,
    approveDecision,
    rejectDecision,
    findTrace: useCallback((id: string) => registry.traces[id], [registry.traces]),
    audit: overlay.audit,
    stats,
  };
}
