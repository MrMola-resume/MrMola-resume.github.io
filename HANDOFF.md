# Handoff checklist

Things that need Mola (the repo owner) or a decision from him. Dawson has push access only.

## Needed from Mola

- [ ] **Pick a theme.** Open https://mrmola-resume.github.io/?themes, try the palettes
      (Navy / Charcoal / Earth) and motifs (Flow / Contours), and tell Dawson which he likes.
      The picker and unused themes get removed afterwards (see README).
- [ ] **Review the copy edits** made to his text (list below).
- [ ] **Confirm the resume PDF** is the version he wants public. It includes his phone number;
      the HTML resume page doesn't.
- [ ] **Only if the first publish fails** (the "Publish to GitHub Pages" run shows a
      permission error on `git push`): Settings → Actions → General → Workflow permissions →
      "Read and write permissions". Until then, Dawson can publish with `npm run deploy`.

## Optional, later: switch Pages to GitHub Actions

The current setup works without any settings changes: the Astro source is on `source`, and a
workflow commits the built site to `main`, which Pages serves as "Deploy from a branch". If
Mola wants the conventional setup (source on `main`, deployed as a Pages artifact):

1. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. Make `source` the default branch, or merge it into `main` (replacing the built files).
3. Replace `.github/workflows/deploy.yml` with the standard Astro workflow
   (`withastro/action` + `actions/deploy-pages`), triggered on `main`.
4. Delete `scripts/publish.sh` and the `deploy` npm script.

## Copy edits to Mola's text

Light fixes only; everything else is as he wrote it.

**Homepage**
- About: removed the duplicated "About" heading.
- About: "spend probably too much time" → "probably spend too much time".
- About: "lunch, a run or just good conversation" → "lunch, a run, or just good conversation"
  (serial comma, matching the rest of the site).
- Other Experience: "$500M Syndicated Loan Portfolio" → "…at Alter Domus", to match the
  other two titles.
- Section renamed "Other Work" → "Other Experience" (Dawson's call).

**Case studies**
- Constraint and takeaway lead sentences are set in italics and bold, respectively.
- AI migration: joined "That changed where we were spending our time." with the paragraph
  after it, and the three one-line Outcome sentences into one paragraph.

**Resume (HTML page only; the PDF is unchanged)**
- Third-person phrasing ("He interprets…") and the summary sentence folded into the bullets.
- "AlterDomus" → "Alter Domus" throughout.
- "Federal Transit Authority" → "Federal Transit Administration" (the FTA's actual name).
- "ServiceNow Certified Systems Administrator" → "ServiceNow Certified System Administrator".
- Present tense for the current role, past tense for earlier ones ("Lead negotiations",
  "Perform quarterly on-site audits", "Conduct investigations" → past tense).
- "Spearheaded the successful integration" → "Led the integration".
- "(ITSM)" dropped after "ServiceNow Procurement module".
- "Led and/or supported" → "Led or supported".
- Small grammar and punctuation fixes (serial commas, "setup", "SSAE 16/SAS 70").
- Word's small-caps formatting artifacts ("aLTER DOMUS", "sERVICENOW") normalized.
