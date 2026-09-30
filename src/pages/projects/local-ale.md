---
layout: ../../layouts/Article.astro
kind: project
title: "When your features are correlated, SHAP gets noisy"
date: 2026-09-15
description: "A local explanation method that stays stable when features move together — and an honest account of when it doesn't help."
tags: [machine learning, interpretability, research]
---

Suppose a model denies someone a loan and you have to say why. The standard tool is <a href="https://christophm.github.io/interpretable-ml-book/shapley.html" target="_blank" rel="noopener noreferrer">SHAP</a>:
it assigns each feature a share of the credit for that one prediction. It's principled, it's
everywhere, and it has a failure mode.

Run SHAP on two nearly identical applicants and you can get noticeably different
explanations. Not different predictions — different *reasons* for the same prediction. If
you are handing that explanation to a regulator or to the applicant, the "wobble" is the whole
problem.

## Why it happens

The "wobble" comes from correlated features, and real data is full of them. Income and credit
limit move together. Height and weight. Order size and delivery distance.

SHAP has to answer a counterfactual: what would the model have predicted *without* this
feature? There are two ways to do it, and both break under correlation.

**Interventional SHAP** holds a feature out by swapping in values drawn from the population
at large. With correlated features, that manufactures combinations that don't exist — a
25-year-old with forty years of credit history. The model has never seen anything like it,
so whatever it outputs is extrapolation, and the explanation inherits that noise - a "wobble".

**Conditional SHAP** fixes the impossible-combinations problem by respecting the correlation
structure. But it overcorrects: it will assign nonzero importance to a feature the model
doesn't use at all, purely because that feature is correlated with one the model does use.
For a model that is literally `f(x) = x₂`, conditional SHAP gives feature 1 a nonzero score.

These are different failures. The first is a variance problem. The second is a bias problem.
You can't escape by picking the other one.

## What I built

A local version of Accumulated Local Effects. Instead of probing the model at synthetic
points, it walks a path through the region where data actually lives and accumulates the
model's real local changes along the way. Everything it evaluates is a place the model was
plausibly trained to handle.

Code is on [GitHub](https://github.com/dawsonren/ExplainableML).

## What the experiments show

I ran it against exact SHAP across seven signal shapes, several neural network
architectures, and correlation levels from 0 to 0.99 — 213 configurations, 100 replications
each. The honest summary:

| Feature correlation | Median stability gain over SHAP | Best case | Runs where ALE wins |
|---|---|---|---|
| ρ ≤ 0.5 | none — SHAP is better | — | 1% |
| ρ = 0.7 | roughly a wash | 2.9× | 21% |
| ρ = 0.9 | roughly a wash | 9.5× | 42% |
| ρ ≥ 0.95 | **1.8× less variable** | **5.0×** | 85% |

The bias is about half of SHAP's, and runtime is comparable.

**This is not a replacement for SHAP.** When features are close to independent, SHAP's
counterfactual is fine and this method is actually more variable due to how we have to assemble the paths. The gain appears only when
correlation gets strong. So this would be a targeted fix for a failure mode, not
a better default. We tried many methods to reduce the variability of this method, but these always ended up increasing the bias or runtime by an unacceptable amount. Sometimes, that's just what research is like!

## The theory side

Alongside the experiments I proved some theoretical results:

- A convergence result showing the idealized estimator converges to Expected Integrated
  Gradients for smooth models, and to finite-difference ALE for piecewise-constant ones —
  with an explicit rate that depends on how the bins are sized. That result also hands over
  a hyperparameter scaling law, which is the practically useful part.
- Two results isolating the SHAP failures above as genuinely different — the interventional
  one is a non-identifiability result (the explanation isn't pinned down by the data), the
  conditional one is a bias result.

## Takeaways

Explainable AI (XAI) techniques like SHAP are seemingly ubiquitous (both in industry and scholarship), but they have real downsides. We tried to fix one of the shortcomings of SHAP, but we weren't able to come up with a method that improved its flaws while keeping all of its strengths. This also reminded me that in general, unless we are deploying in a setting where there are enormous amounts of data and the decision is "low-stakes" (think: "what movie should we recommend?", not "does this patient have a rare heart condition?"), we should probably be using simple, interpretable models.

And when deploying to customers, speed and interpretability can matter much more than "accuracy on a fixed benchmark". The quote "there are no decisions; only tradeoffs" comes to mind.

---

*Research with Prof. Daniel Apley at Northwestern.*