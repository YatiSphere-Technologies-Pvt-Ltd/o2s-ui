"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Power,
  AlertOctagon,
  Zap,
  Info,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type AgentMode, modeLabel, modeDescription } from "./data";

interface GlobalControlsProps {
  masterEnabled: boolean;
  onToggleMaster: () => void;
  defaultMode: AgentMode;
  onSetDefaultMode: (mode: AgentMode) => void;
}

const MODE_OPTIONS: AgentMode[] = ["auto", "assist", "manual"];

export function GlobalControls({
  masterEnabled,
  onToggleMaster,
  defaultMode,
  onSetDefaultMode,
}: GlobalControlsProps) {
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Master Toggle */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${
                masterEnabled ? "bg-success/10" : "bg-destructive/10"
              }`}
            >
              <Power
                className={`size-5 ${
                  masterEnabled ? "text-success" : "text-destructive"
                }`}
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Master Automation
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                Controls whether any automated agent actions execute. When disabled, all agents are paused and only manual actions are allowed.
              </p>
            </div>
          </div>
          <button
            onClick={onToggleMaster}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${
              masterEnabled ? "bg-success" : "bg-secondary"
            }`}
          >
            <span
              className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                masterEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div
          className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
            masterEnabled
              ? "bg-success/5 text-success"
              : "bg-destructive/5 text-destructive"
          }`}
        >
          <div
            className={`size-2 rounded-full ${
              masterEnabled ? "bg-success animate-pulse" : "bg-destructive"
            }`}
          />
          {masterEnabled
            ? "Automation is active — agents are running"
            : "Automation is paused — all agents are idle"}
        </div>
      </div>

      {/* Emergency Stop */}
      <div className="rounded-xl border border-destructive/20 bg-destructive/[0.02] p-6">
        <div className="flex items-start gap-4">
          <div className="size-11 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertOctagon className="size-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground">
              Emergency Stop
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
              Immediately halt all running agent executions and prevent new triggers. Use this during incidents or when unexpected agent behavior is detected.
            </p>
            <div className="mt-4">
              {!showEmergencyConfirm ? (
                <Button
                  onClick={() => setShowEmergencyConfirm(true)}
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <AlertOctagon className="size-4 mr-2" />
                  Emergency Stop
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm text-destructive font-medium">
                    Are you sure? This will halt all running agents.
                  </span>
                  <Button
                    onClick={() => {
                      onToggleMaster();
                      setShowEmergencyConfirm(false);
                    }}
                    className="bg-destructive hover:bg-destructive/90 text-white cursor-pointer"
                    size="sm"
                  >
                    Confirm Stop
                  </Button>
                  <Button
                    onClick={() => setShowEmergencyConfirm(false)}
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Default Mode Override */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="size-11 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
            <Shield className="size-5 text-brand" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Default Execution Mode
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg">
              Override the default execution mode for all agents. Individual agent and rule-level modes will be overridden by this setting.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MODE_OPTIONS.map((mode) => {
            const isSelected = defaultMode === mode;
            return (
              <button
                key={mode}
                onClick={() => onSetDefaultMode(mode)}
                className={`relative flex flex-col items-start p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "border-brand bg-brand/[0.04] ring-1 ring-brand"
                    : "border-border hover:border-border hover:bg-secondary/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {mode === "auto" && <Zap className="size-4 text-success" />}
                  {mode === "assist" && <Bot className="size-4 text-warning" />}
                  {mode === "manual" && <Power className="size-4 text-muted-foreground" />}
                  <span className="text-sm font-semibold text-foreground">
                    {modeLabel(mode)}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {modeDescription(mode)}
                </p>
                {isSelected && (
                  <div className="absolute top-3 right-3 size-2 rounded-full bg-brand" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-start gap-2 text-[11px] text-muted-foreground/60">
          <Info className="size-3.5 shrink-0 mt-0.5" />
          <span>
            Individual rules can override this default. Use &quot;Assist&quot; mode for sensitive
            hiring decisions that require human-in-the-loop approval.
          </span>
        </div>
      </div>
    </div>
  );
}
