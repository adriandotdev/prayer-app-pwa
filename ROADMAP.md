# Ora roadmap

Ideas for what to build after the current six phases. Ora is used mostly one-handed on a phone, often at night, so every item should work at 360–430px first, stay calm, and keep the Rosary usable offline and without an account.

Items marked **(was out of scope)** were deliberately left out of the original plan in `CLAUDE.md`; they are listed here so the decision to take them on is explicit.

## Where things stand

- **Done:** setup, interactive Rosary, Google auth and profile, prayer library (prayers, collections, favorites, search, intentions, Rosary history), hand-written PWA, liturgical season themes and appearance screen, home screen redesign.
- **In flight:** Phase 5 (PWA hardening) awaiting review, then Phase 6 (polish).

## Next: finish the plan

- Review and merge Phase 5 (offline sync, install prompt, service worker caching).
- Phase 6 polish: accessibility pass (WCAG 2.2 AA, focus order, reduced motion, screen-reader labels on the bead tracker), empty and error states, loading skeletons, performance budget.
- Test coverage beyond the pure code: component tests for the Rosary player, and an end-to-end smoke test (Playwright) for the Rosary flow and offline fallback.
- Error monitoring and basic privacy-friendly analytics, so real-world failures show up.

## Soon: deepen what exists

Small, low-risk additions that build on current tables and components.

| Feature | Why it fits | Notes |
| --- | --- | --- |
| Rosary streak and stats | `rosary_sessions` already stores history | Gentle framing (no guilt, no leaderboards). Total decades, current streak, mysteries prayed. |
| Resume anywhere | Progress is local only today | Sync in-progress Rosary to the account so a phone and a laptop agree. |
| Intention answered / archived | Intentions exist | Add a status, a "prayer answered" note, and filters. |
| Intentions inside the Rosary | Intentions and Rosary are separate | Pick an intention to offer a decade for, and show it during the prayer. |
| Prayer sharing | Library is private per user | Share a single prayer via link or the native share sheet. |
| Import / export | Users own their prayers | Export prayers, collections and intentions as JSON or Markdown. |
| Account deletion | Required for trust and store listings | Delete profile and all rows, with a confirmation. |
| Larger prayer text, line spacing, font choice | `--prayer-scale` already exists | Surface more reading controls in Appearance. |

## Later: new prayer content

Rosary data lives in `data/rosary/` and the engine in `lib/sequence/` is generic, so these should mostly be data work.

- **Other chaplets** **(was out of scope, architecture is ready)**: Divine Mercy Chaplet, Seven Sorrows, St. Michael, Stations of the Cross, Angelus. Each is a new `SequenceDefinition`.
- **Novenas and multi-day devotions**: a day counter, daily reminder text, resume on the next day.
- **Examen and Lectio Divina guides**: step-by-step, reusing the sequence player.
- **Litanies**: call-and-response lists (Loreto, Sacred Heart, St. Joseph).
- **Expanded starter prayers**: more seeded prayers (Latin and English side by side, Act of Contrition, Prayer to St. Michael, saint-specific prayers).

## Later: daily rhythm

- **Reminders and push notifications** **(was out of scope)**: opt-in daily prayer time, per-user time zone. Needs web push, a subscription table, and a scheduled sender (Supabase cron or an edge function). Respect iOS PWA push limits and keep it off by default.
- **Liturgical calendar** **(was out of scope beyond the season-color function)**: feast and memorial names, saint of the day, fasting and abstinence days. Season theming already exists in `lib/theme/liturgical-season.ts`, so this extends it.
- **Daily readings** **(was out of scope)**: Mass readings and Gospel. Requires a licensed or public-domain source, caching for offline, and a clear attribution.
- **Prayer of the day** on the home screen, chosen from the library by season.

## Later: richer experience

- **Audio** **(was out of scope)**: recorded or synthesized Rosary prayers, with a hands-free mode that advances beads automatically. Needs offline caching of audio files and care with PWA storage limits.
- **Hands-free and eyes-free mode**: large single-bead view, haptics on bead advance, screen wake lock so the display stays on during a Rosary.
- **Internationalization** **(was out of scope)**: Spanish, Portuguese, Filipino, Latin. Prayer texts are the real cost; they need approved translations, not machine output.
- **Widgets and shortcuts**: PWA app shortcuts for "Start Rosary" and "Today's mysteries".

## Maybe: community

Only if it can stay quiet and non-performative.

- **Shared intentions** **(was out of scope)**: a small private group (family, parish prayer group) can post intentions and see that others prayed.
- **Praying together**: a presence counter for a live Rosary, without chat.
- Anything social needs moderation, reporting, and privacy review before it ships.

## Platform and quality

- Decide whether to keep the hand-written service worker or move to Serwist as the cache rules grow.
- Offline queue for more than Rosary completions (intentions, favorites).
- Background sync where supported, with the current retry as the fallback.
- Content review process for prayer texts so doctrinal accuracy is checked before release.
- Backups and a restore drill for the Supabase project.

## Open questions

- Should the library stay Google-sign-in only, or add Apple (required for iOS App Store if the PWA is ever wrapped)?
- Is a native wrapper (Capacitor) planned, or does Ora stay a PWA? This affects push, audio, and wake lock.
- Where do licensed texts (readings, translations) come from, and who approves them?
- Which of the out-of-scope items are worth reopening first? Suggested order: streak and stats, intentions in the Rosary, other chaplets, reminders.
