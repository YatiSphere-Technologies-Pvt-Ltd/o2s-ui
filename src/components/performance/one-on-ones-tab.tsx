"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  Repeat,
  FileText,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UPCOMING_ONE_ON_ONES } from "@/components/performance/data";

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

type OneOnOneView = "upcoming" | "past" | "templates";

const SUB_VIEWS: { key: OneOnOneView; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "templates", label: "Templates" },
];

export function OneOnOnesTab() {
  const [subView, setSubView] = useState<OneOnOneView>("upcoming");

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-5"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Prepare for 1:1 meetings with AI-suggested talking points and action
          item tracking.
        </p>
        <Button variant="outline" size="sm">
          <Plus className="size-3.5" />
          Schedule 1:1
        </Button>
      </motion.div>

      {/* Sub-view pills */}
      <motion.div variants={fadeUp} className="flex items-center gap-1.5">
        {SUB_VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setSubView(v.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              subView === v.key
                ? "bg-brand text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {v.label}
          </button>
        ))}
      </motion.div>

      {/* Upcoming 1:1s */}
      {subView === "upcoming" && (
        <motion.div variants={stagger} className="space-y-3">
          {UPCOMING_ONE_ON_ONES.map((meeting) => (
            <motion.div
              key={meeting.id}
              variants={fadeUp}
              className="bg-card border border-border rounded-xl p-5 space-y-4"
            >
              {/* Person + Date */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {meeting.person}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {meeting.role}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">
                    {meeting.date}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {meeting.time}
                  </span>
                </div>
              </div>

              {/* Recurring + Duration */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Repeat className="size-3" />
                  {meeting.recurring}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {meeting.duration}
                </span>
              </div>

              {/* AI Suggested Talking Points */}
              {meeting.talkingPoints.length > 0 && (
                <div className="bg-brand-purple/5 rounded-lg p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="size-3.5 text-brand-purple" />
                    <span className="text-[10px] font-medium text-brand-purple uppercase tracking-wider">
                      AI Suggested Talking Points
                    </span>
                  </div>
                  {meeting.talkingPoints.map((point, i) => (
                    <p
                      key={i}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      {point}
                    </p>
                  ))}
                </div>
              )}

              {/* Previous Action Items */}
              {meeting.actionItems.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Previous Action Items
                  </span>
                  {meeting.actionItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      {item.done ? (
                        <CheckCircle2 className="size-3.5 text-success mt-0.5 shrink-0" />
                      ) : (
                        <Circle className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <span
                        className={
                          item.done
                            ? "text-muted-foreground line-through"
                            : item.overdue
                              ? "text-destructive"
                              : "text-foreground"
                        }
                      >
                        {item.text}
                      </span>
                      {item.overdue && (
                        <AlertTriangle className="size-3 text-destructive ml-auto shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="sm">
                  <FileText className="size-3.5" />
                  Prepare Agenda
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="size-3.5" />
                  Open Notes
                </Button>
                <Button variant="outline" size="sm">
                  <CalendarClock className="size-3.5" />
                  Reschedule
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Past / Templates placeholder */}
      {subView === "past" && (
        <motion.div variants={fadeUp} className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Past 1:1 meeting notes and summaries will appear here.
          </p>
        </motion.div>
      )}
      {subView === "templates" && (
        <motion.div variants={fadeUp} className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground">
            1:1 meeting templates and agenda templates will appear here.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
