"use client";

import {
  Activity,
  BarChart3,
  Bot,
  Captions,
  FileText,
  Gauge,
  GraduationCap,
  Library,
  Lightbulb,
  Link,
  MessageCircle,
  MessagesSquare,
  ShieldCheck,
  Shuffle,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

const MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  BarChart3,
  Bot,
  Captions,
  FileText,
  Gauge,
  GraduationCap,
  Library,
  Lightbulb,
  Link,
  MessageCircle,
  MessagesSquare,
  ShieldCheck,
  Shuffle,
  TrendingUp,
  TriangleAlert,
};

/** Resolve a lucide icon by string name. Falls back to Bot. */
export function AgentIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = MAP[name] ?? Bot;
  return <Cmp className={className} />;
}
