import type { Metadata } from "next";

import { LearnPage, LearnSection } from "@/components/learn/learn-page";
import { PracticeSteps } from "@/components/learn/practice-steps";
import { GUIDES } from "@/components/seo/practice-guide";
import { pageMetadata } from "@/lib/seo";

const PATH = "/learn/how-to-pray-the-angelus";
const TITLE = "How to pray the Angelus";
const DESCRIPTION = "Learn how to pray the Angelus step by step: the three verses, the Hail Marys, the closing prayer, and the times of day it is prayed.";

export const metadata: Metadata = pageMetadata({ title: `${TITLE}: a step-by-step guide`, description: DESCRIPTION, path: PATH });

export default function HowToPrayAngelusPage() {
  return (
    <LearnPage
      title={TITLE}
      intro={DESCRIPTION}
      path={PATH}
      cta={{ href: "/angelus", label: "Open the guided Angelus", text: "Ora lays out the Angelus one step at a time." }}
    >
      <LearnSection title="What is the Angelus?">
        <p className="prayer-text">{GUIDES.angelus.definition}</p>
      </LearnSection>

      <LearnSection title="How to pray the Angelus, step by step">
        <PracticeSteps practice="angelus" />
      </LearnSection>

      <LearnSection title="When is the Angelus prayed?">
        <p className="prayer-text">
          Traditionally it is prayed three times a day: at 6 in the morning, at noon and at 6 in the evening, often to the sound of church
          bells. In the Easter season many people pray the Regina Caeli in its place.
        </p>
      </LearnSection>
    </LearnPage>
  );
}
