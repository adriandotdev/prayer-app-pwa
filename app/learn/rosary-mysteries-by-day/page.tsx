import type { Metadata } from "next";
import Link from "next/link";

import { LearnPage, LearnSection } from "@/components/learn/learn-page";
import { MYSTERY_SETS } from "@/data/rosary/mysteries";
import { mysterySetForDay } from "@/data/rosary/schedule";
import { pageMetadata } from "@/lib/seo";

const PATH = "/learn/rosary-mysteries-by-day";
const TITLE = "Rosary mysteries by day of the week";
const DESCRIPTION =
  "Which Rosary mysteries to pray on each day of the week: Joyful, Sorrowful, Glorious and Luminous, with all 20 mysteries listed.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ORDER = ["joyful", "luminous", "sorrowful", "glorious"] as const;

export default function RosaryMysteriesByDayPage() {
  return (
    <LearnPage title={TITLE} intro={DESCRIPTION} path={PATH}>
      <LearnSection title="The weekly schedule">
        <p className="prayer-text">
          By tradition each day of the week has its own set of mysteries. This is a custom, not a rule, so you may pray any set on any day.
        </p>
        <table className="w-full max-w-md text-left">
          <caption className="sr-only">Rosary mysteries for each day of the week</caption>
          <thead>
            <tr className="border-b border-border text-sm text-muted-foreground">
              <th scope="col" className="py-2 pr-4 font-medium">Day</th>
              <th scope="col" className="py-2 font-medium">Mysteries</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, i) => (
              <tr key={day} className="border-b border-border">
                <th scope="row" className="py-3 pr-4 font-medium">{day}</th>
                <td className="py-3">{MYSTERY_SETS[mysterySetForDay(i)].name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="prayer-text">
          Some people pray the Joyful Mysteries on Sundays in Advent and the Christmas season, and the Sorrowful Mysteries on Sundays in
          Lent. The Luminous Mysteries were added by Pope John Paul II in 2002 and are traditionally prayed on Thursday.
        </p>
      </LearnSection>

      {ORDER.map((id) => {
        const set = MYSTERY_SETS[id];
        const days = DAYS.filter((_, i) => mysterySetForDay(i) === id);
        return (
          <LearnSection key={id} title={set.name}>
            <p className="text-sm text-muted-foreground">Prayed on {days.join(" and ")}.</p>
            <ol className="space-y-4">
              {set.mysteries.map((m, i) => (
                <li key={m.name}>
                  <h3 className="font-sans text-base font-medium leading-snug">
                    {i + 1}. {m.name} <span className="font-normal text-muted-foreground">({m.scripture})</span>
                  </h3>
                  <p className="prayer-text mt-1">{m.meditation}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Fruit of the mystery: {m.fruit}.</p>
                </li>
              ))}
            </ol>
          </LearnSection>
        );
      })}

      <p className="prayer-text">
        New to the Rosary? Start with <Link href="/learn/how-to-pray-the-rosary" className="underline underline-offset-4">how to pray the Rosary</Link>.
      </p>
    </LearnPage>
  );
}
