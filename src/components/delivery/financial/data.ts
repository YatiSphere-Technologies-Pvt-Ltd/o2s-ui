/* ================================================================
   O2S Delivery — Financial & Commercial Data Model
   ================================================================
   Designed for the messy reality of project finance:
     - Planned → Committed → Accrued → Actual states
     - Multi-currency with effective-dated rates
     - Rate cards that drift across projects (cost vs bill)
     - EAC/ETC + EVM where it matters
     - Pipeline-to-project handoff carries forecasted revenue
     - Invoice politics (PM approval + Finance approval)
     - Vendor PO sprawl that eats invisible budget
     - 3-layer timesheet approvals (manager / project / client-bill)
   ================================================================ */

import { PROJECTS, type Project } from "@/components/delivery/data";

// Re-export so financial pages can import projects together with the financial types.
export { PROJECTS };

/* ── Currency ─────────────────────────────────────────────── */

export type Currency = "INR" | "USD" | "GBP" | "EUR" | "SGD" | "JPY";

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  GBP: "£",
  EUR: "€",
  SGD: "S$",
  JPY: "¥",
};

/** Spot rates as of 2026-05-12 (1 unit = N INR). */
export const FX_TO_INR: Record<Currency, number> = {
  INR: 1,
  USD: 84.20,
  GBP: 108.15,
  EUR: 91.45,
  SGD: 62.30,
  JPY: 0.54,
};

export function toINR(amount: number, ccy: Currency): number {
  return amount * FX_TO_INR[ccy];
}

export function formatMoney(amount: number, ccy: Currency = "INR", short = false): string {
  const sym = CURRENCY_SYMBOL[ccy];
  if (short) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";
    if (ccy === "INR") {
      if (abs >= 10_000_000) return `${sign}${sym}${(abs / 10_000_000).toFixed(2)}Cr`;
      if (abs >= 100_000) return `${sign}${sym}${(abs / 100_000).toFixed(1)}L`;
      if (abs >= 1_000) return `${sign}${sym}${(abs / 1_000).toFixed(1)}K`;
      return `${sign}${sym}${Math.round(abs)}`;
    }
    if (abs >= 1_000_000) return `${sign}${sym}${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${sign}${sym}${(abs / 1_000).toFixed(1)}K`;
    return `${sign}${sym}${Math.round(abs)}`;
  }
  return `${sym}${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

/* ── Cost categories ──────────────────────────────────────── */

export type CostCategory = "labor" | "vendor" | "software" | "travel" | "infra" | "other";

export const COST_CATEGORY_LABEL: Record<CostCategory, string> = {
  labor: "Labor",
  vendor: "Vendor & contractor",
  software: "Software & SaaS",
  travel: "Travel",
  infra: "Cloud & infra",
  other: "Other",
};

export const COST_CATEGORY_TINT: Record<CostCategory, string> = {
  labor:    "bg-brand/10 text-brand",
  vendor:   "bg-warning/10 text-warning",
  software: "bg-brand-purple/10 text-brand-purple",
  travel:   "bg-brand-teal/10 text-brand-teal",
  infra:    "bg-success/10 text-success",
  other:    "bg-secondary text-muted-foreground",
};

/* ── Cost & bill rate cards ──────────────────────────────── */

export interface CostRate {
  id: string;
  /** Optional person; if absent, this is a role/level/location rate. */
  personId?: string;
  /** Role pattern, e.g. "Senior Engineer", "PM". */
  role?: string;
  /** Location override (country code). */
  location?: string;
  /** Hourly cost in the rate's currency. */
  hourlyCost: number;
  currency: Currency;
  effectiveFromISO: string;
  effectiveToISO?: string;
  /** Notes for finance. */
  note?: string;
}

export interface BillRate {
  id: string;
  /** Customer / project scope. */
  customer?: string;
  projectId?: string;
  /** Either by person or by role. */
  personId?: string;
  role?: string;
  hourlyBill: number;
  currency: Currency;
  /** Markup over cost, used when rate is computed (not fixed). */
  markupPct?: number;
  /** When true, this is a flat fixed rate (no markup math). */
  fixed: boolean;
  effectiveFromISO: string;
  effectiveToISO?: string;
}

export const COST_RATES: CostRate[] = [
  /* Role-level baselines */
  { id: "cr-eng-in",    role: "Engineer",         location: "IN", hourlyCost: 1_800, currency: "INR", effectiveFromISO: "2026-01-01", note: "Blended IN engineer cost" },
  { id: "cr-eng-uk",    role: "Engineer",         location: "UK", hourlyCost:   95,  currency: "GBP", effectiveFromISO: "2026-04-06" },
  { id: "cr-eng-us",    role: "Engineer",         location: "US", hourlyCost:  120,  currency: "USD", effectiveFromISO: "2026-01-01" },
  { id: "cr-eng-de",    role: "Engineer",         location: "DE", hourlyCost:   90,  currency: "EUR", effectiveFromISO: "2026-01-01" },
  { id: "cr-pm-in",     role: "PM",               location: "IN", hourlyCost: 2_400, currency: "INR", effectiveFromISO: "2026-01-01" },
  { id: "cr-pm-uk",     role: "PM",               location: "UK", hourlyCost:  110,  currency: "GBP", effectiveFromISO: "2026-01-01" },
  { id: "cr-design-in", role: "Designer",         location: "IN", hourlyCost: 1_900, currency: "INR", effectiveFromISO: "2026-01-01" },
  { id: "cr-vp-in",     role: "VP",               location: "IN", hourlyCost: 4_500, currency: "INR", effectiveFromISO: "2026-01-01" },
  { id: "cr-sec-de",    role: "Security Engineer",location: "DE", hourlyCost:  100,  currency: "EUR", effectiveFromISO: "2026-01-01" },

  /* Person-level overrides (negotiated / specialist) */
  { id: "cr-rajiv",  personId: "p-rajiv",  hourlyCost: 2_800, currency: "INR", effectiveFromISO: "2026-04-01", note: "EM uplift" },
  { id: "cr-meera",  personId: "p-meera",  hourlyCost: 4_500, currency: "INR", effectiveFromISO: "2026-01-01" },
  { id: "cr-anil",   personId: "p-anil",   hourlyCost: 3_200, currency: "INR", effectiveFromISO: "2026-01-01" },
  { id: "cr-priya",  personId: "p-priya",  hourlyCost: 2_100, currency: "INR", effectiveFromISO: "2026-04-01" },
  { id: "cr-priya-old", personId: "p-priya", hourlyCost: 1_950, currency: "INR", effectiveFromISO: "2026-01-01", effectiveToISO: "2026-03-31", note: "Pre-promotion rate" },

  /* Historical: shows the effective-dated history pattern */
  { id: "cr-eng-in-old", role: "Engineer", location: "IN", hourlyCost: 1_650, currency: "INR", effectiveFromISO: "2025-04-01", effectiveToISO: "2025-12-31", note: "FY25 rate" },
];

export const BILL_RATES: BillRate[] = [
  /* Acme Bank: project-scoped bill rates */
  { id: "br-acme-eng", customer: "Acme Bank", projectId: "p-acme", role: "Engineer", hourlyBill: 175, currency: "USD", markupPct: 35, fixed: false, effectiveFromISO: "2026-03-01" },
  { id: "br-acme-pm",  customer: "Acme Bank", projectId: "p-acme", role: "PM",       hourlyBill: 200, currency: "USD", markupPct: 30, fixed: false, effectiveFromISO: "2026-03-01" },
  { id: "br-acme-design", customer: "Acme Bank", projectId: "p-acme", role: "Designer", hourlyBill: 160, currency: "USD", fixed: true, effectiveFromISO: "2026-03-01" },

  /* Acme — person-pinned (premium for specialist) */
  { id: "br-acme-rajiv", customer: "Acme Bank", projectId: "p-acme", personId: "p-rajiv", hourlyBill: 250, currency: "USD", fixed: true, effectiveFromISO: "2026-04-01", effectiveToISO: undefined },

  /* JP Launch: SGD billed to PMI partner */
  { id: "br-jp-eng",   customer: "PMI Japan",  projectId: "p-jp-launch", role: "Engineer", hourlyBill: 210, currency: "SGD", fixed: true, effectiveFromISO: "2026-04-15" },
  { id: "br-jp-pm",    customer: "PMI Japan",  projectId: "p-jp-launch", role: "PM",       hourlyBill: 240, currency: "SGD", fixed: true, effectiveFromISO: "2026-04-15" },

  /* Internal projects: cost-only (no bill) */
];

/** Find the effective cost rate for a person on a given ISO date. */
export function effectiveCostRate(personId: string, atISO: string): CostRate | null {
  const matchPerson = COST_RATES
    .filter((r) => r.personId === personId)
    .filter((r) => r.effectiveFromISO <= atISO && (!r.effectiveToISO || r.effectiveToISO >= atISO));
  if (matchPerson.length > 0) {
    return matchPerson.sort((a, b) => b.effectiveFromISO.localeCompare(a.effectiveFromISO))[0];
  }
  return null;
}

/** Find the effective bill rate for a person on a project. */
export function effectiveBillRate(opts: { personId?: string; role?: string; projectId: string; atISO: string }): BillRate | null {
  // Person-pinned wins, then role-on-project, then no rate.
  const personPinned = BILL_RATES.find(
    (b) =>
      b.personId === opts.personId &&
      b.projectId === opts.projectId &&
      b.effectiveFromISO <= opts.atISO &&
      (!b.effectiveToISO || b.effectiveToISO >= opts.atISO),
  );
  if (personPinned) return personPinned;
  const roleScoped = BILL_RATES.find(
    (b) =>
      b.role === opts.role &&
      b.projectId === opts.projectId &&
      b.effectiveFromISO <= opts.atISO &&
      (!b.effectiveToISO || b.effectiveToISO >= opts.atISO),
  );
  return roleScoped ?? null;
}

/* ── Budgets ──────────────────────────────────────────────── */

export interface BudgetLine {
  id: string;
  projectId: string;
  category: CostCategory;
  /** Planned amount in INR (everything rolls up in base currency). */
  plannedINR: number;
  /** Committed (POs raised + scheduled labor). */
  committedINR: number;
  /** Accrued (work done, not yet invoiced/paid). */
  accruedINR: number;
  /** Actual (invoiced + paid). */
  actualINR: number;
  /** Who owns this line. */
  ownerId: string;
  note?: string;
}

export const BUDGET_LINES: BudgetLine[] = [
  /* Phoenix — heavy labor, some vendor */
  { id: "bl-px-labor",    projectId: "p-phoenix", category: "labor",    plannedINR: 9_800_000, committedINR: 6_200_000, accruedINR: 4_400_000, actualINR: 4_200_000, ownerId: "p-vikram" },
  { id: "bl-px-vendor",   projectId: "p-phoenix", category: "vendor",   plannedINR: 2_400_000, committedINR: 2_100_000, accruedINR: 1_700_000, actualINR: 1_500_000, ownerId: "p-vikram", note: "Payments gateway specialist firm" },
  { id: "bl-px-software", projectId: "p-phoenix", category: "software", plannedINR:   400_000, committedINR:   320_000, accruedINR:   280_000, actualINR:   280_000, ownerId: "p-rajiv" },
  { id: "bl-px-travel",   projectId: "p-phoenix", category: "travel",   plannedINR:   200_000, committedINR:   120_000, accruedINR:    90_000, actualINR:    90_000, ownerId: "p-vikram" },
  { id: "bl-px-infra",    projectId: "p-phoenix", category: "infra",    plannedINR: 1_200_000, committedINR: 1_200_000, accruedINR:   460_000, actualINR:   430_000, ownerId: "p-rajiv" },

  /* Acme — labor-heavy, billable */
  { id: "bl-ac-labor",    projectId: "p-acme",    category: "labor",    plannedINR: 4_500_000, committedINR: 3_100_000, accruedINR: 1_900_000, actualINR: 1_700_000, ownerId: "p-aisha" },
  { id: "bl-ac-vendor",   projectId: "p-acme",    category: "vendor",   plannedINR: 1_400_000, committedINR:   900_000, accruedINR:   780_000, actualINR:   780_000, ownerId: "p-aisha" },
  { id: "bl-ac-software", projectId: "p-acme",    category: "software", plannedINR:   400_000, committedINR:   400_000, accruedINR:   320_000, actualINR:   320_000, ownerId: "p-aisha" },
  { id: "bl-ac-infra",    projectId: "p-acme",    category: "infra",    plannedINR:   200_000, committedINR:   180_000, accruedINR:   100_000, actualINR:    80_000, ownerId: "p-rajiv" },

  /* Japan Launch — big vendor (PMI) + travel */
  { id: "bl-jp-labor",    projectId: "p-jp-launch", category: "labor",  plannedINR: 6_500_000, committedINR: 3_900_000, accruedINR: 2_400_000, actualINR: 2_200_000, ownerId: "p-aisha" },
  { id: "bl-jp-vendor",   projectId: "p-jp-launch", category: "vendor", plannedINR: 3_000_000, committedINR: 2_700_000, accruedINR: 1_900_000, actualINR: 1_700_000, ownerId: "p-aisha", note: "PMI partnership fee + translation vendor" },
  { id: "bl-jp-travel",   projectId: "p-jp-launch", category: "travel", plannedINR:   900_000, committedINR:   650_000, accruedINR:   500_000, actualINR:   500_000, ownerId: "p-aisha" },
  { id: "bl-jp-software", projectId: "p-jp-launch", category: "software",plannedINR:  400_000, committedINR:   400_000, accruedINR:   200_000, actualINR:   200_000, ownerId: "p-aisha" },
  { id: "bl-jp-infra",    projectId: "p-jp-launch", category: "infra",  plannedINR:   200_000, committedINR:   100_000, accruedINR:    60_000, actualINR:    60_000, ownerId: "p-rajiv" },

  /* DataMesh — small, infra-heavy */
  { id: "bl-dm-labor",    projectId: "p-datamesh", category: "labor",   plannedINR: 7_000_000, committedINR: 1_400_000, accruedINR: 1_200_000, actualINR: 1_100_000, ownerId: "p-vikram" },
  { id: "bl-dm-vendor",   projectId: "p-datamesh", category: "vendor",  plannedINR: 1_000_000, committedINR:   200_000, accruedINR:   100_000, actualINR:   100_000, ownerId: "p-vikram" },
  { id: "bl-dm-software", projectId: "p-datamesh", category: "software",plannedINR: 1_200_000, committedINR:   600_000, accruedINR:   400_000, actualINR:   400_000, ownerId: "p-vikram", note: "Snowflake credits" },
  { id: "bl-dm-infra",    projectId: "p-datamesh", category: "infra",   plannedINR:   800_000, committedINR:   300_000, accruedINR:   200_000, actualINR:   200_000, ownerId: "p-rajiv" },

  /* MR Failover */
  { id: "bl-mr-labor",    projectId: "p-infra-mr", category: "labor",   plannedINR: 3_200_000, committedINR: 1_900_000, accruedINR: 1_400_000, actualINR: 1_300_000, ownerId: "p-rajiv" },
  { id: "bl-mr-vendor",   projectId: "p-infra-mr", category: "vendor",  plannedINR:   600_000, committedINR:   400_000, accruedINR:   300_000, actualINR:   300_000, ownerId: "p-rajiv" },
  { id: "bl-mr-infra",    projectId: "p-infra-mr", category: "infra",   plannedINR: 1_200_000, committedINR:   800_000, accruedINR:   500_000, actualINR:   500_000, ownerId: "p-rajiv" },

  /* DPDP — vendor-heavy (legal + audit), running hot */
  { id: "bl-dp-labor",    projectId: "p-dpdp",     category: "labor",   plannedINR: 2_400_000, committedINR: 2_400_000, accruedINR: 2_100_000, actualINR: 2_000_000, ownerId: "p-anil" },
  { id: "bl-dp-vendor",   projectId: "p-dpdp",     category: "vendor",  plannedINR: 2_800_000, committedINR: 3_200_000, accruedINR: 2_800_000, actualINR: 2_200_000, ownerId: "p-anil", note: "Audit firm + outside counsel (overrun)" },
  { id: "bl-dp-software", projectId: "p-dpdp",     category: "software",plannedINR:   400_000, committedINR:   400_000, accruedINR:   400_000, actualINR:    400_000, ownerId: "p-anil" },
  { id: "bl-dp-other",    projectId: "p-dpdp",     category: "other",   plannedINR:   400_000, committedINR:   300_000, accruedINR:   250_000, actualINR:   200_000, ownerId: "p-anil" },
];

/** Sum every budget line for one project. Returns the 4 phase totals + cents-of-EAC math. */
export function projectBudgetTotals(projectId: string) {
  const lines = BUDGET_LINES.filter((b) => b.projectId === projectId);
  const planned   = lines.reduce((s, l) => s + l.plannedINR,   0);
  const committed = lines.reduce((s, l) => s + l.committedINR, 0);
  const accrued   = lines.reduce((s, l) => s + l.accruedINR,   0);
  const actual    = lines.reduce((s, l) => s + l.actualINR,    0);
  return { planned, committed, accrued, actual, lines };
}

/* ── Revenue lines (what we bill) ─────────────────────────── */

export type ContractType = "fixed_price" | "tm" | "milestone" | "retainer";

export const CONTRACT_TYPE_LABEL: Record<ContractType, string> = {
  fixed_price: "Fixed price",
  tm: "Time & materials",
  milestone: "Milestone-based",
  retainer: "Retainer",
};

export interface RevenueLine {
  id: string;
  projectId: string;
  /** Plain English description (milestone name, sprint, retainer month). */
  label: string;
  contractType: ContractType;
  /** Billed amount in the contract currency. */
  amount: number;
  currency: Currency;
  /** When this revenue is recognised. */
  recognisedISO?: string;
  /** Scheduled invoice date. */
  scheduledISO: string;
  /** Status. */
  status: "forecast" | "ready_to_invoice" | "invoiced" | "paid" | "blocked";
  /** Invoice id once issued. */
  invoiceId?: string;
}

export const REVENUE_LINES: RevenueLine[] = [
  /* Acme — milestones */
  { id: "rv-ac-m1", projectId: "p-acme", label: "Milestone 1: Discovery sign-off",        contractType: "milestone", amount: 80_000,  currency: "USD", scheduledISO: "2026-03-31", recognisedISO: "2026-03-30", status: "paid",    invoiceId: "inv-ac-001" },
  { id: "rv-ac-m2", projectId: "p-acme", label: "Milestone 2: Corporate KYB live",        contractType: "milestone", amount: 120_000, currency: "USD", scheduledISO: "2026-05-31", recognisedISO: "2026-05-12", status: "ready_to_invoice" },
  { id: "rv-ac-m3", projectId: "p-acme", label: "Milestone 3: Multi-currency settlement", contractType: "milestone", amount: 160_000, currency: "USD", scheduledISO: "2026-08-31", status: "forecast" },
  { id: "rv-ac-m4", projectId: "p-acme", label: "Milestone 4: Go-live + 30d hypercare",   contractType: "milestone", amount: 140_000, currency: "USD", scheduledISO: "2026-10-31", status: "forecast" },

  /* JP — fixed price + retainer */
  { id: "rv-jp-fp", projectId: "p-jp-launch", label: "JP Launch — fixed price",           contractType: "fixed_price", amount: 1_400_000, currency: "SGD", scheduledISO: "2026-09-30", status: "forecast" },
  { id: "rv-jp-r1", projectId: "p-jp-launch", label: "JP — May retainer (PMI ops)",       contractType: "retainer",    amount:    40_000, currency: "SGD", scheduledISO: "2026-05-31", status: "ready_to_invoice" },
  { id: "rv-jp-r2", projectId: "p-jp-launch", label: "JP — Apr retainer (PMI ops)",       contractType: "retainer",    amount:    40_000, currency: "SGD", scheduledISO: "2026-04-30", recognisedISO: "2026-04-30", status: "paid", invoiceId: "inv-jp-001" },

  /* Phoenix — internal (no revenue) */

  /* DPDP — internal */

  /* DataMesh — internal */
];

/* ── EVM (Earned Value Management) ─────────────────────────── */

export interface EvmSnapshot {
  projectId: string;
  asOfISO: string;
  /** Planned Value: how much value should have been delivered by now. */
  pv: number;
  /** Earned Value: how much value has actually been delivered. */
  ev: number;
  /** Actual Cost: what we've actually spent. */
  ac: number;
}

/** SPI = EV / PV, CPI = EV / AC. */
export function spi(s: EvmSnapshot): number {
  return s.pv === 0 ? 1 : s.ev / s.pv;
}
export function cpi(s: EvmSnapshot): number {
  return s.ac === 0 ? 1 : s.ev / s.ac;
}
/** EAC (independent) = BAC / CPI. */
export function eacIndependent(bac: number, s: EvmSnapshot): number {
  return cpi(s) === 0 ? bac : bac / cpi(s);
}
/** ETC = EAC − AC. */
export function etcFromEac(eac: number, ac: number): number {
  return Math.max(0, eac - ac);
}

export const EVM_SNAPSHOTS: EvmSnapshot[] = [
  /* Phoenix — slipping schedule + cost */
  { projectId: "p-phoenix",  asOfISO: "2026-05-12", pv: 7_800_000, ev: 6_500_000, ac: 6_500_000 },
  /* Acme — on track */
  { projectId: "p-acme",     asOfISO: "2026-05-12", pv: 3_000_000, ev: 3_100_000, ac: 2_880_000 },
  /* JP launch — on schedule, slightly over cost */
  { projectId: "p-jp-launch",asOfISO: "2026-05-12", pv: 4_400_000, ev: 4_400_000, ac: 4_660_000 },
  /* DataMesh — on track */
  { projectId: "p-datamesh", asOfISO: "2026-05-12", pv: 1_600_000, ev: 1_700_000, ac: 1_800_000 },
  /* MR failover — ahead */
  { projectId: "p-infra-mr", asOfISO: "2026-05-12", pv: 2_000_000, ev: 2_200_000, ac: 2_100_000 },
  /* DPDP — bad: behind + over */
  { projectId: "p-dpdp",     asOfISO: "2026-05-12", pv: 5_100_000, ev: 4_000_000, ac: 4_800_000 },
];

/* ── Project P&L (computed bag) ─────────────────────────── */

export interface ProjectPnL {
  projectId: string;
  bacINR: number;
  costToDateINR: number;
  revenueToDateINR: number;
  forecastRevenueINR: number;
  /** EAC: how much it will end up costing. */
  eacINR: number;
  /** ETC: cost remaining. */
  etcINR: number;
  /** Variance vs original budget. */
  varianceINR: number;
  variancePct: number;
  /** Margin so far. */
  marginToDateINR: number;
  marginPct: number;
  /** Projected total margin. */
  projectedMarginINR: number;
  projectedMarginPct: number;
  spi: number;
  cpi: number;
}

export function computeProjectPnL(project: Project): ProjectPnL {
  const totals = projectBudgetTotals(project.id);
  const bac = project.totalBudgetINR;
  const revRecognised = REVENUE_LINES
    .filter((r) => r.projectId === project.id && (r.status === "paid" || r.status === "invoiced"))
    .reduce((s, r) => s + toINR(r.amount, r.currency), 0);
  const revForecast = REVENUE_LINES
    .filter((r) => r.projectId === project.id && (r.status === "forecast" || r.status === "ready_to_invoice"))
    .reduce((s, r) => s + toINR(r.amount, r.currency), 0);
  const evm = EVM_SNAPSHOTS.find((e) => e.projectId === project.id);
  const eac = evm ? eacIndependent(bac, evm) : bac;
  const etc = etcFromEac(eac, totals.actual);
  const variance = bac - eac;
  const variancePct = bac === 0 ? 0 : (variance / bac) * 100;
  const totalRev = revRecognised + revForecast;
  const marginToDate = revRecognised - totals.actual;
  const marginPct = revRecognised === 0 ? 0 : (marginToDate / revRecognised) * 100;
  const projectedMargin = totalRev - eac;
  const projectedMarginPct = totalRev === 0 ? 0 : (projectedMargin / totalRev) * 100;
  return {
    projectId: project.id,
    bacINR: bac,
    costToDateINR: totals.actual,
    revenueToDateINR: revRecognised,
    forecastRevenueINR: revForecast,
    eacINR: eac,
    etcINR: etc,
    varianceINR: variance,
    variancePct,
    marginToDateINR: marginToDate,
    marginPct,
    projectedMarginINR: projectedMargin,
    projectedMarginPct,
    spi: evm ? spi(evm) : 1,
    cpi: evm ? cpi(evm) : 1,
  };
}

/** All projects' P&L. */
export function allProjectPnL(): ProjectPnL[] {
  return PROJECTS.map((p) => computeProjectPnL(p));
}

/* ── Forecast scenarios ───────────────────────────────────── */

export type ForecastScenario = "base" | "optimistic" | "downside";

export const SCENARIO_LABEL: Record<ForecastScenario, string> = {
  base: "Base",
  optimistic: "Optimistic",
  downside: "Downside",
};

export const SCENARIO_REV_MULT: Record<ForecastScenario, number> = {
  base: 1.0,
  optimistic: 1.15,
  downside: 0.78,
};

export const SCENARIO_COST_MULT: Record<ForecastScenario, number> = {
  base: 1.0,
  optimistic: 0.96,
  downside: 1.12,
};

/* ── Pipeline-to-project handoff ─────────────────────────── */

export interface PipelineOpportunity {
  id: string;
  name: string;
  customer: string;
  forecastedRevenueINR: number;
  contractType: ContractType;
  stage: "discovery" | "proposal" | "commit" | "closed_won" | "closed_lost";
  /** Probability 0–100. */
  probabilityPct: number;
  closeISO: string;
  /** When converted to a project. */
  handedOffToProjectId?: string;
  ownerName: string;
}

export const PIPELINE: PipelineOpportunity[] = [
  { id: "pipe-1", name: "Sumitomo Trading — corporate API rollout",   customer: "Sumitomo",   forecastedRevenueINR: 12_800_000, contractType: "fixed_price", stage: "commit",     probabilityPct: 75, closeISO: "2026-07-15", ownerName: "Meera Krishnan" },
  { id: "pipe-2", name: "Lumen Health — onboarding accelerator",      customer: "Lumen",      forecastedRevenueINR:  6_400_000, contractType: "milestone",    stage: "proposal",  probabilityPct: 55, closeISO: "2026-08-30", ownerName: "Vikram Joshi" },
  { id: "pipe-3", name: "BBL Singapore — settlement extension",        customer: "BBL",        forecastedRevenueINR:  4_200_000, contractType: "tm",          stage: "commit",     probabilityPct: 70, closeISO: "2026-06-30", ownerName: "Anil Sharma" },
  { id: "pipe-4", name: "Acme Bank — Phase 3 (extension)",             customer: "Acme Bank",  forecastedRevenueINR: 18_500_000, contractType: "milestone",    stage: "discovery", probabilityPct: 35, closeISO: "2026-10-15", ownerName: "Vikram Joshi" },
  { id: "pipe-5", name: "PMI Japan — Korea launch follow-on",           customer: "PMI Japan", forecastedRevenueINR: 22_000_000, contractType: "fixed_price", stage: "proposal",  probabilityPct: 50, closeISO: "2026-11-15", ownerName: "Meera Krishnan" },
];

/* ── Invoices ────────────────────────────────────────────── */

export type InvoiceStatus =
  | "draft"
  | "pm_review"
  | "finance_review"
  | "sent"
  | "paid"
  | "overdue"
  | "void";

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "Draft",
  pm_review: "PM review",
  finance_review: "Finance review",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  void: "Void",
};

export const INVOICE_STATUS_TINT: Record<InvoiceStatus, string> = {
  draft:           "bg-secondary text-muted-foreground",
  pm_review:       "bg-warning/10 text-warning",
  finance_review:  "bg-brand-purple/10 text-brand-purple",
  sent:            "bg-brand/10 text-brand",
  paid:            "bg-success/10 text-success",
  overdue:         "bg-destructive/10 text-destructive",
  void:            "bg-secondary text-muted-foreground/60",
};

export type ErpDestination = "netsuite" | "quickbooks" | "xero" | "tally" | "sap";

export const ERP_LABEL: Record<ErpDestination, string> = {
  netsuite: "NetSuite",
  quickbooks: "QuickBooks",
  xero: "Xero",
  tally: "Tally",
  sap: "SAP",
};

export interface InvoiceLineItem {
  id: string;
  description: string;
  /** Quantity (hours or units). */
  qty: number;
  unit: string;
  /** Rate in invoice currency. */
  rate: number;
  /** Computed amount (qty × rate). */
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  projectId: string;
  customer: string;
  contractType: ContractType;
  currency: Currency;
  issuedISO?: string;
  dueISO?: string;
  paidISO?: string;
  status: InvoiceStatus;
  /** Subtotal across line items. */
  subtotal: number;
  /** Tax (e.g. GST/VAT) percent. */
  taxPct: number;
  tax: number;
  total: number;
  /** PM approval at this layer. */
  pmApproval: { approved: boolean; byName?: string; whenISO?: string; note?: string };
  /** Finance approval at this layer. */
  financeApproval: { approved: boolean; byName?: string; whenISO?: string; note?: string };
  /** ERP push state. */
  erp?: { destination: ErpDestination; pushed: boolean; pushedISO?: string; externalRef?: string };
  /** Line items. */
  lineItems: InvoiceLineItem[];
  /** Optional notes shown to client. */
  customerNote?: string;
  /** Optional internal note (not on invoice). */
  internalNote?: string;
}

export const INVOICES: Invoice[] = [
  {
    id: "inv-ac-001",
    number: "INV-2026-0142",
    projectId: "p-acme",
    customer: "Acme Bank",
    contractType: "milestone",
    currency: "USD",
    issuedISO: "2026-04-02",
    dueISO: "2026-05-02",
    paidISO: "2026-04-28",
    status: "paid",
    subtotal: 80_000,
    taxPct: 0,
    tax: 0,
    total: 80_000,
    pmApproval:      { approved: true, byName: "Aisha Khan",    whenISO: "2026-04-01" },
    financeApproval: { approved: true, byName: "Grace Liu",      whenISO: "2026-04-02" },
    erp: { destination: "netsuite", pushed: true, pushedISO: "2026-04-02", externalRef: "NS-9421" },
    lineItems: [
      { id: "li-1", description: "Milestone 1: Discovery sign-off", qty: 1, unit: "milestone", rate: 80_000, amount: 80_000 },
    ],
    customerNote: "Net 30 terms. Wire to Citibank Singapore — see footer.",
  },
  {
    id: "inv-ac-002",
    number: "INV-2026-DRAFT",
    projectId: "p-acme",
    customer: "Acme Bank",
    contractType: "milestone",
    currency: "USD",
    issuedISO: undefined,
    status: "pm_review",
    subtotal: 120_000,
    taxPct: 0,
    tax: 0,
    total: 120_000,
    pmApproval:      { approved: false },
    financeApproval: { approved: false },
    lineItems: [
      { id: "li-1", description: "Milestone 2: Corporate KYB live", qty: 1, unit: "milestone", rate: 120_000, amount: 120_000 },
    ],
    customerNote: "Milestone 2 acceptance attached separately.",
    internalNote: "Aisha — please confirm acceptance email is on file before approving.",
  },
  {
    id: "inv-jp-001",
    number: "INV-2026-0140",
    projectId: "p-jp-launch",
    customer: "PMI Japan",
    contractType: "retainer",
    currency: "SGD",
    issuedISO: "2026-05-01",
    dueISO: "2026-05-31",
    paidISO: "2026-05-05",
    status: "paid",
    subtotal: 40_000,
    taxPct: 8,
    tax: 3_200,
    total: 43_200,
    pmApproval:      { approved: true, byName: "Aisha Khan",  whenISO: "2026-04-30" },
    financeApproval: { approved: true, byName: "Grace Liu",    whenISO: "2026-05-01" },
    erp: { destination: "xero", pushed: true, pushedISO: "2026-05-01", externalRef: "XR-30021" },
    lineItems: [
      { id: "li-1", description: "April retainer — PMI Japan operations", qty: 1, unit: "month", rate: 40_000, amount: 40_000 },
    ],
  },
  {
    id: "inv-jp-002",
    number: "INV-2026-DRAFT-JP",
    projectId: "p-jp-launch",
    customer: "PMI Japan",
    contractType: "retainer",
    currency: "SGD",
    issuedISO: undefined,
    status: "draft",
    subtotal: 40_000,
    taxPct: 8,
    tax: 3_200,
    total: 43_200,
    pmApproval:      { approved: false },
    financeApproval: { approved: false },
    lineItems: [
      { id: "li-1", description: "May retainer — PMI Japan operations", qty: 1, unit: "month", rate: 40_000, amount: 40_000 },
    ],
  },
  {
    id: "inv-ac-tm-1",
    number: "INV-2026-0145",
    projectId: "p-acme",
    customer: "Acme Bank",
    contractType: "tm",
    currency: "USD",
    issuedISO: "2026-04-30",
    dueISO: "2026-05-30",
    status: "overdue",
    subtotal: 31_280,
    taxPct: 0,
    tax: 0,
    total: 31_280,
    pmApproval:      { approved: true, byName: "Aisha Khan", whenISO: "2026-04-28" },
    financeApproval: { approved: true, byName: "Grace Liu",   whenISO: "2026-04-30" },
    erp: { destination: "netsuite", pushed: true, pushedISO: "2026-04-30", externalRef: "NS-9442" },
    lineItems: [
      { id: "li-1", description: "Engineering hours — Priya Singh",      qty: 76, unit: "hour", rate: 175, amount: 13_300 },
      { id: "li-2", description: "Engineering hours — Sneha Rao",         qty: 64, unit: "hour", rate: 175, amount: 11_200 },
      { id: "li-3", description: "Frontend hours — Sophia Patel",         qty: 48, unit: "hour", rate: 160, amount:  7_680 },
      { id: "li-4", description: "Discount — early-pay loyalty",          qty: 1,  unit: "line", rate: -900, amount:   -900 },
    ],
    internalNote: "Customer has paid every invoice late by ~5 days; flag in collections.",
  },
];

/* ── Purchase Orders (vendors) ─────────────────────────────── */

export type PoStatus = "draft" | "open" | "partial" | "received" | "closed" | "cancelled";

export const PO_STATUS_TINT: Record<PoStatus, string> = {
  draft:     "bg-secondary text-muted-foreground",
  open:      "bg-brand/10 text-brand",
  partial:   "bg-warning/10 text-warning",
  received:  "bg-success/10 text-success",
  closed:    "bg-secondary text-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

export interface PurchaseOrder {
  id: string;
  number: string;
  projectId: string;
  vendorId: string;
  /** PO total in vendor's currency. */
  amount: number;
  currency: Currency;
  /** Amount drawn so far. */
  amountDrawn: number;
  issuedISO: string;
  expectedCloseISO: string;
  status: PoStatus;
  description: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: CostCategory;
  country: string;
  /** Contractor / firm / SaaS / Other. */
  kind: "firm" | "contractor" | "saas" | "infra";
  /** Performance scorecards. */
  performance: {
    onTimePct: number;     // 0–100
    qualityScore: number;  // 1–5
    invoiceAccuracyPct: number;
    nps: number;
    contractsOpen: number;
  };
  /** Linked to HR module if contractor. */
  hrUserId?: string;
  /** Optional preferred bool. */
  preferred: boolean;
}

export const VENDORS: Vendor[] = [
  { id: "v-paygw",      name: "PayGateway Specialists Ltd",  category: "vendor",   country: "IN", kind: "firm",       performance: { onTimePct: 88, qualityScore: 4.2, invoiceAccuracyPct: 96, nps: 32, contractsOpen: 3 }, preferred: true },
  { id: "v-pmi",        name: "PMI Japan KK",                 category: "vendor",   country: "JP", kind: "firm",       performance: { onTimePct: 95, qualityScore: 4.6, invoiceAccuracyPct: 99, nps: 58, contractsOpen: 2 }, preferred: true },
  { id: "v-transl",     name: "Yamato Translations",          category: "vendor",   country: "JP", kind: "firm",       performance: { onTimePct: 92, qualityScore: 4.4, invoiceAccuracyPct: 100, nps: 48, contractsOpen: 1 }, preferred: false },
  { id: "v-snowflake",  name: "Snowflake (SaaS)",             category: "software", country: "US", kind: "saas",        performance: { onTimePct: 100, qualityScore: 4.8, invoiceAccuracyPct: 100, nps: 70, contractsOpen: 1 }, preferred: true },
  { id: "v-aws",        name: "AWS (infra)",                  category: "infra",    country: "US", kind: "infra",      performance: { onTimePct: 100, qualityScore: 4.7, invoiceAccuracyPct: 100, nps: 64, contractsOpen: 1 }, preferred: true },
  { id: "v-audit",      name: "BlackRidge Audit & Advisory",  category: "vendor",   country: "IN", kind: "firm",       performance: { onTimePct: 70, qualityScore: 3.9, invoiceAccuracyPct: 88, nps: 12, contractsOpen: 1 }, preferred: false },
  { id: "v-counsel",    name: "Kotak Legal Counsel",          category: "vendor",   country: "IN", kind: "firm",       performance: { onTimePct: 78, qualityScore: 4.0, invoiceAccuracyPct: 92, nps: 28, contractsOpen: 1 }, preferred: false },
  { id: "v-contractor-noah", name: "Noah Williams (contractor)", category: "labor",   country: "US", kind: "contractor", performance: { onTimePct: 96, qualityScore: 4.5, invoiceAccuracyPct: 100, nps: 50, contractsOpen: 1 }, preferred: true, hrUserId: "u-noah" },
];

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: "po-1", number: "PO-2026-104", projectId: "p-phoenix",  vendorId: "v-paygw",     amount: 24_00_000, currency: "INR", amountDrawn: 17_00_000, issuedISO: "2026-02-15", expectedCloseISO: "2026-09-30", status: "partial",  description: "Payments gateway specialist firm — 6 months SoW" },
  { id: "po-2", number: "PO-2026-088", projectId: "p-jp-launch",vendorId: "v-pmi",       amount: 26_000,    currency: "SGD", amountDrawn: 22_000,    issuedISO: "2026-04-15", expectedCloseISO: "2026-09-30", status: "partial",  description: "PMI partnership engagement" },
  { id: "po-3", number: "PO-2026-091", projectId: "p-jp-launch",vendorId: "v-transl",    amount:  8_000,    currency: "USD", amountDrawn:  5_500,    issuedISO: "2026-04-20", expectedCloseISO: "2026-07-15", status: "partial",  description: "ja-JP translation + tax-rule review" },
  { id: "po-4", number: "PO-2026-077", projectId: "p-datamesh", vendorId: "v-snowflake", amount: 12_000,    currency: "USD", amountDrawn:  6_000,    issuedISO: "2026-04-01", expectedCloseISO: "2027-03-31", status: "open",     description: "Snowflake credits — annual" },
  { id: "po-5", number: "PO-2026-019", projectId: "p-phoenix",  vendorId: "v-aws",       amount: 14_000,    currency: "USD", amountDrawn:  5_200,    issuedISO: "2026-01-15", expectedCloseISO: "2026-12-31", status: "open",     description: "AWS infra commitment" },
  { id: "po-6", number: "PO-2026-061", projectId: "p-dpdp",     vendorId: "v-audit",     amount: 18_00_000, currency: "INR", amountDrawn: 18_00_000, issuedISO: "2026-02-01", expectedCloseISO: "2026-06-30", status: "received", description: "Mid-program audit + Type-II readiness" },
  { id: "po-7", number: "PO-2026-070", projectId: "p-dpdp",     vendorId: "v-counsel",   amount: 14_00_000, currency: "INR", amountDrawn: 14_00_000, issuedISO: "2026-02-12", expectedCloseISO: "2026-06-30", status: "received", description: "Outside counsel — DPA review (overran)" },
  { id: "po-8", number: "PO-2026-130", projectId: "p-phoenix",  vendorId: "v-contractor-noah", amount: 18_000, currency: "USD", amountDrawn: 4_200, issuedISO: "2026-05-01", expectedCloseISO: "2026-08-31", status: "open", description: "Backend contractor (Noah Williams) — 3 months" },
];

/* ── Timesheet approval chain ─────────────────────────────── */

export type ApprovalLayer = "manager" | "project" | "client_bill";

export const APPROVAL_LAYER_LABEL: Record<ApprovalLayer, string> = {
  manager: "Manager",
  project: "Project",
  client_bill: "Client billable",
};

export interface TimesheetApproval {
  id: string;
  /** Timesheet entry being approved. */
  timeEntryId: string;
  /** Layer in the approval chain. */
  layer: ApprovalLayer;
  /** Approver person id. */
  approverId: string;
  /** Status. */
  status: "pending" | "approved" | "rejected";
  /** When the action happened. */
  whenISO?: string;
  /** Reason for rejection. */
  rejectionReason?: string;
}

export const APPROVAL_CHAIN: TimesheetApproval[] = [
  /* te-1 Priya — webhook shim: manager approved, project approved, client_bill skipped (non-billable) */
  { id: "ap-1a", timeEntryId: "te-1",  layer: "manager", approverId: "p-rajiv",  status: "approved", whenISO: "2026-05-11T18:00:00" },
  { id: "ap-1b", timeEntryId: "te-1",  layer: "project", approverId: "p-vikram", status: "pending"  },

  /* te-2 Priya — Acme multi-sig walkthrough: billable, full chain */
  { id: "ap-2a", timeEntryId: "te-2",  layer: "manager",     approverId: "p-rajiv",  status: "approved", whenISO: "2026-05-11T18:02:00" },
  { id: "ap-2b", timeEntryId: "te-2",  layer: "project",     approverId: "p-aisha",  status: "approved", whenISO: "2026-05-11T19:00:00" },
  { id: "ap-2c", timeEntryId: "te-2",  layer: "client_bill", approverId: "p-vikram", status: "pending"  },

  /* te-3 Sneha — JP timestamp bug RCA: manager pending */
  { id: "ap-3a", timeEntryId: "te-3",  layer: "manager", approverId: "p-rajiv",  status: "pending" },

  /* te-5 Sophia KYB UX — billable, manager approved, project rejected for note */
  { id: "ap-5a", timeEntryId: "te-5",  layer: "manager",     approverId: "p-rajiv",  status: "approved", whenISO: "2026-05-11T19:30:00" },
  { id: "ap-5b", timeEntryId: "te-5",  layer: "project",     approverId: "p-aisha",  status: "rejected", whenISO: "2026-05-11T20:00:00", rejectionReason: "Two of the hours look like Phoenix work — please split." },

  /* te-9 Anil DPDP follow-ups */
  { id: "ap-9a", timeEntryId: "te-9",  layer: "manager", approverId: "p-meera",  status: "approved", whenISO: "2026-05-11T17:00:00" },
  { id: "ap-9b", timeEntryId: "te-9",  layer: "project", approverId: "p-anil",   status: "approved", whenISO: "2026-05-11T17:01:00" },
];

export function chainForTimeEntry(timeEntryId: string): TimesheetApproval[] {
  const order: Record<ApprovalLayer, number> = { manager: 0, project: 1, client_bill: 2 };
  return APPROVAL_CHAIN
    .filter((a) => a.timeEntryId === timeEntryId)
    .sort((a, b) => order[a.layer] - order[b.layer]);
}
