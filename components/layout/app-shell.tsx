import type { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { BottomNav } from "./bottom-nav";
import { MobileHeader } from "./mobile-header";
import { RouteFocus } from "./route-focus";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";
import { Toaster } from "@/components/toast/toaster";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <RouteFocus />
      <div data-shell-chrome>
        <AppSidebar />
      </div>
      {/* One centered frame (sidebar + content), so on very wide screens the two stay together. */}
      <div data-shell-frame className="mx-auto max-w-[90rem] md:pl-60 lg:pl-72">
        {/* In flow, not fixed: it pushes the header and back buttons down instead of covering them. */}
        <div data-shell-chrome>
          <OfflineIndicator />
          <MobileHeader />
        </div>
        <main
          data-shell-main
          id="main"
          tabIndex={-1}
          className="mx-auto outline-none w-full max-w-3xl px-4 pt-6 pb-[calc(var(--bottom-nav-height)+1.5rem)] md:px-10 md:pt-14 md:pb-16 lg:max-w-6xl lg:px-14 lg:pt-16 lg:pb-20"
        >
          <div data-shell-chrome>
            <InstallPrompt />
          </div>
          {children}
        </main>
      </div>
      <div data-shell-chrome>
        <BottomNav />
      </div>
      <Toaster />
    </div>
  );
}
