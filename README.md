# Ora

A Catholic prayer PWA: an offline-capable interactive Rosary (public, no account) and a signed-in prayer library with collections, favorites, search, intentions and Rosary history.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 and Supabase. Next 16 differs from older versions, so read `node_modules/next/dist/docs/` before changing framework-level code. `CLAUDE.md` has the full architecture notes.

## Getting started

```bash
npm install
cp .env.example .env     # then fill in the two Supabase values
npm run dev
```

The Rosary works without Supabase. Sign-in and the library need `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and Google enabled as an auth provider in the Supabase project.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server. The service worker is not registered in dev. |
| `npm run build` / `npm run start` | Production build and server. Test the PWA here (`-p 3100` if dev is on 3000). |
| `npm run typecheck` | `tsc --noEmit`. Run `npx next typegen` first if route types are missing. |
| `npm run lint` | ESLint. |
| `npm test` | Vitest, for the pure code (liturgical season, Rosary engine, validation). |

CI runs typecheck, lint, tests and a production build on every pull request.

## Database

Schema lives in `supabase/migrations/`. Change it with a new migration, never by editing an applied one.

```bash
supabase db push --include-seed                              # apply migrations and seed
supabase gen types typescript --linked > lib/database.types.ts   # after schema changes
```

## PWA

The manifest is `app/manifest.ts` and the service worker is hand-written in `public/sw.js` (no Serwist). It registers in production only. Bump `VERSION` in `sw.js` whenever the cached paths change.
