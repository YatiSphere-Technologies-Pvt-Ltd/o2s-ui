"use client";

import { Plane } from "lucide-react";
import { ModuleAccessPage } from "@/components/admin/module-access-page";

export default function LeaveAccessPage() {
  return (
    <ModuleAccessPage
      module="leave"
      moduleLabel="Leave Management"
      homeHref="/leave"
      accent="bg-brand/10 text-brand"
      icon={Plane}
    />
  );
}
