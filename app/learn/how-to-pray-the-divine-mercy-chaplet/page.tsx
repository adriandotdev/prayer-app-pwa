import type { Metadata } from "next";
import Link from "next/link";

import { LearnPage, LearnSection } from "@/components/learn/learn-page";
import { PracticeSteps } from "@/components/learn/practice-steps";
import { GUIDES } from "@/components/seo/practice-guide";
import { pageMetadata } from "@/lib/seo";

const PATH = "/learn/how-to-pray-the-divine-mercy-chaplet";
const TITLE = "How to pray the Divine Mercy Chaplet";
const DESCRIPTION =
  "Learn how to pray the Chaplet of Divine Mercy on Rosary beads: the opening, the five decades, the closing, and when it is traditionally prayed.";

export const metadata: Metadata = pageMetadata({ title: `${TITLE}: a step-by-step guide`, description: DESCRIPTION, path: PATH });

export default function HowToPrayDivineMercyPage() {
  return (
    <LearnPage
      title={TITLE}
      intro={DESCRIPTION}
      path={PATH}
      cta={{ href: "/divine-mercy", label: "Open the guided chaplet", text: "Ora guides you through the Divine Mercy Chaplet bead by bead." }}
    >
      <LearnSection title="What is the Chaplet of Divine Mercy?">
        <p className="prayer-text">{GUIDES["divine-mercy"].definition}</p>
      </LearnSection>

      <LearnSection title="How to pray the Chaplet of Divine Mercy, step by step">
        <PracticeSteps practice="divine-mercy" />
      </LearnSection>

      <LearnSection title="When is the Chaplet prayed?">
        <p className="prayer-text">
          You may pray it at any time. It is often prayed at three in the afternoon, the hour Christians remember the death of Jesus, and
          especially in the novena that begins on Good Friday and ends on Divine Mercy Sunday, the Sunday after Easter.
        </p>
      </LearnSection>

      <LearnSection title="Do I need a Rosary to pray it?">
        <p className="prayer-text">
          The Chaplet uses the same beads as the Rosary, but they are not required. You can count each set of ten prayers on your fingers.
          If you also pray the Rosary, see <Link href="/learn/how-to-pray-the-rosary" className="underline underline-offset-4">how to pray the Rosary</Link>.
        </p>
      </LearnSection>
    </LearnPage>
  );
}
