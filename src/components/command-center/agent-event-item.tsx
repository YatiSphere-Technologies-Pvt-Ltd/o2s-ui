"use client";

import { motion } from "framer-motion";
import {
  type AgentEvent,
  agentColorGradient,
  eventStatusColor,
  eventStatusBgColor,
  eventStatusLabel,
} from "./data";

interface AgentEventItemProps {
  event: AgentEvent;
  index: number;
}

export function AgentEventItem({ event, index }: AgentEventItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
      className="group relative flex gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors duration-150"
    >
      {/* Agent avatar */}
      <div
        className={`size-7 shrink-0 rounded-full bg-gradient-to-br ${agentColorGradient(event.agentColor)} flex items-center justify-center`}
      >
        <span className="text-[9px] font-bold text-white">
          {event.agent
            .split(" ")
            .map((w) => w[0])
            .join("")}
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Agent name + status */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold text-foreground">
            {event.agent}
          </span>
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${eventStatusColor(event.status)} ${eventStatusBgColor(event.status)}`}
          >
            {eventStatusLabel(event.status)}
          </span>
        </div>

        {/* Action text */}
        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
          {event.action}
        </p>

        {/* In-progress shimmer bar */}
        {event.status === "in_progress" && (
          <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full w-1/3 rounded-full bg-brand/40"
              animate={{ x: ["-100%", "400%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground/50 mt-1.5 block">
          {event.timestamp}
        </span>
      </div>
    </motion.div>
  );
}
