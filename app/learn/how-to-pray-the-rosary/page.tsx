import type { Metadata } from "next";
import Link from "next/link";

import { LearnPage, LearnSection } from "@/components/learn/learn-page";
import { pageMetadata } from "@/lib/seo";

const PATH = "/learn/how-to-pray-the-rosary";
const TITLE = "How to pray the Rosary";
const DESCRIPTION =
  "Learn how to pray the Rosary step by step: the prayers, the five decades, which mysteries to pray, and how long it takes.";

export const metadata: Metadata = pageMetadata({ title: `${TITLE}: a step-by-step guide`, description: DESCRIPTION, path: PATH });

const STEPS = [
  { name: "Begin at the crucifix", text: "Make the Sign of the Cross and pray the Apostles’ Creed." },
  { name: "Pray the opening beads", text: "On the first large bead pray an Our Father. On the next three small beads pray a Hail Mary each, then a Glory Be." },
  { name: "Announce the first mystery", text: "Name the mystery and pause to think about it, then pray an Our Father on the large bead." },
  { name: "Pray the decade", text: "On the ten small beads pray ten Hail Marys while reflecting on the mystery. Finish with a Glory Be and the Fatima Prayer." },
  { name: "Repeat for the other four mysteries", text: "Announce each mystery in turn and pray its decade the same way." },
  { name: "Close the Rosary", text: "Pray the Hail, Holy Queen and the closing prayer, then make the Sign of the Cross." },
];

export default function HowToPrayTheRosaryPage() {
  return (
    <LearnPage title={TITLE} intro={DESCRIPTION} path={PATH}>
      <LearnSection title="What is the Rosary?">
        <p className="prayer-text">
          The Rosary is a Catholic prayer in which you meditate on the life of Jesus and Mary while praying on a string of beads. It is
          made of five decades. Each decade is one Our Father, ten Hail Marys and a Glory Be, prayed while you reflect on one mystery. A
          full Rosary takes about 15 to 20 minutes. Beads are a help, not a requirement: you can count on your fingers or follow along in
          an app.
        </p>
      </LearnSection>

      <LearnSection title="How to pray the Rosary, step by step">
        <ol className="space-y-5">
          {STEPS.map((s, i) => (
            <li key={s.name} className="grid grid-cols-[2rem_1fr] gap-x-4">
              <span
                aria-hidden
                className="flex size-8 items-center justify-center rounded-full bg-secondary font-sans text-sm font-medium text-secondary-foreground tabular-nums"
              >
                {i + 1}
              </span>
              <div className="pt-0.5">
                <h3 className="font-sans text-base font-medium leading-snug">{s.name}</h3>
                <p className="prayer-text mt-1">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="prayer-text">
          The words of every prayer are on one page: <Link href="/learn/rosary-prayers" className="underline underline-offset-4">Rosary prayers, full text</Link>.
        </p>
      </LearnSection>

      <LearnSection title="Which mysteries should I pray?">
        <p className="prayer-text">
          There are four sets of mysteries: Joyful, Sorrowful, Glorious and Luminous. Each set has five. By tradition each day of the week
          has its own set, though you may pray any set on any day. See{" "}
          <Link href="/learn/rosary-mysteries-by-day" className="underline underline-offset-4">which mysteries to pray each day</Link>.
        </p>
      </LearnSection>

      <LearnSection title="How long does the Rosary take?">
        <p className="prayer-text">
          One set of five mysteries usually takes 15 to 20 minutes at an unhurried pace. If you are short of time, you can pray a single
          decade and continue later. Praying regularly matters more than praying long.
        </p>
      </LearnSection>

      <LearnSection title="Tips for a first Rosary">
        <ul className="prayer-text list-disc space-y-2 pl-5">
          <li>Go slowly. The prayers are a rhythm for your attention, not a race.</li>
          <li>Don’t worry about wandering thoughts. Gently return to the mystery.</li>
          <li>Pray the set for the day to begin with, so there is one less choice to make.</li>
        </ul>
      </LearnSection>
    </LearnPage>
  );
}
