"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, Layers, Globe, Cpu, ChevronDown, Hash } from "lucide-react";
import {
  type SystemEvent,
  type EventCategory,
  type EventLayer,
  categoryLabel,
  categoryColor,
  categoryBgColor,
  layerLabel,
  layerColor,
  layerBgColor,
  layerDescription,
  sourceLabel,
} from "./data";

interface EventCatalogProps {
  events: SystemEvent[];
  onToggleEvent: (id: string) => void;
}

const LAYER_TABS: { key: EventLayer; label: string; icon: typeof Zap; description: string }[] = [
  { key: "domain", label: "Domain Events", icon: Zap, description: "Business-level lifecycle events" },
  { key: "system", label: "System Signals", icon: Cpu, description: "Fine-grained internal signals" },
  { key: "integration", label: "Integration Events", icon: Globe, description: "Webhook-ready external events" },
];

const CATEGORIES: (EventCategory | "all")[] = [
  "all",
  "candidate",
  "requisition",
  "interview",
  "decision",
  "system",
];

export function EventCatalog({ events, onToggleEvent }: EventCatalogProps) {
  const [search, setSearch] = useState("");
  const [activeLayer, setActiveLayer] = useState<EventLayer>("domain");
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const layerEvents = useMemo(
    () => events.filter((e) => e.layer === activeLayer),
    [events, activeLayer]
  );

  const filtered = useMemo(() => {
    return layerEvents.filter((e) => {
      if (category !== "all" && e.category !== category) return false;
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [layerEvents, category, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, SystemEvent[]> = {};
    for (const e of filtered) {
      if (!groups[e.category]) groups[e.category] = [];
      groups[e.category].push(e);
    }
    return groups;
  }, [filtered]);

  const layerCounts = useMemo(() => {
    const counts: Record<EventLayer, { total: number; active: number }> = {
      domain: { total: 0, active: 0 },
      system: { total: 0, active: 0 },
      integration: { total: 0, active: 0 },
    };
    for (const e of events) {
      counts[e.layer].total++;
      if (e.isActive) counts[e.layer].active++;
    }
    return counts;
  }, [events]);

  return (
    <div className="space-y-5">
      {/* Layer tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LAYER_TABS.map((tab) => {
          const isActive = activeLayer === tab.key;
          const counts = layerCounts[tab.key];
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveLayer(tab.key); setCategory("all"); }}
              className={`relative flex items-start gap-3 p-4 rounded-xl border transition-all duration-150 cursor-pointer text-left ${
                isActive
                  ? "border-brand bg-brand/[0.04] ring-1 ring-brand"
                  : "border-border hover:border-border hover:bg-secondary/20"
              }`}
            >
              <div className={`size-9 rounded-lg ${isActive ? layerBgColor(tab.key) : "bg-secondary/50"} flex items-center justify-center shrink-0`}>
                <TabIcon className={`size-4 ${isActive ? layerColor(tab.key) : "text-muted-foreground/40"}`} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {tab.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50">
                    {counts.active}/{counts.total}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {tab.description}
                </p>
              </div>
              {isActive && (
                <div className="absolute top-3 right-3 size-2 rounded-full bg-brand" />
              )}
            </button>
          );
        })}
      </div>

      {/* Search + category filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors cursor-pointer ${
                category === cat
                  ? "bg-brand-purple/15 text-brand-purple"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {cat === "all" ? "All" : categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Layer description */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${layerBgColor(activeLayer)}`}>
        <Layers className={`size-3.5 ${layerColor(activeLayer)}`} />
        <span className={`text-[11px] font-medium ${layerColor(activeLayer)}`}>
          {layerLabel(activeLayer)} Layer
        </span>
        <span className="text-[11px] text-muted-foreground">
          — {layerDescription(activeLayer)}
        </span>
      </div>

      {/* Grouped events */}
      {Object.entries(grouped).map(([cat, catEvents]) => (
        <div key={cat} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold uppercase tracking-widest ${categoryColor(cat as EventCategory)}`}>
              {categoryLabel(cat as EventCategory)}
            </span>
            <span className="text-[10px] text-muted-foreground/40">({catEvents.length})</span>
          </div>
          <div className="space-y-1.5">
            {catEvents.map((evt, i) => {
              const isExpanded = expandedEvent === evt.id;
              return (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className="rounded-lg border border-border bg-card overflow-hidden"
                >
                  <div className="flex items-center justify-between p-3 hover:bg-secondary/20 transition-colors">
                    <button
                      onClick={() => setExpandedEvent(isExpanded ? null : evt.id)}
                      className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <div className={`size-8 rounded-lg ${categoryBgColor(evt.category)} flex items-center justify-center shrink-0`}>
                        <Zap className={`size-3.5 ${categoryColor(evt.category)}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground font-mono">
                            {evt.name}
                          </span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${layerBgColor(evt.layer)} ${layerColor(evt.layer)} uppercase tracking-wider`}>
                            {layerLabel(evt.layer)}
                          </span>
                          <span className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-secondary text-muted-foreground/60">
                            {evt.version}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                          {evt.description}
                        </p>
                      </div>
                      <ChevronDown className={`size-4 text-muted-foreground/30 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                    <button
                      onClick={() => onToggleEvent(evt.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer shrink-0 ml-3 ${
                        evt.isActive ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      <span className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${evt.isActive ? "translate-x-4.5" : "translate-x-1"}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-1 border-t border-border/50 space-y-3">
                          {/* Schema */}
                          <div>
                            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
                              Payload Schema
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {evt.payloadSchema.map((field) => (
                                <span
                                  key={field}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-[10px] font-mono text-muted-foreground"
                                >
                                  <Hash className="size-2.5 text-muted-foreground/40" />
                                  {field}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Meta row */}
                          <div className="flex items-center gap-4 text-[10px] text-muted-foreground/50">
                            <span>Source: <span className="text-foreground/60">{sourceLabel(evt.source)}</span></span>
                            <span>Version: <span className="text-foreground/60 font-mono">{evt.version}</span></span>
                            <span>Category: <span className={categoryColor(evt.category)}>{categoryLabel(evt.category)}</span></span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40">
          <Zap className="size-8 mb-3" />
          <p className="text-sm">No events match your search</p>
        </div>
      )}
    </div>
  );
}
