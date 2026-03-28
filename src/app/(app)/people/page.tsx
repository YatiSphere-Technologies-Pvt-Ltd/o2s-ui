"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PeopleHeader } from "@/components/people/people-header";
import {
  PeopleToolbar,
  type DirectoryView,
  type GroupBy,
} from "@/components/people/people-toolbar";
import { PeopleGridView } from "@/components/people/people-grid-view";
import { PeopleTableView } from "@/components/people/people-table-view";
import { PeopleListView } from "@/components/people/people-list-view";
import { OrgChartView } from "@/components/people/org-chart-view";
import { AnalyticsView } from "@/components/people/analytics-view";
import { EmployeeSlideOver } from "@/components/people/employee-slide-over";
import {
  type Employee,
  type PeopleFilters,
  EMPLOYEES,
  EMPTY_FILTERS,
  filterEmployees,
  sortEmployees,
} from "@/components/people/data";

export default function PeoplePage() {
  const [primaryView, setPrimaryView] = useState<
    "directory" | "orgchart" | "analytics"
  >("directory");
  const [directoryView, setDirectoryView] = useState<DirectoryView>("grid");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [employees] = useState<Employee[]>(EMPLOYEES);
  const [filters, setFilters] = useState<PeopleFilters>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState("name-az");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");

  const filteredEmployees = useMemo(
    () => sortEmployees(filterEmployees(employees, filters), sortBy),
    [employees, filters, sortBy]
  );

  return (
    <div className="h-full flex flex-col">
      <PeopleHeader
        primaryView={primaryView}
        onPrimaryViewChange={setPrimaryView}
        totalCount={employees.length}
      />

      {primaryView === "directory" && (
        <>
          <PeopleToolbar
            directoryView={directoryView}
            onDirectoryViewChange={setDirectoryView}
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
            totalCount={employees.length}
            filteredCount={filteredEmployees.length}
          />
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {directoryView === "grid" && (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <PeopleGridView
                    employees={filteredEmployees}
                    groupBy={groupBy}
                    onSelectEmployee={setSelectedEmployee}
                  />
                </motion.div>
              )}
              {directoryView === "table" && (
                <motion.div
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <PeopleTableView
                    employees={filteredEmployees}
                    onSelectEmployee={setSelectedEmployee}
                  />
                </motion.div>
              )}
              {directoryView === "list" && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <PeopleListView
                    employees={filteredEmployees}
                    onSelectEmployee={setSelectedEmployee}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {primaryView === "orgchart" && (
        <OrgChartView
          employees={employees}
          onSelectEmployee={setSelectedEmployee}
        />
      )}

      {primaryView === "analytics" && <AnalyticsView />}

      <EmployeeSlideOver
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
}
