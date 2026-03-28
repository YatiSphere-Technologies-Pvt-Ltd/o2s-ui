"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Pencil,
  MapPin,
  Mail,
  Phone,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText,
  Shield,
  AlertTriangle,
  Check,
  Clock,
  DollarSign,
  BarChart3,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  type Vendor,
  type VendorStatus,
  type VendorTier,
  STATUS_CONFIG,
  TIER_CONFIG,
  SUBMISSIONS,
  ASSIGNMENTS,
  FEES,
  COMPLIANCE_DATA,
  perfBarColor,
  perfScoreColor,
} from "@/components/vendors/data";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type SlideOverProps = {
  vendor: Vendor | null;
  onClose: () => void;
  onAutoSource?: (vendor: Vendor) => void;
};

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const VENDOR_TYPES = [
  "Staffing Agency",
  "Recruitment Firm",
  "Executive Search",
  "RPO Provider",
  "Freelance Recruiter",
  "University Partner",
  "Diversity Partner",
  "Contractor Agency",
];

const VENDOR_TIERS: VendorTier[] = ["platinum", "gold", "silver", "standard"];
const VENDOR_STATUSES: VendorStatus[] = ["active", "pending_onboarding", "suspended", "inactive", "blocked"];

const FEE_MODELS = ["Percentage", "Flat Fee", "Hourly", "Retainer"];

const ACCOUNT_MANAGERS = ["Sarah Kim", "Amit Patel", "Kavitha Menon", "Jordan Lee"];

/* ================================================================== */
/*  View Mode                                                          */
/* ================================================================== */

function ViewMode({
  vendor,
  onAutoSource,
}: {
  vendor: Vendor;
  onAutoSource?: (vendor: Vendor) => void;
}) {
  const [showMoreContacts, setShowMoreContacts] = useState(false);

  const vendorSubmissions = SUBMISSIONS.filter((s) => s.vendorId === vendor.id);
  const vendorAssignments = ASSIGNMENTS.filter((a) => a.vendorId === vendor.id);
  const vendorFees = FEES.filter((f) => f.vendorId === vendor.id);
  const vendorCompliance = COMPLIANCE_DATA.find((c) => c.vendorId === vendor.id);

  const recentActivity = [
    ...vendorSubmissions.map((s) => ({
      type: "submission" as const,
      text: `${s.candidateName} submitted for ${s.requisition}`,
      time: s.submittedAt,
    })),
    ...vendorAssignments.map((a) => ({
      type: "assignment" as const,
      text: `Assigned to ${a.requisition} (${a.slotInfo})`,
      time: a.assignedAt,
    })),
    ...vendorFees.map((f) => ({
      type: "payment" as const,
      text: `Fee ${f.status}: ${f.feeAmount} for ${f.candidateName}`,
      time: f.dueDate,
    })),
  ].slice(0, 5);

  const additionalContacts = [
    { name: "Billing Team", email: "billing@" + vendor.companyName.toLowerCase().replace(/\s+/g, "") + ".com", phone: "", role: "Billing" },
    { name: "Support", email: "support@" + vendor.companyName.toLowerCase().replace(/\s+/g, "") + ".com", phone: "", role: "Support" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <User className="size-4 text-muted-foreground" />
          Profile
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Company Name</p>
            <p className="text-sm text-foreground">{vendor.companyName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm text-foreground">{vendor.type}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tier</p>
            <p className="text-sm text-foreground capitalize">{vendor.tier}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <span className="flex items-center gap-1.5">
              <span className={`size-1.5 rounded-full ${STATUS_CONFIG[vendor.status].dotClass}`} />
              <span className={`text-sm ${STATUS_CONFIG[vendor.status].textClass}`}>
                {STATUS_CONFIG[vendor.status].label}
              </span>
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm text-foreground flex items-center gap-1">
              <MapPin className="size-3 text-muted-foreground" />
              {vendor.location}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Account Manager</p>
            <p className="text-sm text-foreground">{vendor.accountManager}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Operating Regions</p>
          <div className="flex flex-wrap gap-1.5">
            {vendor.operatingRegions.map((r) => (
              <span key={r} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                {r}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Specializations</p>
          <div className="flex flex-wrap gap-1.5">
            {vendor.specializations.map((s) => (
              <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-brand-purple/10 text-brand-purple">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Contact Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Phone className="size-4 text-muted-foreground" />
          Contact
        </h3>
        <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Primary Contact</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium text-foreground">{vendor.primaryContact.name}</p>
              <p className="text-xs text-muted-foreground">{vendor.primaryContact.role}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="size-3" /> {vendor.primaryContact.email}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="size-3" /> {vendor.primaryContact.phone}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowMoreContacts(!showMoreContacts)}
          className="flex items-center gap-1 text-xs text-brand-purple hover:underline"
        >
          {showMoreContacts ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          {showMoreContacts ? "Hide" : "More"} contacts
        </button>
        {showMoreContacts && (
          <div className="space-y-2">
            {additionalContacts.map((c) => (
              <div key={c.name} className="bg-secondary/30 rounded-lg p-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{c.name}</span> ({c.role}) — {c.email}
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Commercial Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <DollarSign className="size-4 text-muted-foreground" />
          Commercial Terms
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Fee Model</p>
            <p className="text-sm text-foreground">{vendor.feeModel}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Default Rate</p>
            <p className="text-sm text-foreground">{vendor.defaultRate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Contract Status</p>
            <p className="text-sm text-foreground">{vendor.contractStatus}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Contract End</p>
            <p className="text-sm text-foreground">{vendor.contractEnd}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Guarantee Period</p>
            <p className="text-sm text-foreground">{vendor.guaranteePeriod} days</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Payment Terms</p>
            <p className="text-sm text-foreground">Net 30</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Active Work */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Briefcase className="size-4 text-muted-foreground" />
          Active Work
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">{vendor.activeAssignments}</p>
            <p className="text-xs text-muted-foreground">Assignments</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">{vendor.totalSubmissions}</p>
            <p className="text-xs text-muted-foreground">Submissions</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">{vendor.submitToHireRate}%</p>
            <p className="text-xs text-muted-foreground">Submit-to-Hire</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Total Fees Paid</p>
            <p className="text-sm font-semibold text-foreground">{vendor.totalFeesPaid}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Outstanding</p>
            <p className={`text-sm font-semibold ${vendor.outstandingFees !== "₹0" ? "text-warning" : "text-foreground"}`}>
              {vendor.outstandingFees}
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Performance Summary */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="size-4 text-muted-foreground" />
          Performance Summary
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Score</span>
            <span className={`text-sm font-bold ${perfScoreColor(vendor.performanceScore)}`}>
              {vendor.performanceScore}/100
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full ${perfBarColor(vendor.performanceScore)} transition-all`}
              style={{ width: `${vendor.performanceScore}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-sm font-semibold text-foreground">{vendor.submitToInterviewRate}%</p>
            <p className="text-xs text-muted-foreground">Submit-to-Interview</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{vendor.submitToHireRate}%</p>
            <p className="text-xs text-muted-foreground">Submit-to-Hire</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {vendor.totalSubmissions > 0 ? Math.round(48 / vendor.totalSubmissions * 10) : 0}d
            </p>
            <p className="text-xs text-muted-foreground">Avg Time to Submit</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Recent Activity */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          Recent Activity
        </h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`mt-1 size-1.5 rounded-full shrink-0 ${
                  a.type === "submission" ? "bg-brand-purple" :
                  a.type === "assignment" ? "bg-brand" : "bg-success"
                }`} />
                <div className="flex-1">
                  <p className="text-foreground">{a.text}</p>
                  <p className="text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No recent activity</p>
        )}
      </section>

      <Separator />

      {/* Documents */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          Documents
        </h3>
        {vendorCompliance ? (
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                ["NDA", vendorCompliance.nda],
                ["MSA", vendorCompliance.msa],
                ["Insurance", vendorCompliance.insurance],
              ] as const
            ).map(([label, status]) => (
              <div key={label} className="bg-secondary/50 rounded-lg p-3 text-center space-y-1">
                <p className="text-xs font-medium text-foreground">{label}</p>
                <div className="flex items-center justify-center gap-1">
                  {status === "passed" && <Shield className="size-3 text-success" />}
                  {status === "pending" && <Clock className="size-3 text-warning" />}
                  {(status === "expired" || status === "failed") && <AlertTriangle className="size-3 text-destructive" />}
                  {status === "expiring" && <AlertTriangle className="size-3 text-warning" />}
                  <span className={`text-xs capitalize ${
                    status === "passed" ? "text-success" :
                    status === "pending" ? "text-warning" :
                    status === "expiring" ? "text-warning" :
                    status === "na" ? "text-muted-foreground" : "text-destructive"
                  }`}>
                    {status === "na" ? "N/A" : status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No compliance data</p>
        )}
      </section>

      {/* Footer Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1">
          Assign to Requisition
        </Button>
        <Button variant="ghost" size="sm" className="text-brand-purple">
          View Submissions
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onAutoSource?.(vendor)}
        >
          <Sparkles className="size-3.5" />
          Request Candidates
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Edit Mode                                                          */
/* ================================================================== */

function EditMode({
  vendor,
  onCancel,
}: {
  vendor: Vendor;
  onCancel: () => void;
}) {
  const [companyName, setCompanyName] = useState(vendor.companyName);
  const [type, setType] = useState(vendor.type);
  const [tier, setTier] = useState<VendorTier>(vendor.tier);
  const [status, setStatus] = useState<VendorStatus>(vendor.status);
  const [contactName, setContactName] = useState(vendor.primaryContact.name);
  const [contactEmail, setContactEmail] = useState(vendor.primaryContact.email);
  const [contactPhone, setContactPhone] = useState(vendor.primaryContact.phone);
  const [contactRole, setContactRole] = useState(vendor.primaryContact.role);
  const [feeModel, setFeeModel] = useState(vendor.feeModel);
  const [defaultRate, setDefaultRate] = useState(vendor.defaultRate);
  const [contractEnd, setContractEnd] = useState(vendor.contractEnd);
  const [guaranteePeriod, setGuaranteePeriod] = useState(String(vendor.guaranteePeriod));
  const [autoRenew, setAutoRenew] = useState(true);
  const [specializations, setSpecializations] = useState(vendor.specializations.join(", "));
  const [regions, setRegions] = useState(vendor.operatingRegions.join(", "));
  const [accountManager, setAccountManager] = useState(vendor.accountManager);
  const [showDangerZone, setShowDangerZone] = useState(false);

  const selectClass =
    "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <div className="space-y-6">
      {/* Company Info */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Company Info</h3>
        <div className="space-y-3">
          <div>
            <Label>Company Name</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={`mt-1 ${selectClass}`}>
                {VENDOR_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Tier</Label>
              <select value={tier} onChange={(e) => setTier(e.target.value as VendorTier)} className={`mt-1 ${selectClass}`}>
                {VENDOR_TIERS.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <select value={status} onChange={(e) => setStatus(e.target.value as VendorStatus)} className={`mt-1 ${selectClass}`}>
              {VENDOR_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <Separator />

      {/* Primary Contact */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Primary Contact</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Name</Label>
            <Input value={contactName} onChange={(e) => setContactName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={contactRole} onChange={(e) => setContactRole(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="mt-1" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Commercial */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Commercial Terms</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Fee Model</Label>
            <select value={feeModel} onChange={(e) => setFeeModel(e.target.value)} className={`mt-1 ${selectClass}`}>
              {FEE_MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Default Rate</Label>
            <Input value={defaultRate} onChange={(e) => setDefaultRate(e.target.value)} className="mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Contract End</Label>
            <Input value={contractEnd} onChange={(e) => setContractEnd(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Guarantee Period (days)</Label>
            <Input type="number" value={guaranteePeriod} onChange={(e) => setGuaranteePeriod(e.target.value)} className="mt-1" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={autoRenew}
            onClick={() => setAutoRenew(!autoRenew)}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${autoRenew ? "bg-brand-purple" : "bg-secondary"}`}
          >
            <span className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${autoRenew ? "translate-x-4" : "translate-x-0"}`} />
          </button>
          <Label>Auto-renew contract</Label>
        </div>
      </section>

      <Separator />

      {/* Specializations & Regions */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Tags</h3>
        <div>
          <Label>Specializations (comma-separated)</Label>
          <Input value={specializations} onChange={(e) => setSpecializations(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Operating Regions (comma-separated)</Label>
          <Input value={regions} onChange={(e) => setRegions(e.target.value)} className="mt-1" />
        </div>
      </section>

      <Separator />

      {/* Account Manager */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Account Manager</h3>
        <select value={accountManager} onChange={(e) => setAccountManager(e.target.value)} className={selectClass}>
          {ACCOUNT_MANAGERS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </section>

      <Separator />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button className="bg-brand-purple text-white hover:bg-brand-purple/90 flex-1">
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="border border-destructive/30 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowDangerZone(!showDangerZone)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
        >
          Danger Zone
          {showDangerZone ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        {showDangerZone && (
          <div className="px-4 pb-3 pt-1">
            <p className="text-xs text-muted-foreground mb-3">
              Deactivating a vendor will suspend all active assignments and prevent new submissions.
            </p>
            <Button variant="destructive" size="sm">
              Deactivate Vendor
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Slide-Over                                                    */
/* ================================================================== */

export function VendorDetailSlideOver({ vendor, onClose, onAutoSource }: SlideOverProps) {
  const [editMode, setEditMode] = useState(false);

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    setEditMode(false);
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {vendor && (
        <>
          {/* Overlay */}
          <motion.div
            key="vendor-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleOverlayClick}
          />

          {/* Panel */}
          <motion.div
            key="vendor-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              duration: 0.3,
            }}
            className="fixed right-0 top-0 z-50 flex h-full w-[640px] max-w-full flex-col border-l border-border bg-card shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* Header */}
            <div className="shrink-0 border-b border-border px-5 pt-5 pb-4 space-y-3">
              <div className="flex items-center gap-2 flex-wrap pr-12">
                {/* Status badge */}
                <span className="flex items-center gap-1.5">
                  <span className={`size-1.5 rounded-full ${STATUS_CONFIG[vendor.status].dotClass}`} />
                  <span className={`text-xs font-medium ${STATUS_CONFIG[vendor.status].textClass}`}>
                    {STATUS_CONFIG[vendor.status].label}
                  </span>
                </span>
                {/* Tier badge */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${TIER_CONFIG[vendor.tier].bgClass} ${TIER_CONFIG[vendor.tier].colorClass}`}>
                  {TIER_CONFIG[vendor.tier].icon} {TIER_CONFIG[vendor.tier].label}
                </span>
                {/* Vendor ID */}
                <span className="text-xs text-muted-foreground font-mono">{vendor.id}</span>
              </div>

              <div className="flex items-center justify-between pr-8">
                <h2 className="text-lg font-bold text-foreground">{vendor.companyName}</h2>
                <Button
                  variant={editMode ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? <Check className="size-4" /> : <Pencil className="size-4" />}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                {vendor.type} &middot; {vendor.location}
              </p>
            </div>

            {/* Content (scrollable) */}
            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
              <AnimatePresence mode="wait">
                {editMode ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const }}
                  >
                    <EditMode vendor={vendor} onCancel={() => setEditMode(false)} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const }}
                  >
                    <ViewMode vendor={vendor} onAutoSource={onAutoSource} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
