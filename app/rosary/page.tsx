import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { RosaryExperience } from "@/components/rosary/rosary-experience";

export const metadata: Metadata = pageMetadata({
  title: "Pray the Rosary online",
  description:
    "Pray the Rosary bead by bead. Choose the Joyful, Sorrowful, Glorious or Luminous mysteries, or follow today's. Free, no account needed, and it works offline.",
  path: "/rosary",
});

export default function RosaryPage() {
  return (
    <RosaryExperience />
  );
}
