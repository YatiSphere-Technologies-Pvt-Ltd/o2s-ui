"use client";

import { AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RiskIndicatorProps {
  risks: string[];
  maxVisible?: number;
}

export function RiskIndicator({ risks, maxVisible = 3 }: RiskIndicatorProps) {
  const count = risks.length;

  if (count === 0) {
    return (
      <div className="flex items-center gap-1.5 text-success">
        <div className="size-1.5 rounded-full bg-success" />
        <span className="text-[10px] font-medium">No risks</span>
      </div>
    );
  }

  const dotColor =
    count >= 3 ? "bg-destructive" : count >= 1 ? "bg-warning" : "bg-success";
  const textColor =
    count >= 3
      ? "text-destructive"
      : count >= 1
      ? "text-warning"
      : "text-success";

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={`flex items-center gap-1.5 cursor-default ${textColor}`}>
          <AlertTriangle className="size-3" />
          <span className="text-[10px] font-medium">
            {count} risk{count !== 1 ? "s" : ""}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="max-w-64 bg-card border border-border text-foreground"
      >
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Risk Signals
          </p>
          {risks.slice(0, maxVisible).map((risk, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className={`size-1.5 rounded-full ${dotColor} mt-1.5 shrink-0`} />
              <span className="text-xs leading-snug">{risk}</span>
            </div>
          ))}
          {risks.length > maxVisible && (
            <p className="text-[10px] text-muted-foreground">
              +{risks.length - maxVisible} more
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
