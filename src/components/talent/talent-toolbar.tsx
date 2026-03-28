"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Columns3,
  Table2,
  List,
  GitBranch,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type CandidateFilters,
  STAGES,
  STAGE_MAP,
  ALL_SOURCES,
  ALL_TAGS,
} from "@/components/talent/data";

export type ViewMode = "kanban" | "table" | "list" | "pipeline";

interface TalentToolbarProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  filters: CandidateFilters;
  onFiltersChange: (filters: CandidateFilters) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
  filteredCount: number;
}

const viewOptions: {
  value: ViewMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "pipeline", label: "Pipeline", icon: GitBranch },
  { value: "kanban", label: "Kanban", icon: Columns3 },
  { value: "table", label: "Table", icon: Table2 },
  { value: "list", label: "List", icon: List },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "recent", label: "Recent" },
  { value: "score", label: "AI Score" },
  { value: "days", label: "Days in Stage" },
  { value: "name", label: "Name A-Z" },
];

function sortLabel(value: string): string {
  return SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Recent";
}

/* ── Dropdown wrapper ── */

function Dropdown({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      {/* Invisible overlay to detect outside clicks */}
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl p-2 min-w-45 z-40">
        {children}
      </div>
    </>
  );
}

/* ── Checkbox row ── */

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-foreground hover:bg-secondary cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-3.5 rounded border-border accent-brand"
      />
      {label}
    </label>
  );
}

/* ── Radio row ── */

function RadioRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
        selected
          ? "bg-brand/10 text-brand font-medium"
          : "text-foreground hover:bg-secondary"
      }`}
    >
      <span
        className={`size-3 rounded-full border-2 flex items-center justify-center ${
          selected ? "border-brand" : "border-border"
        }`}
      >
        {selected && <span className="size-1.5 rounded-full bg-brand" />}
      </span>
      {label}
    </button>
  );
}

/* ── Filter chip ── */

function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 bg-brand/10 text-brand text-xs px-2 py-1 rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-brand/70 transition-colors"
        aria-label={`Remove filter: ${label}`}
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

/* ── Main Toolbar ── */

export function TalentToolbar({
  activeView,
  onViewChange,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
}: TalentToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) =>
    setOpenDropdown((prev) => (prev === name ? null : name));
  const closeDropdown = () => setOpenDropdown(null);

  /* ── Filter mutation helpers ── */

  const toggleStage = (stageId: string, checked: boolean) => {
    const stages = checked
      ? [...filters.stages, stageId]
      : filters.stages.filter((s) => s !== stageId);
    onFiltersChange({ ...filters, stages });
  };

  const toggleSource = (source: string, checked: boolean) => {
    const sources = checked
      ? [...filters.sources, source]
      : filters.sources.filter((s) => s !== source);
    onFiltersChange({ ...filters, sources });
  };

  const toggleTag = (tag: string, checked: boolean) => {
    const tags = checked
      ? [...filters.tags, tag]
      : filters.tags.filter((t) => t !== tag);
    onFiltersChange({ ...filters, tags });
  };

  const removeStageFilter = (stageId: string) => {
    onFiltersChange({
      ...filters,
      stages: filters.stages.filter((s) => s !== stageId),
    });
  };

  const removeSourceFilter = (source: string) => {
    onFiltersChange({
      ...filters,
      sources: filters.sources.filter((s) => s !== source),
    });
  };

  const removeTagFilter = (tag: string) => {
    onFiltersChange({
      ...filters,
      tags: filters.tags.filter((t) => t !== tag),
    });
  };

  const clearAll = () => {
    onFiltersChange({ search: filters.search, stages: [], sources: [], tags: [] });
  };

  const hasActiveFilters =
    filters.stages.length > 0 ||
    filters.sources.length > 0 ||
    filters.tags.length > 0;

  const isFiltered = hasActiveFilters || filters.search.length > 0;

  return (
    <div className="sticky top-14 z-30 bg-card border-b border-border">
      {/* Main row */}
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left group */}
        <div className="flex items-center gap-2">
          {/* Search input */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="h-8 w-60 rounded-full bg-background border border-border pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Stage filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => toggleDropdown("stages")}
            >
              <Filter className="size-3" />
              {filters.stages.length > 0
                ? `Stages (${filters.stages.length})`
                : "All Stages"}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "stages"}
              onClose={closeDropdown}
            >
              {STAGES.map((stage) => (
                <CheckboxRow
                  key={stage.id}
                  label={stage.name}
                  checked={filters.stages.includes(stage.id)}
                  onChange={(checked) => toggleStage(stage.id, checked)}
                />
              ))}
            </Dropdown>
          </div>

          {/* Source filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => toggleDropdown("sources")}
            >
              {filters.sources.length > 0
                ? `Source (${filters.sources.length})`
                : "Source"}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "sources"}
              onClose={closeDropdown}
            >
              {ALL_SOURCES.map((source) => (
                <CheckboxRow
                  key={source}
                  label={source}
                  checked={filters.sources.includes(source)}
                  onChange={(checked) => toggleSource(source, checked)}
                />
              ))}
            </Dropdown>
          </div>

          {/* Tags filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => toggleDropdown("tags")}
            >
              {filters.tags.length > 0
                ? `Tags (${filters.tags.length})`
                : "Tags"}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "tags"}
              onClose={closeDropdown}
            >
              {ALL_TAGS.map((tag) => (
                <CheckboxRow
                  key={tag}
                  label={tag}
                  checked={filters.tags.includes(tag)}
                  onChange={(checked) => toggleTag(tag, checked)}
                />
              ))}
            </Dropdown>
          </div>

          {/* Sort */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => toggleDropdown("sort")}
            >
              <ArrowUpDown className="size-3" />
              Sort: {sortLabel(sortBy)}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "sort"}
              onClose={closeDropdown}
            >
              {SORT_OPTIONS.map((opt) => (
                <RadioRow
                  key={opt.value}
                  label={opt.label}
                  selected={sortBy === opt.value}
                  onSelect={() => {
                    onSortChange(opt.value);
                    closeDropdown();
                  }}
                />
              ))}
            </Dropdown>
          </div>

          {/* Filter count */}
          {isFiltered && (
            <span className="text-xs text-muted-foreground ml-2">
              Showing {filteredCount} of {totalCount}
            </span>
          )}
        </div>

        {/* Right group — View toggle */}
        <div className="flex items-center bg-background rounded-lg p-0.5 border border-border">
          {viewOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = activeView === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onViewChange(opt.value)}
                aria-label={`Switch to ${opt.label} view`}
                className={`px-3 py-1 text-xs rounded-md flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 px-6 py-2 border-t border-border">
          {filters.stages.map((s) => (
            <Chip
              key={`stage-${s}`}
              label={`Stage: ${STAGE_MAP[s]?.name ?? s}`}
              onRemove={() => removeStageFilter(s)}
            />
          ))}
          {filters.sources.map((s) => (
            <Chip
              key={`source-${s}`}
              label={`Source: ${s}`}
              onRemove={() => removeSourceFilter(s)}
            />
          ))}
          {filters.tags.map((t) => (
            <Chip
              key={`tag-${t}`}
              label={`Tag: ${t}`}
              onRemove={() => removeTagFilter(t)}
            />
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-brand hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
