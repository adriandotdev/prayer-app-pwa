# Roadmap

Feature backlog for Ora after Phase 6 (polish). Items are numbered so they can be referred to in conversation and PRs.

**Suggested next phase:** items 1, 2 and 5 together (no new backend), then 6 and 8 to harden the foundation before reminders (10).

## High value, in scope

1. **Prayer streak and Rosary stats.** Built from the existing `rosary_sessions`: streak, count by mystery set, history calendar on the profile page.
2. **Intentions linked to prayers.** Attach an intention to a Rosary or Chaplet session and show it in the history.
3. **Resume for all sequences.** "Continue where you left off" for every sequence, including Divine Mercy and future chaplets, through the generic engine.
4. **Data export and account deletion.** JSON export of prayers, collections, intentions and history, plus delete account.
5. **Prayer reader preferences.** Line-height option, sepia/night theme, and keep-screen-awake (Wake Lock API) while praying.

## Medium value

6. **Offline-first library.** Cache a signed-in user's prayers and favorites in IndexedDB and sync on reconnect (the biggest PWA gap).
7. **Sharing.** Read-only public link for a prayer or collection, plus the Web Share API.
8. **Tests.** Playwright e2e (Rosary flow, sign-in, offline fallback) and component tests.
9. **More chaplets and devotions.** Seven Sorrows, Stations of the Cross, Angelus. Data only, thanks to the sequence engine.

## Outside the current scope (needs an explicit go-ahead)

10. **Daily reminders** via web push. Needs a scheduler; iOS requires the installed PWA.
11. **Audio / guided voice** for the Rosary.
12. **Liturgical calendar and daily readings.** Start with a "today" card using the season-color function.
13. **i18n.** Spanish, Portuguese, Filipino, Latin.
