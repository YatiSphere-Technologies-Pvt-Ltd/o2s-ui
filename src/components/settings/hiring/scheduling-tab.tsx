"use client";

import { motion } from "framer-motion";
import { Video, Calendar, CheckCircle2 } from "lucide-react";
import { INTERVIEW_TYPES } from "@/components/settings/hiring/data";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ACTIVE_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const LOAD_BALANCING_OPTIONS = [
  { key: "round-robin", label: "Round Robin", selected: true },
  { key: "least-loaded", label: "Least Loaded", selected: false },
  { key: "skill-match", label: "Skill Match", selected: false },
  { key: "random", label: "Random", selected: false },
];

const PREFERENCES = [
  { label: "Respect interviewer time-zone preferences", checked: true },
  { label: "Avoid back-to-back interviews for interviewers", checked: true },
  { label: "Prioritize candidate-preferred time slots", checked: false },
];

export function SchedulingTab() {
  return (
    <div className="space-y-8">
      {/* ── Working Hours ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Working Hours</h3>
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Start Time</label>
              <p className="text-sm text-foreground mt-0.5">9:00 AM</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">End Time</label>
              <p className="text-sm text-foreground mt-0.5">6:00 PM</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Timezone</label>
              <p className="text-sm text-foreground mt-0.5">America/New_York (EST)</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Working Days
            </label>
            <div className="flex items-center gap-2">
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  className={`inline-flex items-center justify-center size-8 rounded-lg text-xs font-medium ${
                    ACTIVE_DAYS.includes(day)
                      ? "bg-brand text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {day.charAt(0)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Buffer & Duration ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Buffer &amp; Duration Defaults</h3>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Min Buffer</label>
              <p className="text-sm text-foreground mt-0.5">15 minutes</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Default Duration</label>
              <p className="text-sm text-foreground mt-0.5">45 minutes</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Max Interviews / Day
              </label>
              <p className="text-sm text-foreground mt-0.5">6 per interviewer</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Max / Candidate / Day
              </label>
              <p className="text-sm text-foreground mt-0.5">3 interviews</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Advance Notice</label>
              <p className="text-sm text-foreground mt-0.5">24 hours</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Scheduling Horizon
              </label>
              <p className="text-sm text-foreground mt-0.5">14 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interview Types ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Interview Types</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {INTERVIEW_TYPES.map((it, i) => (
            <motion.div
              key={it.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{it.name}</span>
                {it.videoTool !== "\u2014" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-brand/10 text-brand rounded px-1.5 py-0.5">
                    <Video className="size-2.5" />
                    {it.videoTool}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>{it.duration}</span>
                <span>&middot;</span>
                <span>{it.format}</span>
                <span>&middot;</span>
                <span>{it.interviewers} interviewer{it.interviewers !== 1 ? "s" : ""}</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-2 bg-secondary rounded px-2 py-1">
                {it.calendarTitle}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Calendar Integration ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Calendar Integration</h3>
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          {[
            { name: "Google Calendar", icon: Calendar },
            { name: "Zoom", icon: Video },
          ].map((tool) => (
            <div key={tool.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-foreground">
                <tool.icon className="size-4 text-muted-foreground" />
                {tool.name}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-success font-medium">
                <CheckCircle2 className="size-3.5" />
                Connected
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Load Balancing ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Load Balancing</h3>
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="space-y-2">
            {LOAD_BALANCING_OPTIONS.map((opt) => (
              <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                <span
                  className={`size-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    opt.selected ? "border-brand" : "border-border"
                  }`}
                >
                  {opt.selected && <span className="size-2 rounded-full bg-brand" />}
                </span>
                <span className="text-sm text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>

          <div className="pt-3 border-t border-border space-y-2">
            {PREFERENCES.map((pref) => (
              <label key={pref.label} className="flex items-center gap-3 cursor-pointer">
                <span
                  className={`size-4 rounded border flex items-center justify-center shrink-0 ${
                    pref.checked
                      ? "bg-brand border-brand text-white"
                      : "border-border bg-background"
                  }`}
                >
                  {pref.checked && (
                    <svg className="size-2.5" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4l2.5 2.5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-sm text-foreground">{pref.label}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
