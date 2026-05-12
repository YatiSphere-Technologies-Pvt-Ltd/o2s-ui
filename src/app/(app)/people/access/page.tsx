"use client";

import { UserCircle } from "lucide-react";
import { ModuleAccessPage } from "@/components/admin/module-access-page";

export default function PeopleAccessPage() {
  return (
    <ModuleAccessPage
      module="people"
      moduleLabel="People & HR"
      homeHref="/people"
      accent="bg-brand-teal/10 text-brand-teal"
      icon={UserCircle}
    />
  );
}
