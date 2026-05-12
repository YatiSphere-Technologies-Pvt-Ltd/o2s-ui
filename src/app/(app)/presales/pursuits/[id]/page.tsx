"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Gauge,
  History,
  ListChecks,
  Sparkles,
  Target,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { usePursuitsStore } from "@/lib/pursuits-store";
import {
  PURSUIT_TYPE_LABEL,
  PURSUIT_TYPE_RULES,
  PURSUIT_TYPE_TINT,
  STAGE_INDEX,
  STAGES,
  daysUntil,
  formatINR,
  stageByKey,
  type PursuitDeliverable,
  type PursuitGate,
  type PursuitRecord,
  type PursuitTask,
  type StageKey,
} from "@/components/presales/pursuits/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

type Tab = "lifecycle" | "tasks" | "deliverables" | "gates" | "raci" | "audit";

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "lifecycle",    label: "Lifecycle",    icon: ListChecks },
  { key: "tasks",        label: "Tasks",        icon: ClipboardList },
  { key: "deliverables", label: "Deliverables", icon: FileText },
  { key: "gates",        label: "Gates",        icon: CheckCircle2 },
  { key: "raci",         label: "RACI",         icon: Users },
  { key: "audit",        label: "Audit",        icon: History },
];

export default function PursuitDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { setScreen } = useScreen();
  const {
    pursuitById,
    advanceStage,
    setTaskStatus,
    decideGate,
    setDeliverableStatus,
    setOutcome,
  } = usePursuitsStore();
  const [tab, setTab] = useState<Tab>("lifecycle");
  const [stageView, setStageView] = useState<StageKey | null>(null);

  const pursuit = pursuitById(id);
  const pursuitName = pursuit?.name;
  const pursuitIdSafe = pursuit?.id;

  useEffect(() => {
    if (!pursuitName || !pursuitIdSafe) return;
    setScreen({ module: "Pre-Sales", page: "Pursuit", recordId: pursuitIdSafe, recordLabel: pursuitName });
    return () => setScreen(null);
  }, [pursuitName, pursuitIdSafe, setScreen]);

  if (!pursuit) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Pursuit not found</h1>
        <Link href="/presales/pursuits" className="text-brand underline mt-3 inline-block">
          Back to pursuits
        </Link>
      </div>
    );
  }

  const stageDef = stageByKey(pursuit.currentStage);
  const days = pursuit.submitDeadlineISO ? daysUntil(pursuit.submitDeadlineISO) : null;
  const isClosed = pursuit.outcome === "won" || pursuit.outcome === "lost" || pursuit.outcome === "withdrawn";
  const typeRules = PURSUIT_TYPE_RULES[pursuit.type];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/presales/pursuits"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
              <Target className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground tracking-tight">{pursuit.name}</h1>
                <code className="text-[10px] font-mono text-muted-foreground/60">{pursuit.id}</code>
                <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${PURSUIT_TYPE_TINT[pursuit.type]}`}>
                  {PURSUIT_TYPE_LABEL[pursuit.type]}
                </span>
                {(pursuit.type === "must_win" || pursuit.isMustWin) && (
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium inline-flex items-center gap-1">
                    <Trophy className="size-2.5" />
                    Must-win
                  </span>
                )}
                {pursuit.outcome === "won"  && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">Won</span>}
                {pursuit.outcome === "lost" && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">Lost</span>}
                {pursuit.outcome === "withdrawn" && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">Withdrawn</span>}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1"><Building2 className="size-3" /> {pursuit.customer}</span>
                <span>·</span>
                <span>{pursuit.industry}</span>
                <span>·</span>
                <span>{pursuit.customerCountry}</span>
                <span>·</span>
                <span>Capture: {pursuit.captureManager}</span>
                <span>·</span>
                <span>Pre-Sales: {pursuit.preSalesLead}</span>
              </div>
              <p className="text-[11px] text-muted-foreground/70 mt-1 italic">{typeRules.note}</p>
            </div>
          </div>
        </div>
        {!isClosed && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => advanceStage(pursuit.id)}
              disabled={STAGE_INDEX[pursuit.currentStage] >= STAGES.length - 1}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand-purple text-white text-sm font-medium hover:bg-brand-purple/90 disabled:opacity-40 transition-colors"
            >
              Advance stage
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Stage rail */}
      <StageRail
        pursuit={pursuit}
        onSelect={setStageView}
        selected={stageView}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Kpi label="Stage" value={`${stageDef.number}. ${stageDef.label}`} small />
        <Kpi label="TCV" value={formatINR(pursuit.tcvInr)} tone="brand-purple" />
        <Kpi label="Win-prob" value={`${Math.round(pursuit.winProb * 100)}%`} icon={Gauge} />
        <Kpi label="CoP" value={formatINR(pursuit.copInr)} hint="incurred" />
        <Kpi
          label="Submit"
          value={pursuit.submitDeadlineISO ?? "—"}
          hint={days !== null ? (days >= 0 ? `${days} days` : `${Math.abs(days)} days ago`) : ""}
          tone={days !== null && days < 0 ? "destructive" : days !== null && days <= 7 ? "warning" : "muted"}
          icon={Calendar}
        />
        <Kpi
          label="Decision"
          value={pursuit.expectedDecisionISO ?? "—"}
          hint={pursuit.outcome && pursuit.outcome !== "no_decision_yet" ? pursuit.outcome : "expected"}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === key
                ? "text-brand-purple border-brand-purple font-medium"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      {tab === "lifecycle" && (
        <LifecycleTab
          pursuit={pursuit}
          stageView={stageView}
          onSetStageView={setStageView}
          onDecideGate={(g, d) => decideGate(pursuit.id, g, d)}
          onAdvance={() => advanceStage(pursuit.id)}
          onSetOutcome={(o, r) => setOutcome(pursuit.id, o, r)}
        />
      )}
      {tab === "tasks" && (
        <TasksTab
          pursuit={pursuit}
          onSetStatus={(taskId, s) => setTaskStatus(pursuit.id, taskId, s)}
        />
      )}
      {tab === "deliverables" && (
        <DeliverablesTab
          pursuit={pursuit}
          onSetStatus={(id2, s) => setDeliverableStatus(pursuit.id, id2, s)}
        />
      )}
      {tab === "gates" && (
        <GatesTab
          pursuit={pursuit}
          onDecide={(g, d, c) => decideGate(pursuit.id, g, d, c)}
        />
      )}
      {tab === "raci" && <RaciTab pursuit={pursuit} />}
      {tab === "audit" && <AuditTab pursuit={pursuit} />}
    </div>
  );
}

/* ─────────── Stage rail ─────────── */

function StageRail({
  pursuit,
  selected,
  onSelect,
}: {
  pursuit: PursuitRecord;
  selected: StageKey | null;
  onSelect: (s: StageKey | null) => void;
}) {
  const rules = PURSUIT_TYPE_RULES[pursuit.type];
  const curIdx = STAGE_INDEX[pursuit.currentStage];
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-surface-overlay/40 border-b border-border flex items-center gap-2 flex-wrap">
        <p className="text-[11px] font-semibold text-foreground">Canonical lifecycle</p>
        <span className="text-[10px] text-muted-foreground">
          Click a stage to peek at its config. Skipped stages dimmed.
        </span>
      </div>
      <div className="px-3 py-3 overflow-x-auto">
        <ol className="flex items-stretch gap-1.5 min-w-max">
          {STAGES.map((s) => {
            const skipped = rules.skippedStages.includes(s.key);
            const isCurrent = s.key === pursuit.currentStage;
            const isPast = STAGE_INDEX[s.key] < curIdx;
            const isFuture = STAGE_INDEX[s.key] > curIdx;
            const sel = selected === s.key;
            return (
              <li key={s.key}>
                <button
                  onClick={() => onSelect(sel ? null : s.key)}
                  className={`w-32 min-h-16 text-left px-2 py-1.5 rounded-lg border transition-colors ${
                    skipped
                      ? "border-dashed border-border bg-secondary/20 text-muted-foreground/60"
                      : isCurrent
                        ? "border-brand-purple bg-brand-purple/10 text-foreground"
                        : isPast
                          ? "border-border bg-success/5 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                  } ${sel ? "ring-2 ring-brand-purple/40" : ""}`}
                >
                  <p className="text-[10px] uppercase tracking-wider font-semibold">{s.number}.</p>
                  <p className="text-[12px] font-medium leading-tight mt-0.5">{s.label}</p>
                  <p className="text-[9px] text-muted-foreground/70 mt-0.5 truncate">{s.owner.split(" + ")[0]}</p>
                  {isCurrent && <span className="text-[9px] text-brand-purple font-semibold">CURRENT</span>}
                  {skipped && <span className="text-[9px] italic">skipped</span>}
                  {isPast && !skipped && (
                    <Check className="size-2.5 text-success absolute" style={{ marginLeft: 96, marginTop: -32 }} />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      {selected && <StagePeek stage={selected} pursuit={pursuit} />}
    </div>
  );
}

function StagePeek({ stage, pursuit }: { stage: StageKey; pursuit: PursuitRecord }) {
  const def = stageByKey(stage);
  const rules = PURSUIT_TYPE_RULES[pursuit.type];
  const extraGates = rules.extraGates.filter((g) => g.stage === stage);
  return (
    <div className="px-4 py-3 border-t border-border bg-surface-overlay/30">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Detail label="Owner" value={def.owner} />
        <Detail label="Goal" value={def.goal} />
        <Detail label="Exit criteria" value={def.exitCriteria} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">Default tasks</p>
          <ul className="text-[11px] text-foreground space-y-0.5">
            {def.defaultTasks.map((t) => (
              <li key={t} className="flex items-start gap-1.5">
                <ChevronRight className="size-3 text-muted-foreground/40 mt-0.5 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">Deliverables</p>
          <ul className="text-[11px] text-foreground space-y-0.5">
            {def.defaultDeliverables.map((d) => (
              <li key={d} className="flex items-start gap-1.5">
                <FileText className="size-3 text-muted-foreground/40 mt-0.5 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">Gates</p>
          <ul className="text-[11px] text-foreground space-y-0.5">
            {def.defaultGate && (
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="size-3 text-muted-foreground/40 mt-0.5 shrink-0" />
                {def.defaultGate.label} <span className="text-muted-foreground/60">— {def.defaultGate.approverRole}</span>
              </li>
            )}
            {extraGates.map((g) => (
              <li key={g.gate.label} className="flex items-start gap-1.5 text-warning">
                <Sparkles className="size-3 mt-0.5 shrink-0" />
                {g.gate.label} <span className="text-muted-foreground/60">— {g.gate.approverRole}</span>
                <span className="text-[9px] uppercase ml-1">(type-specific)</span>
              </li>
            ))}
            {!def.defaultGate && extraGates.length === 0 && (
              <li className="text-muted-foreground/60 italic">None</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</p>
      <p className="text-[12px] text-foreground mt-0.5">{value}</p>
    </div>
  );
}

/* ─────────── Tab: Lifecycle ─────────── */

function LifecycleTab({
  pursuit,
  stageView,
  onSetStageView,
  onDecideGate,
  onAdvance,
  onSetOutcome,
}: {
  pursuit: PursuitRecord;
  stageView: StageKey | null;
  onSetStageView: (s: StageKey | null) => void;
  onDecideGate: (gateId: string, decision: "approved" | "rejected") => void;
  onAdvance: () => void;
  onSetOutcome: (o: "won" | "lost" | "withdrawn", reason: string) => void;
}) {
  void stageView;
  void onSetStageView;
  const currentStageGates = pursuit.gates.filter((g) => g.stage === pursuit.currentStage);
  const pending = currentStageGates.filter((g) => g.status === "pending");
  const stageDef = stageByKey(pursuit.currentStage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Section icon={ListChecks} title={`Current — ${stageDef.number}. ${stageDef.label}`}>
          <p className="text-[12px] text-muted-foreground">{stageDef.goal}</p>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mr-2">Exit</span>
            {stageDef.exitCriteria}
          </p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {pending.length === 0 ? (
              <button
                onClick={onAdvance}
                disabled={STAGE_INDEX[pursuit.currentStage] >= STAGES.length - 1 || pursuit.outcome !== "no_decision_yet"}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-brand-purple text-white text-xs font-medium hover:bg-brand-purple/90 disabled:opacity-40 transition-colors"
              >
                Advance to next stage
                <ChevronRight className="size-3.5" />
              </button>
            ) : (
              <p className="text-[11px] text-warning">
                {pending.length} required gate{pending.length === 1 ? "" : "s"} pending — see Gates tab.
              </p>
            )}
          </div>
        </Section>

        {pursuit.outcome === "no_decision_yet" && pursuit.currentStage === "post_submit" && (
          <Section icon={Trophy} title="Log outcome">
            <p className="text-[11px] text-muted-foreground mb-2">Record the customer decision and advance the pursuit to Award / Loss / Withdraw.</p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSetOutcome("won", "Customer awarded — debrief pending.")}
                className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-[11px] bg-success/10 text-success border border-success/40 hover:bg-success/20 transition-colors"
              >
                <CheckCircle2 className="size-3" />
                Won
              </button>
              <button
                onClick={() => onSetOutcome("lost", "Customer awarded elsewhere — debrief pending.")}
                className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-[11px] bg-destructive/10 text-destructive border border-destructive/40 hover:bg-destructive/20 transition-colors"
              >
                <X className="size-3" />
                Lost
              </button>
              <button
                onClick={() => onSetOutcome("withdrawn", "Pursuit withdrawn.")}
                className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-[11px] bg-secondary text-muted-foreground border border-border hover:text-foreground transition-colors"
              >
                Withdraw
              </button>
            </div>
          </Section>
        )}

        {(pursuit.outcome === "won" || pursuit.outcome === "lost" || pursuit.outcome === "withdrawn") && (
          <Section icon={Trophy} title="Outcome">
            <div className="flex items-center gap-2 flex-wrap">
              {pursuit.outcome === "won" && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">Won</span>}
              {pursuit.outcome === "lost" && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">Lost</span>}
              {pursuit.outcome === "withdrawn" && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">Withdrawn</span>}
            </div>
            <p className="text-[12px] text-foreground mt-2">{pursuit.outcomeReason ?? "No reason recorded."}</p>
          </Section>
        )}
      </div>

      <div className="space-y-4">
        <Section icon={Sparkles} title="Type config">
          <p className="text-[11px] text-muted-foreground">{PURSUIT_TYPE_RULES[pursuit.type].note}</p>
          {PURSUIT_TYPE_RULES[pursuit.type].skippedStages.length > 0 && (
            <p className="text-[11px] text-foreground mt-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mr-2">Skipped</span>
              {PURSUIT_TYPE_RULES[pursuit.type].skippedStages.map((s) => stageByKey(s).label).join(", ")}
            </p>
          )}
          {PURSUIT_TYPE_RULES[pursuit.type].extraGates.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Extra gates</p>
              <ul className="mt-1 text-[11px] text-foreground space-y-0.5">
                {PURSUIT_TYPE_RULES[pursuit.type].extraGates.map((g, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Sparkles className="size-3 text-warning mt-0.5 shrink-0" />
                    {g.gate.label} <span className="text-muted-foreground/60">— {stageByKey(g.stage).label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        <Section icon={Users} title="Owners">
          <ul className="text-[12px] text-foreground space-y-1">
            <li><span className="text-muted-foreground">Capture: </span>{pursuit.captureManager}</li>
            <li><span className="text-muted-foreground">Pre-Sales: </span>{pursuit.preSalesLead}</li>
            {pursuit.solutionArchitect && <li><span className="text-muted-foreground">Solution: </span>{pursuit.solutionArchitect}</li>}
            {pursuit.proposalManager && <li><span className="text-muted-foreground">Proposal: </span>{pursuit.proposalManager}</li>}
            {pursuit.pricingLead && <li><span className="text-muted-foreground">Pricing: </span>{pursuit.pricingLead}</li>}
            {pursuit.execSponsor && <li><span className="text-muted-foreground">Exec sponsor: </span>{pursuit.execSponsor}</li>}
          </ul>
        </Section>

        {currentStageGates.length > 0 && (
          <Section icon={CheckCircle2} title="Gates this stage">
            <ul className="space-y-1.5">
              {currentStageGates.map((g) => (
                <li key={g.id} className="flex items-start gap-2 text-[12px]">
                  <GateBadge status={g.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground">{g.label}</p>
                    <p className="text-[10px] text-muted-foreground">{g.approverRole}{g.approverName ? ` · ${g.approverName}` : ""}</p>
                  </div>
                  {g.status === "pending" && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onDecideGate(g.id, "approved")}
                        className="inline-flex items-center gap-1 h-6 px-1.5 rounded text-[10px] bg-success/10 text-success border border-success/40 hover:bg-success/20 transition-colors"
                      >
                        <Check className="size-2.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => onDecideGate(g.id, "rejected")}
                        className="inline-flex items-center gap-1 h-6 px-1.5 rounded text-[10px] bg-destructive/10 text-destructive border border-destructive/40 hover:bg-destructive/20 transition-colors"
                      >
                        <X className="size-2.5" />
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

/* ─────────── Tab: Tasks ─────────── */

function TasksTab({
  pursuit,
  onSetStatus,
}: {
  pursuit: PursuitRecord;
  onSetStatus: (taskId: string, s: PursuitTask["status"]) => void;
}) {
  const byStage = useMemo(() => {
    const map = new Map<StageKey, PursuitTask[]>();
    for (const t of pursuit.tasks) {
      const arr = map.get(t.stage) ?? [];
      arr.push(t);
      map.set(t.stage, arr);
    }
    return map;
  }, [pursuit.tasks]);

  return (
    <div className="space-y-3">
      {STAGES.map((s) => {
        const tasks = byStage.get(s.key);
        if (!tasks?.length) return null;
        return (
          <section key={s.key} className="bg-card border border-border rounded-xl overflow-hidden">
            <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border">
              <p className="text-[11px] font-semibold text-foreground">{s.number}. {s.label}</p>
            </header>
            <ul>
              {tasks.map((t) => (
                <li key={t.id} className="px-3 py-2 border-b border-border last:border-b-0 flex items-center gap-3 text-[12px]">
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${
                    t.status === "done"
                      ? "bg-success/10 text-success"
                      : t.status === "in_progress"
                        ? "bg-warning/10 text-warning"
                        : t.status === "blocked"
                          ? "bg-destructive/10 text-destructive"
                          : t.status === "skipped"
                            ? "bg-muted-foreground/10 text-muted-foreground"
                            : "bg-secondary text-muted-foreground"
                  }`}>
                    {t.status.replace("_", " ")}
                  </span>
                  <span className="flex-1 text-foreground">{t.label}</span>
                  <span className="text-[11px] text-muted-foreground">{t.owner}</span>
                  <select
                    value={t.status}
                    onChange={(e) => onSetStatus(t.id, e.target.value as PursuitTask["status"])}
                    className="h-7 px-2 rounded border border-input bg-card text-[10px] text-foreground"
                  >
                    <option value="not_started">Not started</option>
                    <option value="in_progress">In progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="done">Done</option>
                    <option value="skipped">Skipped</option>
                  </select>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/* ─────────── Tab: Deliverables ─────────── */

function DeliverablesTab({
  pursuit,
  onSetStatus,
}: {
  pursuit: PursuitRecord;
  onSetStatus: (id: string, s: PursuitDeliverable["status"]) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<StageKey, PursuitDeliverable[]>();
    for (const d of pursuit.deliverables) {
      const arr = map.get(d.stage) ?? [];
      arr.push(d);
      map.set(d.stage, arr);
    }
    return map;
  }, [pursuit.deliverables]);

  return (
    <div className="space-y-3">
      {STAGES.map((s) => {
        const list = grouped.get(s.key);
        if (!list?.length) return null;
        return (
          <section key={s.key} className="bg-card border border-border rounded-xl overflow-hidden">
            <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border">
              <p className="text-[11px] font-semibold text-foreground">{s.number}. {s.label}</p>
            </header>
            <ul>
              {list.map((d) => (
                <li key={d.id} className="px-3 py-2 border-b border-border last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${
                      d.status === "approved"
                        ? "bg-success/10 text-success"
                        : d.status === "in_review"
                          ? "bg-warning/10 text-warning"
                          : d.status === "draft"
                            ? "bg-brand/10 text-brand"
                            : "bg-destructive/10 text-destructive"
                    }`}>
                      {d.status.replace("_", " ")}
                    </span>
                    <span className="flex-1 text-[12px] text-foreground">{d.label}</span>
                    <span className="text-[11px] text-muted-foreground">{d.owner}</span>
                    <select
                      value={d.status}
                      onChange={(e) => onSetStatus(d.id, e.target.value as PursuitDeliverable["status"])}
                      className="h-7 px-2 rounded border border-input bg-card text-[10px] text-foreground"
                    >
                      <option value="missing">Missing</option>
                      <option value="draft">Draft</option>
                      <option value="in_review">In review</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                  {d.snippet && (
                    <p className="text-[11px] text-muted-foreground mt-1 ml-1 italic">{d.snippet}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/* ─────────── Tab: Gates ─────────── */

function GatesTab({
  pursuit,
  onDecide,
}: {
  pursuit: PursuitRecord;
  onDecide: (gateId: string, decision: "approved" | "rejected", comment?: string) => void;
}) {
  if (pursuit.gates.length === 0) {
    return (
      <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
        <CheckCircle2 className="size-6 text-muted-foreground mx-auto" />
        <p className="text-sm text-foreground font-medium mt-2">No gates seeded yet</p>
        <p className="text-[11px] text-muted-foreground mt-1">Gates are created as the pursuit reaches each stage.</p>
      </div>
    );
  }
  return (
    <ol className="space-y-2">
      {pursuit.gates.map((g) => (
        <li key={g.id} className="bg-card border border-border rounded-xl px-4 py-3">
          <div className="flex items-start gap-3 flex-wrap">
            <GateBadge status={g.status} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{g.label}</p>
              <p className="text-[11px] text-muted-foreground">
                Stage: {stageByKey(g.stage).label} · {g.approverRole}
                {g.approverName ? ` · ${g.approverName}` : ""}
                {g.decidedISO ? ` · ${g.decidedISO}` : ""}
              </p>
              {g.comment && <p className="text-[11px] text-foreground mt-1 italic">{g.comment}</p>}
            </div>
            {g.status === "pending" && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDecide(g.id, "approved")}
                  className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] bg-success/10 text-success border border-success/40 hover:bg-success/20 transition-colors"
                >
                  <Check className="size-3" />
                  Approve
                </button>
                <button
                  onClick={() => onDecide(g.id, "rejected", "Sent back for revision")}
                  className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] bg-destructive/10 text-destructive border border-destructive/40 hover:bg-destructive/20 transition-colors"
                >
                  <X className="size-3" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function GateBadge({ status }: { status: PursuitGate["status"] }) {
  if (status === "approved") {
    return <Check className="size-4 text-success mt-0.5" />;
  }
  if (status === "rejected") {
    return <X className="size-4 text-destructive mt-0.5" />;
  }
  if (status === "waived") {
    return <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">Waived</span>;
  }
  return <AlertTriangle className="size-4 text-warning mt-0.5" />;
}

/* ─────────── Tab: RACI ─────────── */

function RaciTab({ pursuit }: { pursuit: PursuitRecord }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 bg-surface-overlay/40 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        <div className="col-span-3">Stage</div>
        <div className="col-span-2">Responsible</div>
        <div className="col-span-2">Accountable</div>
        <div className="col-span-3">Consulted</div>
        <div className="col-span-2">Informed</div>
      </div>
      {STAGES.map((s) => {
        const raci = pursuit.raciByStage[s.key];
        const skipped = PURSUIT_TYPE_RULES[pursuit.type].skippedStages.includes(s.key);
        return (
          <div key={s.key} className={`grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-2.5 border-b border-border last:border-b-0 text-[12px] ${skipped ? "opacity-50" : ""}`}>
            <div className="md:col-span-3">
              <p className="text-foreground font-medium">{s.number}. {s.label}</p>
              {skipped && <p className="text-[10px] text-muted-foreground italic">Skipped for {PURSUIT_TYPE_LABEL[pursuit.type]}</p>}
            </div>
            <div className="md:col-span-2 text-foreground">{raci?.responsible ?? <span className="text-muted-foreground/60 italic">—</span>}</div>
            <div className="md:col-span-2 text-foreground">{raci?.accountable ?? <span className="text-muted-foreground/60 italic">—</span>}</div>
            <div className="md:col-span-3 text-foreground">{raci?.consulted?.length ? raci.consulted.join(", ") : <span className="text-muted-foreground/60 italic">—</span>}</div>
            <div className="md:col-span-2 text-foreground">{raci?.informed?.length ? raci.informed.join(", ") : <span className="text-muted-foreground/60 italic">—</span>}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────── Tab: Audit ─────────── */

function AuditTab({ pursuit }: { pursuit: PursuitRecord }) {
  if (pursuit.audit.length === 0) {
    return (
      <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
        <History className="size-6 text-muted-foreground mx-auto" />
        <p className="text-sm text-foreground font-medium mt-2">No audit entries yet</p>
      </div>
    );
  }
  return (
    <ul className="bg-card border border-border rounded-xl overflow-hidden">
      {pursuit.audit.map((a) => (
        <li key={a.id} className="px-4 py-2.5 border-b border-border last:border-b-0">
          <div className="flex items-center gap-3 text-[12px] flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold w-24 shrink-0">{a.whenLabel}</span>
            <code className="text-[10px] font-mono text-muted-foreground/60">{a.action}</code>
            <span className="text-foreground flex-1 min-w-0">{a.detail}</span>
            <span className="text-[10px] text-muted-foreground">{a.actor}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ─────────── Shared bits ─────────── */

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
        <Icon className="size-3.5 text-muted-foreground" />
        <p className="text-[11px] font-semibold text-foreground">{title}</p>
      </div>
      <div className="p-3">{children}</div>
    </section>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone = "muted",
  small,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "muted" | "success" | "warning" | "destructive" | "brand-purple";
  small?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : tone === "destructive"
          ? "text-destructive"
          : tone === "brand-purple"
            ? "text-brand-purple"
            : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold inline-flex items-center gap-1">
        {Icon && <Icon className="size-3" />}
        {label}
      </p>
      <p className={`${small ? "text-sm" : "text-lg"} font-bold tabular-nums mt-0.5 ${toneClass}`}>{value}</p>
      {hint && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{hint}</p>}
    </div>
  );
}
