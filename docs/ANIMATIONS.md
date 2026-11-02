# GBI website motion

Implemented on `feature/gbi-professional-animations`, based on migration commit
`c8249b3a4f38428a9b3249562a2b669ccfad5b6d`. Changes are local for review.

## Motion system

- The homepage uses a five-second, subtle zoom on the existing hero photograph,
  staggered heading/copy/button entrances, and restrained button interactions.
- About GBI uses a photograph entrance and scroll-triggered text/section reveals.
- Programme grids stagger each visible row; programme and project cards retain
  their photographs and routes with small image/arrow hover movements.
- Project photographs have a clipped entrance, and the footer reveals once.
- Mobile navigation transitions both ways with progressive CSS discrete-display
  transitions. Unsupported browsers get an immediate close. Hidden navigation is
  inert and excluded from the accessibility tree; Escape and focus restoration
  keep their existing behavior.

`MotionEffects` uses one IntersectionObserver per route, disconnects revealed
elements, and resets on navigation or motion-preference changes. There are no
scroll event handlers, animation libraries for page interactions, or permanent
will-change layers. Content starts visible in server output; below-viewport
content is enhanced only after JavaScript starts. Focused content is visible.

## Seed to sapling

`SeedToSapling` is a five-second, 30fps Remotion composition using inline vector
art in the existing GBI palette. It grows a seed into a stem and two leaves,
then holds the completed sapling. It adds no statistics, claims, audio, or remote
media. The illustration sits beside the homepage's existing About GBI copy.

The Remotion Player is dynamically imported near the viewport, plays once,
pauses offscreen or in a hidden document, and does not loop. A server-rendered
static sapling reserves its space and remains available without JavaScript.
Reduced-motion users see the static sapling and do not mount the Player. Changing
the preference while the page is open removes playback immediately.

Production additions are only `remotion` and `@remotion/player`, both pinned to
4.0.539. Studio CLI 4.0.539 and its matching Zod 4.5.4 are development dependencies.
The same composition is shared between the website and Studio; no duplicate
video project or media pipeline is needed. No video export was requested or made.

## Preview and validation

```sh
export PATH="/workspace/.setup-tools/node_modules/node/bin:$PATH"
npm run animation:studio
```

Studio runs on port 3200; select `GBI-SeedToSapling`. The website can run separately
with `npm run dev`. A production preview uses `npm run build` followed by
`npm run start`. None of these commands publishes or deploys the website.

```sh
npm run lint
npm run typecheck
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

The browser suite contains 36 checks across desktop, tablet, and mobile: the
existing 21 website checks plus 15 animation/accessibility checks. It covers
reduced motion, live preference changes, deferred Remotion mounting, growth,
offscreen pause/resume, one-shot reveals, no-JavaScript fallback, and menu
accessibility as well as routes, photos, forms, and existing navigation.

Studio was opened and checked in Chromium without browser errors. Production
dependencies were audited with zero findings at implementation time. Existing
ESLint plugin peer-range warnings remain. Browser validation covers Chromium;
Safari and Firefox have not been exercised.

## Files

- `components/motion/`: scroll enhancement, artwork, composition, lazy host, Player.
- `video/index.tsx`: Studio registration; `package.json` / lockfile: pinned tooling.
- `app/globals.css`: shared motion styles and reduced-motion overrides.
- Home, About, programme/project index pages and layout: scoped motion hooks.
- Programme/project cards, ButtonLink, SiteHeader and SiteFooter: interactions.
- `tests/animations.spec.ts`: motion/accessibility regression coverage.

Existing source copy, image/alt attributes, and link destinations were compared
against Git in all changed existing TSX files. Content data, original photographs,
contact processing, and donation logic were not edited. No push, merge, Netlify
deployment, or environment publication was performed.
