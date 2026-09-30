---
layout: ../../layouts/Article.astro
kind: project
title: "The free shipping problem: when your decisions affect your training data"
date: 2026-09-15
description: "Amazon's free shipping threshold changes what customers buy, which biases the data you'd use to set the threshold. We develop an algorithm that corrects for this."
tags: [operations, revenue management, online learning, research, theory, statistical machine learning]
---

Amazon gives you free shipping on orders over $35. Pick the number too low and you pay for shipping costs
on orders that would have paid them. Too high and customers abandon the cart. The right
threshold depends on how much people actually wanted to spend.

Here's the catch: you can't see that.

Because a threshold already exists, a customer who wanted $28 of stuff adds a $7 item to
get free shipping. Your logs record a $35 order. You cannot tell an organic $35 from a padded $28,
and every historical order below the threshold is missing from your data precisely because
those customers padded their way above it.

This is a "censoring" problem, and it has an unpleasant property: **more data doesn't fix it.**
The naive estimate is biased, not noisy. Collect ten million more orders and you converge,
confidently, to the wrong threshold.

The same problem also occurs with demand planning: when you lose sales due to insufficient stock, you're not able to see how many customers actually wanted your product, which leads to biased estimates of demand.

## What we did

Work with [Sean Sinclair](https://seanrsinclair.github.io) at Northwestern, in two settings.

**Offline** — you have historical sales and you don't want to run a disruptive live
experiment. We use Inverse Probability of Censoring Weighting: if you know roughly how likely
a customer at $28 is to pad, you can up-weight the uncensored observations you *do* see to
reconstruct what the true demand distribution must have been. We prove this recovers a
near-optimal threshold at the same rate you'd get if demand were fully observed, inflated by
a factor of 1/(1−α), where α measures how much padding is going on.

**Online** — the Uber Eats situation, where the right threshold isn't one number. It depends
on time of day, delivery distance, courier availability. 6 PM in Manhattan is not 3 PM in
suburban St. Louis, and Uber One now varies minimum basket size by exactly these factors.
Running a separate bandit per context is hopeless: the number of contexts grows exponentially
in the number of covariates. But the problem has structure worth exploiting — if you set a
$35 threshold, you learn what would have happened at $30 too, because you observed those
customers' real baskets. That's *one-sided feedback*, and makes the algorithm more "sample-efficient".

For a manager, it means that you actually want to set slightly higher shipping thresholds than
what you think you should set, since it gives you more information about the demand distribution.

## Does it work?

On synthetic data calibrated to a fashion retailer's fitted parameters, varying how much
censoring is present:

| Historical threshold | Naive (ignore censoring) | Kaplan–Meier | IPCW |
|---|---|---|---|
| $25 — light censoring | **0.04** | 0.06 | 0.08 |
| $75 | 0.27 | **0.09** | 0.12 |
| $100 | 0.71 | 0.13 | **0.08** |
| $200 — heavy censoring | 1.59 | 0.16 | **0.10** |

Lower is better. The naive approach degrades by a factor of forty as censoring gets worse.
IPCW stays flat.

Worth noticing that at $25, where barely anyone pads, the naive estimator *wins* — it's
biased but lower-variance, and with little censoring the bias costs less than the variance
of reweighting.

On real transactions (the UCI Online Retail dataset, roughly a year of a UK retailer's
orders), the naive estimator flattens out to the wrong threshold no matter how many orders it
sees, while IPCW gets close to optimal.

## Takeaways

The free shipping threshold is a nice concrete problem, but there's a larger lesson.
Any time a policy both *makes* a decision and *shapes* the data you'd use to evaluate that
decision, you need to carefully consider any changes you make to the policy.
Stocking levels censor demand. Credit approval thresholds censor
default data. Ranking algorithms censor what users would have clicked.

The instinct to just fit a model to historical data and optimize is wrong in all of these
cases, because you're not thinking about the *implications* of changing your decisions.

---

*Independent study with Prof. Sean R. Sinclair, IEMS, Northwestern. Presented at the <a href="https://www.ideal-institute.org/2025/04/18/midwest-optimization-statistical-learning-conference-2025/" target="_blank" rel="noopener noreferrer">Midwest
Optimization and Statistical Learning conference</a>.*