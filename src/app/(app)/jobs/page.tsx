"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { JobsHeader } from "@/components/jobs/jobs-header";
import { JobsToolbar, type JobsViewMode } from "@/components/jobs/jobs-toolbar";
import { JobsCardsView } from "@/components/jobs/jobs-cards-view";
import { JobsTableView } from "@/components/jobs/jobs-table-view";
import { JobsListView } from "@/components/jobs/jobs-list-view";
import { JobsDepartmentView } from "@/components/jobs/jobs-department-view";
import { JobsAnalyticsView } from "@/components/jobs/jobs-analytics-view";
import { JobSlideOver } from "@/components/jobs/job-slide-over";
import {
  type Job,
  type JobFilters,
  JOBS,
  JOB_COUNTS,
  EMPTY_FILTERS,
  filterJobs,
  sortJobs,
} from "@/components/jobs/data";

type PrimaryView = "alljobs" | "department" | "analytics";

export default function JobsPage() {
  const [primaryView, setPrimaryView] = useState<PrimaryView>("alljobs");
  const [jobsView, setJobsView] = useState<JobsViewMode>("cards");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs] = useState<Job[]>(JOBS);
  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState("newest");

  const filteredJobs = useMemo(() => {
    const filtered = filterJobs(jobs, filters);
    return sortJobs(filtered, sortBy);
  }, [jobs, filters, sortBy]);

  return (
    <div className="h-full flex flex-col">
      <JobsHeader
        primaryView={primaryView}
        onPrimaryViewChange={setPrimaryView}
        totalCounts={JOB_COUNTS}
      />

      {primaryView === "alljobs" && (
        <>
          <JobsToolbar
            jobsView={jobsView}
            onJobsViewChange={setJobsView}
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalCount={jobs.length}
            filteredCount={filteredJobs.length}
          />
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {jobsView === "cards" && (
                <motion.div
                  key="cards"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <JobsCardsView
                    jobs={filteredJobs}
                    onSelectJob={setSelectedJob}
                  />
                </motion.div>
              )}
              {jobsView === "table" && (
                <motion.div
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <JobsTableView
                    jobs={filteredJobs}
                    onSelectJob={setSelectedJob}
                  />
                </motion.div>
              )}
              {jobsView === "list" && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <JobsListView
                    jobs={filteredJobs}
                    onSelectJob={setSelectedJob}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {primaryView === "department" && (
        <div className="flex-1 overflow-hidden">
          <JobsDepartmentView jobs={filteredJobs} onSelectJob={setSelectedJob} />
        </div>
      )}

      {primaryView === "analytics" && (
        <div className="flex-1 overflow-hidden">
          <JobsAnalyticsView />
        </div>
      )}

      <JobSlideOver
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
