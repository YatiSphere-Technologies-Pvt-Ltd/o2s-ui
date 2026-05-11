"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { AgentActivity } from "@/components/leave/data";

const TONE_TO_COLOR: Record<AgentActivity["tone"], string> = {
  brand: "text-brand",
  "brand-purple": "text-brand-purple",
  "brand-teal": "text-brand-teal",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

export function AgentActivityStream({ items }: { items: AgentActivity[] }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Sparkles className="size-4 text-brand" />
        <h3 className="text-sm font-semibold text-foreground">Agent activity</h3>
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-success">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Live
        </span>
        <Link href="/leave/hr/agents" className="ml-2 text-[11px] text-brand hover:underline">
          Control →
        </Link>
      </div>

      <ol className="flex-1 overflow-y-auto max-h-[420px] scrollbar-thin">
        {items.map((it, i) => {
          const colorClass = TONE_TO_COLOR[it.tone];
          return (
            <li
              key={it.id}
              className={`flex gap-3 px-4 py-3 ${i < items.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex flex-col items-center shrink-0 pt-0.5">
                <span className={`size-2 rounded-full bg-current ${colorClass}`} />
                {i < items.length - 1 && (
                  <span className="w-px flex-1 bg-border mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-snug">
                  <span className={`font-medium ${colorClass}`}>{it.agent}</span>{" "}
                  <span className="text-muted-foreground">· {it.message}</span>
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{it.whenLabel}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
