---
title: 'Rely on the system approach, not on individuals'
time: '19:05'
tags:
  - management
  - code quality
keywords:
description:
image:
lang:
---

Entherprise programming is the management of system complexity. The main goals on most of enterprise projects is to minimize bugs, be scalable, and release as soon as possible. This goals is unreachable if you rely on individual skills rather on system.

![](./There%20Will%20Be%20Blood.jpg)

Maybe you have seen a videos where some one [worker do they work exceptionally good](https://www.youtube.com/watch?v=YmkPoiEcgJM) on [assembly line](https://www.youtube.com/watch?v=kUFdnMUb0rY), [oil rig](https://www.youtube.com/shorts/CSgEkjrGlbs?feature=share) or on construction site? That is ideal demonstration of individual skills over system approach. That looks cool, but the problem that in case this workers will be under bus tomorrow - the same work will never be done as efficient as before.

The system is more than rules and people who obey this rules. The system based on idea that individuals are weak and vulnerable to human factors (like [bus factor](https://en.wikipedia.org/wiki/Bus_factor), [fundamental attribution error](https://en.wikipedia.org/wiki/Fundamental_attribution_error), etc.), but the problem may be minimized with set of rules that everyone must follow.

For example, instead of believe in programmers will not push to master branch, repository owner may enable auto rejection for any attempts push to master branch except through pull request. Programmers may not want push to master, but do it accidentally, since they are just humans, and I personally sometimes catch myself on it. This is a great example of popular decision, that prevents potential problems.

To be efficient in reach the goals, team must always rely on system, but not individuals. Individual efficiency is important though, and shall be encouraged, but must not be expected. Otherwise you will have random quality and estimations, absolute no sustainability, and your business will be done once your top programmer leave to another job. This is why a business must have interest in system approach over trust to individuals.

On videos above with "super efficient" individuals probably no any problems from business perspective, since this workers probably paid as low as other workers, but they work N times better than others, so it's great investment. But it becomes a problem if project tries to scale or if manager will promise to partners some output based on current estimations, and then "super efficient" worker will leave them.

So, how to think in system terms? Operate on high level! Find a problems that occurs systematically, introduce a processes to resolve the problem, and **make process over people**!

Processes works like tests in programming. When you found a bug, it is not enough to just fix this bug, since the same bug may occurs on next week, once somebody other will make changes in code. To fix bug, programmer must add test to ensure a problem will be found if bug will reproduces again.

The same thing. Process must solidify the problem-solving decision. The system must be able to work even if we will replace all people on project to another ones. Hence, the result of people work must be an artifacts. The solutions like code, collected data, and the knowledge like documentation, decisions logs, rules and policies.

Some examples of typical system solutions in programming:

- Make decisions based only in writing conversations with overview all possible solutions, including all known positive and negative aspects for each of them
- Make it necessary to show material proofs like measurements while claim anything
- Use programming languages with static types and aggressive configured code analysis tools
- Setup strict rules for linters to ban most of dangerous language features, and to force programmers write boring and obvious code
- Setup a lot of testing and analysis jobs in pull request pipelines, to detect and reject bad code as frequent as possible
