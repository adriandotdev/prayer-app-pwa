import { RosaryCalendar } from "@/components/rosary/rosary-calendar";
import { getRosaryStatsRows } from "@/lib/rosary/queries";

export async function RosaryCalendarCard() {
  const rows = await getRosaryStatsRows();

  return (
    <section aria-labelledby="calendar-heading">
      <h2 id="calendar-heading" className="font-heading text-4xl">
        Prayer calendar
      </h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Finish a Rosary while signed in and the days you pray will be marked here.</p>
      ) : (
        <RosaryCalendar rows={rows} />
      )}
    </section>
  );
}
