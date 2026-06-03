# Enfrio — Project Memory

Corporate website for **Enfrio Srl** (Italian manufacturer of aluminium engine-cooling
systems for Power Generation + Datacenter). Live at **www.enfrio.it** (Vercel, auto-deploy
from `main`). Repo: `WebInbound/enfrio`.

The user (Christopher) communicates in **Italian** — reply in Italian. He is the owner;
his partner ("il socio") generates AI images from another machine and pushes them.

## Stack
- Next.js 16.1.6 App Router + React 19 + TypeScript, Turbopack build
- React Three Fiber + three.js (~200KB) for the M Tower 3D canvas
- Lenis smooth scroll (site-wide, exposed on `window.__lenis`)
- No GSAP / framer-motion — keep it that way unless impact is huge
- Build/lint: `npm run build` (the real gate). `npx tsc --noEmit` clean.
  ESLint has pre-existing `react-hooks/set-state-in-effect` warnings in
  MTowerSizer/SiteShell — NOT blockers, don't "fix" them.

## Workflow rules
- Commit + push only when work is done and verified (`npm run build` clean first).
- Co-author trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- CSS additions go at the END of `src/app/globals.css` under marker comments
  (`/* === SECTION === */ ... /* === /SECTION === */`). Don't touch existing rules.
- Watch for DUPLICATE CSS blocks in globals.css (e.g. `.mtower-spotlight-media` was
  defined twice — edits to the first got overridden by the second). Grep before editing.

## Key files
- `src/app/tower-m/page.tsx` — flagship M Tower page (the company's #1 marketing asset)
- `src/components/MTowerStage.tsx` — hero: R3F canvas + scroll-spin + drag + annotation chips
- `src/components/MTowerCanvas.tsx` — R3F billboard, 120 WebP frame texture-swap
- `src/components/MTowerSizer.tsx` — interactive configurator (the "wow" interactive piece)
- `src/components/DeploySwitcher.tsx` — tabbed Data Center/Petrochem/Power Gen/HVAC switcher
- `src/components/BackToTop.tsx` — fixed lime circular back-to-top button (uses __lenis)
- `src/components/SmoothScroll.tsx` — Lenis instance, exposes `window.__lenis`
- `src/app/globals.css` — ALL styling (single file, ~4600 lines)
- `scripts/remove-mtower-bg.py` — rembg bg-removal pipeline (see Assets below)

## M Tower 3D — HARD-WON LESSONS (don't repeat these mistakes)
- **Sticky-pin scroll is BANNED for this layout.** Tried it 3 separate times; every
  time it broke (zoom drift, void below the pinned canvas, unit clipping outside its
  box). The hero is LINEAR: text+canvas side-by-side in the hero, Explore as a separate
  section below. If tempted to pin again: DON'T.
- 120 WebP frames at `public/assets/images/mtower-frames/000.webp`…`119.webp`.
  - Frame 0 = canonical front-3/4 marketing view (mesh + cabinet + blue fans visible).
  - Frames 0→30 = safe upright rotation arc (90°). Scroll rotation capped here.
  - Frames >45 = camera dips below/above the unit ("lying down" angles) — NOT marketing-safe.
    Only drag exposes them.
- The R3F BackdropGlow was removed — at higher opacity it rendered as a visible
  rectangle around the unit and tinted the render off-brand. Brand atmosphere comes
  from the CSS `.mtower-stage-bg` layer instead.

## Canonical product image
- `public/assets/images/site/mtower-render.png` — used in MANY places (home spotlight,
  sizer modules + floor reflection, DeploySwitcher, outro). Replacing it updates all.
- **Current version**: new Gemini render (back-3/4, blue EC fans, top hydraulic manifold),
  background removed via rembg `isnet-general-use`, cropped to bbox → 501×871 portrait
  (aspect ≈ 0.575). Containers are tuned to this portrait aspect.
- Raw source kept at `mtower-new-source.jpg`. To reprocess a new render:
  drop it as `mtower-new-source.jpg`, run `python scripts/remove-mtower-bg.py`.
- rembg is installed locally (Python 3.14, `C:\Users\chris\.u2net\` has the model).

## Sizer (configurator) — current state
- Engine power slider: 100 kW → 50,000 kW (was 20k). Number input → 100,000 kW.
  Module stage grows 1→4 rows for big banks (caps so 60-module banks still fit).
- **Hot/cold hydraulic visual**: per-row horizontal manifolds — HOT (orange→red,
  flows L→R) across the top, COLD (cyan→blue, flows R→L) across the bottom, with
  HT/LT chips. Reacts to `data-circuit` (single = HT-only, double = both).
- **SCADA touches**: perspective floor grid, module bob, floor reflection, hover tilt,
  power-up sweep on count change, bottom status bar ("BANK ONLINE · N · MW · N+1").
- **LIVE BUILD READOUT** (HUD) lives in the FORM column (left), bottom-glued via
  margin-top:auto, paired with the SINGLE M TOWER MODULE card. 4 specs: footprint,
  water flow, weight, electrical draw. (Two earlier placements left voids — this is the
  one that works.) Coefficients are placeholders, flagged with TODO for Enfrio to confirm.

## Design system
- Brand lime `#add934` / `--brand`, deep lime `--brand-deep` `#7f9f22`.
- Deep navy `--deep-blue` `#070f19`, `--deep-blue-2` `#0b1623` (footer gradient).
- Body bg = grey gradient `#c0c7ce`(top) → `#a5afb8`(bottom), white radial highlights
  brighten the painted top to ~`#c9cfd5`.
- Reusable utilities (all site-wide, don't redefine): `.kicker`, `.section`,
  `.section-head`, `.dark-block`, `.reveal` (IntersectionObserver fade-up via SiteShell),
  `.magnetic` (cursor pull via MagneticButtons), `.btn.solid`/`.btn.ghost`, `.panel`,
  `.card`, `.stat`, `.timeline`, AnimatedNumber component.
- **`.timeline` gotcha**: base rule assumes short numeric step labels in a 74px column.
  Word labels (e.g. "Engineer") overflow — scope an override (see `.mtower-outro-timeline`).

## Mobile specifics
- **iOS overscroll HARD LIMIT (don't re-attempt gradients!):** iOS Safari paints BOTH
  the top and bottom rubber-band regions with the SINGLE solid `html` background-color.
  It IGNORES background gradients and `background-attachment: fixed` there. So distinct
  top/bottom overscroll colours are NOT possible on iOS — wasted 3 attempts on this.
  Current solution (user's choice): `html { background-color: #c9cfd5 }` (single light
  grey = page top + themeColor), so the TOP rubber-band + iOS chrome bar blend into the
  page; the bottom shows the same light grey under the navy footer (accepted trade-off).
  `overscroll-behavior: none` still kills the bounce on Android/Chrome.
- `themeColor: #c9cfd5` in layout.tsx viewport export (iOS Safari chrome bar).
- Floating logo: desktop has `margin-left:-14px` (breathes into wide gutter); mobile
  (≤760px) overrides to `+4px` so it isn't flush with the screen edge.
- BackToTop button: fixed bottom-right lime circle, fades in past 60vh scroll.

## Things the user cares about (style of feedback)
- Hates AI-futuristic-looking images. Where M Tower appears it must be 1:1 with the
  canonical render. He'll say "si vede troppo AI" or "non piace per niente".
- Hates empty/void whitespace in layouts — will circle it in screenshots.
- Wants things "figo" (cool/polished) but coherent with the brand, not gimmicky.
- Iterative & visual: gives screenshots with annotations, expects precise targeted fixes.
- Prefers minimal targeted changes over big rewrites (called a fixed-floating logo panel
  "un casino" when a simple nudge was wanted).

## Multi-agent workflows
- Workflow tooling available; the M Tower WOW pass was done with a 5-agent audit workflow
  then a 4-agent implementation workflow (file-scoped, sequential to avoid globals.css
  conflicts). Worked well. User must include "workflow" keyword to opt in.
