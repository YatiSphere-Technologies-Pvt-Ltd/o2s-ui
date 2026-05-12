"use client";

import { Users } from "lucide-react";
import { ModuleAccessPage } from "@/components/admin/module-access-page";

export default function TalentAccessPage() {
  return (
    <ModuleAccessPage
      module="talent"
      moduleLabel="Talent Acquisition"
      homeHref="/talent"
      accent="bg-brand-purple/10 text-brand-purple"
      icon={Users}
    />
  );
}
