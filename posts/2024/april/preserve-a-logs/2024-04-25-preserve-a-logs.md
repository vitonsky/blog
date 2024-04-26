---
# title: "The more logs you have the better"
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

Time of time I see a typical problem on a projects - a managers want to optimize development costs and decide to decrease development logs in services like Sentry/Rollbar, where we collect an errors that occurs on clients in production. They usually say something like "let's remove an old data that takes disk space and force us to use expensive plans".

When I ask them "why you want to delete an collected data that may help us to analyze our problems and debug them" they respond with something like "this data is not actual, so we may delete it with no problems and save money".

It looks this guys just don't understand what is assets of project and what things in project makes it valuable. Because they just want to burn a money, time and expertise accumulated in a project.

The data in general is a project assets the same as a code and people.

A data from event tracking services like Sentry/Rollbar or Mixpanel is absolutely necessary to track a project regressions. We need an historical information about errors and events occurrence to detect anomalies and trends.

Retrospective analysis against a historic data may detect a problems in development process. You may found that you have the same errors time of time, that means your approach about bugs fixing does not work.

Another case in real life, the management decided to purge an GitLab where placed our code. The proposed "solution" is to delete a lot of closed pull requests and completed branches with a lot of git history. Well, they did it and probably saved a couple thousands dollars, but we loose some historic data and time to bugs investigations been increased significant for some type of cases.

I tried to explain that a disk space cost is very low and price for couple additional terabytes is nothing compared to affect on sustainability, but i feel my points been missed.

Now, in timeline where artificial intelligence grow fast, the data important as never before. If your company have a slefhosted git service with a lot of activity and you care about disk space cost, but not how to setup a code analysis to detect a defects and vulnerabilities based on development history, then you probably miss a profit.

This point about any logs, not only git or analytics events.
