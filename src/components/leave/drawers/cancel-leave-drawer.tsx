"use client";

import { useState } from "react";
import { LEAVE_TYPE_MAP, type LeaveRequest } from "@/components/leave/data";
import { Drawer } from "@/components/leave/drawer";
import { ConfirmDialog } from "@/components/leave/confirm-dialog";

interface Props {
  open: boolean;
  request: LeaveRequest | null;
  onClose: () => void;
  onConfirmCancel: (reason: string) => void;
}

/**
 * Reusable drawer for cancelling / withdrawing a leave request.
 * Always two-step: drawer collects reason, ConfirmDialog asks user to commit.
 */
export function CancelLeaveDrawer({ open, request, onClose, onConfirmCancel }: Props) {
  const [reason, setReason] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!request) return null;
  const type = LEAVE_TYPE_MAP[request.type];
  const isApproved = request.status === "approved";

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title={isApproved ? "Withdraw this leave?" : "Cancel this request?"}
        subtitle={`${type.label} · ${request.startDate}${request.startDate === request.endDate ? "" : ` – ${request.endDate}`}`}
        width="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Keep
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="h-9 px-3 rounded-lg bg-destructive text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {isApproved ? "Withdraw" : "Cancel request"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg border border-border bg-surface-overlay/40">
            <p className="text-xs text-foreground">
              {isApproved
                ? "Your manager will be notified. Any balance held against this leave will be released."
                : "This withdraws the request from your approver. You can resubmit later."}
            </p>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Trip postponed."
              className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 resize-none"
            />
          </div>
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmOpen}
        variant="destructive"
        title={isApproved ? "Withdraw approved leave?" : "Cancel this request?"}
        body={
          isApproved
            ? "You can't reverse this without resubmitting. Your manager will be notified."
            : "You can resubmit the request later if plans change."
        }
        confirmLabel={isApproved ? "Withdraw" : "Cancel request"}
        onConfirm={() => {
          setConfirmOpen(false);
          onConfirmCancel(reason);
          onClose();
        }}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
