"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  ChevronRight,
  Construction,
  GitBranch,
  Kanban,
  LayoutDashboard,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAgentTower } from "@/lib/agent-tower-store";
import { DELIVERY_AGENT_REGISTRY } from "@/components/delivery/agents";

export default function DeliveryHomePage() {
  const { setScreen } = useScreen();
  const { stats } = useAgentTower(DELIVERY_AGENT_REGISTRY);

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Overview" });
    return () => setScreen(null);
  }, [setScreen]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <Kanban className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Delivery &amp; PMO</h1>
            <p className="text-sm text-muted-foreground">
              Portfolio, programs, projects, sprints, capacity. Agentic where it counts.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Highlight: Agent Tower */}
      <Link
        href="/delivery/agents"
        className="group block bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors"
      >
        <div className="flex items-start gap-4 flex-wrap">
          <div className="size-12 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
            <Bot className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold text-foreground">Agent Tower</h2>
              <span className="text-[10px] uppercase tracking-wider bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                <Sparkles className="size-2.5" />
                15 agents
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-success/10 text-success px-1.5 py-0.5 rounded">
                {stats.globalPause ? "0" : stats.live} live
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              The connective tissue. Status drafts, risk sentinels, estimation coaches, capacity forecasters — bounded
              scope, deterministic where it matters. {stats.last24h.toLocaleString("en-IN")} decisions in the last 24
              hours.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground self-center">
            Open Tower
            <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
          </div>
        </div>
      </Link>

      {/* Tiles — coming next */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">
          Coming next
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <ComingTile icon={LayoutDashboard} title="Portfolio overview" description="Programs roll up to portfolios; RAG status; investment view." />
          <ComingTile icon={Target}          title="Projects & charters" description="Project list, charter (goal, scope, sponsor, budget, dates)." />
          <ComingTile icon={GitBranch}       title="Sprint board"        description="Scrum + Kanban + Waterfall co-existing; capacity-aware planning." />
          <ComingTile icon={Users}           title="Capacity & skills"   description="Workload heatmap, allocation, skill graph + matching." />
          <ComingTile icon={Construction}    title="Releases"             description="Release trains, auto-drafted notes, deployment cadence." />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground/60 inline-flex items-start gap-2">
        <Sparkles className="size-3 mt-0.5" />
        <span>
          The Delivery module is being built in slices. The Agent Tower lands first because cross-module flow — leave
          approved in HR auto-replans a sprint; a deal closed in CRM auto-spawns a project — runs through agents.
        </span>
      </p>
    </div>
  );
}

function ComingTile({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-dashed border-border rounded-xl p-4 opacity-70">
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center shrink-0">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  );
}
