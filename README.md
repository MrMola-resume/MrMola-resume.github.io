# mrmola-resume.github.io

Source for [mrmola-resume.github.io](https://mrmola-resume.github.io), Ademola (Mola) Faleti's
portfolio site. Built with [Astro](https://astro.build) as a static site, with no client-side
JavaScript beyond the temporary theme picker.

## Branches

| Branch | What's on it |
|---|---|
| `source` | This Astro project. **Work here.** |
| `main` | The built site, committed by the publish workflow. GitHub Pages serves this (Settings → Pages → "Deploy from a branch", `main`, root). Don't edit it by hand. |

Pushing to `source` runs `.github/workflows/deploy.yml`, which runs `scripts/publish.sh`: it
builds the site and commits `dist/` (plus an empty `.nojekyll`) to `main`. If Actions can't
push, run the same script locally with `npm run deploy`. `HANDOFF.md` has the checklist for
the repo owner, including how to switch to the simpler Pages-via-Actions setup later.

## Run locally

Requires Node 22.12 or newer.

```sh
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # static build into dist/
npm run preview   # serve the built dist/ locally
npm run deploy    # build and publish to main (see above)
```

## Where things live

| Path | What it is |
|---|---|
| `src/pages/index.astro` | Homepage: hero, selected work, other experience, about |
| `src/pages/resume.astro` | Resume as HTML, transcribed from the PDF with light copy fixes. Update both together |
| `src/pages/projects/*.md` | Case studies. `next:` in the front matter sets the "Next case study" link |
| `src/layouts/Article.astro` | Layout for case studies, including the `.figures` style for key numbers |
| `src/styles/global.css` | Design tokens (Navy is the default palette; Charcoal and Earth override it), base styles, and motif CSS |
| `src/motifs.ts` | Geometry for the two motifs (process flow and contours), generated at build time from fixed seeds |
| `src/components/Motif.astro` | The motif: `hero` on the homepage, `band` on every other page |
| `src/components/ThemePicker.astro` | **Temporary** palette and motif picker. See below |
| `src/site.ts` | Name, email, LinkedIn, and job title used across the site |
| `public/resume/Ademola-Faleti-Resume.pdf` | The linked resume PDF (includes his phone number; the HTML version doesn't) |
| `public/img/headshot.jpg`, `public/img/rio.jpg` | Homepage photos |
| `public/og.png` | 1200×630 social preview card |
| `public/favicon.png`, `apple-touch-icon.png`, `icon-512.png` | "MF" monogram at 32, 180, and 512px |

## Theme picker (temporary)

Open the site with `?themes` (e.g. `https://mrmola-resume.github.io/?themes`) to show a small
panel for switching palette (Navy / Charcoal / Earth) and motif (Flow / Contours). The choice
is remembered in that browser until "Hide picker". Everyone else sees Navy + Flow.

Once a theme is chosen, remove:

- `src/components/ThemePicker.astro` and its line in `src/layouts/Base.astro`
- the picker part of the inline script in `src/components/Head.astro` (keep the `data-intro` part)
- the unused palette blocks in `src/styles/global.css` (if Navy isn't chosen, move the chosen values into `:root`)
- the unused motif's SVG in `Motif.astro`, its geometry in `src/motifs.ts`, and its CSS
- the per-palette `.headshot` rules in `src/pages/index.astro` that no longer apply

## Motif intro

The motif animates once per browser session (flow lines draw in; contours rise), on the
first page viewed. It's skipped for visitors who prefer reduced motion. To change the drawing,
change `FLOW_SEED` or `CONTOUR_SEED` in `src/motifs.ts`; `public/og.png` embeds the flow motif,
so regenerate it too if that changes.
