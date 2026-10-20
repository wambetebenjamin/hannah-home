# Verification record

Verified on 20 October 2026 using Node **24.0.0**, Next **16.4.2** and the committed exact dependency pins. This records code and local preview verification, not a live-business or legal compliance certification.

## Required build gates

After stopping the development server, moving generated Next output out of the way, and doing a clean dependency install:

| Command | Result |
| --- | --- |
| `npm ci` | Passed, 188 packages installed; zero audit vulnerabilities. |
| `npx tsc --noEmit` | Passed before generating a new `.next` directory. |
| `npm test` | 18 tests passed. |
| `npx next build` | Passed with the default Turbopack production compiler. 29 static-generation tasks completed; all specified page/API routes were present. |
| `npm audit --audit-level=high` | Passed, zero vulnerabilities of any severity on the tested lockfile. |
| `npm run build` | Passed the source/audit gates and production build together. |
| `npm run verify:source` | Passed: 81 original paths retained, original CSS and font-face files unchanged, exact pins, no banned punctuation in checked source/text files. |
| `git diff --cached --check` | Passed for new application code. `.gitattributes` exempts preserved vendor assets from whitespace checks and newline normalization; their original whitespace is retained. |

The dependency warnings for the explicitly requested Vercel KV and Recharts versions are deprecation notices, not build/audit failures. Node 24.0.0 warns that its native TypeScript stripping is experimental; the 18 tests still pass. See `docs/dependency-decisions.md` for the user-authorised package fixes and the development-only Webpack choice.

## Unit and policy tests

18 passing tests in `tests/validation.test.ts` and `tests/captcha-policy.test.ts` cover:

- All eight service records and three packages, prices and formatting.
- Africa/Nairobi date boundaries and two-hour slot lead time.
- Impossible/past/out-of-range dates and unknown package/service/time rejection.
- Zod field bounds, Kenyan phone formats, ASCII email normalization, consent and injection-shaped inputs.
- Server-authoritative pricing/ownership, with forged extra fields stripped.
- Review bounds, reference formats and signup validation.
- reCAPTCHA 0.5 cutoff, v2 fallback decision, hostname/action binding, timestamps, malformed payloads and impossible scores.

## API integration

28 passing checks in `tests/api-smoke.mjs`, against the explicit local-development preview:

- Catalogue filtering and detail routes, unknown service 404s.
- Session gates for lists, lookup and reviews.
- Cross-origin rejection, date validation and CAPTCHA action binding.
- Opaque references, server pricing/status/ownership, idempotent retries and capacity exhaustion.
- Guest requests cannot be read by an unrelated authenticated account.
- Only completed jobs are reviewable; duplicate reviews are rejected.
- Signed confirmation receipt survives refresh, while an unauthorised reference reveals no private data.
- Contact preview accurately says no email was sent.
- Unsigned account visits redirect without rendering private records. Next may return a streaming redirect in a 200 response; this is distinguished from the API's actual 401 responses.

The integration checks exercise the single-process development store. Hosted Redis/Lua concurrency under multiple deployed instances needs staging tests with real provider credentials.

## Browser end to end

41 passing assertions in `tests/browser-smoke.mjs` using Playwright with Chromium 140 and normal browser origin enforcement. Checked at 1440px desktop and 390px mobile widths:

- Eight service cards and four labelled sample professionals.
- No banned rendered punctuation.
- No reCAPTCHA/analytics requests before submission/consent.
- Necessary preference locked, optional preferences default off, exact localStorage key and persistence after refresh.
- Service search, filters, clear/empty states and professional availability filters.
- Service detail prices and account sign-in gating.
- Explicit preview sign-in, completed-job review persistence, rebooking and package preselection.
- All five booking steps, required date/time validation, real local API submission, confirmation, calendar timezone and refreshed receipt.
- New booking appears in the signed-in list.
- Contact submission reports simulated delivery honestly.
- Legal and error routes, unknown-route handling.
- No horizontal overflow on seven mobile pages.
- Mobile menu dialog opens and closes with Escape.
- No hydration or runtime errors. Intentional 404/500 route HTTP errors are checked separately, not mistaken for application exceptions.

A reduced-motion hydration mismatch found during testing was fixed. The final browser pass has no such warnings/errors. Test screenshots are ignored under `.cache/`, not checked into Git.

## Site tools and accessibility

`tests/site-tools-smoke.mjs` passes interaction-gated voice start, the exact script/rate/pitch/language, keyboard-scroll initiation, mute and replay states, pulsing-ring state, the 56px/24px/z-index-9998 WhatsApp geometry and exact link, preference-dialog keyboard focus, and the reduced-motion loader. The voice engine is mocked for deterministic state tests; actual audible playback and available en-KE voices depend on the visitor's browser/OS.

Axe-core WCAG 2 A/AA and WCAG 2.1 AA checks report **zero violations** on `/`, `/services`, `/booking`, `/auth/signup`, `/professionals` and `/legal/privacy-policy`. Additional application text colours were adjusted for contrast without modifying the original template CSS files or custom properties. Automated scans are not a complete accessibility certification; screen-reader and broader device testing remain advisable.

## Production fail-closed checks

13 assertions in `tests/production-smoke.mjs` passed against `next start` on port 3001 with `HANNAH_DEMO_MODE=true` deliberately set:

- Public catalogue works without secrets.
- Production still rejects demo sign-in with 404 and forged/demo cookies with 401.
- Missing hosted storage returns 503; no fake booking success.
- Booking/sign-in UI clearly reports missing configuration and contains no preview-account entry.
- Cross-origin writes return 403.
- Explicit `/404` and `/500` return the corresponding HTTP statuses.
- Poppins, IcoMoon and FontAwesome assets are served locally.

The production test server is stopped after verification. The user-facing preview is the explicitly labelled local-development mode on port 3000.

## Not verified without operator setup

No live Google OAuth login, Google reCAPTCHA network verification or rendered provider challenge, SMTP email delivery, hosted Redis connection, Vercel cloud deployment, real professional dispatch, payment collection, business-data authenticity or legal compliance is claimed. No provider secrets were supplied. Required setup, retention and operational responsibilities are documented in `README.md`, `docs/operations.md` and the on-site legal notices. Photos are real licensed Pexels stock, not verified staff; the hero's Nairobi location is unverified and is explicitly documented in `image-credits.md`.

## CI delivery status

The user authorised proceeding without active CI after GitHub rejected workflow writes from the Arena connection. The workflow is retained unchanged as `docs/ci-workflow.example.yml`, outside the active `.github/workflows/` directory. GitHub Actions does not execute this template. All verification results above are local checks, not a remote CI pass. An operator with workflow permission may activate it later by copying it to `.github/workflows/ci.yml`.
