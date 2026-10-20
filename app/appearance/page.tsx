import type { Metadata } from "next";

import { AppearanceScreen } from "@/components/appearance/appearance-screen";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Appearance" };

export default function AppearancePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Appearance" description="Choose how Ora is colored. Preview it before you apply." />
      <AppearanceScreen />
    </div>
  );
}
