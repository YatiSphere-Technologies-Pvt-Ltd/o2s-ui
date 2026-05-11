"use client";

import { useState } from "react";
import { Download, Eye, EyeOff, FileText, Lock } from "lucide-react";
import { Drawer } from "@/components/leave/drawer";
import type { LeaveAttachment } from "@/components/leave/data";

interface Props {
  open: boolean;
  attachment: LeaveAttachment | null;
  /** When true, the doc carries medical info — redaction toggle becomes available. */
  containsMedical?: boolean;
  /** Receives any reveal/redaction action for audit. */
  onAuditEvent?: (kind: "revealed" | "hidden" | "downloaded") => void;
  onClose: () => void;
}

export function DocumentViewerDrawer({
  open,
  attachment,
  containsMedical = false,
  onAuditEvent,
  onClose,
}: Props) {
  // Medical info is masked by default
  const [revealed, setRevealed] = useState(false);

  function toggleReveal() {
    setRevealed((prev) => {
      const next = !prev;
      onAuditEvent?.(next ? "revealed" : "hidden");
      return next;
    });
  }

  function download() {
    onAuditEvent?.("downloaded");
  }

  if (!attachment) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Document"
      subtitle={containsMedical ? "Contains medical information — handle carefully." : undefined}
      width="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
            Close
          </button>
          <button
            onClick={download}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download className="size-3.5" />
            Download
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* File header */}
        <div className="flex items-center gap-3 p-3 bg-surface-overlay/40 border border-border rounded-lg">
          <div className="size-9 rounded-md bg-brand/10 flex items-center justify-center shrink-0">
            <FileText className="size-4 text-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{attachment.filename}</p>
            <p className="text-[10px] text-muted-foreground">
              {attachment.sizeKB} KB · {attachment.mime} · uploaded{" "}
              {new Date(attachment.uploadedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Document body */}
        <div className="border border-border rounded-lg bg-card p-5">
          {/* Always-visible header (doctor name, dates, etc.) */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Issued by</p>
                <p className="text-foreground">Dr. Anil Kumar · MBBS, MD</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Issued on</p>
                <p className="text-foreground">14 Oct 2025</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Patient</p>
                <p className="text-foreground">Priya Singh</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Rest advised</p>
                <p className="text-foreground">14 – 16 Oct 2025 (3 days)</p>
              </div>
            </div>
          </div>

          {/* Medical-detail section — masked by default */}
          {containsMedical && (
            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold flex items-center gap-1.5">
                  <Lock className="size-3" />
                  Medical detail
                </p>
                <button
                  onClick={toggleReveal}
                  className="inline-flex items-center gap-1.5 text-[11px] text-brand hover:underline"
                >
                  {revealed ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                  {revealed ? "Hide" : "Reveal"}
                </button>
              </div>

              {revealed ? (
                <div className="text-xs text-foreground leading-relaxed space-y-2">
                  <p><span className="font-medium">Diagnosis:</span> Viral fever (suspected dengue); blood test confirmed NS1 positive on 14 Oct.</p>
                  <p><span className="font-medium">Treatment:</span> Symptomatic management. Paracetamol 500mg q6h prn. Hydration. Avoid NSAIDs.</p>
                  <p><span className="font-medium">Notes:</span> Patient to be on complete rest until platelets recover above 1.5 lakh. Follow-up CBC after 72h.</p>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-secondary/40 border border-dashed border-border text-center">
                  <p className="text-[11px] text-muted-foreground italic">
                    Medical detail hidden by default. Reveal logs an audit entry — HR will see who viewed and when.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground/60">
          Access to this document is recorded under the employee&apos;s consent settings (Profile → Privacy &amp; Consent).
        </p>
      </div>
    </Drawer>
  );
}
