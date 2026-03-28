"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Briefcase,
  Globe,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CURRENT_USER,
  PROFILE_TABS,
  type ProfileTab,
} from "@/components/profile/data";
import { OverviewTab } from "@/components/profile/overview-tab";
import { PreferencesTab } from "@/components/profile/preferences-tab";
import { SecurityTab } from "@/components/profile/security-tab";
import { ActivityTab } from "@/components/profile/activity-tab";
import { NotificationsTab } from "@/components/profile/notifications-tab";

const TAB_COMPONENTS: Record<ProfileTab, React.ComponentType> = {
  overview: OverviewTab,
  preferences: PreferencesTab,
  security: SecurityTab,
  activity: ActivityTab,
  notifications: NotificationsTab,
};

const INFO_ITEMS = [
  { icon: Mail, label: "Email", value: CURRENT_USER.email },
  { icon: Phone, label: "Phone", value: CURRENT_USER.phone },
  { icon: MapPin, label: "Location", value: CURRENT_USER.location },
  { icon: Clock, label: "Timezone", value: CURRENT_USER.timezone },
  { icon: Calendar, label: "Joined", value: CURRENT_USER.joinedDate },
  { icon: Briefcase, label: "Department", value: `${CURRENT_USER.department} / ${CURRENT_USER.team}` },
  { icon: Globe, label: "Pronouns", value: CURRENT_USER.pronouns },
  { icon: LinkIcon, label: "LinkedIn", value: CURRENT_USER.linkedIn },
] as const;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Left Sidebar */}
      <aside className="w-80 shrink-0 bg-card border-r border-border p-6 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto scrollbar-thin">
        <div className="flex flex-col items-center mb-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-brand-purple text-2xl font-bold text-white">
            {CURRENT_USER.initials}
          </div>
          <button className="mt-2 text-xs text-brand hover:underline cursor-pointer">
            Upload Photo
          </button>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-foreground">
            {CURRENT_USER.firstName} {CURRENT_USER.lastName}
          </h2>
          <p className="text-sm text-muted-foreground">{CURRENT_USER.title}</p>
          <span className="inline-block mt-1 bg-brand-purple/10 text-brand-purple text-xs rounded-full px-2 py-0.5">
            {CURRENT_USER.role}
          </span>
        </div>

        <div className="border-t border-border my-4" />

        {/* Info items */}
        <div className="space-y-3">
          {INFO_ITEMS.map((item) => (
            <div key={item.label} className="flex items-start gap-2.5">
              <item.icon className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-xs text-foreground break-all">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border my-4" />

        {/* Bio */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Bio</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {CURRENT_USER.bio}
          </p>
        </div>

        <Button variant="outline" className="w-full mt-4" size="sm">
          Edit Profile
        </Button>
      </aside>

      {/* Right Content */}
      <div className="flex-1 p-6">
        {/* Tab pills */}
        <div className="flex gap-1 mb-6 bg-secondary rounded-lg p-1 w-fit">
          {PROFILE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? "bg-brand text-brand-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
