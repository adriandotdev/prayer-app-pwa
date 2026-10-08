import type { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { BottomNav } from "./bottom-nav";
import { MobileHeader } from "./mobile-header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <AppSidebar />
      <div className="md:pl-60">
        <MobileHeader />
        <main
          id="main"
          className="mx-auto w-full max-w-3xl px-5 pt-8 pb-28 md:px-10 md:pt-14 md:pb-16"
        >
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
