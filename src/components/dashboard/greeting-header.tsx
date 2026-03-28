"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function GreetingHeader() {
  const greeting = useMemo(() => getGreeting(), []);
  const dateString = useMemo(() => formatDate(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold text-foreground">
        {greeting}, Prashant
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {dateString} &middot;{" "}
        <span className="bg-gradient-to-r from-brand-purple to-brand-teal bg-clip-text text-transparent">
          3 agents active
        </span>{" "}
        &middot;{" "}
        <span className="text-warning">12 tasks need attention</span>
      </p>
    </motion.div>
  );
}
