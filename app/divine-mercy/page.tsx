import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PracticeGuide } from "@/components/seo/practice-guide";
import { DivineMercyExperience } from "@/components/divine-mercy/divine-mercy-experience";

export const metadata: Metadata = pageMetadata({
  title: "Divine Mercy Chaplet",
  description: "Pray the Chaplet of Divine Mercy on the beads of the Rosary, guided step by step.",
  path: "/divine-mercy",
});

export default function DivineMercyPage() {
  return <DivineMercyExperience guide={<PracticeGuide practice="divine-mercy" />} />;
}
