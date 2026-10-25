// @ts-check
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const BASE = '/CubeTools';
const SITE = 'https://bradleykh.github.io';
const tutorialsDir = new URL('./src/content/tutorials/', import.meta.url);

/**
 * Maps each old root `*.html` file name to its new route (no base). Tutorial pages come from
 * the `legacy` frontmatter of each MDX file; the URL slug mirrors `entrySlug` in
 * src/lib/tutorials.ts.
 */
function legacyMap() {
  /** @type {Record<string, string>} */
  const map = {
    'notation.html': '/notation/',
    'triggers.html': '/triggers/',
    'tutorials.html': '/tutorials/',
    'resources.html': '/resources/',
    'timer.html': '/timer/',
    'scrambler.html': '/scrambler/',
    'flashcards.html': '/flashcards/',
  };
  for (const series of readdirSync(tutorialsDir)) {
    for (const file of readdirSync(new URL(`${series}/`, tutorialsDir))) {
      if (!/\.mdx?$/.test(file)) continue;
      const source = readFileSync(new URL(`${series}/${file}`, tutorialsDir), 'utf8');
      const legacy = source.match(/^legacy:\s*(\S+\.html)\s*$/m)?.[1];
      if (!legacy) continue;
      const slug = file.replace(/\.mdx?$/, '').replace(/^\d+-/, '');
      map[legacy] = `/tutorials/${series}/${slug}/`;
    }
  }
  return map;
}

/**
 * Writes a real `<outDir>/<name>.html` file per legacy URL. Astro's own redirects emit
 * `<name>.html/index.html` directories under `trailingSlash: 'always'`, which old file-style
 * links would not reliably reach on GitHub Pages.
 * @returns {import('astro').AstroIntegration}
 */
function legacyRedirects() {
  return {
    name: 'legacy-redirects',
    hooks: {
      'astro:build:done': ({ dir }) => {
        for (const [name, route] of Object.entries(legacyMap())) {
          const target = BASE + route;
          const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting to ${target}</title>
<meta http-equiv="refresh" content="0;url=${target}">
<link rel="canonical" href="${SITE}${target}">
<meta name="robots" content="noindex">
</head>
<body>
<p>This page has moved. <a href="${target}">Continue to the new page</a>.</p>
</body>
</html>
`;
          writeFileSync(new URL(name, dir), html);
        }
      },
    },
  };
}

export default defineConfig({
  output: 'static',
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  integrations: [mdx(), react(), sitemap(), legacyRedirects()],
  vite: {
    plugins: [tailwindcss()],
  },
});
