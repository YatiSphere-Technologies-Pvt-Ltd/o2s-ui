"use client";

import { useState } from "react";
import {
  Search,
  ArrowUpDown,
  LayoutGrid,
  Table2,
  List,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type JobFilters,
  ALL_DEPARTMENTS,
  ALL_STATUSES,
  ALL_PRIORITIES,
  ALL_LOCATIONS,
  ALL_HIRING_MANAGERS,
  DEPT_COLORS,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
} from "@/components/jobs/data";

export type JobsViewMode = "cards" | "table" | "list";

interface JobsToolbarProps {
  jobsView: JobsViewMode;
  onJobsViewChange: (view: JobsViewMode) => void;
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
  filteredCount: number;
}

const VIEW_OPTIONS: {
  value: JobsViewMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "cards", label: "Cards", icon: LayoutGrid },
  { value: "table", label: "Table", icon: Table2 },
  { value: "list", label: "List", icon: List },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "most-cand", label: "Most Candidates" },
  { value: "least-cand", label: "Fewest Candidates" },
  { value: "days-open", label: "Days Open" },
  { value: "health", label: "Health Score" },
  { value: "priority", label: "Priority" },
];

function sortLabel(value: string): string {
  return SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Newest";
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
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl p-2 min-w-45 z-40 max-h-64 overflow-y-auto">
        {children}
      </div>
    </>
  );
}

/* ── Checkbox row with optional dot ── */

function CheckboxRow({
  label,
  checked,
  onChange,
  dotClass,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  dotClass?: string;
}) {
  return (
    <label className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-foreground hover:bg-secondary cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-3.5 rounded border-border accent-brand"
      />
      {dotClass && <span className={`size-2 rounded-full ${dotClass}`} />}
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

export function JobsToolbar({
  jobsView,
  onJobsViewChange,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
}: JobsToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) =>
    setOpenDropdown((prev) => (prev === name ? null : name));
  const closeDropdown = () => setOpenDropdown(null);

  /* ── Filter mutation helpers ── */

  const toggleArrayFilter = (
    key: keyof Pick<JobFilters, "departments" | "statuses" | "priorities" | "locations" | "hiringManagers">,
    value: string,
    checked: boolean
  ) => {
    const current = filters[key];
    const next = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFiltersChange({ ...filters, [key]: next });
  };

  const removeArrayFilter = (
    key: keyof Pick<JobFilters, "departments" | "statuses" | "priorities" | "locations" | "hiringManagers">,
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [key]: filters[key].filter((v) => v !== value),
    });
  };

  const clearAll = () => {
    onFiltersChange({
      search: filters.search,
      departments: [],
      statuses: [],
      priorities: [],
      locations: [],
      hiringManagers: [],
    });
  };

  const hasActiveFilters =
    filters.departments.length > 0 ||
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.locations.length > 0 ||
    filters.hiringManagers.length > 0;

  const isFiltered = hasActiveFilters || filters.search.length > 0;

  return (
    <div className="sticky top-14 z-30 bg-card border-b border-border">
      {/* Main row */}
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left group */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search input */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="h-8 w-56 rounded-full bg-background border border-border pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Department filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => toggleDropdown("departments")}
            >
              {filters.departments.length > 0
                ? `Department (${filters.departments.length})`
                : "Department"}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "departments"}
              onClose={closeDropdown}
            >
              {ALL_DEPARTMENTS.map((dept) => (
                <CheckboxRow
                  key={dept}
                  label={dept}
                  checked={filters.departments.includes(dept)}
                  onChange={(checked) =>
                    toggleArrayFilter("departments", dept, checked)
                  }
                  dotClass={DEPT_COLORS[dept]?.colorClass}
                />
              ))}
            </Dropdown>
          </div>

          {/* Status filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => toggleDropdown("statuses")}
            >
              {filters.statuses.length > 0
                ? `Status (${filters.statuses.length})`
                : "Status"}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "statuses"}
              onClose={closeDropdown}
            >
              {ALL_STATUSES.map((status) => (
                <CheckboxRow
                  key={status}
                  label={STATUS_CONFIG[status]?.label ?? status}
                  checked={filters.statuses.includes(status)}
                  onChange={(checked) =>
                    toggleArrayFilter("statuses", status, checked)
                  }
                  dotClass={STATUS_CONFIG[status]?.dotClass}
                />
              ))}
            </Dropdown>
          </div>

          {/* Priority filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => toggleDropdown("priorities")}
            >
              {filters.priorities.length > 0
                ? `Priority (${filters.priorities.length})`
                : "Priority"}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "priorities"}
              onClose={closeDropdown}
            >
              {ALL_PRIORITIES.map((priority) => (
                <CheckboxRow
                  key={priority}
                  label={PRIORITY_CONFIG[priority]?.label ?? priority}
                  checked={filters.priorities.includes(priority)}
                  onChange={(checked) =>
                    toggleArrayFilter("priorities", priority, checked)
                  }
                  dotClass={PRIORITY_CONFIG[priority]?.dotClass}
                />
              ))}
            </Dropdown>
          </div>

          {/* Location filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => toggleDropdown("locations")}
            >
              {filters.locations.length > 0
                ? `Location (${filters.locations.length})`
                : "Location"}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "locations"}
              onClose={closeDropdown}
            >
              {ALL_LOCATIONS.map((location) => (
                <CheckboxRow
                  key={location}
                  label={location}
                  checked={filters.locations.includes(location)}
                  onChange={(checked) =>
                    toggleArrayFilter("locations", location, checked)
                  }
                />
              ))}
            </Dropdown>
          </div>

          {/* Hiring Manager filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => toggleDropdown("hiringManagers")}
            >
              {filters.hiringManagers.length > 0
                ? `Manager (${filters.hiringManagers.length})`
                : "Hiring Manager"}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "hiringManagers"}
              onClose={closeDropdown}
            >
              {ALL_HIRING_MANAGERS.map((manager) => (
                <CheckboxRow
                  key={manager}
                  label={manager}
                  checked={filters.hiringManagers.includes(manager)}
                  onChange={(checked) =>
                    toggleArrayFilter("hiringManagers", manager, checked)
                  }
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
        <div className="flex items-center bg-background rounded-lg p-0.5 border border-border shrink-0">
          {VIEW_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = jobsView === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onJobsViewChange(opt.value)}
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
          {filters.departments.map((d) => (
            <Chip
              key={`dept-${d}`}
              label={`Department: ${d}`}
              onRemove={() => removeArrayFilter("departments", d)}
            />
          ))}
          {filters.statuses.map((s) => (
            <Chip
              key={`status-${s}`}
              label={`Status: ${STATUS_CONFIG[s]?.label ?? s}`}
              onRemove={() => removeArrayFilter("statuses", s)}
            />
          ))}
          {filters.priorities.map((p) => (
            <Chip
              key={`priority-${p}`}
              label={`Priority: ${PRIORITY_CONFIG[p]?.label ?? p}`}
              onRemove={() => removeArrayFilter("priorities", p)}
            />
          ))}
          {filters.locations.map((l) => (
            <Chip
              key={`location-${l}`}
              label={`Location: ${l}`}
              onRemove={() => removeArrayFilter("locations", l)}
            />
          ))}
          {filters.hiringManagers.map((m) => (
            <Chip
              key={`manager-${m}`}
              label={`Manager: ${m}`}
              onRemove={() => removeArrayFilter("hiringManagers", m)}
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
