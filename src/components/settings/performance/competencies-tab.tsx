"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ROLE_FAMILIES,
  COMPETENCY_LIBRARY,
  BENCHMARK_MATRIX,
  LEVEL_TITLES,
} from "@/components/settings/performance/data";

type SubView = "families" | "library" | "matrix";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const SUB_VIEWS: { key: SubView; label: string }[] = [
  { key: "families", label: "Role Families" },
  { key: "library", label: "Competency Library" },
  { key: "matrix", label: "Leveling Matrix" },
];

const IC_LEVELS = ["IC1", "IC2", "IC3", "IC4", "IC5", "IC6"];
const COMPETENCY_NAMES = Object.keys(BENCHMARK_MATRIX);

function RoleFamiliesView() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ROLE_FAMILIES.map((rf, i) => (
        <motion.div
          key={rf.id}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{rf.name}</span>
          </div>

          <p className="text-xs text-muted-foreground mt-1.5">
            {rf.levels.join(" → ")}
          </p>

          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span>{rf.competencies.length} competencies</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {rf.employeeCount} employees
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border">
            <Button variant="ghost" size="xs">
              <Pencil className="size-3" />
              Edit
            </Button>
            <Button variant="ghost" size="icon-xs" className="ml-auto">
              <MoreHorizontal className="size-3.5" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function CompetencyLibraryView() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Used By</th>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Category</th>
          </tr>
        </thead>
        <tbody>
          {COMPETENCY_LIBRARY.map((comp, i) => (
            <motion.tr
              key={comp.name}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              className="border-b border-border last:border-0 hover:bg-surface-overlay transition-colors"
            >
              <td className="px-4 py-3 font-medium text-foreground">{comp.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{comp.usedBy}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${comp.categoryColorClass}`}
                >
                  {comp.category}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LevelingMatrixView() {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5 overflow-x-auto">
        <p className="text-sm font-semibold text-foreground mb-4">
          Engineering IC — Benchmark Matrix
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-3 py-2 text-xs font-medium text-muted-foreground min-w-[160px]">
                Competency
              </th>
              {IC_LEVELS.map((level) => (
                <th
                  key={level}
                  className="px-3 py-2 text-xs font-medium text-muted-foreground text-center min-w-[80px]"
                >
                  <div>{level}</div>
                  <div className="text-[10px] font-normal text-muted-foreground/70 mt-0.5">
                    {LEVEL_TITLES[level]}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPETENCY_NAMES.map((comp, i) => (
              <motion.tr
                key={comp}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className="border-b border-border last:border-0"
              >
                <td className="px-3 py-2.5 font-medium text-foreground">{comp}</td>
                {IC_LEVELS.map((level) => (
                  <td key={level} className="px-3 py-2.5 text-center">
                    <span className="text-sm font-mono text-foreground">
                      {BENCHMARK_MATRIX[comp][level].toFixed(1)}
                    </span>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI validation notes */}
      <div className="space-y-1.5">
        <p className="text-xs text-success flex items-center gap-1.5">
          85% of IC2s meet benchmarks &#10003;
        </p>
        <p className="text-xs text-warning flex items-center gap-1.5">
          62% of IC3s meet Leadership benchmark &#9888;
        </p>
      </div>
    </div>
  );
}

export function CompetenciesTab() {
  const [subView, setSubView] = useState<SubView>("families");

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground max-w-xl">
        Manage role families, the shared competency library, and leveling benchmarks across your
        organization.
      </p>

      {/* Sub-view pills */}
      <div className="flex gap-1.5">
        {SUB_VIEWS.map((sv) => (
          <button
            key={sv.key}
            onClick={() => setSubView(sv.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              subView === sv.key
                ? "bg-brand text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {sv.label}
          </button>
        ))}
      </div>

      {/* Sub-view content */}
      {subView === "families" && (
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <Button size="sm">
              <Plus className="size-3.5" />
              New Family
            </Button>
          </div>
          <RoleFamiliesView />
        </div>
      )}
      {subView === "library" && <CompetencyLibraryView />}
      {subView === "matrix" && <LevelingMatrixView />}
    </div>
  );
}
