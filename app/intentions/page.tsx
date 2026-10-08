import type { Metadata } from "next";
import { HandHeart } from "lucide-react";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Intentions" };

export default function IntentionsPage() {
  return (
    <>
      <PageHeader title="Intentions" description="The people and needs you are praying for." />
      <EmptyState
        icon={HandHeart}
        title="No intentions yet"
        description="Once you sign in, you can write your intentions here and mark them answered."
      />
    </>
  );
}
