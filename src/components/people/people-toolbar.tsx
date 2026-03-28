"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  Table2,
  List,
  ChevronDown,
  X,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type PeopleFilters,
  DEPARTMENTS,
  ALL_LOCATIONS,
  ALL_STATUSES,
  ALL_LEVELS_UNIQUE,
  STATUS_CONFIG,
} from "@/components/people/data";

export type DirectoryView = "grid" | "table" | "list";
export type GroupBy = "none" | "department" | "location" | "status";

interface PeopleToolbarProps {
  directoryView: DirectoryView;
  onDirectoryViewChange: (view: DirectoryView) => void;
  filters: PeopleFilters;
  onFiltersChange: (filters: PeopleFilters) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  groupBy: GroupBy;
  onGroupByChange: (groupBy: GroupBy) => void;
  totalCount: number;
  filteredCount: number;
}

const VIEW_OPTIONS: {
  value: DirectoryView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "grid", label: "Grid", icon: LayoutGrid },
  { value: "table", label: "Table", icon: Table2 },
  { value: "list", label: "List", icon: List },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "name-az", label: "Name A-Z" },
  { value: "name-za", label: "Name Z-A" },
  { value: "department", label: "Department" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "tenure", label: "Tenure" },
];

const GROUP_OPTIONS: { value: GroupBy; label: string }[] = [
  { value: "none", label: "None" },
  { value: "department", label: "Department" },
  { value: "location", label: "Location" },
  { value: "status", label: "Status" },
];

function sortLabel(value: string): string {
  return SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Name A-Z";
}

function groupLabel(value: GroupBy): string {
  return GROUP_OPTIONS.find((o) => o.value === value)?.label ?? "None";
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

/* ── Checkbox row ── */

function CheckboxRow({
  label,
  checked,
  onChange,
  prefix,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  prefix?: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-foreground hover:bg-secondary cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-3.5 rounded border-border accent-brand"
      />
      {prefix}
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

export function PeopleToolbar({
  directoryView,
  onDirectoryViewChange,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  groupBy,
  onGroupByChange,
  totalCount,
  filteredCount,
}: PeopleToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) =>
    setOpenDropdown((prev) => (prev === name ? null : name));
  const closeDropdown = () => setOpenDropdown(null);

  /* ── Filter mutation helpers ── */

  const toggleArrayFilter = (
    key: "departments" | "locations" | "statuses" | "levels",
    value: string,
    checked: boolean
  ) => {
    const current = filters[key];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFiltersChange({ ...filters, [key]: updated });
  };

  const removeArrayFilter = (
    key: "departments" | "locations" | "statuses" | "levels",
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
      locations: [],
      statuses: [],
      levels: [],
      managers: [],
    });
  };

  const hasActiveFilters =
    filters.departments.length > 0 ||
    filters.locations.length > 0 ||
    filters.statuses.length > 0 ||
    filters.levels.length > 0;

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
              placeholder="Search people..."
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="h-8 w-60 rounded-full bg-background border border-border pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-brand"
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
              <Filter className="size-3" />
              {filters.departments.length > 0
                ? `Dept (${filters.departments.length})`
                : "Department"}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "departments"}
              onClose={closeDropdown}
            >
              {DEPARTMENTS.map((dept) => (
                <CheckboxRow
                  key={dept.id}
                  label={`${dept.name} (${dept.count})`}
                  checked={filters.departments.includes(dept.name)}
                  onChange={(checked) =>
                    toggleArrayFilter("departments", dept.name, checked)
                  }
                  prefix={
                    <span
                      className={`size-2 rounded-full ${dept.colorClass} shrink-0`}
                    />
                  }
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
              {ALL_LOCATIONS.map((loc) => (
                <CheckboxRow
                  key={loc}
                  label={loc}
                  checked={filters.locations.includes(loc)}
                  onChange={(checked) =>
                    toggleArrayFilter("locations", loc, checked)
                  }
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
              {ALL_STATUSES.map((status) => {
                const config = STATUS_CONFIG[status];
                return (
                  <CheckboxRow
                    key={status}
                    label={config?.label ?? status}
                    checked={filters.statuses.includes(status)}
                    onChange={(checked) =>
                      toggleArrayFilter("statuses", status, checked)
                    }
                    prefix={
                      <span
                        className={`size-2 rounded-full ${config?.dotClass ?? "bg-muted-foreground"} shrink-0`}
                      />
                    }
                  />
                );
              })}
            </Dropdown>
          </div>

          {/* Level filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => toggleDropdown("levels")}
            >
              {filters.levels.length > 0
                ? `Level (${filters.levels.length})`
                : "Level"}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "levels"}
              onClose={closeDropdown}
            >
              {ALL_LEVELS_UNIQUE.map((level) => (
                <CheckboxRow
                  key={level}
                  label={level}
                  checked={filters.levels.includes(level)}
                  onChange={(checked) =>
                    toggleArrayFilter("levels", level, checked)
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
            <Dropdown open={openDropdown === "sort"} onClose={closeDropdown}>
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

          {/* Group By */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => toggleDropdown("groupBy")}
            >
              <Layers className="size-3" />
              Group: {groupLabel(groupBy)}
              <ChevronDown className="size-3" />
            </Button>
            <Dropdown
              open={openDropdown === "groupBy"}
              onClose={closeDropdown}
            >
              {GROUP_OPTIONS.map((opt) => (
                <RadioRow
                  key={opt.value}
                  label={opt.label}
                  selected={groupBy === opt.value}
                  onSelect={() => {
                    onGroupByChange(opt.value);
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
            const isActive = directoryView === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onDirectoryViewChange(opt.value)}
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
              label={`Dept: ${d}`}
              onRemove={() => removeArrayFilter("departments", d)}
            />
          ))}
          {filters.locations.map((l) => (
            <Chip
              key={`loc-${l}`}
              label={`Location: ${l}`}
              onRemove={() => removeArrayFilter("locations", l)}
            />
          ))}
          {filters.statuses.map((s) => (
            <Chip
              key={`status-${s}`}
              label={`Status: ${STATUS_CONFIG[s]?.label ?? s}`}
              onRemove={() => removeArrayFilter("statuses", s)}
            />
          ))}
          {filters.levels.map((l) => (
            <Chip
              key={`level-${l}`}
              label={`Level: ${l}`}
              onRemove={() => removeArrayFilter("levels", l)}
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
