import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { RosaryExperience } from "@/components/rosary/rosary-experience";

export const metadata: Metadata = { title: "Rosary" };

export default function RosaryPage() {
  return (
    <>
      <PageHeader title="The Rosary" description="Pray with the mysteries of today." />
      <RosaryExperience />
    </>
  );
}
