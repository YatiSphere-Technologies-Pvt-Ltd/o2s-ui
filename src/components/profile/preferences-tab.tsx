"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { CURRENT_USER, DEFAULT_DELEGATES, type Delegate } from "@/components/profile/data";
import { Button } from "@/components/ui/button";
import { usePrefs, type Theme } from "@/lib/prefs-context";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

function RadioPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 bg-secondary rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            value === opt
              ? "bg-brand text-brand-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
        checked ? "bg-brand" : "bg-secondary"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SelectField({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export function PreferencesTab() {
  const { prefs, setPref } = usePrefs();
  const [language, setLanguage] = useState(CURRENT_USER.language);
  const [dateFormat, setDateFormat] = useState(CURRENT_USER.dateFormat);
  const [timeFormat, setTimeFormat] = useState(CURRENT_USER.timeFormat);
  const [landingPage, setLandingPage] = useState("Dashboard");
  const [aiInsights, setAiInsights] = useState(true);
  const [activityFeed, setActivityFeed] = useState(true);
  const [delegates, setDelegates] = useState<Delegate[]>(DEFAULT_DELEGATES);

  const addDelegate = () =>
    setDelegates((prev) => [
      ...prev,
      { topic: "New topic", personName: "", personInitials: "—", personRole: "" },
    ]);

  const removeDelegate = (idx: number) =>
    setDelegates((prev) => prev.filter((_, i) => i !== idx));

  const updateDelegate = (idx: number, patch: Partial<Delegate>) =>
    setDelegates((prev) => prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)));

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Appearance */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">Applies app-wide; System follows your OS</p>
            </div>
            <RadioPills<Theme>
              options={["Dark", "Light", "System"] as const}
              value={prefs.theme}
              onChange={(v) => setPref("theme", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Sidebar Default</p>
              <p className="text-xs text-muted-foreground">Default sidebar state on load</p>
            </div>
            <RadioPills<"Expanded" | "Collapsed">
              options={["Expanded", "Collapsed"] as const}
              value={prefs.sidebarDefault}
              onChange={(v) => setPref("sidebarDefault", v)}
            />
          </div>
        </div>
      </div>

      {/* Regional */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Regional</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-8">
            <p className="text-sm text-foreground shrink-0">Language</p>
            <div className="w-48">
              <SelectField
                value={language}
                options={["English", "Hindi", "Spanish", "French", "German"]}
                onChange={setLanguage}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-8">
            <p className="text-sm text-foreground shrink-0">Date Format</p>
            <div className="w-48">
              <SelectField
                value={dateFormat}
                options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
                onChange={setDateFormat}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground">Time Format</p>
            <RadioPills<string>
              options={["12-hour", "24-hour"]}
              value={timeFormat}
              onChange={setTimeFormat}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Timezone</p>
              <p className="text-xs text-muted-foreground">{CURRENT_USER.timezone}</p>
            </div>
            <button className="text-xs text-brand hover:underline cursor-pointer">Change</button>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Dashboard</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-8">
            <p className="text-sm text-foreground shrink-0">Default Landing Page</p>
            <div className="w-48">
              <SelectField
                value={landingPage}
                options={["Dashboard", "Pipeline", "People", "My Leave"]}
                onChange={setLandingPage}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Show AI Insights</p>
              <p className="text-xs text-muted-foreground">Display AI-generated insights on dashboard</p>
            </div>
            <Toggle checked={aiInsights} onChange={setAiInsights} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Show Activity Feed</p>
              <p className="text-xs text-muted-foreground">Display recent activity on dashboard</p>
            </div>
            <Toggle checked={activityFeed} onChange={setActivityFeed} />
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Accessibility</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Reduce Motion</p>
              <p className="text-xs text-muted-foreground">Minimize animations throughout the app</p>
            </div>
            <Toggle
              checked={prefs.reduceMotion}
              onChange={(v) => setPref("reduceMotion", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">High Contrast</p>
              <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Toggle
              checked={prefs.highContrast}
              onChange={(v) => setPref("highContrast", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Larger Text</p>
              <p className="text-xs text-muted-foreground">Increase base font size</p>
            </div>
            <Toggle
              checked={prefs.largerText}
              onChange={(v) => setPref("largerText", v)}
            />
          </div>
        </div>
      </div>

      {/* Delegates by topic */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="size-4 text-brand" />
            <h3 className="font-semibold text-sm text-foreground">Default Delegates by Topic</h3>
          </div>
          <Button variant="outline" size="xs" onClick={addDelegate}>
            <Plus className="size-3" /> Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          When Aurora or a colleague needs an answer on these topics and you&apos;re unavailable, the request
          is routed to the person below.
        </p>
        <div className="space-y-2">
          {delegates.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No delegates configured.</p>
          )}
          {delegates.map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 bg-surface-overlay rounded-lg"
            >
              <input
                className="flex-1 h-8 px-2 rounded-md bg-transparent text-xs text-foreground border border-transparent hover:border-border focus:border-ring outline-none"
                value={d.topic}
                onChange={(e) => updateDelegate(i, { topic: e.target.value })}
                placeholder="Topic (e.g. Engineering)"
              />
              <span className="text-muted-foreground text-xs">→</span>
              <div className="flex items-center gap-2 flex-1">
                <div className="size-6 rounded-full bg-brand-purple/20 text-brand-purple text-[10px] font-bold flex items-center justify-center shrink-0">
                  {d.personInitials || "—"}
                </div>
                <input
                  className="flex-1 h-8 px-2 rounded-md bg-transparent text-xs text-foreground border border-transparent hover:border-border focus:border-ring outline-none"
                  value={d.personName}
                  onChange={(e) =>
                    updateDelegate(i, {
                      personName: e.target.value,
                      personInitials: e.target.value
                        .split(" ")
                        .map((p) => p[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "—",
                    })
                  }
                  placeholder="Person name"
                />
              </div>
              <button
                onClick={() => removeDelegate(i)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove delegate"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm">Save Preferences</Button>
      </div>
    </motion.div>
  );
}
