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

Enterprise programming is the management of system complexity. The main goals on most of enterprise projects is to minimize bugs, be scalable, and release as soon as possible. This goals is unreachable in project where people rely on individual skills rather on system approach.

![There Will Be Blood (2007)](<There Will Be Blood.jpg>)

Maybe you have seen a videos where some one worker [do they work exceptionally good](https://www.youtube.com/watch?v=YmkPoiEcgJM) on [assembly line](https://www.youtube.com/watch?v=kUFdnMUb0rY), [oil rig](https://www.youtube.com/shorts/CSgEkjrGlbs?feature=share) or on construction site? That is ideal demonstration of individual skills. That looks cool, but the problem that in case this workers will be under bus tomorrow - the same work will never be done as efficient as before. Because the workflow is not efficient, and only single individuals works great there.

On this videos with "super efficient" individuals probably no any problems from business perspective, since this workers probably paid as low as other workers, but they work N times better than others, so it's great investment. But it becomes a problem if project tries to scale or if manager will promise to partners some output based on current estimations, and then "super efficient" worker will leave them.

The system is more than rules and people who obey this rules. The system based on idea that individuals are weak and vulnerable to human factors (like [bus factor](https://en.wikipedia.org/wiki/Bus_factor), [fundamental attribution error](https://en.wikipedia.org/wiki/Fundamental_attribution_error), etc.), but the problem may be minimized with set of rules that everyone must follow.

For example, instead of believe in programmers will not push to master branch, repository owner may enable auto rejection for any attempts push to master branch except through pull request. This is a great example of popular decision, that prevents potential problems. Programmers may not want push to master, but do it accidentally, since they are just humans, and I personally sometimes catch myself on it.

To be efficient in reach the goals, team must always rely on system, but not individuals. Individual efficiency is important though, and shall be encouraged, but must not be expected. Otherwise you will have random quality, false expectations, absolute no sustainability, and your business will be done once your top programmer leave to another job. This is why a business must have interest in system approach over trust to individuals.

So, how to think in system terms? Operate on high level!
- Improve a workflows, not an individuals. Make process the lever to apply effort.
- Find a problems that occurs systematically, introduce a processes to resolve the problem, and **make process over people**.

Processes works like tests in programming. When you found a bug, it is not enough to just fix this bug, since the same bug may occurs on next week, once somebody other will make changes in code. To fix bug, programmer must add test to ensure a problem will be found if bug will reproduces again.

The same thing. Process must solidify the problem-solving decision. The system must be able to work even if we will replace all people on project to another ones. Hence, the result of people work must be an artifacts. The solutions like code, collected data, and the knowledge like documentation, decisions logs, rules and policies.

Some examples of typical system solutions in programming:

- Make decisions based only in writing conversations with overview all possible solutions, including all known positive and negative aspects for each of them
- Make it necessary to show material proofs like measurements while claim anything
- Use programming languages with static types and aggressive configured code analysis tools
- Setup strict rules for linters to ban most of dangerous language features, and to force programmers write boring and obvious code
- Setup a lot of testing and analysis jobs in pull request pipelines, to detect and reject bad code as frequent as possible
- Make mandatory a code review process and make responsible for quality the people who approves the pull requests, not the changes author
- Require programmers to add tests for any code changes
- Require programmers to use only immutable values

The idea in all this rules is to automate a dodging of problems. Instead of believe that programmers on your projects are strong disciplined specialists who do not make a bugs, you can just force them to write code the way that make hard to merge pull request with bugs.

If you have enough strong rules, you may don't care about programmers skills. If they can run over your barriers, then code are fine, or the rules is not enough strong and need to be improved.

You may faced with resistance in your team, when you introduce processes that let you rely on system rather of individuals. Some programmers want to be an experts on the project, because it's hard to fire an expert without which the project will not work. So the system approach is an existential threat for them.

Once we had a problem with performance due to unnecessary re-renders in complex react project. Our investigation figured out the problems with memoization that is pretty typical problem. One of the solutions has been idea to introduce a rule to memoize all the things returned by hooks, to automatically avoid any potential problems with memoization in future. This idea is pretty straightforward, simple and stupid. But we had a long discussion about it with one of programmers, who had insist it's bad because "premature optimization", react docs does not have recommendations about it and "nobody do like that". In my opinion it is good case where programmer resists the system approach just because he wants to spent time to fix the same things over and over and pretend to work hard.