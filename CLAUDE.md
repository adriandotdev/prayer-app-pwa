# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

"Ora" is a Catholic prayer PWA: an offline-capable interactive Rosary (public, no account) plus a signed-in prayer library. Built in six phases with a stop for user review after each: 1 setup, 2 Rosary, 3 auth/profile, 4 prayer library (prayers, collections, favorites, search, intentions, Rosary history), 5 PWA, 6 polish. Phases 1–4 and a hand-written PWA are done; Phase 5 (PWA hardening) is built and awaiting review; Phase 6 (polish) is next. Out of scope: push/reminders, social, liturgical calendar, readings, audio, i18n, other chaplets (architecture only).

## Commands

```bash
npm run dev          # dev server (the service worker is NOT registered in dev)
npm run build        # production build; also regenerates .next/types route types
npm run start        # test the PWA/service worker here (use -p 3100 if dev is on 3000)
npm run lint         # eslint
npx tsc --noEmit     # type-check; if `PageProps<"/x">` is unknown run `npx next typegen` first
```

There is no test runner. Verify with `tsc`, `eslint`, a production build, and `curl` against `next start`.

Supabase (CLI, project ref `ltgjhevwtfxlhhurxrdx`): `supabase db push --include-seed` applies `supabase/migrations/` and `seed.sql`; `supabase gen types typescript --linked > lib/database.types.ts` regenerates types after schema changes.

## Architecture

**Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind v4.** This is not the Next.js of older docs: read `node_modules/next/dist/docs/` before writing Next code. Notable differences used here: `proxy.ts` replaces `middleware.ts`; route props use the global `PageProps<"/route">` / `LayoutProps<"/">` / `RouteContext<"/x/[id]">` types; `cacheComponents` is intentionally off. Tailwind is wired through a Turbopack rule in `next.config.ts`.

**Rosary is a generic sequence engine, not Rosary-specific UI.** `lib/sequence/` defines `SequenceDefinition` (steps, beads with SVG coordinates, prayer texts) plus pure helpers (`engine.ts`) and local persistence (`progress.ts`, a `useSyncExternalStore` over one localStorage key). `data/rosary/` holds the static typed Rosary data (prayers, 20 mysteries, day schedule) and `sequence.ts`, which builds the 80-step / 59-bead definition for a mystery set. `components/sequence/` (bead tracker, player) only consume a `SequenceDefinition`, so a new chaplet should need data only. Rosary data is never stored in the DB and must keep working offline. `components/rosary/rosary-experience.tsx` is the page flow (pick mysteries, resume, play, completion).

**Auth and Supabase.** `lib/supabase/{client,server}.ts` use `@supabase/ssr`; the env var is the publishable key `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (legacy anon key accepted). `lib/env.ts` returns null when unconfigured so the app (Rosary) still runs without Supabase. Root `proxy.ts` calls `lib/supabase/proxy.ts#updateSession`, which refreshes the session and redirects signed-out users from the protected prefixes in `lib/auth/paths.ts` (`/prayers`, `/collections`, `/intentions`, `/profile`) to `/login?next=…`; always pass `next` through `safeNext`. Sign-in is Google only (the email magic-link form was removed) via a server action in `app/login/actions.ts`; `app/auth/callback/route.ts` exchanges the code. Google's OAuth redirect URI is the Supabase `/auth/v1/callback`, not the app's.

**Database** (`supabase/migrations/`): profiles (created by a security-definer trigger on `auth.users`), prayers (generated `search` tsvector, currently unused: the library search matches words by substring with ilike because English full-text drops stop words like "our"; `user_id is null` = read-only starter prayer, seeded with fixed UUIDs), collections, collection_prayers, intentions, rosary_sessions. RLS is on every table using `(select auth.uid())`. Change schema through new migration files, never by editing an applied one.

**PWA is hand-written, no Serwist.** `app/manifest.ts`, icons in `public/brand/`, and `public/sw.js`: on install it precaches `/offline`, `/rosary`, `/` and the `/_next/static` assets those HTML pages reference (parsed by regex); navigations are network-first with cache then `/offline` fallback; static assets cache-first; `/api` and `/auth` and non-GET are never touched. Bump `VERSION` in `sw.js` when changing cached paths. It registers in production only. `proxy.ts` matcher excludes `sw.js`, the manifest and `brand/`. Signed-in pages are cached as visited and dropped on sign-out (`clear-private-pages` message from `components/profile/sign-out-form.tsx`). Rosaries finished offline are queued in localStorage (`lib/rosary/pending.ts`) and synced by `components/pwa/rosary-sync.tsx`; the queue is dropped if the visitor turns out to be signed out. Install prompt and offline banner are in `components/pwa/`.

**UI conventions.** Use `components/app-button.tsx` (`AppButton`, 48/56px touch targets, `href` renders a `Link`) instead of any shadcn button; the shadcn Button was removed deliberately. Other shadcn pieces in `components/ui/` are Radix-based (`-b radix`); the shadcn CLI emits a bogus `cn` import from a "cn" package, so fix imports to `@/lib/utils`. Theme tokens and the `.prayer-text` class (scaled by `--prayer-scale`) live in `app/globals.css`; fonts are `--font-ui`, `--font-prayer`, `--font-cormorant`. Branding lives in `components/brand/` (`Logo`, inline-SVG `Loader` so it follows `currentColor`). Mobile layout: sticky Rosary controls sit above the bottom nav, with safe-area insets.

## Working agreements

- Do not commit or push unless asked; when asked, make separate commits per functionality and omit any Claude Co-Authored-By trailer. Stop for review at the end of each phase.
- `gh` fails because the `GITHUB_TOKEN` env var is invalid; a keychain login works, so run `env -u GITHUB_TOKEN -u GH_TOKEN gh …`.
- `.env` holds real secrets: never read or print it. `.env.example` documents the variables.
