"use client";

import { Download, FileText } from "lucide-react";
import { type LeaveAttachment } from "@/components/leave/data";

export function AttachmentsList({
  attachments,
  onDownload,
}: {
  attachments: LeaveAttachment[];
  onDownload?: (a: LeaveAttachment) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">Attachments</h3>
      {attachments.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No documents attached to this request.</p>
      ) : (
        <ul className="space-y-2">
          {attachments.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 p-2.5 bg-surface-overlay/40 border border-border rounded-lg"
            >
              <div className="size-9 shrink-0 rounded-md bg-brand/10 flex items-center justify-center">
                <FileText className="size-4 text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{a.filename}</p>
                <p className="text-[10px] text-muted-foreground">
                  {a.sizeKB} KB · Uploaded {new Date(a.uploadedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <button
                onClick={() => onDownload?.(a)}
                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                aria-label="Download"
              >
                <Download className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
