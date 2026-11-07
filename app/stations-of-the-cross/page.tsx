import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PracticeGuide } from "@/components/seo/practice-guide";
import { StationsOfTheCrossExperience } from "@/components/stations-of-the-cross/stations-of-the-cross-experience";

export const metadata: Metadata = pageMetadata({
  title: "Stations of the Cross",
  description: "Pray the fourteen Stations of the Cross one step at a time, with a short reflection and prayer at each station.",
  path: "/stations-of-the-cross",
});

export default function StationsOfTheCrossPage() {
  return <StationsOfTheCrossExperience guide={<PracticeGuide practice="stations-of-the-cross" />} />;
}
