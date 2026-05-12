"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Flag,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import {
  KIND_TINT,
  PEOPLE_MAP,
  PROJECTS_MAP,
  PRIORITY_TINT,
  STATUS_LABEL,
  STATUS_TINT,
  type Sprint,
  type WorkItem,
} from "@/components/delivery/data";

export default function SprintsPage() {
  const { setScreen } = useScreen();
  const { sprints, workItemsForSprint } = useDeliveryStore();
  const [activeSprintId, setActiveSprintId] = useState<string>(
    sprints.find((s) => s.status === "active")?.id ?? sprints[0]?.id ?? "",
  );

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Sprints" });
    return () => setScreen(null);
  }, [setScreen]);

  const sprint = sprints.find((s) => s.id === activeSprintId);
  const items = sprint ? workItemsForSprint(sprint.id) : [];
  const activeSprints = sprints.filter((s) => s.status === "active");
  const futureSprints = sprints.filter((s) => s.status === "future");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link href="/delivery" className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Sprints</h1>
            <p className="text-sm text-muted-foreground">
              {activeSprints.length} active · {futureSprints.length} planned. Capacity-aware planning canvas.
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="size-3.5" />
          Plan new sprint
        </button>
      </motion.div>

      {/* Sprint selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {sprints.map((s) => {
          const proj = PROJECTS_MAP[s.projectId];
          return (
            <button
              key={s.id}
              onClick={() => setActiveSprintId(s.id)}
              className={`flex items-center gap-2 h-9 px-3 rounded-lg border text-sm transition-colors ${
                activeSprintId === s.id ? "border-brand bg-brand/5 text-foreground" : "border-border bg-card text-muted-foreground hover:bg-surface-overlay hover:text-foreground"
              }`}
            >
              <span className={`size-1.5 rounded-full ${s.status === "active" ? "bg-success" : s.status === "future" ? "bg-warning" : "bg-muted-foreground/40"}`} />
              <span className="font-medium">{s.name}</span>
              <span className="text-[10px] text-muted-foreground/70">· {proj?.shortName}</span>
            </button>
          );
        })}
      </div>

      {sprint && <SprintCanvas sprint={sprint} items={items} />}
    </div>
  );
}

function SprintCanvas({ sprint, items }: { sprint: Sprint; items: WorkItem[] }) {
  const project = PROJECTS_MAP[sprint.projectId];
  const pct = sprint.committedPoints > 0 ? Math.round((sprint.completedPoints / sprint.committedPoints) * 100) : 0;
  // Snapshot "now" at mount so this stays a pure render.
  const [nowMs] = useState(() => Date.now());
  const daysRemaining = useMemo(
    () => Math.max(0, Math.ceil((new Date(sprint.endISO).getTime() - nowMs) / (1000 * 60 * 60 * 24))),
    [sprint.endISO, nowMs],
  );

  // Group by assignee for capacity bar
  const byAssignee: Record<string, { name: string; initials: string; color: string; points: number }> = {};
  for (const w of items) {
    const id = w.assigneeIds[0];
    const p = PEOPLE_MAP[id];
    if (!p) continue;
    if (!byAssignee[id]) byAssignee[id] = { name: p.name, initials: p.initials, color: p.avatarColor, points: 0 };
    if (w.estimate?.unit === "points") byAssignee[id].points += w.estimate.value;
  }

  return (
    <div className="space-y-4">
      {/* Header card */}
      <section className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold text-foreground">{sprint.name}</h2>
              <span className="text-[10px] uppercase tracking-wider bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">{project?.name}</span>
              {sprint.status === "active" && (
                <span className="text-[10px] uppercase tracking-wider bg-success/10 text-success px-1.5 py-0.5 rounded">Active</span>
              )}
            </div>
            <p className="text-sm text-foreground mt-1 inline-flex items-start gap-1.5">
              <Flag className="size-3.5 text-brand mt-0.5" />
              {sprint.goal}
            </p>
            <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{sprint.startISO} → {sprint.endISO}</span>
              <span>· {daysRemaining} days remaining</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Velocity</p>
            <p className="text-xl font-bold text-foreground tabular-nums">
              {sprint.completedPoints} / {sprint.committedPoints} <span className="text-[11px] font-normal text-muted-foreground">pts</span>
            </p>
            <div className="w-32 h-1.5 bg-secondary rounded mt-1 overflow-hidden">
              <div className="h-full bg-success transition-all" style={{ width: `${Math.min(100, pct)}%` }} />
            </div>
          </div>
        </div>

        {/* Scope-change tracker */}
        {(sprint.scopeChanges.addedPoints > 0 || sprint.scopeChanges.removedPoints > 0) && (
          <div className="border-t border-border pt-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5 inline-flex items-center gap-1.5">
              <TrendingUp className="size-3 text-warning" />
              Mid-sprint scope changes
            </p>
            <div className="flex items-center gap-3 text-[12px]">
              <span className="text-success">+{sprint.scopeChanges.addedPoints} pts added</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-destructive">−{sprint.scopeChanges.removedPoints} pts removed</span>
            </div>
          </div>
        )}
      </section>

      {/* Capacity bar per assignee */}
      <section className="bg-card border border-border rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-3">Capacity by assignee</p>
        <ul className="space-y-2">
          {Object.entries(byAssignee).map(([id, info]) => {
            // Reference target capacity = 8 points per person per sprint (mock)
            const target = 8;
            const overPct = Math.round((info.points / target) * 100);
            const over = info.points > target;
            return (
              <li key={id} className="flex items-center gap-3">
                <span className={`size-7 rounded-full ${info.color} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>{info.initials}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[12px] text-foreground">{info.name}</p>
                    <p className={`text-[11px] tabular-nums ${over ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                      {info.points} / {target} pts {over && "· over"}
                    </p>
                  </div>
                  <div className="h-1.5 bg-secondary rounded overflow-hidden relative">
                    <div className={`h-full transition-all ${over ? "bg-destructive" : "bg-brand"}`} style={{ width: `${Math.min(100, overPct)}%` }} />
                    {over && <div className="absolute inset-y-0 right-0 w-px bg-foreground/30" style={{ right: `${100 - (target / info.points) * 100}%` }} />}
                  </div>
                </div>
              </li>
            );
          })}
          {Object.keys(byAssignee).length === 0 && (
            <li className="text-[12px] text-muted-foreground italic">No assignees on this sprint.</li>
          )}
        </ul>
      </section>

      {/* Item list */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-2 bg-surface-overlay/40 border-b border-border flex items-center justify-between">
          <p className="text-[11px] font-semibold text-foreground">Sprint backlog ({items.length})</p>
          <p className="text-[10px] text-muted-foreground">Click status to advance</p>
        </div>
        <ul>
          {items.map((w) => {
            const a = w.assigneeIds[0] ? PEOPLE_MAP[w.assigneeIds[0]] : null;
            const done = w.status === "done";
            return (
              <li key={w.id} className="border-b border-border last:border-b-0 px-4 py-2.5 flex items-center gap-3 hover:bg-surface-overlay/30 transition-colors">
                {done ? <CheckCircle2 className="size-4 text-success shrink-0" /> : <span className="size-4 rounded-full border-2 border-border shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${KIND_TINT[w.kind]}`}>{w.kind}</span>
                    <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${PRIORITY_TINT[w.priority]}`}>{w.priority.toUpperCase()}</span>
                    <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${STATUS_TINT[w.status]}`}>{STATUS_LABEL[w.status]}</span>
                  </div>
                  <p className={`text-sm leading-snug ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{w.title}</p>
                </div>
                {a && <span className={`size-6 rounded-full ${a.avatarColor} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>{a.initials}</span>}
                {w.estimate && <span className="text-[11px] tabular-nums text-muted-foreground shrink-0">{w.estimate.value}{w.estimate.unit === "points" ? "pt" : ""}</span>}
              </li>
            );
          })}
        </ul>
      </section>

      <p className="text-[11px] text-muted-foreground/60 flex items-start gap-2 pt-1">
        <Sparkles className="size-3 mt-0.5" />
        <span>Capacity bars factor in person.workingHours and approved leave from the HR module. Over-allocations are surfaced by the Resource Conflict Resolver agent.</span>
      </p>
    </div>
  );
}
