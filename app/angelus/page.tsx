import type { Metadata } from "next";
import { AngelusExperience } from "@/components/angelus/angelus-experience";

export const metadata: Metadata = { title: "The Angelus" };

export default function AngelusPage() {
  return <AngelusExperience />;
}
