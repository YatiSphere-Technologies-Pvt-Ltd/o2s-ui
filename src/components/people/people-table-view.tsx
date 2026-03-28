"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  ArrowUpDown,
  Users,
  Mail,
  Download,
  UserCog,
  X,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  type Employee,
  DEPT_MAP,
  STATUS_CONFIG,
  avatarColorClass,
} from "@/components/people/data";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PeopleTableViewProps {
  employees: Employee[];
  onSelectEmployee: (e: Employee) => void;
}

/* ------------------------------------------------------------------ */
/*  Column header                                                      */
/* ------------------------------------------------------------------ */

function SortableHeader({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown className="size-3" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <Users className="size-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">No employees found</p>
      <p className="text-xs text-muted-foreground mt-1">
        Try adjusting your filters or search query.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function PeopleTableView({
  employees,
  onSelectEmployee,
}: PeopleTableViewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected =
    employees.length > 0 && selectedIds.size === employees.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(employees.map((e) => e.id)));
    }
  }, [allSelected, employees]);

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  /* Parse tenure years for bold styling */
  const tenureYears = useCallback((tenure: string) => {
    const yMatch = tenure.match(/(\d+)y/);
    return yMatch ? parseInt(yMatch[1], 10) : 0;
  }, []);

  if (employees.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-10 px-3 py-3 text-left">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={toggleAll}
                />
              </th>
              <th className="px-3 py-3 text-left">
                <SortableHeader label="Employee" />
              </th>
              <th className="px-3 py-3 text-left">
                <SortableHeader label="Role" />
              </th>
              <th className="px-3 py-3 text-left">
                <SortableHeader label="Department" />
              </th>
              <th className="px-3 py-3 text-left">
                <SortableHeader label="Location" />
              </th>
              <th className="px-3 py-3 text-left">
                <SortableHeader label="Manager" />
              </th>
              <th className="px-3 py-3 text-left">
                <SortableHeader label="Status" />
              </th>
              <th className="px-3 py-3 text-left">
                <SortableHeader label="Tenure" />
              </th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => {
              const dept = DEPT_MAP[emp.department];
              const statusCfg = STATUS_CONFIG[emp.status];
              const isSelected = selectedIds.has(emp.id);
              const years = tenureYears(emp.tenure);

              return (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  onClick={() => onSelectEmployee(emp)}
                  className={`border-b border-border cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-muted/60"
                      : "hover:bg-muted/40"
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-3 py-2.5">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleOne(emp.id)}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                  </td>

                  {/* Employee */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ${avatarColorClass(emp.name)}`}
                      >
                        {emp.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {emp.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-3 py-2.5 text-sm text-muted-foreground max-w-[180px] truncate">
                    {emp.role}
                  </td>

                  {/* Department */}
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${dept?.colorClass ?? "bg-muted-foreground"}`}
                      />
                      {emp.department}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3 shrink-0" />
                      {emp.location}
                    </span>
                  </td>

                  {/* Manager */}
                  <td className="px-3 py-2.5 text-sm text-muted-foreground">
                    {emp.manager ?? "\u2014"}
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${statusCfg.dotClass} ${emp.status === "onboarding" ? "animate-pulse" : ""}`}
                      />
                      <span className={statusCfg.colorClass}>
                        {statusCfg.abbr}
                      </span>
                    </span>
                  </td>

                  {/* Tenure */}
                  <td
                    className={`px-3 py-2.5 text-sm ${years >= 5 ? "font-bold text-foreground" : "text-muted-foreground"}`}
                  >
                    {emp.tenure}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2.5">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-foreground text-background rounded-xl px-5 py-3 shadow-lg"
          >
            <span className="text-sm font-medium">
              {selectedIds.size} selected
            </span>

            <div className="h-4 w-px bg-background/20" />

            <Button
              variant="ghost"
              size="sm"
              className="text-background hover:text-background hover:bg-background/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="size-3.5 mr-1.5" />
              Send Message
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-background hover:text-background hover:bg-background/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="size-3.5 mr-1.5" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-background hover:text-background hover:bg-background/10"
              onClick={(e) => e.stopPropagation()}
            >
              <UserCog className="size-3.5 mr-1.5" />
              Change Manager
            </Button>

            <div className="h-4 w-px bg-background/20" />

            <Button
              variant="ghost"
              size="icon-xs"
              className="text-background hover:text-background hover:bg-background/10"
              onClick={clearSelection}
            >
              <X className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
