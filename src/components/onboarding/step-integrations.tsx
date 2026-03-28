"use client";

import { useState, useEffect } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RECOMMENDED_INTEGRATIONS, MORE_INTEGRATIONS } from "@/components/onboarding/data";

interface StepIntegrationsProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: (complete: boolean) => void;
}

export function StepIntegrations({ onComplete }: StepIntegrationsProps) {
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [moreChecked, setMoreChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    onComplete(true);
  }, [onComplete]);

  const toggleConnect = (id: string) => {
    setConnected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleMore = (item: string) => {
    setMoreChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Connect Your Tools</h2>
        <p className="text-sm text-muted-foreground">Integrate with the tools you already use.</p>
      </div>

      {/* Connected count */}
      {connected.size > 0 && (
        <div className="flex items-center gap-2 text-sm text-success">
          <Check className="size-4" />
          {connected.size} integration{connected.size !== 1 ? "s" : ""} connected
        </div>
      )}

      {/* Recommended */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Recommended</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {RECOMMENDED_INTEGRATIONS.map((int) => (
            <div key={int.id} className="bg-card border border-border rounded-xl p-4 text-center">
              <div
                className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: int.logoColor }}
              >
                {int.logoInitial}
              </div>
              <p className="text-sm font-medium text-foreground mb-2">{int.name}</p>
              <Button
                size="sm"
                variant={connected.has(int.id) ? "ghost" : "outline"}
                onClick={() => toggleConnect(int.id)}
                className={connected.has(int.id) ? "text-success" : ""}
              >
                {connected.has(int.id) ? (
                  <>
                    <Check className="size-3.5 mr-1" /> Connected
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* AI uplift */}
        <div className="bg-brand-purple/5 border-l-[3px] border-brand-purple p-3 rounded-r-lg flex items-start gap-2">
          <Sparkles className="size-4 text-brand-purple shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Connected integrations unlock AI-powered insights like automatic calendar analysis, Slack sentiment tracking, and code review correlation.
          </p>
        </div>
      </div>

      {/* More integrations */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">More Integrations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {MORE_INTEGRATIONS.map((cat) => (
            <div key={cat.category}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {cat.category}
              </p>
              <div className="space-y-2">
                {cat.items.map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={moreChecked.has(item)}
                      onCheckedChange={() => toggleMore(item)}
                    />
                    <span className="text-sm text-foreground">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
