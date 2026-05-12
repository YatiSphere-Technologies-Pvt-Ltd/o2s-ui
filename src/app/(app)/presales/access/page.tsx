"use client";

import { Target } from "lucide-react";
import { ModuleAccessPage } from "@/components/admin/module-access-page";

export default function PresalesAccessPage() {
  return (
    <ModuleAccessPage
      module="presales"
      moduleLabel="Pre-Sales"
      homeHref="/presales"
      accent="bg-brand-purple/10 text-brand-purple"
      icon={Target}
    />
  );
}
