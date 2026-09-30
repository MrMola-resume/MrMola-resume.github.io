---
layout: ../../layouts/Article.astro
kind: project
title: A fairness testing platform for AI models in life insurance
description: How I built RGA's discrimination testing platform for predictive and AI models as its sole engineer — from regulation and statistics to production in ten weeks.
org: Reinsurance Group of America
period: June–August 2026
role: Sole engineer
stack: [Python, Litestar, Pydantic, React, TypeScript, visx, OpenAPI, PySpark, Databricks]
meta: [Reinsurance Group of America, Summer 2026, Sole engineer, 10 weeks]
---

## The problem

New regulation — the <a href="https://artificialintelligenceact.eu/article/17/" target="_blank" rel="noopener noreferrer">EU AI Act</a>, plus life-insurance-specific rules in the <a href="https://content.naic.org/sites/default/files/legal-adoption-map-ai-model-bulletin.pdf" target="_blank" rel="noopener noreferrer">US</a> and <a href="https://cset.georgetown.edu/publication/china-ai-law-draft/" target="_blank" rel="noopener noreferrer">China</a> — requires that predictive and AI models be tested for discrimination before they're used. I worked in the Model Risk Management (MRM) team, whose purpose was to perform ensure that the tests being used by the model's developers were up to spec. During my internship, bias testing guidelines were being drafted, and my goal was to help model developers understand what kinds of tests they should perform.

At first, we decided that I would demo a "bias testing tool" that showed some basic statistical tests that should be run to detect bias. But once I started showing it to model developers after Week 4, they liked it so much that they wanted to access to it. So I spent the next 6 weeks interviewing, developing, beta testing, deploying, and finally demonstrating it to a global audience.

## Design constraints

*Data Privacy and Regulatory Compliance.* GDPR regulations meant training data and models could not leave their geographical region — which is why the Europe, Middle East, and Africa (EMEA) team had difficulty coordinating bias testing with the MRM team. Rather than build a service that ingests data, I built one that goes to the data: a Databricks job that runs on behalf of the user, under their own credentials, against their own model. That design unblocked adoption in the EU.

*Most published fairness methods assume a binary decision.* External consultants proposed drawing from the <a href="https://www.eeoc.gov/laws/guidance/questions-and-answers-clarify-and-provide-common-interpretation-uniform-guidelines" target="_blank" rel="noopener noreferrer">four-fifths rule</a> and the disparate impact literature for our fairness metrics. This assumes that the model outputs are "approve" or "deny", while life insurance models typically output continuous scores. I flagged the gap during the guideline drafting, proposed ANOVA with an omega-squared effect size as the replacement test for continuous outputs, and clarified the idea with the consulting principal. It was adopted into the corporate policy.

*The users aren't fairness researchers.* Model owners and actuaries needed to understand which tests would run against their model and why, before running anything.

## What I built

A full-stack application, with:
- Backend: Litestar and Pydantic, twenty REST endpoints
- Frontend: React and TypeScript frontend using <a href="https://visx.airbnb.tech" target="_blank" rel="noopener noreferrer">visx</a> (such a fan of this library!) for the charts
- Documentation: OpenAPI with openapi-typescript to keep the two type systems in sync.

A model owner uploads a dataset and a model, configures the run, and gets back a formatted dashboard.

Underneath it, a suite of statistical tests organized around three definitions of fairness:
- *Inequality* — are there differences between protected groups at all?
- *Residual Inequality* — is the model systematically over- or under-predicting for some groups, which is a calibration question
- *Unequal Actionability* — do the <a href="https://en.wikipedia.org/wiki/Main_effect" target="_blank" rel="noopener noreferrer">main effects</a> of the variables a person can actually change differ across groups?

The statistics run in PySpark, so a few hundred million rows finish in minutes rather than hours.

## Outcome

Deployed to production as a Databricks App in ten weeks — about 10,000 lines across a monorepo, with CI, type checking, unit tests, synthetic datasets carrying known injected bias for validation, and a reviewed design and methodology document. It's now in beta rollout across a 70-person global data science organization. The team's write-up to leadership estimated it saves on the order of 2,500 analyst hours a year.

## Takeaways

1. If you want to make a tool that people will use, don't just talk to the user, but also the team that uses the tool's outputs. Those people determine whether or not the user will keep on using your tool.
2. Aggressively document technical decisions, but a good design is the minimum expectation. The real value comes from testing real scenarios with real users.
3. Find the "gatekeepers" that can help you get access to resources you need. Be grateful when they help you!
4. Most of the time spent making something is in the planning/design tradeoffs phase, especially in highly-regulated industries.
