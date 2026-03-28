"use client";

import { ChevronDown, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TalentHeader() {
  return (
    <div className="w-full px-6 py-4 flex justify-between items-center">
      {/* Left */}
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Talent Acquisition
        </h1>
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">24</span> open roles
          {" \u00B7 "}
          <span className="text-foreground font-semibold">312</span> active
          candidates
          {" \u00B7 "}
          <span className="text-foreground font-semibold">18</span> interviews
          this week
        </p>
      </div>

      {/* Right */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          className="border-border bg-surface-overlay text-foreground"
          aria-label="Filter by job"
        >
          All Jobs
          <ChevronDown className="size-3.5" />
        </Button>
        <Button
          size="sm"
          className="bg-brand text-white hover:bg-brand/90"
          aria-label="Post a new role"
        >
          <Plus className="size-3.5" />
          Post New Role
        </Button>
        <Button
          size="sm"
          className="bg-brand-purple/10 border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/20"
          aria-label="Open agent actions"
        >
          <Sparkles className="size-3.5" />
          Agent Actions
        </Button>
      </div>
    </div>
  );
}
