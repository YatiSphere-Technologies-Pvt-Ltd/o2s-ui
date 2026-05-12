"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Filter as FilterIcon,
  Search,
  Sigma,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import {
  KIND_TINT,
  PEOPLE_MAP,
  PROJECTS_MAP,
  PRIORITY_TINT,
  riceScore,
  wsjfScore,
  type WorkItem,
} from "@/components/delivery/data";

type SortBy = "rice" | "wsjf" | "moscow" | "priority";
type Moscow = "must" | "should" | "could" | "wont";

function moscowOf(w: WorkItem): Moscow {
  if (w.priority === "p0") return "must";
  if (w.priority === "p1") return "should";
  if (w.priority === "p2") return "could";
  return "wont";
}

const MOSCOW_TINT: Record<Moscow, string> = {
  must: "bg-destructive/10 text-destructive",
  should: "bg-warning/10 text-warning",
  could: "bg-brand/10 text-brand",
  wont: "bg-secondary text-muted-foreground",
};
const MOSCOW_LABEL: Record<Moscow, string> = { must: "Must", should: "Should", could: "Could", wont: "Won't" };

export default function BacklogPage() {
  const { setScreen } = useScreen();
  const { workItems, projects } = useDeliveryStore();
  const [query, setQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("rice");

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Backlog" });
    return () => setScreen(null);
  }, [setScreen]);

  const epicGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = workItems
      .filter((w) => {
        if (projectFilter !== "all" && w.projectId !== projectFilter) return false;
        if (w.kind === "epic") return true; // always show epics
        // We're in product backlog, so anything not yet in a sprint
        return !w.sprintId;
      })
      .filter((w) => {
        if (!q) return true;
        return w.title.toLowerCase().includes(q);
      });

    const groups: Record<string, { epic: WorkItem | null; children: WorkItem[] }> = { "_no_epic": { epic: null, children: [] } };
    for (const w of items) {
      if (w.kind === "epic") {
        if (!groups[w.id]) groups[w.id] = { epic: w, children: [] };
        else groups[w.id].epic = w;
      } else {
        const key = w.parentId ?? "_no_epic";
        if (!groups[key]) groups[key] = { epic: null, children: [] };
        groups[key].children.push(w);
      }
    }

    // Sort children inside each group
    Object.values(groups).forEach((g) => {
      g.children.sort((a, b) => {
        if (sortBy === "rice") return (b.rice ? riceScore(b.rice) : 0) - (a.rice ? riceScore(a.rice) : 0);
        if (sortBy === "wsjf") return (b.wsjf ? wsjfScore(b.wsjf) : 0) - (a.wsjf ? wsjfScore(a.wsjf) : 0);
        if (sortBy === "moscow") return moscowRank(moscowOf(a)) - moscowRank(moscowOf(b));
        return priorityRank(a.priority) - priorityRank(b.priority);
      });
    });

    return Object.values(groups).filter((g) => g.epic || g.children.length > 0);
  }, [workItems, projectFilter, query, sortBy]);

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Backlog</h1>
            <p className="text-sm text-muted-foreground">Epic → story hierarchy. Prioritise with RICE, WSJF, MoSCoW, or P-levels.</p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search backlog items…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="size-3.5 text-muted-foreground" />
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          {(["rice", "wsjf", "moscow", "priority"] as SortBy[]).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`h-9 px-2.5 rounded-lg text-[11px] transition-colors ${
                sortBy === s ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Epic groups */}
      <div className="space-y-4">
        {epicGroups.map((g, i) => (
          <section key={g.epic?.id ?? `_no_${i}`} className="bg-card border border-border rounded-xl overflow-hidden">
            {g.epic && (
              <div className="px-4 py-3 border-b border-border bg-surface-overlay/40">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${KIND_TINT[g.epic.kind]}`}>Epic</span>
                  <p className="text-sm font-semibold text-foreground">{g.epic.title}</p>
                  <code className="text-[10px] font-mono text-muted-foreground/60">{g.epic.id}</code>
                  <span className="ml-auto text-[11px] text-muted-foreground">{g.children.length} stor{g.children.length === 1 ? "y" : "ies"}</span>
                </div>
              </div>
            )}
            <table className="w-full text-sm">
              <thead className="bg-surface-overlay/20 border-b border-border">
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  <th className="text-left px-4 py-2 font-semibold">Story</th>
                  <th className="text-left px-3 py-2 font-semibold">Project</th>
                  <th className="text-left px-3 py-2 font-semibold">MoSCoW</th>
                  <th className="text-right px-3 py-2 font-semibold">RICE</th>
                  <th className="text-right px-3 py-2 font-semibold">WSJF</th>
                  <th className="text-right px-3 py-2 font-semibold">Estimate</th>
                  <th className="text-left px-4 py-2 font-semibold">Owner</th>
                </tr>
              </thead>
              <tbody>
                {g.children.map((w) => {
                  const r = w.rice ? riceScore(w.rice) : null;
                  const ws = w.wsjf ? wsjfScore(w.wsjf) : null;
                  const owner = w.assigneeIds[0] ? PEOPLE_MAP[w.assigneeIds[0]] : null;
                  const project = PROJECTS_MAP[w.projectId];
                  const mo = moscowOf(w);
                  return (
                    <tr key={w.id} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${KIND_TINT[w.kind]}`}>{w.kind}</span>
                          <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${PRIORITY_TINT[w.priority]}`}>{w.priority.toUpperCase()}</span>
                          <p className="text-sm text-foreground">{w.title}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[11px] text-muted-foreground">{project?.shortName}</td>
                      <td className="px-3 py-2">
                        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${MOSCOW_TINT[mo]}`}>{MOSCOW_LABEL[mo]}</span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        {r !== null ? (
                          <span className="text-[12px] tabular-nums font-medium text-foreground" title={`R=${w.rice!.reach} I=${w.rice!.impact} C=${w.rice!.confidence}% E=${w.rice!.effort}`}>
                            {r}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {ws !== null ? (
                          <span className="text-[12px] tabular-nums font-medium text-foreground" title={`BV=${w.wsjf!.businessValue} TC=${w.wsjf!.timeCriticality} RR=${w.wsjf!.riskReduction} JS=${w.wsjf!.jobSize}`}>
                            {ws}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-[12px] tabular-nums text-foreground">
                        {w.estimate ? `${w.estimate.value}${w.estimate.unit === "points" ? "pt" : w.estimate.unit === "hours" ? "h" : ""}` : "—"}
                      </td>
                      <td className="px-4 py-2">
                        {owner && (
                          <div className="flex items-center gap-1.5">
                            <span className={`size-5 rounded-full ${owner.avatarColor} text-white text-[8px] font-bold flex items-center justify-center`}>{owner.initials}</span>
                            <span className="text-[11px] text-foreground truncate">{owner.name}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {g.children.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-6 text-center text-[12px] text-muted-foreground italic">No stories under this epic yet.</td></tr>
                )}
              </tbody>
            </table>
          </section>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground/60 flex items-start gap-2">
        <Sigma className="size-3 mt-0.5" />
        RICE = (Reach × Impact × Confidence) / Effort. WSJF = (Business value + Time criticality + Risk reduction) / Job size.
      </p>
      <p className="text-[10px] text-muted-foreground/40 inline-flex items-center gap-1">
        Hover over scores to see the components.
        <ChevronRight className="size-3" />
      </p>
    </div>
  );
}

function priorityRank(p: WorkItem["priority"]): number {
  return p === "p0" ? 0 : p === "p1" ? 1 : p === "p2" ? 2 : 3;
}
function moscowRank(m: Moscow): number {
  return m === "must" ? 0 : m === "should" ? 1 : m === "could" ? 2 : 3;
}
