"use client";

import { motion } from "framer-motion";

interface ScheduleEvent {
  time: string;
  title: string;
  subtitle: string;
  hasJoin?: boolean;
  isNow?: boolean;
  isAIScheduled?: boolean;
}

interface DayGroup {
  date: string;
  dateLabel: string;
  events: ScheduleEvent[];
}

const mockSchedule: DayGroup[] = [
  {
    date: "TODAY",
    dateLabel: "Wed, Mar 25",
    events: [
      { time: "10:00 AM", title: "Interview: Lisa Park", subtitle: "Senior Frontend · Panel: You, Sarah, Alex", hasJoin: true, isNow: false },
      { time: "11:30 AM", title: "Hiring Sync", subtitle: "Engineering team · Weekly pipeline review", hasJoin: true, isNow: true },
      { time: "2:00 PM", title: "Debrief: John Doe", subtitle: "Product Designer · Final round decision", hasJoin: true, isNow: false },
    ],
  },
  {
    date: "TOMORROW",
    dateLabel: "Thu, Mar 26",
    events: [
      { time: "9:00 AM", title: "Interview: Candidate TBD", subtitle: "VP Engineering · AI scheduling in progress...", hasJoin: false, isAIScheduled: true },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function UpcomingSchedule() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Upcoming</h3>
        <span className="text-xs text-brand">Today</span>
      </div>

      {/* Day Groups */}
      <motion.div
        className="flex flex-col gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {mockSchedule.map((dayGroup) => (
          <div key={dayGroup.date}>
            {/* Day header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {dayGroup.date}
              </span>
              <span className="text-xs text-muted-foreground/60">
                {dayGroup.dateLabel}
              </span>
            </div>

            {/* Events */}
            <div className="flex flex-col">
              {dayGroup.events.map((event, eventIndex) => (
                <motion.div
                  key={eventIndex}
                  variants={itemVariants}
                  className="flex items-stretch"
                >
                  {/* Time column */}
                  <div className="w-17.5 shrink-0 flex items-start justify-end pt-1 pr-3">
                    <span className="text-xs text-muted-foreground font-mono">
                      {event.time}
                    </span>
                  </div>

                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center shrink-0">
                    {/* Dot */}
                    <div className="relative mt-1.5">
                      {event.isNow ? (
                        <>
                          <div className="w-3 h-3 rounded-full bg-brand" />
                          <div className="absolute inset-0 w-3 h-3 rounded-full bg-brand animate-ping opacity-50" />
                        </>
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-border" />
                      )}
                    </div>
                    {/* Vertical line */}
                    {eventIndex < dayGroup.events.length - 1 && (
                      <div className="w-0.5 bg-border flex-1 min-h-4" />
                    )}
                  </div>

                  {/* Event content */}
                  <div
                    className={`flex-1 ml-3 pb-4 ${
                      event.isNow ? "border-l-2 border-brand pl-3" : ""
                    } ${
                      event.isAIScheduled
                        ? "border border-dashed border-brand-purple/30 bg-brand-purple/5 rounded-lg p-3"
                        : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.subtitle}
                    </p>
                    {event.hasJoin && (
                      <button className="text-xs text-brand hover:underline mt-1.5 transition-colors">
                        Join Meeting
                      </button>
                    )}
                    {event.isAIScheduled && (
                      <span className="inline-block text-brand-purple text-[10px] mt-1.5">
                        AI scheduling...
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
