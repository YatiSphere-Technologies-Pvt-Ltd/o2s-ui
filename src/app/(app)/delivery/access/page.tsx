"use client";

import { Kanban } from "lucide-react";
import { ModuleAccessPage } from "@/components/admin/module-access-page";

export default function DeliveryAccessPage() {
  return (
    <ModuleAccessPage
      module="delivery"
      moduleLabel="Delivery & PMO"
      homeHref="/delivery"
      accent="bg-warning/10 text-warning"
      icon={Kanban}
    />
  );
}
