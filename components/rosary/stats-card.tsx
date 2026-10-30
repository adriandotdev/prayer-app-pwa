import { RosaryStatsView } from "@/components/rosary/stats-view";
import { getRosaryStatsRows } from "@/lib/rosary/queries";

export async function RosaryStatsCard() {
  const rows = await getRosaryStatsRows();

  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="font-heading text-3xl">
        Your prayer
      </h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Finish a Rosary while signed in and your prayer so far will gather here.
        </p>
      ) : (
        <RosaryStatsView rows={rows} />
      )}
    </section>
  );
}
