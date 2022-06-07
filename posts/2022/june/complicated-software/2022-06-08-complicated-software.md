---
title: Complicated software is required to evolution
time: '00:20'
tags:
  - software
---

Last time i often hear point about "modern software is unjustified complicated compared to software of 20-30 years ago, modern development approach is wrong and we must focus on performance and energy efficient" and i completely against of this point. Complicated software is move us to the future.

![](matrix-architect.jpg 'The matrix movie')

I think we should focus on features and user experience. Actually doesn't matter how many memory your program use if its fine do user goals.

How often you heard that electron applications is suck because each application it's standalone instance of chromium browser which run javascript with hundreds packages from NPM (which [may contain malware](https://arstechnica.com/information-technology/2022/03/sabotage-code-added-to-popular-npm-package-wiped-files-in-russia-and-belarus/) btw)?

Or the statement "guys, stop make your blogs on react, just use HTML + CSS".

Maybe something like "20 years ago the programs did work so fast on hardware with very low specs and today, when your smartphone have power of super computer those years, our software not work faster"?

I not buy it.

Of course, the faster performance and the energy efficient the better, but what about other resources?

What's better, the program which solve your problem fine right now, right here, but use all your RAM and CPU or to the program just not exist? For me, the first.

The higher abstraction level the simply create software. The modern developer tools is have a very high level abstraction and this is allow us to fast prototyping and make software with a reach functional and a quite high quality for short time. Yes, quality may be not so good, but enough to use and to solve the problems.

We can make really many software which just work and simplify our life, include a software development. This give us a time to make good a really important things. This way to the progress.

We can improve performance later, when it will be really problem, if people will use our software and will show interest. Don't do this advance if it require significant time and it's not key feature of your software.

Your lifetime is limited. Do another useful things for yourself or for the people, instead of spend time to optimize your software.

## Be everywhere

The [electron](https://www.electronjs.org/) as platform is really have big potential to improvements, but this platform is allow us to make an applications which will work somehow on all desktop platforms, even if developer is can't program on C++, C#, Objective-C, Java and other languages a native to another OS.

Besides, on the low level abstractions like Qt or even native code which allow to achieve the better performance, a harder to maintanance the similar functionality and change the code as fast as on high level abstractions. For example, a program on the Qt may be faster than a program on the Electron, but implementation of creative ideas in UI may be complicated due to limitations a native UI on the platform. Or may harder to implement a features like powerful plugins system, to extends a program functionality. Or, eventually, a plugins making for this program may be complicated due to platform limitations and nobody will create plugins.

Today, the small team and even one developer may maintain a mobile application for the both Android and iOS, because we have dev tools like [react native](https://reactnative.dev/) and analogs. Yes, sometime the applications is looks and feel not so native and works not so good, but its usually do key work.

The development of native application for iOS and Android is very expensive and required many time and few implementations of the same functional and eventually your work may be just banned by Apple or Google, by any reason. Is you are ready to investment your time and resources on this conditions? If not so, the react native is good solution to make an application for both platforms and to decrease required resources and to save years of your life. Does not matter that your application will not perfect for some cases.

## Reuse your code

Sometimes i see people write "you should not use react for your blog, because it's overengineering, just use HTML + CSS". It's not only about blog, about software too, but it's good example why performance and lightweight is not key parameters in the product.

When user will load my blog page, if the javascript enabled its will re-render page, but user even don't see it, because it will take half second and page even don't blink, so whatever?

It's solves my problem - i have a blog, it works fine, i have control over content and i use for this a tools which i use every day, so i can go and make other projects.

When i make a blog on react, i can use all javascript infrastructure to build site as i want, as on production. I can use my favorite react components and reuse my own code which i use in other projects on react. I can keep files in markdown and process it as i want and then render HTML pages while generate site.

## Focus on design

The design of software is primary, not a performance.

20 years ago a computers do things with lower resources fine.

But which things computers did? And how accessible computers been?

So, computers really solved useful tasks, like fly to the moon, some financial and medical tasks, but isn't solve your personal daily problems. Today you can write your thinks to the favorite app, search any information and communicate with people in the internet, use reminder applications, find good music suggested by artificial intelligence and other things.

All its possible due to multiple factors, one smart people develop the technologies which allow to implement ideas to another people.

I think that most important step in this evolution is standards and splitting a responsibility areas.

In the real world it's when few mans who makes a guns from start to end without standards been replaced to few mans each of them make only one detail for the gun by one standard and then builds a gun from details. This make each gun repairable and even modifiable.

In the programming it's when we make maintainable code design. In this case, even if our code is not performant right now, we may improve it later. Even if we can't improve performance by self, we may pay somebody who can. Our challenge is develop a design which allow those improvements.

Today we may write high level code which solve our problems and think about performance later, if it will important.

## Optimize performance when it really necessary

The evolution is a natural selection. The bad software will replaced the better.

For example, the [Atom editor](https://atom.io/) have been a good editor on electron (first good editor on electron which i know), but its not focused on performance and its architecture did not been enough flexible to allow performance optimizations in the future, so now all users moved to the [VSCode](https://code.visualstudio.com/) which on electron too, but works fast. Atom shown that software on electron may be very useful and it's fine that atom had a bad performance, its did enough to work. But when atom did famous its can't improve performance for acceptable time and other product won.

Thus, we should always prefer a good architecture to performance if we want to make software with good quality and prevent useless spend time.
