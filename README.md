# dawsonren.github.io

Source for [dawsonren.github.io](https://dawsonren.github.io), Dawson Ren's portfolio site.
Built with [Astro](https://astro.build) as a fully static site with no client-side JavaScript,
and deployed to GitHub Pages by GitHub Actions on every push to `main`.

## Run locally

Requires Node 22.12 or newer.

```sh
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # static build into dist/
npm run preview   # serve the built dist/ locally
```

## Where things live

| Path | What it is |
|---|---|
| `src/pages/index.astro` | Homepage: hero, selected work, also, writing, about |
| `src/pages/resume.astro` | Resume as HTML, transcribed from the PDF. Update both together |
| `src/pages/projects/*.md` | Case studies |
| `src/pages/writing/`, `src/pages/archive/` | Current and archived posts |
| `src/pages/writing/influences.astro` | Influences (under construction). Each line says what you took from the work, never who you know |
| `src/layouts/Article.astro` | Layout for case studies and posts (set via `layout:` front matter) |
| `src/styles/global.css` | Design tokens, base styles, and the grain motif's CSS |
| `src/components/GrainField.astro` | The grain field: `hero` on the homepage, `band` on every other page. At most one per page |
| `src/generated/` | Grain geometry and neighbour CSS, written by `scripts/gen-grain.py`. Don't edit by hand |
| `src/site.ts` | Name, email, and profile links used across the site |
| `public/resume/Dawson-Ren-Resume.pdf` | The linked resume PDF. **Keep this filename**, since it's linked from elsewhere |
| `public/img/headshot.jpg` | Homepage photo (square, 800×800). If it's missing, a placeholder box is shown |
| `public/og.png` | 1200×630 social preview card |
| `public/favicon.png`, `apple-touch-icon.png`, `icon-512.png` | The triple-junction mark at 32, 180, and 512px |
| `astro.config.mjs` | Site URL, sitemap, and redirects from the old Jekyll post URLs |

## Regenerating the grain field

The field is committed, so the build needs no Python. To make a new one, change `SEED` (or
the lattice constants) in `scripts/gen-grain.py` and run it from the repo root:

```sh
python -m venv .venv && .venv/bin/pip install numpy scipy shapely
.venv/bin/python scripts/gen-grain.py   # rewrites src/generated/grain.json and anneal.css
```

`public/og.png` embeds the field, so regenerate it too if the field changes.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`. In the repo's Settings → Pages,
**Source** must be set to **GitHub Actions**.
