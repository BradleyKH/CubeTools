# Cube Tools

Speedcubing tutorials, algorithm references, and tools for the 2x2 and 3x3 Rubik's Cube. The site is live at https://bradleykh.github.io/CubeTools/.

It is an [Astro](https://astro.build) static site. Tutorials are MDX, and cube diagrams are drawn with [cubing.js](https://js.cubing.net/).

## Contents

- Tutorial series: 3x3 Beginner, 2x2 Beginner, CFOP, Ortega (2x2), and Roux.
- Notation and Common Triggers reference pages.
- Resources page.
- Algorithm flashcards (F2L, OLL, PLL, CMLL, and their 2-look subsets) with drill and spaced-repetition review.
- A speedcubing timer with WCA inspection penalties, rolling averages, and sessions saved in the browser.
- A random-state scrambler for every WCA event, with a scramble checker.

## Requirements

- Node.js 24 (see `.nvmrc`)
- pnpm, at the version pinned by the `packageManager` field in `package.json`

## Commands

```bash
pnpm install     # install dependencies
pnpm dev         # dev server with hot reload, at http://localhost:4321/CubeTools/
pnpm check       # astro check: type and template diagnostics
pnpm test        # Vitest unit tests
pnpm build       # astro check, then static build to dist/
pnpm preview     # serve dist/ locally
```

### Building from a Dropbox folder

A production build inside a Dropbox-synced folder fails with `EBUSY` or `EPERM` errors on `dist/.prerender`. Copy the repository to a folder outside Dropbox, then run `pnpm install` and `pnpm build` there.

## Project layout

```
src/
  content/tutorials/<series>/   MDX tutorial pages, with images/ alongside
  content.config.ts             content collection schemas
  data/                         series registry (tutorials.ts), nav (nav.ts), site metadata (site.ts)
  components/                   Astro components; ui/ holds shadcn/ui components
  layouts/                      BaseLayout, TutorialLayout
  lib/                          url, tutorials, and cube helpers, with *.test.ts beside them
  pages/                        routes
  styles/                       global.css, print.css
public/                         favicons, robots.txt
astro.config.mjs
```

## Deployment

A push to `master` runs `.github/workflows/deploy.yml`. The workflow builds the site with `withastro/action` on Node 24, then deploys the output to GitHub Pages. The workflow can also be started by hand from the Actions tab.

## Adding a tutorial page

1. Create `src/content/tutorials/<series>/NN-slug.mdx`. The folder must match a series `slug` in `src/data/tutorials.ts`. The page is served at `/tutorials/<series>/<slug>/`, where `<slug>` is the filename without the `NN-` prefix.
2. Add frontmatter:

   ```yaml
   ---
   title: The Cross
   description: Build the white cross on the bottom layer.
   series: 3x3-beginner
   order: 2
   navTitle: Cross          # optional: shorter label for the table of contents and prev/next
   legacy: basic2.html      # optional: old root URL that redirects to this page
   ---
   ```

   `title`, `description`, `series`, and `order` are required. `order` sets the page sequence in the table of contents and prev/next links.
3. Add a link to the page in the Tutorials menu in `src/data/nav.ts`. Nav links are written by hand.

### Components available in tutorial MDX

These are mapped for every tutorial page, so they need no import.

- `<AlgBlock alg="R U R' U'" name="..." alts={["..."]} showCube stickering="OLL" puzzle="3x3x3" />`: an algorithm with a copy button. Only `alg` is required.
- `<CubeView label="..." alg="..." setup="..." stickering="OLL" view="2D" size="sm" />`: a cube diagram. `label` is required and doubles as the caption and accessible name. Other props: `puzzle`, `view` (`2D` or `3D`), `yellowTop`, `setupFromAlgInverse`, `controls`, and `size` (`sm`, `md`, `lg`).
- `<Callout type="tip">...</Callout>`: a note box. `type` is `note` (default) or `tip`.
- `<Figure src={image} alt="..." caption="..." width={300} />`: an image. Import the file from the page's `images/` folder, for example `import cross1 from './images/cross-1.png';`.

Algorithms can be written in spaced cubing.js notation (`R U R' U'`) or in compact form (`RUR'U'`). The components normalize either form.
