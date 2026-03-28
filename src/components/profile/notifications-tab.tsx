"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NOTIFICATION_PREFS, type NotificationCategory } from "@/components/profile/data";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

type Channel = "email" | "inApp" | "slack";

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

export function NotificationsTab() {
  const [prefs, setPrefs] = useState<NotificationCategory[]>(
    () => NOTIFICATION_PREFS.map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({ ...item })),
    }))
  );

  const togglePref = (catIndex: number, itemIndex: number, channel: Channel) => {
    setPrefs((prev) => {
      const next = prev.map((cat, ci) => {
        if (ci !== catIndex) return cat;
        return {
          ...cat,
          items: cat.items.map((item, ii) => {
            if (ii !== itemIndex) return item;
            return { ...item, [channel]: !item[channel] };
          }),
        };
      });
      return next;
    });
  };

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {prefs.map((category, catIndex) => (
        <div
          key={category.category}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-sm text-foreground mb-4">
            {category.category}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground pb-2 pr-4">
                    Notification
                  </th>
                  <th className="text-center text-[10px] uppercase tracking-wider text-muted-foreground pb-2 w-16">
                    Email
                  </th>
                  <th className="text-center text-[10px] uppercase tracking-wider text-muted-foreground pb-2 w-16">
                    In-App
                  </th>
                  <th className="text-center text-[10px] uppercase tracking-wider text-muted-foreground pb-2 w-16">
                    Slack
                  </th>
                </tr>
              </thead>
              <tbody>
                {category.items.map((item, itemIndex) => (
                  <tr
                    key={item.label}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-2.5 pr-4 text-xs text-foreground">
                      {item.label}
                    </td>
                    <td className="py-2.5 text-center">
                      <div className="flex justify-center">
                        <CheckboxToggle
                          checked={item.email}
                          onChange={() => togglePref(catIndex, itemIndex, "email")}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 text-center">
                      <div className="flex justify-center">
                        <CheckboxToggle
                          checked={item.inApp}
                          onChange={() => togglePref(catIndex, itemIndex, "inApp")}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 text-center">
                      <div className="flex justify-center">
                        <CheckboxToggle
                          checked={item.slack}
                          onChange={() => togglePref(catIndex, itemIndex, "slack")}
                        />
                      </div>
                    </td>
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
