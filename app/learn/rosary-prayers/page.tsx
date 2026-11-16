import type { Metadata } from "next";
import Link from "next/link";

import { LearnPage, LearnSection } from "@/components/learn/learn-page";
import { ROSARY_PRAYERS } from "@/data/rosary/prayers";
import { pageMetadata } from "@/lib/seo";

const PATH = "/learn/rosary-prayers";
const TITLE = "Rosary prayers: full text";
const DESCRIPTION =
  "The full text of every Rosary prayer: Sign of the Cross, Apostles’ Creed, Our Father, Hail Mary, Glory Be, Fatima Prayer, Hail, Holy Queen and the closing prayer.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const ORDER = ["sign-of-the-cross", "creed", "our-father", "hail-mary", "glory-be", "fatima", "hail-holy-queen", "closing-prayer"];

export default function RosaryPrayersPage() {
  return (
    <LearnPage title={TITLE} intro={DESCRIPTION} path={PATH}>
      <p className="prayer-text">
        These are the traditional English texts of the prayers used in the Rosary, in the order you pray them. For how they fit together,
        see <Link href="/learn/how-to-pray-the-rosary" className="underline underline-offset-4">how to pray the Rosary</Link>.
      </p>
      {ORDER.map((id) => {
        const p = ROSARY_PRAYERS[id];
        if (!p) return null;
        return (
          <LearnSection key={id} title={p.name}>
            {p.text.map((line) => (
              <p key={line} className="prayer-text">{line}</p>
            ))}
            {p.learn ? <p className="text-sm text-muted-foreground">{p.learn}</p> : null}
          </LearnSection>
        );
      })}
    </LearnPage>
  );
}
