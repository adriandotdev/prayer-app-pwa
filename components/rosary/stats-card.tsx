import { RosaryStatsView } from "@/components/rosary/stats-view";
import { getRosaryStatsRows } from "@/lib/rosary/queries";

/** Renders nothing before the first Rosary: the calendar card carries the empty state. */
export async function RosaryStatsCard() {
  const rows = await getRosaryStatsRows();
  if (rows.length === 0) return null;

  return (
    <div className="rounded-3xl bg-card p-5 md:p-8">
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="font-heading text-2xl">
          Your prayer
        </h2>
        <RosaryStatsView rows={rows} />
      </section>
    </div>
  );
}
