# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Cube Tools is a static site of Rubik's cube resources: tutorials (3x3 beginner, CFOP, Roux; 2x2 beginner, Ortega/Varasano), algorithm flashcards, a timer, and a scrambler. It is plain HTML, CSS, and vanilla JavaScript with no build step, no package manager, no framework, and no tests. It is published by GitHub Pages straight from the root of `master` at https://bradleykh.github.io/CubeTools/ (the custom domain's CNAME was removed), so every pushed commit is live.

## Running locally

Open `index.html` in a browser, or serve the folder so relative paths and the `#` deep links behave like production:

```
python -m http.server 8000
```

## Architecture

- **Every page is a full standalone HTML file** in the repo root with a copied-and-pasted `<head>` (favicons, meta tags, CSS links). A change to shared head content has to be repeated across all ~40 pages.
- **The nav bar is injected by JavaScript.** `scripts/navbar.js` builds the whole menu as a string and `loadNavbar()` writes it into `<span id="navbarCode">` from each page's `<body onload>`. Adding, renaming, or removing a page means editing this string, plus `tutorials.html` and the home page links where relevant. `colorify()` (the random-color 3x3 logo) also lives there.
- **Multi-page tutorials** are numbered files (`basic1-8`, `2basic1-5`, `cfop1-6`, `roux1-9`, `ortega1-6`). Each page carries its own `<select>` table of contents with the current page marked `selected`, plus hand-written Back/Next links at the bottom. Inserting a page means renumbering and updating the `<select>` and arrows on every page in that series.
- **Tutorial images** live in `tutorials/<series>/` (`3b`, `2b`, `cfop`, `roux`, `2o`, `notation`). Many filenames contain spaces. The PDFs in the root are downloadable versions of the same tutorials and algorithm sheets; they are not generated from the HTML.
- **Flashcards** (`flashcards.html`, `scripts/flashcards.js`, `scripts/flashcardSets.js`):
  - `flashcardSets.js` defines each set as parallel arrays: `algsX` is a list of groups, each `[groupLabel, alg1, alg2, ...]`; `casesX` holds matching case names (same shape, minus the label). `setList` ties each set to `[name, imageFolder, algs, cases, detailsHtml]`.
  - Card images are `flashcards/<folder>/<n>.png`, numbered 1..N **in the flattened order of the alg arrays across all groups**. Adding, removing, or reordering an algorithm shifts every later image number, so the PNGs must be renumbered to match.
  - The `<option value>` indices in `flashcards.html` and the `flashcards.html#N` links in `navbar.js` both index into `setList`; keep all three in the same order.
- **Scrambler and timer share code.** `scripts/scrambler.js` produces random-move scrambles (not random-state) for 2x2-5x5, rejecting redundant moves via the move-group rules documented at the top of the file. `scripts/diagram.js` simulates the cube on six face arrays to draw the scramble net. `timer.html` loads `scrambler.js`, `timer.js`, and `diagram.js` together as globals; `scrambler.html` loads the first and last. Because everything is global, function names like `show()` and `turn()` collide between scripts (`notation.js` and `diagram.js` both define `turn`), so check before loading two scripts on one page.
- **Timer** (`scripts/timer.js`) keeps the session only in memory; DNF is stored as the sentinel value `9999`. Spacebar on desktop, a touch button on mobile, optional WCA-style inspection countdown.
- `scripts/stopwatchcode.js` is the third-party stopwatch the timer was derived from; no page loads it.
- `old/` is the previous site design, gitignored and local only.

## Conventions

- Move notation in content and algorithms uses lowercase for wide turns (`r`, `f`, `d`) and parentheses to group triggers, e.g. `(RUR'U')`. Trigger names are defined on `triggers.html`.
- Responsive behavior relies on the `.smallonly` / `.largeonly` classes and the breakpoints in `main.css` (650px) and `nav.css` (950px).
