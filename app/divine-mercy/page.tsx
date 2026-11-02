import type { Metadata } from "next";
import { DivineMercyExperience } from "@/components/divine-mercy/divine-mercy-experience";

export const metadata: Metadata = { title: "Divine Mercy Chaplet" };

export default function DivineMercyPage() {
  return <DivineMercyExperience />;
}
