"use client";

import { useState } from "react";
import { LayoutGrid, Table2, FileText, AlertTriangle, Copy, Clock, User, Building2, Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SUBMISSIONS,
  SUBMISSION_STATUS_CONFIG,
  matchScoreColor,
  type VendorSubmission,
} from "@/components/vendors/data";

type ViewMode = "cards" | "table";

const summaryItems = [
  { label: "Pending Review", count: SUBMISSIONS.filter((s) => s.status === "pending_review").length, colorClass: "text-warning", bgClass: "bg-warning/10" },
  { label: "Under Review", count: SUBMISSIONS.filter((s) => s.status === "under_review").length, colorClass: "text-brand", bgClass: "bg-brand/10" },
  { label: "Accepted", count: SUBMISSIONS.filter((s) => s.status === "accepted").length, colorClass: "text-success", bgClass: "bg-success/10" },
  { label: "Rejected", count: SUBMISSIONS.filter((s) => s.status === "rejected").length, colorClass: "text-destructive", bgClass: "bg-destructive/10" },
];

function SubmissionCard({ sub }: { sub: VendorSubmission }) {
  const status = SUBMISSION_STATUS_CONFIG[sub.status];

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      {/* Top row: ID + status + time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">{sub.id}</span>
          <span className="flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${status.dotClass}`} />
            <span className={`text-xs font-medium ${status.textClass}`}>{status.label}</span>
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {sub.submittedAt}
        </span>
      </div>

      {/* Candidate + requisition */}
      <div>
        <h3 className="font-semibold text-foreground">{sub.candidateName}</h3>
        <p className="text-sm text-muted-foreground">
          {sub.requisition} &middot; {sub.requisitionId} &middot; {sub.slotInfo}
        </p>
      </div>

      {/* Vendor */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Building2 className="size-3" />{sub.vendorName}</span>
        <span className="flex items-center gap-1"><User className="size-3" />{sub.submittedBy}</span>
      </div>

      {/* Candidate snapshot */}
      <div className="grid grid-cols-3 gap-3 py-3 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Experience</p>
          <p className="text-sm text-foreground">{sub.experience}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current Role</p>
          <p className="text-sm text-foreground">{sub.currentRole}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Company</p>
          <p className="text-sm text-foreground">{sub.currentCompany}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Expected CTC</p>
          <p className="text-sm text-foreground">{sub.expectedCtc}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Notice Period</p>
          <p className="text-sm text-foreground">{sub.noticePeriod}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Location</p>
          <p className="text-sm text-foreground flex items-center gap-1"><MapPin className="size-3" />{sub.location}</p>
        </div>
      </div>

      {/* AI Match Score + Duplicate */}
      <div className="flex items-center gap-3 py-3 border-t border-border">
        {sub.aiMatchScore !== null && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">AI Match:</span>
            <span className={`text-sm font-semibold ${matchScoreColor(sub.aiMatchScore)}`}>
              {sub.aiMatchScore}%
            </span>
          </div>
        )}
        {sub.isDuplicate && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
            <Copy className="size-3" />
            Duplicate
          </span>
        )}
      </div>

      {/* Vendor notes */}
      {sub.vendorNotes && (
        <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
          &ldquo;{sub.vendorNotes}&rdquo;
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <Button variant="outline" size="sm">
          <FileText className="size-3.5 mr-1" />
          View Resume
        </Button>
        <Button size="sm" className="bg-success text-white hover:bg-success/90">
          Accept &rarr; Pipeline
        </Button>
        <Button variant="outline" size="sm" className="text-destructive">
          Reject
        </Button>
        <Button variant="ghost" size="sm">Hold</Button>
        <Button variant="ghost" size="sm">Request Info</Button>
      </div>
    </div>
  );
}

function SubmissionTable() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">SUB ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Candidate</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vendor</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Requisition</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Slot</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">AI Score</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Submitted</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {SUBMISSIONS.map((s) => {
              const status = SUBMISSION_STATUS_CONFIG[s.status];
              return (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{s.candidateName}</span>
                    {s.isDuplicate && (
                      <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] text-destructive">
                        <Copy className="size-2.5" />DUP
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.vendorName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.requisition}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{s.slotInfo}</td>
                  <td className="px-4 py-3">
                    {s.aiMatchScore !== null ? (
                      <span className={`font-semibold ${matchScoreColor(s.aiMatchScore)}`}>{s.aiMatchScore}%</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full ${status.dotClass}`} />
                      <span className={`text-xs ${status.textClass}`}>{status.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{s.submittedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="xs">Resume</Button>
                      <Button variant="ghost" size="xs" className="text-success">Accept</Button>
                      <Button variant="ghost" size="xs" className="text-destructive">Reject</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SubmissionsTab() {
  const [view, setView] = useState<ViewMode>("cards");

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-3">
        {summaryItems.map((item) => (
          <div key={item.label} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${item.bgClass}`}>
            <span className={`text-lg font-semibold ${item.colorClass}`}>{item.count}</span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-end gap-1">
        <Button
          variant={view === "cards" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => setView("cards")}
        >
          <LayoutGrid className="size-4" />
        </Button>
        <Button
          variant={view === "table" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => setView("table")}
        >
          <Table2 className="size-4" />
        </Button>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {SUBMISSIONS.map((sub) => (
            <SubmissionCard key={sub.id} sub={sub} />
          ))}
        </div>
      ) : (
        <SubmissionTable />
      )}
    </div>
  );
}
