---
name: mobile-first-ux
description: Mobile-first UX conventions for the Ora prayer PWA (Next.js 16, Tailwind v4). Use this skill whenever you build or change any UI in this repo — a new page, component, form, list, button, sticky/fixed bar, nav, modal, the prayer reader, Rosary or sequence screens, or PWA/offline states — and whenever the user mentions mobile, responsive, touch, thumb reach, safe area, notch, layout, or "how should this look on a phone", even if they don't say "mobile-first". Ora is used mostly one-handed on a phone, often at night, so every screen should be designed for ~360–430px first.
---

# Mobile-first UX for Ora

Ora is a prayer app. People use it one-handed, on a phone, often in a dim room, sometimes with the screen lit for a long reading. A cramped layout, a missed tap, or a bright flash breaks the moment of prayer. So the phone layout is the real layout: write it first, then add `md:` enhancements for the sidebar and wider screens. The conventions below already exist in the code; follow them instead of inventing new ones.

## 1. Write the base classes for a 360–430px screen

- Unprefixed Tailwind classes are the phone layout. Add `md:` only to enhance (sidebar, two columns, larger type), never to rescue a broken phone layout.
- Follow `components/layout/app-shell.tsx`: `px-4 pt-6 pb-32` on phones, `md:px-10 md:pt-14 md:pb-16` on desktop; content `max-w-3xl`; sidebar appears at `md:`.
- Default to a single column. Use grids only as `md:grid-cols-2` (see `app/prayers/page.tsx`).
- No horizontal page scroll. Wide things (tab strips, chips) scroll inside their own container, bleeding to the screen edge: `-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0` (see `components/prayers/filter-tabs.tsx`).

## 2. Touch targets and thumb reach

- Use `AppButton` from `components/app-button.tsx` for every button and button-like link (`href` renders a `Link`). Sizes: `md` 48px, `lg` 56px for primary actions, `icon` 44px. Never add the shadcn Button; it was removed on purpose.
- Any other tappable element (list rows, icon toggles, nav items) needs at least 44px of hit area. Bottom-nav links use `min-h-14`. If the visible icon is smaller, pad it up.
- Put the primary action where the thumb is: bottom of the screen or a sticky bottom bar, not the top-right corner. Destructive actions (delete) sit away from primary ones and need confirmation.
- Give pressed feedback with `active:` styles (`AppButton` has `active:scale-[0.98]`). Don't make anything depend on `hover:`; there is no hover on a phone.
- Keep gaps of at least 8px between adjacent tap targets so a thumb doesn't hit the wrong one.

## 3. Safe areas and viewport

The viewport uses `viewportFit: "cover"` (`app/layout.tsx`), so content can sit under the notch and home indicator unless you pad for it.

- Anything `fixed` or `sticky` at the top or bottom adds `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`. Examples: `BottomNav` (`pb-[env(safe-area-inset-bottom)]`), `MobileHeader` (`pt-[env(safe-area-inset-top)]`), `OfflineIndicator`.
- Use `min-h-dvh`, not `vh` or `min-h-screen`; mobile browser chrome makes `vh` taller than the visible area.
- Leave room for what's pinned. Page content keeps `pb-32` so the last item is never hidden behind the bottom nav or a sticky bar. If you add a taller sticky bar, raise that clearance.

## 4. Sticky bars and stacking

- A sticky action bar sits above the bottom nav: `sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-20 -mx-4 border-t border-border bg-background/95 px-4 py-3 backdrop-blur`, turning static at `md:` because the bottom nav is `md:hidden`. Copy the pattern in `components/sequence/sequence-player.tsx`.
- Existing z-order: sticky page bars 20, mobile header 30, bottom nav 40, offline banner and skip link 50. Slot new layers into that order.
- Keep pinned chrome thin. On a 640px-tall phone, header (56px) + nav (56px) + a sticky bar already take a quarter of the screen.

## 5. Reading and text

- Prayer text uses `.prayer-text` (serif, `--prayer-scale`, generous line height, ~38rem measure) from `app/globals.css`. Don't hardcode font sizes for prayer content; users will be able to scale it.
- Form inputs use at least `text-base` (16px). Smaller sizes make iOS Safari zoom the page on focus.
- Use `font-heading`/`font-sans` tokens, not new font stacks.
- Short line lengths and generous spacing beat dense UI. Whitespace is part of the tone.

## 6. Dark mode and motion

- Night prayer is a first-class case. Use theme tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-card`), never raw colors, so `.dark` works automatically. Check every new screen in both themes.
- Avoid bright flashes, large animations and anything that startles. Keep transitions short; `prefers-reduced-motion` is already handled globally, so don't fight it with `!important` animation overrides.

## 7. Forms and flows

- Single column, visible labels (not placeholder-only), the correct `type`/`inputMode`/`autoComplete`, and a full-width submit `AppButton`.
- Show errors next to the field and keep the user's input. Disable the submit button while pending and show a loading state (`components/brand/loader.tsx`).
- Keep flows short. The Rosary advance action should stay one tap, and nothing in the prayer flow should need a keyboard.
- Prefer inline or bottom-aligned UI over centered modals on phones. If a menu is needed, use the Radix `dropdown-menu` already in `components/ui/`.

## 8. Offline and PWA

- The Rosary is public and must keep working offline. Never make a Rosary screen depend on a network call, and keep its data static (`data/rosary/`).
- If you add routes that should work offline, add them to the precache list in `public/sw.js` and bump `VERSION`.
- Surface connectivity with `components/pwa/offline-indicator.tsx`; don't build a second banner.

## 9. Before you say it's done

There is no test runner, so check by hand:

1. Run `npm run build && npm run start -p 3100` and open it in a browser with device emulation at 360×640 and 390×844, then at a desktop width.
2. Confirm: no horizontal scroll, last item clears the bottom nav/sticky bar, tap targets feel comfortable, sticky bars sit above the nav, and light and dark both look right.
3. Run `npx tsc --noEmit` and `npm run lint`.
4. If you can't view it in a browser, say so plainly instead of claiming the layout works.

## Out of scope

Don't add a UI library, a second button component, push/reminders, audio, or i18n. Signed-in routes (`/prayers`, `/intentions`, `/profile`) follow the same rules as the Rosary.
