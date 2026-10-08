import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Prayers" };

export default function PrayersPage() {
  return (
    <>
      <PageHeader title="Prayers" description="Your personal prayer library." />
      <EmptyState
        icon={BookOpen}
        title="Your library is coming soon"
        description="You'll be able to write your own prayers, gather them into collections, and copy from a starter library of traditional prayers."
      />
    </>
  );
}
