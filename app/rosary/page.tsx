import type { Metadata } from "next";
import { Cross } from "lucide-react";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Rosary" };

export default function RosaryPage() {
  return (
    <>
      <PageHeader title="The Rosary" description="Pray with the mysteries of today." />
      <EmptyState
        icon={Cross}
        title="The Rosary is being prepared"
        description="The interactive, offline Rosary arrives in the next phase."
      />
    </>
  );
}
