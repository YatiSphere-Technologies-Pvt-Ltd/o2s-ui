"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Sparkles,
  MessageCircle,
  Heart,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FEEDBACK_ITEMS,
  FEEDBACK_TYPE_CONFIG,
} from "@/components/performance/data";

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

type FeedbackView = "my" | "team" | "recognition";

const SUB_VIEWS: { key: FeedbackView; label: string }[] = [
  { key: "my", label: "My Feedback" },
  { key: "team", label: "Team Feedback" },
  { key: "recognition", label: "Recognition Wall" },
];

function VisibilityBadge({ visibility }: { visibility: string }) {
  if (visibility === "public") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] text-success">
        <Eye className="size-2.5" />
        Public
      </span>
    );
  }
  if (visibility === "team") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
        <Users className="size-2.5" />
        Team
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
      <EyeOff className="size-2.5" />
      Private
    </span>
  );
}

export function FeedbackTab() {
  const [subView, setSubView] = useState<FeedbackView>("my");

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
          Give and receive continuous feedback, recognition, and coaching notes.
        </p>
        <Button variant="outline" size="sm">
          <Plus className="size-3.5" />
          Give Feedback
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

      {/* Feedback feed */}
      <motion.div variants={stagger} className="space-y-3">
        {FEEDBACK_ITEMS.map((item) => {
          const config = FEEDBACK_TYPE_CONFIG[item.type];
          return (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="bg-card border border-border rounded-xl p-5 space-y-3"
            >
              {/* Type + date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.bgClass} ${config.colorClass}`}
                  >
                    {config.icon} {config.label}
                  </span>
                  <VisibilityBadge visibility={item.visibility} />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {item.date}
                </span>
              </div>

              {/* Sender / Recipient */}
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {item.sender}
                </span>
                {" → "}
                <span className="font-medium text-foreground">
                  {item.recipient}
                </span>
              </div>

              {/* Content */}
              <p className="text-sm text-foreground leading-relaxed">
                {item.content}
              </p>

              {/* Skills + Value */}
              <div className="flex flex-wrap items-center gap-1.5">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-secondary text-muted-foreground text-[10px] px-1.5 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {item.value && (
                  <span className="bg-brand/10 text-brand text-[10px] px-1.5 py-0.5 rounded font-medium">
                    {item.value}
                  </span>
                )}
              </div>

              {/* Reactions + Comments + AI mapping */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {item.reactions > 0 && (
                    <span className="flex items-center gap-1">
                      <Heart className="size-3" />
                      {item.reactions}
                    </span>
                  )}
                  {item.comments > 0 && (
                    <span className="flex items-center gap-1">
                      <MessageCircle className="size-3" />
                      {item.comments}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-xs text-brand-purple">
                  <Sparkles className="size-3" />
                  {item.aiMapping}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
