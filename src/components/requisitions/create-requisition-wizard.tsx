"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Check,
  Sparkles,
  PenLine,
  Lightbulb,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DEPARTMENTS,
  LEVELS,
  HIRING_MANAGERS,
  RECRUITERS,
  LOCATIONS,
  APPROVERS,
  AI_JD_TEMPLATES,
  type ReqType,
  type ReqPriority,
} from "@/components/requisitions/data";

/* ── Types ── */

interface SlotData {
  id: string;
  location: string;
  workMode: "Onsite" | "Hybrid" | "Remote";
  recruiter: string;
  compensationOverride: string;
}

interface ApproverData {
  name: string;
  role: string;
  auto: boolean;
}

interface CreateRequisitionWizardProps {
  open: boolean;
  onClose: () => void;
}

/* ── Constants ── */

const STEP_LABELS = ["Basics", "Job Description", "Requirements", "Positions", "Review"];

const LEVEL_EXP_MAP: Record<string, number> = {
  IC1: 0, IC2: 1, IC3: 3, IC4: 5, IC5: 7, IC6: 10,
  M1: 5, M2: 7, M3: 10, M4: 12, M5: 15,
};

const REQ_TYPES: { value: ReqType; label: string }[] = [
  { value: "new_headcount", label: "New Headcount" },
  { value: "backfill", label: "Backfill" },
  { value: "contractor", label: "Contractor" },
  { value: "intern", label: "Intern" },
];

const PRIORITY_OPTIONS: { value: ReqPriority; label: string; colorClass: string }[] = [
  { value: "urgent", label: "Urgent", colorClass: "bg-destructive text-white" },
  { value: "high", label: "High", colorClass: "bg-warning text-white" },
  { value: "standard", label: "Standard", colorClass: "bg-brand-purple text-white" },
  { value: "low", label: "Low", colorClass: "bg-muted text-muted-foreground" },
];

const EDUCATION_OPTIONS = ["Any", "High School", "Bachelor's", "Master's", "PhD", "Bootcamp / Equivalent"];
const CURRENCY_OPTIONS = ["INR", "USD", "EUR", "GBP", "AED"];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const slideTransition = { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const };

const SLOT_BORDER_COLORS = ["border-l-brand", "border-l-brand-purple", "border-l-brand-teal", "border-l-warning"];

/* ── Helpers ── */

function computeJdScore(
  aboutRole: string,
  responsibilities: string[],
  requiredSkills: string[],
  preferredSkills: string[],
  qualifications: string,
): number {
  let score = 0;
  if (aboutRole.length > 100) score += 20;
  if (responsibilities.length >= 5) score += 30;
  if (requiredSkills.length >= 4) score += 20;
  if (preferredSkills.length >= 2) score += 15;
  if (qualifications.length > 50) score += 15;
  return score;
}

function jdSuggestions(
  aboutRole: string,
  responsibilities: string[],
  requiredSkills: string[],
  preferredSkills: string[],
  qualifications: string,
): string[] {
  const tips: string[] = [];
  if (responsibilities.length < 5) tips.push("Add 2+ more responsibilities for clarity");
  if (aboutRole.length <= 100) tips.push("Expand the 'About the Role' section for better context");
  if (requiredSkills.length < 4) tips.push("Include more required skills to attract the right candidates");
  if (preferredSkills.length < 2) tips.push("Add preferred skills to widen the candidate pool");
  if (qualifications.length <= 50) tips.push("Include compensation range to improve application rate");
  tips.push("Consider adding growth opportunities section");
  return tips.slice(0, 3);
}

/* ── Component ── */

export function CreateRequisitionWizard({ open, onClose }: CreateRequisitionWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [reqType, setReqType] = useState<ReqType>("new_headcount");
  const [priority, setPriority] = useState<ReqPriority>("standard");
  const [hiringManager, setHiringManager] = useState("");
  const [targetFillDate, setTargetFillDate] = useState("");
  const [numPositions, setNumPositions] = useState(1);

  // Step 2
  const [jdMode, setJdMode] = useState<"ai" | "manual">("ai");
  const [aboutRole, setAboutRole] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [preferredSkills, setPreferredSkills] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSteps, setAiSteps] = useState<number[]>([]);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [newRequiredSkill, setNewRequiredSkill] = useState("");
  const [newPreferredSkill, setNewPreferredSkill] = useState("");

  // Step 3
  const [minExperience, setMinExperience] = useState(0);
  const [education, setEducation] = useState("Any");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCert, setNewCert] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMid, setSalaryMid] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [equityEligible, setEquityEligible] = useState(false);
  const [bonusEligible, setBonusEligible] = useState(false);
  const [bonusTarget, setBonusTarget] = useState("");
  const [businessCase, setBusinessCase] = useState("");

  // Step 4
  const [slots, setSlots] = useState<SlotData[]>([]);

  // Step 5
  const [approvers, setApprovers] = useState<ApproverData[]>([]);
  const [autoCreateJob, setAutoCreateJob] = useState(true);
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedReqId, setSubmittedReqId] = useState("");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize slots when numPositions changes
  useEffect(() => {
    setSlots((prev) => {
      const newSlots: SlotData[] = [];
      for (let i = 0; i < numPositions; i++) {
        newSlots.push(
          prev[i] ?? { id: `slot-${Date.now()}-${i}`, location: "", workMode: "Hybrid" as const, recruiter: "", compensationOverride: "" },
        );
      }
      return newSlots;
    });
  }, [numPositions]);

  // Initialize approvers when hiringManager / department changes
  useEffect(() => {
    const chain: ApproverData[] = [];
    if (hiringManager) chain.push({ name: hiringManager, role: "Hiring Manager", auto: true });
    const deptApprovers = APPROVERS.filter((a) => a.name !== hiringManager).slice(0, 2);
    deptApprovers.forEach((a) => chain.push({ name: a.name, role: a.role, auto: true }));
    setApprovers(chain);
  }, [hiringManager, department]);

  // Update minExperience when level changes
  useEffect(() => {
    if (level && LEVEL_EXP_MAP[level] !== undefined) {
      setMinExperience(LEVEL_EXP_MAP[level]);
    }
  }, [level]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Step completion checks
  const step1Complete = jobTitle.trim() !== "" && department !== "" && level !== "";
  const step2Complete = aboutRole.trim() !== "" && responsibilities.filter((r) => r.trim()).length >= 3 && requiredSkills.length >= 3;
  const step3Complete = businessCase.trim() !== "" && salaryMin.trim() !== "";
  const step4Complete = slots.length > 0 && slots.every((s) => s.location !== "");

  const isStepComplete = (step: number): boolean => {
    if (step === 1) return step1Complete;
    if (step === 2) return step2Complete;
    if (step === 3) return step3Complete;
    if (step === 4) return step4Complete;
    return false;
  };

  const canProceed = isStepComplete(currentStep);

  const goNext = useCallback(() => {
    if (currentStep < 5) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleAiGenerate = useCallback(() => {
    setAiGenerating(true);
    setAiSteps([]);

    const steps = [0, 1, 2, 3];
    steps.forEach((i) => {
      setTimeout(() => {
        setAiSteps((prev) => [...prev, i]);
        if (i === 3) {
          setTimeout(() => {
            const templateKey = Object.keys(AI_JD_TEMPLATES).find(
              (k) => jobTitle.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(jobTitle.toLowerCase()),
            );
            const template = templateKey
              ? AI_JD_TEMPLATES[templateKey]
              : {
                  aboutRole: `We are looking for a ${jobTitle} to join our ${department || "team"}. This is an exciting opportunity to make a significant impact on our organization's growth and success.`,
                  responsibilities: [
                    "Define and drive strategy for the role's domain",
                    "Collaborate with cross-functional teams to deliver results",
                    "Mentor and support team members",
                    "Contribute to process improvements and best practices",
                    "Report on key metrics and outcomes",
                  ],
                  requiredSkills: ["Communication", "Problem Solving", "Collaboration", "Domain Expertise"],
                  preferredSkills: ["Leadership", "Strategic Thinking"],
                  qualifications: "Relevant degree or equivalent experience. Demonstrated track record of success in a similar role.",
                };
            setAboutRole(template.aboutRole);
            setResponsibilities([...template.responsibilities]);
            setRequiredSkills([...template.requiredSkills]);
            setPreferredSkills([...template.preferredSkills]);
            setQualifications(template.qualifications);
            setAiGenerated(true);
            setAiGenerating(false);
          }, 400);
        }
      }, (i + 1) * 500);
    });
  }, [jobTitle, department]);

  const handleSubmit = useCallback(() => {
    const reqId = `REQ-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    setSubmittedReqId(reqId);
    setSubmitted(true);
    timerRef.current = setTimeout(() => {
      setSubmitted(false);
      onClose();
      // Reset
      setCurrentStep(1);
      setJobTitle("");
      setDepartment("");
      setLevel("");
      setReqType("new_headcount");
      setPriority("standard");
      setHiringManager("");
      setTargetFillDate("");
      setNumPositions(1);
      setAboutRole("");
      setResponsibilities([]);
      setRequiredSkills([]);
      setPreferredSkills([]);
      setQualifications("");
      setAiGenerated(false);
      setJdMode("ai");
      setMinExperience(0);
      setEducation("Any");
      setCertifications([]);
      setSalaryMin("");
      setSalaryMid("");
      setSalaryMax("");
      setCurrency("INR");
      setEquityEligible(false);
      setBonusEligible(false);
      setBonusTarget("");
      setBusinessCase("");
      setSlots([]);
      setApprovers([]);
      setAutoCreateJob(true);
      setConfirmAccurate(false);
    }, 2000);
  }, [onClose]);

  const handleSaveDraft = useCallback(() => {
    onClose();
  }, [onClose]);

  const addResponsibility = useCallback(() => {
    setResponsibilities((prev) => [...prev, ""]);
  }, []);

  const updateResponsibility = useCallback((idx: number, val: string) => {
    setResponsibilities((prev) => prev.map((r, i) => (i === idx ? val : r)));
  }, []);

  const removeResponsibility = useCallback((idx: number) => {
    setResponsibilities((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const addSkill = useCallback((type: "required" | "preferred") => {
    if (type === "required" && newRequiredSkill.trim()) {
      setRequiredSkills((prev) => [...prev, newRequiredSkill.trim()]);
      setNewRequiredSkill("");
    } else if (type === "preferred" && newPreferredSkill.trim()) {
      setPreferredSkills((prev) => [...prev, newPreferredSkill.trim()]);
      setNewPreferredSkill("");
    }
  }, [newRequiredSkill, newPreferredSkill]);

  const removeSkill = useCallback((type: "required" | "preferred", idx: number) => {
    if (type === "required") setRequiredSkills((prev) => prev.filter((_, i) => i !== idx));
    else setPreferredSkills((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const addCert = useCallback(() => {
    if (newCert.trim()) {
      setCertifications((prev) => [...prev, newCert.trim()]);
      setNewCert("");
    }
  }, [newCert]);

  const removeCert = useCallback((idx: number) => {
    setCertifications((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const updateSlot = useCallback(<K extends keyof SlotData>(idx: number, field: K, val: SlotData[K]) => {
    setSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  }, []);

  const removeSlot = useCallback((idx: number) => {
    if (slots.length > 1) {
      setSlots((prev) => prev.filter((_, i) => i !== idx));
      setNumPositions((p) => Math.max(1, p - 1));
    }
  }, [slots.length]);

  const addSlot = useCallback(() => {
    setSlots((prev) => [
      ...prev,
      { id: `slot-${Date.now()}`, location: "", workMode: "Hybrid", recruiter: "", compensationOverride: "" },
    ]);
    setNumPositions((p) => p + 1);
  }, []);

  const addApprover = useCallback(() => {
    setApprovers((prev) => [...prev, { name: "", role: "", auto: false }]);
  }, []);

  const updateApprover = useCallback((idx: number, name: string) => {
    const found = APPROVERS.find((a) => a.name === name);
    setApprovers((prev) => prev.map((a, i) => (i === idx ? { ...a, name, role: found?.role ?? "", auto: false } : a)));
  }, []);

  const removeApprover = useCallback((idx: number) => {
    if (idx > 0) setApprovers((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  if (!open) return null;

  const jdScore = computeJdScore(aboutRole, responsibilities, requiredSkills, preferredSkills, qualifications);
  const hasJdContent = aboutRole.length > 0 || responsibilities.length > 0 || requiredSkills.length > 0;

  /* ── Label component ── */
  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{children}</label>
  );

  /* ── Tag input component ── */
  const TagInput = ({
    tags,
    onRemove,
    inputValue,
    onInputChange,
    onAdd,
    placeholder,
  }: {
    tags: string[];
    onRemove: (idx: number) => void;
    inputValue: string;
    onInputChange: (v: string) => void;
    onAdd: () => void;
    placeholder: string;
  }) => (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center gap-1 rounded-full bg-brand-purple/10 text-brand-purple px-2.5 py-0.5 text-xs font-medium"
          >
            {tag}
            <button type="button" onClick={() => onRemove(idx)} className="hover:text-destructive transition-colors">
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1 h-8 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
        />
        <Button type="button" onClick={onAdd} variant="secondary" size="sm">
          Add
        </Button>
      </div>
    </div>
  );

  /* ── Toggle switch ── */
  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-success" : "bg-secondary"
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  /* ── AI processing steps labels ── */
  const aiProcessingLabels = [
    "Analyzing role requirements...",
    "Generating responsibilities...",
    "Identifying required skills...",
    "Composing job description...",
  ];

  /* ── Render Steps ── */

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <FieldLabel>Job Title *</FieldLabel>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Senior Frontend Engineer"
          className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
        />
      </div>

      <div>
        <FieldLabel>Department *</FieldLabel>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
        >
          <option value="">Select department</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel>Level *</FieldLabel>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
        >
          <option value="">Select level</option>
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>{l.value} — {l.label.split(" — ")[1]}</option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel>Requisition Type</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {REQ_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setReqType(t.value)}
              className={`rounded-lg border p-3 text-center text-sm font-medium transition-colors ${
                reqType === t.value
                  ? "bg-brand-purple/10 border-brand-purple text-foreground"
                  : "bg-card border-border text-foreground hover:bg-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Priority</FieldLabel>
        <div className="flex gap-2">
          {PRIORITY_OPTIONS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                priority === p.value ? p.colorClass : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Hiring Manager</FieldLabel>
        <select
          value={hiringManager}
          onChange={(e) => setHiringManager(e.target.value)}
          className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
        >
          <option value="">Select hiring manager</option>
          {HIRING_MANAGERS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel>Target Fill Date</FieldLabel>
        <input
          type="date"
          value={targetFillDate}
          onChange={(e) => setTargetFillDate(e.target.value)}
          className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
        />
      </div>

      <div>
        <FieldLabel>Number of Positions</FieldLabel>
        <input
          type="number"
          min={1}
          max={10}
          value={numPositions}
          onChange={(e) => setNumPositions(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
          className="w-24 h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setJdMode("ai")}
          className={`flex flex-col items-center gap-1.5 rounded-lg border p-4 text-center transition-colors ${
            jdMode === "ai" ? "bg-brand-purple/10 border-brand-purple/30" : "bg-secondary border-border"
          }`}
        >
          <Sparkles className="size-5 text-brand-purple" />
          <span className="text-sm font-medium text-foreground">Generate with AI</span>
          <span className="text-xs text-muted-foreground">AI drafts a JD based on role details</span>
        </button>
        <button
          type="button"
          onClick={() => setJdMode("manual")}
          className={`flex flex-col items-center gap-1.5 rounded-lg border p-4 text-center transition-colors ${
            jdMode === "manual" ? "bg-brand-purple/10 border-brand-purple/30" : "bg-secondary border-border"
          }`}
        >
          <PenLine className="size-5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Write Manually</span>
          <span className="text-xs text-muted-foreground">Start from scratch</span>
        </button>
      </div>

      {/* AI Generate button */}
      {jdMode === "ai" && !aiGenerated && !aiGenerating && (
        <Button
          type="button"
          onClick={handleAiGenerate}
          className="w-full bg-brand-purple text-white hover:bg-brand-purple/90 gap-2"
        >
          <Sparkles className="size-4" />
          Generate JD for {jobTitle || "this role"}
        </Button>
      )}

      {/* AI generating animation */}
      {aiGenerating && (
        <div className="rounded-lg border border-brand-purple/20 bg-brand-purple/5 p-4 space-y-2">
          {aiProcessingLabels.map((label, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: aiSteps.includes(idx) ? 1 : 0.3, x: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="flex items-center gap-2 text-sm"
            >
              {aiSteps.includes(idx) ? (
                <Check className="size-4 text-success" />
              ) : (
                <div className="size-4 rounded-full border-2 border-muted-foreground/30 border-t-brand-purple animate-spin" />
              )}
              <span className={aiSteps.includes(idx) ? "text-foreground" : "text-muted-foreground"}>{label}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* JD Form */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FieldLabel>About the Role</FieldLabel>
            {aiGenerated && (
              <span className="text-[10px] font-semibold bg-brand-purple/10 text-brand-purple rounded-full px-2 py-0.5">AI Generated</span>
            )}
          </div>
          <textarea
            value={aboutRole}
            onChange={(e) => setAboutRole(e.target.value)}
            rows={4}
            placeholder="Describe what this role does and why it exists..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <FieldLabel>Key Responsibilities</FieldLabel>
            {aiGenerated && (
              <span className="text-[10px] font-semibold bg-brand-purple/10 text-brand-purple rounded-full px-2 py-0.5">AI Generated</span>
            )}
          </div>
          <div className="space-y-2">
            {responsibilities.map((r, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={r}
                  onChange={(e) => updateResponsibility(idx, e.target.value)}
                  className="flex-1 h-8 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                />
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeResponsibility(idx)}>
                  <X className="size-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={addResponsibility} className="text-brand-purple gap-1">
              <Plus className="size-3.5" />
              Add Responsibility
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <FieldLabel>Required Skills</FieldLabel>
            {aiGenerated && (
              <span className="text-[10px] font-semibold bg-brand-purple/10 text-brand-purple rounded-full px-2 py-0.5">AI Generated</span>
            )}
          </div>
          <TagInput
            tags={requiredSkills}
            onRemove={(idx) => removeSkill("required", idx)}
            inputValue={newRequiredSkill}
            onInputChange={setNewRequiredSkill}
            onAdd={() => addSkill("required")}
            placeholder="Type a skill and press Add"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <FieldLabel>Preferred Skills</FieldLabel>
            {aiGenerated && (
              <span className="text-[10px] font-semibold bg-brand-purple/10 text-brand-purple rounded-full px-2 py-0.5">AI Generated</span>
            )}
          </div>
          <TagInput
            tags={preferredSkills}
            onRemove={(idx) => removeSkill("preferred", idx)}
            inputValue={newPreferredSkill}
            onInputChange={setNewPreferredSkill}
            onAdd={() => addSkill("preferred")}
            placeholder="Type a skill and press Add"
          />
        </div>

        <div>
          <FieldLabel>Qualifications</FieldLabel>
          <textarea
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            rows={3}
            placeholder="Required qualifications, education, certifications..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none"
          />
        </div>
      </div>

      {/* JD Quality Score */}
      {hasJdContent && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">JD Quality Score</span>
            <span
              className={`font-semibold ${
                jdScore <= 40 ? "text-destructive" : jdScore <= 70 ? "text-warning" : "text-success"
              }`}
            >
              {jdScore}/100 — {jdScore <= 40 ? "Needs work" : jdScore <= 70 ? "Good" : "Excellent"}
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                jdScore <= 40 ? "bg-destructive" : jdScore <= 70 ? "bg-warning" : "bg-success"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${jdScore}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            />
          </div>
          <div className="space-y-1">
            {jdSuggestions(aboutRole, responsibilities, requiredSkills, preferredSkills, qualifications).map((s, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Lightbulb className="size-3 mt-0.5 text-warning shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <FieldLabel>Minimum Experience (years)</FieldLabel>
        <input
          type="number"
          min={0}
          value={minExperience}
          onChange={(e) => setMinExperience(parseInt(e.target.value) || 0)}
          className="w-32 h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
        />
      </div>

      <div>
        <FieldLabel>Education</FieldLabel>
        <select
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
        >
          {EDUCATION_OPTIONS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel>Certifications (optional)</FieldLabel>
        <TagInput
          tags={certifications}
          onRemove={removeCert}
          inputValue={newCert}
          onInputChange={setNewCert}
          onAdd={addCert}
          placeholder="Type a certification and press Add"
        />
      </div>

      <div>
        <FieldLabel>Salary Range *</FieldLabel>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1 flex-1">
            <span className="text-sm text-muted-foreground shrink-0">
              {currency === "INR" ? "\u20B9" : currency === "USD" ? "$" : currency === "EUR" ? "\u20AC" : currency === "GBP" ? "\u00A3" : "AED"}
            </span>
            <input
              type="text"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="e.g. 28L"
              className="w-full h-8 rounded-lg border border-border bg-background px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
            />
          </div>
          <span className="text-muted-foreground text-xs">/</span>
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={salaryMid}
              onChange={(e) => setSalaryMid(e.target.value)}
              placeholder="Mid"
              className="w-full h-8 rounded-lg border border-border bg-background px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
            />
          </div>
          <span className="text-muted-foreground text-xs">/</span>
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="Max"
              className="w-full h-8 rounded-lg border border-border bg-background px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
            />
          </div>
        </div>
        <div className="mt-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="h-8 rounded-lg border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <FieldLabel>Equity Eligible</FieldLabel>
        <Toggle checked={equityEligible} onChange={setEquityEligible} />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <FieldLabel>Bonus Eligible</FieldLabel>
          <Toggle checked={bonusEligible} onChange={setBonusEligible} />
        </div>
        {bonusEligible && (
          <input
            type="text"
            value={bonusTarget}
            onChange={(e) => setBonusTarget(e.target.value)}
            placeholder="e.g. 15%"
            className="mt-2 w-32 h-8 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
          />
        )}
      </div>

      <div>
        <FieldLabel>Business Case *</FieldLabel>
        <textarea
          value={businessCase}
          onChange={(e) => setBusinessCase(e.target.value)}
          rows={4}
          placeholder="Why is this hire needed? What's the business impact?"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">
        Position Slots — {slots.length} position{slots.length !== 1 ? "s" : ""} to fill
      </p>

      {slots.map((slot, idx) => (
        <div
          key={slot.id}
          className={`rounded-xl border border-border bg-background p-4 space-y-3 border-l-4 ${SLOT_BORDER_COLORS[idx % SLOT_BORDER_COLORS.length]}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Slot {idx + 1}</span>
            {slots.length > 1 && (
              <Button type="button" variant="ghost" size="icon-xs" onClick={() => removeSlot(idx)}>
                <X className="size-3.5 text-muted-foreground" />
              </Button>
            )}
          </div>

          <div>
            <FieldLabel>Location *</FieldLabel>
            <select
              value={slot.location}
              onChange={(e) => updateSlot(idx, "location", e.target.value)}
              className="w-full h-8 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
            >
              <option value="">Select location</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Work Mode</FieldLabel>
            <div className="flex gap-2">
              {(["Onsite", "Hybrid", "Remote"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateSlot(idx, "workMode", mode)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    slot.workMode === mode
                      ? "bg-brand-purple text-white"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>Assigned Recruiter</FieldLabel>
            <select
              value={slot.recruiter}
              onChange={(e) => updateSlot(idx, "recruiter", e.target.value)}
              className="w-full h-8 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
            >
              <option value="">Select recruiter</option>
              {RECRUITERS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Compensation Override</FieldLabel>
            <input
              type="text"
              value={slot.compensationOverride}
              onChange={(e) => updateSlot(idx, "compensationOverride", e.target.value)}
              placeholder="Leave blank to use default range"
              className="w-full h-8 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="ghost" size="sm" onClick={addSlot} className="text-brand-purple gap-1">
        <Plus className="size-3.5" />
        Add Another Slot
      </Button>
    </div>
  );

  const renderStep5 = () => {
    if (submitted) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="size-16 rounded-full bg-success flex items-center justify-center mb-4"
          >
            <Check className="size-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="text-lg font-semibold text-foreground text-center"
          >
            Requisition {submittedReqId} submitted for approval!
          </motion.p>
        </div>
      );
    }

    const reqTypeCfg = REQ_TYPES.find((t) => t.value === reqType);
    const priorityCfg = PRIORITY_OPTIONS.find((p) => p.value === priority);

    return (
      <div className="space-y-5">
        {/* A) Summary Review */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Summary Review</p>

          {/* Header card */}
          <div className="rounded-lg border border-border bg-card p-3 space-y-1">
            <p className="font-semibold text-foreground">{jobTitle || "Untitled"}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{department || "—"}</span>
              <span className="size-1 rounded-full bg-border" />
              <span>{level || "—"}</span>
              <span className="size-1 rounded-full bg-border" />
              <span>{reqTypeCfg?.label ?? "—"}</span>
              <span className="size-1 rounded-full bg-border" />
              <span className={priorityCfg ? "" : ""}>{priorityCfg?.label ?? "—"}</span>
            </div>
          </div>

          {/* JD preview */}
          <div className="rounded-lg border border-border bg-card p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Description</p>
            <p className="text-sm text-foreground">
              {aboutRole.length > 100 ? aboutRole.slice(0, 100) + "..." : aboutRole || "—"}
            </p>
            {requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {requiredSkills.map((s, i) => (
                  <span key={i} className="rounded-full bg-brand-purple/10 text-brand-purple px-2 py-0.5 text-[10px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">{responsibilities.filter((r) => r.trim()).length} responsibilities</p>
          </div>

          {/* Compensation */}
          <div className="rounded-lg border border-border bg-card p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Compensation</p>
            <p className="text-sm text-foreground">
              {salaryMin ? `${currency} ${salaryMin}` : "—"}
              {salaryMid ? ` / ${salaryMid}` : ""}
              {salaryMax ? ` / ${salaryMax}` : ""}
            </p>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>Equity: {equityEligible ? "Yes" : "No"}</span>
              <span>Bonus: {bonusEligible ? `Yes (${bonusTarget || "—"})` : "No"}</span>
            </div>
          </div>

          {/* Positions */}
          <div className="rounded-lg border border-border bg-card p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Positions</p>
            <p className="text-sm text-foreground">{slots.length} slot{slots.length !== 1 ? "s" : ""}</p>
            <p className="text-xs text-muted-foreground">
              {slots.map((s) => s.location || "TBD").join(", ")}
            </p>
          </div>

          {/* Business case */}
          <div className="rounded-lg border border-border bg-card p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business Case</p>
            <p className="text-sm text-foreground">
              {businessCase.length > 150 ? businessCase.slice(0, 150) + "..." : businessCase || "—"}
            </p>
          </div>
        </div>

        {/* B) Approval Chain */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Approval Chain</p>
          {approvers.map((a, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div className="size-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-xs font-semibold text-brand-purple">
                {idx + 1}
              </div>
              <div className="flex-1">
                {a.auto ? (
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.role}</p>
                  </div>
                ) : (
                  <select
                    value={a.name}
                    onChange={(e) => updateApprover(idx, e.target.value)}
                    className="w-full h-8 rounded-lg border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  >
                    <option value="">Select approver</option>
                    {APPROVERS.map((ap) => (
                      <option key={ap.name} value={ap.name}>{ap.name} — {ap.role}</option>
                    ))}
                  </select>
                )}
              </div>
              {a.auto && (
                <span className="text-[10px] font-semibold bg-secondary text-muted-foreground rounded-full px-2 py-0.5">Auto</span>
              )}
              {idx > 0 && (
                <Button type="button" variant="ghost" size="icon-xs" onClick={() => removeApprover(idx)}>
                  <Trash2 className="size-3 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={addApprover} className="text-brand-purple gap-1">
            <Plus className="size-3.5" />
            Add Approver
          </Button>
        </div>

        {/* C) Options */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Auto-create job posting after approval</span>
            <Toggle checked={autoCreateJob} onChange={setAutoCreateJob} />
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmAccurate}
              onChange={(e) => setConfirmAccurate(e.target.checked)}
              className="mt-0.5 size-4 rounded border-border accent-brand-purple"
            />
            <span className="text-sm text-foreground">I confirm the information above is accurate</span>
          </label>
        </div>
      </div>
    );
  };

  const stepContent = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="fixed right-0 inset-y-0 w-full max-w-2xl bg-card border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="border-b border-border px-6 py-4 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">New Requisition</h2>
                <Button type="button" variant="ghost" size="icon-sm" onClick={onClose}>
                  <X className="size-4" />
                </Button>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-between">
                {STEP_LABELS.map((label, idx) => {
                  const step = idx + 1;
                  const completed = step < currentStep && isStepComplete(step);
                  const current = step === currentStep;
                  return (
                    <div key={label} className="flex items-center flex-1 last:flex-initial">
                      <div className="flex flex-col items-center">
                        <div
                          className={`size-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                            completed
                              ? "bg-success text-white"
                              : current
                                ? "bg-brand-purple text-white animate-pulse"
                                : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {completed ? <Check className="size-3.5" /> : step}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 whitespace-nowrap">{label}</span>
                      </div>
                      {idx < STEP_LABELS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1.5 rounded-full ${
                            step < currentStep ? "bg-success" : "bg-secondary"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={slideTransition}
                >
                  {stepContent[currentStep - 1]()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            {!submitted && (
              <div className="border-t border-border px-6 py-3 flex items-center gap-2 shrink-0">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={goBack}>
                    Back
                  </Button>
                )}
                <div className="flex-1" />
                <Button type="button" variant="ghost" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                {currentStep < 5 ? (
                  <Button
                    type="button"
                    className="bg-brand-purple text-white hover:bg-brand-purple/90"
                    onClick={goNext}
                    disabled={!canProceed}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="bg-brand-purple text-white hover:bg-brand-purple/90"
                    onClick={handleSubmit}
                    disabled={!confirmAccurate}
                  >
                    Submit for Approval
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
