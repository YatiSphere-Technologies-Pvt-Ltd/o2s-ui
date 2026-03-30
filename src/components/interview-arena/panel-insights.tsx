"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  AlertTriangle,
  Check,
  Replace,
  Calendar,
  RefreshCw,
  Star,
  Ban,
  Clock,
  ChevronDown,
  Link2,
  PenLine,
  Settings2,
} from "lucide-react";
import {
  type ArenaInterviewer,
  type InterviewSlot,
  type ArenaCandidate,
  type AvailabilitySource,
  TIME_SLOTS,
  roundTypeLabel,
  roundTypeColor,
  loadColor,
  scoreColor,
} from "./data";

interface PanelInsightsProps {
  interviewer: ArenaInterviewer | null;
  slot: InterviewSlot | null;
  candidate: ArenaCandidate | null;
  allInterviewers: ArenaInterviewer[];
  onUpdateAvailability?: (
    interviewerId: string,
    availability: string[],
    preferredTimes: string[],
    blockedTimes: string[]
  ) => void;
}

const SOURCE_ICONS: Record<AvailabilitySource, typeof Calendar> = {
  calendar_sync: Calendar,
  manual: PenLine,
  link: Link2,
};

const SOURCE_LABELS: Record<AvailabilitySource, string> = {
  calendar_sync: "Calendar",
  manual: "Manual",
  link: "Link",
};

const SOURCE_COLORS: Record<AvailabilitySource, string> = {
  calendar_sync: "text-success",
  manual: "text-brand",
  link: "text-brand-purple",
};

export function PanelInsights({
  interviewer,
  slot,
  candidate,
  allInterviewers,
  onUpdateAvailability,
}: PanelInsightsProps) {
  const [showAvailability, setShowAvailability] = useState(false);

  if (!interviewer) {
    return (
      <div className="flex flex-col h-full rounded-xl border border-border bg-card/50 overflow-hidden">
        <div className="shrink-0 px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Panel Insights</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2">
          <Bot className="size-7 text-muted-foreground/20" />
          <p className="text-xs text-muted-foreground/40 text-center">
            Click an interviewer row or a booked slot to see panel intelligence
          </p>
        </div>
      </div>
    );
  }

  const pref = interviewer.availabilityPreference;
  const SourceIcon = SOURCE_ICONS[pref.source];
  const sourceLabel = SOURCE_LABELS[pref.source];
  const sourceColor = SOURCE_COLORS[pref.source];

  const skillGaps = candidate?.preferredInterviewerSkills.filter(
    (s) => !interviewer.skills.some((is) => is.toLowerCase().includes(s.toLowerCase()))
  ) ?? [];

  const replacements = skillGaps.length > 0
    ? allInterviewers
        .filter((i) => i.id !== interviewer.id && i.load < i.maxLoad)
        .filter((i) => skillGaps.some((g) => i.skills.some((is) => is.toLowerCase().includes(g.toLowerCase()))))
        .slice(0, 2)
    : [];

  const availableCount = interviewer.availability.length;
  const preferredCount = pref.preferredTimes.length;

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-card/50 overflow-hidden">
      <div className="shrink-0 px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Bot className="size-4 text-brand-purple" />
          Panel Insights
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
        {/* ── Profile Card ── */}
        <div className="rounded-xl border border-border bg-card p-3.5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-brand-purple/10 flex items-center justify-center text-xs font-bold text-brand-purple">
              {interviewer.initials}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-foreground">{interviewer.name}</span>
              <span className="text-[11px] text-muted-foreground block">{interviewer.role}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {interviewer.skills.map((s) => {
              const isMatch = candidate?.preferredInterviewerSkills.some(
                (ps) => s.toLowerCase().includes(ps.toLowerCase())
              );
              return (
                <span
                  key={s}
                  className={`px-1.5 py-0.5 rounded-md text-[9px] font-medium ${
                    isMatch ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {isMatch && <Check className="size-2 inline mr-0.5" />}
                  {s}
                </span>
              );
            })}
          </div>

          {/* Load bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-muted-foreground">Interview Load</span>
              <span className={`font-bold ${loadColor(interviewer.load, interviewer.maxLoad)}`}>
                {interviewer.load}/{interviewer.maxLoad} this week
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  interviewer.load >= interviewer.maxLoad ? "bg-destructive" :
                  interviewer.load >= interviewer.maxLoad * 0.75 ? "bg-warning" : "bg-success"
                }`}
                style={{ width: `${Math.min((interviewer.load / interviewer.maxLoad) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Availability (inline, subtle) ── */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setShowAvailability(!showAvailability)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-secondary/20 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 text-muted-foreground/50" />
              <span className="text-xs font-medium text-foreground">Availability</span>
              <span className="text-[10px] text-muted-foreground/50">
                {availableCount} slots · {preferredCount} preferred
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${sourceColor}`}>
                <SourceIcon className="size-3" />
                <span className="text-[9px] font-semibold">{sourceLabel}</span>
              </div>
              <ChevronDown className={`size-3.5 text-muted-foreground/30 transition-transform ${showAvailability ? "rotate-180" : ""}`} />
            </div>
          </button>

          <AnimatePresence>
            {showAvailability && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-3.5 pb-3 space-y-2.5 border-t border-border/50 pt-2.5">
                  {/* Sync info */}
                  {pref.calendarConnected && pref.lastSynced && (
                    <div className="flex items-center gap-1.5 text-[10px] text-success">
                      <RefreshCw className="size-2.5" />
                      <span>Synced {pref.lastSynced}</span>
                    </div>
                  )}
                  {!pref.calendarConnected && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
                      <Calendar className="size-2.5" />
                      <span>Calendar not connected</span>
                    </div>
                  )}

                  {/* Mini slot grid */}
                  <div className="grid grid-cols-6 gap-1">
                    {TIME_SLOTS.map((time) => {
                      const isAvailable = interviewer.availability.includes(time);
                      const isPreferred = pref.preferredTimes.includes(time);
                      const isBlocked = pref.blockedTimes.includes(time);

                      return (
                        <button
                          key={time}
                          onClick={() => {
                            if (!onUpdateAvailability) return;
                            // Cycle: blocked → available → preferred → blocked
                            let newAvail = [...interviewer.availability];
                            let newPref = [...pref.preferredTimes];
                            let newBlocked = [...pref.blockedTimes];

                            if (isBlocked || (!isAvailable && !isPreferred)) {
                              // → available
                              newAvail = [...new Set([...newAvail, time])];
                              newBlocked = newBlocked.filter((t) => t !== time);
                            } else if (isAvailable && !isPreferred) {
                              // → preferred
                              newPref = [...new Set([...newPref, time])];
                            } else if (isPreferred) {
                              // → blocked
                              newAvail = newAvail.filter((t) => t !== time);
                              newPref = newPref.filter((t) => t !== time);
                              newBlocked = [...new Set([...newBlocked, time])];
                            }

                            onUpdateAvailability(interviewer.id, newAvail, newPref, newBlocked);
                          }}
                          className={`h-7 rounded-md text-[8px] font-medium tabular-nums transition-all cursor-pointer ${
                            isPreferred
                              ? "bg-success/15 text-success border border-success/25"
                              : isAvailable
                                ? "bg-brand/8 text-foreground/70 border border-brand/15"
                                : "bg-secondary/20 text-muted-foreground/25 border border-transparent"
                          }`}
                          title={isPreferred ? `${time} — Preferred` : isAvailable ? `${time} — Available` : `${time} — Blocked`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>

                  {/* Micro legend */}
                  <div className="flex items-center gap-3 text-[8px] text-muted-foreground/40">
                    <span className="flex items-center gap-1"><Star className="size-2 text-success" /> Preferred</span>
                    <span className="flex items-center gap-1"><Check className="size-2 text-brand" /> Available</span>
                    <span className="flex items-center gap-1"><Ban className="size-2" /> Blocked</span>
                    <span className="ml-auto">Click to cycle</span>
                  </div>

                  {/* Preferences summary */}
                  <div className="flex items-center gap-3 text-[9px] text-muted-foreground/40 pt-1 border-t border-border/30">
                    <span>Max {pref.maxInterviewsPerDay}/day</span>
                    <span>·</span>
                    <span>Max {pref.maxInterviewsPerWeek}/week</span>
                    <span>·</span>
                    <span>{pref.minGapMinutes}min gap</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Booked Slot Info ── */}
        {slot && slot.status === "booked" && (
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
            <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
              Current Booking
            </span>
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-lg bg-brand-purple/10 flex items-center justify-center text-[9px] font-bold text-brand-purple">
                {slot.candidateInitials}
              </div>
              <div>
                <span className="text-xs font-medium text-foreground block">{slot.candidateName}</span>
                <span className={`text-[10px] ${roundTypeColor(slot.roundType!)}`}>
                  {roundTypeLabel(slot.roundType!)} · {slot.time}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── AI Recommendations ── */}
        {candidate && (
          <div className="rounded-xl border border-brand-purple/15 bg-brand-purple/[0.02] p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-brand-purple" />
              <span className="text-xs font-semibold text-brand-purple">AI Recommendations</span>
            </div>

            {skillGaps.length > 0 && (
              <div className="flex items-start gap-2 text-[11px]">
                <AlertTriangle className="size-3 text-warning shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Missing: <span className="text-warning font-medium">{skillGaps.join(", ")}</span>
                </span>
              </div>
            )}

            {replacements.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">
                  Swap Suggestions
                </span>
                {replacements.map((r) => (
                  <button
                    key={r.id}
                    className="w-full flex items-center gap-2 p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 cursor-pointer transition-colors text-left"
                  >
                    <Replace className="size-3 text-brand-teal shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-medium text-foreground">{r.name}</span>
                      <span className="text-[9px] text-muted-foreground block">
                        {r.skills.filter((s) => skillGaps.some((g) => s.toLowerCase().includes(g.toLowerCase()))).join(", ")}
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold ${loadColor(r.load, r.maxLoad)}`}>
                      {r.load}/{r.maxLoad}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {skillGaps.length === 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-success">
                <Check className="size-3" />
                <span>Good skill coverage for this candidate</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
