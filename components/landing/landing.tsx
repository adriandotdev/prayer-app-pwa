import Image from "next/image";
import Link from "next/link";

import { AppButton } from "@/components/app-button";
import {
  ANNUNCIATION_ALTARPIECE,
  ART_CREDIT,
  BLESSING,
  CORONATION_FRESCO,
  CORONATION_PANEL,
  DOMINIC,
  EMPYREAN,
  FRANCIS,
  MYSTERY_ART,
  VIRGIN,
} from "./art";
import { Decade } from "./decade";
import { HeroScene } from "./hero-scene";
import { MysteriesRow } from "./mysteries-row";
import { PrayerSlips } from "./prayer-slips";
import { RosaryWalk } from "./rosary-walk";
import { SaintWall } from "./saint-wall";
import { Depth, Unveil } from "./scrub";

const NOTEBOOK = [
  {
    title: "Your own prayers",
    text: "Write down the prayers that hold you, gather them into collections, and find them again when you need the words.",
    art: VIRGIN,
    shape: "land-margin-tall",
    sizes: "(min-width: 72rem) 25vw, (min-width: 48rem) 42vw, 100vw",
  },
  {
    title: "The people you carry",
    text: "Name your intentions, pray for them by name, and move them to Answered when grace arrives.",
    art: CORONATION_PANEL,
    shape: "land-margin-wide",
    sizes: "(min-width: 72rem) 50vw, (min-width: 48rem) 42vw, 72vw",
  },
  {
    title: "Ready in the quiet places",
    text: "The Rosary, the Divine Mercy Chaplet and the Angelus keep working offline, at the bedside or in the back pew.",
    art: MYSTERY_ART.sorrowful[0],
    shape: "land-margin-square",
    sizes: "(min-width: 72rem) 50vw, (min-width: 48rem) 42vw, 56vw",
  },
  {
    title: "The Church’s year around you",
    text: "Ora takes on the colour of the liturgical season, so Advent, Lent and Easter come to meet you when you open it.",
    art: MYSTERY_ART.joyful[2],
    shape: "land-margin-wide",
    sizes: "(min-width: 72rem) 25vw, (min-width: 48rem) 42vw, 100vw",
  },
  {
    title: "No streak to lose",
    text: "A gentle calendar remembers the days you prayed. There are no points and no guilt, only a place to return to.",
    art: FRANCIS,
    shape: "land-margin-tall",
    sizes: "(min-width: 72rem) 25vw, (min-width: 48rem) 42vw, 72vw",
  },
];

/** Giotto's stars for the vault of the saints' chapter, spread across the band above the words. */
const VAULT_STARS = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 61.8 + 3) % 98,
  y: (i * 37.3 + 2) % 6,
  r: 6 + ((i * 7) % 6),
}));

function VaultStar({ r }: { r: number }) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8;
    const d = i % 2 ? r * 0.3 : r;
    return `${(r + d * Math.cos(a)).toFixed(2)},${(r + d * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg width={r * 2} height={r * 2} aria-hidden>
      <polygon points={points} fill="currentColor" />
    </svg>
  );
}

export function Landing() {
  return (
    <div className="land">
      <section className="land-hero" aria-labelledby="land-title">
        <HeroScene />
      </section>

      <section id="why" className="land-why" aria-labelledby="why-title">
        <div className="land-why-text">
          <h2 id="why-title" className="land-h2 land-why-title">
            {/* The two lines draw near to each other. */}
            <Depth as="span" x={["-9vw", "0vw"]} offset={["start end", "start 45%"]}>
              Faith deepens
            </Depth>
            <Depth as="span" className="land-why-line" x={["9vw", "0vw"]} offset={["start end", "start 45%"]}>
              where you pray
            </Depth>
          </h2>
          <p className="land-statement">
            Saint Teresa of Ávila called prayer “a close sharing between friends.” Ora keeps that friendship near, wherever you
            are.
          </p>
          <Depth className="land-why-small" y={[56, -56]}>
            <Image src={DOMINIC.src} alt={DOMINIC.alt} fill sizes="(min-width: 48rem) 360px, 50vw" />
          </Depth>
        </div>
        <Unveil shape="arch" className="land-why-large">
          <Image src={CORONATION_FRESCO.src} alt={CORONATION_FRESCO.alt} fill sizes="(min-width: 48rem) 50vw, 75vw" />
        </Unveil>
      </section>

      <section id="mysteries" className="land-mysteries" aria-label="Today’s mysteries">
        <MysteriesRow />
      </section>

      <RosaryWalk />

      <Decade />

      <section id="prayers" className="land-prayers" aria-labelledby="prayers-title">
        <Depth className="land-prayers-back" y={["-5%", "5%"]}>
          <Image
            src={ANNUNCIATION_ALTARPIECE.src}
            alt={ANNUNCIATION_ALTARPIECE.alt}
            fill
            sizes="(min-width: 48rem) 100vw, 320vw"
            className="land-prayers-art"
          />
        </Depth>
        <div className="land-prayers-text">
          <h2 id="prayers-title" className="land-h2">
            The Church’s own words
          </h2>
          <p className="land-statement">
            Every prayer Ora gives you is the traditional text: never paraphrased, never shortened.
          </p>
        </div>
        <PrayerSlips />
      </section>

      <section id="notebook" className="land-notebook" aria-labelledby="notebook-title">
        <h2 id="notebook-title" className="land-h2 land-notebook-title">
          A notebook for your life with God
        </h2>
        <div className="land-rows">
          {NOTEBOOK.map((row) => (
            <article key={row.title} className="land-row-item">
              <div className="land-axis">
                <h3 className="land-h3">
                  {row.title}
                </h3>
                <p className="land-body">
                  {row.text}
                </p>
              </div>
              <Unveil className={`land-margin ${row.shape}`}>
                <Image src={row.art.src} alt={row.art.alt} fill sizes={row.sizes} />
              </Unveil>
            </article>
          ))}
        </div>
        <div className="land-notebook-action">
          <AppButton href="/login" size="lg">
            Sign in to keep your prayers
          </AppButton>
        </div>
      </section>

      <section id="saints" className="land-saints" aria-labelledby="saints-title">
        <Depth className="land-vault" y={[-48, 48]}>
          {VAULT_STARS.map((star) => (
            <span key={`${star.x}-${star.y}`} className="land-star" style={{ left: `${star.x}%`, top: `${star.y}%` }} aria-hidden>
              <VaultStar r={star.r} />
            </span>
          ))}
        </Depth>
        <div className="land-gutter land-saints-head">
          <h2 id="saints-title" className="land-h2">
            Ora pro nobis: pray for us
          </h2>
          <p className="land-statement">
            Ora means pray. The Church answers the saints’ names with it in the Litany, because no one draws near to God alone.
          </p>
        </div>
        <SaintWall />
      </section>

      <section className="land-close" aria-labelledby="close-title">
        <div className="land-strip">
          {[MYSTERY_ART.glorious[0], MYSTERY_ART.glorious[1], CORONATION_PANEL].map((art) => (
            <Unveil key={art.src} className="land-strip-item">
              <Image src={art.src} alt={art.alt} fill sizes="(min-width: 48rem) 34vw, 100vw" />
            </Unveil>
          ))}
        </div>
        <div className="land-band">
          <div>
            <h2 id="close-title" className="land-h2">
              Begin tonight
            </h2>
            <p className="land-statement">
              You do not have to find the words. <Link href="/rosary">Begin with the Rosary</Link> and let the Church pray
              with you.
            </p>
            <p className="land-body">
              No account needed. Add Ora to your phone’s home screen and it keeps working offline.
            </p>
          </div>
          <div className="land-band-portrait">
            <Image src={BLESSING.src} alt={BLESSING.alt} fill sizes="160px" />
          </div>
        </div>
      </section>

      <footer className="land-footer">
        <Image src={EMPYREAN.src} alt="" fill sizes="100vw" className="land-footer-art" />
        <div className="land-footer-top">
          <ul>
            <li>
              <Link href="/rosary">The Rosary</Link>
            </li>
            <li>
              <Link href="/divine-mercy">Divine Mercy Chaplet</Link>
            </li>
            <li>
              <Link href="/angelus">The Angelus</Link>
            </li>
            <li>
              <Link href="/login">Sign in</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
          <p className="land-footer-verse">
            “Draw near to God and he will draw near to you.”
            <br />
            James 4:8
          </p>
        </div>
        {/* The name rises out of the foot of the engraving as the page ends. */}
        <Depth className="land-footer-name" y={["34%", "0%"]} offset={["start end", "end end"]}>
          <span aria-hidden>Ora</span>
        </Depth>
        <p className="land-footer-credit">{ART_CREDIT}</p>
      </footer>
    </div>
  );
}
