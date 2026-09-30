---
layout: ../../layouts/Article.astro
title: AI-enabled migration of 20,000 client records
description: How Mola Faleti led the North American Implementation Group's first intelligent data conversion at Alter Domus, moving about 20,000 client records in a week and a half instead of four.
meta: [Alter Domus, North American Implementation Group, Client Implementation Lead, Enterprise CRM implementation]
tools: [AI-enabled data conversion, CRM, data validation]
next: { href: /projects/enterprise-ai-strategy/, title: Enterprise AI strategy proposal }
---

## The problem

One of my client implementations required us to move about 20,000 records into the Alter Domus platform.

The normal process was mostly manual. Someone would have to go through the records, save the information, and get everything into the new system. Based on the amount of data we had, we expected that work to take about four weeks.

Besides taking a long time, doing that much work manually creates another problem: every time a person has to touch a record, there is another opportunity for something to be missed or entered incorrectly.

We needed a faster way to move the data without creating a new problem by sacrificing accuracy.

## Design constraints

*We still had to trust the data.* Saving time did not mean much if we had to spend that time later fixing bad records. Whatever process we used still needed enough review and validation for us to be comfortable putting the client into production.

*This had not been done by our group before.* This was the first time the North American Implementation Group used intelligent data conversion for a migration like this. There was not an existing process I could simply follow.

*The migration was only one part of the implementation.* I was responsible for getting the client live, not just moving their records. The migration had to work alongside UAT, training, configuration, and the other work needed to get the client ready.

## What I did

Instead of having the team manually work through all 20,000 records, I led an AI-enabled migration that automated a large part of the conversion work.

The process scanned the existing records and helped move the information into the new CRM.

That changed where we were spending our time. Rather than using most of our time manually processing records, we could spend more of it reviewing the converted data, dealing with exceptions, and making sure the client was actually ready to go live.

I also had to make sure the migration fit into the rest of the implementation. Moving the data faster was useful because it gave us more time to focus on the parts of the project that still needed people: testing, fixing issues, answering client questions, and getting users comfortable with the new system.

## Outcome

<dl class="figures">
  <div><dt>client records migrated</dt><dd>~20,000</dd></div>
  <div><dt>vs. about four weeks estimated for the manual process</dt><dd>1.5 weeks</dd></div>
  <div><dt>intelligent data conversion in the North American Implementation Group</dt><dd>First</dd></div>
</dl>

We migrated roughly 20,000 client records in about a week and a half. The manual process was expected to take around four weeks. It was also the first intelligent data conversion completed by the North American Implementation Group.

For me, the biggest result was not really that we used AI. It was that we found a practical way to take several weeks of repetitive work out of an implementation while still keeping people involved where they actually added value.

It reduced the amount of manual processing, lowered the risk that comes with people touching thousands of individual records, and helped us get the client ready for go-live faster.

## Takeaways

- **Automation should solve an actual problem.** I am less interested in using AI because it is AI than I am in using it to get rid of work that does not need to be manual.
- **Faster only matters if the result still works.** With a data migration, getting 20,000 records moved quickly means nothing if the data is wrong.
- **People are more valuable handling exceptions than repetitive work.** Once the conversion handled most of the routine work, we could spend our time on the records and issues that actually needed judgment.
- **Implementation work is bigger than the technology.** The migration was important, but the real goal was getting the client comfortable enough with the system to actually use it.
- **The best process is not necessarily the process you inherited.** If there is a way to remove weeks of unnecessary work without hurting the result, I am going to look for it.
