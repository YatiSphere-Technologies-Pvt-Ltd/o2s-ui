"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Monitor, Smartphone, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SESSIONS, SECURITY_INFO, type SecuritySession } from "@/components/profile/data";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

function getDeviceIcon(device: string) {
  if (device.toLowerCase().includes("iphone") || device.toLowerCase().includes("phone")) {
    return Smartphone;
  }
  if (device.toLowerCase().includes("desktop") || device.toLowerCase().includes("windows")) {
    return Monitor;
  }
  return Laptop;
}

export function SecurityTab() {
  const [sessions, setSessions] = useState<SecuritySession[]>(SESSIONS);

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const revokeAllOther = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
  };

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Authentication */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="size-4 text-brand" />
          <h3 className="font-semibold text-sm text-foreground">Authentication</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Auth Method</span>
            <span className="text-[10px] bg-brand/10 text-brand rounded-full px-2 py-0.5">
              {SECURITY_INFO.authMethod}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Multi-Factor Authentication</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-success/10 text-success rounded-full px-2 py-0.5">
                Enabled
              </span>
              <span className="text-xs text-muted-foreground">
                {SECURITY_INFO.mfaMethod}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Change MFA Method</span>
            <button className="text-xs text-brand hover:underline cursor-pointer">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Last Password Change</span>
            <span className="text-xs text-foreground">{SECURITY_INFO.lastPasswordChange}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Password Expiry</span>
            <span className="text-xs text-foreground">{SECURITY_INFO.passwordExpiry}</span>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Active Sessions</h3>
        <div className="space-y-3">
          {sessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.device);
            return (
              <div
                key={session.id}
                className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg"
              >
                <DeviceIcon className="size-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-foreground font-medium">
                      {session.device} &middot; {session.browser}
                    </p>
                    {session.isCurrent && (
                      <span className="text-[10px] bg-success/10 text-success rounded-full px-2 py-0.5">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {session.location} &middot; {session.lastActive} &middot; IP: {session.ip}
                  </p>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={() => revokeSession(session.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        {sessions.filter((s) => !s.isCurrent).length > 0 && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={revokeAllOther}>
              Revoke All Other Sessions
            </Button>
          </div>
        )}
      </div>

      {/* Login History */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Login History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground pb-2 pr-4">
                  Date
                </th>
                <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground pb-2 pr-4">
                  Method
                </th>
                <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground pb-2 pr-4">
                  Device
                </th>
                <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground pb-2 pr-4">
                  Location
                </th>
                <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground pb-2">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {SECURITY_INFO.loginHistory.map((entry, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4 text-xs text-foreground">{entry.date}</td>
                  <td className="py-2.5 pr-4 text-xs text-muted-foreground">{entry.method}</td>
                  <td className="py-2.5 pr-4 text-xs text-muted-foreground">{entry.device}</td>
                  <td className="py-2.5 pr-4 text-xs text-muted-foreground">{entry.location}</td>
                  <td className="py-2.5">
                    <span
                      className={`text-[10px] rounded-full px-2 py-0.5 ${
                        entry.status === "success"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
