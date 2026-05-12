"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  ChevronRight,
  ClipboardList,
  FileText,
  Lightbulb,
  Mic,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAgentTower } from "@/lib/agent-tower-store";
import { PRESALES_AGENT_REGISTRY } from "@/components/presales/agents";
import { usePursuitsStore } from "@/lib/pursuits-store";
import { formatINR } from "@/components/presales/pursuits/data";

export default function PresalesHomePage() {
  const { setScreen } = useScreen();
  const { stats: agentStats } = useAgentTower(PRESALES_AGENT_REGISTRY);
  const { stats: pursuitStats } = usePursuitsStore();

  useEffect(() => {
    setScreen({ module: "Pre-Sales", page: "Overview" });
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
          <div className="size-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
            <Target className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Pre-Sales &amp; Proposals</h1>
            <p className="text-sm text-muted-foreground">
              Pursuits, RFPs, capture, authoring, orals. Agents take the 70%; the deal team spends time on the 30% that wins.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Highlight: Agent Tower */}
      <Link
        href="/presales/agents"
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
                18 agents
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-success/10 text-success px-1.5 py-0.5 rounded">
                {agentStats.globalPause ? "0" : agentStats.live} live
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              RFP decomposition, bid/no-bid, capture, customer &amp; competitor intel, content recommendation,
              first-draft authoring, red-team, compliance sentinel, pricing co-pilot, submission gate, evaluator Q&amp;A,
              orals prep, win/loss synthesis, knowledge curation. {agentStats.last24h.toLocaleString("en-IN")} decisions in the last 24 hours.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground self-center">
            Open Tower
            <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
          </div>
        </div>
      </Link>

      {/* Live: Pursuits */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Lifecycle</p>
        <Link
          href="/presales/pursuits"
          className="group block bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors"
        >
          <div className="flex items-start gap-3 flex-wrap">
            <div className="size-9 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
              <Target className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-foreground">Pursuits</p>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">{pursuitStats.inFlight} in flight</span>
                {pursuitStats.mustWin > 0 && (
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium inline-flex items-center gap-1">
                    <Trophy className="size-2.5" />
                    {pursuitStats.mustWin} must-win
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                11-stage canonical lifecycle — RFP intake to knowledge reuse. Tasks, deliverables, RACI, and approval gates per stage; tunable by pursuit type.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-semibold">TCV in flight</p>
                  <p className="text-[12px] font-semibold text-foreground tabular-nums">{formatINR(pursuitStats.tcvInFlight)}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Won YTD</p>
                  <p className="text-[12px] font-semibold text-success tabular-nums">{pursuitStats.won}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-semibold">CoP YTD</p>
                  <p className="text-[12px] font-semibold text-foreground tabular-nums">{formatINR(pursuitStats.copYTD)}</p>
                </div>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-foreground transition-colors mt-2" />
          </div>
        </Link>
      </div>

      {/* Coming next */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Surfaces coming next</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <ComingTile icon={FileText}      title="RFP workspace"               description="Per-pursuit RFP intake, decomposition output, compliance matrix, evaluator Q&amp;A timeline." />
          <ComingTile icon={ShieldCheck}   title="Compliance matrix"           description="Every shall-statement with owner, section, coverage state, and evidence link — live during drafting." />
          <ComingTile icon={Lightbulb}     title="Capture plans"               description="Customer profile, decision unit, hot buttons, competitive picture, win themes, ghosting moves." />
          <ComingTile icon={ClipboardList} title="Proposal authoring"          description="Section-aware authoring with first-draft, recommended content, voice and tone." />
          <ComingTile icon={Sparkles}      title="Pink / Red / Gold reviews"   description="Adversarial review packets, must-fix tracking, gate completion." />
          <ComingTile icon={Send}          title="Submission gate"             description="Pre-flight: page limits, formats, forms, signatures, file conventions. Zero submission rejections target." />
          <ComingTile icon={Mic}           title="Orals prep"                  description="Slide draft, briefing book, anticipated Q&amp;A pairs, speaker prep." />
          <ComingTile icon={Trophy}        title="Win/loss debriefs &amp; library" description="Drivers categorised, reusable content tagged and freshness-watched." />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground/60 inline-flex items-start gap-2">
        <Sparkles className="size-3 mt-0.5" />
        <span>
          Cross-module flow: CRM stage-1 deal → open pursuit. Decision: Bid → spawn Delivery proposal team.
          Decision: Win → seed Delivery project + handover risk register. Decision: Loss → Win/Loss synth → refresh Library.
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
