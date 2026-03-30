"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Check,
  X,
  RotateCcw,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  Bot,
  FileText,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type PeopleContext,
  type PeopleDecision,
  type PeopleAgentEvent,
  type ContextMetric,
  CONTEXTS,
  CONTEXT_METRICS,
  CONTEXT_DECISIONS,
  CONTEXT_AGENT_EVENTS,
  urgencyColor,
  urgencyBgColor,
  urgencyBorderColor,
  recommendationColor,
  recommendationBgColor,
  recommendationLabel,
  agentGradient,
  eventStatusColor,
  eventStatusBgColor,
  eventStatusLabel,
  scoreColor,
  confidenceStrokeColor,
} from "@/components/people-command/data";

/* ── Confidence Badge ── */

function ConfidenceBadge({ score, size = "sm" }: { score: number; size?: "sm" | "md" }) {
  const dim = size === "sm" ? 28 : 36;
  const sw = size === "sm" ? 2.5 : 3;
  const r = (dim - sw) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <div className="relative shrink-0" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="-rotate-90">
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="currentColor" strokeWidth={sw} className="text-border" />
        <motion.circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke={confidenceStrokeColor(score)} strokeWidth={sw} strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - score / 100) }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center font-bold ${size === "sm" ? "text-[9px]" : "text-[11px]"} ${scoreColor(score)}`}>{score}</span>
    </div>
  );
}

/* ── Animated Counter ── */

function AnimatedCount({ value, suffix }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const animated = useRef(false);

  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;
    let frame: number;
    const start = performance.now();
    const dur = 1200;
    const animate = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 4)) * value));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, inView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Main Page ── */

export default function PeopleCommandPage() {
  const [context, setContext] = useState<PeopleContext>("employees");
  const [decisions, setDecisions] = useState(CONTEXT_DECISIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiExpanded, setAiExpanded] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const currentConfig = CONTEXTS.find((c) => c.key === context)!;
  const currentMetrics = CONTEXT_METRICS[context];
  const currentDecisions = decisions[context].filter((d) => d.status === "pending");
  const currentEvents = CONTEXT_AGENT_EVENTS[context];

  const selectedDecision = useMemo(
    () => currentDecisions.find((d) => d.id === selectedId) ?? null,
    [currentDecisions, selectedId]
  );

  // Auto-select first decision when context changes
  useEffect(() => {
    const first = decisions[context].find((d) => d.status === "pending");
    setSelectedId(first?.id ?? null);
    setAiExpanded(false);
  }, [context, decisions]);

  const handleAction = useCallback((id: string, action: "actioned" | "dismissed") => {
    setDecisions((prev) => ({
      ...prev,
      [context]: prev[context].map((d) => d.id === id ? { ...d, status: action } : d),
    }));
    // Auto-select next
    const remaining = decisions[context].filter((d) => d.status === "pending" && d.id !== id);
    setSelectedId(remaining[0]?.id ?? null);
  }, [context, decisions]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      switch (e.key.toLowerCase()) {
        case "j": case "arrowdown": {
          e.preventDefault();
          const idx = currentDecisions.findIndex((d) => d.id === selectedId);
          const next = currentDecisions[idx + 1];
          if (next) setSelectedId(next.id);
          break;
        }
        case "k": case "arrowup": {
          e.preventDefault();
          const idx = currentDecisions.findIndex((d) => d.id === selectedId);
          const prev = currentDecisions[idx - 1];
          if (prev) setSelectedId(prev.id);
          break;
        }
        case "a": if (selectedDecision) handleAction(selectedDecision.id, "actioned"); break;
        case "x": if (selectedDecision) handleAction(selectedDecision.id, "dismissed"); break;
        case "e": setAiExpanded((p) => !p); break;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentDecisions, selectedId, selectedDecision, handleAction]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6 lg:-m-8">
      {/* ── Context Switcher + Header ── */}
      <div className="shrink-0 px-6 pt-5 pb-3 lg:px-8 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`size-10 rounded-xl ${currentConfig.bgColor} flex items-center justify-center`}>
              <currentConfig.icon className={`size-5 ${currentConfig.color}`} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">People Command Center</h1>
              <p className="text-xs text-muted-foreground">{currentConfig.description}</p>
            </div>
          </div>

          {/* Context Switcher */}
          <div className="relative">
            <button
              onClick={() => setContextMenuOpen(!contextMenuOpen)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all cursor-pointer ${currentConfig.bgColor} border-transparent`}
            >
              <currentConfig.icon className={`size-4 ${currentConfig.color}`} />
              <span className={`text-sm font-semibold ${currentConfig.color}`}>{currentConfig.label}</span>
              <ChevronDown className={`size-4 ${currentConfig.color} transition-transform ${contextMenuOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {contextMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {CONTEXTS.map((ctx) => {
                    const isActive = context === ctx.key;
                    return (
                      <button
                        key={ctx.key}
                        onClick={() => { setContext(ctx.key); setContextMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${isActive ? "bg-surface-overlay" : "hover:bg-secondary/30"}`}
                      >
                        <div className={`size-9 rounded-lg ${ctx.bgColor} flex items-center justify-center`}>
                          <ctx.icon className={`size-4 ${ctx.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-foreground">{ctx.label}</span>
                          <span className="text-[10px] text-muted-foreground block">{ctx.description}</span>
                        </div>
                        {isActive && <div className={`size-2 rounded-full ${ctx.color.replace("text-", "bg-")}`} />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Metrics Bar ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={context}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            {currentMetrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-3 flex items-start gap-2.5"
                >
                  <div className={`size-8 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0`}>
                    <Icon className={`size-3.5 ${metric.accent}`} />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-lg font-bold ${metric.accent} leading-none`}>
                      <AnimatedCount value={metric.value} suffix={metric.suffix} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{metric.label}</p>
                    <p className={`text-[9px] mt-0.5 ${metric.direction === "up" ? "text-success" : metric.direction === "warning" ? "text-warning" : "text-muted-foreground/50"}`}>{metric.trend}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 3-Column Layout ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Decision Queue */}
        <div className="w-80 shrink-0 border-r border-border flex flex-col hidden lg:flex">
          <div className="shrink-0 px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Decisions</h2>
              <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">{currentDecisions.length}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
            <AnimatePresence mode="popLayout">
              {currentDecisions.map((decision) => {
                const isSelected = selectedId === decision.id;
                return (
                  <motion.button
                    key={decision.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    onClick={() => { setSelectedId(decision.id); setAiExpanded(false); }}
                    className={`w-full text-left relative rounded-xl border-l-[3px] border p-3 transition-all duration-150 cursor-pointer ${urgencyBorderColor(decision.urgency)} ${
                      isSelected ? "ring-1 ring-brand bg-brand/[0.03] border-border" : "border-border hover:bg-secondary/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9px] font-semibold uppercase tracking-wider ${urgencyColor(decision.urgency)}`}>{decision.urgency}</span>
                      <ConfidenceBadge score={decision.confidence} />
                    </div>
                    <h4 className="text-xs font-semibold text-foreground leading-snug line-clamp-2 mb-1">{decision.title}</h4>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mb-2">{decision.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="size-5 rounded-md bg-brand-purple/10 flex items-center justify-center text-[8px] font-bold text-brand-purple">{decision.entityInitials}</div>
                        <span className="text-[10px] text-muted-foreground">{decision.entityName}</span>
                      </div>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${recommendationBgColor(decision.recommendation)} ${recommendationColor(decision.recommendation)}`}>
                        {recommendationLabel(decision.recommendation)}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>

            {currentDecisions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/30">
                <Check className="size-8 mb-2" />
                <p className="text-xs">All clear — no pending decisions</p>
              </div>
            )}
          </div>
        </div>

        {/* CENTER: Intelligence Panel */}
        <div className="flex-1 min-w-0 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            {selectedDecision ? (
              <motion.div
                key={selectedDecision.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-5 space-y-5"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${urgencyBgColor(selectedDecision.urgency)} ${urgencyColor(selectedDecision.urgency)}`}>{selectedDecision.urgency}</span>
                    <span className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-1 rounded">{selectedDecision.type.replace(/_/g, " ")}</span>
                    {selectedDecision.deadline && (
                      <span className="text-[10px] text-destructive bg-destructive/10 px-2 py-1 rounded flex items-center gap-1">
                        <AlertTriangle className="size-2.5" /> Due: {selectedDecision.deadline}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{selectedDecision.title}</h2>
                  <p className="text-sm text-muted-foreground">{selectedDecision.subtitle}</p>

                  {/* Entity info */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border/50">
                    <div className="size-10 rounded-lg bg-brand-purple/10 flex items-center justify-center text-sm font-bold text-brand-purple">{selectedDecision.entityInitials}</div>
                    <div>
                      <span className="text-sm font-semibold text-foreground">{selectedDecision.entityName}</span>
                      <span className="text-xs text-muted-foreground block">{selectedDecision.entityRole} · {selectedDecision.entityDepartment}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      {selectedDecision.keyMetrics.map((m) => (
                        <div key={m.label} className="text-center">
                          <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
                          <span className="text-[9px] text-muted-foreground">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="h-0.5 bg-gradient-to-r from-brand-purple via-brand to-brand-teal" />
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                          <Sparkles className="size-3.5 text-brand-purple" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">AI Recommendation</span>
                      </div>
                      <ConfidenceBadge score={selectedDecision.confidence} size="md" />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold ${recommendationBgColor(selectedDecision.recommendation)} ${recommendationColor(selectedDecision.recommendation)} border-current/20`}>
                        {recommendationLabel(selectedDecision.recommendation)}
                      </span>
                      <span className="text-xs text-muted-foreground">{selectedDecision.confidence}% confidence</span>
                    </div>

                    <p className="text-[13px] text-muted-foreground leading-relaxed">{selectedDecision.aiSummary}</p>

                    <button onClick={() => setAiExpanded(!aiExpanded)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <ChevronDown className={`size-3.5 transition-transform ${aiExpanded ? "rotate-180" : ""}`} />
                      {aiExpanded ? "Hide reasoning" : "Why this recommendation?"}
                    </button>

                    <AnimatePresence>
                      {aiExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <p className="text-[13px] text-muted-foreground/80 leading-relaxed border-t border-border/50 pt-3">{selectedDecision.aiReasoning}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Strengths & Risks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <h3 className="text-[10px] font-semibold text-success uppercase tracking-wider">Strengths</h3>
                    {selectedDecision.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                        <span className="text-xs text-muted-foreground leading-snug">{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <h3 className="text-[10px] font-semibold text-destructive uppercase tracking-wider">Risks</h3>
                    {selectedDecision.risks.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                        <span className="text-xs text-muted-foreground leading-snug">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="sticky bottom-0 bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <Button onClick={() => handleAction(selectedDecision.id, "actioned")}
                    className="flex-1 h-10 bg-success hover:bg-success/90 text-white font-semibold rounded-lg gap-2 cursor-pointer">
                    <Check className="size-4" /> {recommendationLabel(selectedDecision.recommendation)}
                    <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-[9px] font-mono">A</kbd>
                  </Button>
                  <Button onClick={() => handleAction(selectedDecision.id, "dismissed")} variant="outline"
                    className="flex-1 h-10 font-semibold rounded-lg gap-2 cursor-pointer">
                    <X className="size-4" /> Dismiss
                    <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono">X</kbd>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full">
                <div className="size-16 rounded-2xl bg-secondary/30 flex items-center justify-center mb-4">
                  <FileText className="size-7 text-muted-foreground/20" />
                </div>
                <p className="text-sm text-muted-foreground/40">Select a decision from the queue</p>
                <p className="text-[11px] text-muted-foreground/25 mt-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">J</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">K</kbd> to navigate
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Agent Feed */}
        <div className="w-80 shrink-0 border-l border-border flex flex-col hidden xl:flex">
          <div className="shrink-0 px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">Agent Activity</h2>
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{currentConfig.label} agents</p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <AnimatePresence mode="wait">
              <motion.div key={context} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {currentEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    className="flex gap-3 p-3 hover:bg-secondary/20 transition-colors"
                  >
                    <div className={`size-7 shrink-0 rounded-full bg-gradient-to-br ${agentGradient(event.agentColor)} flex items-center justify-center`}>
                      <span className="text-[8px] font-bold text-white">{event.agent.split(" ").map((w) => w[0]).join("")}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-semibold text-foreground">{event.agent}</span>
                        <span className={`text-[8px] font-semibold px-1 py-0.5 rounded ${eventStatusBgColor(event.status)} ${eventStatusColor(event.status)}`}>{eventStatusLabel(event.status)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">{event.action}</p>
                      {event.status === "in_progress" && (
                        <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                          <motion.div className="h-full w-1/3 rounded-full bg-brand/40" animate={{ x: ["-100%", "400%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
                        </div>
                      )}
                      <span className="text-[9px] text-muted-foreground/40 mt-1 block">{event.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Keyboard Bar ── */}
      <div className="shrink-0 border-t border-border bg-card/80 px-6 py-2 flex items-center gap-5 text-[10px] text-muted-foreground/40">
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">J/K</kbd> Navigate</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">A</kbd> Action</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">X</kbd> Dismiss</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">E</kbd> Expand AI</span>
      </div>
    </div>
  );
}
