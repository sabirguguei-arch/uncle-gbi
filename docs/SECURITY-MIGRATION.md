# GBI security migration

Review date: 1 November 2026. Development branch: `security/next-runtime-migration`.
This report records local migration validation. GitHub pushes and Netlify
deployments are separate actions requiring authorization.

## Versions

| Component | Before | After |
| --- | --- | --- |
| Node.js | 20.20.2; deployment specified 20 | 24.22.2 LTS, pinned |
| Next.js | 14.2.30 | 16.4.3 |
| React / React DOM | 18.3.1 | 19.3.1 |
| TypeScript | 5.8.3 | 5.9.3 |
| Node types | 20.17.30 | 24.19.2 |
| React / React DOM types | 18.3.20 / 18.3.7 | 19.3.0 / 19.3.0 |
| ESLint | 8.57.1 | 10.14.0 |
| eslint-config-next | 14.2.30 | 16.4.3 |
| PostCSS | 8.5.3 | 8.5.32 |
| postcss-selector-parser (transitive) | 6.1.4 | 6.1.5 |
| Playwright test runner | Not installed | 1.64.1, development only |
| Tailwind / Autoprefixer | 3.4.17 / 10.4.21 | Unchanged |

Next.js 16.4.3 was the current stable release when checked. Node 24 is a supported
LTS line; Node 20 reached end of life on 30 April 2026. TypeScript remains on the
compatible 5.x line rather than introducing an unrelated major migration.

## Compatibility changes

- Await route parameters in program/project pages and their metadata functions.
- Replace deprecated image `priority` props with `preload`.
- Replace removed `next lint` command with the ESLint CLI and flat configuration.
- Use React's automatic JSX runtime and Next.js-generated route types.
- Preserve back-button behavior using a ref instead of unnecessary effect state.
- Retain external payment navigation; a narrowly scoped lint comment explains it.
  No donation constants, financial information, availability, or text changed.
- Pin Node in `.nvmrc`, `package.json`, and the Netlify build configuration.
  Changing the local Netlify configuration does not deploy it.

Next.js documents ESLint 10 support starting with config 16.4.0. Three bundled
plugins still advertise peer ranges ending at ESLint 9. npm emits warnings during
installation, but normal `npm ci` and actual ESLint checks pass. Neither `--force`
nor `--legacy-peer-deps` was used.

## Security

The original full audit reported 22 affected dependency entries: 1 critical,
4 high, and 17 moderate. The migrated production audit reports **zero findings**.
The final full audit reports **15 moderate entries, zero high and zero critical**.
Those 15 entries are propagation through the lint dependency graph from one
remaining minimatch advisory, not 15 independent vulnerabilities.

Relevant Next.js, React-related framework, image-processing, PostCSS, and
selector-parser security updates are installed. Next.js uses patched
`sharp@0.35.5`. The compatible selector-parser patch was selected through a
normal dependency update. No automatic forced audit fixes or unsupported
transitive-major overrides were applied.

Remaining advisory:
[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249),
minimatch pattern-amplification denial of service. Patched releases start at
11.0.1, while current lint dependencies still request older major versions.
This is development tooling; the website does not accept user-controlled glob
patterns. Continue using trusted project lint configuration and track upstream
dependency updates. Do not claim that the entire dependency tree is audit-clean.

Sources:

- [Next.js image optimization advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw)
- [Next.js Server Actions advisory](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r)
- [Next.js 16 upgrade guide](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-16.mdx)
- [Node.js release schedule](https://github.com/nodejs/Release/blob/main/schedule.json)
- Installed authoritative Next.js documentation: `node_modules/next/dist/docs/`.

## Validation and reproduction

Activate the exact Node version with `nvm use` when nvm is installed. In the
prepared cloud environment, use:

```sh
export PATH="/workspace/.setup-tools/node_modules/node/bin:$PATH"
cd /workspace/uncle-gbi
npm ci --no-audit --no-fund
npm run lint
npm run typecheck
NEXT_TELEMETRY_DISABLED=1 npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

Stop development/production servers before reinstalling dependencies. The browser
suite starts and stops its own production server on port 3100. Outside this cloud
image, install Playwright's Chromium with `npx playwright install chromium` and
omit `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, or select a compatible local Chromium.

- Clean lockfile installation, ESLint with zero warnings, TypeScript, and
  production build pass.
- All 21 Chromium checks pass across desktop (1440px), tablet (768px), and mobile
  (390px), with an additional narrow 360px layout check.
- Every public route is exercised, including all program and project details.
- Tests verify photograph loading, logo, no horizontal overflow, menu toggling,
  Escape dismissal, back history and fallback, contact validation and encoded
  email preparation, donation unavailability, optimized WebP output and rejected
  unsafe image requests, sitemap, robots, and missing-page responses.
- Contact testing does not send email or open an external email application.
- Development-server browser checks pass for pages, hydration, form validation,
  and mobile navigation.
- Before/after comparisons of eight representative pages at desktop and mobile
  widths (16 views) preserve main/footer text, photo sources, and heading
  dimensions. All 86 image instances load. Reference screenshots and comparison
  data are retained locally under `/tmp/gbi-validation` for this session.
- Organizational content, assets, styles, branding, layouts, and financial
  information are preserved. No new user-facing features were added.

These checks use Chromium, not Safari or Firefox. Netlify's build adapter and a
live deployment have not been exercised.

## Publication and fresh-session verification

Reusable installation and startup instructions are saved in the cloud environment
draft. Saving is not publication. Processes must be restarted after restoration.
No independent fresh-environment restoration has been demonstrated yet.

After the user publishes the prepared environment, open a fresh task and verify:

1. The migrated files, development branch, lockfile, and Node 24.22.2 are restored.
2. `npm ci`, lint, type checking, and production build succeed.
3. The browser suite passes and the development server renders correctly.
4. Runtime configuration reports the published version and expected bindings.

Keep this phase pending until those checks run in the actual restored task.
Do not push, deploy, or publish repository changes without the user's approval.

## Files changed

- Dependencies/runtime: `package.json`, `package-lock.json`, `.nvmrc`, `netlify.toml`.
- Lint configuration: removed `.eslintrc.json`; added `eslint.config.mjs`.
- Framework configuration/types: `tsconfig.json`, `next-env.d.ts`,
  `postcss.config.mjs`. The automatically generated `AGENTS.md` is excluded from
  the migration commit, along with screenshots, build output, and test reports.
- API compatibility: `app/programs/[slug]/page.tsx`,
  `app/projects/[slug]/page.tsx`, `components/hero/PageHero.tsx`,
  `components/navigation/BackButton.tsx`.
- External-navigation lint explanation only:
  `components/sections/DonationSection.tsx`.
- Regression checks: `playwright.config.ts`, `tests/website.spec.ts`, `.gitignore`.
- Review documents: `docs/SECURITY-MIGRATION.md`, `docs/REMOTION-PLAN.md`.

Cloud `install_script` and `start_skill` are also updated outside the repository.
Migration changes are prepared on the development branch for review. Git history
and the final task report record commit and push status.
