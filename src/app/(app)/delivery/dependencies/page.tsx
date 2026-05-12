"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Link as LinkIcon,
  Search,
  TriangleAlert,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import {
  DEPENDENCY_LABEL,
  PROJECTS_MAP,
  WORK_ITEMS_MAP,
  type Dependency,
} from "@/components/delivery/data";

const STATUS_TINT: Record<Dependency["status"], string> = {
  ok:      "bg-success/10 text-success",
  at_risk: "bg-warning/10 text-warning",
  broken:  "bg-destructive/10 text-destructive",
};

export default function DependenciesPage() {
  const { setScreen } = useScreen();
  const { dependencies, workItems } = useDeliveryStore();
  const [filter, setFilter] = useState<"all" | "cross_project" | "broken" | "auto_detected">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Dependencies" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dependencies.filter((d) => {
      if (filter === "cross_project" && !d.crossProject) return false;
      if (filter === "broken" && d.status !== "broken") return false;
      if (filter === "auto_detected" && !d.autoDetected) return false;
      if (!q) return true;
      const from = workItems.find((w) => w.id === d.fromId)?.title.toLowerCase() ?? "";
      const to = workItems.find((w) => w.id === d.toId)?.title.toLowerCase() ?? "";
      return from.includes(q) || to.includes(q);
    });
  }, [dependencies, workItems, filter, query]);

  const counts = useMemo(() => ({
    all: dependencies.length,
    cross: dependencies.filter((d) => d.crossProject).length,
    broken: dependencies.filter((d) => d.status === "broken").length,
    auto: dependencies.filter((d) => d.autoDetected).length,
  }), [dependencies]);

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Dependencies</h1>
            <p className="text-sm text-muted-foreground">Cross-project dependencies are first-class. Auto-detected by the Dependency Tracker agent.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Tile label="All" value={counts.all} active={filter === "all"} onClick={() => setFilter("all")} />
        <Tile label="Cross-project" value={counts.cross} active={filter === "cross_project"} onClick={() => setFilter("cross_project")} />
        <Tile label="Broken" value={counts.broken} active={filter === "broken"} onClick={() => setFilter("broken")} tone="destructive" />
        <Tile label="Auto-detected" value={counts.auto} active={filter === "auto_detected"} onClick={() => setFilter("auto_detected")} tone="brand-purple" />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search source / target work item…"
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <ul className="space-y-2">
        {filtered.map((d) => {
          const from = WORK_ITEMS_MAP[d.fromId];
          const to = WORK_ITEMS_MAP[d.toId];
          const fromProj = from ? PROJECTS_MAP[from.projectId] : undefined;
          const toProj = to ? PROJECTS_MAP[to.projectId] : undefined;
          return (
            <li key={d.id} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-[12px]">
                  <span className="text-foreground">{from?.title ?? d.fromId}</span>
                  <span className="text-muted-foreground/70">in</span>
                  <code className="font-mono text-muted-foreground/80">{fromProj?.shortName ?? "—"}</code>
                  <span className="inline-flex items-center gap-1 px-2 text-muted-foreground">
                    <LinkIcon className="size-3" />
                    {DEPENDENCY_LABEL[d.kind]}
                  </span>
                  <span className="text-foreground">{to?.title ?? d.toId}</span>
                  <span className="text-muted-foreground/70">in</span>
                  <code className="font-mono text-muted-foreground/80">{toProj?.shortName ?? "—"}</code>
                </div>
                {d.note && <p className="text-[11px] text-muted-foreground mt-1">{d.note}</p>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${STATUS_TINT[d.status]} inline-flex items-center gap-1`}>
                  {d.status === "broken" && <TriangleAlert className="size-2.5" />}
                  {d.status.replace("_", " ")}
                </span>
                {d.crossProject && (
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple">x-project</span>
                )}
                {d.autoDetected && (
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand/10 text-brand inline-flex items-center gap-1">
                    <Bot className="size-2.5" />
                    Auto
                  </span>
                )}
              </div>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="text-sm text-muted-foreground italic text-center py-12">No dependencies match these filters.</li>
        )}
      </ul>
    </div>
  );
}

function Tile({
  label,
  value,
  active,
  onClick,
  tone,
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
  tone?: "destructive" | "brand-purple";
}) {
  const accent =
    tone === "destructive" ? "border-destructive/30 text-destructive"
    : tone === "brand-purple" ? "border-brand-purple/30 text-brand-purple"
    : "";
  return (
    <button
      onClick={onClick}
      className={`text-left p-3 rounded-lg border transition-colors ${
        active ? `border-brand bg-brand/5` : `bg-card hover:bg-surface-overlay ${accent || "border-border"}`
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</p>
      <p className="text-xl font-bold text-foreground tabular-nums mt-1">{value}</p>
    </button>
  );
}
