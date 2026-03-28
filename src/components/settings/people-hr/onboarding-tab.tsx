"use client";

import { Pencil, Copy, MoreHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ONBOARDING_CHECKLISTS } from "@/components/settings/people-hr/data";

const PROVISIONING_RULES = [
  { label: "Auto-create Google Workspace account", checked: true },
  { label: "Auto-create Slack account and add to default channels", checked: true },
  { label: "Auto-provision GitHub org access based on team", checked: true },
  { label: "Auto-assign Jira/Linear project based on department", checked: true },
  { label: "Auto-enroll in required training courses", checked: true },
  { label: "Auto-ship hardware (laptop, monitor) based on role", checked: false },
  { label: "Auto-assign parking/badge based on location", checked: false },
];

const WELCOME_INCLUDES = [
  { label: "Team intro", checked: true },
  { label: "Manager welcome note", checked: true },
  { label: "First-week schedule", checked: true },
  { label: "Company handbook link", checked: true },
  { label: "Org chart overview", checked: false },
  { label: "Benefits enrollment reminder", checked: false },
];

export function OnboardingTab() {
  return (
    <div className="space-y-5">
      {/* ── Onboarding Checklists ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Onboarding Checklists
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {ONBOARDING_CHECKLISTS.map((cl) => (
            <div
              key={cl.name}
              className="border border-border rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-foreground">{cl.name}</p>
                {cl.isDefault && <Badge variant="secondary">DEFAULT</Badge>}
              </div>
              <div className="space-y-0.5 text-xs text-muted-foreground">
                <p>
                  {cl.tasks} tasks &middot; {cl.categories} categories
                </p>
                <p>Used for: {cl.usedFor}</p>
                <p>
                  Avg. completion: <span className="font-mono">{cl.avgCompletion}</span>
                </p>
                <p className="flex items-center gap-1">
                  <Sparkles className="size-3 text-brand-purple" />
                  {cl.aiTasks} AI-assisted tasks
                </p>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <Button size="xs" variant="ghost">
                  <Pencil className="size-3" />
                  Edit
                </Button>
                <Button size="xs" variant="ghost">
                  <Copy className="size-3" />
                  Duplicate
                </Button>
                <Button size="icon-xs" variant="ghost">
                  <MoreHorizontal className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Provisioning Rules ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Provisioning Rules
        </h3>
        <div className="space-y-2.5">
          {PROVISIONING_RULES.map((rule) => (
            <label
              key={rule.label}
              className="flex items-center gap-2.5 text-sm text-foreground"
            >
              <input
                type="checkbox"
                defaultChecked={rule.checked}
                className="size-3.5 accent-brand rounded"
              />
              {rule.label}
            </label>
          ))}
        </div>
      </div>

      {/* ── Welcome Communication ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Welcome Communication
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Template</span>
            <span className="text-foreground">Default Welcome Email</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Send timing</span>
            <span className="text-foreground">1 day before start date</span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Include in welcome packet:
            </p>
            <div className="space-y-2">
              {WELCOME_INCLUDES.map((item) => (
                <label
                  key={item.label}
                  className="flex items-center gap-2.5 text-sm text-foreground"
                >
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="size-3.5 accent-brand rounded"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-muted-foreground">
              AI personalization
            </span>
            <span className="text-foreground flex items-center gap-1">
              <Sparkles className="size-3 text-brand-purple" />
              Enabled
            </span>
          </div>
        </div>
      </div>

      {/* ── Buddy Program ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Buddy Program
        </h3>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2.5 text-foreground">
            <input
              type="checkbox"
              defaultChecked
              className="size-3.5 accent-brand rounded"
            />
            Auto-assign buddy on onboarding start
          </label>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Minimum tenure to be a buddy</span>
            <span className="font-mono text-foreground">6 months</span>
          </div>
          <label className="flex items-center gap-2.5 text-foreground">
            <input
              type="checkbox"
              defaultChecked
              className="size-3.5 accent-brand rounded"
            />
            AI matching based on skills and interests
          </label>
        </div>
      </div>
    </div>
  );
}
