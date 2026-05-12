"use client";

import { Scale } from "lucide-react";
import { ModuleAccessPage } from "@/components/admin/module-access-page";

export default function LegalAccessPage() {
  return (
    <ModuleAccessPage
      module="legal"
      moduleLabel="Legal"
      homeHref="/legal"
      accent="bg-destructive/10 text-destructive"
      icon={Scale}
    />
  );
}
