"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Mail,
  MessageCircle,
  MoreHorizontal,
  ChevronDown,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  type Employee,
  DEPT_MAP,
  STATUS_CONFIG,
  avatarColorClass,
} from "@/components/people/data";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PeopleGridViewProps {
  employees: Employee[];
  groupBy: string;
  onSelectEmployee: (e: Employee) => void;
}

/* ------------------------------------------------------------------ */
/*  Employee Card                                                      */
/* ------------------------------------------------------------------ */

function EmployeeCard({
  employee,
  index,
  onSelect,
}: {
  employee: Employee;
  index: number;
  onSelect: (e: Employee) => void;
}) {
  const dept = DEPT_MAP[employee.department];
  const statusCfg = STATUS_CONFIG[employee.status];

  const tenureIsNew = (() => {
    if (!employee.tenure.startsWith("0y")) return false;
    const mMatch = employee.tenure.match(/(\d+)m/);
    const months = mMatch ? parseInt(mMatch[1], 10) : 0;
    return months < 6;
  })();

  const visibleSkills = employee.skills.slice(0, 3);
  const overflowCount = employee.skills.length - 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      onClick={() => onSelect(employee)}
      className="bg-card border border-border rounded-xl p-5 text-center hover:-translate-y-0.5 transition-all cursor-pointer group"
    >
      {/* Avatar */}
      <div className="relative mx-auto mb-3 w-16 h-16">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-lg ${avatarColorClass(employee.name)}`}
        >
          {employee.initials}
        </div>
        {/* Status dot */}
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${statusCfg.dotClass} ${employee.status === "onboarding" ? "animate-pulse" : ""}`}
        />
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-foreground truncate">
        {employee.name}
      </p>

      {/* Role */}
      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 min-h-[2lh]">
        {employee.role}
      </p>

      {/* Info row: dept + location */}
      <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${dept?.colorClass ?? "bg-muted-foreground"}`}
          />
          {employee.department}
        </span>
        <span className="inline-flex items-center gap-0.5">
          <MapPin className="size-3" />
          {employee.location}
        </span>
      </div>

      {/* Manager */}
      {employee.manager && (
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Reports to: {employee.manager}
        </p>
      )}

      {/* Skills */}
      {employee.skills.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1 mt-2">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full"
            >
              {skill}
            </span>
          ))}
          {overflowCount > 0 && (
            <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full">
              +{overflowCount}
            </span>
          )}
        </div>
      )}

      {/* Tenure */}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <span className="text-[11px] text-muted-foreground">
          {employee.tenure}
        </span>
        {tenureIsNew && (
          <span className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded-full font-medium">
            New
          </span>
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center justify-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Mail className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MessageCircle className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Collapsible Group Section                                          */
/* ------------------------------------------------------------------ */

function GroupSection({
  groupName,
  employees,
  onSelectEmployee,
  startIndex,
}: {
  groupName: string;
  employees: Employee[];
  onSelectEmployee: (e: Employee) => void;
  startIndex: number;
}) {
  const [open, setOpen] = useState(true);
  const dept = DEPT_MAP[groupName];
  const dotClass = dept?.colorClass ?? "bg-muted-foreground";

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="sticky top-0 z-10 flex items-center gap-2 w-full bg-background/95 backdrop-blur-sm py-2 px-1 text-left"
      >
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotClass}`} />
        <span className="text-sm font-semibold text-foreground">
          {groupName}
        </span>
        <span className="text-xs text-muted-foreground">
          ({employees.length})
        </span>
        <ChevronDown
          className={`size-4 text-muted-foreground ml-auto transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
              {employees.map((emp, i) => (
                <EmployeeCard
                  key={emp.id}
                  employee={emp}
                  index={startIndex + i}
                  onSelect={onSelectEmployee}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
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

export function PeopleGridView({
  employees,
  groupBy,
  onSelectEmployee,
}: PeopleGridViewProps) {
  const groups = useMemo(() => {
    if (groupBy === "none" || !groupBy) return null;

    const map = new Map<string, Employee[]>();
    for (const emp of employees) {
      const key =
        groupBy === "department"
          ? emp.department
          : groupBy === "location"
            ? emp.location
            : groupBy === "status"
              ? (STATUS_CONFIG[emp.status]?.label ?? emp.status)
              : emp.department;
      const list = map.get(key) ?? [];
      list.push(emp);
      map.set(key, list);
    }

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [employees, groupBy]);

  if (employees.length === 0) {
    return <EmptyState />;
  }

  /* Flat grid (no grouping) */
  if (!groups) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
        {employees.map((emp, i) => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            index={i}
            onSelect={onSelectEmployee}
          />
        ))}
      </div>
    );
  }

  /* Grouped grid */
  let runningIndex = 0;
  return (
    <div className="p-6 space-y-2">
      {groups.map(([groupName, groupEmployees]) => {
        const start = runningIndex;
        runningIndex += groupEmployees.length;
        return (
          <GroupSection
            key={groupName}
            groupName={groupName}
            employees={groupEmployees}
            onSelectEmployee={onSelectEmployee}
            startIndex={start}
          />
        );
      })}
    </div>
  );
}
