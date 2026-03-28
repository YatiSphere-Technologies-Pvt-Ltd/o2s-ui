"use client";

import { motion } from "framer-motion";
import { Zap, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AI_SOURCED,
  matchColor,
  matchBgColor,
} from "@/components/talent-pool/data";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function AISourcingTab() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">AI Sourcing</h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span>Last run: 2 hours ago</span>
            <span className="text-muted-foreground/40">|</span>
            <div className="flex items-center gap-1.5">
              <span>Connected:</span>
              <span className="inline-flex items-center rounded-md bg-brand/10 px-1.5 py-0.5 text-[10px] font-medium text-brand">
                LinkedIn
              </span>
              <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                GitHub
              </span>
            </div>
          </div>
        </div>
        <Button className="gap-1.5 bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90">
          <Zap className="size-4" />
          Run Sourcing Now
        </Button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {AI_SOURCED.map((candidate, i) => (
          <motion.div
            key={candidate.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3"
          >
            {/* Top: avatar + info + match score */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-purple/15 text-sm font-semibold text-brand-purple">
                  {candidate.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{candidate.name}</div>
                  <div className="text-xs text-muted-foreground">{candidate.role}</div>
                  <div className="text-xs text-muted-foreground">{candidate.company}</div>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-lg px-2.5 py-1 text-lg font-bold ${matchColor(candidate.matchScore)} ${matchBgColor(candidate.matchScore)}`}
              >
                {candidate.matchScore}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {candidate.location}
            </div>

            {/* Top Match */}
            <div className="text-xs text-brand">
              Top match: {candidate.topMatch} ({candidate.topMatchPct}%)
            </div>

            {/* Match Reason */}
            <p className="text-xs italic text-muted-foreground line-clamp-2">
              {candidate.matchReason}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Source + Discovered */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ExternalLink className="size-3" />
                {candidate.source}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {candidate.discovered}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1">
                View Profile
              </Button>
              <Button size="sm" className="flex-1 bg-brand text-brand-foreground hover:bg-brand/90">
                Add to Pool
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Dismiss
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
