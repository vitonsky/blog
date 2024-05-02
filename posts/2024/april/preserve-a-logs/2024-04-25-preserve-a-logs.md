---
title: 'Create as much logs as possible'
time: '11:40'
tags:
keywords:
description:
image:
lang:
---

Like a code maintainability important than a performance of a code for programmers and business both, a logs in a project is important than code at all.

![The Better Call Saul TV series](<better call saul smoking scene.jpg>)

Time after time, I see a typical problem on projects - managers want to optimize development costs and decide to decrease development logs in services like Sentry/Rollbar, where we collect errors that occur on clients in production. They usually say something like "Let's remove old data that takes up disk space and forces us to use expensive plans".

When I ask them, "Why do you want to delete collected data that may help us analyze our problems and debug them?" they respond with something like, "This data is useless, so we can delete it without any problems and save money."

The data, in general, is as much a project asset as the code and the people involved. The manager who wants to "optimize costs" on logs is essentially just burning money, time, and expertise accumulated in the project.

The data from event tracking services like Sentry/Rollbar or Mixpanel is absolutely necessary to track project regressions. We need historical information about errors and event occurrences to detect anomalies and trends.

Retrospective analysis of historic data may detect problems in the development process. You may find that you have the same errors time after time, which means your approach to bug fixing is not working.

One more another story. Management decided to purge our GitLab repository where our code is stored. The proposed "solution" was to delete numerous closed pull requests and completed branches containing extensive git history. This move probably saved a couple of thousand dollars, but we lost significant historical data, and the time required for bug investigations has increased considerably.

I tried to explain that the cost of disk space is very low, and the price for a couple of additional terabytes is nothing compared to the impact on sustainability, but I feel like my points were missed.

In a timeline where artificial intelligence is advancing rapidly, data is more important than ever before. If your company hosts a extensively used git service and you care about disk space cost, but not how to set up a code analysis to detect defects and vulnerabilities based on development history, then you're likely missing out on potential profit.

This point about any logs, not only about analytics events and git.
