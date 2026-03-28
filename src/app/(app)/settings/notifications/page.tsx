"use client";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";

export default function NotificationsSettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" as const }} className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bell className="size-5 text-brand" />
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        </div>
        <p className="text-sm text-muted-foreground">Manage email, in-app, and Slack notification preferences.</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">Notification settings will be available soon.</p>
      </div>
    </motion.div>
  );
}
