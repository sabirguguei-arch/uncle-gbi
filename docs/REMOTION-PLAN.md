# Proposed GBI animation development plan

This is a plan for approval. Remotion is not installed and no animation code has
been implemented. Complete the security migration review and environment
restoration check before starting the implementation.

## Scope and structure

Create a dedicated `animations/` project with its own manifest and lockfile after
approval. Keep video tooling outside the website's runtime dependency graph.
Pin all Remotion packages to one reviewed version; recheck current releases and
advisories when implementation starts. Current Remotion 4.x supports React 19.

Use GBI's existing approved photographs, logo, typography, colors, and wording.
Reference approved assets without editing their originals. Do not invent impact
statistics, fundraising figures, project results, or organizational claims.

## Proposed first composition

Start with one short, restrained introduction using existing website text and
photographs: logo reveal, landscape/photo transition, and a simple closing brand
frame. Review a storyboard and timing before building it. Avoid parallax-heavy
effects, rapid flashing, automatic sound, or motion that obstructs navigation.
The exact composition and use on the site require separate approval.

Prefer a pre-rendered video with a poster for simple decorative playback, keeping
the site lightweight. Consider `@remotion/player` only when interactive playback
is a confirmed requirement; it would require a separately reviewed website
dependency and client-component integration. Core website content must remain
available without animation or JavaScript playback.

## Implementation stages after approval

1. Verify fresh-session restoration and baseline site tests.
2. Approve storyboard, assets, wording, duration, aspect ratios, and placement.
3. Scaffold the separate project and audit pinned Remotion dependencies.
4. Start Studio, validate the composition in Chromium, and review motion timing.
5. Add reduced-motion behavior, an accessible static alternative, mobile sizing,
   and a performance budget before any website integration.
6. Export only when explicitly requested; verify the resulting media and compare
   mobile/desktop page performance against the preserved website baseline.
7. Request approval for website integration, GitHub push, or deployment separately.

Node 24, Chromium, and FFmpeg are available in the prepared environment. Remotion
Studio startup, browser compatibility, codecs, rendering, and restoration of the
future animation project still require actual validation after installation.
