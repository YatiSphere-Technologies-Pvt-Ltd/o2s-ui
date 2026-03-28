"use client";

import { Button } from "@/components/ui/button";
import {
  SAFETY_METRICS,
  SAFETY_EVENTS,
  safetyEventDot,
} from "@/components/settings/ai-data";

export function SafetyDashboard() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        AI Safety &amp; Compliance
      </h2>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {SAFETY_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider">
              {metric.label}
            </p>
            <p className={`text-xl font-bold mt-1 ${metric.colorClass}`}>
              {metric.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {metric.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Safety Events */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Recent Safety Events
        </h3>
        <div className="space-y-3">
          {SAFETY_EVENTS.map((event, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center mt-1.5">
                <span
                  className={`size-2 rounded-full ${safetyEventDot(event.type)} shrink-0`}
                />
                {i < SAFETY_EVENTS.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1" />
                )}
              </div>
              <div className="pb-3">
                <span className="text-[10px] text-muted-foreground font-medium">
                  {event.date}
                </span>
                <p className="text-sm text-foreground mt-0.5">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="flex items-center gap-3 mt-4">
        <Button variant="ghost" className="text-sm">
          View Full Safety Report
        </Button>
        <Button variant="ghost" className="text-sm">
          EU AI Act Compliance
        </Button>
      </div>
    </div>
  );
}
