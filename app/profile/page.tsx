import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profile" />
      <EmptyState
        icon={UserRound}
        title="Sign-in is coming soon"
        description="You'll be able to sign in with a magic link or Google to keep your prayers across devices."
      />
    </>
  );
}
