"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NOTIFICATION_PREFS,
  NOTIFICATION_CHANNELS,
  DEFAULT_QUIET_HOURS,
  type NotificationCategory,
  type NotificationChannelKey,
  type QuietHours,
} from "@/components/profile/data";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

function CheckboxToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex size-5 items-center justify-center rounded transition-colors cursor-pointer ${
        checked ? "bg-brand" : "bg-secondary"
      }`}
      aria-pressed={checked}
    >
      {checked && (
        <svg
          className="size-3 text-white"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M2 6l3 3 5-5" />
        </svg>
      )}
    </button>
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

export function NotificationsTab() {
  const [prefs, setPrefs] = useState<NotificationCategory[]>(
    () => NOTIFICATION_PREFS.map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({ ...item })),
    }))
  );
  const [quiet, setQuiet] = useState<QuietHours>(DEFAULT_QUIET_HOURS);

  const togglePref = (catIndex: number, itemIndex: number, channel: NotificationChannelKey) => {
    setPrefs((prev) =>
      prev.map((cat, ci) =>
        ci !== catIndex
          ? cat
          : {
              ...cat,
              items: cat.items.map((item, ii) =>
                ii !== itemIndex ? item : { ...item, [channel]: !item[channel] },
              ),
            },
      ),
    );
  };

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Quiet Hours */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="size-4 text-brand" />
          <h3 className="font-semibold text-sm text-foreground">Quiet Hours</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Mute non-urgent notifications</p>
              <p className="text-xs text-muted-foreground">Urgent alerts (security, on-call) still come through</p>
            </div>
            <Toggle checked={quiet.enabled} onChange={(v) => setQuiet({ ...quiet, enabled: v })} />
          </div>
          {quiet.enabled && (
            <>
              <div className="flex items-center justify-between gap-8">
                <p className="text-sm text-foreground">From</p>
                <input
                  type="time"
                  value={quiet.start}
                  onChange={(e) => setQuiet({ ...quiet, start: e.target.value })}
                  className="h-8 px-2 rounded-lg border border-input bg-transparent text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <div className="flex items-center justify-between gap-8">
                <p className="text-sm text-foreground">Until</p>
                <input
                  type="time"
                  value={quiet.end}
                  onChange={(e) => setQuiet({ ...quiet, end: e.target.value })}
                  className="h-8 px-2 rounded-lg border border-input bg-transparent text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">Mute all weekend</p>
                <Toggle
                  checked={quiet.weekendsAllDay}
                  onChange={(v) => setQuiet({ ...quiet, weekendsAllDay: v })}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Channel preferences per category */}
      {prefs.map((category, catIndex) => (
        <div key={category.category} className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm text-foreground mb-4">{category.category}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-140">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground pb-2 pr-4">
                    Notification
                  </th>
                  {NOTIFICATION_CHANNELS.map((ch) => (
                    <th
                      key={ch.key}
                      className="text-center text-[10px] uppercase tracking-wider text-muted-foreground pb-2 w-16"
                    >
                      {ch.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {category.items.map((item, itemIndex) => (
                  <tr key={item.label} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4 text-xs text-foreground">{item.label}</td>
                    {NOTIFICATION_CHANNELS.map((ch) => (
                      <td key={ch.key} className="py-2.5 text-center">
                        <div className="flex justify-center">
                          <CheckboxToggle
                            checked={item[ch.key]}
                            onChange={() => togglePref(catIndex, itemIndex, ch.key)}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button size="sm">Save Preferences</Button>
      </div>
    </motion.div>
  );
}
