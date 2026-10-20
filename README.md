# Hannah Home

Trusted hands. Happy home. A Nairobi home-services booking application built on the supplied Capiclean template, not a replacement template.

## Start locally

Use **Node 24** (`nvm use` reads `.nvmrc`).

```sh
npm ci
npm run dev:preview
```

Open the address printed by Next.js. The server binds to `0.0.0.0` and permits Arena's `*.e2b.app` development preview hosts. Browser code calls relative API URLs, never a browser-side localhost backend.

`dev:preview` explicitly enables a **local-development-only simulation**. It uses temporary in-process booking storage, signed test sessions and simulated CAPTCHA. It never sends contact emails, dispatches a professional or collects payment. Use fictional information. The preview account contains a labelled completed job so you can test rating, reviewing and rebooking. Restarting the server clears its records. The flag is ignored in production, even if accidentally set there.

For a configured development environment, copy `.env.example` to `.env.local`, fill only your own service credentials, and run `npm run dev`. Never commit `.env.local` or paste secrets into chat. Production must use configured hosted KV storage, not the preview store.

## What is implemented

- Homepage with the original curved blue banner, matching local Poppins/Rajdhani fonts, eight service categories, process, assurances, four clearly labelled sample profiles, illustrative testimonials and FAQs.
- Searchable/filterable service directory, eight service details with inclusions, exclusions, bedroom-package prices and durations.
- Five-step booking with service/package, live API time-slot lookup, Nairobi address, contact details and review. M-Pesa/cash are **after-service choices**, not payment collection or an STK push.
- Server-generated opaque references, idempotency, capacity checks, protected confirmation receipts and Google Calendar links using Africa/Nairobi time.
- Google OAuth sign-in/sign-up forms with react-hook-form and zod. No local password database.
- Session-protected booking history, ownership-checked lookup, completed-job reviews, duplicate-review prevention and rebooking.
- Contact form and Nodemailer delivery, invisible v3 CAPTCHA with a real v2 checkbox fallback below score 0.5, server verification and single-use signed permits.
- Consent banner and keyboard-accessible preference dialog; optional analytics off by default, revocable, with query strings stripped from analytics events.
- House-outline preloader, native browser voice tour, WhatsApp link and the required motion effects with reduced-motion handling.
- Legal notices, explicit 404/500 routes, not-found/error boundaries, robots and sitemap.

All profiles, counts, testimonials and catalogue prices need business approval before live use. Stock portraits are labelled and must not be represented as actual employees or endorsements.

## Preserved template

The complete extraction and audit were printed before application code was written. See [`docs/template-audit.md`](docs/template-audit.md) and the SHA-256 manifest in `docs/template-manifest.json`.

All **81 original files** and their paths remain. All original CSS files, 28 custom properties in each Bootstrap stylesheet, and both original `@font-face` rules remain verbatim. Original Poppins and Rajdhani families and missing icon-font files are supplied locally under `public/fonts/`; they were not replaced with another family. Original assets have static mirrors under `public/`. Legacy jQuery plugins are not executed by the Next.js app.

`public/css/template-local.css` contains all original non-import style rules. It avoids the original unresolved library and remote-font imports, while the untouched `css/style.css` and `public/css/style.css` retain the source imports. `styles/app.css` adds responsive application layouts, readable text, focus states and the required light footer. One em dash in a non-rendered vendor comment was replaced with a comma; the source verification gate checks that this is the only original-file exception.

## Dependency decisions

The original request contained an unpublished Blob version and vulnerable Auth.js, jsPDF and Nodemailer pins. After user approval, only necessary direct pins and Motion transitive compatibility overrides changed. See [`docs/dependency-decisions.md`](docs/dependency-decisions.md). The lockfile passes `npm audit --audit-level=high` with zero vulnerabilities at verification time.

## Environment and launch requirements

`.env.example` contains every requested variable. Two additional Google v2 variables are necessary because v3 and v2 use different key pairs:

- `NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY`
- `RECAPTCHA_V2_SECRET_KEY`

Configure these services before enabling real booking:

1. `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL`: the canonical HTTPS website URL; configure Google OAuth callback as `https://YOUR_DOMAIN/api/auth/callback/google` in the provider console. The example is documentation, not an actual deployed domain.
2. `NEXTAUTH_SECRET`: a randomly generated secret of at least 32 characters, plus Google client ID/secret. Google must report a verified email matching the email entered on the form.
3. reCAPTCHA v3 and v2 keys registered for the production domain. Google verification checks hostname, action, challenge age and score. Missing configuration fails closed, not open.
4. KV REST URL/token: the requested Vercel KV client can connect to the supported Redis integration. Booking persistence, rate limits and consumed permits use Redis. Region and data-processing terms require operator review.
5. SMTP host, port, username, password and sender. Contact enquiries are delivered to the configured sender mailbox with the customer's email only as reply-to. No attachments, remote resources or arbitrary recipients are accepted.
6. `NEXT_PUBLIC_WHATSAPP_NUMBER` defaults to the requested `254112272061`.

`PEXELS_API_KEY` is reserved for future image sourcing; current images are local, so it is not required at runtime. `BLOB_READ_WRITE_TOKEN` is reserved; this application does not expose an upload form or put private booking data in public blobs.

Run `npm run check:env` in the deployment environment to check required configuration without printing credential values. This checks configuration presence and format, not provider connectivity. Read [`docs/operations.md`](docs/operations.md) before launch.

No live provider credentials were supplied. Live Google OAuth, Google challenge rendering/verification, SMTP delivery, hosted KV concurrency and a public Vercel deployment still require staging validation. Production runs in a clearly unavailable/read-only state for unconfigured actions. Legal entity details, ODPC obligations, international-transfer safeguards, actual vetted professionals, real testimonials, final prices and capacity require operator approval. The legal notices explicitly disclose those outstanding matters and are not a legal compliance certification.

## Verification

```sh
npm ci
npx tsc --noEmit
npm test
npx next build
npm audit --audit-level=high
npm run verify:source
```

`npm run build` checks source preservation and the high/critical audit gate **before** building. The optional GitHub Actions workflow is saved at [`docs/ci-workflow.example.yml`](docs/ci-workflow.example.yml) and is **inactive**. With workflow permission, an operator can copy it to `.github/workflows/ci.yml` to enable these gates on Node 24. This delivery uses the passed local checks; no remote CI run is claimed. To exercise the dev-only APIs while `npm run dev:preview` is running:

```sh
npm run test:api
```

Optional browser tests install their tooling outside the application lockfile:

```sh
npm run setup:browser-tests
npm run test:browser
npm run test:accessibility
npm run test:site-tools
```

These scripts use Playwright, an npm-distributed Chromium and axe-core under ignored `.cache/browser/`. No browser binary or generated screenshot is committed. The bundled browser checks target Linux x64. They expect the local demo on port 3000 and never target a real production system. See [`docs/verification.md`](docs/verification.md) for results and scope.

For the fail-closed production check, build first, then start `HANNAH_DEMO_MODE=true npm start -- --port 3001` with **no provider credentials**, and run `npm run test:production` in a second terminal. The flag is deliberately set to verify that production ignores it. Do not target a configured live deployment with this test.

## Privacy and operational notes

- Production booking capacity and storage updates are atomic Lua operations, not client-local fake successes.
- Prices, status and account ownership are derived server-side. Supplying them in a JSON payload cannot override them.
- Only bookings made in a signed-in account belong to that account. An unverified guest email is never automatically attached to a verified account.
- A guest's last receipt is readable in the originating browser for one hour. `/api/bookings/[ref]` remains session-gated even when a guest receipt exists.
- Booking/review data expires 90 days after the service date. Rate-limit identifiers and single-use CAPTCHA permits have short TTLs. Enquiry mailbox retention must be managed by the operator.
- This is a booking-request system. A human coordinator must confirm the assigned professional and time. No automatic professional dispatch or booking-notification integration is claimed.
- Production `vercel.json` is the verbatim requested configuration, including `X-Frame-Options: DENY`. Those Vercel-only headers are not applied to the iframe-based local development preview.

## Credits

See [`image-credits.md`](image-credits.md) for exact Pexels pages, photographer names, license confirmations and geographic/professional-identity limitations. The hero is an illustrative modern interior; its source does not verify Nairobi. The four stock portraits have Nairobi location metadata. Original template credit remains in the footer. Font license texts are stored with the local fonts.
