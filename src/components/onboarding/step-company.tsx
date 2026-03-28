"use client";

import { useState } from "react";
import { Building2, Globe, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INDUSTRIES, COMPANY_SIZES, USE_CASES } from "@/components/onboarding/data";

interface StepCompanyProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: (complete: boolean) => void;
}

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Germany", "France",
  "India", "Australia", "Japan", "Brazil", "Singapore",
];

export function StepCompany({ onComplete }: StepCompanyProps) {
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [country, setCountry] = useState("");
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);

  const updateComplete = (name: string, ind: string, size: string) => {
    onComplete(!!(name && ind && size));
  };

  const toggleUseCase = (id: string) => {
    setSelectedUseCases((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Company Profile</h2>
        <p className="text-sm text-muted-foreground">Tell us about your organization so we can personalize your experience.</p>
      </div>

      <div className="space-y-4">
        {/* Company name */}
        <div className="space-y-1.5">
          <Label htmlFor="company-name">Company Name *</Label>
          <div className="relative">
            <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="company-name"
              placeholder="Acme Inc."
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                updateComplete(e.target.value, industry, companySize);
              }}
              className="pl-9"
            />
          </div>
        </div>

        {/* Website */}
        <div className="space-y-1.5">
          <Label htmlFor="website">Company Website</Label>
          <div className="relative">
            <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="website"
              placeholder="https://acme.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Industry */}
        <div className="space-y-1.5">
          <Label htmlFor="industry">Industry *</Label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
              updateComplete(companyName, e.target.value, companySize);
            }}
            className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Company size */}
        <div className="space-y-1.5">
          <Label htmlFor="company-size">Company Size *</Label>
          <select
            id="company-size"
            value={companySize}
            onChange={(e) => {
              setCompanySize(e.target.value);
              updateComplete(companyName, industry, e.target.value);
            }}
            className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select size</option>
            {COMPANY_SIZES.map((s) => (
              <option key={s.value} value={s.value}>{s.label} employees</option>
            ))}
          </select>
          {companySize && (
            <p className="text-xs text-muted-foreground">
              Recommended plan: {COMPANY_SIZES.find((s) => s.value === companySize)?.plan}
            </p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <Label htmlFor="country">Country *</Label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Use cases */}
        <div className="space-y-2">
          <Label>What will you use O2S for?</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {USE_CASES.map((uc) => (
              <button
                key={uc.id}
                type="button"
                onClick={() => toggleUseCase(uc.id)}
                className={`bg-card border rounded-lg p-3 text-center cursor-pointer transition-colors ${
                  selectedUseCases.includes(uc.id)
                    ? "bg-brand/5 border-brand"
                    : "border-border hover:border-brand/30"
                }`}
              >
                <div className="text-2xl mb-1">{uc.icon}</div>
                <div className="text-xs text-foreground">{uc.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* AI assistant strip */}
        <div className="bg-brand-purple/5 border-l-[3px] border-brand-purple p-3 rounded-r-lg flex items-start gap-2">
          <Sparkles className="size-4 text-brand-purple shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Our AI will use your company profile to customize templates, compliance rules, and agent behaviors for your industry.
          </p>
        </div>
      </div>
    </div>
  );
}
