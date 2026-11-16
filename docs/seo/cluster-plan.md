# Cluster plan: "prayer app" (Ora)

**Method caveat.** Keywords were grouped by intent and by what the three searches showed (app-store listings dominate "prayer app"; beginner guides dominate "how to pray the rosary"). I did **not** run pairwise SERP-overlap checks or pull search volumes, so clusters are unverified and every volume is 0. Run DataForSEO or Search Console before committing writing time.

## Positioning
"Prayer app" is a crowded head term (Hallow, iRosary, PocketPrayers, YouVersion). Ora's edge from the repo: free, no account for the Rosary, works offline as a PWA, no ads. So the plan targets Catholic-specific long tails, not the generic head term.

## Pillar
**How to Pray the Rosary: A Step-by-Step Guide** (`/learn/how-to-pray-the-rosary`, ultimate-guide, ~3000 words). CTA into `/rosary`.

## Cluster 1: Rosary Basics
| Post | Keyword | Template |
|---|---|---|
| The Five Decades of the Rosary Explained | rosary decades explained | explainer |
| Rosary Mysteries by Day of the Week | rosary mysteries by day | listicle |
| Joyful, Sorrowful, Glorious and Luminous Mysteries | joyful sorrowful glorious luminous mysteries | explainer |
| Rosary Prayers: Full Text | rosary prayers text | listicle |

## Cluster 2: Other Catholic Devotions
Maps to existing app pages (`/divine-mercy`, `/angelus`, `/stations-of-the-cross`, `/seven-sorrows`).
| Post | Keyword | Template |
|---|---|---|
| How to Pray the Divine Mercy Chaplet | how to pray divine mercy chaplet | how-to |
| The Angelus: Words, Times and Meaning | angelus prayer | explainer |
| Stations of the Cross: Prayer Guide | stations of the cross prayers | how-to |
| Seven Sorrows of Mary Devotion | seven sorrows of mary rosary | explainer |

## Cluster 3: Prayer Apps & Tools
| Post | Keyword | Template |
|---|---|---|
| Best Catholic Prayer Apps Compared | best catholic prayer apps | best-of |
| Free Rosary App That Works Offline | free rosary app offline | landing-page (existing `/rosary`) |
| Prayer Intentions Journal | prayer intentions journal | how-to |
| Daily Prayer Habit and Streak | daily prayer habit | how-to |

## Links
Every spoke ↔ pillar (mandatory); spokes within a cluster linked (recommended); three cross-cluster links (optional). 13 pages, 3 clusters, 63 links (see `cluster-plan.json`).

## Notes and risks
- Prayer text and mysteries are public domain; the `/learn/*` routes don't exist yet. Check `PUBLIC_PATHS` in `lib/site.ts` and the sitemap when adding them.
- "Best apps" post: Ora is a competitor in it, so disclose that and use only verifiable facts about others (listing claims here were self-reported).
- Out of scope per CLAUDE.md: audio, reminders, i18n. Don't target keywords that promise them.
