# Roadmap

Feature backlog for Ora after Phase 6 (polish). Items are numbered so they can be referred to in conversation and PRs.

**Suggested next phase:** a hardening pass on the offline library and sharing before reminders (10).

## Done

1. **Prayer streak and Rosary stats.** Streak, count by mystery set and practice calendar on the profile page (#26, #39).
2. **Intentions linked to sessions.** Intention picker in the Rosary, shown in history (#46).
3. **Resume for all sequences.** Home resume state (#28), plus Divine Mercy and Angelus resume.
4. **Data export and account deletion.** (#53)
5. **Prayer reader preferences.** Reading themes and keep-screen-awake via Wake Lock (#41).
6. **Offline-first library.** Signed-in prayers, favorites and collections are copied to IndexedDB and synced on reconnect (#60).
7. **Sharing.** Read-only public link (`/s/[token]`) for an own prayer or collection, with the Web Share API and copy-link fallback; stopping a share kills the link. Anonymous reads go through security-definer functions, so the `shares` table is never exposed. Migration `20261107000000_shares.sql` still has to be pushed (`pnpm db:migrate`).
8. **Tests.** Playwright e2e (Rosary flow, signed-out redirects, offline fallback) and jsdom component tests for the bead tracker and sequence player. Real Google sign-in is not automated.
9. **Chaplets.** Divine Mercy (#38), Angelus (#40), Seven Sorrows and Stations of the Cross.

12. **Liturgical day card.** Home-page "today" card from a computed universal Roman calendar (`lib/liturgy/`): season, week, celebration, color, and a link out to the day's readings on usccb.org. Universal calendar only, obligatory celebrations only: no regional calendars (for example the Philippines), no optional memorials, no lectionary text (copyrighted).

## Remaining, in scope

Nothing.

## Ideas under consideration (not decided)

Follow-ups to the liturgical day card (12). Universal calendar only; both reuse `liturgicalDay()`, so neither needs a database.

14. **Readings cycle and rank label on the card.** Show "Sunday readings: Year A" or "Weekday readings: Year II" and a rank label (Solemnity, Feast, Memorial) next to the title. The engine already returns `sundayCycle`, `weekdayCycle` and `kind`, so this needs no new data and is quick.
15. **Month calendar page (`/calendar`).** A month grid with each day tinted by its liturgical color, previous and next month, and a day detail (title, season and week, color, readings cycle, usccb.org link). It is what makes this a calendar rather than a card. Needs a route, a phone-width layout, keyboard and screen-reader support for the grid, and tests.

## Outside the current scope (needs an explicit go-ahead)

10. **Daily reminders** via web push. Needs a scheduler; iOS requires the installed PWA.
11. **Audio / guided voice** for the Rosary.
13. **i18n.** Spanish, Portuguese, Filipino, Latin.
