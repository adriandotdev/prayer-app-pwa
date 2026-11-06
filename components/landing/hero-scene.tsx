"use client";

import { easeIn, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { PointerEvent } from "react";
import { useRef } from "react";

import { AppButton } from "@/components/app-button";
import { EASE_ORA } from "@/lib/motion";
import { useIsDesktop } from "@/lib/use-is-desktop";
import { EMPYREAN, EMPYREAN_ROSE } from "./art";
import { useFullMotion } from "./scrub";

const CHAPTERS = [
  { href: "#why", label: "Why pray" },
  { href: "#mysteries", label: "Today’s mysteries" },
  { href: "#prayers", label: "The prayers" },
  { href: "#notebook", label: "Your notebook" },
  { href: "#saints", label: "The saints" },
];

// The steady spring behind the camera, so a flick of the thumb glides instead of jumping.
const CAMERA = { stiffness: 130, damping: 32, mass: 0.5 };
const DRIFT = { stiffness: 40, damping: 18 };

/**
 * "Draw near", acted out. Scrolling holds this screen in place and carries the visitor into the rose until its
 * point of light fills the view and becomes the paper of the next chapter.
 */
export function HeroScene() {
  const full = useFullMotion();
  const isDesktop = useIsDesktop();
  const scene = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scene, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, CAMERA);

  // The frame opens over the chapter column first, then the camera moves.
  const opening = useTransform(progress, [0, 0.12], [1, 0]);
  const clipPath = useTransform(
    opening,
    (k) =>
      `inset(calc(var(--land-pad) * ${k}) calc((var(--land-column) + var(--land-pad)) * ${k}) calc(var(--land-pad) * ${k}) calc(var(--land-pad) * ${k}))`,
  );
  const shift = useTransform(opening, (k) => `calc(var(--land-shift) * ${1 - k})`);

  const zoom = useTransform(progress, [0, 1], [1, 3.6], { ease: easeIn });
  const turn = useTransform(progress, [0, 1], [0, 48]);
  const turnBack = useTransform(progress, [0, 1], [0, -30]);

  // The words stay put while the camera passes through them.
  const titleScale = useTransform(progress, [0, 0.3], [1, 1.75]);
  const titleOpacity = useTransform(progress, [0.06, 0.28], [1, 0]);
  const quiet = useTransform(progress, [0, 0.1], [1, 0]);
  // Gone from the tab order once faded, so focus cannot land on something invisible.
  const quietVisibility = useTransform(progress, (v) => (v > 0.11 ? "hidden" : "visible"));
  // Fully covered by then; stops the turning roses from painting behind the light.
  const artVisibility = useTransform(progress, (v) => (v > 0.92 ? "hidden" : "visible"));

  const light = useTransform(progress, [0.3, 0.9], [0.06, 5], { ease: easeIn });
  const verse = useTransform(progress, [0.66, 0.8], [0, 1]);
  const verseRise = useTransform(progress, [0.66, 0.84], [18, 0]);

  // Beside the frame on a desktop, so it leaves as the frame opens; on a phone it sits below the scene and stays.
  const chaptersVisibility = useTransform(progress, (v) => (v > 0.09 ? "hidden" : "visible"));
  const chaptersOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  // On a desktop the engraving leans gently away from the pointer, so it feels deep before any scroll.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const driftX = useSpring(pointerX, DRIFT);
  const driftY = useSpring(pointerY, DRIFT);
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointerX.set((event.clientX / window.innerWidth - 0.5) * -22);
    pointerY.set((event.clientY / window.innerHeight - 0.5) * -14);
  };

  return (
    <>
      <div ref={scene} className="land-scene">
        <div className="land-stage" onPointerMove={full ? onPointerMove : undefined}>
          <motion.div className="land-panel" style={full ? { clipPath } : undefined}>
            <motion.div className="land-camera" style={full ? { x: shift } : undefined}>
              <motion.div className="land-ascend" style={full ? { scale: zoom, visibility: artVisibility } : undefined}>
                <motion.div className="land-art" style={full ? { x: driftX, y: driftY } : undefined}>
                  <Image src={EMPYREAN.src} alt={EMPYREAN.alt} fill priority fetchPriority="high" quality={60} sizes="(min-width: 48rem) 90vw, 130vw" />
                  <motion.div className="land-wheel" style={full ? { rotate: turn } : undefined}>
                    <div className="land-rose">
                      <Image src={EMPYREAN_ROSE.src} alt="" fill sizes="(min-width: 48rem) 80vw, 110vw" />
                    </div>
                  </motion.div>
                  <motion.div className="land-wheel land-wheel-back" style={full ? { rotate: turnBack } : undefined}>
                    <div className="land-rose land-rose-back">
                      <Image src={EMPYREAN_ROSE.src} alt="" fill sizes="(min-width: 48rem) 80vw, 110vw" />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {full && (
                <>
                  <motion.div className="land-light" style={{ scale: light }} aria-hidden>
                    {/* The point of light kindles once on arrival; everything after it is the visitor's own scroll. */}
                    <motion.div
                      className="land-light-glow"
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.4, ease: EASE_ORA, delay: 0.25 }}
                    />
                  </motion.div>
                  <motion.p className="land-verse" style={{ opacity: verse, y: verseRise }} aria-hidden>
                    “Draw near to God and he will draw near to you.”
                    <span>James 4:8</span>
                  </motion.p>
              </>
            )}
          </motion.div>

          <motion.div
            className="land-panel-top land-camera-words"
            style={full ? { x: shift, opacity: quiet, visibility: quietVisibility } : undefined}
          >
            <Link href="/" className="land-wordmark" aria-label="Ora, open the app">
              Ora
            </Link>
          </motion.div>

          <motion.div
            className="land-title-block land-camera-words"
            style={full ? { x: shift, scale: titleScale, opacity: titleOpacity } : undefined}
          >
            <h1 id="land-title" className="land-h1">
              Draw near <br />
              to God
            </h1>
            <motion.p className="land-lede" style={full ? { opacity: quiet } : undefined}>
              Ora is a Catholic prayer app for a deeper faith: pray the Rosary, keep your own prayers, and come back to God
              each day.
            </motion.p>
          </motion.div>

          <motion.div
            className="land-panel-action land-camera-words"
            style={full ? { x: shift, opacity: quiet, visibility: quietVisibility } : undefined}
          >
            <AppButton href="/rosary" size="lg">
              Pray the Rosary
            </AppButton>
            {full && (
              <p className="land-cue" aria-hidden>
                Scroll to draw near
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>

    <motion.nav
      className="land-swatches"
      aria-label="On this page"
      style={full && isDesktop ? { opacity: chaptersOpacity, visibility: chaptersVisibility } : undefined}
    >
      {CHAPTERS.map((chapter) => (
        <a key={chapter.href} href={chapter.href} className="land-swatch">
          <span className="land-swatch-label">{chapter.label}</span>
          <span className="land-swatch-arrow" aria-hidden>
            ↓
          </span>
        </a>
      ))}
    </motion.nav>
    </>
  );
}
