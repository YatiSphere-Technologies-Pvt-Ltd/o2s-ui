"use client";

import { GreetingHeader } from "@/components/dashboard/greeting-header";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { MetricsRow } from "@/components/dashboard/metrics-row";
import { AgentActivityFeed } from "@/components/dashboard/agent-activity-feed";
import { HiringPipeline } from "@/components/dashboard/hiring-pipeline";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ActionItems } from "@/components/dashboard/action-items";
import { UpcomingSchedule } from "@/components/dashboard/upcoming-schedule";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <GreetingHeader />
      <QuickActions />
      <MetricsRow />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <AgentActivityFeed />
          <HiringPipeline />
          <RecentActivity />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ActionItems />
          <UpcomingSchedule />
          <AIInsightCard />
        </div>
      </div>
    </div>
  );
}
