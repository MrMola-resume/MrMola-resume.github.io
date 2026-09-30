// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdir, rename, rmdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Astro writes a redirect from `/foo.html` to `dist/foo.html/index.html`. GitHub Pages
 * would only serve that after an extra trailing-slash hop, so move each one to a real
 * `dist/foo.html` file, which is exactly the URL the old Jekyll site used.
 * @returns {import('astro').AstroIntegration}
 */
function flattenHtmlRedirects() {
  return {
    name: 'flatten-html-redirects',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        /** @param {string} current */
        async function walk(current) {
          for (const entry of await readdir(current, { withFileTypes: true })) {
            if (!entry.isDirectory()) continue;
            const full = path.join(current, entry.name);
            if (entry.name.endsWith('.html')) {
              const tmp = `${full}.tmp`;
              await rename(path.join(full, 'index.html'), tmp);
              await rmdir(full);
              await rename(tmp, full);
              logger.info(`flattened ${path.relative(root, full)}`);
            } else {
              await walk(full);
            }
          }
        }
        if ((await stat(root)).isDirectory()) await walk(root);
      },
    },
  };
}

export default defineConfig({
  site: 'https://dawsonren.github.io',
  // NO `base` — this is a user site served at the domain root.
  integrations: [
    sitemap({ filter: (page) => !page.endsWith('/404/') }),
    flattenHtmlRedirects(),
  ],
  markdown: { shikiConfig: { theme: 'github-light' } },
  redirects: {
    '/letters/2023/02/25/letter-to-bayes.html':            '/archive/letter-to-bayes/',
    '/peermentor/2023/10/10/what-is-ie.html':              '/archive/what-is-ie/',
    '/advice/2024/01/03/priming-your-brain.html':          '/archive/priming-your-brain/',
    '/reflections/2023/11/02/manager-and-rubber-duck.html':'/writing/manager-and-rubber-duck/',
    '/about/':                                             '/',
  },
});
