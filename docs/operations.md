# Operations and launch checklist

## Do not treat a successful code build as a live-business launch

The application builds without secrets for previews and local verification. An inactive CI template is available in `docs/ci-workflow.example.yml`. Production booking and authentication integrations fail closed when unconfigured. Do not announce live service availability until the following checks are complete.

- [ ] Set the canonical domain, strong session secret, Google OAuth and both CAPTCHA key pairs in deployment environment variables.
- [ ] Register the exact Google callback path and CAPTCHA hostname. Test high-score v3, low-score v3 to v2, expiry, cancelled challenges and provider outages using authorised test/staging keys.
- [ ] Connect the KV REST integration and test atomic capacity and duplicate requests under concurrency with multiple server instances. The development store is not a substitute.
- [ ] Review Redis region, TLS, provider permissions, contractual safeguards and backups. The hosting region is Paris as explicitly requested.
- [ ] Configure and verify SMTP delivery, reply-to behaviour, mailbox access and retention. Contact forms do not send booking assignment notifications.
- [ ] Verify the WhatsApp number and define a staffed coordination process for the promised two-hour response during service hours.
- [ ] Replace labelled sample professionals, testimonials and counts with verified, consented data. Confirm background checks, qualifications, actual capacity and staff image rights.
- [ ] Review and approve the sample price list, exclusions, applicable taxes, cancellation process and satisfaction remedy.
- [ ] Verify the legal entity/address, ODPC registration obligations, data rights handling and international transfers with appropriate legal advice.
- [ ] Replace the illustrative hero if a geographically verified Nairobi property photograph is required. Do not remove the stock-portrait disclaimers without real staff assets and permission.
- [ ] Confirm HTTPS and the exact Vercel security headers. Do not expect an iframe-embedded production site with `X-Frame-Options: DENY`.
- [ ] Test a real staging booking as guest and as a verified Google user, staff assignment, completion, account access, review and data expiry.

## Request and ownership model

A successful booking submission is `pending`. It is not an automatically confirmed visit. The response contains an opaque reference. Prices and durations are taken from the server catalogue, not from JSON fields. Logged-in ownership uses the verified session email, not the contact email submitted on the form. A guest request has no account owner and is never auto-claimed by signing in with an unverified submitted address.

A signed HttpOnly receipt lets the originating browser see the last booking confirmation for one hour. The account booking APIs always require a session and ownership. A coordinator can help a guest with a reference by phone, after proportionate identity verification outside this interface. Do not share KV credentials with customers or professionals.

## Slot inventory

`hh:slot:SERVICE:DATE:TIME` counts requests against a deliberately small capacity of two for each service/arrival window. This is arrival-request capacity, not a claim that individual professional schedules have been optimised. Review capacity and overlapping jobs with your actual roster before launch. The worker-assignment process must ensure a professional is not double-booked. Do not promise instant dispatch.

Production creates bookings, capacity reservations, idempotency mappings and owner indexes in one Redis Lua operation. Repeated requests with the same idempotency key and owner return the original reference. A full slot returns HTTP 409. The UI asks for another slot. Time slots require at least two hours' lead time and dates within 90 days, in Africa/Nairobi.

## Storage and retention

- `hh:booking:REF`: booking JSON; expires 90 days after the scheduled service date.
- `hh:owner:HASH`: sets of references for a verified email hash; only authenticated server logic reads them. Index TTL covers the longest associated booking lifetime.
- `hh:idempotency:HASH`: duplicate-request mapping, expiring with the booking.
- `hh:slot:SERVICE:DATE:TIME`: reserved request count, with expiry.
- `hh:nonce:NONCE`: consumed CAPTCHA/OAuth permits, five-minute expiry.
- `hh:rate:ACTION:HASH:WINDOW`: short-lived request limits, one-minute expiry.

Booking records contain personal data. Use your provider's secure administration tools and least-privilege credentials. Do not store screenshots or production records in Git. Do not change a pending job to completed just to enable reviews. A completion must reflect work actually performed.

For assignment, completion and cancellation use the restricted operator script with environment credentials, the exact reference and explicit confirmation:

```sh
node --env-file=.env.local scripts/manage-booking.mjs HH-012345ABCDEF assign "Verified Professional Name" --confirm-live
node --env-file=.env.local scripts/manage-booking.mjs HH-012345ABCDEF complete --confirm-live
node --env-file=.env.local scripts/manage-booking.mjs HH-012345ABCDEF cancel --confirm-live
```

The reference and name above are documentation examples, not existing bookings. Do not run them unchanged. The script is not a public API; it requires the operator's KV secret. Assignment and completion preserve record TTLs; cancellation releases request capacity atomically. Completed jobs cannot be cancelled through this tool and future jobs cannot be completed early. The script prints only reference and outcome, not addresses or contact information.

## Unavailable providers

Do not enable demo mode to work around a production outage. `HANNAH_DEMO_MODE` is ignored when `NODE_ENV=production`. Missing KV, CAPTCHA or session configuration blocks mutations. Missing SMTP reports an unavailable email service rather than a false success. Missing Google credentials disables Google sign-in. WhatsApp remains available for human help.

## Data rights and incident handling

Establish an operator process for requests to access, correct, delete, restrict or object to processing. Verify requesters proportionately. Update/delete the relevant booking, owner and idempotency records together; review whether capacity should be released. Record any lawful retention exception securely outside this repository. Configure provider and mailbox retention consistently with the published notice, including backups and logs. Investigate and respond to incidents under applicable Kenyan requirements.
