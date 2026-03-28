"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CURRENT_USER } from "@/components/profile/data";
import { Button } from "@/components/ui/button";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

function RadioPills({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
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

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
        checked ? "bg-brand" : "bg-secondary"
      }`}
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
  const [theme, setTheme] = useState(CURRENT_USER.theme);
  const [sidebar, setSidebar] = useState("Expanded");
  const [language, setLanguage] = useState(CURRENT_USER.language);
  const [dateFormat, setDateFormat] = useState(CURRENT_USER.dateFormat);
  const [timeFormat, setTimeFormat] = useState(CURRENT_USER.timeFormat);
  const [landingPage, setLandingPage] = useState("Dashboard");
  const [aiInsights, setAiInsights] = useState(true);
  const [activityFeed, setActivityFeed] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largerText, setLargerText] = useState(false);

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Appearance */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">Choose your preferred color mode</p>
            </div>
            <RadioPills
              options={["Dark", "Light", "System"]}
              value={theme}
              onChange={setTheme}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Sidebar Default</p>
              <p className="text-xs text-muted-foreground">Default sidebar state on load</p>
            </div>
            <RadioPills
              options={["Expanded", "Collapsed"]}
              value={sidebar}
              onChange={setSidebar}
            />
          </div>
        </div>
      </div>

      {/* Regional */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Regional</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-8">
            <div className="shrink-0">
              <p className="text-sm text-foreground">Language</p>
            </div>
            <div className="w-48">
              <SelectField
                value={language}
                options={["English", "Hindi", "Spanish", "French", "German"]}
                onChange={setLanguage}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-8">
            <div className="shrink-0">
              <p className="text-sm text-foreground">Date Format</p>
            </div>
            <div className="w-48">
              <SelectField
                value={dateFormat}
                options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
                onChange={setDateFormat}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Time Format</p>
            </div>
            <RadioPills
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
            <button className="text-xs text-brand hover:underline cursor-pointer">
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Dashboard</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-8">
            <div className="shrink-0">
              <p className="text-sm text-foreground">Default Landing Page</p>
            </div>
            <div className="w-48">
              <SelectField
                value={landingPage}
                options={["Dashboard", "Pipeline", "People"]}
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
            <Toggle checked={reduceMotion} onChange={setReduceMotion} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">High Contrast</p>
              <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Toggle checked={highContrast} onChange={setHighContrast} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Larger Text</p>
              <p className="text-xs text-muted-foreground">Increase base font size</p>
            </div>
            <Toggle checked={largerText} onChange={setLargerText} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm">Save Preferences</Button>
      </div>
    </motion.div>
  );
}
