"use client";

import { PrefsProvider } from "@/lib/prefs-context";
import { RoleProvider } from "@/lib/role-context";
import { ScreenContextProvider } from "@/lib/screen-context";
import { NotificationsProvider } from "@/lib/notifications";

export function AppShellProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrefsProvider>
      <RoleProvider>
        <ScreenContextProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </ScreenContextProvider>
      </RoleProvider>
    </PrefsProvider>
  );
}
