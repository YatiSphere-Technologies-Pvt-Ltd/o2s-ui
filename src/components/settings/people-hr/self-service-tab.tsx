"use client";

function CheckboxGroup({
  title,
  items,
}: {
  title: string;
  items: { label: string; checked: boolean }[];
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-2">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.label}
            className="flex items-center gap-2.5 text-sm text-foreground"
          >
            <input
              type="checkbox"
              defaultChecked={item.checked}
              className="size-3.5 accent-brand rounded"
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );
}

const PROFILE_WITHOUT_APPROVAL = [
  { label: "Profile photo", checked: true },
  { label: "Pronouns", checked: true },
  { label: "Bio / About", checked: true },
  { label: "Phone (personal)", checked: true },
  { label: "Emergency contact", checked: true },
  { label: "LinkedIn URL", checked: true },
  { label: "Skills", checked: true },
  { label: "Dietary preference", checked: true },
];

const PROFILE_WITH_APPROVAL = [
  { label: "Legal name change", checked: false },
  { label: "Address change", checked: false },
  { label: "Bank / direct deposit", checked: false },
  { label: "Tax withholding", checked: false },
];

const LEAVE_REQUESTS = [
  { label: "Submit leave requests", checked: true },
  { label: "View leave balance", checked: true },
  { label: "View team calendar", checked: true },
  { label: "Cancel approved leave (before start)", checked: false },
  { label: "View holiday calendar", checked: true },
];

const DOCUMENTS = [
  { label: "View own documents", checked: true },
  { label: "Download pay stubs", checked: true },
  { label: "Download tax documents (W-2, 1099)", checked: true },
  { label: "Upload required documents", checked: true },
  { label: "Request new document generation", checked: false },
];

const COMP_EMPLOYEE_SEES = [
  { label: "Own salary", checked: true },
  { label: "Own equity grant summary", checked: true },
  { label: "Own pay band position", checked: true },
  { label: "Team pay bands", checked: false },
  { label: "Company-wide comp philosophy", checked: false },
];

const COMP_MANAGER_SEES = [
  { label: "Direct reports' salary", checked: true },
  { label: "Direct reports' pay band position", checked: true },
  { label: "Department budget", checked: false },
  { label: "Org-wide compensation data", checked: false },
];

const PERF_EMPLOYEE_SEES = [
  { label: "Own reviews", checked: true },
  { label: "Own goals / OKRs", checked: true },
  { label: "Peer feedback received", checked: true },
  { label: "Manager's private notes", checked: false },
  { label: "Calibration results", checked: false },
  { label: "Promotion readiness score", checked: true },
];

const DIRECTORY_ACCESS = [
  { label: "View employee directory", checked: true },
  { label: "View org chart", checked: true },
  { label: "View team pages", checked: true },
  { label: "Export directory data", checked: false },
  { label: "View employee count by department", checked: false },
  { label: "Search by skills / expertise", checked: true },
];

export function SelfServiceTab() {
  return (
    <div className="space-y-5">
      {/* ── Profile Updates ── */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Profile Updates
        </h3>
        <CheckboxGroup
          title="Employee can update without approval:"
          items={PROFILE_WITHOUT_APPROVAL}
        />
        <CheckboxGroup
          title="Requires approval:"
          items={PROFILE_WITH_APPROVAL}
        />
      </div>

      {/* ── Leave Requests ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Leave Requests
        </h3>
        <CheckboxGroup title="" items={LEAVE_REQUESTS} />
      </div>

      {/* ── Documents ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Documents
        </h3>
        <CheckboxGroup title="" items={DOCUMENTS} />
      </div>

      {/* ── Compensation Visibility ── */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Compensation Visibility
        </h3>
        <CheckboxGroup title="Employee sees:" items={COMP_EMPLOYEE_SEES} />
        <CheckboxGroup title="Manager sees:" items={COMP_MANAGER_SEES} />
      </div>

      {/* ── Performance Visibility ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Performance Visibility
        </h3>
        <CheckboxGroup title="Employee sees:" items={PERF_EMPLOYEE_SEES} />
      </div>

      {/* ── Directory Access ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Directory Access
        </h3>
        <CheckboxGroup title="" items={DIRECTORY_ACCESS} />
      </div>
    </div>
  );
}
