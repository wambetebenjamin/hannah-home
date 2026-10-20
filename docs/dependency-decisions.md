# Dependency decisions

The initial request required exact versions and zero high or critical vulnerabilities. The registry and audit showed those requirements could not both be met. The user authorised doing what was necessary to prevent build failures, then creating and merging a pull request.

| Package | Requested | Final exact pin | Reason |
| --- | --- | --- | --- |
| `@vercel/blob` | `0.29.4` | `2.8.2` | The requested version is not published. The stable 0.x series ends at 0.27.3. |
| `next-auth` | `5.0.0-beta.28` | `5.0.0-beta.32` | Critical Auth.js advisories in the requested beta and its core dependency. |
| `nodemailer` | `6.10.1` | `10.1.7` | High-severity advisories in the requested release. |
| `jspdf` | `3.0.1` | `4.2.1` | Critical advisories. The provisional audit suggested 3.0.4, but re-auditing that version still failed. 4.2.1 passes. |

All other requested direct dependency pins, the three original overrides, Node engine and `.nvmrc` are retained.

Additional exact transitive overrides are `motion-dom: 12.17.3` and `motion-utils: 12.12.1`. Framer Motion 12.18.0 declares broad ranges; their newer resolved releases no longer export `activeAnimations`, causing the requested Framer Motion version to fail compilation. These overrides match its declared baseline and allow the exact Framer Motion pin to build.

`.npmrc` records `legacy-peer-deps=true` so the requested/approved NextAuth stack can install consistently despite its declared peer ranges, and `engine-strict=true` enforces Node 24 or newer. Runtime integration still needs a real Google OAuth configuration and staging validation; suppressing a peer-resolution failure does not substitute for testing.

The sandbox initially ran Node 22. Tests and builds were run with Node 24.0.0, installed temporarily under the ignored `.cache/` directory. The repository does not ship that binary.

The production build uses Next.js 16.4.2's default Turbopack. The development script uses `--webpack` because Turbopack's dev server entered an HMR hash-mismatch reload loop after configuration changes in this environment. Production compilation passed with Turbopack.

The build script enforces source preservation and `npm audit --audit-level=high` before creating a production build. No advisories are excluded or suppressed. Final audit: zero vulnerabilities on the tested lockfile.
