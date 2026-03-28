"use client";

import { useMemo } from "react";
import { Plus, Pause, MessageSquare, Shield, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASSIGNMENTS, type VendorAssignment } from "@/components/vendors/data";

const ASSIGNMENT_STATUS_CONFIG: Record<string, { label: string; dotClass: string; textClass: string }> = {
  active:    { label: "Active",    dotClass: "bg-success",          textClass: "text-success" },
  paused:    { label: "Paused",    dotClass: "bg-warning",          textClass: "text-warning" },
  completed: { label: "Completed", dotClass: "bg-brand",            textClass: "text-brand" },
  cancelled: { label: "Cancelled", dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
};

interface ReqGroup {
  requisitionId: string;
  requisition: string;
  slots: Map<string, VendorAssignment[]>;
}

function VendorAssignmentCard({ assignment }: { assignment: VendorAssignment }) {
  const status = ASSIGNMENT_STATUS_CONFIG[assignment.status];

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{assignment.vendorName}</h4>
          <p className="text-xs text-muted-foreground">Fee: {assignment.feeRate}</p>
        </div>
        <div className="flex items-center gap-2">
          {assignment.exclusive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-purple/10 text-brand-purple">
              <Shield className="size-3" />
              Exclusive
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${status.dotClass}`} />
            <span className={`text-xs font-medium ${status.textClass}`}>{status.label}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          Assigned: {assignment.assignedAt}
        </span>
        {assignment.deadline && (
          <span className="flex items-center gap-1">
            <Target className="size-3" />
            Deadline: {assignment.deadline}
          </span>
        )}
      </div>

      {/* Submission stats */}
      <div className="grid grid-cols-4 gap-2 py-2 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Submitted</p>
          <p className="text-sm font-semibold text-foreground">{assignment.submitted}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Shortlisted</p>
          <p className="text-sm font-semibold text-foreground">{assignment.shortlisted}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Interviewed</p>
          <p className="text-sm font-semibold text-foreground">{assignment.interviewed}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Hired</p>
          <p className="text-sm font-semibold text-foreground">{assignment.hired}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button variant="outline" size="sm">View Submissions</Button>
        <Button variant="ghost" size="sm">
          <Pause className="size-3.5 mr-1" />
          Pause
        </Button>
        <Button variant="ghost" size="sm">
          <MessageSquare className="size-3.5 mr-1" />
          Message
        </Button>
      </div>
    </div>
  );
}

export function AssignmentsTab() {
  const reqGroups = useMemo(() => {
    const groupMap = new Map<string, ReqGroup>();

    for (const a of ASSIGNMENTS) {
      if (!groupMap.has(a.requisitionId)) {
        groupMap.set(a.requisitionId, {
          requisitionId: a.requisitionId,
          requisition: a.requisition,
          slots: new Map(),
        });
      }
      const group = groupMap.get(a.requisitionId)!;
      if (!group.slots.has(a.slotInfo)) {
        group.slots.set(a.slotInfo, []);
      }
      group.slots.get(a.slotInfo)!.push(a);
    }

    return Array.from(groupMap.values());
  }, []);

  return (
    <div className="space-y-6">
      {reqGroups.map((group) => (
        <div key={group.requisitionId} className="space-y-4">
          {/* Requisition header */}
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">{group.requisition}</h3>
            <span className="text-xs font-mono text-muted-foreground">{group.requisitionId}</span>
          </div>

          {/* Slots */}
          {Array.from(group.slots.entries()).map(([slotInfo, assignments]) => (
            <div key={slotInfo} className="pl-4 border-l-2 border-border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">{slotInfo}</h4>
                {assignments.length < 3 && (
                  <Button variant="outline" size="sm">
                    <Plus className="size-3.5 mr-1" />
                    Assign Vendor
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {assignments.map((a) => (
                  <VendorAssignmentCard key={a.id} assignment={a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
