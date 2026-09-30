// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mrmola-resume.github.io',
  // NO `base` — this is a user site served at the domain root.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
});
