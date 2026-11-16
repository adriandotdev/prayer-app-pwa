import type { Metadata } from "next";

import { LearnPage, LearnSection } from "@/components/learn/learn-page";
import { PracticeSteps } from "@/components/learn/practice-steps";
import { GUIDES } from "@/components/seo/practice-guide";
import { pageMetadata } from "@/lib/seo";

const PATH = "/learn/how-to-pray-the-stations-of-the-cross";
const TITLE = "How to pray the Stations of the Cross";
const DESCRIPTION = "Learn how to pray the Stations of the Cross: the fourteen stations, what to say at each one, and when the devotion is prayed.";

export const metadata: Metadata = pageMetadata({ title: `${TITLE}: a step-by-step guide`, description: DESCRIPTION, path: PATH });

export default function HowToPrayStationsPage() {
  const stations = GUIDES["stations-of-the-cross"];
  return (
    <LearnPage
      title={TITLE}
      intro={DESCRIPTION}
      path={PATH}
      cta={{ href: "/stations-of-the-cross", label: "Open the guided Stations", text: "Ora walks you through the fourteen stations one at a time." }}
    >
      <LearnSection title="What are the Stations of the Cross?">
        <p className="prayer-text">{stations.definition}</p>
      </LearnSection>

      <LearnSection title="How to pray the Stations of the Cross, step by step">
        <PracticeSteps practice="stations-of-the-cross" />
      </LearnSection>

      {stations.notes?.map((n) => (
        <LearnSection key={n.heading} title={n.heading}>
          <p className="prayer-text">{n.text}</p>
        </LearnSection>
      ))}

      <LearnSection title="Do I have to be in a church?">
        <p className="prayer-text">
          No. Many churches have the fourteen stations on their walls and people walk from one to the next, but you can pray them
          anywhere by following the stations in order.
        </p>
      </LearnSection>
    </LearnPage>
  );
}
