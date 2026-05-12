"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Layers,
  Plane,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import {
  allocationWeeks,
  PEOPLE,
  PROJECTS_MAP,
  workloadHeatmap,
} from "@/components/delivery/data";

export default function CapacityPage() {
  const { setScreen } = useScreen();
  const { allocations } = useDeliveryStore();
  const [tab, setTab] = useState<"heatmap" | "skills">("heatmap");
  const [skillQuery, setSkillQuery] = useState("");

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Capacity" });
    return () => setScreen(null);
  }, [setScreen]);

  const weeks = allocationWeeks();
  const heatmap = workloadHeatmap();

  // Recompute totals using live allocations (allows for overlay edits to reflect)
  const heatmapLive = useMemo(() => {
    return heatmap.map((row) => {
      const byWeek = row.weeks.map((w) => {
        const live = allocations.filter((a) => a.personId === row.person.id && a.weekISO === w.weekISO);
        return { ...w, total: live.reduce((s, a) => s + a.pct, 0), rows: live };
      });
      return { ...row, weeks: byWeek };
    });
  }, [heatmap, allocations]);

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    for (const p of PEOPLE) for (const s of p.skills) set.add(s.skill);
    return Array.from(set).sort();
  }, []);

  type SkillMatch = { person: typeof PEOPLE[number]; proficiency: 1 | 2 | 3 | 4 | 5; skill: string };
  const skillMatches = useMemo<SkillMatch[]>(() => {
    if (!skillQuery) return [];
    const q = skillQuery.trim().toLowerCase();
    const out: SkillMatch[] = [];
    for (const p of PEOPLE) {
      const match = p.skills.find((s) => s.skill.toLowerCase().includes(q));
      if (match) out.push({ person: p, proficiency: match.proficiency, skill: match.skill });
    }
    return out.sort((a, b) => b.proficiency - a.proficiency);
  }, [skillQuery]);

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Capacity &amp; skills</h1>
            <p className="text-sm text-muted-foreground">Workload heatmap with leave-aware capacity. Skills graph for resource matching.</p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-1 border-b border-border">
        {(["heatmap", "skills"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "heatmap" ? <Layers className="size-3.5" /> : <Sparkles className="size-3.5" />}
            {t === "heatmap" ? "Workload heatmap" : "Skills graph"}
          </button>
        ))}
      </div>

      {tab === "heatmap" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-200 grid" style={{ gridTemplateColumns: `200px repeat(${weeks.length}, 1fr)` }}>
              <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold border-b border-r border-border bg-surface-overlay/40 sticky left-0">
                Person
              </div>
              {weeks.map((w) => (
                <div key={w} className="px-2 py-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold text-center border-b border-r border-border last:border-r-0 bg-surface-overlay/40">
                  {new Date(w).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
              ))}

              {heatmapLive.map((row) => (
                <FragmentLike key={row.person.id}>
                  <div className="px-3 py-2 border-b border-r border-border last:border-b-0 sticky left-0 bg-card">
                    <div className="flex items-center gap-2">
                      <span className={`size-6 rounded-full ${row.person.avatarColor} text-white text-[9px] font-bold flex items-center justify-center`}>{row.person.initials}</span>
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-foreground truncate">{row.person.name}</p>
                        <p className="text-[10px] text-muted-foreground/70 truncate">{row.person.jobTitle}</p>
                      </div>
                    </div>
                  </div>
                  {row.weeks.map((w) => {
                    const total = w.total;
                    const onLeave = row.person.onLeave.some(
                      (l) => new Date(w.weekISO).getTime() >= new Date(l.startISO).getTime() && new Date(w.weekISO).getTime() <= new Date(l.endISO).getTime(),
                    );
                    return (
                      <div key={w.weekISO} className="px-1 py-1 border-b border-r border-border last:border-r-0 text-center relative">
                        <div className={`rounded h-10 flex flex-col items-center justify-center ${heatColor(total, onLeave)}`}>
                          {onLeave ? (
                            <Plane className="size-3 text-warning" />
                          ) : (
                            <>
                              <span className="text-[11px] tabular-nums font-medium text-foreground">{total}%</span>
                              {total > 0 && w.rows.length > 1 && (
                                <span className="text-[9px] text-muted-foreground">{w.rows.length} proj</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </FragmentLike>
              ))}
            </div>
          </div>
          <div className="px-4 py-2 border-t border-border flex items-center gap-3 flex-wrap text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded bg-success/30" />0–80% (healthy)</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded bg-warning/30" />81–100% (full)</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded bg-destructive/30" />&gt;100% (over)</span>
            <span className="inline-flex items-center gap-1.5"><Plane className="size-3" />On leave</span>
          </div>
        </div>
      )}

      {tab === "skills" && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
            <input
              type="text"
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              placeholder="Search a skill (e.g. 'react', 'kafka', 'payments')…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          {skillQuery && (
            <section className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-surface-overlay/40 border-b border-border">
                <p className="text-[11px] font-semibold text-foreground">Best matches for &quot;{skillQuery}&quot; ({skillMatches.length})</p>
              </div>
              <ul>
                {skillMatches.map(({ person, proficiency, skill }) => {
                  // Current load this week
                  const allocs = allocations.filter((a) => a.personId === person.id && a.weekISO === weeks[1]);
                  const load = allocs.reduce((s, a) => s + a.pct, 0);
                  const projectNames = allocs.map((a) => PROJECTS_MAP[a.projectId]?.shortName).filter(Boolean);
                  return (
                    <li key={person.id} className="px-4 py-3 border-b border-border last:border-b-0 flex items-center gap-3">
                      <span className={`size-9 rounded-full ${person.avatarColor} text-white text-[11px] font-bold flex items-center justify-center shrink-0`}>{person.initials}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{person.name}</p>
                        <p className="text-[11px] text-muted-foreground">{person.jobTitle} · {person.country}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                          Currently on: {projectNames.join(", ") || "—"} ({load}% load)
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{skill}</p>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className={`size-2 rounded-full ${i <= proficiency ? "bg-brand" : "bg-secondary"}`} />
                          ))}
                        </div>
                      </div>
                    </li>
                  );
                })}
                {skillMatches.length === 0 && (
                  <li className="px-4 py-12 text-center text-sm text-muted-foreground italic">No people match this skill.</li>
                )}
              </ul>
            </section>
          )}

          {/* All skills */}
          <section>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2 inline-flex items-center gap-1.5">
              <Users className="size-3" />
              Skills in the org ({allSkills.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allSkills.map((s) => (
                <button
                  key={s}
                  onClick={() => setSkillQuery(s)}
                  className="text-[11px] px-2 py-1 rounded-full bg-secondary text-foreground hover:bg-surface-overlay transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

// React fragment alias for grid mapping
function FragmentLike({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function heatColor(pct: number, onLeave: boolean): string {
  if (onLeave) return "bg-secondary";
  if (pct === 0) return "bg-card";
  if (pct <= 80) return "bg-success/20";
  if (pct <= 100) return "bg-warning/30";
  return "bg-destructive/30";
}
