# Prompt: liturgical season themes with a live preview

Copy everything below the line into your AI coding assistant (Claude Code in this repo).

---

Implement **liturgical season themes** for Ora. The user can pick how the app is colored: Ora's current look, a theme that follows the liturgical year automatically, or one fixed season. Before applying a theme, they can preview it on a mock of the app.

Before writing code:
- Read `CLAUDE.md` and `AGENTS.md`.
- Use the `mobile-first-ux` skill.
- Read the relevant guides in `node_modules/next/dist/docs/` (this is Next.js 16). In particular, read how to put an inline `<script>` in the root layout's `<head>`.
- Look at `app/globals.css`, `app/layout.tsx`, `components/theme/` (next-themes; `ThemeToggle` is rendered in `components/layout/mobile-header.tsx` and `components/layout/app-sidebar.tsx`), `components/layout/bottom-nav.tsx`, `components/app-button.tsx` and `components/confirmation-sheet.tsx`.

## 1. The setting

- Options:
  - **Ora (default)**: today's ivory/deep blue/gold. Nothing changes for users who never touch the setting.
  - **Follow the liturgical year (automatic)**
  - A fixed season: **Violet, Rose, White, Gold, Green, Red, Black**.
- Light/dark stays with next-themes exactly as it works now. The season is a second, independent attribute, `data-season="violet|rose|white|gold|green|red|black"`, on `<html>`. With no attribute, the existing `:root` / `.dark` values apply unchanged.
- Persist the choice in localStorage under `ora-season`, using `"default" | "auto" | <season>`. It must work signed out and offline, because the Rosary is public.
  - Do **not** store it in the database for now.
  - Do **not** render the season on the server. The service worker precaches `/` and `/rosary` HTML, so a server-rendered season would be stale.
- Avoid a flash of the wrong colors: add a tiny inline script in the root layout `<head>`. It reads `ora-season`, resolves `auto` to today's season, and sets `data-season` before first paint, the same way next-themes does for `.dark`. Then add a small client hook or provider (`lib/theme/season.ts` plus a component in `components/theme/`) that:
  - exposes the current choice and resolved season;
  - updates the attribute when the choice changes;
  - re-resolves `auto` on `visibilitychange` so the theme rolls over at midnight;
  - updates `<meta name="theme-color">` to the season's background for the current mode.

## 2. Automatic season (a pure function, local date)

CLAUDE.md lists the liturgical calendar as out of scope. This is deliberately limited to **one pure function** `seasonForDate(date): Season` in `lib/theme/liturgical-season.ts` with no data files or readings. Update the out-of-scope line in CLAUDE.md to say "liturgical calendar (beyond the season-color function)".

- Easter: compute it with the Anonymous Gregorian (Meeus/Jones/Butcher) algorithm.
- Advent starts on the Sunday between Nov 27 and Dec 3 → **violet** through Dec 24.
  - The 3rd Sunday of Advent (Gaudete) → **rose**.
- Dec 25 → **gold**.
- Dec 26 through the Baptism of the Lord (the first Sunday after Jan 6) → **white**.
- Ash Wednesday (Easter − 46) through Holy Saturday → **violet**, except:
  - Laetare (Easter − 21) → **rose**;
  - Palm Sunday (Easter − 7) and Good Friday (Easter − 2) → **red**.
- Easter Sunday → **gold**. Easter Monday through the day before Pentecost → **white**.
- Pentecost (Easter + 49) → **red**.
- Nov 2 (All Souls) → **black**.
- Everything else → **green** (Ordinary Time).

Put a short comment next to the function listing these rules. There is no test runner, so check the function by running it with `npx tsx` against known dates:
- 2026-04-05 (Easter) → gold
- 2026-02-18 (Ash Wednesday) → violet
- 2026-03-15 (Laetare) → rose
- 2026-05-24 (Pentecost) → red
- 2026-11-29 (Advent 1) → violet
- 2026-12-13 (Gaudete) → rose
- 2026-11-02 → black
- 2026-10-13 → green

## 3. Palettes

Each season has an 11-step ramp. The index is 0–10, for steps 50, 100, 200…900, 950:

```
violet: #F6F3F9 #ECE5F3 #D8CAE6 #BBA3D2 #9B7BB9 #7D5A9E #664684 #52386B #3E2B52 #2A1D38 #1B1325
rose:   #FBF4F5 #F6E6E9 #EDCDD3 #E0AAB5 #CE8394 #B76177 #9A4B60 #7C3C4D #5D2E3A #3F1F28 #2A1419
white:  #FDFCF8 #F9F6EE #F1ECDF #E5DDCA #CFC4AB #AFA388 #8A7F67 #6A614F #4B4538 #2F2B23 #1E1B16
gold:   #FBF8EF #F5EED8 #EADCAE #DCC37C #CBA851 #B28D34 #937229 #745A22 #57441C #3A2E14 #261E0D
green:  #F2F6F2 #E2ECE3 #C4D9C7 #9FC0A4 #76A17E #55835E #42694A #35543C #29402F #1C2C20 #121D15
red:    #FCF3F2 #F8E3E1 #F0C3BF #E39791 #D16860 #B8453D #9B342E #7E2A26 #5F211E #401715 #2A0F0E
black:  #F5F5F6 #E8E8EA #CFCFD3 #AEAEB4 #88888F #6A6A72 #54545B #424248 #2F2F34 #1E1E22 #131316
```

In the rules below:
- `r` is the season's ramp.
- `A` is the action ramp: the **gold ramp for White** (white can't carry a button), otherwise `r`.
- `G` is the gold ramp.
- `p` is 6, or 7 for White and Gold.
- `mix(a, b, t)` is linear RGB interpolation.

Precompute every value into **literal hex in CSS**: no runtime math, no `color-mix`. A throwaway script is fine, but don't commit it.

Every variable currently in `:root` / `.dark` in `globals.css` must be set for every season. Missing one leaves an ivory/blue surface inside a violet app.

| token | Day (`:root[data-season=x]`) | Night (`:root[data-season=x].dark`) |
|---|---|---|
| background | r0 | r10 |
| foreground, card-/popover-foreground | r10 | r0 |
| card, popover | mix(r0, #FFFFFF, .7) | mix(r10, r9, .55) |
| primary | A[p] | A3 |
| primary-foreground | r0 | r10 |
| secondary, muted | r1 | r9 |
| secondary-foreground | r8 | r0 |
| muted-foreground | r7 (Gold: `#6A614F`) | r4 (Gold: `#CFC4AB`) |
| accent | r1 | r9 |
| accent-foreground | r7 | r2 |
| gold | G5 | G3 |
| gold-foreground | r10 | r10 |
| border, input | r2 | r8 |
| ring | G4 | G3 |
| destructive | keep today's value | keep today's value |
| sidebar | mix(r0, r1, .5) | mix(r10, r9, .3) |
| sidebar-foreground | r10 | r0 |
| sidebar-primary / -primary-foreground | same as primary | same as primary |
| sidebar-accent / -accent-foreground | same as accent | same as accent |
| sidebar-border | r2 | r8 |
| sidebar-ring | G4 | G3 |

Put these in `app/seasons.css`, imported from `globals.css`.

Use the same declarations for the preview by adding a second selector to each block:
- `[data-preview-season=x][data-preview-mode=light]` on the Day block;
- `[data-preview-season=x][data-preview-mode=dark]` on the Night block.

Also add `default` preview blocks that copy today's `:root` and `.dark` values.

Readability fixes that are part of this task:
- **Bottom nav and sidebar active state must not rely on color alone.** In some seasons primary and muted text are close: Gold by day, White by day, and Gold by night. Give the active tab a non-color cue, such as a soft `bg-accent` pill behind the icon plus a heavier label.
- **In the Red season, destructive actions must not look like the primary action.** Destructive buttons should be outlined or text-style, not filled. Check every `destructive` usage, for example `components/prayers/delete-button.tsx` and `components/confirmation-sheet.tsx`.
- Check that body text, `muted-foreground` text on `background` and `card`, and `primary-foreground` on `primary` all reach **4.5:1** in all 14 season/mode combinations. Write a quick throwaway contrast check and report the numbers. If one fails, nudge it one ramp step and tell me which.

## 4. Appearance screen with a live preview

- Add a **public** route `app/appearance/page.tsx`. Do not add it to the protected prefixes in `lib/auth/paths.ts`. Link it from:
  - the header/sidebar theme control: keep `ThemeToggle`, and add an "Appearance" entry next to it or in a small menu;
  - the Profile page.
- The screen should be mobile-first, at about 360–430px:
  1. **Mode**: Light / Dark / System. This reuses next-themes.
  2. **Season**: a list of options, each at least a 56px row:
     - Ora (default);
     - Follow the liturgical year, with a caption naming today's resolved season, for example "Today: Ordinary Time · Green";
     - the seven seasons, each with a swatch, name, when it's used, and its meaning. Use this copy:
       - Violet: Advent and Lent; sorrow, penitence, preparation
       - Rose: Gaudete and Laetare Sundays; subdued joy
       - White: Christmas and Easter; purity, victory, joy
       - Gold: Solemnities; joy
       - Green: Ordinary Time; hope, growth
       - Red: Passion, Pentecost, martyrs; sacrifice, the Holy Spirit
       - Black: All Souls; mourning, prayer for the dead
  3. **Preview**: picking an option does **not** change the app yet. It updates a preview, a scaled mock of the Ora home screen built from real components where possible:
     - Ora logo header with a season chip;
     - a "Holy Rosary · Decade 3 of 5" card with a bead row (6 of 10 filled in `gold`) and a "Continue praying" `AppButton`;
     - two favorite prayer rows;
     - the bottom nav with Rosary active.
     
     The preview has its own **Day / Night** switch, independent of the app's mode.
  4. A sticky **Apply** `AppButton` sits above the bottom nav with safe-area insets. It is disabled when the previewed choice equals the saved one. Applying saves to localStorage, updates `<html>`, and shows a toast using the existing `components/toast`.
- **Preview isolation is the tricky part.** The app's dark mode is `@custom-variant dark (&:is(.dark *))`, so anything rendered while the app is dark matches `dark:` utilities even inside a "Day" preview. Therefore:
  - The preview wrapper sets `data-preview-season` and `data-preview-mode`, which redefine the full token set on that element.
  - Everything inside the preview uses only token classes (`bg-background`, `text-primary`, `border-border`, …) and **no `dark:` variants**.
  - If a reused component has `dark:` classes, make a preview-only variant rather than letting it leak.
  - Check this by previewing Day while the app is in Dark, and Night while it's in Light.
- Respect `prefers-reduced-motion` for any transition between previews.

## 5. Constraints

- Don't touch the Rosary data or sequence engine. The Rosary must keep working offline and signed out with every season.
- No new dependencies.
- Keep `AppButton`; don't add a shadcn Button.
- `public/sw.js` needs no change unless you add `/appearance` to the precache. If you do, bump `VERSION`.

## 6. Verify, then stop

Run:
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npm run start -p 3100`, then `curl` `/`, `/rosary` and `/appearance` to check that they return 200 and that the head script is in the HTML.

Report:
- the `seasonForDate` results for the dates above;
- the contrast table;
- the files you changed.

Don't commit. Stop for my review.
