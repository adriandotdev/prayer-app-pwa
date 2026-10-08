import { LocalDate } from "@/components/local-date";
import { MYSTERY_SETS } from "@/data/rosary/mysteries";
import { getRosaryHistory } from "@/lib/rosary/queries";

export async function RosaryHistory() {
  const { total, recent } = await getRosaryHistory();

  return (
    <section aria-labelledby="history-heading">
      <h2 id="history-heading" className="font-heading text-2xl">
        Rosary history
      </h2>
      {total === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Rosaries you finish while signed in will appear here.
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} {total === 1 ? "Rosary" : "Rosaries"} completed
          </p>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
            {recent.map((s) => (
              <li key={s.id} className="flex min-h-12 items-center justify-between gap-3 px-4 py-3">
                <span className="font-medium">{MYSTERY_SETS[s.mystery_set]?.name ?? s.mystery_set}</span>
                <span className="text-sm text-muted-foreground">
                  <LocalDate iso={s.completed_at} />
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
