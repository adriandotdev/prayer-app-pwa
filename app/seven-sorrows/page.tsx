import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PracticeGuide } from "@/components/seo/practice-guide";
import { SevenSorrowsExperience } from "@/components/seven-sorrows/seven-sorrows-experience";

export const metadata: Metadata = pageMetadata({
  title: "Chaplet of the Seven Sorrows",
  description: "Pray the Seven Sorrows of Mary one step at a time, with a short reflection on each sorrow and the Hail Marys counted for you.",
  path: "/seven-sorrows",
});

export default function SevenSorrowsPage() {
  return <SevenSorrowsExperience guide={<PracticeGuide practice="seven-sorrows" />} />;
}
