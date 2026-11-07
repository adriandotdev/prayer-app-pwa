# Roadmap

Feature backlog for Ora after Phase 6 (polish). Items are numbered so they can be referred to in conversation and PRs.

**Suggested next phase:** item 9's remaining chaplets (small, data-only), then a hardening pass on the offline library and sharing before reminders (10).

## Done

1. **Prayer streak and Rosary stats.** Streak, count by mystery set and practice calendar on the profile page (#26, #39).
2. **Intentions linked to sessions.** Intention picker in the Rosary, shown in history (#46).
3. **Resume for all sequences.** Home resume state (#28), plus Divine Mercy and Angelus resume.
4. **Data export and account deletion.** (#53)
5. **Prayer reader preferences.** Reading themes and keep-screen-awake via Wake Lock (#41).
6. **Offline-first library.** Signed-in prayers, favorites and collections are copied to IndexedDB and synced on reconnect (#60).
7. **Sharing.** Read-only public link (`/s/[token]`) for an own prayer or collection, with the Web Share API and copy-link fallback; stopping a share kills the link. Anonymous reads go through security-definer functions, so the `shares` table is never exposed. Migration `20261107000000_shares.sql` still has to be pushed (`pnpm db:migrate`).
8. **Tests.** Playwright e2e (Rosary flow, signed-out redirects, offline fallback) and jsdom component tests for the bead tracker and sequence player. Real Google sign-in is not automated.
9. **Chaplets (partial).** Divine Mercy (#38) and Angelus (#40) are built.

## Remaining, in scope

9. **More chaplets (remainder).** Seven Sorrows and Stations of the Cross. Data only, thanks to the sequence engine.

## Outside the current scope (needs an explicit go-ahead)

10. **Daily reminders** via web push. Needs a scheduler; iOS requires the installed PWA.
11. **Audio / guided voice** for the Rosary.
12. **Liturgical calendar and daily readings.** Start with a "today" card using the season-color function.
13. **i18n.** Spanish, Portuguese, Filipino, Latin.
