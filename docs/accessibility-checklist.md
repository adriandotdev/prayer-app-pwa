# Accessibility checklist (WCAG 2.2 AA)

Automated: `pnpm test` runs `tests/contrast.test.ts`, which checks text (4.5:1) and focus ring / gold (3:1) contrast for the default theme and all seven liturgical seasons, day and night. Run the manual checks below before a release that touches UI.

## Keyboard
- [ ] Tab reaches every control in a sensible order; the skip link jumps to `#main`.
- [ ] After navigating to another page, focus moves to the page content (not left on the old link).
- [ ] `/rosary`: the mystery cards are one tab stop (arrow keys choose a set). In the player, the bead tracker is one tab stop (arrows move, Enter jumps), Left/Right arrows change step.
- [ ] After finishing a Rosary, focus lands on "Amen."
- [ ] Dialogs and sheets trap focus and return it on close.

## Screen reader (VoiceOver on iOS and macOS, TalkBack on Android)
- [ ] Changing step announces the section, title and "step X of 80", not the whole prayer.
- [ ] Beads read as "{label}, current/completed/upcoming".
- [ ] Form errors are announced and the field reports invalid.
- [ ] Icon-only buttons have names (favorite names the prayer).

## Visual
- [ ] 200% zoom and 320px width: no horizontal scroll, nothing clipped.
- [ ] Prayer text scale in Appearance works at the largest size.
- [ ] Reduced motion on: no slides or pulses; content still appears.
- [ ] Touch targets are at least 44px on phone.
