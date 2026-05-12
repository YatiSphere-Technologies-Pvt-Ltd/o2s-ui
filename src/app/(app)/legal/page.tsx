"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  ChevronRight,
  ClipboardList,
  FileText,
  Gavel,
  Receipt,
  Scale,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAgentTower } from "@/lib/agent-tower-store";
import { useClmStore } from "@/lib/clm-store";
import { LEGAL_AGENT_REGISTRY } from "@/components/legal/agents";

export default function LegalHomePage() {
  const { setScreen } = useScreen();
  const { stats: agentStats } = useAgentTower(LEGAL_AGENT_REGISTRY);
  const { stats: clmStats } = useClmStore();

  useEffect(() => {
    setScreen({ module: "Legal", page: "Overview" });
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
          <div className="size-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <Scale className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Legal &amp; Legal Ops</h1>
            <p className="text-sm text-muted-foreground">
              Counsel, gatekeeper, operator — all in one module. Agents take the 70% so lawyers spend time on the 30%.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Highlight: Agent Tower */}
      <Link
        href="/legal/agents"
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
                17 agents
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-success/10 text-success px-1.5 py-0.5 rounded">
                {agentStats.globalPause ? "0" : agentStats.live} live
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Intake &amp; routing, NDA triage, contract review, negotiation, obligation extraction, renewals,
              compliance, DSAR, DPIA, spend audit, matters, policy Q&amp;A, conflicts, litigation hold, M&amp;A
              diligence, corporate secretary, regulatory reporting, ethics. {agentStats.last24h.toLocaleString("en-IN")} decisions in the last 24 hours.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground self-center">
            Open Tower
            <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
          </div>
        </div>
      </Link>

      {/* CLM live tiles */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Contract Lifecycle Management</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <LiveTile
            href="/legal/contracts"
            icon={FileText}
            title="Contract repository"
            description="NDAs, MSAs, SOWs, DPAs, vendor &amp; SaaS — single source of truth."
            stats={[
              { label: "Total", value: clmStats.total.toString() },
              { label: "Active", value: clmStats.active.toString() },
              { label: "In flight", value: clmStats.inFlight.toString() },
            ]}
          />
          <LiveTile
            href="/legal/contracts/templates"
            icon={FileText}
            title="Templates &amp; playbooks"
            description="Versioned templates, jurisdiction variants, playbook positions."
            stats={[
              { label: "Self-serve", value: "Yes" },
            ]}
          />
          <LiveTile
            href="/legal/contracts/review"
            icon={Sparkles}
            title="Review counterparty paper"
            description="Drop in a third-party draft — Contract Review agent flags G/Y/R deviations."
            stats={[{ label: "Powered by", value: "Agent" }]}
          />
          <LiveTile
            href="/legal/contracts/negotiation"
            icon={Bot}
            title="Negotiation tracker"
            description="Who has the ball, what changed, why."
            stats={[{ label: "Red open", value: clmStats.redOpen.toString() }]}
          />
          <LiveTile
            href="/legal/obligations"
            icon={ClipboardList}
            title="Obligation tracker"
            description="Every commitment extracted from every signed contract."
            stats={[
              { label: "Open", value: clmStats.obOpen.toString() },
            ]}
          />
          <LiveTile
            href="/legal/renewals"
            icon={TriangleAlert}
            title="Renewal sentinel"
            description="120 / 60 / 30 day windows with renew / renegotiate / terminate recommendations."
            stats={[{ label: "≤ 90d open", value: clmStats.renewalsOpenWithin90.toString() }]}
          />
        </div>
      </div>

      {/* Coming next */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Surfaces coming next</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <ComingTile icon={Gavel}        title="Matter management"              description="Active matters with owner, status, external counsel, deadlines, budget. Replaces the email + spreadsheet pattern." />
          <ComingTile icon={ShieldCheck}  title="Compliance &amp; privacy"           description="Compliance register, DSAR queue (shared with HR), DPIAs, breach response, retention schedules." />
          <ComingTile icon={Receipt}      title="Legal spend + counsel panel"     description="Outside counsel scorecards, rate cards, invoice review, recoveries, OCG enforcement." />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground/60 inline-flex items-start gap-2">
        <Sparkles className="size-3 mt-0.5" />
        <span>
          Cross-module flow: CRM commit-stage deal → auto-open NDA matter. HR new hire → IP assignment.
          Procurement vendor → DPA review. IT breach → litigation hold. Talent senior offer → Legal review.
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

function LiveTile({
  href,
  icon: Icon,
  title,
  description,
  stats,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  stats: { label: string; value: string }[];
}) {
  return (
    <Link
      href={href}
      className="group block bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors h-full"
    >
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
          <Icon className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <ChevronRight className="size-3.5 text-muted-foreground/40 ml-auto group-hover:text-foreground transition-colors" />
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{description}</p>
          <div className="flex items-center gap-3 mt-2">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{s.label}</p>
                <p className="text-[12px] font-semibold text-foreground tabular-nums">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
