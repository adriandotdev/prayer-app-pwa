import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PracticeGuide } from "@/components/seo/practice-guide";
import { AngelusExperience } from "@/components/angelus/angelus-experience";

export const metadata: Metadata = pageMetadata({
  title: "The Angelus prayer",
  description: "Pray the Angelus at morning, noon and evening, with the full text and responses laid out one step at a time.",
  path: "/angelus",
});

export default function AngelusPage() {
  return <AngelusExperience guide={<PracticeGuide practice="angelus" />} />;
}
