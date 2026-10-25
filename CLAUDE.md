# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Cube Tools is an Astro 7 static site for speedcubing: tutorial series (3x3 beginner, 2x2 beginner, CFOP, Ortega, Roux), notation and triggers reference pages, and a resources page. Flashcards, timer, and scrambler routes exist as placeholders. It is deployed to GitHub Pages at https://bradleykh.github.io/CubeTools/ from pushes to `master`.

Stack: TypeScript (strict), pnpm (version in `packageManager`), Node 24 (`.nvmrc`), Astro with the MDX and React integrations and `@astrojs/sitemap`, Tailwind 4 through `@tailwindcss/vite`, shadcn/ui under `src/components/ui/`, cubing.js for diagrams, Vitest for tests.

## Commands

- `pnpm dev`: dev server at `http://localhost:4321/CubeTools/`
- `pnpm build`: `astro check && astro build` into `dist/`
- `pnpm preview`: serve `dist/`
- `pnpm check`: `astro check` only
- `pnpm test`: Vitest, `src/**/*.test.ts`

`pnpm build` fails with `EBUSY` or `EPERM` on `dist/.prerender` inside a Dropbox-synced folder. Build from a copy of the repo outside Dropbox. `pnpm check` and `pnpm test` run in place.

## Dropbox

The repo sits in a Dropbox folder. `node_modules/`, `dist/`, and `.astro/` must be ignored by Dropbox or they will sync and collide with local builds. Mark each one from PowerShell:

```
Set-Content -Path '<dir>' -Stream com.dropbox.ignored -Value 1
```

Confirm with `Get-Content -Path '<dir>' -Stream com.dropbox.ignored`.

## Architecture

- **Base path.** `astro.config.mjs` sets `site: 'https://bradleykh.github.io'`, `base: '/CubeTools'`, `trailingSlash: 'always'`. Internal links go through `withBase()` in `src/lib/url.ts`, which uses `import.meta.env.BASE_URL` and passes external URLs and `#hash` links through unchanged. Nav hrefs in `src/data/nav.ts` are site-relative and must go through `withBase` when rendered. A hard-coded `/foo/` link omits the base path and breaks in dev and production alike.
- **Content collections.** `src/content.config.ts` defines `tutorials` (glob `src/content/tutorials/**/*.{md,mdx}`) and `guides` (`src/content/guides`, which has no files yet; `src/pages/guides/[slug].astro` renders it). Tutorial frontmatter: `title`, `description`, `series`, `order` (required), `navTitle` and `legacy` (optional).
- **Tutorial files.** Each entry is `src/content/tutorials/<series>/NN-slug.mdx`, with images in `src/content/tutorials/<series>/images/`. The entry id is `<series>/NN-slug.mdx`. `order` drives sequence. The page URL is `tutorials/<series>/<slug>/`, where `<slug>` is the filename without the `NN-` prefix (`entrySlug` in `src/lib/tutorials.ts`).
- **Series registry.** `src/data/tutorials.ts` lists the series in display order (`slug`, `title`, `puzzle`, `level`, `summary`). A tutorial's folder must match a registered `slug`; `src/pages/tutorials/[series]/[...slug].astro` throws on an unknown series. Notation and Triggers are standalone pages (`src/pages/notation.astro`, `src/pages/triggers.astro`), not series.
- **Tutorial helpers.** `src/lib/tutorials.ts` provides `seriesPages`, `entrySlug`, `entryPath`, `seriesPath`, and `neighbors`. The TOC and prev/next links in `TutorialLayout` come from these.
- **Nav.** `src/data/nav.ts` is the only source for the menu (Tutorials groups, Flashcards, Tools, Resources). Tutorial links there are hand-written, so each page needs an entry in that file as well as its MDX.
- **MDX components.** The tutorial and guide pages pass `{ AlgBlock, CubeView, Callout, Figure }` to `<Content components>`, so MDX files use them without importing.
- **Legacy redirects.** `legacyMap()` in `astro.config.mjs` maps each old root page to its route: a fixed list (`notation.html`, `triggers.html`, `tutorials.html`, `resources.html`, `timer.html`, `scrambler.html`, `flashcards.html`) plus every tutorial MDX file's `legacy: <name>.html` frontmatter. The local `legacy-redirects` integration writes a real `dist/<name>.html` meta-refresh page per entry in `astro:build:done`; Astro's `redirects` option is not used because it emits `<name>.html/index.html` directories under `trailingSlash: 'always'`. A duplicated `legacy` value silently overrides the earlier one, and the guides `legacy` field is not read.
- **CubeView** (`src/components/CubeView.astro`) wraps a `<twisty-player>` element. Its `label` is required and is both the visible caption and the stage's `aria-label`. cubing.js loads lazily: the stage upgrades when it nears the viewport (IntersectionObserver, 300px margin) through `import('cubing/twisty')`. Without JavaScript, the algorithm appears in a `<noscript>` block. Static diagrams stay on the light color scheme because the dark scheme paints an opaque backdrop; diagrams with controls follow the page theme.
- **Yellow-top orientation.** Unless `yellowTop={false}`, a CubeView with a non-`full` stickering prepends `z2` to its setup so yellow is on top and green in front. Stickering masks are keyed by piece identity, so `yellowTopStickeringMask` in `src/lib/cube.ts` moves each piece's mask to the piece that `z2` carries into place, and `stickeringMaskOrbitsFor` produces the value for `experimental-stickering-mask-orbits`. The compact `ORBIT:codes` format is used when every piece has a code; otherwise the mask is serialized as JSON (L6EO needs this).
- **Algorithm normalization.** `normalizeAlg` in `src/lib/cube.ts` converts compact notation (`RUR'U'`, `(RUR'U')*3`, curly quotes, `<br>` markup, a leading `[U]` as an optional AUF `(U)`) into spaced cubing.js syntax. It returns the canonical cubing.js string when that parses, otherwise the best-effort spacing. `AlgBlock` and `CubeView` normalize their `alg` and `setup` props, so either notation works in MDX. `invertAlg` backs `setupFromAlgInverse`.
- **Stickering names.** `STICKERINGS` and `stickeringFor` in `src/lib/cube.ts` map case and set names (`oll`, `2-look PLL`, `firstblock`, `F2L`) to cubing.js stickerings. Last-layer stickerings render with `experimental-2D-LL`.
- **Styling.** `src/styles/global.css` holds the Tailwind 4 theme tokens. Dark mode follows the OS unless `<html>` has `.dark` or `.light`. `src/styles/print.css` is imported by `BaseLayout`. Fonts are Inter and JetBrains Mono from `@fontsource-variable`.
- **Public assets.** `public/` holds favicons and `robots.txt`. Page images go through `astro:assets` (`Figure` uses `Image`).
- **Tests.** Vitest covers the pure helpers: `src/lib/cube.test.ts`, `src/lib/tutorials.test.ts`, `src/lib/url.test.ts`. Components have no tests.

## Deployment

`.github/workflows/deploy.yml` runs on pushes to `master` and on manual dispatch. The `build` job uses `withastro/action@v6` with Node 24. The `deploy` job publishes with `actions/deploy-pages@v5`.

## Conventions

- **One component per file.** Each React component and each Astro component gets its own file. Types, constants, hooks, and pure helpers may share a file with the one component that uses them. shadcn/ui files under `src/components/ui/` keep the shape the shadcn CLI generates.
- **Comments.** Explain why, not what. Describe the current code, not its history.
- **Paths.** Use the `@/` alias (`src/*`) for imports under `src/`.
- **Notation.** Wide turns can be written in lowercase (`r`, `f`, `d`) or as `Rw`. Triggers are grouped with parentheses, for example `(R U R' U')`.
- **Writing.** No em or en dashes in code, comments, or docs. Use American spelling.
