---
layout: ../../layouts/Article.astro
kind: archive
title: "A Letter to Thomas Bayes"
description: "A letter to Reverend Thomas Bayes, written as a student in 2023, on conditional probability and how his idea became the naive Bayes spam filter."
date: 2023-02-25
---
<p style="text-align: center;">Mr. Ren’s Letter to Rev. Bayes<br/>containing some reflections on the<br/>his contributions to the field of probability</p>

Sr.

It is a pleasure to make your acquaintance, dear sir, and I hope that you will suffer no guilt if you must ignore this letter, since I am sure that you are a busy and industrious man.

I am a student of yours in the year 2023. How you have happened upon a student you have never taught, I will now tell.

After your demise, your dear friend Richard Price published the ["Essay towards solving a Problem in the Doctrine of Chances"](https://royalsocietypublishing.org/doi/10.1098/rstl.1763.0053) in the Royal Society. This work is the foundation for a large part of my learning from my university, indeed, it has left an indelible mark on the world.

In your own words, "If there be two subsequent events, the probability of the second bN and the probability of both together P / N, and it being first discovered that the second event has also happened, from hence I guess that the first event has also happened, the probability I am right is P / b". To readers today, we might say that the probability of a second event happening given the first is equal to the probability of both events divided by the probability of the first, or that

```math
P(B | A) = P(B ∩ A) / P(A)
```

Although this comment might have seemed innocuous at first, we now have an entire branch of statistics which bears your name: Bayesian statistics. From this I have gleaned that we are rarely remembered for the contributions that we hold most dear, but rather, ideas take on a mind of their own once exposed to the world.

If only you could see the applications of your work! We have made tremendous advances in probability and statistics, deriving models of inference that drive the daily activities of our society.

Imagine a world where sending a letter takes not weeks, but seconds through a network of wires that connect across oceans and continents, and words are not spelled on parchment, but through zeros and ones. You can communicate with anyone near-instantaneously, as long as you have their address. Unfortunately, letters from your family are drowned in a sea of correspondence from your rival academics. They constantly bombard you with letters written under psuedonyms (those cowards!) [attacking Newton’s theory of calculus](https://www.maths.tcd.ie/pub/HistMath/People/Berkeley/Analyst/Analyst.pdf) which you esteem so highly, causing you to miss a letter for your niece’s birthday celebration.

After buying a gift for your niece, you resolve to create a method to filter the letters you receive, classifying them either as ignorant tirades from inferior academics, or earnest requests for a new wooden rocking horse. Each letter contains a frequency of words, and given that a letter mentions “mathematics”, we might say with more confidence that the letter is written by those scoundrels. However, this might also eliminate the letters from your friend [John Canton](https://royalsocietypublishing.org/doi/pdf/10.1098/rstl.1763.0044) from the Royal Society! And so, you might also look for the words “calculus”, “Newton”, and “[fluxion](https://en.wikipedia.org/wiki/Fluxion)”. The presence of these words in the letter provide valuation information in determining whether or not the letter is worthy of being read.

Let the second event be that the word “calculus” is in the letter, and the first event that a spiteful hand wrote the letter, what we might call “spam”. We can obtain a first approximation for the probability the letter is “spam” by taking the number of letters that both contain the word “calculus” and are “spam” divided by the total number letters that contain the word “calculus” in general.

```math
P(spam | calculus) = P(spam ∩ calculus) / P(calculus)
```

As we add more and more words, we add more and more conditions. If we make the simplifying assumption that the probability of any word being present is independent of any other word, we obtain the [Naive Bayes Classifier](https://en.wikipedia.org/wiki/Naive_Bayes_classifier) under the Bernoulli distribution.

There is much else that I have to write to you about, but I have fluxions of my own to deal with in my real analysis homework. Until later, Reverend Bayes!

Yours,
Mr. Ren
