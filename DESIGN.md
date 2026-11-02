---
name: Ora
description: A hushed, candlelit chapel for prayer: ivory paper, deep blue, a single point of gold.
colors:
  vellum-ivory: "oklch(0.973 0.014 88)"
  vesper-blue: "oklch(0.32 0.075 258)"
  vesper-ink: "oklch(0.26 0.05 258)"
  altar-gold: "oklch(0.68 0.12 82)"
  linen-card: "oklch(0.99 0.008 88)"
  parchment: "oklch(0.94 0.02 86)"
  candle-wash: "oklch(0.92 0.045 88)"
  ash-text: "oklch(0.47 0.035 258)"
  rule-line: "oklch(0.88 0.02 86)"
  penitent-red: "oklch(0.52 0.19 27)"
  night-vellum: "oklch(0.18 0.035 258)"
  night-card: "oklch(0.22 0.04 258)"
  night-gold: "oklch(0.8 0.1 85)"
  night-text: "oklch(0.93 0.02 88)"
  season-violet: "#664684"
  season-rose: "#9A4B60"
  season-white-gold: "#745A22"
  season-green: "#42694A"
  season-red: "#9B342E"
  season-black: "#54545B"
typography:
  display:
    fontFamily: "Cormorant Garamond, ui-serif, Georgia, serif"
    fontSize: "3.75rem"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Cormorant Garamond, ui-serif, Georgia, serif"
    fontSize: "2.5rem"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Cormorant Garamond, ui-serif, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  prayer:
    fontFamily: "Source Serif 4, ui-serif, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1
rounded:
  sm: "0.45rem"
  md: "0.6rem"
  lg: "0.75rem"
  xl: "1.05rem"
  2xl: "1.35rem"
  3xl: "1.65rem"
  full: "9999px"
  arch: "9rem"
spacing:
  gutter-phone: "16px"
  gutter-desktop: "40px"
  touch-min: "44px"
  touch-action: "48px"
  touch-primary: "56px"
components:
  button-primary:
    backgroundColor: "{colors.vesper-blue}"
    textColor: "{colors.vellum-ivory}"
    rounded: "{rounded.full}"
    height: "48px"
    padding: "0 20px"
  button-outline:
    backgroundColor: "{colors.parchment}"
    textColor: "{colors.vesper-ink}"
    rounded: "{rounded.full}"
    height: "48px"
    padding: "0 20px"
  button-ghost:
    textColor: "{colors.vesper-ink}"
    rounded: "{rounded.full}"
    height: "48px"
    padding: "0 20px"
  button-destructive:
    backgroundColor: "{colors.penitent-red}"
    textColor: "{colors.vellum-ivory}"
    rounded: "{rounded.full}"
    height: "48px"
    padding: "0 20px"
  card:
    backgroundColor: "{colors.linen-card}"
    textColor: "{colors.vesper-ink}"
    rounded: "{rounded.3xl}"
    padding: "16px"
  chip-selected:
    backgroundColor: "{colors.vesper-blue}"
    textColor: "{colors.vellum-ivory}"
    rounded: "{rounded.full}"
    height: "44px"
    padding: "0 20px"
  nav-pill-active:
    backgroundColor: "{colors.candle-wash}"
    textColor: "{colors.vesper-blue}"
    rounded: "{rounded.full}"
    height: "36px"
    width: "56px"
---

# Design System: Ora

## Overview

**Creative North Star: "The Candlelit Chapel"**

Ora is a quiet room with one light in it. Surfaces are ivory paper tinted warm, text is a deep ink-blue rather than black, and gold is spent like a single flame: a halo on the current bead, a rule drawn under a heading, a ring on focus. Headings are set in Cormorant Garamond, prayer text in Source Serif 4 at a generous measure, and everything operational (nav, labels, buttons) in the plainer Hanken Grotesk so the sacred text is always the most literary thing on the screen.

The system is designed for a phone held one-handed, often at night. Day is ivory and blue; night is the same room with the lamps turned down: deep blue ground, warm ivory text, gold promoted to primary. Motion is slow and rare: things arrive like light, fading in and rising a few pixels, and the only ambient movement is the breathing halo on the current bead and a candle glow on empty states. Season theming (see Colors) recolors the room for the liturgical year without changing its architecture.

It rejects the language of engagement apps: no confetti, no streak flames, no badges, no loud saturated accents. Calm is the feature.

**Key Characteristics:**
- Warm ivory ground, ink-blue text, gold as a rare point of light.
- Flat tonal layering; depth comes from tinted surfaces and big corners, not shadows.
- One repeated shape: the chapel-window arch.
- Fully pill-shaped actions with 48–56px touch targets.
- Serif for what is prayed, sans for what is operated.
- Slow, opacity-and-transform-only motion that disappears under reduced motion.

## Colors

A restrained, hue-locked palette: one blue-violet axis (hue ~258) for text and primary, a warm ivory axis (hue ~86–88) for surfaces, and gold as the only accent. Values are OKLCH in `app/globals.css`; the liturgical seasons replace the whole token set with literal hex in `app/seasons.css`.

### Primary
- **Vesper Blue** (oklch(0.32 0.075 258)): the primary action fill, selected chips, active nav label, and the tint source for quoted prayer text (`prayer-mark`, `prayer-quote` at 7–12%). In night mode this role flips to Night Gold.

### Secondary
- **Altar Gold** (oklch(0.68 0.12 82)): the one accent. Focus ring, text selection tint, candle glow, bead halo, and the arch glyph on prayer cards. Never a large fill. In night mode it brightens to Night Gold (oklch(0.8 0.1 85)) and also becomes the primary.

### Neutral
- **Vellum Ivory** (oklch(0.973 0.014 88)): the page background, also painted on `html` to avoid a colour seam.
- **Linen Card** (oklch(0.99 0.008 88)): cards, popovers and sheets, a half-step lighter than the page.
- **Parchment** (oklch(0.94 0.02 86)): secondary surfaces, outline buttons, hover fill for cards and ghost buttons.
- **Candle Wash** (oklch(0.92 0.045 88)): the accent surface: active nav pill, arch glyph backing, selected rows.
- **Vesper Ink** (oklch(0.26 0.05 258)): body and heading text.
- **Ash Text** (oklch(0.47 0.035 258)): secondary and helper text.
- **Rule Line** (oklch(0.88 0.02 86)): borders and inputs.
- **Penitent Red** (oklch(0.52 0.19 27)): destructive actions only.
- **Night Vellum / Night Card** (oklch(0.18 0.035 258) / oklch(0.22 0.04 258)): the dark ground and card, with Night Text (oklch(0.93 0.02 88)). Borders become white at 11% alpha.

### Liturgical seasons
The app root takes `data-season`; each season redefines the full token set, day and night, with literal hex. Primary by season: Violet #664684, Rose #9A4B60, White and Gold #745A22 (the two share a primary), Green #42694A, Red #9B342E, Black #54545B. The season is chosen by `lib/theme/liturgical-season.ts`. Every season keeps gold at #8A6B1C. Default (no season) is the Vesper Blue palette above.

### Named Rules
**The One Flame Rule.** Gold appears as a point, a ring, a rule or a halo, never as a surface fill larger than an icon backing. Its rarity is what makes it read as light.

**The Season Owns the Hue Rule.** Components use tokens (`primary`, `accent`, `gold`), never a literal blue or green. A season swap must recolor every surface with no component edits. The one sanctioned exception: in the Red season the destructive button becomes an outline, because filled primary is already red.

**The Ink, Not Black Rule.** Text is never `#000` and grounds are never `#fff`; both are tinted toward the palette hue.

## Typography

**Display Font:** Cormorant Garamond (weights 400/500/600, with Georgia, serif fallback)
**Body Font:** Hanken Grotesk (with system-ui fallback)
**Prayer Font:** Source Serif 4 (with Georgia fallback)

**Character:** A liturgical display serif for titles, a sturdy modern serif for the sacred text, and a quiet grotesque for controls. The two serifs never sit at the same size role: Cormorant announces, Source Serif is read.

### Hierarchy
- **Display** (500, 3.75rem/60px at md and up, 1.02 line-height, -0.02em): page titles on desktop via `PageHeader`.
- **Headline** (500, 2.5rem, 1.02, -0.02em): page titles on phone; all `h1–h3` use Cormorant with balanced wrapping.
- **Title** (600, ~1.5rem, 1.2): card and section headings.
- **Body** (400, 1rem, 1.5): UI text and descriptions, `max-w-prose`; helper text at Ash Text.
- **Prayer** (400, 1.25rem phone / 1.4rem at 64rem, 1.75 line-height, max 38rem): all prayer text via `.prayer-text`, multiplied by the user-set `--prayer-scale`. Never smaller than the base in any context.
- **Label** (500, 0.8125–0.95rem): nav labels (13px), filter chips (0.95rem), buttons (1–1.125rem, medium weight).

### Named Rules
**The Sacred Text Is Serif Rule.** Anything prayed (prayer bodies and the Rosary's prayer text) is Source Serif 4 and scales with `--prayer-scale`. UI chrome never uses it.

**The Scale Is Theirs Rule.** Prayer size is user-controlled; layouts around prayer text must reflow, never clip or truncate it.

## Layout

Phone-first, designed at 360–430px. Content sits in a centred column: `max-w-3xl` with 16px gutters on phone, 40px at `md`, widening to `max-w-6xl` with 56px gutters at `lg`. The whole shell caps at 90rem. At `md` a fixed left sidebar (15rem, 18rem at `lg`) replaces the bottom nav.

On phone, a five-tab bottom nav (height 5rem plus the safe-area inset) is fixed; page content reserves `--bottom-nav-height + 1.5rem` at the bottom, and the sticky Rosary controls sit above it. Respect `env(safe-area-inset-*)` everywhere fixed UI touches an edge.

Rhythm is generous: page headers have 28px (40px desktop) below, cards sit in lists with 12–16px gaps, and prayer text keeps a 38rem measure so lines stay readable regardless of viewport.

Touch targets: 44px minimum, 48px for standard actions, 52–56px for the primary action of a screen.

## Elevation & Depth

Flat by default. Depth is tonal: page (Vellum Ivory) → card (Linen Card, one step lighter) → secondary (Parchment) → accent (Candle Wash). In night mode the same ladder runs from Night Vellum up through Night Card. Cards have no border and no shadow.

Shadows exist in exactly two places, both for things that float above the page:
- **Sheets/modals** (`0 -12px 40px -12px` foreground at 20% on phone; `0 24px 60px -20px` at 25% on desktop): the confirmation sheet.
- **Toasts** (Tailwind `shadow-lg`): transient notifications.

### Named Rules
**The Flat Until Floating Rule.** A surface that sits in the page flow gets tone, never a shadow. Only overlays that cover the page may cast one.

## Shapes

Soft, generous, and almost entirely rounded. The base radius is 0.75rem, scaled in steps (0.45 / 0.6 / 0.75 / 1.05 / 1.35 / 1.65rem). Cards, forms and sheets use the large end (`rounded-3xl`, ~1.65rem); every button, chip and nav pill is fully pill-shaped.

The signature silhouette is **the arch**: a 9rem top radius (a fixed value, not 999px, so lower corners are not shrunk) with small bottom corners, taken from chapel windows. It backs the glyph on prayer cards and frames hero imagery. Use it sparingly; it is the one shape the app repeats.

### Named Rules
**The Pill and the Arch Rule.** Actions are pills; the arch is for objects of devotion (prayers, figures). Never put an arch on a button or a pill on a prayer.

## Components

### Buttons (`AppButton`)
- **Shape:** full pill (9999px), 48px minimum height (`md`), 56px (`lg`), 44px circle (`icon`).
- **Primary:** Vesper Blue fill, ivory text, 20px side padding; hover is 90% opacity. In night mode, gold fill with deep-blue text.
- **Outline:** Parchment fill with ink text, hover Candle Wash. Not a literal outlined button; it reads as a raised-by-tone chip.
- **Ghost:** transparent, ink text, Parchment on hover.
- **Destructive:** Penitent Red fill (outline in the Red season).
- **States:** scale to 0.97 on press, 200ms ease-ora; 2px gold focus ring with 2px offset; disabled is 50% opacity with no pointer events. Pending state shows a pulsing dot and sets `aria-busy`.

### Filter chips
- **Style:** pill, 44px tall, 20px padding, 0.95rem medium. Unselected is plain text; selected has a Vesper Blue pill that glides between tabs (shared layout animation), ivory text.

### Cards (`prayer-card`)
- **Corner Style:** `rounded-3xl`.
- **Background:** Linen Card, Parchment on hover or press; no border, no shadow.
- **Internal Padding:** 16px, with a 4.5rem × 3.5rem arch glyph on the leading edge (Candle Wash backing, gold-toned icon).
- **Behavior:** `ora-press`: lifts 2px on hover where hover exists, presses to 0.985.

### Inputs / Fields
- **Style:** Rule Line stroke, rounded, 44px+ height; forms live inside a `rounded-3xl` Linen Card with 20px (32px desktop) padding.
- **Focus:** 2px gold outline with 2px offset, same as everywhere.
- **Prayer editor:** a Tiptap surface; quotes are a tinted 7% Vesper block with a large decorative opening mark, and highlighted phrases use `prayer-mark` (12% tint, semibold).

### Navigation
- **Bottom nav (phone):** five tabs on a Sidebar-toned sheet with a `rounded-t-3xl` top edge. Active tab: semibold Vesper Blue, a Candle Wash pill (56×36) that glides to the tapped tab like a bead on a string, icon stroke 2.2 vs 1.8. Labels 13px; tabs are 80px tall.
- **Sidebar (md+):** replaces the bottom nav, using the `sidebar-*` tokens.

### Rosary bead tracker (signature)
An SVG rosary drawn from `SequenceDefinition` bead coordinates, where the current bead carries a gold halo that breathes (3s, scale 1.08). It is the one ambient animation in the app and the visual anchor of the Rosary screen.

### Empty states and loader
Empty states use an icon that glows once like a candle catching (`ora-glow`, 800ms) or a slow candle breath. The loader is an inline-SVG string of beads (`currentColor` at 30%) with a gold highlight passing along them.

## Do's and Don'ts

### Do:
- **Do** use semantic tokens (`bg-primary`, `bg-accent`, `text-muted-foreground`, `text-gold`) so seasons and night mode recolor everything for free.
- **Do** set prayer text with `.prayer-text` and let `--prayer-scale` govern its size; reflow layouts to fit.
- **Do** keep every interactive target at 44px or more, primary actions 52–56px, and use `AppButton` rather than any shadcn Button.
- **Do** animate with opacity and transform only, on `ease-ora` (cubic-bezier(0.22, 1, 0.36, 1)), 180–240ms for UI and 520ms for staggered entrances, and honor `prefers-reduced-motion` by removing animation entirely.
- **Do** keep gold to a point, ring, rule or halo, and keep fixed UI clear of safe-area insets.
- **Do** use tonal steps (card → secondary → accent) to separate surfaces.

### Don't:
- **Don't** add shadows to in-flow cards or buttons; only overlays (sheets, toasts) float.
- **Don't** hard-code colors or use `#000` / `#fff`; every color comes from a token.
- **Don't** introduce streak flames, badges, confetti, progress-guilt, or any gamified or loss-aversion visual.
- **Don't** paraphrase, truncate, restyle or auto-generate traditional prayer text; set it plainly and in full.
- **Don't** put an arch on a button.
- **Don't** fill large areas with gold or add a second accent hue; seasons change the primary, not the accent system.
- **Don't** animate layout properties or run more than one ambient motion on a screen.
