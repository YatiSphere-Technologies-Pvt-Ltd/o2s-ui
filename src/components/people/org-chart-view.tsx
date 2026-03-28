"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Sparkles, X, Expand, Shrink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type Employee,
  STATUS_CONFIG,
  avatarColorClass,
} from "@/components/people/data";

/* ── Tree Node Type ── */

interface TreeNode {
  employee: Employee;
  children: TreeNode[];
}

/* ── Build tree from flat list ── */

function buildTree(employees: Employee[]): TreeNode | null {
  const map = new Map<string, TreeNode>();
  let root: TreeNode | null = null;

  for (const emp of employees) {
    map.set(emp.id, { employee: emp, children: [] });
  }

  for (const emp of employees) {
    const node = map.get(emp.id)!;
    if (emp.managerId === null) {
      root = node;
    } else {
      const parent = map.get(emp.managerId);
      if (parent) {
        parent.children.push(node);
      }
    }
  }

  return root;
}

/* ── OrgNode Card ── */

interface OrgNodeProps {
  node: TreeNode;
  depth: number;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
  onSelectEmployee: (e: Employee) => void;
}

function OrgNode({ node, depth, expandedNodes, toggleNode, onSelectEmployee }: OrgNodeProps) {
  const { employee, children } = node;
  const isExpanded = expandedNodes.has(employee.id);
  const hasChildren = children.length > 0;
  const statusCfg = STATUS_CONFIG[employee.status];
  const isTopLevel = depth <= 1;

  return (
    <div className={isTopLevel ? "flex flex-col items-center" : "flex flex-col items-start"}>
      {/* Card */}
      <div
        className="bg-card border border-border rounded-lg p-3 min-w-[200px] text-left cursor-pointer hover:border-brand/30 transition select-none"
        onClick={() => onSelectEmployee(employee)}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`size-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 ${avatarColorClass(employee.name)}`}
          >
            {employee.initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground truncate">
                {employee.name}
              </span>
              <span className={`size-2 rounded-full shrink-0 ${statusCfg.dotClass}`} />
            </div>
            <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
            {hasChildren && (
              <p className="text-xs text-muted-foreground mt-0.5">
                <Users className="inline size-3 mr-0.5" />
                {employee.directReports} reports
              </p>
            )}
          </div>

          {/* Expand/collapse toggle */}
          {hasChildren && (
            <button
              className="p-1 rounded hover:bg-muted transition"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(employee.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="size-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="size-4 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {isTopLevel ? (
                /* Horizontal layout for top levels */
                <div className="flex flex-col items-center">
                  {/* Vertical connector from parent */}
                  <div className="w-0.5 h-6 bg-border" />
                  {/* Horizontal bar connecting children */}
                  {children.length > 1 && (
                    <div className="flex items-start">
                      <div
                        className="h-0.5 bg-border"
                        style={{
                          width: `${(children.length - 1) * 240}px`,
                        }}
                      />
                    </div>
                  )}
                  <div className="flex gap-4 items-start">
                    {children.map((child) => (
                      <div key={child.employee.id} className="flex flex-col items-center">
                        {/* Vertical connector to child */}
                        <div className="w-0.5 h-4 bg-border" />
                        <OrgNode
                          node={child}
                          depth={depth + 1}
                          expandedNodes={expandedNodes}
                          toggleNode={toggleNode}
                          onSelectEmployee={onSelectEmployee}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Vertical layout for deeper levels */
                <div className="ml-6 pl-4 border-l-2 border-border mt-1 space-y-1">
                  {children.map((child) => (
                    <div key={child.employee.id} className="relative">
                      {/* Horizontal connector */}
                      <div className="absolute -left-4 top-5 w-4 h-0.5 bg-border" />
                      <OrgNode
                        node={child}
                        depth={depth + 1}
                        expandedNodes={expandedNodes}
                        toggleNode={toggleNode}
                        onSelectEmployee={onSelectEmployee}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

/* ── Main OrgChartView ── */

interface OrgChartViewProps {
  employees: Employee[];
  onSelectEmployee: (e: Employee) => void;
}

export function OrgChartView({ employees, onSelectEmployee }: OrgChartViewProps) {
  const tree = useMemo(() => buildTree(employees), [employees]);

  // Collect all node IDs that have children
  const allParentIds = useMemo(() => {
    const ids = new Set<string>();
    function walk(emps: Employee[]) {
      for (const emp of emps) {
        const hasKids = emps.some((e) => e.managerId === emp.id);
        if (hasKids) ids.add(emp.id);
      }
    }
    walk(employees);
    return ids;
  }, [employees]);

  // Compute initial expanded set (2 levels)
  const getExpandedAtDepth = useCallback(
    (maxDepth: number) => {
      const ids = new Set<string>();
      if (!tree) return ids;
      function walk(node: TreeNode, d: number) {
        if (d < maxDepth && node.children.length > 0) {
          ids.add(node.employee.id);
          for (const child of node.children) walk(child, d + 1);
        }
      }
      walk(tree, 0);
      return ids;
    },
    [tree],
  );

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => getExpandedAtDepth(2));
  const [depthLevel, setDepthLevel] = useState<number>(2);
  const [insightDismissed, setInsightDismissed] = useState(false);

  const toggleNode = useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = () => {
    setExpandedNodes(new Set(allParentIds));
    setDepthLevel(-1);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set<string>());
    setDepthLevel(0);
  };

  const setDepth = (d: number) => {
    setDepthLevel(d);
    if (d === -1) {
      setExpandedNodes(new Set(allParentIds));
    } else {
      setExpandedNodes(getExpandedAtDepth(d));
    }
  };

  // Count managers with >7 direct reports
  const overloadedManagers = useMemo(
    () => employees.filter((e) => e.directReports > 7).length,
    [employees],
  );

  if (!tree) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No organizational data available
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Controls */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Button variant="outline" size="sm" onClick={expandAll}>
          <Expand className="size-3.5" data-icon="inline-start" />
          Expand All
        </Button>
        <Button variant="outline" size="sm" onClick={collapseAll}>
          <Shrink className="size-3.5" data-icon="inline-start" />
          Collapse All
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        {[2, 3, -1].map((d) => (
          <Button
            key={d}
            variant={depthLevel === d ? "default" : "outline"}
            size="sm"
            onClick={() => setDepth(d)}
          >
            {d === -1 ? "All levels" : `${d} levels`}
          </Button>
        ))}
      </div>

      {/* Tree */}
      <div className="overflow-x-auto pb-24 scrollbar-thin">
        <div className="inline-flex justify-center min-w-full py-4">
          <OrgNode
            node={tree}
            depth={0}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
            onSelectEmployee={onSelectEmployee}
          />
        </div>
      </div>

      {/* AI Insight Pill */}
      {!insightDismissed && overloadedManagers > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-card border border-brand-purple/20 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 ai-insight-glow">
            <Sparkles className="size-4 text-brand-purple" />
            <span className="text-sm text-foreground">
              {overloadedManagers} manager{overloadedManagers !== 1 ? "s" : ""} have &gt;7 direct
              reports &mdash; consider restructuring
            </span>
            <button
              onClick={() => setInsightDismissed(true)}
              className="p-0.5 rounded-full hover:bg-muted transition"
            >
              <X className="size-3.5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
