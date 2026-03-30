"use client";

import { AgentEventItem } from "./agent-event-item";
import type { AgentEvent } from "./data";

interface AgentFeedProps {
  events: AgentEvent[];
  autoPilot: boolean;
  onToggleAutoPilot: () => void;
}

export function AgentFeed({ events, autoPilot, onToggleAutoPilot }: AgentFeedProps) {
  return (
    <div
      className={`flex flex-col h-full rounded-xl border bg-card/50 overflow-hidden transition-all duration-500 ${
        autoPilot
          ? "border-brand-teal/30 shadow-[0_0_20px_rgba(20,184,166,0.06)]"
          : "border-border"
      }`}
    >
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              Agent Activity
            </h2>
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
          </div>
        </div>

        {/* Auto-pilot toggle */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">
            Auto-pilot mode
          </span>
          <button
            onClick={onToggleAutoPilot}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer ${
              autoPilot ? "bg-brand-teal" : "bg-secondary"
            }`}
          >
            <span
              className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                autoPilot ? "translate-x-4.5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        {autoPilot && (
          <p className="text-[10px] text-brand-teal mt-1.5">
            AI is handling low-risk decisions automatically
          </p>
        )}
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {events.map((event, i) => (
          <AgentEventItem key={event.id} event={event} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="shrink-0 px-4 py-2.5 border-t border-border">
        <button className="text-[10px] text-brand hover:text-brand-teal transition-colors font-medium cursor-pointer">
          View all agent activity →
        </button>
      </div>
    </div>
  );
}
