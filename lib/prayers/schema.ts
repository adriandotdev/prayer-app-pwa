import { z } from "zod";

export const prayerSchema = z.object({
  title: z.string().trim().min(1, "Give your prayer a title.").max(200, "Keep the title under 200 characters."),
  body: z.string().trim().min(1, "Write the prayer text.").max(20000, "That prayer is too long."),
  source: z.string().trim().max(200, "Keep the source under 200 characters."),
});

export const FILTERS = ["all", "mine", "starter", "favorites"] as const;
export type PrayerFilter = (typeof FILTERS)[number];

export function parseFilter(value: string | string[] | undefined): PrayerFilter {
  const v = Array.isArray(value) ? value[0] : value;
  return (FILTERS as readonly string[]).includes(v ?? "") ? (v as PrayerFilter) : "all";
}
