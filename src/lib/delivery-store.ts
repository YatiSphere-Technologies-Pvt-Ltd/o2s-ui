"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
import {
  ALLOCATIONS,
  DEPENDENCIES,
  PROJECTS,
  RELEASES,
  SPRINTS,
  TIME_ENTRIES,
  WORK_ITEMS,
  type Allocation,
  type Dependency,
  type Project,
  type Release,
  type Sprint,
  type TimeEntry,
  type WorkItem,
  type WorkItemStatus,
} from "@/components/delivery/data";

interface DeliveryOverlay {
  /** Patches per work item id. */
  workItemPatches: Record<string, Partial<WorkItem>>;
  /** Work items added on top of seed. */
  newWorkItems: WorkItem[];
  /** Time entries appended (drafts + submissions). */
  newTimeEntries: TimeEntry[];
  /** Time-entry status overrides. */
  timeEntryStatus: Record<string, TimeEntry["status"]>;
  /** Sprint patches. */
  sprintPatches: Record<string, Partial<Sprint>>;
  /** Allocation deltas (% adjustments). */
  allocationPatches: Record<string, { pct?: number; kind?: Allocation["kind"] }>;
  /** Allocations created by the matrix editor. */
  newAllocations: Allocation[];
  /** Ad-hoc project labels created in the matrix (when not picked from seed). */
  adHocProjects: Record<string, { id: string; name: string; shortName: string }>;
  /** Per-day allocation overrides. Key = `${personId}__${projectId}__${dateISO}`. */
  dailyAllocations: Record<string, number>;
  /** Project rag/health overrides. */
  projectPatches: Record<string, Partial<Project>>;
  /** Release status patches. */
  releasePatches: Record<string, Partial<Release>>;
  /** Dependency status overrides. */
  dependencyPatches: Record<string, Partial<Dependency>>;
}

const DEFAULT_OVERLAY: DeliveryOverlay = {
  workItemPatches: {},
  newWorkItems: [],
  newTimeEntries: [],
  timeEntryStatus: {},
  sprintPatches: {},
  allocationPatches: {},
  newAllocations: [],
  adHocProjects: {},
  dailyAllocations: {},
  projectPatches: {},
  releasePatches: {},
  dependencyPatches: {},
};

function normalize(raw: Partial<DeliveryOverlay> | undefined | null): DeliveryOverlay {
  const r = raw ?? {};
  return {
    workItemPatches: r.workItemPatches ?? {},
    newWorkItems: r.newWorkItems ?? [],
    newTimeEntries: r.newTimeEntries ?? [],
    timeEntryStatus: r.timeEntryStatus ?? {},
    sprintPatches: r.sprintPatches ?? {},
    allocationPatches: r.allocationPatches ?? {},
    newAllocations: r.newAllocations ?? [],
    adHocProjects: r.adHocProjects ?? {},
    dailyAllocations: r.dailyAllocations ?? {},
    projectPatches: r.projectPatches ?? {},
    releasePatches: r.releasePatches ?? {},
    dependencyPatches: r.dependencyPatches ?? {},
  };
}

export function useDeliveryStore() {
  const [raw, setRaw] = useLocalStorage<DeliveryOverlay>("o2s.deliveryOverlay", DEFAULT_OVERLAY);
  const overlay = useMemo(() => normalize(raw), [raw]);

  const setOverlay = useCallback(
    (v: DeliveryOverlay | ((prev: DeliveryOverlay) => DeliveryOverlay)) => {
      if (typeof v === "function") {
        setRaw((prev) => (v as (p: DeliveryOverlay) => DeliveryOverlay)(normalize(prev)));
      } else {
        setRaw(v);
      }
    },
    [setRaw],
  );

  /* ── Work items ── */

  const workItems = useMemo<WorkItem[]>(() => {
    const base = WORK_ITEMS.map((w) => {
      const patch = overlay.workItemPatches[w.id];
      return patch ? { ...w, ...patch } : w;
    });
    return [...base, ...overlay.newWorkItems];
  }, [overlay.workItemPatches, overlay.newWorkItems]);

  const findWorkItem = useCallback(
    (id: string) => workItems.find((w) => w.id === id),
    [workItems],
  );

  const updateWorkItem = useCallback(
    (id: string, patch: Partial<WorkItem>) => {
      setOverlay((prev) => ({
        ...prev,
        workItemPatches: { ...prev.workItemPatches, [id]: { ...(prev.workItemPatches[id] ?? {}), ...patch } },
      }));
    },
    [setOverlay],
  );

  const moveWorkItem = useCallback(
    (id: string, status: WorkItemStatus) => updateWorkItem(id, { status }),
    [updateWorkItem],
  );

  const addWorkItem = useCallback(
    (input: Omit<WorkItem, "id">) => {
      const id = `w-new-${Date.now()}`;
      const item: WorkItem = { ...input, id };
      setOverlay((prev) => ({ ...prev, newWorkItems: [...prev.newWorkItems, item] }));
      return item;
    },
    [setOverlay],
  );

  /* ── Sprints ── */

  const sprints = useMemo<Sprint[]>(() => {
    return SPRINTS.map((s) => {
      const patch = overlay.sprintPatches[s.id];
      return patch ? { ...s, ...patch } : s;
    });
  }, [overlay.sprintPatches]);

  const findSprint = useCallback((id: string) => sprints.find((s) => s.id === id), [sprints]);

  const workItemsForSprint = useCallback(
    (sprintId: string) => workItems.filter((w) => w.sprintId === sprintId),
    [workItems],
  );

  /* ── Allocations ── */

  const allocations = useMemo<Allocation[]>(() => {
    const base = ALLOCATIONS.map((a) => {
      const patch = overlay.allocationPatches[a.id];
      return patch ? { ...a, ...patch } : a;
    });
    return [...base, ...overlay.newAllocations];
  }, [overlay.allocationPatches, overlay.newAllocations]);

  const updateAllocation = useCallback(
    (id: string, patch: Partial<Allocation>) => {
      setOverlay((prev) => ({
        ...prev,
        allocationPatches: { ...prev.allocationPatches, [id]: { ...(prev.allocationPatches[id] ?? {}), ...patch } },
      }));
    },
    [setOverlay],
  );

  /** Add a new allocation row. */
  const addAllocation = useCallback(
    (input: Omit<Allocation, "id">) => {
      const id = `al-new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setOverlay((prev) => ({
        ...prev,
        newAllocations: [...prev.newAllocations, { ...input, id }],
      }));
      return id;
    },
    [setOverlay],
  );

  /** Delete an allocation row by id (only works for newly added ones). */
  const deleteAllocation = useCallback(
    (id: string) => {
      setOverlay((prev) => ({
        ...prev,
        newAllocations: prev.newAllocations.filter((a) => a.id !== id),
        allocationPatches: Object.fromEntries(Object.entries(prev.allocationPatches).filter(([k]) => k !== id)),
      }));
    },
    [setOverlay],
  );

  /** Register an ad-hoc project label (not in PROJECTS seed). Returns project id. */
  const addAdHocProject = useCallback(
    (name: string): string => {
      const trimmed = name.trim();
      if (!trimmed) return "";
      const id = `p-adhoc-${trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 32)}-${Date.now().toString(36).slice(-4)}`;
      const shortName = trimmed.length > 20 ? trimmed.slice(0, 20) + "…" : trimmed;
      setOverlay((prev) => ({
        ...prev,
        adHocProjects: { ...prev.adHocProjects, [id]: { id, name: trimmed, shortName } },
      }));
      return id;
    },
    [setOverlay],
  );

  const adHocProjects = useMemo(() => Object.values(overlay.adHocProjects), [overlay.adHocProjects]);

  /* ── Daily allocations (override per-day on top of weekly) ── */

  const dailyAllocations = useMemo(() => overlay.dailyAllocations, [overlay.dailyAllocations]);

  /**
   * Returns the effective % for a person+project on a specific date.
   * Day-level override wins; otherwise falls back to the weekly value.
   */
  const dailyAllocationFor = useCallback(
    (personId: string, projectId: string, dateISO: string): number => {
      const dayKey = `${personId}__${projectId}__${dateISO}`;
      if (overlay.dailyAllocations[dayKey] !== undefined) return overlay.dailyAllocations[dayKey];
      // Fall back to weekly (find the Monday of this date — using local-noon parse so
      // we don't cross midnight in timezones west of UTC).
      const [y, m, d] = dateISO.split("-").map((n) => parseInt(n, 10));
      const local = new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0);
      const day = local.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const monday = new Date(local);
      monday.setDate(local.getDate() + diff);
      const my = monday.getFullYear();
      const mm = String(monday.getMonth() + 1).padStart(2, "0");
      const md = String(monday.getDate()).padStart(2, "0");
      const weekISO = `${my}-${mm}-${md}`;
      const weekly = allocations.find(
        (a) => a.personId === personId && a.projectId === projectId && a.weekISO === weekISO,
      );
      return weekly?.pct ?? 0;
    },
    [overlay.dailyAllocations, allocations],
  );

  /**
   * Set a per-day allocation. Passing 0 clears the override (falls back to weekly).
   */
  const setDailyAllocation = useCallback(
    (personId: string, projectId: string, dateISO: string, pct: number) => {
      const clamped = Math.max(0, Math.min(200, Math.round(pct)));
      const key = `${personId}__${projectId}__${dateISO}`;
      setOverlay((prev) => {
        const next = { ...prev.dailyAllocations };
        if (clamped === 0) {
          // Persist 0 explicitly so user-cleared days don't fall back to weekly value.
          next[key] = 0;
        } else {
          next[key] = clamped;
        }
        return { ...prev, dailyAllocations: next };
      });
    },
    [setOverlay],
  );

  /**
   * Clear a per-day override entirely (so the day falls back to weekly again).
   */
  const clearDailyAllocation = useCallback(
    (personId: string, projectId: string, dateISO: string) => {
      const key = `${personId}__${projectId}__${dateISO}`;
      setOverlay((prev) => {
        const next = { ...prev.dailyAllocations };
        delete next[key];
        return { ...prev, dailyAllocations: next };
      });
    },
    [setOverlay],
  );

  /* ── Projects ── */

  const projects = useMemo<Project[]>(() => {
    return PROJECTS.map((p) => {
      const patch = overlay.projectPatches[p.id];
      return patch ? { ...p, ...patch } : p;
    });
  }, [overlay.projectPatches]);

  const findProject = useCallback((id: string) => projects.find((p) => p.id === id), [projects]);

  /* ── Releases ── */

  const releases = useMemo<Release[]>(() => {
    return RELEASES.map((r) => {
      const patch = overlay.releasePatches[r.id];
      return patch ? { ...r, ...patch } : r;
    });
  }, [overlay.releasePatches]);

  const findRelease = useCallback((id: string) => releases.find((r) => r.id === id), [releases]);

  const updateRelease = useCallback(
    (id: string, patch: Partial<Release>) => {
      setOverlay((prev) => ({
        ...prev,
        releasePatches: { ...prev.releasePatches, [id]: { ...(prev.releasePatches[id] ?? {}), ...patch } },
      }));
    },
    [setOverlay],
  );

  /* ── Dependencies ── */

  const dependencies = useMemo<Dependency[]>(() => {
    return DEPENDENCIES.map((d) => {
      const patch = overlay.dependencyPatches[d.id];
      return patch ? { ...d, ...patch } : d;
    });
  }, [overlay.dependencyPatches]);

  /* ── Time entries ── */

  const timeEntries = useMemo<TimeEntry[]>(() => {
    const base = TIME_ENTRIES.map((t) => {
      const status = overlay.timeEntryStatus[t.id];
      return status ? { ...t, status } : t;
    });
    return [...base, ...overlay.newTimeEntries];
  }, [overlay.timeEntryStatus, overlay.newTimeEntries]);

  const setTimeEntryStatus = useCallback(
    (id: string, status: TimeEntry["status"]) => {
      setOverlay((prev) => ({
        ...prev,
        timeEntryStatus: { ...prev.timeEntryStatus, [id]: status },
      }));
    },
    [setOverlay],
  );

  const addTimeEntry = useCallback(
    (input: Omit<TimeEntry, "id">) => {
      const id = `te-new-${Date.now()}`;
      const t: TimeEntry = { ...input, id };
      setOverlay((prev) => ({ ...prev, newTimeEntries: [...prev.newTimeEntries, t] }));
      return t;
    },
    [setOverlay],
  );

  /* ── Reset ── */

  const resetOverlay = useCallback(() => setOverlay(DEFAULT_OVERLAY), [setOverlay]);

  return {
    workItems,
    findWorkItem,
    updateWorkItem,
    moveWorkItem,
    addWorkItem,
    workItemsForSprint,
    sprints,
    findSprint,
    allocations,
    updateAllocation,
    addAllocation,
    deleteAllocation,
    addAdHocProject,
    adHocProjects,
    dailyAllocations,
    dailyAllocationFor,
    setDailyAllocation,
    clearDailyAllocation,
    projects,
    findProject,
    releases,
    findRelease,
    updateRelease,
    dependencies,
    timeEntries,
    setTimeEntryStatus,
    addTimeEntry,
    resetOverlay,
  };
}
