"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { type Vendor, ASSIGNMENTS } from "@/components/vendors/data";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type AutoSourcePanelProps = {
  vendor: Vendor | null;
  open: boolean;
  onClose: () => void;
};

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const OPEN_REQUISITIONS = [
  { id: "REQ-2026-001", title: "Sr Frontend Engineer", slots: ["Slot 1: Pune", "Slot 2: Kopa", "Slot 3: Remote"] },
  { id: "REQ-2026-002", title: "Backend Engineer", slots: ["Slot 1: Bangalore", "Slot 2: Pune", "Slot 3: Remote"] },
  { id: "REQ-2026-004", title: "VP Engineering", slots: ["Slot 1: Bangalore"] },
  { id: "REQ-2026-014", title: "Data Engineer", slots: ["Slot 1: Remote", "Slot 2: Hyderabad"] },
  { id: "REQ-2026-018", title: "Product Manager", slots: ["Slot 1: Mumbai", "Slot 2: Remote"] },
];

const REQ_DETAILS: Record<string, { skills: string; experience: string; location: string; compensation: string }> = {
  "REQ-2026-001": { skills: "React, TypeScript, Next.js, Tailwind CSS", experience: "5-8 years", location: "Pune / Kopa / Remote", compensation: "35-50 LPA" },
  "REQ-2026-002": { skills: "Node.js, Python, PostgreSQL, AWS", experience: "4-7 years", location: "Bangalore / Pune / Remote", compensation: "30-45 LPA" },
  "REQ-2026-004": { skills: "Engineering Leadership, Strategy, Team Building", experience: "12-18 years", location: "Bangalore", compensation: "75-100 LPA" },
  "REQ-2026-014": { skills: "Python, Spark, Airflow, AWS/GCP", experience: "3-6 years", location: "Remote / Hyderabad", compensation: "25-40 LPA" },
  "REQ-2026-018": { skills: "Product Strategy, Analytics, Roadmapping", experience: "5-9 years", location: "Mumbai / Remote", compensation: "35-55 LPA" },
};

const overlayTransition = { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const };
const modalTransition = { type: "spring" as const, damping: 25, stiffness: 300 };

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export function AutoSourcePanel({ vendor, open, onClose }: AutoSourcePanelProps) {
  const [selectedReq, setSelectedReq] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [targetCandidates, setTargetCandidates] = useState("5");
  const [deadline, setDeadline] = useState("");
  const [aiPreScreen, setAiPreScreen] = useState(true);
  const [autoRejectThreshold, setAutoRejectThreshold] = useState("40");
  const [notifyOnSubmission, setNotifyOnSubmission] = useState(true);
  const [shareJd, setShareJd] = useState(true);
  const [shareRequirements, setShareRequirements] = useState(true);
  const [shareCompensation, setShareCompensation] = useState(false);
  const [shareTeamInfo, setShareTeamInfo] = useState(false);
  const [sent, setSent] = useState(false);

  const selectedReqData = OPEN_REQUISITIONS.find((r) => r.id === selectedReq);
  const reqDetails = selectedReq ? REQ_DETAILS[selectedReq] : null;

  const selectClass =
    "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  const handleSend = () => {
    setSent(true);
  };

  const handleClose = () => {
    setSent(false);
    setSelectedReq("");
    setSelectedSlot("");
    setAdditionalNotes("");
    setTargetCandidates("5");
    setDeadline("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && vendor && (
        <>
          {/* Overlay */}
          <motion.div
            key="auto-source-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              key="auto-source-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={modalTransition}
              className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-brand-purple/10">
                    <Sparkles className="size-4 text-brand-purple" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">Request Candidates</h2>
                    <p className="text-xs text-muted-foreground">from {vendor.companyName}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
                      className="flex flex-col items-center justify-center py-12 space-y-4"
                    >
                      <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
                        <Check className="size-8 text-success" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">Request Sent</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-xs">
                        Request sent to {vendor.companyName}. They will receive an email with the requirements.
                      </p>
                      <Button variant="outline" size="sm" className="flex items-center gap-1.5 mt-2">
                        <ExternalLink className="size-3.5" />
                        View Assignment
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      {/* Select Requisition */}
                      <div>
                        <Label>Select Requisition</Label>
                        <select
                          value={selectedReq}
                          onChange={(e) => {
                            setSelectedReq(e.target.value);
                            setSelectedSlot("");
                          }}
                          className={`mt-1 ${selectClass}`}
                        >
                          <option value="">Choose a requisition...</option>
                          {OPEN_REQUISITIONS.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.id} — {r.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Select Slot */}
                      {selectedReqData && (
                        <div>
                          <Label>Select Position Slot</Label>
                          <select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            className={`mt-1 ${selectClass}`}
                          >
                            <option value="">Choose a slot...</option>
                            {selectedReqData.slots.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Requirements Summary */}
                      {reqDetails && (
                        <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Requirements Summary</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Skills: </span>
                              <span className="text-foreground">{reqDetails.skills}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Experience: </span>
                              <span className="text-foreground">{reqDetails.experience}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location: </span>
                              <span className="text-foreground">{reqDetails.location}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Compensation: </span>
                              <span className="text-foreground">{reqDetails.compensation}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Instructions */}
                      <div>
                        <Label>Additional Instructions</Label>
                        <Textarea
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          placeholder="Any vendor-specific notes or requirements..."
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Target Candidates</Label>
                          <Input
                            type="number"
                            value={targetCandidates}
                            onChange={(e) => setTargetCandidates(e.target.value)}
                            min={1}
                            max={50}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Deadline</Label>
                          <Input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Screening Preferences */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Screening Preferences</h4>

                        <div className="flex items-center justify-between">
                          <Label>AI pre-screen submissions</Label>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={aiPreScreen}
                            onClick={() => setAiPreScreen(!aiPreScreen)}
                            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${aiPreScreen ? "bg-brand-purple" : "bg-secondary"}`}
                          >
                            <span className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${aiPreScreen ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                        </div>

                        {aiPreScreen && (
                          <div className="flex items-center justify-between">
                            <Label>Auto-reject below score</Label>
                            <Input
                              type="number"
                              value={autoRejectThreshold}
                              onChange={(e) => setAutoRejectThreshold(e.target.value)}
                              min={0}
                              max={100}
                              className="w-20"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <Label>Notify me on each submission</Label>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={notifyOnSubmission}
                            onClick={() => setNotifyOnSubmission(!notifyOnSubmission)}
                            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${notifyOnSubmission ? "bg-brand-purple" : "bg-secondary"}`}
                          >
                            <span className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${notifyOnSubmission ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                        </div>
                      </div>

                      <Separator />

                      {/* Share with Vendor */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Share with Vendor</h4>
                        <div className="space-y-2">
                          {[
                            { label: "Job description", checked: shareJd, toggle: () => setShareJd(!shareJd) },
                            { label: "Requirements", checked: shareRequirements, toggle: () => setShareRequirements(!shareRequirements) },
                            { label: "Compensation range", checked: shareCompensation, toggle: () => setShareCompensation(!shareCompensation) },
                            { label: "Team info", checked: shareTeamInfo, toggle: () => setShareTeamInfo(!shareTeamInfo) },
                          ].map((item) => (
                            <label key={item.label} className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={item.toggle}
                                className="size-4 rounded border-input accent-brand-purple"
                              />
                              {item.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {!sent && (
                <div className="shrink-0 border-t border-border px-5 py-3 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-brand-purple text-white hover:bg-brand-purple/90"
                    size="sm"
                    onClick={handleSend}
                    disabled={!selectedReq}
                  >
                    <Sparkles className="size-3.5 mr-1" />
                    Send Request to Vendor
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
