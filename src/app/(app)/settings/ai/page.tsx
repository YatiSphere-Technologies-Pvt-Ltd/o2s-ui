"use client";

import { AISettingsHeader } from "@/components/settings/ai-settings-header";
import { GlobalStatusBar } from "@/components/settings/global-status-bar";
import { AgentCardsGrid } from "@/components/settings/agent-cards-grid";
import { GlobalAISettings } from "@/components/settings/global-ai-settings";
import { ActivityLog } from "@/components/settings/agent-activity-log";
import { SafetyDashboard } from "@/components/settings/safety-dashboard";

export default function AISettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <AISettingsHeader />
      <GlobalStatusBar />
      <AgentCardsGrid />
      <GlobalAISettings />
      <ActivityLog />
      <SafetyDashboard />
    </div>
  );
}
