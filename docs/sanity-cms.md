# Sanity CMS setup

The public News pages read only published, verified GBI articles from the `production` dataset. No write token is used by the website.

## Environment

Copy [.env.example](../.env.example) to `.env.local` for local work:

```text
NEXT_PUBLIC_SANITY_PROJECT_ID=htshbun1
NEXT_PUBLIC_SANITY_DATASET=production
```

These are public project identifiers, not credentials. Never commit `.env.local`, API tokens, browser session data, or other secrets.

## Local Studio

Run the site on port 3013 and open `http://localhost:3013/studio`. In Sanity project settings, add that origin under API CORS origins with credentials enabled. Sign in through Sanity's built-in authentication.

## Deployment

Configure the same two public variables in the hosting environment. If Studio is hosted on the production domain, add `https://gbisouthsudan.org` as a Sanity CORS origin with credentials enabled. Do not add a public write token to the browser or server environment for the public website.

## Editorial publication

An article is public only when it is published, has `editorialStatus` set to `Verified`, `Verified for publication` enabled, `CMS test article` disabled, has valid required content, and its publication date is not in the future. Drafts, test articles, invalid articles, and future-dated articles remain unavailable through lists, detail routes, metadata, and the sitemap.

## Dependency audit follow-up

Production dependencies currently report 0 high and 0 critical advisories. The previous high-severity `@vercel/frameworks` findings are fixed by the scoped overrides for `js-yaml@3.15.2` and `smol-toml@1.9.1`.

Fourteen moderate advisories remain in the Sanity CLI toolchain (`@oclif/*`, `@sanity/*`, `@sanity-labs/*`, `minimatch`, `next-sanity`, and `sanity`). These packages are not used by the public website runtime. `minimatch@11` and Sanity downgrades are intentionally not applied in this release because they are outside the approved scope and may break Studio tooling. The remaining advisories are accepted provisionally and scheduled for a separate dependency review.
