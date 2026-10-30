# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: individual Catholics praying on their own.** Used mostly one-handed on a phone (design for 360–430px first), often at night, in quiet moments. They want a calm place to pray the Rosary and keep their own prayers.
- **Later: parish and family groups.** Not a current audience, but the product should not block shared intentions or praying together if they are taken on (both are listed as "maybe" in `ROADMAP.md`).

## Product Purpose

Ora is a Catholic prayer PWA: an offline-capable interactive Rosary (public, no account) plus a signed-in personal prayer library. Success is a person who returns to pray calmly and finds their own prayers, collections, intentions and Rosary history where they left them.

## Positioning

A personal prayer notebook: the user's own prayers, collections, favorites and intentions are the core, and the guided Rosary is one practice within it. The Rosary works without an account and offline; the library is what signing in adds. Quiet and non-performative, with no pressure to pray.

## Operating Context

- Phone-first PWA (installable, hand-written service worker), used one-handed, often in low light.
- The Rosary is a generic sequence engine (steps, beads, prayer texts), so other chaplets should need data only.
- Surfaces: Home, Rosary (pick mysteries, resume, play, completion), Prayers, Collections, Intentions, Profile (with Rosary stats), Appearance, Login, Offline.
- Sign-in is Google only, via Supabase.

## Capabilities and Constraints

- Rosary data is static and typed in `data/rosary/`, never stored in the database, and must keep working offline.
- Library: prayers (read-only seeded starter prayers plus user-owned), collections, favorites, substring search, intentions, Rosary history.
- Liturgical season theming exists (`lib/theme/liturgical-season.ts`, `app/seasons.css`) and an Appearance screen with prayer text scaling.
- Out of scope for now: push/reminders, social, liturgical calendar beyond season color, readings, audio, i18n, other chaplets (architecture ready). `ROADMAP.md` lists them as candidates.
- Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Supabase. Use `AppButton`, not the shadcn Button.
- Open: Apple sign-in, a native wrapper (Capacitor), and the source and approval of licensed texts are undecided.

## Brand Commitments

- Name: "Ora" ("Ora — Catholic prayer"). Brand assets live in `public/brand/` and `components/brand/`.
- Liturgical season theming is a core identity feature, not decoration.
- Prayer texts must be doctrinally faithful: traditional Catholic prayers (Our Father, Hail Mary, Glory Be, etc.) are used exactly as the Church prays them. Never paraphrased, shortened or machine-generated.
- No guilt or gamification: no leaderboards, loss-aversion streaks, points or social comparison. Stats and streaks, if shown, are framed gently.

## Evidence on Hand

- Real product with running routes in `app/`, seeded starter prayers, and docs in `README.md`, `CLAUDE.md` and `ROADMAP.md`.
- No testimonials, user counts, parish partners or reviews exist. Do not fabricate any.

## Product Principles

- Calm over engagement: nothing should pull the user away from prayer or pressure them to return.
- Fidelity over cleverness: prayer text is sacred content, presented exactly and readably.
- Works anywhere: the Rosary stays usable offline and without an account.
- The user's own prayers come first: their library and intentions are theirs, private by default.

## Accessibility & Inclusion

WCAG 2.2 AA is required. Prayer text must scale for older users, and reduced motion must be respected.
