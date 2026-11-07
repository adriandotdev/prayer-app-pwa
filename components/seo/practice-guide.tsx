import { CONTENT_REVIEWED } from "@/lib/site";

type Practice = "rosary" | "angelus" | "divine-mercy" | "seven-sorrows" | "stations-of-the-cross";

type Guide = {
  title: string;
  /** Direct definition, first thing in the section. */
  definition: string;
  stepsHeading: string;
  steps: { name: string; text: string }[];
  /** Optional short facts worth quoting, shown under the steps. */
  notes?: { heading: string; text: string }[];
};

const GUIDES: Record<Practice, Guide> = {
  rosary: {
    title: "What is the Rosary?",
    definition:
      "The Rosary is a Catholic prayer in which you meditate on the life of Jesus and Mary while praying on a string of beads. It is made of five decades, and each decade is one Our Father, ten Hail Marys and a Glory Be, prayed while reflecting on one mystery. A full Rosary takes about 15 to 20 minutes.",
    stepsHeading: "How to pray the Rosary, step by step",
    steps: [
      { name: "Begin at the crucifix", text: "Make the Sign of the Cross and pray the Apostles’ Creed." },
      { name: "Pray the opening beads", text: "On the first large bead pray an Our Father, then a Hail Mary on each of the next three small beads, and a Glory Be." },
      { name: "Announce the first mystery", text: "Name the mystery and pause to think about it, then pray one Our Father on the large bead." },
      { name: "Pray the decade", text: "Pray ten Hail Marys on the ten small beads while reflecting on the mystery, then a Glory Be and the Fatima Prayer." },
      { name: "Repeat for the other four mysteries", text: "Announce each mystery in turn and pray its decade the same way." },
      { name: "Close the Rosary", text: "Pray the Hail, Holy Queen and finish with the Sign of the Cross." },
    ],
    notes: [
      {
        heading: "Which mysteries do you pray on which day?",
        text: "By tradition the Joyful Mysteries are prayed on Monday and Saturday, the Sorrowful on Tuesday and Friday, the Glorious on Wednesday and Sunday, and the Luminous on Thursday. You may pray any set on any day.",
      },
      {
        heading: "What are the four sets of mysteries?",
        text: "The Joyful Mysteries are the Annunciation, the Visitation, the Nativity, the Presentation and the Finding in the Temple. The Sorrowful are the Agony in the Garden, the Scourging, the Crowning with Thorns, the Carrying of the Cross and the Crucifixion. The Glorious are the Resurrection, the Ascension, the Descent of the Holy Spirit, the Assumption and the Coronation of Mary. The Luminous are the Baptism of Jesus, the Wedding at Cana, the Proclamation of the Kingdom, the Transfiguration and the Institution of the Eucharist.",
      },
    ],
  },
  angelus: {
    title: "What is the Angelus?",
    definition:
      "The Angelus is a short Catholic prayer that remembers the Incarnation, the moment the angel Gabriel announced to Mary that she would bear the Son of God. It has three short verses with responses, each followed by a Hail Mary, and a closing prayer. It takes about two minutes.",
    stepsHeading: "How to pray the Angelus",
    steps: [
      { name: "First verse", text: "The angel of the Lord declared unto Mary, and she conceived of the Holy Spirit. Then pray a Hail Mary." },
      { name: "Second verse", text: "Behold the handmaid of the Lord, be it done unto me according to your word. Then pray a Hail Mary." },
      { name: "Third verse", text: "And the Word was made flesh, and dwelt among us. Then pray a Hail Mary." },
      { name: "Closing prayer", text: "Pray the versicle and response, then the closing prayer asking that we be brought to the glory of the Resurrection through Christ." },
    ],
  },
  "divine-mercy": {
    title: "What is the Chaplet of Divine Mercy?",
    definition:
      "The Chaplet of Divine Mercy is a Catholic prayer given to St. Faustina Kowalska in the 1930s and prayed on ordinary Rosary beads. It offers the Body, Blood, Soul and Divinity of Jesus to the Father in atonement for sins, and asks for mercy on the whole world. It takes about ten minutes.",
    stepsHeading: "How to pray the Chaplet of Divine Mercy",
    steps: [
      { name: "Opening", text: "Make the Sign of the Cross, then pray an Our Father, a Hail Mary and the Apostles’ Creed." },
      { name: "Large bead of each decade", text: "Pray the Eternal Father prayer: offer the Body and Blood, Soul and Divinity of Jesus for our sins and those of the whole world." },
      { name: "Small beads of each decade", text: "Ten times, pray: Because of his suffering and death, be merciful to us and to the whole world." },
      { name: "Repeat for five decades", text: "Pray the large bead and the ten small beads again for each of the five decades." },
      { name: "Closing", text: "Pray three times: Holy God, holy and strong, holy and deathless, be merciful to us and to the whole world." },
    ],
  },
  "seven-sorrows": {
    title: "What is the Chaplet of the Seven Sorrows?",
    definition:
      "The Chaplet of the Seven Sorrows is a Catholic devotion, kept especially by the Servite order, that remembers seven sorrows in the life of Mary. You pray seven Hail Marys for each sorrow while reflecting on it, then three more Hail Marys at the end. It takes about 20 minutes.",
    stepsHeading: "How to pray the Seven Sorrows",
    steps: [
      { name: "Begin", text: "Make the Sign of the Cross and pray a short opening prayer to Mary, Mother of Sorrows." },
      { name: "Announce the sorrow", text: "Name the sorrow and pause to think about it: Simeon’s prophecy, the flight into Egypt, the loss of Jesus in the Temple, meeting Jesus on the way of the cross, the crucifixion, the taking down from the cross, and the burial." },
      { name: "Pray seven Hail Marys", text: "Pray a Hail Mary on each of the seven beads for that sorrow, keeping it in mind." },
      { name: "Repeat for the seven sorrows", text: "Move on to the next sorrow and pray its seven Hail Marys the same way." },
      { name: "Close", text: "Pray three more Hail Marys, the versicle asking for Mary’s prayers, a closing prayer and the Sign of the Cross." },
    ],
  },
  "stations-of-the-cross": {
    title: "What are the Stations of the Cross?",
    definition:
      "The Stations of the Cross are a Catholic devotion that follows Jesus along the way of the cross in fourteen stations, from his condemnation by Pilate to his burial in the tomb. They are especially prayed during Lent and on Fridays. A full round takes about 30 minutes.",
    stepsHeading: "How to pray the Stations of the Cross",
    steps: [
      { name: "Begin", text: "Make the Sign of the Cross and pray an opening prayer." },
      { name: "Say the versicle", text: "At each station, say: We adore you, O Christ, and we praise you. Because by your holy Cross you have redeemed the world." },
      { name: "Reflect and pray", text: "Pause to think about what happens at the station, and pray a short prayer on it." },
      { name: "Pray three prayers", text: "Pray an Our Father, a Hail Mary and a Glory Be, then move on to the next station." },
      { name: "Finish at the fourteenth station", text: "After the burial, pray a closing prayer and make the Sign of the Cross." },
    ],
    notes: [
      {
        heading: "What are the fourteen stations?",
        text: "Jesus is condemned to death, takes up his cross, falls the first time, meets his mother, is helped by Simon of Cyrene, has his face wiped by Veronica, falls the second time, speaks to the women of Jerusalem, falls the third time, is stripped of his garments, is nailed to the cross, dies on the cross, is taken down from the cross, and is laid in the tomb. Some stations come from tradition rather than the Gospels.",
      },
    ],
  },
};

/** Server-rendered text that explains the practice, so it is readable without running the player. */
export function PracticeGuide({ practice }: { practice: Practice }) {
  const g = GUIDES[practice];
  const id = `guide-${practice}`;

  return (
    <article
      aria-labelledby={`${id}-title`}
      className="flex flex-col rounded-3xl bg-card px-5 py-7 sm:px-8 sm:py-9"
    >
      <header className="max-w-[38rem]">
        <h2 id={`${id}-title`} className="font-heading text-balance text-3xl leading-tight sm:text-4xl">
          {g.title}
        </h2>
        <p className="prayer-text mt-4">{g.definition}</p>
      </header>

      <section aria-labelledby={`${id}-steps`} className="mt-10 border-t border-border pt-8">
        <h3 id={`${id}-steps`} className="font-heading text-balance text-2xl leading-snug">
          {g.stepsHeading}
        </h3>
        <ol className="mt-6 max-w-[38rem]">
          {g.steps.map((s, i) => (
            <li key={s.name} className="relative grid grid-cols-[2rem_1fr] gap-x-4 pb-6 last:pb-0">
              {i < g.steps.length - 1 && (
                <span aria-hidden className="absolute top-9 bottom-1 left-4 w-px -translate-x-1/2 bg-border" />
              )}
              <span
                aria-hidden
                className="flex size-8 items-center justify-center rounded-full bg-secondary font-sans text-sm font-medium text-secondary-foreground tabular-nums"
              >
                {i + 1}
              </span>
              <div className="pt-0.5">
                <h4 className="font-sans text-base font-medium leading-snug">{s.name}</h4>
                <p className="mt-1 font-serif text-[calc(1.05rem*var(--prayer-scale))] leading-relaxed text-foreground/85">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {g.notes && (
        <div className="mt-10 grid gap-8 border-t border-border pt-8 lg:grid-cols-2 lg:gap-10">
          {g.notes.map((n) => (
            <section key={n.heading}>
              <h3 className="font-heading text-balance text-2xl leading-snug">{n.heading}</h3>
              <p className="mt-3 font-serif text-[calc(1.05rem*var(--prayer-scale))] leading-relaxed text-foreground/85">
                {n.text}
              </p>
            </section>
          ))}
        </div>
      )}

      <p className="mt-10 border-t border-border pt-4 text-sm text-muted-foreground">
        Written by the Ora team. Last reviewed <time dateTime={CONTENT_REVIEWED}>4 November 2026</time>.
      </p>
    </article>
  );
}
