# Ora promo video — Claude Motion prompt

Paste everything below the line into Claude Motion. Attach `public/brand/ora-lockup-light.svg`, `public/brand/ora-mark-gold.svg` and `public/brand/ora-app-icon.svg` if it accepts assets. Optionally attach a few app screenshots as loose visual reference.

---

Create a 45-second horizontal (16:9, 1920×1080) promo video for **Ora**, a Catholic prayer app that installs on a phone as a PWA and also runs in any web browser. Tagline: "A calm place to keep your prayers and pray the Rosary."

## Stay close to the real app's look

The screens don't need to be an exact, pixel-perfect copy of Ora. Simplify and stylize them freely so they read well in motion. But keep them recognizably Ora, using the "Ora UI reference" below as a guide: the same overall layout per screen, the ivory/navy/gold palette, serif headlines, flat bordered cards, the five-tab bottom nav, and the key labels. Avoid anything that would make it look like a different app: dark neon themes, heavy gradients, glassmorphism, busy illustrations, or a completely different navigation.

## Look and feel

- Mood: calm, reverent, warm, unhurried. Like candlelight in a quiet chapel, never flashy.
- Palette: ivory background `#F8F4EA`, deep navy text and primary `#2A3557`, gold accent `#B28D34`, beige hairline borders. Night mode uses deep navy `#141A2E` backgrounds, with primary and gold both turning light gold.
- Type: Cormorant Garamond for headlines, Source Serif 4 for prayer text, Hanken Grotesk for UI labels.
- Motion: everything arrives "like light": fade in while rising about 12px, easing `cubic-bezier(0.22, 1, 0.36, 1)`. Slow cross-dissolves between scenes, no whip pans, spins or bounces.
- Show the app inside a modern, slim-bezel portrait phone mockup floating on the ivory background with a soft shadow. The app UI only ever appears inside the phone (or the laptop in scene 8), never full-frame.
- Horizontal layout: the phone fills about 80% of the frame height and sits on one third of the frame; the caption sits on the other side in large Cormorant Garamond, left-aligned and vertically centered. Alternate the phone between the left and right thirds from scene to scene, gliding it across during the cross-dissolve.
- Fill the empty space softly: a faint gold radial glow behind the phone and a very subtle ivory paper texture. Gentle parallax and a slow push-in on the phone during each scene.
- No voiceover; short on-screen captions only (max 6 words each).

## Music and sound

Add an original, royalty-free instrumental score that runs the full 45 seconds and is mixed under the visuals (no lyrics, no vocals except an optional wordless choir pad).

- Style: sacred ambient. Solo felt piano over warm string pads, with a soft wordless choir "ooh" pad and a faint organ drone underneath. Think a quiet chapel at dusk, modern and cinematic, not churchy or dated.
- Key and tempo: D major, about 64 BPM, 4/4. Simple, hymn-like chord movement (D – Bm – G – A).
- Structure, synced to the scenes:
  - 0–4s (logo): a single sustained choir pad fades in from silence; one soft bell or chime as the gold mark finishes drawing.
  - 4–9s (install): felt piano enters with a slow, gentle melody; a light chime on the install tap.
  - 9–19s (Rosary): strings join softly. Each bead lighting up gets a very quiet, warm tone (like a small handbell or kalimba) placed on the beat, so the beads feel musical.
  - 19–23s (offline): the music thins to piano only for a moment, calm and steady, to show nothing breaks.
  - 23–34s (library and intentions): full but soft arrangement; a soft click or chime on the heart tap and on "Mark answered".
  - 34–38s (seasons): a gentle harmonic shift on each color change; a lower, darker pad as night mode fades in.
  - 38–42s (web): the music builds, strings and choir swelling slowly.
  - 42–45s (closing): resolve to a warm D major chord with a final bell on the logo, then a long reverb tail fading to silence.
- Mix: music sits around -18 LUFS, UI sounds subtle and below the music. No whooshes, risers, drum hits or bass drops.

## Ora UI reference (a guide, not a strict spec)

**Global.** Flat design. Cards are rounded (about 22px radius) with a 1px beige border on a slightly lighter ivory, and no shadow (only the Rosary prayer card has a very light one). Pages have 16px side padding. Page titles are Cormorant Garamond 30px in navy with a muted one-line description below. Buttons are rounded-xl: primary is solid navy with ivory text, outline is a beige border on ivory; 48–56px tall. Icons are Lucide line icons.

**Mobile header.** 56px, ivory with a hairline bottom border. Left: a small round navy Ora mark plus "Ora" in Cormorant. Right: two ghost icons, a palette and a sun.

**Bottom nav.** 80px, card-colored, with a softly rounded top edge. Five equal tabs, each a 24px Lucide icon in a pill above a 13px label: Home (house), Prayers (open book), Rosary (cross), Intentions (hand with heart), Profile (user). The active tab has a pale gold-cream pill behind the icon, a navy semibold label and a tiny 20px gold bar above it; inactive tabs are muted grey-blue. The Rosary pill keeps a faint gold tint. It is not raised or larger.

**Home.** Title "Peace be with you", description "Take a moment. What would you like to pray?" Three stacked cards, each with a 48px pale-gold circle holding a navy icon, a Cormorant title, a small muted line and a muted arrow on the right:
1. Cross, "Pray the Rosary", "A guided, visual Rosary. No account needed, and it works offline."
2. Book, "Your prayers", "Keep the prayers you love, organised into collections."
3. Hand-heart, "Intentions", "Hold the people and needs you are praying for."

**Rosary picker.** Title "The Rosary", description "Pray with the mysteries of today." Heading "Choose the mysteries", subline "Wednesday is traditionally the Glorious Mysteries." Four stacked tiles: Joyful, Luminous, Sorrowful, Glorious Mysteries. The selected tile has a gold border and a faint gold fill; today's set shows a small gold "Today" under its name. Below, a muted numbered list of the five mysteries. A sticky bar above the bottom nav holds two 56px buttons: "Learn" (navy) and "Pray" (outline).

**Rosary player.** At the top, the Rosary drawn as beads with a small crucifix. Prayed beads are solid navy, the current bead is gold with a softly breathing gold halo ring, upcoming beads are pale beige with a thin outline. Below: a muted "Leave" link on the left and a pill-shaped "Learn | Pray" toggle on the right (active side is a navy pill). Then the prayer card: small uppercase muted eyebrow like "THIRD DECADE · 3 OF 10", title "Hail Mary" in Cormorant 30px, and the prayer in Source Serif 20px with generous line height. Sticky controls at the bottom: an outline "← Back" button and a wide navy "Next →" button, with "Step 34 of 80 · swipe" in tiny muted text below.

**Rosary completion.** A gold check in a soft gold circle, "Amen." in large Cormorant, a short gold rule drawing outward, then muted serif text "You have finished the Glorious Mysteries. May the peace of Christ keep your heart." and a navy "Return" button.

**Prayers.** Title "Prayers", description "Your personal prayer library.", navy "+ New" button top right. A 48px search field with placeholder "Search prayers" (no icon). A row of pill filters: All, Mine, Starter, Favorites, Collections (Collections has a thin gold border); the active pill is solid navy with ivory text. Prayer cards show a Cormorant title, a muted one-line preview, a tiny "Mine" or "Starter", and a heart icon on the right that fills navy when favorited.

**Intentions.** Title "Intentions", description "The people and needs you are praying for.", "+ New" button. Each card shows the intention text, a tiny muted "Added Oct 13", and a row of buttons: "✓ Mark answered" (outline, wide), "Edit" (outline), and a trash icon. A collapsible "Answered (2) ▾" heading in Cormorant below.

**Appearance.** Title "Appearance", description "Choose how Ora is colored. Preview it before you apply." A Mode segmented control (Light, Dark, System). A Preview: a small mock home card reading "Holy Rosary · Decade 3 of 5" with ten dots (six gold, four muted) and a "Continue praying" button. A Season list of rows, each with a round color swatch, a name and a muted line: "Ora (default)", "Follow the liturgical year", then Violet, Rose, White, Gold, Green, Red, Black. The selected row has a navy border and a navy check. A full-width navy "Apply" button sticks to the bottom.

**Desktop.** Same pages, wide layout. A 240px left sidebar in a slightly deeper ivory with the Ora logo, "A quiet place to pray" in tiny muted text, and the same five items; the active item has a pale fill, a gold icon and a thin gold bar on its left edge. No bottom nav.

**Install card.** At the top of the content: a rounded card with a thin gold border, title "Install Ora", text "Add it to your home screen to pray the Rosary even offline.", a navy "Install" button with a download icon and a small X to dismiss.

**Offline banner.** A full-width navy strip above the header with a wifi-off icon and small ivory text: "You're offline. The Rosary and saved prayers still work."

## Scenes

**1. Opening (0–4s).** Black fades to ivory. The gold Ora mark draws itself with a thin stroke in the center of the frame, then the "Ora" wordmark fades up beneath it. The phone rises in from below as the logo moves aside. Caption: "Pray, wherever you are."

**2. Install as an app (4–9s).** The phone shows Ora's Home screen in the browser with the "Install Ora" card on top. A finger taps "Install"; cut to the phone home screen where the Ora icon drops in with a soft glow. Tap the icon: the app opens full screen on an ivory splash with the gold mark, then Home. Caption: "Installs like an app."

**3. Pray the Rosary (9–19s).** Tap the Rosary tab. The picker shows Glorious Mysteries selected with "Today". Tap "Pray". The player opens; the finger taps "Next" several times and each tap turns the gold bead navy and moves the gold halo to the next bead while the prayer card slides to the next prayer. Caption: "Every bead, gently guided."

**4. Works offline (19–23s).** Airplane mode turns on (status bar icon appears) and the navy offline banner slides open above the header. The Rosary keeps going, beads keep advancing, ending on the "Amen." completion screen. Caption: "Keeps praying offline."

**5. Your prayer library (23–30s).** Prayers tab. Type "our" in "Search prayers" and the list filters to cards like "Our Father". Tap a heart: it fills navy with a small pop. Tap the "Favorites" pill and the navy pill slides over to it. Caption: "Your prayers, kept close."

**6. Intentions (30–34s).** Intentions tab with a few cards, the first reading "For my mother's health". Tap "Mark answered" and the card moves into the "Answered" section. Caption: "Hold your intentions."

**7. Liturgical seasons (34–38s).** Appearance screen. Tap Violet, then Green, then Gold in the Season list; the preview and the whole app re-tint smoothly each time. Then tap "Dark": ivory fades to deep navy and gold. Caption: "Follows the liturgical year."

**8. Also on the web (38–42s).** The phone slides to the left third and a laptop with a browser window rises in beside it on the right, both devices side by side using the full width. The laptop shows the desktop layout with the sidebar and the Prayers page. A heart tapped on the phone fills on the laptop too. Caption centered above the two devices: "On your phone. In any browser."

**9. Closing (42–45s).** Both devices dissolve away. The Ora lockup centered on ivory, gold mark glowing softly. Text below: "Ora — Catholic prayer". Smaller line: "Pray the Rosary free, no account needed." Hold, then fade to ivory.

## Constraints

- Keep all text legible when the video is watched on a phone held sideways; never more than one caption on screen.
- Religious imagery stays respectful: no stock clipart, no glitter or lens flares. Gold light, beads and the cross are enough.
- 30-second cut, if needed: drop scenes 4 and 6, shorten scene 3 to 8 seconds, and keep the same music shape (choir intro, piano, swell, final chord) compressed to 30 seconds.
- Vertical version, if needed: same scenes at 9:16 (1080×1920), phone centered, caption above the phone instead of beside it.
