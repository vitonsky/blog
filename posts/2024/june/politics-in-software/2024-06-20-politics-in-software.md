---
title: 'Software with politic opinion is are security threat'
time: '18:20'
tags:
  - software
  - security
  - privacy
  - opinion
  - facts
keywords:
description:
image:
lang:
---

The software who have a politic opinion, implies a bias and high risk for security. Avoid a software with a "position" today, to you not be hacked tomorrow.

![The movie Dr. Strangelove, or How I Learned to Stop Worrying and Love the Bomb (1964)](dr-strangelove.png)

On this week i've found [twitter post](https://x.com/kozlovzxc/status/1802726956665905234/photo/1) in my feed, with a screenshot "[@pnpmjs](https://x.com/pnpmjs) blocked you", and my reaction been kinda «wow, it's good did not start to use PNPM still, and getted known about they have "opinion" that prompted them to block someone in twitter and which may be a motivation to inject malware on my PC in next time. I've been close to start use it in next months».

![banned twitter account](twitter-ban.png)

There are reasons to consider such threats as real. In fact, we've had too much cases lately that prove over and over that software with any "opinion" or "political views" are dangerous.

A lot of NPM packages contains malware, usually they use typo squatting or masquerade tactics and parasitize on popular packages, but some of them initially does not contain any malware and becomes popular, but then happens something in the world and they attack users by political reasons. This is the story of [CVE-2022-23812](https://github.com/advisories/GHSA-97m3-w2cp-4xx6), a famous npm package `node-ipc` with over a million weekly downloads, that started [deleting all data and overwriting all files](https://www.bleepingcomputer.com/news/security/big-sabotage-famous-npm-package-deletes-files-to-protest-ukraine-war/) on developer's machines to protest Ukraine war in march 2022.

Cloud services have this problem too, in 30 May 2024 [Docker Hub blocked access for users from Russia](https://therecord.media/docker-hub-suspends-services-russia) by political reasons, GitHub suspends accounts in Russia, Iran, and another countries [[1]](https://www.pcmag.com/news/github-reportedly-suspends-accounts-related-to-sanctioned-russian-orgs), [[2]](https://techthelead.com/russian-developers-get-their-github-accounts-suspended-lose-work-without-warning/), [[3]](https://techcrunch.com/2019/07/29/github-ban-sanctioned-countries/).

Browser extensions, mobile and desktop apps also implements the logic to attack users by regions and based on their political view. Nowadays there are lot teams who buy a popular apps and browser extensions to inject malware. I have [blog post](../../../2023/september/malware-in-browser-extensions/2023-09-1-malware-in-browser-extensions.md) about it.

As you can see, the "opinion" or "political view" for the company is not only a way to hype on sanctions and to curry favor with the investors, government and consumers, but it is a clear signal about potential threats. A signal that your sensitive data may be hijacked, sold or wiped anytime if political compass will spin tomorrow and recognize you as enemy.

There are no way to protect ourself of cyber attacks, but at least we may avoid the software with "opinion". The good software care not about how to ban someone in twitter, how to limit access from some region or how to inject malware based on region, religion or skin color.
