"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Upload,
  FileText,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type AddVendorFormProps = {
  open: boolean;
  onClose: () => void;
};

interface ContactEntry {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface VolumeDiscount {
  threshold: string;
  discount: string;
}

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

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "Singapore",
  "UAE",
  "Canada",
  "Australia",
  "Japan",
  "Netherlands",
];

const REGIONS = ["India", "SE Asia", "Middle East", "Europe", "North America", "Global"];
const SPECIALIZATIONS = [
  "Frontend",
  "Backend",
  "Full Stack",
  "DevOps",
  "Data Science",
  "Design",
  "Product",
  "Executive",
  "Sales",
  "Marketing",
  "HR",
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

const FEE_MODELS = [
  "Percentage of CTC",
  "Flat Fee per Placement",
  "Hourly Markup",
  "Retainer",
  "Hybrid",
];

const PAYMENT_TRIGGERS = ["On Joining", "On Offer Acceptance", "After Guarantee Period"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const CONTRACT_TYPES = ["MSA", "SOW", "Retainer", "Contingency", "Exclusive"];

const slideTransition = { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const };

/* ================================================================== */
/*  Shared Styles                                                      */
/* ================================================================== */

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/* ================================================================== */
/*  Step Indicator                                                     */
/* ================================================================== */

const STEPS = [
  { num: 1, label: "Company Info" },
  { num: 2, label: "Contacts" },
  { num: 3, label: "Commercial" },
  { num: 4, label: "Compliance" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 py-4">
      {STEPS.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step.num === current
                  ? "bg-brand-purple text-white"
                  : step.num < current
                  ? "bg-brand-purple/20 text-brand-purple"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {step.num < current ? <Check className="size-4" /> : step.num}
            </div>
            <span className={`text-[10px] mt-1 ${step.num === current ? "text-brand-purple font-medium" : "text-muted-foreground"}`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-12 h-px mx-1 mb-4 ${step.num < current ? "bg-brand-purple" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  Multi-Tag Selector                                                 */
/* ================================================================== */

function TagSelector({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-brand-purple text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Step 1: Company Info                                               */
/* ================================================================== */

function Step1({
  form,
  setForm,
}: {
  form: Record<string, string | string[]>;
  setForm: (patch: Record<string, string | string[]>) => void;
}) {
  const toggleTag = (key: string, val: string) => {
    const arr = (form[key] as string[]) || [];
    setForm({
      [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Company Name *</Label>
        <Input
          value={(form.companyName as string) || ""}
          onChange={(e) => setForm({ companyName: e.target.value })}
          placeholder="e.g., TalentForce India Pvt Ltd"
          className="mt-1"
        />
      </div>
      <div>
        <Label>Legal Entity Name</Label>
        <Input
          value={(form.legalName as string) || ""}
          onChange={(e) => setForm({ legalName: e.target.value })}
          placeholder="Optional"
          className="mt-1"
        />
      </div>
      <div>
        <Label>Website</Label>
        <Input
          value={(form.website as string) || ""}
          onChange={(e) => setForm({ website: e.target.value })}
          placeholder="https://..."
          className="mt-1"
        />
      </div>
      <div>
        <Label>Vendor Type *</Label>
        <select
          value={(form.vendorType as string) || ""}
          onChange={(e) => setForm({ vendorType: e.target.value })}
          className={`mt-1 ${selectClass}`}
        >
          <option value="">Select type...</option>
          {VENDOR_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>City</Label>
          <Input
            value={(form.city as string) || ""}
            onChange={(e) => setForm({ city: e.target.value })}
            placeholder="e.g., Mumbai"
            className="mt-1"
          />
        </div>
        <div>
          <Label>Country</Label>
          <select
            value={(form.country as string) || ""}
            onChange={(e) => setForm({ country: e.target.value })}
            className={`mt-1 ${selectClass}`}
          >
            <option value="">Select country...</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <TagSelector
        label="Operating Regions"
        options={REGIONS}
        selected={(form.regions as string[]) || []}
        onToggle={(val) => toggleTag("regions", val)}
      />

      <TagSelector
        label="Specializations"
        options={SPECIALIZATIONS}
        selected={(form.specializations as string[]) || []}
        onToggle={(val) => toggleTag("specializations", val)}
      />

      <div>
        <Label>Company Size</Label>
        <select
          value={(form.companySize as string) || ""}
          onChange={(e) => setForm({ companySize: e.target.value })}
          className={`mt-1 ${selectClass}`}
        >
          <option value="">Select size...</option>
          {COMPANY_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Step 2: Contacts                                                   */
/* ================================================================== */

function Step2({
  contacts,
  setContacts,
  sameAsPrimary,
  setSameAsPrimary,
  billingContact,
  setBillingContact,
}: {
  contacts: ContactEntry[];
  setContacts: (c: ContactEntry[]) => void;
  sameAsPrimary: boolean;
  setSameAsPrimary: (v: boolean) => void;
  billingContact: ContactEntry;
  setBillingContact: (c: ContactEntry) => void;
}) {
  const updateContact = (idx: number, field: keyof ContactEntry, value: string) => {
    const updated = [...contacts];
    updated[idx] = { ...updated[idx], [field]: value };
    setContacts(updated);
  };

  const addContact = () => {
    setContacts([...contacts, { name: "", email: "", phone: "", role: "" }]);
  };

  const removeContact = (idx: number) => {
    if (idx === 0) return; // Can't remove primary
    setContacts(contacts.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {contacts.map((contact, idx) => (
        <div key={idx} className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">
              {idx === 0 ? "Primary Contact" : `Additional Contact ${idx}`}
            </h4>
            {idx > 0 && (
              <Button variant="ghost" size="icon-xs" onClick={() => removeContact(idx)}>
                <Trash2 className="size-3 text-destructive" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Name {idx === 0 && "*"}</Label>
              <Input
                value={contact.name}
                onChange={(e) => updateContact(idx, "name", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Role {idx === 0 && "*"}</Label>
              <Input
                value={contact.role}
                onChange={(e) => updateContact(idx, "role", e.target.value)}
                placeholder="e.g., Account Manager"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email {idx === 0 && "*"}</Label>
              <Input
                type="email"
                value={contact.email}
                onChange={(e) => updateContact(idx, "email", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={contact.phone}
                onChange={(e) => updateContact(idx, "phone", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          {idx < contacts.length - 1 && <Separator />}
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addContact} className="flex items-center gap-1.5">
        <Plus className="size-3.5" />
        Add Additional Contact
      </Button>

      <Separator />

      {/* Billing Contact */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Billing Contact</h4>
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={sameAsPrimary}
            onChange={(e) => setSameAsPrimary(e.target.checked)}
            className="size-4 rounded border-input accent-brand-purple"
          />
          Same as primary contact
        </label>
        {!sameAsPrimary && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input
                value={billingContact.name}
                onChange={(e) => setBillingContact({ ...billingContact, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={billingContact.email}
                onChange={(e) => setBillingContact({ ...billingContact, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={billingContact.phone}
                onChange={(e) => setBillingContact({ ...billingContact, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input
                value={billingContact.role}
                onChange={(e) => setBillingContact({ ...billingContact, role: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Step 3: Commercial Terms                                           */
/* ================================================================== */

function Step3({
  form,
  setForm,
  volumeDiscounts,
  setVolumeDiscounts,
}: {
  form: Record<string, string>;
  setForm: (patch: Record<string, string>) => void;
  volumeDiscounts: VolumeDiscount[];
  setVolumeDiscounts: (d: VolumeDiscount[]) => void;
}) {
  const feeModel = form.feeModel || "";

  return (
    <div className="space-y-4">
      <div>
        <Label>Fee Model *</Label>
        <select
          value={feeModel}
          onChange={(e) => setForm({ feeModel: e.target.value })}
          className={`mt-1 ${selectClass}`}
        >
          <option value="">Select fee model...</option>
          {FEE_MODELS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Dynamic fields based on fee model */}
      {feeModel === "Percentage of CTC" && (
        <div className="space-y-3 pl-3 border-l-2 border-brand-purple/30">
          <div>
            <Label>Default Rate (%)</Label>
            <Input
              type="number"
              value={form.defaultRate || ""}
              onChange={(e) => setForm({ defaultRate: e.target.value })}
              placeholder="e.g., 15"
              className="mt-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">Role-specific overrides can be configured after onboarding.</p>
        </div>
      )}

      {feeModel === "Flat Fee per Placement" && (
        <div className="grid grid-cols-2 gap-3 pl-3 border-l-2 border-brand-purple/30">
          <div>
            <Label>Default Fee Amount</Label>
            <Input
              type="number"
              value={form.flatFeeAmount || ""}
              onChange={(e) => setForm({ flatFeeAmount: e.target.value })}
              placeholder="e.g., 150000"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Currency</Label>
            <select
              value={form.flatFeeCurrency || "INR"}
              onChange={(e) => setForm({ flatFeeCurrency: e.target.value })}
              className={`mt-1 ${selectClass}`}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {feeModel === "Hourly Markup" && (
        <div className="pl-3 border-l-2 border-brand-purple/30">
          <Label>Markup (%)</Label>
          <Input
            type="number"
            value={form.hourlyMarkup || ""}
            onChange={(e) => setForm({ hourlyMarkup: e.target.value })}
            placeholder="e.g., 25"
            className="mt-1"
          />
        </div>
      )}

      {feeModel === "Retainer" && (
        <div className="grid grid-cols-2 gap-3 pl-3 border-l-2 border-brand-purple/30">
          <div>
            <Label>Monthly Fee</Label>
            <Input
              type="number"
              value={form.retainerMonthly || ""}
              onChange={(e) => setForm({ retainerMonthly: e.target.value })}
              placeholder="e.g., 50000"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Included Placements</Label>
            <Input
              type="number"
              value={form.retainerPlacements || ""}
              onChange={(e) => setForm({ retainerPlacements: e.target.value })}
              placeholder="e.g., 3"
              className="mt-1"
            />
          </div>
        </div>
      )}

      <Separator />

      {/* Volume Discounts */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Volume Discounts (optional)</h4>
        {volumeDiscounts.map((vd, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1">
              <Label>Threshold (placements)</Label>
              <Input
                type="number"
                value={vd.threshold}
                onChange={(e) => {
                  const updated = [...volumeDiscounts];
                  updated[i] = { ...updated[i], threshold: e.target.value };
                  setVolumeDiscounts(updated);
                }}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label>Discount (%)</Label>
              <Input
                type="number"
                value={vd.discount}
                onChange={(e) => {
                  const updated = [...volumeDiscounts];
                  updated[i] = { ...updated[i], discount: e.target.value };
                  setVolumeDiscounts(updated);
                }}
                className="mt-1"
              />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setVolumeDiscounts(volumeDiscounts.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="size-3.5 text-destructive" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setVolumeDiscounts([...volumeDiscounts, { threshold: "", discount: "" }])}
          className="flex items-center gap-1.5"
        >
          <Plus className="size-3.5" />
          Add Discount Tier
        </Button>
      </div>

      <Separator />

      {/* Payment Terms */}
      <div className="space-y-3">
        <div>
          <Label>Payment Trigger</Label>
          <select
            value={form.paymentTrigger || ""}
            onChange={(e) => setForm({ paymentTrigger: e.target.value })}
            className={`mt-1 ${selectClass}`}
          >
            <option value="">Select...</option>
            {PAYMENT_TRIGGERS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Payment Terms (Net days)</Label>
            <Input
              type="number"
              value={form.netDays || "30"}
              onChange={(e) => setForm({ netDays: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Currency</Label>
            <select
              value={form.currency || "INR"}
              onChange={(e) => setForm({ currency: e.target.value })}
              className={`mt-1 ${selectClass}`}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Billing Details */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Billing Details (optional)</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>GST Number</Label>
            <Input
              value={form.gstNumber || ""}
              onChange={(e) => setForm({ gstNumber: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>PAN Number</Label>
            <Input
              value={form.panNumber || ""}
              onChange={(e) => setForm({ panNumber: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label>Bank Name</Label>
          <Input
            value={form.bankName || ""}
            onChange={(e) => setForm({ bankName: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Step 4: Compliance & Contract                                      */
/* ================================================================== */

function Step4({
  form,
  setForm,
}: {
  form: Record<string, string | boolean>;
  setForm: (patch: Record<string, string | boolean>) => void;
}) {
  const autoRenew = form.autoRenew === true;
  const exclusivity = form.exclusivity === true;
  const useStandardNda = form.useStandardNda === true;

  return (
    <div className="space-y-4">
      <div>
        <Label>Contract Type</Label>
        <select
          value={(form.contractType as string) || ""}
          onChange={(e) => setForm({ contractType: e.target.value })}
          className={`mt-1 ${selectClass}`}
        >
          <option value="">Select...</option>
          {CONTRACT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Contract Start Date</Label>
          <Input
            type="date"
            value={(form.contractStart as string) || ""}
            onChange={(e) => setForm({ contractStart: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Contract End Date</Label>
          <Input
            type="date"
            value={(form.contractEnd as string) || ""}
            onChange={(e) => setForm({ contractEnd: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={autoRenew}
          onClick={() => setForm({ autoRenew: !autoRenew })}
          className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${autoRenew ? "bg-brand-purple" : "bg-secondary"}`}
        >
          <span className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${autoRenew ? "translate-x-4" : "translate-x-0"}`} />
        </button>
        <Label>Auto-renew</Label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Guarantee Period (days)</Label>
          <Input
            type="number"
            value={(form.guaranteePeriod as string) || "90"}
            onChange={(e) => setForm({ guaranteePeriod: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Non-solicit Period (days)</Label>
          <Input
            type="number"
            value={(form.nonSolicit as string) || ""}
            onChange={(e) => setForm({ nonSolicit: e.target.value })}
            placeholder="Optional"
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={exclusivity}
            onClick={() => setForm({ exclusivity: !exclusivity })}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${exclusivity ? "bg-brand-purple" : "bg-secondary"}`}
          >
            <span className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${exclusivity ? "translate-x-4" : "translate-x-0"}`} />
          </button>
          <Label>Exclusivity Clause</Label>
        </div>
        {exclusivity && (
          <Input
            value={(form.exclusivityScope as string) || ""}
            onChange={(e) => setForm({ exclusivityScope: e.target.value })}
            placeholder="Describe exclusivity scope..."
            className="mt-1"
          />
        )}
      </div>

      <Separator />

      {/* Document Uploads */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Documents</h4>

        {/* NDA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>NDA</Label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={useStandardNda}
                onClick={() => setForm({ useStandardNda: !useStandardNda })}
                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${useStandardNda ? "bg-brand-purple" : "bg-secondary"}`}
              >
                <span className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${useStandardNda ? "translate-x-4" : "translate-x-0"}`} />
              </button>
              <span className="text-xs text-muted-foreground">Use standard template</span>
            </div>
          </div>
          {!useStandardNda && (
            <button
              type="button"
              className="flex items-center gap-2 w-full rounded-lg border border-dashed border-input p-3 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
            >
              <Upload className="size-4" />
              Upload NDA
            </button>
          )}
        </div>

        {/* MSA */}
        <div>
          <Label className="mb-2">MSA / Contract</Label>
          <button
            type="button"
            className="flex items-center gap-2 w-full rounded-lg border border-dashed border-input p-3 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
          >
            <Upload className="size-4" />
            Upload MSA
          </button>
        </div>

        {/* Insurance */}
        <div>
          <Label className="mb-2">Insurance Certificate</Label>
          <button
            type="button"
            className="flex items-center gap-2 w-full rounded-lg border border-dashed border-input p-3 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
          >
            <Upload className="size-4" />
            Upload Certificate
          </button>
        </div>

        {/* Data Protection */}
        <div>
          <Label className="mb-2">Data Protection Agreement</Label>
          <button
            type="button"
            className="flex items-center gap-2 w-full rounded-lg border border-dashed border-input p-3 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
          >
            <FileText className="size-4" />
            Upload Agreement
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Form                                                          */
/* ================================================================== */

export function AddVendorForm({ open, onClose }: AddVendorFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Step 1 form
  const [step1Form, setStep1Form] = useState<Record<string, string | string[]>>({
    regions: [],
    specializations: [],
  });

  // Step 2 contacts
  const [contacts, setContacts] = useState<ContactEntry[]>([
    { name: "", email: "", phone: "", role: "" },
  ]);
  const [sameAsPrimary, setSameAsPrimary] = useState(true);
  const [billingContact, setBillingContact] = useState<ContactEntry>({
    name: "",
    email: "",
    phone: "",
    role: "Billing",
  });

  // Step 3 form
  const [step3Form, setStep3Form] = useState<Record<string, string>>({ netDays: "30", currency: "INR" });
  const [volumeDiscounts, setVolumeDiscounts] = useState<VolumeDiscount[]>([]);

  // Step 4 form
  const [step4Form, setStep4Form] = useState<Record<string, string | boolean>>({
    guaranteePeriod: "90",
    autoRenew: false,
    exclusivity: false,
    useStandardNda: false,
  });

  const goNext = () => {
    if (currentStep < 4) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="add-vendor-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            key="add-vendor-panel"
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
            <div className="shrink-0 border-b border-border px-5 pt-5 pb-2">
              <h2 className="text-lg font-bold text-foreground pr-8">Add New Vendor</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Complete the wizard to onboard a new vendor partner.
              </p>
              <StepIndicator current={currentStep} />
            </div>

            {/* Step Content (scrollable) */}
            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={slideTransition}
                >
                  {currentStep === 1 && (
                    <Step1
                      form={step1Form}
                      setForm={(patch) => setStep1Form((prev) => ({ ...prev, ...patch }))}
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2
                      contacts={contacts}
                      setContacts={setContacts}
                      sameAsPrimary={sameAsPrimary}
                      setSameAsPrimary={setSameAsPrimary}
                      billingContact={billingContact}
                      setBillingContact={setBillingContact}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3
                      form={step3Form}
                      setForm={(patch) => setStep3Form((prev) => ({ ...prev, ...patch }))}
                      volumeDiscounts={volumeDiscounts}
                      setVolumeDiscounts={setVolumeDiscounts}
                    />
                  )}
                  {currentStep === 4 && (
                    <Step4
                      form={step4Form}
                      setForm={(patch) => setStep4Form((prev) => ({ ...prev, ...patch }))}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border px-5 py-3 flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <Button variant="outline" size="sm" onClick={goBack} className="flex items-center gap-1">
                    <ChevronLeft className="size-3.5" />
                    Back
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Save as Draft
                </Button>
                {currentStep < 4 ? (
                  <Button
                    className="bg-brand-purple text-white hover:bg-brand-purple/90"
                    size="sm"
                    onClick={goNext}
                  >
                    Next Step
                    <ChevronRight className="size-3.5 ml-1" />
                  </Button>
                ) : (
                  <Button
                    className="bg-brand-purple text-white hover:bg-brand-purple/90"
                    size="sm"
                    onClick={handleClose}
                  >
                    <Check className="size-3.5 mr-1" />
                    Onboard Vendor
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
