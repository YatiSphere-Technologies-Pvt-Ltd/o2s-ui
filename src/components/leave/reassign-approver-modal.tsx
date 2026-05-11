"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserCog, X } from "lucide-react";
import { DELEGATE_CANDIDATES, type OrgRequest } from "@/components/leave/data";

interface Props {
  request: OrgRequest | null;
  onClose: () => void;
  onSubmit: (newApproverName: string, newApproverInitials: string, note: string) => void;
}

export function ReassignApproverModal({ request, onClose, onSubmit }: Props) {
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  function submit() {
    if (!pickedId || !request) return;
    const peer = DELEGATE_CANDIDATES.find((c) => c.id === pickedId);
    if (!peer) return;
    onSubmit(peer.name, peer.initials, note);
    setPickedId(null);
    setNote("");
  }

  return (
    <AnimatePresence>
      {request && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full pointer-events-auto p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="size-9 shrink-0 rounded-full bg-brand/10 flex items-center justify-center">
                  <UserCog className="size-5 text-brand" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    Reassign approver for {request.employeeName}&apos;s request
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Currently routed to <span className="text-foreground font-medium">{request.approverName}</span>.
                    The new approver will see this request in their queue and be notified.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>

              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
                New approver
              </label>
              <div className="space-y-1.5 mb-4 max-h-64 overflow-y-auto scrollbar-thin">
                {DELEGATE_CANDIDATES.map((c) => {
                  const selected = pickedId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setPickedId(c.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-colors ${
                        selected
                          ? "border-brand bg-brand/5"
                          : "border-border bg-surface-overlay/40 hover:bg-surface-overlay"
                      }`}
                    >
                      <div className={`size-8 rounded-full ${c.avatarColor} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                        {c.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{c.role}</p>
                      </div>
                      <span
                        className={`size-3.5 rounded-full border-2 shrink-0 ${
                          selected ? "border-brand bg-brand" : "border-border"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
                Reason (optional, captured in audit trail)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="e.g. Original approver is out for the next two weeks."
                className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 resize-none"
              />

              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={onClose}
                  className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submit}
                  disabled={!pickedId}
                  className="h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  Reassign
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
