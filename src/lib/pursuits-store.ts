"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
import {
  PURSUITS,
  STAGE_INDEX,
  STAGES,
  type PursuitAuditEntry,
  type PursuitDeliverable,
  type PursuitGate,
  type PursuitRecord,
  type PursuitTask,
  type StageKey,
} from "@/components/presales/pursuits/data";

interface PursuitPatch {
  currentStage?: StageKey;
  outcome?: PursuitRecord["outcome"];
  outcomeReason?: string;
  /** Patches per task id. */
  taskPatches?: Record<string, Partial<PursuitTask>>;
  /** Patches per gate id. */
  gatePatches?: Record<string, Partial<PursuitGate>>;
  /** Patches per deliverable id. */
  deliverablePatches?: Record<string, Partial<PursuitDeliverable>>;
  /** Appended audit rows. */
  addedAudit?: PursuitAuditEntry[];
}

interface PursuitsOverlay {
  patches: Record<string, PursuitPatch>;
}

const DEFAULT_OVERLAY: PursuitsOverlay = { patches: {} };
const STORAGE_KEY = "o2s.presales.pursuits";

function normalize(raw: Partial<PursuitsOverlay> | null | undefined): PursuitsOverlay {
  const r = raw ?? {};
  return { patches: r.patches ?? {} };
}

function logAudit(action: string, detail: string, actor = "Anita Verma"): PursuitAuditEntry {
  const now = new Date();
  return {
    id: `aud-${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`,
    whenISO: now.toISOString(),
    whenLabel:
      now.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
      ", " +
      now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
    actor,
    action,
    detail,
  };
}

export function usePursuitsStore() {
  const [rawOverlay, setRawOverlay] = useLocalStorage<PursuitsOverlay>(STORAGE_KEY, DEFAULT_OVERLAY);
  const overlay = useMemo(() => normalize(rawOverlay), [rawOverlay]);

  const setOverlay = useCallback(
    (v: PursuitsOverlay | ((prev: PursuitsOverlay) => PursuitsOverlay)) => {
      if (typeof v === "function") {
        setRawOverlay((prev) => (v as (p: PursuitsOverlay) => PursuitsOverlay)(normalize(prev)));
      } else {
        setRawOverlay(v);
      }
    },
    [setRawOverlay],
  );

  const pursuits = useMemo<PursuitRecord[]>(() => {
    return PURSUITS.map((p) => {
      const patch = overlay.patches[p.id];
      if (!patch) return p;
      const tasks = patch.taskPatches
        ? p.tasks.map((t) => (patch.taskPatches![t.id] ? { ...t, ...patch.taskPatches![t.id] } : t))
        : p.tasks;
      const gates = patch.gatePatches
        ? p.gates.map((g) => (patch.gatePatches![g.id] ? { ...g, ...patch.gatePatches![g.id] } : g))
        : p.gates;
      const deliverables = patch.deliverablePatches
        ? p.deliverables.map((d) =>
            patch.deliverablePatches![d.id] ? { ...d, ...patch.deliverablePatches![d.id] } : d,
          )
        : p.deliverables;
      const audit = patch.addedAudit ? [...patch.addedAudit, ...p.audit] : p.audit;
      return {
        ...p,
        currentStage: patch.currentStage ?? p.currentStage,
        outcome: patch.outcome ?? p.outcome,
        outcomeReason: patch.outcomeReason ?? p.outcomeReason,
        tasks,
        gates,
        deliverables,
        audit,
      };
    });
  }, [overlay.patches]);

  const pursuitById = useCallback(
    (id: string) => pursuits.find((p) => p.id === id),
    [pursuits],
  );

  function applyPatch(id: string, fn: (prev: PursuitPatch) => PursuitPatch) {
    setOverlay((prev) => {
      const cur = prev.patches[id] ?? {};
      return { ...prev, patches: { ...prev.patches, [id]: fn(cur) } };
    });
  }

  const advanceStage = useCallback(
    (id: string) => {
      const current = pursuits.find((p) => p.id === id);
      if (!current) return;
      const curIdx = STAGE_INDEX[current.currentStage];
      if (curIdx >= STAGES.length - 1) return;
      const next = STAGES[curIdx + 1].key;
      applyPatch(id, (prev) => ({
        ...prev,
        currentStage: next,
        addedAudit: [
          logAudit("stage_advance", `${current.currentStage} → ${next}`),
          ...(prev.addedAudit ?? []),
        ],
      }));
    },
    [pursuits, setOverlay],
  );

  const setTaskStatus = useCallback(
    (pursuitId: string, taskId: string, status: PursuitTask["status"]) => {
      applyPatch(pursuitId, (prev) => ({
        ...prev,
        taskPatches: { ...(prev.taskPatches ?? {}), [taskId]: { status } },
        addedAudit: [
          logAudit("task_updated", `${taskId} → ${status}`),
          ...(prev.addedAudit ?? []),
        ],
      }));
    },
    [setOverlay],
  );

  const decideGate = useCallback(
    (pursuitId: string, gateId: string, decision: "approved" | "rejected", comment?: string) => {
      applyPatch(pursuitId, (prev) => ({
        ...prev,
        gatePatches: {
          ...(prev.gatePatches ?? {}),
          [gateId]: {
            status: decision,
            decidedISO: new Date().toISOString().slice(0, 10),
            comment,
          },
        },
        addedAudit: [
          logAudit(decision === "approved" ? "gate_approved" : "gate_rejected", `${gateId}${comment ? ` — ${comment}` : ""}`),
          ...(prev.addedAudit ?? []),
        ],
      }));
    },
    [setOverlay],
  );

  const setDeliverableStatus = useCallback(
    (pursuitId: string, deliverableId: string, status: PursuitDeliverable["status"]) => {
      applyPatch(pursuitId, (prev) => ({
        ...prev,
        deliverablePatches: {
          ...(prev.deliverablePatches ?? {}),
          [deliverableId]: { status, lastUpdatedISO: new Date().toISOString().slice(0, 10) },
        },
        addedAudit: [
          logAudit("deliverable_updated", `${deliverableId} → ${status}`),
          ...(prev.addedAudit ?? []),
        ],
      }));
    },
    [setOverlay],
  );

  const setOutcome = useCallback(
    (id: string, outcome: Exclude<PursuitRecord["outcome"], undefined>, reason: string) => {
      applyPatch(id, (prev) => ({
        ...prev,
        outcome,
        outcomeReason: reason,
        currentStage: "decision",
        addedAudit: [
          logAudit("outcome_logged", `${outcome} — ${reason}`),
          ...(prev.addedAudit ?? []),
        ],
      }));
    },
    [setOverlay],
  );

  const stats = useMemo(() => {
    const byStage = new Map<StageKey, number>();
    for (const p of pursuits) {
      if (p.outcome === "no_decision_yet") {
        byStage.set(p.currentStage, (byStage.get(p.currentStage) ?? 0) + 1);
      }
    }
    return {
      total: pursuits.length,
      inFlight: pursuits.filter((p) => p.outcome === "no_decision_yet").length,
      won:      pursuits.filter((p) => p.outcome === "won").length,
      lost:     pursuits.filter((p) => p.outcome === "lost").length,
      withdrawn: pursuits.filter((p) => p.outcome === "withdrawn").length,
      mustWin:  pursuits.filter((p) => p.type === "must_win" || p.isMustWin).length,
      tcvInFlight: pursuits
        .filter((p) => p.outcome === "no_decision_yet")
        .reduce((s, p) => s + p.tcvInr, 0),
      copYTD: pursuits.reduce((s, p) => s + p.copInr, 0),
      byStage,
    };
  }, [pursuits]);

  return {
    pursuits,
    pursuitById,
    advanceStage,
    setTaskStatus,
    decideGate,
    setDeliverableStatus,
    setOutcome,
    stats,
  };
}
