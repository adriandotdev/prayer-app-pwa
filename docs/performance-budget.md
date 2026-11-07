# Performance budget

Ora is used one-handed on a phone, often on a weak connection, so the first screen must be light and the Rosary must work offline.

## Baseline (measured 2026-11-02, production build, Next.js 16.4.3)

Gzipped size of the `/_next/static/**/*.js` files referenced by each route's HTML (initial load, not lazy chunks):

| Route | JS (gzip) |
| --- | --- |
| `/` | ~127 KB |
| `/rosary` | ~122 KB |
| `/appearance` | ~125 KB |
| `/offline` | ~122 KB |

Next 16 no longer prints "First Load JS" in `pnpm build`, so measure like this:

```bash
pnpm build && pnpm exec next start -p 3100 &
for r in / /rosary /appearance /offline; do
  curl -s localhost:3100$r | grep -o '/_next/static/[^"]*\.js' | sort -u |
    while read f; do curl -s localhost:3100$f | gzip -c | wc -c; done | paste -sd+ | bc
done
```

## Budget

| Metric | Budget |
| --- | --- |
| Initial JS per public route (`/`, `/rosary`, `/offline`) | 150 KB gzip (baseline plus ~15%); a change that adds more needs a reason |
| Largest Contentful Paint (mobile, 4G) | under 2.5 s |
| Cumulative Layout Shift | under 0.1 (loading skeletons match the page layout for this) |
| Interaction to Next Paint | under 200 ms |
| Fonts | 3 families, weights 400/500/600, `display: swap`; add a weight only with a visible need |

The Rosary route stays client-rendered from local data and must keep working offline from the service worker precache (`public/sw.js`).

## Not yet measured

Lighthouse (mobile) scores and Core Web Vitals on a real device have not been recorded. Run Lighthouse against `pnpm start` for `/`, `/rosary` and `/prayers` and add the numbers here before the next release.

## Candidates if the budget is tight

- `LazyMotion` with `domAnimation` instead of the full `motion` bundle in shell components (`bottom-nav`, `app-sidebar`, `toaster`, `page-transition`).
- Split `components/rosary/mystery-art.tsx` and the sequence player out of the `/rosary` entry.
- Drop an unused font weight.
