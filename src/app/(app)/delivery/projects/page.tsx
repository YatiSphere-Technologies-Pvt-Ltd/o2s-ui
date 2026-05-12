"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Filter as FilterIcon,
  Plus,
  Search,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import {
  METHODOLOGY_LABEL,
  PEOPLE_MAP,
  PROGRAMS_MAP,
  RAG_DOT,
  RAG_TINT,
  type Methodology,
  type RagStatus,
} from "@/components/delivery/data";

export default function ProjectsListPage() {
  const { setScreen } = useScreen();
  const { projects } = useDeliveryStore();
  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<Methodology | "all">("all");
  const [ragFilter, setRagFilter] = useState<RagStatus | "all">("all");

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Projects" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (methodFilter !== "all" && p.methodology !== methodFilter) return false;
      if (ragFilter !== "all" && p.rag !== ragFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        (p.customer ?? "").toLowerCase().includes(q) ||
        (PROGRAMS_MAP[p.programId]?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [projects, query, methodFilter, ragFilter]);

  const counts = useMemo(() => {
    return {
      all: projects.length,
      green: projects.filter((p) => p.rag === "green").length,
      amber: projects.filter((p) => p.rag === "amber").length,
      red:   projects.filter((p) => p.rag === "red").length,
    };
  }, [projects]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link href="/delivery" className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors" aria-label="Back">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground">{projects.length} projects across all portfolios.</p>
          </div>
        </div>
        <Link
          href="/delivery/templates"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="size-3.5" />
          New from template
        </Link>
      </motion.div>

      {/* RAG pill row */}
      <div className="grid grid-cols-4 gap-2">
        {(["all", "green", "amber", "red"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setRagFilter(s)}
            className={`text-left p-3 rounded-lg border transition-colors ${
              ragFilter === s ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{s === "all" ? "All" : s}</p>
            <p className="text-xl font-bold text-foreground tabular-nums mt-1">{counts[s]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search project, program, customer…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="size-3.5 text-muted-foreground" />
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as Methodology | "all")}
            className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All methods</option>
            <option value="scrum">Scrum</option>
            <option value="kanban">Kanban</option>
            <option value="waterfall">Waterfall</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-overlay/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              <th className="text-left px-4 py-2.5 font-semibold">Project</th>
              <th className="text-left px-3 py-2.5 font-semibold">Program</th>
              <th className="text-left px-3 py-2.5 font-semibold">Method</th>
              <th className="text-left px-3 py-2.5 font-semibold">PM</th>
              <th className="text-center px-3 py-2.5 font-semibold">RAG</th>
              <th className="text-right px-3 py-2.5 font-semibold">Health</th>
              <th className="text-right px-4 py-2.5 font-semibold">Budget</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const pm = PEOPLE_MAP[p.pmId];
              const program = PROGRAMS_MAP[p.programId];
              return (
                <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/delivery/projects/${p.id}`} className="group">
                      <p className="text-sm font-medium text-foreground group-hover:underline">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.customer ?? "Internal"}</p>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-[12px] text-muted-foreground">{program?.name}</td>
                  <td className="px-3 py-3 text-[12px] text-foreground">{METHODOLOGY_LABEL[p.methodology]}</td>
                  <td className="px-3 py-3">
                    {pm && (
                      <div className="flex items-center gap-2">
                        <span className={`size-6 rounded-full ${pm.avatarColor} text-white text-[9px] font-bold flex items-center justify-center`}>{pm.initials}</span>
                        <span className="text-[12px] text-foreground">{pm.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${RAG_TINT[p.rag]}`}>
                      <span className={`size-1.5 rounded-full ${RAG_DOT[p.rag]}`} />
                      {p.rag}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-[12px] tabular-nums font-medium text-foreground">{p.health}</td>
                  <td className="px-4 py-3 text-right text-[12px] tabular-nums text-foreground">
                    ₹{inrShort(p.spentINR)} / {inrShort(p.totalBudgetINR)}
                    <p className="text-[10px] text-muted-foreground/70">{Math.round((p.spentINR / p.totalBudgetINR) * 100)}% spent</p>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground italic">
                  No projects match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function inrShort(n: number): string {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
