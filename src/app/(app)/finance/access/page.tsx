"use client";

import { DollarSign } from "lucide-react";
import { ModuleAccessPage } from "@/components/admin/module-access-page";

export default function FinanceAccessPage() {
  return (
    <ModuleAccessPage
      module="finance"
      moduleLabel="Finance"
      homeHref="/finance/expenses"
      accent="bg-[#38BDF8]/10 text-[#38BDF8]"
      icon={DollarSign}
    />
  );
}
