"use client";

import { Monitor } from "lucide-react";
import { ModuleAccessPage } from "@/components/admin/module-access-page";

export default function ItRbacPage() {
  return (
    <ModuleAccessPage
      module="it"
      moduleLabel="IT"
      homeHref="/it/helpdesk"
      accent="bg-[#38BDF8]/10 text-[#38BDF8]"
      icon={Monitor}
    />
  );
}
