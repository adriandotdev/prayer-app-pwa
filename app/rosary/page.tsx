import type { Metadata } from "next";
import { RosaryExperience } from "@/components/rosary/rosary-experience";

export const metadata: Metadata = { title: "Rosary" };

export default function RosaryPage() {
  return (
    <RosaryExperience />
  );
}
