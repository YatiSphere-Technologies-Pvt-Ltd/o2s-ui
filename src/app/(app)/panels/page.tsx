"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Calendar,
  BarChart3,
  Settings2,
  Plus,
  ChevronDown,
  ChevronUp,
  Check,
  Star,
  Ban,
  RefreshCw,
  AlertTriangle,
  Clock,
  Shield,
  Sparkles,
  Link2,
  PenLine,
  Mail,
  Award,
  Eye,
  Pause,
  Play,
  MoreHorizontal,
  ArrowUpDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type PanelMember,
  type PanelTab,
  type PanelStatus,
  type Seniority,
  PANEL_TABS,
  PANEL_MEMBERS,
  DAYS,
  TIME_SLOTS,
  seniorityLabel,
  seniorityOrder,
  statusColor,
  statusBgColor,
  statusLabel,
  sourceLabel,
  sourceColor,
  sourceBgColor,
  scoreColor,
  biasLabel,
  biasColor,
  loadColor,
} from "@/components/panels/data";

const tabTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

/* ══════════════════════════════════════════════
   Members Tab — Full Interactive Table
   ══════════════════════════════════════════════ */

type SortField = "name" | "seniority" | "score" | "load" | "interviews" | "bias";
type SortDir = "asc" | "desc";

function MembersTab({
  members,
  expandedId,
  onToggleExpand,
  onToggleStatus,
}: {
  members: PanelMember[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onToggleStatus: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PanelStatus | "all">("all");
  const [sortField, setSortField] = useState<SortField>("seniority");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let result = members.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.department.toLowerCase().includes(q) || m.interviewTypes.some((t) => t.toLowerCase().includes(q));
      }
      return true;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    result.sort((a, b) => {
      switch (sortField) {
        case "name": return a.name.localeCompare(b.name) * dir;
        case "seniority": return (seniorityOrder(a.seniority) - seniorityOrder(b.seniority)) * dir;
        case "score": return (a.avgFeedbackScore - b.avgFeedbackScore) * dir;
        case "load": return (a.thisWeekCount - b.thisWeekCount) * dir;
        case "interviews": return (a.totalInterviews - b.totalInterviews) * dir;
        case "bias": return (a.biasScore - b.biasScore) * dir;
        default: return 0;
      }
    });
    return result;
  }, [members, search, statusFilter, sortField, sortDir]);

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
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
          <input type="text" placeholder="Search by name, role, department, skill..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all" />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "active", "paused", "onboarding"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors cursor-pointer ${statusFilter === s ? "bg-brand-purple/15 text-brand-purple" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
              {s === "all" ? `All (${members.length})` : `${statusLabel(s)} (${members.filter((m) => m.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full border-collapse" style={{ minWidth: 1000 }}>
            <thead>
              <tr className="border-b border-border bg-secondary/20">
                <th className="px-4 py-3 text-left w-64"><SortHeader field="name" label="Member" /></th>
                <th className="px-3 py-3 text-left"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Skills</span></th>
                <th className="px-3 py-3 text-center w-20"><SortHeader field="seniority" label="Level" className="justify-center" /></th>
                <th className="px-3 py-3 text-center w-16"><SortHeader field="score" label="Score" className="justify-center" /></th>
                <th className="px-3 py-3 text-center w-20"><SortHeader field="load" label="Load" className="justify-center" /></th>
                <th className="px-3 py-3 text-center w-20"><SortHeader field="interviews" label="Total" className="justify-center" /></th>
                <th className="px-3 py-3 text-center w-16"><SortHeader field="bias" label="Bias" className="justify-center" /></th>
                <th className="px-3 py-3 text-center w-24"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Calendar</span></th>
                <th className="px-3 py-3 text-center w-16"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Status</span></th>
                <th className="px-3 py-3 text-center w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member, i) => {
                const isExpanded = expandedId === member.id;
                const totalWeeklySlots = member.weeklySlots.reduce((s, d) => s + d.times.length, 0);

                return (
                  <React.Fragment key={member.id}>
                    {/* Main row */}
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className={`border-b border-border/20 transition-colors cursor-pointer ${isExpanded ? "bg-brand/[0.02]" : "hover:bg-secondary/20"}`} onClick={() => onToggleExpand(member.id)}>
                      {/* Member */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-lg bg-brand-purple/10 flex items-center justify-center text-[11px] font-bold text-brand-purple shrink-0">
                            {member.initials}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-semibold text-foreground block truncate">{member.name}</span>
                            <span className="text-[11px] text-muted-foreground">{member.role} · {member.department}</span>
                          </div>
                        </div>
                      </td>

                      {/* Skills */}
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {member.interviewTypes.slice(0, 3).map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded-md bg-secondary text-[9px] font-medium text-muted-foreground">{t}</span>
                          ))}
                          {member.interviewTypes.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-secondary text-[9px] text-muted-foreground/50">+{member.interviewTypes.length - 3}</span>
                          )}
                        </div>
                      </td>

                      {/* Seniority */}
                      <td className="px-3 py-3 text-center">
                        <span className="text-xs font-medium text-foreground">{seniorityLabel(member.seniority)}</span>
                      </td>

                      {/* Score */}
                      <td className="px-3 py-3 text-center">
                        <span className={`text-sm font-bold ${scoreColor(member.avgFeedbackScore)}`}>{member.avgFeedbackScore}</span>
                      </td>

                      {/* Load */}
                      <td className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs font-bold ${loadColor(member.thisWeekCount, member.maxPerWeek)}`}>
                            {member.thisWeekCount}/{member.maxPerWeek}
                          </span>
                          <div className="w-10 h-1 rounded-full bg-secondary overflow-hidden">
                            <div className={`h-full rounded-full ${member.thisWeekCount >= member.maxPerWeek ? "bg-destructive" : member.thisWeekCount >= member.maxPerWeek * 0.75 ? "bg-warning" : "bg-success"}`}
                              style={{ width: `${Math.min((member.thisWeekCount / member.maxPerWeek) * 100, 100)}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-3 py-3 text-center">
                        <span className="text-xs font-medium text-foreground">{member.totalInterviews}</span>
                      </td>

                      {/* Bias */}
                      <td className="px-3 py-3 text-center">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${member.biasScore <= 5 ? "bg-success/10 text-success" : member.biasScore <= 10 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                          {biasLabel(member.biasScore)}
                        </span>
                      </td>

                      {/* Calendar */}
                      <td className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={`text-[9px] font-semibold ${sourceColor(member.availabilitySource)}`}>
                            {sourceLabel(member.availabilitySource)}
                          </span>
                          {member.calendarConnected && member.lastSynced && (
                            <span className="text-[8px] text-muted-foreground/40">{member.lastSynced}</span>
                          )}
                          {!member.calendarConnected && (
                            <span className="text-[8px] text-muted-foreground/30">Not synced</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 text-center">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${statusBgColor(member.status)} ${statusColor(member.status)}`}>
                          {statusLabel(member.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => onToggleStatus(member.id)} className="size-7 flex items-center justify-center rounded-md hover:bg-secondary text-muted-foreground/40 hover:text-foreground cursor-pointer transition-colors" title={member.status === "active" ? "Pause" : "Activate"}>
                          {member.status === "active" ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                        </button>
                      </td>
                    </motion.tr>

                    {/* Expanded row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={10} className="p-0">
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                            <div className="px-6 py-5 bg-secondary/[0.03] border-b border-border/30 space-y-5">
                              <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6">
                                {/* Left: Details */}
                                <div className="space-y-4">
                                  {/* Contact + Meta */}
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Mail className="size-3" /> {member.email}</span>
                                    <span>Joined: {member.joinedPanel}</span>
                                    {member.lastInterview && <span>Last: {member.lastInterview}</span>}
                                  </div>

                                  {/* Certifications */}
                                  <div>
                                    <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider block mb-1.5">Certifications & Training</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {member.certifications.map((c) => (
                                        <span key={c} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-success/8 text-[10px] font-medium text-success">
                                          <Award className="size-2.5" /> {c}
                                        </span>
                                      ))}
                                      {member.trainedOn.map((t) => (
                                        <span key={t} className="px-2 py-0.5 rounded-md bg-secondary text-[10px] text-muted-foreground">{t}</span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Preferences */}
                                  <div className="grid grid-cols-4 gap-2">
                                    {[
                                      { label: "Max/Week", value: member.maxPerWeek },
                                      { label: "Max/Day", value: member.maxPerDay },
                                      { label: "Min Gap", value: `${member.minGapMinutes}m` },
                                      { label: "Duration", value: `${member.preferredDuration}m` },
                                    ].map((p) => (
                                      <div key={p.label} className="rounded-lg bg-secondary/30 p-2 text-center">
                                        <div className="text-sm font-bold text-foreground">{p.value}</div>
                                        <span className="text-[9px] text-muted-foreground">{p.label}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Performance metrics */}
                                  <div className="grid grid-cols-3 gap-2">
                                    {[
                                      { label: "CSAT", value: `${member.candidateSatisfaction}%`, color: scoreColor(member.candidateSatisfaction / 20) },
                                      { label: "Feedback Time", value: member.avgFeedbackTime, color: "text-foreground" },
                                      { label: "No-Show Rate", value: `${member.noShowRate}%`, color: member.noShowRate > 3 ? "text-destructive" : "text-success" },
                                    ].map((m) => (
                                      <div key={m.label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/20">
                                        <span className="text-[10px] text-muted-foreground">{m.label}</span>
                                        <span className={`text-xs font-bold ${m.color}`}>{m.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Right: Weekly availability mini-calendar */}
                                <div>
                                  <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider block mb-2">Weekly Availability</span>
                                  <div className="space-y-1.5">
                                    {DAYS.map((day) => {
                                      const daySlot = member.weeklySlots.find((ws) => ws.day === day.key);
                                      const dayTimes = daySlot?.times ?? [];
                                      const isOff = member.noInterviewDays.includes(day.key);

                                      return (
                                        <div key={day.key} className="flex items-center gap-2">
                                          <span className={`text-[10px] font-medium w-8 shrink-0 ${isOff ? "text-muted-foreground/20 line-through" : "text-muted-foreground"}`}>
                                            {day.label.slice(0, 3)}
                                          </span>
                                          {isOff ? (
                                            <span className="text-[10px] text-muted-foreground/20 italic">Off</span>
                                          ) : (
                                            <div className="flex gap-0.5 flex-1">
                                              {TIME_SLOTS.map((time) => {
                                                const isAvail = dayTimes.includes(time);
                                                return (
                                                  <div key={time} className={`h-5 flex-1 rounded-sm transition-colors ${isAvail ? "bg-success/20" : "bg-secondary/15"}`}
                                                    title={`${day.label} ${time} — ${isAvail ? "Available" : "Blocked"}`} />
                                                );
                                              })}
                                            </div>
                                          )}
                                          {!isOff && (
                                            <span className="text-[9px] text-muted-foreground/40 w-8 text-right shrink-0">{dayTimes.length}</span>
                                          )}
                                        </div>
                                      );
                                    })}
                                    {/* Time labels */}
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="w-8 shrink-0" />
                                      <div className="flex flex-1 justify-between px-0.5">
                                        <span className="text-[7px] text-muted-foreground/25">9:00</span>
                                        <span className="text-[7px] text-muted-foreground/25">12:00</span>
                                        <span className="text-[7px] text-muted-foreground/25">3:00</span>
                                        <span className="text-[7px] text-muted-foreground/25">5:30</span>
                                      </div>
                                      <span className="w-8 shrink-0" />
                                    </div>
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
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border/30 bg-card/50 text-[10px] text-muted-foreground/40">
          {filtered.length} of {members.length} members · Click a row to expand details
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Availability Tab — Visual Weekly Calendar
   ══════════════════════════════════════════════ */

function AvailabilityTab({ members }: { members: PanelMember[] }) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const active = members.filter((m) => m.status === "active");
  const viewing = selectedMember ? members.find((m) => m.id === selectedMember) : null;

  // Build heatmap: for each day+time, count how many members are available
  const heatmap = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    for (const day of DAYS) {
      map[day.key] = {};
      for (const time of TIME_SLOTS) {
        map[day.key][time] = active.filter((m) => {
          const daySlot = m.weeklySlots.find((ws) => ws.day === day.key);
          return daySlot?.times.includes(time) ?? false;
        }).length;
      }
    }
    return map;
  }, [active]);

  const maxCount = active.length;

  return (
    <div className="space-y-5">
      {/* Member selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => setSelectedMember(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${!selectedMember ? "bg-brand/10 text-brand ring-1 ring-brand/20" : "text-muted-foreground hover:bg-secondary/30"}`}>
          All Panel ({active.length})
        </button>
        {active.map((m) => (
          <button key={m.id} onClick={() => setSelectedMember(m.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${selectedMember === m.id ? "bg-brand-purple/10 text-brand-purple ring-1 ring-brand-purple/20" : "text-muted-foreground hover:bg-secondary/30"}`}>
            <div className="size-5 rounded-md bg-brand-purple/10 flex items-center justify-center text-[8px] font-bold text-brand-purple">{m.initials}</div>
            {m.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Day columns */}
        <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border">
          <div className="px-3 py-3">
            <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Time</span>
          </div>
          {DAYS.map((day) => (
            <div key={day.key} className="px-2 py-3 text-center border-l border-border/30">
              <span className="text-xs font-semibold text-foreground">{day.label}</span>
            </div>
          ))}
        </div>

        {/* Time rows */}
        <div className="max-h-[calc(100vh-22rem)] overflow-y-auto scrollbar-thin">
          {TIME_SLOTS.map((time, timeIdx) => {
            const isHour = !time.includes(":30");
            return (
              <div key={time} className={`grid grid-cols-[80px_repeat(5,1fr)] ${isHour ? "border-t border-border/20" : ""}`}>
                {/* Time label */}
                <div className={`px-3 py-0 flex items-center ${isHour ? "pt-1" : ""}`}>
                  {isHour && <span className="text-[11px] font-medium text-muted-foreground/50 tabular-nums">{time}</span>}
                </div>

                {/* Day cells */}
                {DAYS.map((day) => {
                  if (viewing) {
                    // Single member view
                    const daySlot = viewing.weeklySlots.find((ws) => ws.day === day.key);
                    const isAvail = daySlot?.times.includes(time) ?? false;
                    const isOff = viewing.noInterviewDays.includes(day.key);

                    return (
                      <div key={day.key} className={`border-l border-border/10 px-1 py-0.5 min-h-7 flex items-center justify-center ${
                        isOff ? "bg-muted-foreground/[0.02]" :
                        isAvail ? "bg-success/[0.08]" : ""
                      }`}>
                        {isAvail && (
                          <div className="w-full h-5 rounded-md bg-success/20 border border-success/15 flex items-center justify-center">
                            <Check className="size-3 text-success/60" />
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Heatmap view
                  const count = heatmap[day.key]?.[time] ?? 0;
                  const intensity = count / maxCount;

                  return (
                    <div key={day.key} className="border-l border-border/10 px-1 py-0.5 min-h-7 flex items-center justify-center">
                      {count > 0 && (
                        <div className={`w-full h-5 rounded-md flex items-center justify-center transition-colors ${
                          intensity >= 0.7 ? "bg-success/25 border border-success/20" :
                          intensity >= 0.4 ? "bg-success/15 border border-success/10" :
                          "bg-success/8 border border-success/5"
                        }`}>
                          <span className={`text-[9px] font-bold tabular-nums ${
                            intensity >= 0.7 ? "text-success" : intensity >= 0.4 ? "text-success/70" : "text-success/40"
                          }`}>
                            {count}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="px-4 py-2.5 border-t border-border/30 bg-card/50 flex items-center gap-5 text-[10px] text-muted-foreground/40">
          {viewing ? (
            <>
              <span className="flex items-center gap-1.5"><div className="w-5 h-4 rounded-md bg-success/20 border border-success/15" /> Available</span>
              <span className="flex items-center gap-1.5"><div className="w-5 h-4 rounded-md" /> Blocked</span>
              <span className="ml-auto">{viewing.name} · {viewing.weeklySlots.reduce((s, d) => s + d.times.length, 0)} total slots · {viewing.noInterviewDays.length > 0 ? `No interviews: ${viewing.noInterviewDays.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")}` : "All days active"}</span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5"><div className="w-5 h-4 rounded-md bg-success/25 border border-success/20" /> High availability</span>
              <span className="flex items-center gap-1.5"><div className="w-5 h-4 rounded-md bg-success/8 border border-success/5" /> Low availability</span>
              <span className="ml-auto">Number = panel members available at that slot</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Performance Tab
   ══════════════════════════════════════════════ */

function PerformanceTab({ members }: { members: PanelMember[] }) {
  const active = [...members].filter((m) => m.status === "active").sort((a, b) => b.avgFeedbackScore - a.avgFeedbackScore);
  const avgScore = active.reduce((s, m) => s + m.avgFeedbackScore, 0) / active.length;
  const totalInterviews = active.reduce((s, m) => s + m.totalInterviews, 0);
  const avgBias = active.reduce((s, m) => s + m.biasScore, 0) / active.length;
  const avgNoShow = active.reduce((s, m) => s + m.noShowRate, 0) / active.length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Avg Score", value: avgScore.toFixed(1), accent: "text-success", bg: "bg-success/10" },
          { label: "Total Interviews", value: totalInterviews.toLocaleString(), accent: "text-brand", bg: "bg-brand/10" },
          { label: "Avg Bias", value: avgBias.toFixed(0), accent: "text-warning", bg: "bg-warning/10" },
          { label: "Avg No-Show", value: avgNoShow.toFixed(1) + "%", accent: "text-brand-teal", bg: "bg-brand-teal/10" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className={`text-2xl font-bold ${s.accent}`}>{s.value}</div>
            <span className="text-[10px] text-muted-foreground mt-1 block">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Leaderboard table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/20">
              <th className="px-4 py-3 text-left w-10"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase">#</span></th>
              <th className="px-3 py-3 text-left"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase">Member</span></th>
              <th className="px-3 py-3 text-center w-16"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase">Score</span></th>
              <th className="px-3 py-3 text-center w-16"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase">Total</span></th>
              <th className="px-3 py-3 text-center w-16"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase">Bias</span></th>
              <th className="px-3 py-3 text-center w-16"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase">CSAT</span></th>
              <th className="px-3 py-3 text-center w-20"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase">Feedback</span></th>
              <th className="px-3 py-3 text-center w-20"><span className="text-[10px] font-semibold text-muted-foreground/50 uppercase">No-Show</span></th>
            </tr>
          </thead>
          <tbody>
            {active.map((m, i) => (
              <tr key={m.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3"><span className={`text-sm font-bold ${i < 3 ? "text-warning" : "text-muted-foreground/25"}`}>{i + 1}</span></td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-[10px] font-bold text-brand-purple">{m.initials}</div>
                    <div><span className="text-sm font-semibold text-foreground">{m.name}</span><span className="text-[10px] text-muted-foreground block">{m.role}</span></div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center"><span className={`text-sm font-bold ${scoreColor(m.avgFeedbackScore)}`}>{m.avgFeedbackScore}</span></td>
                <td className="px-3 py-3 text-center"><span className="text-xs font-medium text-foreground">{m.totalInterviews}</span></td>
                <td className="px-3 py-3 text-center"><span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${m.biasScore <= 5 ? "bg-success/10 text-success" : m.biasScore <= 10 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{biasLabel(m.biasScore)}</span></td>
                <td className="px-3 py-3 text-center"><span className="text-xs font-medium text-foreground">{m.candidateSatisfaction}%</span></td>
                <td className="px-3 py-3 text-center"><span className="text-xs text-muted-foreground">{m.avgFeedbackTime}</span></td>
                <td className="px-3 py-3 text-center"><span className={`text-xs font-medium ${m.noShowRate > 3 ? "text-destructive" : "text-success"}`}>{m.noShowRate}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Settings Tab
   ══════════════════════════════════════════════ */

function SettingsTab() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Panel Defaults</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Default Max / Week", value: 4 },
            { label: "Default Max / Day", value: 2 },
            { label: "Min Gap (minutes)", value: 30 },
            { label: "Default Duration (minutes)", value: 60 },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">{f.label}</label>
              <input type="number" defaultValue={f.value} className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground outline-none focus:border-brand" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Calendar Integration</h3>
        <p className="text-xs text-muted-foreground">Panel members connect their calendars to auto-sync blocked time. Only free slots appear in the Interview Arena.</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Google Calendar", emoji: "🔵", count: 4 },
            { name: "Outlook", emoji: "🟠", count: 2 },
            { name: "Apple Calendar", emoji: "⚪", count: 0 },
          ].map((c) => (
            <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl border border-border">
              <span className="text-lg">{c.emoji}</span>
              <div><span className="text-xs font-semibold text-foreground">{c.name}</span><span className="text-[10px] text-muted-foreground block">{c.count} connected</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Quality Controls</h3>
        {[
          { label: "Flag interviewers with bias score > 15", checked: true },
          { label: "Require feedback within 24 hours", checked: true },
          { label: "Auto-pause members with no-show rate > 5%", checked: true },
          { label: "Require annual calibration training", checked: false },
          { label: "Enforce minimum 2 interview types per member", checked: false },
        ].map((c) => (
          <label key={c.label} className="flex items-center gap-3 text-sm text-foreground cursor-pointer">
            <input type="checkbox" defaultChecked={c.checked} className="accent-brand" />
            {c.label}
          </label>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Main Page
   ══════════════════════════════════════════════ */

export default function PanelsPage() {
  const [activeTab, setActiveTab] = useState<PanelTab>("members");
  const [members, setMembers] = useState(PANEL_MEMBERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleStatus = useCallback((id: string) => {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, status: m.status === "active" ? "paused" as PanelStatus : "active" as PanelStatus } : m));
  }, []);

  const activeCount = members.filter((m) => m.status === "active").length;
  const totalSlots = members.reduce((s, m) => s + m.weeklySlots.reduce((ds, d) => ds + d.times.length, 0), 0);
  const syncedCount = members.filter((m) => m.calendarConnected).length;

  const TAB_ICONS: Record<PanelTab, typeof Users> = { members: Users, availability: Calendar, performance: BarChart3, settings: Settings2 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-linear-to-br from-brand-purple to-brand flex items-center justify-center">
            <Users className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Interview Panels</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="text-foreground font-medium">{activeCount}</span> active
              <span className="text-muted-foreground/20">·</span>
              {totalSlots} weekly slots
              <span className="text-muted-foreground/20">·</span>
              {syncedCount} calendars synced
            </div>
          </div>
        </div>
        <Button className="bg-brand hover:bg-brand/90 text-white text-xs font-semibold rounded-xl gap-2 cursor-pointer h-9 px-4">
          <Plus className="size-3.5" />
          Add Member
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5">
        {PANEL_TABS.map((tab) => {
          const Icon = TAB_ICONS[tab.key];
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${activeTab === tab.key ? "bg-card text-foreground border border-border shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`}>
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} {...tabTransition}>
          {activeTab === "members" && <MembersTab members={members} expandedId={expandedId} onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)} onToggleStatus={handleToggleStatus} />}
          {activeTab === "availability" && <AvailabilityTab members={members} />}
          {activeTab === "performance" && <PerformanceTab members={members} />}
          {activeTab === "settings" && <SettingsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
