"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Users,
  Calendar,
  Layers,
  BarChart3,
  Sparkles,
  ChevronDown,
  CalendarPlus,
  StickyNote,
  UserCircle,
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

interface PeopleListViewProps {
  employees: Employee[];
  onSelectEmployee: (e: Employee) => void;
}

/* ------------------------------------------------------------------ */
/*  AI Pulse summary helper                                            */
/* ------------------------------------------------------------------ */

function aiPulseSummary(emp: Employee): string | null {
  if (!emp.aiScore) return null;
  const engagement =
    emp.aiScore.engagement >= 80
      ? "High engagement"
      : emp.aiScore.engagement >= 60
        ? "Moderate engagement"
        : "Low engagement";
  const risk =
    emp.aiScore.attritionRisk === "low"
      ? "low attrition risk"
      : emp.aiScore.attritionRisk === "medium"
        ? "medium attrition risk"
        : "high attrition risk";
  const trajectory =
    emp.aiScore.performanceTrajectory === "up"
      ? "upward trajectory"
      : emp.aiScore.performanceTrajectory === "down"
        ? "downward trajectory"
        : "stable trajectory";
  return `${engagement} (${emp.aiScore.engagement}%), ${risk} (${emp.aiScore.attritionProbability}%), ${trajectory}.`;
}

/* ------------------------------------------------------------------ */
/*  List Row                                                           */
/* ------------------------------------------------------------------ */

function ListRow({
  employee,
  index,
  isExpanded,
  onToggle,
  onSelectEmployee,
}: {
  employee: Employee;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectEmployee: (e: Employee) => void;
}) {
  const dept = DEPT_MAP[employee.department];
  const statusCfg = STATUS_CONFIG[employee.status];
  const pulse = aiPulseSummary(employee);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-sm"
    >
      {/* Collapsed row */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-4"
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${avatarColorClass(employee.name)}`}
          >
            {employee.initials}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${statusCfg.dotClass} ${employee.status === "onboarding" ? "animate-pulse" : ""}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Line 1: name, role, status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">
              {employee.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {employee.role}
            </span>
            <span className="inline-flex items-center gap-1 text-xs ml-auto shrink-0">
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass} ${employee.status === "onboarding" ? "animate-pulse" : ""}`}
              />
              <span className={statusCfg.colorClass}>{statusCfg.label}</span>
            </span>
          </div>

          {/* Line 2: dept, location, manager, tenure */}
          <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground flex-wrap">
            <span className="inline-flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${dept?.colorClass ?? "bg-muted-foreground"}`}
              />
              {employee.department}
            </span>
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="size-3" />
              {employee.location}
            </span>
            {employee.manager && (
              <span className="inline-flex items-center gap-0.5">
                <Users className="size-3" />
                {employee.manager}
              </span>
            )}
            <span>{employee.tenure}</span>
          </div>

          {/* Line 3: skills */}
          {employee.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {employee.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {employee.skills.length > 5 && (
                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full">
                  +{employee.skills.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`size-4 text-muted-foreground shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border">
              {/* Detail grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                <DetailItem
                  icon={<Mail className="size-3.5" />}
                  label="Email"
                  value={employee.email}
                />
                <DetailItem
                  icon={<Phone className="size-3.5" />}
                  label="Phone"
                  value={employee.phone}
                />
                <DetailItem
                  icon={<Users className="size-3.5" />}
                  label="Team"
                  value={employee.team}
                />
                <DetailItem
                  icon={<Layers className="size-3.5" />}
                  label="Level"
                  value={employee.level}
                />
                <DetailItem
                  icon={<Calendar className="size-3.5" />}
                  label="Start Date"
                  value={employee.startDate}
                />
                <DetailItem
                  icon={<BarChart3 className="size-3.5" />}
                  label="Direct Reports"
                  value={String(employee.directReports)}
                />
              </div>

              {/* AI Pulse */}
              {pulse && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border-l-4 border-brand-purple bg-brand-purple/5 px-4 py-3">
                  <Sparkles className="size-4 text-brand-purple shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-brand-purple mb-0.5">
                      AI Pulse
                    </p>
                    <p className="text-xs text-muted-foreground">{pulse}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEmployee(employee);
                  }}
                >
                  <UserCircle className="size-3.5 mr-1.5" />
                  View Full Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CalendarPlus className="size-3.5 mr-1.5" />
                  Schedule 1:1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <StickyNote className="size-3.5 mr-1.5" />
                  Add Note
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail item                                                        */
/* ------------------------------------------------------------------ */

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xs text-foreground truncate">{value}</p>
      </div>
    </div>
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

export function PeopleListView({
  employees,
  onSelectEmployee,
}: PeopleListViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = useCallback(
    (id: string) => setExpandedId((prev) => (prev === id ? null : id)),
    []
  );

  if (employees.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="p-6 space-y-3">
      {employees.map((emp, i) => (
        <ListRow
          key={emp.id}
          employee={emp}
          index={i}
          isExpanded={expandedId === emp.id}
          onToggle={() => toggle(emp.id)}
          onSelectEmployee={onSelectEmployee}
        />
      ))}
    </div>
  );
}
