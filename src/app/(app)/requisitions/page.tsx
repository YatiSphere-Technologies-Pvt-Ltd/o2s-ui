"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  X,
  Check,
  Clock,
  AlertCircle,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  BarChart3,
  Users,
  Briefcase,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type Requisition,
  type ReqStatus,
  type ReqPriority,
  type ReqType,
  REQUISITIONS,
  REQ_COUNTS,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  TYPE_CONFIG,
  SLOT_STATUS_CONFIG,
  healthColor,
  healthBarColor,
  urgencyBadge,
} from "@/components/requisitions/data";
import { CreateRequisitionWizard } from "@/components/requisitions/create-requisition-wizard";
import { TASubNav } from "@/components/ta/ta-sub-nav";

/* ── Sort ── */

type SortField = "id" | "title" | "status" | "priority" | "department" | "daysOpen" | "healthScore" | "positions";
type SortDir = "asc" | "desc";

const STATUS_ORDER: Record<ReqStatus, number> = {
  draft: 0, pending_approval: 1, approved: 2, sourcing: 3, interviewing: 4,
  offer_stage: 5, partially_filled: 6, filled: 7, on_hold: 8, cancelled: 9,
};

const PRIORITY_ORDER: Record<ReqPriority, number> = { urgent: 0, high: 1, standard: 2, low: 3 };

/* ── Filter ── */

type StatusFilter = "all" | "active" | "pending" | "filled" | "on_hold";

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "filled", label: "Filled" },
  { key: "on_hold", label: "On Hold" },
];

function filterReqs(reqs: Requisition[], filter: StatusFilter): Requisition[] {
  switch (filter) {
    case "active": return reqs.filter((r) => ["sourcing", "interviewing", "offer_stage", "partially_filled", "approved"].includes(r.status));
    case "pending": return reqs.filter((r) => r.status === "pending_approval" || r.status === "draft");
    case "filled": return reqs.filter((r) => r.status === "filled");
    case "on_hold": return reqs.filter((r) => r.status === "on_hold" || r.status === "cancelled");
    default: return reqs;
  }
}

/* ── Detail Slide-Over ── */

function ReqDetailSlideOver({ req, onClose }: { req: Requisition; onClose: () => void }) {
  const statusCfg = STATUS_CONFIG[req.status];
  const priorityCfg = PRIORITY_CONFIG[req.priority];
  const typeCfg = TYPE_CONFIG[req.type];
  const urgency = urgencyBadge(req.aiUrgencyScore);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-3xl bg-card border-l border-border z-50 flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-border space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground/50">{req.id}</span>
                <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full ${statusCfg.textClass} bg-current/10`}>
                  <span className={`size-1.5 rounded-full ${statusCfg.dotClass}`} />{statusCfg.label}
                </span>
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${priorityCfg.textClass} bg-current/10`}>{priorityCfg.label}</span>
              </div>
              <h2 className="text-lg font-bold text-foreground">{req.title}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{req.department} · {req.level} · {typeCfg.label}</p>
            </div>
            <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground cursor-pointer">
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
          {/* Key metrics */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Positions", value: `${req.filledPositions}/${req.totalPositions}`, color: req.filledPositions >= req.totalPositions ? "text-success" : "text-foreground" },
              { label: "Candidates", value: String(req.totalCandidatesMapped), color: "text-brand" },
              { label: "Interviewing", value: String(req.totalInterviewing), color: "text-brand-purple" },
              { label: "Offers", value: String(req.totalOffers), color: "text-brand-teal" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-border p-4 text-center">
                <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
                <span className="text-[10px] text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Details grid */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: User, label: "Hiring Manager", value: req.hiringManager },
                { icon: DollarSign, label: "Salary Range", value: req.salaryRange },
                { icon: Calendar, label: "Created", value: req.createdDate },
                { icon: Calendar, label: "Target Fill", value: req.targetFillDate },
                { icon: Clock, label: "Days Open", value: req.daysOpen !== null ? `${req.daysOpen} days` : "—" },
                { icon: BarChart3, label: "Health Score", value: req.healthScore !== null ? `${req.healthScore}/100` : "—" },
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

          {/* AI Insight */}
          <div className="rounded-xl border border-brand-purple/15 bg-brand-purple/[0.02] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-4 text-brand-purple" />
              <span className="text-sm font-semibold text-foreground">AI Insight</span>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${urgency.bgClass} ${urgency.colorClass}`}>{urgency.label}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{req.aiInsight}</p>
          </div>

          {/* Position Slots */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-secondary/20">
              <h3 className="text-sm font-semibold text-foreground">Position Slots ({req.slots.length})</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="px-5 py-2 text-left text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Slot</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Location</th>
                  <th className="px-3 py-2 text-center text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-center text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Pipeline</th>
                  <th className="px-5 py-2 text-left text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Recruiter</th>
                </tr>
              </thead>
              <tbody>
                {req.slots.map((slot) => {
                  const slotCfg = SLOT_STATUS_CONFIG[slot.status];
                  return (
                    <tr key={slot.id} className="border-b border-border/10 last:border-0">
                      <td className="px-5 py-3"><span className="text-xs font-mono text-muted-foreground">#{slot.slotNumber}</span></td>
                      <td className="px-3 py-3">
                        <div className="text-xs text-foreground">{slot.location}</div>
                        <div className="text-[10px] text-muted-foreground/50">{slot.workMode}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full`}>
                          <span className={`size-1.5 rounded-full ${slotCfg.dotClass}`} />
                          <span className="text-muted-foreground">{slotCfg.label}</span>
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-2 text-[10px]">
                          <span className="text-brand font-medium">{slot.candidatesMapped}m</span>
                          <span className="text-muted-foreground/20">→</span>
                          <span className="text-brand-purple font-medium">{slot.interviewing}i</span>
                          <span className="text-muted-foreground/20">→</span>
                          <span className="text-brand-teal font-medium">{slot.offers}o</span>
                        </div>
                      </td>
                      <td className="px-5 py-3"><span className="text-xs text-muted-foreground">{slot.recruiter}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Approval Chain */}
          {req.approvalChain.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Approval Chain ({req.approvalProgress})</h3>
              <div className="flex items-center gap-2">
                {req.approvalChain.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-2">
                      <div className={`size-7 rounded-full flex items-center justify-center ${
                        step.status === "approved" ? "bg-success/10" :
                        step.status === "pending" ? "bg-warning/10" :
                        step.status === "rejected" ? "bg-destructive/10" : "bg-secondary"
                      }`}>
                        {step.status === "approved" ? <Check className="size-3.5 text-success" /> :
                         step.status === "pending" ? <Clock className="size-3.5 text-warning" /> :
                         step.status === "rejected" ? <X className="size-3.5 text-destructive" /> :
                         <Clock className="size-3.5 text-muted-foreground/30" />}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground block">{step.name}</span>
                        <span className="text-[10px] text-muted-foreground">{step.role}</span>
                      </div>
                    </div>
                    {i < req.approvalChain.length - 1 && <div className="w-4 h-px bg-border" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Business Case */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Business Case</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{req.businessCase}</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ── Main Page ── */

export default function RequisitionsPage() {
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("priority");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const selectedReq = useMemo(() => REQUISITIONS.find((r) => r.id === selectedId) ?? null, [selectedId]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let result = filterReqs(REQUISITIONS, statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.hiringManager.toLowerCase().includes(q)
      );
    }
    const dir = sortDir === "asc" ? 1 : -1;
    result = [...result].sort((a, b) => {
      switch (sortField) {
        case "id": return a.id.localeCompare(b.id) * dir;
        case "title": return a.title.localeCompare(b.title) * dir;
        case "status": return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * dir;
        case "priority": return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir;
        case "department": return a.department.localeCompare(b.department) * dir;
        case "daysOpen": return ((a.daysOpen ?? 0) - (b.daysOpen ?? 0)) * dir;
        case "healthScore": return ((a.healthScore ?? 0) - (b.healthScore ?? 0)) * dir;
        case "positions": return ((a.totalPositions - a.filledPositions) - (b.totalPositions - b.filledPositions)) * dir;
        default: return 0;
      }
    });
    return result;
  }, [statusFilter, search, sortField, sortDir]);

  function SH({ field, label, className }: { field: SortField; label: string; className?: string }) {
    const active = sortField === field;
    return (
      <button onClick={() => toggleSort(field)} className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors ${active ? "text-foreground" : "text-muted-foreground/50"} ${className ?? ""}`}>
        {label}
        {active ? (sortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />) : <ArrowUpDown className="size-2.5 opacity-30" />}
      </button>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <TASubNav activePage="requisitions" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-linear-to-br from-brand-purple to-brand flex items-center justify-center">
            <ClipboardList className="size-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Requisitions</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span><span className="text-foreground font-medium">{REQ_COUNTS.total}</span> total</span>
              <span className="text-muted-foreground/20">·</span>
              <span><span className="text-brand font-medium">{REQ_COUNTS.openPositions}</span> open positions</span>
              <span className="text-muted-foreground/20">·</span>
              <span><span className="text-warning font-medium">{REQ_COUNTS.pending}</span> pending</span>
              <span className="text-muted-foreground/20">·</span>
              <span><span className="text-brand-purple font-medium">{REQ_COUNTS.taQueue}</span> in TA queue</span>
            </div>
          </div>
        </div>
        <Button className="bg-brand-purple text-white hover:bg-brand-purple/90 gap-1.5 rounded-xl" onClick={() => setShowCreateWizard(true)}>
          <Plus className="size-4" /> New Requisition
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
          <input type="text" placeholder="Search by ID, title, department, manager..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all" />
        </div>
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                statusFilter === f.key ? "bg-brand-purple/15 text-brand-purple shadow-sm" : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary/30"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-xl border border-border bg-card/50">
        <table className="w-full border-collapse" style={{ minWidth: 1100 }}>
          <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left w-10"></th>
              <th className="px-3 py-3 text-left w-28"><SH field="id" label="Req ID" /></th>
              <th className="px-3 py-3 text-left"><SH field="title" label="Title" /></th>
              <th className="px-3 py-3 text-left w-24"><SH field="department" label="Dept" /></th>
              <th className="px-3 py-3 text-center w-24"><SH field="status" label="Status" className="justify-center" /></th>
              <th className="px-3 py-3 text-center w-16"><SH field="priority" label="Priority" className="justify-center" /></th>
              <th className="px-3 py-3 text-center w-20"><SH field="positions" label="Slots" className="justify-center" /></th>
              <th className="px-3 py-3 text-center w-24"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Pipeline</span></th>
              <th className="px-3 py-3 text-center w-16"><SH field="healthScore" label="Health" className="justify-center" /></th>
              <th className="px-3 py-3 text-center w-16"><SH field="daysOpen" label="Days" className="justify-center" /></th>
              <th className="px-3 py-3 text-left w-28"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Manager</span></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req, i) => {
              const statusCfg = STATUS_CONFIG[req.status];
              const priorityCfg = PRIORITY_CONFIG[req.priority];
              const isExpanded = expandedId === req.id;
              const openSlots = req.totalPositions - req.filledPositions;

              return (
                <React.Fragment key={req.id}>
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setSelectedId(req.id)}
                    className={`border-b border-border/20 cursor-pointer transition-colors ${selectedId === req.id ? "bg-brand/[0.03]" : "hover:bg-secondary/20"}`}
                  >
                    {/* Expand toggle */}
                    <td className="px-4 py-3" onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : req.id); }}>
                      <ChevronDown className={`size-4 text-muted-foreground/30 transition-transform cursor-pointer hover:text-muted-foreground ${isExpanded ? "rotate-180" : ""}`} />
                    </td>

                    {/* ID */}
                    <td className="px-3 py-3">
                      <span className="text-xs font-mono text-muted-foreground">{req.id}</span>
                    </td>

                    {/* Title + Level */}
                    <td className="px-3 py-3">
                      <span className="text-sm font-semibold text-foreground block truncate">{req.title}</span>
                      <span className="text-[10px] text-muted-foreground">{req.level} · {TYPE_CONFIG[req.type].label}</span>
                    </td>

                    {/* Department */}
                    <td className="px-3 py-3">
                      <span className="text-xs text-muted-foreground">{req.department}</span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full">
                        <span className={`size-1.5 rounded-full ${statusCfg.dotClass}`} />
                        <span className={statusCfg.textClass}>{statusCfg.abbr}</span>
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-3 py-3 text-center">
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${priorityCfg.textClass} bg-current/10`}>
                        {priorityCfg.label}
                      </span>
                    </td>

                    {/* Positions */}
                    <td className="px-3 py-3 text-center">
                      <span className={`text-sm font-bold ${openSlots > 0 ? "text-foreground" : "text-success"}`}>{req.filledPositions}/{req.totalPositions}</span>
                    </td>

                    {/* Pipeline */}
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-[10px]">
                        <span className="text-brand font-medium">{req.totalCandidatesMapped}</span>
                        <span className="text-muted-foreground/20">→</span>
                        <span className="text-brand-purple font-medium">{req.totalInterviewing}</span>
                        <span className="text-muted-foreground/20">→</span>
                        <span className="text-brand-teal font-medium">{req.totalOffers}</span>
                      </div>
                    </td>

                    {/* Health */}
                    <td className="px-3 py-3 text-center">
                      {req.healthScore !== null ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs font-bold ${healthColor(req.healthScore)}`}>{req.healthScore}</span>
                          <div className="w-8 h-1 rounded-full bg-secondary overflow-hidden">
                            <div className={`h-full rounded-full ${healthBarColor(req.healthScore)}`} style={{ width: `${req.healthScore}%` }} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/30">—</span>
                      )}
                    </td>

                    {/* Days Open */}
                    <td className="px-3 py-3 text-center">
                      <span className={`text-xs font-medium ${req.daysOpen && req.daysOpen > 60 ? "text-destructive" : req.daysOpen && req.daysOpen > 30 ? "text-warning" : "text-muted-foreground"}`}>
                        {req.daysOpen ?? "—"}
                      </span>
                    </td>

                    {/* Manager */}
                    <td className="px-3 py-3">
                      <span className="text-xs text-muted-foreground truncate block">{req.hiringManager}</span>
                    </td>
                  </motion.tr>

                  {/* Expanded inline row */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={11} className="p-0">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-4 bg-secondary/[0.03] border-b border-border/30">
                            <div className="grid grid-cols-[1fr_1fr] gap-6">
                              {/* Left: Slots table */}
                              <div>
                                <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider block mb-2">Position Slots</span>
                                <div className="space-y-1.5">
                                  {req.slots.map((slot) => {
                                    const slotCfg = SLOT_STATUS_CONFIG[slot.status];
                                    return (
                                      <div key={slot.id} className="flex items-center gap-3 text-xs py-1.5 px-2 rounded-lg bg-secondary/20">
                                        <span className="font-mono text-muted-foreground w-6">#{slot.slotNumber}</span>
                                        <span className="flex items-center gap-1"><MapPin className="size-3 text-muted-foreground/40" />{slot.location}</span>
                                        <span className="text-muted-foreground/30">{slot.workMode}</span>
                                        <span className="ml-auto flex items-center gap-1">
                                          <span className={`size-1.5 rounded-full ${slotCfg.dotClass}`} />
                                          <span className="text-muted-foreground">{slotCfg.label}</span>
                                        </span>
                                        <span className="text-muted-foreground/50 w-20 text-right">{slot.recruiter}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Right: AI + Business case */}
                              <div className="space-y-3">
                                <div>
                                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider block mb-1.5">AI Insight</span>
                                  <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-purple/[0.03] border border-brand-purple/10">
                                    <Sparkles className="size-3.5 text-brand-purple shrink-0 mt-0.5" />
                                    <p className="text-xs text-muted-foreground leading-snug">{req.aiInsight}</p>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider block mb-1.5">Business Case</span>
                                  <p className="text-xs text-muted-foreground leading-snug">{req.businessCase}</p>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] text-muted-foreground/40">
                                  <span>Salary: {req.salaryRange}</span>
                                  <span>Target: {req.targetFillDate}</span>
                                  <span>Approval: {req.approvalProgress}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30">
            <Search className="size-8 mb-3" />
            <p className="text-sm">No requisitions match your search</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 mt-2 text-[10px] text-muted-foreground/40">
        {filtered.length} of {REQUISITIONS.length} requisitions · Click row for details · Click arrow to expand inline
      </div>

      {/* Detail Slide-Over */}
      <AnimatePresence>
        {selectedReq && (
          <ReqDetailSlideOver req={selectedReq} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>

      <CreateRequisitionWizard open={showCreateWizard} onClose={() => setShowCreateWizard(false)} />
    </div>
  );
}
