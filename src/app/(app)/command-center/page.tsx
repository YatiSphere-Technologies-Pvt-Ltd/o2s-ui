"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  RotateCcw,
  Search,
  ArrowUpDown,
  Sparkles,
  AlertCircle,
  Clock,
  User,
  Briefcase,
  Building2,
  FileText,
  Brain,
  Users,
  BarChart3,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricsBar } from "@/components/command-center/metrics-bar";
import { ConfidenceBadge } from "@/components/command-center/confidence-badge";
import { AIRecommendation } from "@/components/command-center/ai-recommendation";
import { PanelAlignment } from "@/components/command-center/panel-alignment";
import { RiskIndicator } from "@/components/command-center/risk-indicator";
import { AgentEventItem } from "@/components/command-center/agent-event-item";
import {
  type Decision,
  type QueueFilter,
  DECISIONS,
  AGENT_EVENTS,
  filterDecisions,
  urgencyColor,
  urgencyBgColor,
  urgencyLabel,
  urgencyBorderColor,
  decisionTypeLabel,
  fitScoreColor,
  fitScoreBgColor,
} from "@/components/command-center/data";

/* ── Sort types ── */

type SortField = "urgency" | "title" | "confidence" | "createdAt" | "type";
type SortDir = "asc" | "desc";

const URGENCY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

/* ── Detail Slide-Over ── */

function DetailSlideOver({
  decision,
  onApprove,
  onReject,
  onDefer,
  onClose,
}: {
  decision: Decision;
  onApprove: () => void;
  onReject: () => void;
  onDefer: () => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"summary" | "ai" | "panel" | "agents">("summary");
  const [aiExpanded, setAiExpanded] = useState(false);
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const insight = decision.candidateInsight;
  const hasPanel = decision.interviewerVotes.length > 0;
  const relatedEvents = AGENT_EVENTS.filter((e) =>
    e.metadata.candidate === decision.candidateName ||
    e.metadata.requisition === decision.requisition
  ).slice(0, 5);

  const TABS = [
    { key: "summary" as const, label: "Summary", icon: FileText },
    { key: "ai" as const, label: "AI Analysis", icon: Brain },
    ...(hasPanel ? [{ key: "panel" as const, label: "Panel", icon: Users }] : []),
    ...(relatedEvents.length > 0 ? [{ key: "agents" as const, label: "Activity", icon: Bot }] : []),
  ];

  const doAction = (action: string, fn: () => void) => {
    setFeedback(action);
    setTimeout(() => { fn(); onClose(); }, 800);
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Slide-over */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-3xl bg-card border-l border-border z-50 flex flex-col"
      >
        {/* Feedback overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-card/95 backdrop-blur-sm rounded-l-xl"
            >
              <div className="text-center">
                <div className={`size-16 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                  feedback === "approved" ? "bg-success/10" : feedback === "rejected" ? "bg-destructive/10" : "bg-warning/10"
                }`}>
                  {feedback === "approved" ? <Check className="size-8 text-success" /> :
                   feedback === "rejected" ? <X className="size-8 text-destructive" /> :
                   <RotateCcw className="size-8 text-warning" />}
                </div>
                <p className="text-sm font-semibold text-foreground capitalize">{feedback}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="shrink-0 p-5 border-b border-border space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="size-11 rounded-xl bg-brand-purple/10 flex items-center justify-center text-sm font-bold text-brand-purple shrink-0">
                {decision.candidateInitials}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-foreground leading-tight">{decision.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">{decision.subtitle}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${urgencyBgColor(decision.urgency)} ${urgencyColor(decision.urgency)}`}>
                    {urgencyLabel(decision.urgency)}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50">{decisionTypeLabel(decision.type)}</span>
                  {decision.deadline && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      decision.deadline.includes("hour") || decision.deadline === "Today"
                        ? "bg-destructive/10 text-destructive" : "bg-secondary text-muted-foreground"
                    }`}>
                      Due: {decision.deadline}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <ConfidenceBadge score={decision.confidence} size="md" />
              <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground cursor-pointer">
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Candidate info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><User className="size-3 text-muted-foreground/40" />{decision.candidateName}</span>
            <span className="flex items-center gap-1"><Briefcase className="size-3 text-muted-foreground/40" />{decision.candidateRole}</span>
            <span className="flex items-center gap-1"><Building2 className="size-3 text-muted-foreground/40" />{decision.candidateCompany}</span>
            <span className="font-mono text-muted-foreground/30">{decision.requisition}</span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 -mb-3 pt-1">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all cursor-pointer border-b-2 ${
                    activeTab === tab.key ? "text-foreground border-brand bg-card" : "text-muted-foreground/50 border-transparent hover:text-muted-foreground"
                  }`}>
                  <TabIcon className="size-3.5" />{tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <AnimatePresence mode="wait">
            {activeTab === "summary" && (
              <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* Top metrics row */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Fit Score — clean, compact */}
                  <div className={`rounded-xl border border-border p-5 ${fitScoreBgColor(insight.fitScore)}`}>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Fit Score</span>
                    <div className="flex items-end gap-2">
                      <span className={`text-4xl font-bold leading-none ${fitScoreColor(insight.fitScore)}`}>{insight.fitScore}</span>
                      <span className="text-xs text-muted-foreground mb-1">/100</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{insight.strengths.length} strengths</span>
                      <span className="text-muted-foreground/20">·</span>
                      <span className={`text-[11px] font-medium ${insight.risks.length > 0 ? "text-destructive" : "text-success"}`}>
                        {insight.risks.length > 0 ? `${insight.risks.length} risk${insight.risks.length > 1 ? "s" : ""}` : "No risks"}
                      </span>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className={`rounded-xl border p-5 ${
                    decision.recommendation === "approve" ? "border-success/20 bg-success/[0.03]" :
                    decision.recommendation === "reject" ? "border-destructive/20 bg-destructive/[0.03]" :
                    "border-warning/20 bg-warning/[0.03]"
                  }`}>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">AI Says</span>
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${
                        decision.recommendation === "approve" ? "bg-success/15" :
                        decision.recommendation === "reject" ? "bg-destructive/15" : "bg-warning/15"
                      }`}>
                        <Sparkles className={`size-5 ${
                          decision.recommendation === "approve" ? "text-success" :
                          decision.recommendation === "reject" ? "text-destructive" : "text-warning"
                        }`} />
                      </div>
                      <div>
                        <span className={`text-xl font-bold capitalize leading-none block ${
                          decision.recommendation === "approve" ? "text-success" :
                          decision.recommendation === "reject" ? "text-destructive" : "text-warning"
                        }`}>{decision.recommendation}</span>
                        <span className="text-xs text-muted-foreground mt-1 block">{decision.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>

                  {/* Projected Impact */}
                  <div className="rounded-xl border border-brand-purple/15 bg-brand-purple/[0.02] p-5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Impact if Approved</span>
                    <div className="space-y-2">
                      {[
                        { label: "Time to hire", value: "-2 days", color: "text-success" },
                        { label: "Funnel velocity", value: "+8%", color: "text-brand-teal" },
                        { label: "SLA status", value: "Maintained", color: "text-brand" },
                      ].map((m) => (
                        <div key={m.label} className="flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground">{m.label}</span>
                          <span className={`text-sm font-bold ${m.color}`}>{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Brain className="size-4 text-brand-purple" />
                    AI Summary
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight.summary}</p>
                </div>

                {/* Strengths */}
                <div className="rounded-xl border border-success/15 bg-success/[0.02] p-5">
                  <h4 className="text-xs font-semibold text-success flex items-center gap-1.5 mb-3">
                    <Check className="size-3.5" /> Key Strengths
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {insight.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="size-1.5 rounded-full bg-success mt-2 shrink-0" />
                        <span className="text-sm text-foreground/80 leading-snug">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risks — proper table */}
                {insight.risks.length > 0 && (
                  <div className="rounded-xl border border-destructive/15 overflow-hidden">
                    <div className="px-5 py-3 bg-destructive/[0.03] border-b border-destructive/10 flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-destructive flex items-center gap-1.5">
                        <AlertCircle className="size-3.5" /> Risk Signals
                      </h4>
                      <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                        {insight.risks.length}
                      </span>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/20">
                          <th className="px-5 py-2 text-left text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider w-10">#</th>
                          <th className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Risk Description</th>
                          <th className="px-5 py-2 text-right text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider w-20">Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {insight.risks.map((risk, i) => {
                          const severity = i === 0 ? "High" : i === 1 ? "Medium" : "Low";
                          const sevColor = i === 0 ? "text-destructive bg-destructive/10" : i === 1 ? "text-warning bg-warning/10" : "text-muted-foreground bg-secondary";
                          return (
                            <tr key={i} className="border-b border-border/10 last:border-0 hover:bg-destructive/[0.02] transition-colors">
                              <td className="px-5 py-3">
                                <div className="size-6 rounded-full bg-destructive/10 flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-destructive">{i + 1}</span>
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <span className="text-sm text-foreground/80">{risk}</span>
                              </td>
                              <td className="px-5 py-3 text-right">
                                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${sevColor}`}>{severity}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Candidate Details */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Candidate Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: User, label: "Name", value: decision.candidateName },
                      { icon: Briefcase, label: "Role", value: decision.candidateRole },
                      { icon: Building2, label: "Company", value: decision.candidateCompany },
                      { icon: FileText, label: "Requisition", value: decision.requisition },
                      { icon: Clock, label: "Waiting", value: decision.createdAt },
                      { icon: AlertCircle, label: "Deadline", value: decision.deadline || "No deadline" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-secondary/20">
                        <item.icon className="size-4 text-muted-foreground/40 shrink-0" />
                        <div>
                          <span className="text-[10px] text-muted-foreground block">{item.label}</span>
                          <span className="text-sm font-medium text-foreground">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "ai" && (
              <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <AIRecommendation recommendation={decision.recommendation} confidence={decision.confidence} reasoning={decision.aiReasoning} expanded={true} onToggle={() => {}} />

                {/* Always show reasoning in AI tab */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Decision Context</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight.summary}</p>
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/50">
                    {[
                      { label: "Fit Score", value: String(insight.fitScore), color: fitScoreColor(insight.fitScore) },
                      { label: "Strengths", value: String(insight.strengths.length), color: "text-success" },
                      { label: "Risk Signals", value: String(insight.risks.length), color: insight.risks.length > 2 ? "text-destructive" : "text-warning" },
                    ].map((m) => (
                      <div key={m.label} className="text-center py-2 rounded-lg bg-secondary/20">
                        <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                        <span className="text-[10px] text-muted-foreground">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "panel" && (
              <motion.div key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <PanelAlignment votes={decision.interviewerVotes} alignment={decision.panelAlignment} />
              </motion.div>
            )}

            {activeTab === "agents" && (
              <motion.div key="agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="size-4 text-brand-purple" />
                  <h3 className="text-sm font-semibold text-foreground">Related Agent Activity</h3>
                  <span className="text-[10px] text-muted-foreground/50">({relatedEvents.length} events)</span>
                </div>
                {relatedEvents.map((event, i) => (
                  <AgentEventItem key={event.id} event={event} index={i} />
                ))}
                {relatedEvents.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/30">
                    <Bot className="size-8 mb-3" />
                    <p className="text-sm">No related agent activity for this decision</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action bar */}
        <div className="shrink-0 p-4 border-t border-border bg-linear-to-t from-card to-card/80">
          <div className="flex items-center gap-2.5">
            <Button onClick={() => doAction("approved", onApprove)}
              className="flex-1 h-11 bg-success hover:bg-success/90 text-white font-semibold rounded-xl gap-2 cursor-pointer shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
              <Check className="size-4" /> Approve <kbd className="ml-auto px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-mono">A</kbd>
            </Button>
            <Button onClick={() => doAction("rejected", onReject)} variant="outline"
              className="flex-1 h-11 border-destructive/25 text-destructive hover:bg-destructive/8 font-semibold rounded-xl gap-2 cursor-pointer">
              <X className="size-4" /> Reject <kbd className="ml-auto px-1.5 py-0.5 rounded bg-destructive/10 text-[9px] font-mono">R</kbd>
            </Button>
            <Button onClick={() => doAction("deferred", onDefer)} variant="outline" className="h-11 px-4 font-semibold rounded-xl gap-2 cursor-pointer">
              <RotateCcw className="size-4" /><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono">D</kbd>
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ── Main Page ── */

export default function CommandCenterPage() {
  const [decisions, setDecisions] = useState<Decision[]>(DECISIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<QueueFilter>("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("urgency");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [metricsExpanded, setMetricsExpanded] = useState(false);

  const selectedDecision = useMemo(
    () => decisions.find((d) => d.id === selectedId) ?? null,
    [decisions, selectedId]
  );

  const totalCount = DECISIONS.length;
  const actionedCount = decisions.filter((d) => d.status !== "pending").length;
  const pendingCount = decisions.filter((d) => d.status === "pending").length;
  const progressPercent = totalCount > 0 ? (actionedCount / totalCount) * 100 : 0;

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let result = filterDecisions(decisions, filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((d) =>
        d.title.toLowerCase().includes(q) || d.candidateName.toLowerCase().includes(q) || d.requisition.toLowerCase().includes(q)
      );
    }
    const dir = sortDir === "asc" ? 1 : -1;
    result.sort((a, b) => {
      switch (sortField) {
        case "urgency": return (URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]) * dir;
        case "title": return a.title.localeCompare(b.title) * dir;
        case "confidence": return (a.confidence - b.confidence) * dir;
        case "createdAt": return a.createdAt.localeCompare(b.createdAt) * dir;
        case "type": return a.type.localeCompare(b.type) * dir;
        default: return 0;
      }
    });
    return result;
  }, [decisions, filter, search, sortField, sortDir]);

  const handleApprove = useCallback((id: string) => {
    setDecisions((prev) => prev.map((d) => d.id === id ? { ...d, status: "approved" as const } : d));
  }, []);

  const handleReject = useCallback((id: string) => {
    setDecisions((prev) => prev.map((d) => d.id === id ? { ...d, status: "rejected" as const } : d));
  }, []);

  const handleDefer = useCallback((id: string) => {
    setDecisions((prev) => prev.map((d) => d.id === id ? { ...d, status: "deferred" as const } : d));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (e.key === "Escape") { setSelectedId(null); return; }
      if (e.key.toLowerCase() === "m") { setMetricsExpanded((p) => !p); return; }

      if (selectedId && selectedDecision?.status === "pending") {
        if (e.key.toLowerCase() === "a") { handleApprove(selectedId); setSelectedId(null); }
        if (e.key.toLowerCase() === "r") { handleReject(selectedId); setSelectedId(null); }
        if (e.key.toLowerCase() === "d") { handleDefer(selectedId); setSelectedId(null); }
      }

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const idx = filtered.findIndex((d) => d.id === selectedId);
        const next = filtered[idx + 1] ?? filtered[0];
        if (next) setSelectedId(next.id);
      }
      if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = filtered.findIndex((d) => d.id === selectedId);
        const prev = filtered[idx - 1];
        if (prev) setSelectedId(prev.id);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [filtered, selectedId, selectedDecision, handleApprove, handleReject, handleDefer]);

  const FILTER_OPTIONS: { key: QueueFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "critical", label: "Urgent" },
    { key: "offers", label: "Offers" },
    { key: "advances", label: "Advances" },
    { key: "shortlists", label: "Shortlists" },
  ];

  function SortHeader({ field, label, className }: { field: SortField; label: string; className?: string }) {
    const isActive = sortField === field;
    return (
      <button onClick={() => toggleSort(field)} className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors ${isActive ? "text-foreground" : "text-muted-foreground/50"} ${className ?? ""}`}>
        {label}
        {isActive && (sortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
        {!isActive && <ArrowUpDown className="size-2.5 opacity-30" />}
      </button>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6 lg:-m-8">
      {/* ── Header ── */}
      <div className="shrink-0 px-6 pt-4 pb-3 lg:px-8 border-b border-border bg-card/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-linear-to-br from-brand-purple to-brand-teal flex items-center justify-center">
              <Crosshair className="size-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">Hiring Command Center</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-success" /></span>
                  Live
                </span>
                <span className="text-muted-foreground/20">·</span>
                <span><span className="text-foreground font-medium">{pendingCount}</span> pending</span>
                <span className="text-muted-foreground/20">·</span>
                <span><span className="text-foreground font-medium">{actionedCount}</span> actioned</span>
              </div>
            </div>
          </div>

          {/* Progress ring */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-muted-foreground">Progress</span>
              <span className="text-sm font-bold text-foreground block">{actionedCount}/{totalCount}</span>
            </div>
            <div className="relative size-10">
              <svg width={40} height={40} className="-rotate-90">
                <circle cx={20} cy={20} r={16} fill="none" stroke="currentColor" strokeWidth={3} className="text-border" />
                <motion.circle cx={20} cy={20} r={16} fill="none" stroke="#10B981" strokeWidth={3} strokeLinecap="round" strokeDasharray={100.5}
                  initial={{ strokeDashoffset: 100.5 }}
                  animate={{ strokeDashoffset: 100.5 * (1 - progressPercent / 100) }} transition={{ duration: 0.5 }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-success">{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>

        {/* Collapsible metrics */}
        <button onClick={() => setMetricsExpanded(!metricsExpanded)}
          className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50 hover:text-muted-foreground cursor-pointer transition-colors mb-2">
          {metricsExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          {metricsExpanded ? "Hide metrics" : "Show metrics"}
          <kbd className="px-1 py-0.5 rounded bg-secondary text-[8px] font-mono ml-1">M</kbd>
        </button>
        <AnimatePresence>
          {metricsExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <MetricsBar />
            </motion.div>
          )}
        </AnimatePresence>
        {!metricsExpanded && <MetricsBar collapsed onToggle={() => setMetricsExpanded(true)} />}
      </div>

      {/* ── Toolbar ── */}
      <div className="shrink-0 px-6 lg:px-8 py-3 flex items-center gap-3 flex-wrap border-b border-border/50">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
          <input type="text" placeholder="Search decisions..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all" />
        </div>
        <div className="flex items-center gap-1.5">
          {FILTER_OPTIONS.map((opt) => (
            <button key={opt.key} onClick={() => setFilter(opt.key)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                filter === opt.key ? "bg-brand-purple/15 text-brand-purple shadow-sm" : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary/30"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse" style={{ minWidth: 900 }}>
          <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left w-12"></th>
              <th className="px-3 py-3 text-left"><SortHeader field="urgency" label="Urgency" /></th>
              <th className="px-3 py-3 text-left"><SortHeader field="title" label="Decision" /></th>
              <th className="px-3 py-3 text-left w-28"><SortHeader field="type" label="Type" /></th>
              <th className="px-3 py-3 text-center w-20"><SortHeader field="confidence" label="AI" className="justify-center" /></th>
              <th className="px-3 py-3 text-left w-24"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Recommendation</span></th>
              <th className="px-3 py-3 text-left w-24"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Deadline</span></th>
              <th className="px-3 py-3 text-left w-20"><SortHeader field="createdAt" label="When" /></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((decision, i) => {
                const isSelected = selectedId === decision.id;
                const isUrgentDeadline = decision.deadline && (decision.deadline.includes("hour") || decision.deadline === "Today");

                return (
                  <motion.tr
                    key={decision.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    onClick={() => setSelectedId(decision.id)}
                    className={`border-b border-border/20 cursor-pointer transition-colors ${
                      isSelected ? "bg-brand/[0.04]" : "hover:bg-secondary/20"
                    }`}
                  >
                    {/* Urgency indicator */}
                    <td className="px-6 py-3">
                      <div className={`w-1 h-8 rounded-full ${
                        decision.urgency === "critical" ? "bg-destructive animate-pulse" :
                        decision.urgency === "high" ? "bg-warning" :
                        decision.urgency === "medium" ? "bg-brand" : "bg-muted-foreground/20"
                      }`} />
                    </td>

                    {/* Urgency label */}
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${urgencyBgColor(decision.urgency)} ${urgencyColor(decision.urgency)}`}>
                        {urgencyLabel(decision.urgency)}
                      </span>
                    </td>

                    {/* Decision title + candidate */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-[10px] font-bold text-brand-purple shrink-0">
                          {decision.candidateInitials}
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-foreground block truncate">{decision.title}</span>
                          <span className="text-[11px] text-muted-foreground truncate block">{decision.candidateName} · {decision.candidateRole}</span>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-3 py-3">
                      <span className="text-xs text-muted-foreground">{decisionTypeLabel(decision.type)}</span>
                    </td>

                    {/* AI Confidence */}
                    <td className="px-3 py-3 text-center">
                      <ConfidenceBadge score={decision.confidence} size="sm" />
                    </td>

                    {/* Recommendation */}
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        decision.recommendation === "approve" ? "bg-success/10 text-success" :
                        decision.recommendation === "reject" ? "bg-destructive/10 text-destructive" :
                        "bg-warning/10 text-warning"
                      }`}>
                        {decision.recommendation === "approve" ? <Check className="size-3" /> :
                         decision.recommendation === "reject" ? <X className="size-3" /> :
                         <RotateCcw className="size-3" />}
                        {decision.recommendation === "approve" ? "Approve" : decision.recommendation === "reject" ? "Reject" : "Defer"}
                      </span>
                    </td>

                    {/* Deadline */}
                    <td className="px-3 py-3">
                      {decision.deadline ? (
                        <span className={`text-xs font-medium ${isUrgentDeadline ? "text-destructive" : "text-muted-foreground"}`}>
                          {isUrgentDeadline && <AlertCircle className="size-3 inline mr-1 animate-pulse" />}
                          {decision.deadline}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/30">—</span>
                      )}
                    </td>

                    {/* Time */}
                    <td className="px-3 py-3">
                      <span className="text-xs text-muted-foreground/50">{decision.createdAt}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30">
            {pendingCount === 0 ? (
              <>
                <div className="size-14 rounded-2xl bg-success/10 flex items-center justify-center mb-3"><Check className="size-7 text-success" /></div>
                <p className="text-sm font-medium text-success/60">All decisions actioned</p>
              </>
            ) : (
              <>
                <Search className="size-8 mb-3" />
                <p className="text-sm">No decisions match your search</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Keyboard Bar ── */}
      <div className="shrink-0 border-t border-border bg-card/80 backdrop-blur-sm px-6 py-1.5 flex items-center gap-5 text-[10px] text-muted-foreground/40">
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">J/K</kbd> Navigate</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">Enter</kbd> Open</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">A</kbd> Approve</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">R</kbd> Reject</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">D</kbd> Defer</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">Esc</kbd> Close</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">M</kbd> Metrics</span>
      </div>

      {/* ── Detail Slide-Over ── */}
      <AnimatePresence>
        {selectedDecision && (
          <DetailSlideOver
            decision={selectedDecision}
            onApprove={() => handleApprove(selectedDecision.id)}
            onReject={() => handleReject(selectedDecision.id)}
            onDefer={() => handleDefer(selectedDecision.id)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
