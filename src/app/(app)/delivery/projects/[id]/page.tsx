"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  FileText,
  GanttChart,
  Kanban as KanbanIcon,
  List,
  Target,
  Users,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import {
  KIND_TINT,
  METHODOLOGY_LABEL,
  PEOPLE_MAP,
  PROGRAMS_MAP,
  PRIORITY_TINT,
  RAG_DOT,
  RAG_TINT,
  STATUS_LABEL,
  STATUS_TINT,
  workItemsForProject as seedItemsForProject,
  type WorkItem,
  type WorkItemStatus,
} from "@/components/delivery/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

type Tab = "charter" | "list" | "kanban" | "gantt" | "calendar";

const TAB_META: Record<Tab, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  charter:  { label: "Charter",  icon: FileText },
  list:     { label: "List",     icon: List },
  kanban:   { label: "Kanban",   icon: KanbanIcon },
  gantt:    { label: "Gantt",    icon: GanttChart },
  calendar: { label: "Calendar", icon: CalendarDays },
};

const KANBAN_COLS: WorkItemStatus[] = ["backlog", "todo", "in_progress", "in_review", "blocked", "done"];

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { setScreen } = useScreen();
  const { findProject, workItems, moveWorkItem } = useDeliveryStore();
  const [tab, setTab] = useState<Tab>("charter");

  const project = findProject(id);
  const projectName = project?.name;

  useEffect(() => {
    if (!projectName) return;
    setScreen({ module: "Delivery", page: "Project", recordId: id, recordLabel: projectName });
    return () => setScreen(null);
  }, [id, projectName, setScreen]);

  const items = useMemo(() => {
    return workItems.filter((w) => w.projectId === id || w.alsoServesProjectIds?.includes(id));
  }, [workItems, id]);

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Project not found</h1>
        <Link href="/delivery/projects" className="text-brand underline mt-3 inline-block">Back to projects</Link>
      </div>
    );
  }

  const pm = PEOPLE_MAP[project.pmId];
  const program = PROGRAMS_MAP[project.programId];

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link href="/delivery/projects" className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{project.name}</h1>
              <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${RAG_TINT[project.rag]}`}>
                <span className={`size-1.5 rounded-full ${RAG_DOT[project.rag]}`} />
                {project.rag}
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-secondary text-foreground px-1.5 py-0.5 rounded">
                {METHODOLOGY_LABEL[project.methodology]}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{project.customer ?? "Internal"} · {program?.name}</p>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mt-1.5 flex-wrap">
              <span>Health: <strong className="text-foreground tabular-nums">{project.health}</strong></span>
              <span>·</span>
              <span>Budget: <strong className="text-foreground">₹{inrShort(project.spentINR)} / {inrShort(project.totalBudgetINR)}</strong></span>
              <span>·</span>
              <span>{project.charter.startISO} → {project.charter.endISO}</span>
            </div>
          </div>
        </div>
        {pm && (
          <div className="flex items-center gap-2">
            <span className={`size-8 rounded-full ${pm.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}>{pm.initials}</span>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">PM</p>
              <p className="text-[12px] text-foreground">{pm.name}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {(Object.keys(TAB_META) as Tab[]).map((t) => {
          const meta = TAB_META[t];
          const Icon = meta.icon;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {meta.label}
            </button>
          );
        })}
      </div>

      {tab === "charter" && <CharterPane project={project} />}
      {tab === "list" && <ListPane items={items} />}
      {tab === "kanban" && <KanbanPane items={items} onMove={moveWorkItem} />}
      {tab === "gantt" && <GanttPane items={items} project={project} />}
      {tab === "calendar" && <CalendarPane items={items} />}
    </div>
  );
}

/* ── Charter ── */
function CharterPane({ project }: { project: NonNullable<ReturnType<typeof useDeliveryStore>["projects"][number]> }) {
  const team = project.teamIds.map((id) => PEOPLE_MAP[id]).filter(Boolean);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <section className="bg-card border border-border rounded-xl p-4 lg:col-span-2 space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1 inline-flex items-center gap-1.5">
            <Target className="size-3" />
            Goal
          </p>
          <p className="text-sm text-foreground">{project.charter.goal}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">In scope</p>
            <ul className="space-y-1">
              {project.charter.scopeIn.map((s, i) => (
                <li key={i} className="text-[12px] text-foreground flex items-start gap-2"><span className="text-success">+</span><span>{s}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">Out of scope</p>
            <ul className="space-y-1">
              {project.charter.scopeOut.map((s, i) => (
                <li key={i} className="text-[12px] text-muted-foreground flex items-start gap-2"><span className="text-destructive">−</span><span>{s}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">Success metrics</p>
          <ul className="space-y-1">
            {project.charter.successMetrics.map((s, i) => (
              <li key={i} className="text-[12px] text-foreground flex items-start gap-2"><span className="text-brand">→</span><span>{s}</span></li>
            ))}
          </ul>
        </div>
      </section>
      <aside className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Sponsor</p>
          <p className="text-sm text-foreground">{project.charter.sponsor}</p>
        </div>
        <div className="border-t border-border pt-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Budget</p>
          <p className="text-lg font-bold text-foreground tabular-nums">₹{inrShort(project.charter.budgetINR)}</p>
        </div>
        <div className="border-t border-border pt-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Dates</p>
          <p className="text-[12px] text-foreground">{project.charter.startISO}</p>
          <p className="text-[12px] text-foreground">→ {project.charter.endISO}</p>
        </div>
        <div className="border-t border-border pt-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2 inline-flex items-center gap-1.5">
            <Users className="size-3" />
            Team ({team.length})
          </p>
          <ul className="space-y-1.5">
            {team.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-[12px]">
                <span className={`size-5 rounded-full ${m.avatarColor} text-white text-[8px] font-bold flex items-center justify-center`}>{m.initials}</span>
                <span className="text-foreground">{m.name}</span>
                <span className="text-muted-foreground ml-auto">{m.jobTitle}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

/* ── List view ── */
function ListPane({ items }: { items: WorkItem[] }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-surface-overlay/40 border-b border-border">
          <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            <th className="text-left px-4 py-2 font-semibold">Item</th>
            <th className="text-left px-3 py-2 font-semibold">Kind</th>
            <th className="text-left px-3 py-2 font-semibold">Status</th>
            <th className="text-left px-3 py-2 font-semibold">Priority</th>
            <th className="text-left px-3 py-2 font-semibold">Assignee</th>
            <th className="text-right px-3 py-2 font-semibold">Estimate</th>
            <th className="text-right px-4 py-2 font-semibold">Actual</th>
          </tr>
        </thead>
        <tbody>
          {items.map((w) => {
            const assignee = w.assigneeIds[0] ? PEOPLE_MAP[w.assigneeIds[0]] : null;
            return (
              <tr key={w.id} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                <td className="px-4 py-2">
                  <p className="text-sm text-foreground">{w.title}</p>
                  <code className="text-[10px] font-mono text-muted-foreground/60">{w.id}</code>
                </td>
                <td className="px-3 py-2">
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${KIND_TINT[w.kind]}`}>{w.kind}</span>
                </td>
                <td className="px-3 py-2">
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${STATUS_TINT[w.status]}`}>{STATUS_LABEL[w.status]}</span>
                </td>
                <td className="px-3 py-2">
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${PRIORITY_TINT[w.priority]}`}>{w.priority.toUpperCase()}</span>
                </td>
                <td className="px-3 py-2">
                  {assignee && (
                    <div className="flex items-center gap-1.5">
                      <span className={`size-5 rounded-full ${assignee.avatarColor} text-white text-[8px] font-bold flex items-center justify-center`}>{assignee.initials}</span>
                      <span className="text-[12px] text-foreground">{assignee.name}</span>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-right text-[12px] tabular-nums text-foreground">
                  {w.estimate ? `${w.estimate.value} ${w.estimate.unit === "points" ? "pts" : w.estimate.unit === "hours" ? "h" : w.estimate.unit === "tshirt" ? `(${["XS","S","M","L","XL","XXL"][w.estimate.value]})` : "$"}` : "—"}
                </td>
                <td className="px-4 py-2 text-right text-[12px] tabular-nums text-muted-foreground">{w.actualHours ?? "—"}{w.actualHours ? "h" : ""}</td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground italic">No work items.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ── Kanban view ── */
function KanbanPane({ items, onMove }: { items: WorkItem[]; onMove: (id: string, status: WorkItemStatus) => void }) {
  return (
    <div className="overflow-x-auto -mx-2">
      <div className="flex gap-2 px-2 min-w-max">
        {KANBAN_COLS.map((col) => {
          const colItems = items.filter((w) => w.status === col);
          return (
            <div key={col} className="w-72 shrink-0 bg-surface-overlay/30 border border-border rounded-xl flex flex-col max-h-screen">
              <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${STATUS_TINT[col]}`}>{STATUS_LABEL[col]}</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{colItems.length}</span>
                </div>
              </div>
              <ul className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin">
                {colItems.map((w) => {
                  const a = w.assigneeIds[0] ? PEOPLE_MAP[w.assigneeIds[0]] : null;
                  return (
                    <li key={w.id} className="bg-card border border-border rounded-lg p-2.5 hover:border-border/80 transition-colors">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${KIND_TINT[w.kind]}`}>{w.kind}</span>
                        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${PRIORITY_TINT[w.priority]}`}>{w.priority.toUpperCase()}</span>
                        {w.alsoServesProjectIds && w.alsoServesProjectIds.length > 0 && (
                          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple">x-project</span>
                        )}
                      </div>
                      <p className="text-[13px] text-foreground leading-snug">{w.title}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {a && <span className={`size-5 rounded-full ${a.avatarColor} text-white text-[8px] font-bold flex items-center justify-center`}>{a.initials}</span>}
                          {w.estimate && <span className="text-[10px] text-muted-foreground tabular-nums">{w.estimate.value}{w.estimate.unit === "points" ? "pt" : w.estimate.unit === "hours" ? "h" : ""}</span>}
                        </div>
                        <div className="flex items-center gap-0.5">
                          {KANBAN_COLS.map((target) => {
                            if (target === col) return null;
                            return (
                              <button
                                key={target}
                                onClick={() => onMove(w.id, target)}
                                title={`Move to ${STATUS_LABEL[target]}`}
                                className="size-4 rounded hover:bg-surface-overlay flex items-center justify-center text-muted-foreground/40 hover:text-foreground"
                              >
                                <span className={`size-1.5 rounded-full ${STATUS_TINT[target].split(" ")[0]}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </li>
                  );
                })}
                {colItems.length === 0 && (
                  <li className="text-[11px] text-muted-foreground/60 italic text-center py-6">None</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Gantt view (SVG) ── */
function GanttPane({ items, project }: { items: WorkItem[]; project: NonNullable<ReturnType<typeof useDeliveryStore>["projects"][number]> }) {
  // Show only items with dates
  const dated = items.filter((w) => w.startISO && w.endISO);
  const start = new Date(project.charter.startISO).getTime();
  const end = new Date(project.charter.endISO).getTime();
  const span = Math.max(1, end - start);

  // Month markers
  const months: { iso: string; label: string }[] = [];
  let cursor = new Date(start);
  cursor.setDate(1);
  while (cursor.getTime() < end) {
    months.push({
      iso: cursor.toISOString().slice(0, 10),
      label: cursor.toLocaleDateString("en-IN", { month: "short" }) + " " + (cursor.getFullYear() % 100),
    });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-200 relative">
          {/* Month header */}
          <div className="grid border-b border-border bg-surface-overlay/40" style={{ gridTemplateColumns: `220px repeat(${months.length}, 1fr)` }}>
            <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold border-r border-border">Item</div>
            {months.map((m) => (
              <div key={m.iso} className="px-2 py-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold text-center border-r border-border last:border-r-0">{m.label}</div>
            ))}
          </div>
          {/* Rows */}
          {dated.map((w) => {
            const s = new Date(w.startISO!).getTime();
            const e = new Date(w.endISO!).getTime();
            const leftPct = Math.max(0, ((s - start) / span) * 100);
            const widthPct = Math.max(2, ((e - s) / span) * 100);
            const a = w.assigneeIds[0] ? PEOPLE_MAP[w.assigneeIds[0]] : null;
            return (
              <div key={w.id} className="grid border-b border-border last:border-b-0" style={{ gridTemplateColumns: "220px 1fr" }}>
                <div className="px-3 py-2 text-[12px] text-foreground border-r border-border flex items-center gap-1.5 truncate">
                  <span className={`size-1.5 rounded-full shrink-0 ${KIND_TINT[w.kind].split(" ")[0]}`} />
                  <span className="truncate">{w.title}</span>
                </div>
                <div className="relative h-9">
                  <div
                    className={`absolute top-2 h-5 rounded ${STATUS_TINT[w.status].split(" ")[0]} flex items-center px-2 gap-1.5`}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  >
                    {a && <span className={`size-4 rounded-full ${a.avatarColor} text-white text-[8px] font-bold flex items-center justify-center shrink-0`}>{a.initials}</span>}
                    <span className="text-[10px] text-foreground truncate">{w.title}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {dated.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground italic">No scheduled items to chart.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Calendar view ── */
function CalendarPane({ items }: { items: WorkItem[] }) {
  // Group items by week of their startISO
  const byWeek: Record<string, WorkItem[]> = {};
  for (const w of items) {
    if (!w.startISO) continue;
    const d = new Date(w.startISO);
    const mon = new Date(d);
    mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const key = mon.toISOString().slice(0, 10);
    if (!byWeek[key]) byWeek[key] = [];
    byWeek[key].push(w);
  }
  const weeks = Object.keys(byWeek).sort();

  return (
    <div className="space-y-3">
      {weeks.map((w) => (
        <section key={w} className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-3 py-2 bg-surface-overlay/40 border-b border-border">
            <p className="text-[11px] font-semibold text-foreground">Week of {w}</p>
          </div>
          <ul>
            {byWeek[w].map((it) => (
              <li key={it.id} className="px-4 py-2 border-b border-border last:border-b-0 flex items-center gap-3">
                <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${STATUS_TINT[it.status]}`}>{STATUS_LABEL[it.status]}</span>
                <p className="text-sm text-foreground flex-1 truncate">{it.title}</p>
                <span className="text-[10px] text-muted-foreground tabular-nums">{it.startISO} → {it.endISO}</span>
                <ChevronRight className="size-3 text-muted-foreground/40" />
              </li>
            ))}
          </ul>
        </section>
      ))}
      {weeks.length === 0 && (
        <p className="text-sm text-muted-foreground italic text-center py-12">No scheduled items.</p>
      )}
    </div>
  );
}

function inrShort(n: number): string {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// Suppress unused warning for the seed helper (kept exported in data.ts for other consumers)
void seedItemsForProject;
