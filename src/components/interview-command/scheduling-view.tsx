"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Sparkles, AlertTriangle, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type ScheduleSlot,
  type InterviewRound,
  SCHEDULE_SLOTS,
  getInterviewerById,
  roundTypeLabel,
  scoreColor,
} from "./data";

interface SchedulingViewProps {
  round: InterviewRound;
  onSchedule: (slotId: string) => void;
}

export function SchedulingView({ round, onSchedule }: SchedulingViewProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [scheduled, setScheduled] = useState(false);

  const slots = SCHEDULE_SLOTS;
  const groupedByDate: Record<string, ScheduleSlot[]> = {};
  for (const s of slots) {
    if (!groupedByDate[s.date]) groupedByDate[s.date] = [];
    groupedByDate[s.date].push(s);
  }

  const handleSchedule = () => {
    if (!selectedSlot) return;
    onSchedule(selectedSlot);
    setScheduled(true);
  };

  if (round.status === "completed") {
    return (
      <div className="rounded-xl border border-border bg-card/50 p-5 text-center">
        <div className="size-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
          <Check className="size-6 text-success" />
        </div>
        <p className="text-sm font-semibold text-foreground">Interview Completed</p>
        <p className="text-[11px] text-muted-foreground mt-1">{round.scheduledAt}</p>
      </div>
    );
  }

  if (round.scheduledAt && !scheduled) {
    return (
      <div className="rounded-xl border border-brand/20 bg-brand/[0.02] p-5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Calendar className="size-5 text-brand" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Scheduled</p>
            <p className="text-[11px] text-muted-foreground">{round.scheduledAt} · {round.duration} min</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Calendar className="size-4 text-brand" />
          Schedule — {roundTypeLabel(round.type)}
        </h3>
        <span className="text-[10px] text-muted-foreground">{round.duration} min</span>
      </div>

      {/* AI suggestion banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand/[0.04] border border-brand/10">
        <Sparkles className="size-3.5 text-brand shrink-0" />
        <span className="text-[11px] text-brand font-medium">
          AI analyzed calendar availability and SLA requirements to rank these slots
        </span>
      </div>

      {scheduled ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-5 rounded-xl bg-success/[0.04] border border-success/20 text-center"
        >
          <Check className="size-8 text-success mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">Interview Scheduled</p>
          <p className="text-[11px] text-muted-foreground mt-1">Confirmation sent to all participants</p>
        </motion.div>
      ) : (
        <>
          {/* Slots grouped by date */}
          {Object.entries(groupedByDate).map(([date, dateSlots]) => (
            <div key={date} className="space-y-2">
              <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
                {date}
              </span>
              {dateSlots.map((slot, i) => {
                const isSelected = selectedSlot === slot.id;
                const hasConflict = !!slot.conflictReason;
                return (
                  <motion.button
                    key={slot.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => !hasConflict && setSelectedSlot(slot.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-150 text-left ${
                      hasConflict
                        ? "border-border/30 opacity-50 cursor-not-allowed"
                        : isSelected
                          ? "border-brand ring-1 ring-brand bg-brand/[0.04] cursor-pointer"
                          : "border-border hover:bg-secondary/20 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="size-4 text-muted-foreground/40" />
                      <div>
                        <span className="text-sm font-medium text-foreground">{slot.time}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {slot.interviewerIds.map((id) => {
                            const prof = getInterviewerById(id);
                            return prof ? (
                              <span key={id} className="text-[9px] text-muted-foreground">
                                {prof.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {slot.isAISuggested && (
                        <span className="text-[8px] font-bold text-brand-purple bg-brand-purple/8 px-1.5 py-0.5 rounded">
                          AI
                        </span>
                      )}
                      {hasConflict && (
                        <span className="text-[9px] text-destructive flex items-center gap-1">
                          <AlertTriangle className="size-3" />
                          {slot.conflictReason}
                        </span>
                      )}
                      <span className={`text-xs font-bold ${scoreColor(slot.score)}`}>
                        {slot.score}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ))}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSchedule}
              disabled={!selectedSlot}
              className="bg-brand hover:bg-brand/90 text-white font-semibold rounded-lg cursor-pointer disabled:opacity-40"
            >
              <Calendar className="size-4 mr-2" />
              Confirm Schedule
            </Button>
            <Button variant="outline" className="cursor-pointer">
              <Sparkles className="size-4 mr-2" />
              Suggest Alternatives
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
