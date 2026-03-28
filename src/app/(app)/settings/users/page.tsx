"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Plus } from "lucide-react";
import {
  USERS_TABS,
  ACTIVE_COUNT,
  PENDING_COUNT,
  DEACTIVATED_COUNT,
  MFA_COUNT,
  type UsersTab,
} from "@/components/settings/users/data";
import { MembersTab } from "@/components/settings/users/members-tab";
import { RolesTab } from "@/components/settings/users/roles-tab";
import { PermissionsTab } from "@/components/settings/users/permissions-tab";
import { SsoTab } from "@/components/settings/users/sso-tab";
import { ActivityTab } from "@/components/settings/users/activity-tab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mfaPercent = Math.round((MFA_COUNT / ACTIVE_COUNT) * 100);

const tabContentVariants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function UsersSettingsPage() {
  const [activeTab, setActiveTab] = useState<UsersTab>("members");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-5 max-w-6xl"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Users className="size-5 text-brand" />
            <h1 className="text-xl font-bold text-foreground">
              Users &amp; Roles
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage team members, roles, permissions, and authentication.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search users, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 pl-8 text-xs"
            />
          </div>
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90 text-xs">
            <Plus className="size-3.5" />
            Invite User
          </Button>
          <Button variant="outline" className="text-xs">
            <Plus className="size-3.5" />
            Create Role
          </Button>
        </div>
      </div>

      {/* ── Summary Stats Bar ── */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-6 items-center text-xs">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-success shrink-0" />
          <span className="text-foreground font-medium">{ACTIVE_COUNT}</span>
          <span className="text-muted-foreground">Active users</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-warning shrink-0" />
          <span className="text-foreground font-medium">{PENDING_COUNT}</span>
          <span className="text-muted-foreground">Pending invites</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-destructive shrink-0" />
          <span className="text-foreground font-medium">
            {DEACTIVATED_COUNT}
          </span>
          <span className="text-muted-foreground">Deactivated</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-brand/10 text-brand">
            SSO: Enabled (Okta)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            MFA: {MFA_COUNT}/{ACTIVE_COUNT} enrolled ({mfaPercent}%)
          </span>
          <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-success"
              style={{ width: `${mfaPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Tab Pills ── */}
      <div className="flex items-center gap-1 flex-wrap">
        {USERS_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-overlay"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-1.5 min-w-4.5 h-4.5 text-[10px] font-semibold ${
                    isActive
                      ? "bg-brand/20 text-brand"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {activeTab === "members" && (
            <MembersTab searchQuery={searchQuery} />
          )}
          {activeTab === "roles" && <RolesTab />}
          {activeTab === "permissions" && <PermissionsTab />}
          {activeTab === "sso" && <SsoTab />}
          {activeTab === "activity" && <ActivityTab />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
