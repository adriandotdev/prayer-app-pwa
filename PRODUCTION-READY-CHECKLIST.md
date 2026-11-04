# Production readiness checklist

Tracks what must be true before Ora launches publicly with real accounts. Last reviewed: 2026-11-04.
Tick items as they are finished and note the PR next to them. Items marked **(dashboard)** live outside the repo and must be verified by hand.

## Suggested order

Work top to bottom; each step builds on the one before.

1. [x] **Legal basics:** privacy policy, terms, and a consent decision (section 1).
2. [x] **User data rights:** account deletion and data export (section 1). Built; needs `SUPABASE_SERVICE_ROLE_KEY` set and a manual run on staging.
3. [ ] **Security hardening:** CSP in report-only mode, HSTS verified, npm advisories fixed (section 2).
4. [ ] **Operations:** error monitoring, uptime checks, a separate production Supabase project with backups (section 3).
5. [ ] **Quality gates:** cross-user RLS test and an end-to-end smoke test (section 4).
6. [ ] **Launch pass:** walk the dashboard checklist, review Phase 6, then set `ALLOW_INDEXING=true` (section 5).

## Already in place

- [x] RLS enabled on every table, owner-scoped with `(select auth.uid())`
- [x] zod input validation plus database length constraints (`20261020000000_harden_inputs.sql`)
- [x] Google-only sign-in (no passwords stored); `safeNext` blocks open redirects
- [x] Server actions check `getUser()` before writing
- [x] Only the publishable Supabase key is used; `.env*` is git-ignored; no service-role key in code
- [x] Security headers: `nosniff`, `X-Frame-Options: DENY`, referrer policy, permissions policy, no `X-Powered-By`
- [x] Staging stays out of search via `ALLOW_INDEXING`
- [x] CI runs typecheck, lint, test and build
- [x] Service worker drops cached signed-in pages on sign-out

## 1. Privacy and compliance

Prayer intentions and Rosary history reveal religious belief, a special category of data under GDPR Art. 9 and sensitive personal information under the Philippines Data Privacy Act and several US state laws.

- [x] Decide which regions you serve and the lawful basis: Philippines only; lightweight consent at sign-in, withdrawn by account deletion
- [x] Privacy policy page, linked from the footer, the login page and the sign-in consent text
- [x] Terms of service page
- [x] Consent mechanism: login-page consent text (withdrawal path depends on account deletion)
- [x] Account deletion in the app (server action using `auth.admin.deleteUser` with a server-only service-role key); confirm foreign keys cascade so no user rows remain
- [x] Data export (JSON of prayers, collections, intentions, favorites and Rosary sessions)
- [x] Name Vercel Analytics in the privacy policy; check whether a consent banner is needed for target regions (named in the policy; cookieless aggregate stats, Philippines only, so no banner. Confirm this judgment call)
- [ ] Sign data-processing agreements with Supabase and Vercel
- [ ] Confirm prayer texts shipped are public domain or licensed (audited in `docs/prayer-sources.md`: ICEL Creed wording and the Divine Mercy texts still need a decision)
- [x] Confirm landing art licenses allow commercial use; add visible attribution where required (`docs/landing-art-credits.md`; credits page at `/credits`, linked from the landing footer and profile. Still spot-check the photographed Prado, Cleveland and Google Cultural Institute files)

## 2. Security hardening

- [ ] Content-Security-Policy: start with `Content-Security-Policy-Report-Only` (inline scripts need nonces or hashes), then enforce
- [ ] `Strict-Transport-Security`: verify with `curl -I` on the real domain, or add it in `next.config.ts`
- [ ] Rate limiting / quotas: per-user row caps on prayers, collections and intentions (database trigger), plus Vercel firewall rules
- [ ] Resolve the 6 `npm audit` advisories (2 low, 4 moderate); triage which affect production
- [ ] Test the shared-device case: user A signs out, user B opens the app offline; no private pages visible
- [ ] Publish `/.well-known/security.txt` with a contact address
- [ ] **(dashboard)** Supabase redirect URL allow-list contains only production and staging URLs
- [ ] **(dashboard)** Email and phone providers disabled (Google only)
- [ ] **(dashboard)** Auth rate limits reviewed; CAPTCHA considered
- [ ] **(dashboard)** Production API keys rotated and stored only in hosting env vars

## 3. Operations

- [ ] Error monitoring (e.g. Sentry) for client and server
- [ ] Uptime monitoring with alerting
- [ ] Separate production and staging Supabase projects (today `CLAUDE.md` references one project ref)
- [ ] **(dashboard)** Paid Supabase plan with point-in-time backups; free projects pause, and `supabase-keepalive.yml` is a workaround, not a production plan
- [ ] Documented migration and rollback procedure (`supabase db push` has no automatic undo); test a restore once
- [ ] Incident and breach-response notes: who is contacted, and the 72-hour GDPR notification window
- [ ] Support or contact email published in the app (links render once `NEXT_PUBLIC_CONTACT_EMAIL` is set in Vercel)

## 4. Quality gates

- [ ] RLS test: user A cannot read or write user B's rows in any table
- [ ] End-to-end smoke test covering sign-in, saving a prayer and the offline Rosary sync
- [ ] Screen reader pass through `docs/accessibility-checklist.md` (VoiceOver and TalkBack)
- [ ] Performance budget verified on the production build (`docs/performance-budget.md`)
- [ ] Phase 6 (polish) reviewed and signed off
- [ ] Lighthouse PWA, accessibility and best-practices checks on the production URL

## 5. Launch pass

- [ ] Every **(dashboard)** item above verified
- [ ] Production env vars set: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`
- [ ] Google OAuth consent screen published and verified for the production domain
- [ ] Set `ALLOW_INDEXING=true` on the production project only
- [ ] Confirm `robots.txt`, sitemap and noindex behave correctly on production and on staging
- [ ] Bump `VERSION` in `public/sw.js` if cached paths changed
- [ ] Post-launch watch: check error monitoring and uptime for the first 48 hours
