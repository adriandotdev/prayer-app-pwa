# Roadmap

Feature backlog for Ora after Phase 6 (polish). Items are numbered so they can be referred to in conversation and PRs.

**Suggested next phase:** items 6 (offline library) and 7 (sharing); the e2e suite from item 8 now protects what is built. Item 9's remaining chaplets are small data-only additions that can slot in anywhere. Harden before reminders (10).

## Done

1. **Prayer streak and Rosary stats.** Streak, count by mystery set and practice calendar on the profile page (#26, #39).
2. **Intentions linked to sessions.** Intention picker in the Rosary, shown in history (#46).
3. **Resume for all sequences.** Home resume state (#28), plus Divine Mercy and Angelus resume.
4. **Data export and account deletion.** (#53)
5. **Prayer reader preferences.** Reading themes and keep-screen-awake via Wake Lock (#41).
8. **Tests.** Playwright e2e (Rosary flow, signed-out redirects, offline fallback) and jsdom component tests for the bead tracker and sequence player. Real Google sign-in is not automated.
9. **Chaplets (partial).** Divine Mercy (#38) and Angelus (#40) are built.

## Remaining, in scope

6. **Offline-first library.** Cache a signed-in user's prayers and favorites in IndexedDB and sync on reconnect (the biggest PWA gap). No IndexedDB code yet.
7. **Sharing.** Read-only public link for a prayer or collection, plus the Web Share API. Needs a schema change; nothing built yet.
9. **More chaplets (remainder).** Seven Sorrows and Stations of the Cross. Data only, thanks to the sequence engine.

## Outside the current scope (needs an explicit go-ahead)

10. **Daily reminders** via web push. Needs a scheduler; iOS requires the installed PWA.
11. **Audio / guided voice** for the Rosary.
12. **Liturgical calendar and daily readings.** Start with a "today" card using the season-color function.
13. **i18n.** Spanish, Portuguese, Filipino, Latin.
