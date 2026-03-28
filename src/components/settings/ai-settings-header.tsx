"use client";

import { Sparkles, OctagonX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AISettingsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="size-5 text-brand-purple" />
          AI &amp; Agent Configuration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure how O2S&apos;s AI agents operate across your organization.
        </p>
      </div>
      <Button
        variant="outline"
        className="text-destructive border-destructive/30 hover:bg-destructive hover:text-white shrink-0 gap-2"
      >
        <OctagonX className="size-4" />
        Kill All Agents
      </Button>
    </div>
  );
}
