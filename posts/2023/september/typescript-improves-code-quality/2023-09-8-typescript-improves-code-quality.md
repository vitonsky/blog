---
title: "Refusing TypeScript is a signal that you don't care about code quality"
time: '18:55'
tags:
  - code quality
keywords:
description:
image:
lang:
---

Few days ago the David Heinemeier Hansson [announced](https://world.hey.com/dhh/turbo-8-is-dropping-typescript-70165c01) a Turbo 8 [is dropping TypeScript](https://github.com/hotwired/turbo/pull/971). I'm ok with that, because i even don't know what Turbo 8 is, but few last years some frontend programmers tried to sell me idea the "TypeScript are useless, just use tests". I think the people with such opinion don't care about code quality or just don't know what TypeScript is. Here i'm explain why you should use a TypeScript.

![The Star Wars: Revenge of the Sith movie](Anakin-Skywalker.png)

The code quality control is a complex process to keep the code maintainable. You can't just cover code with tests on 100% or review each pull request and be sure your code is not a garbage and someone except you can figure out in this mess.

You can't ensure at all your code is not have bugs and have perfect maintainability. You can only increase defensive structures on your repository to make hard to push a bad code with bugs. The much barriers for a bad code you have the better your code quality.

It means you should to use all methods together to protect code in your repository - a unit/e2e/integration tests, a code review, a code analysis tools, maintain a clear documentation, etc.

TypeScript is a powerful code analysis tool, it can detect a lot of defective code. A TypeScript compiller forces programmers to proof the code are correct on types level. The value of static typing is totally underestimated by David's and many others.

Let's see what benefits for code quality the TypeScript gives.

# The contracts

Static types allows to define contracts in the code.

```ts
type Participant = {
	id: string;
	name: string;
};

function sayHi(participant: Participant) {
	//...
	console.log(`Hi ${participant.name}`);
}
```

Function `sayHi` requires an object with exact properties with exact types, and don't care what user of this function will do to meet the requirements.

User may provide object that does not meet requirements and cast type to any, but it is not a problem of function sayHi. This is a **responsibility delegation**, a important concept that developer must understand, to use TypeScript proper and takes it benefits.

Programmer must have to validate any untrusted data like user input and other IO data or result of inter op with JavaScript, and then, after validation and set types, may give the data to a TypeScript code and just trust the contracts will be honored, because TypeScript compiller has checked the code. In case a programmer cast a type, they must ensure the code are correct in a runtime.

If you can cast not intersected types on your project to any types except `unknown` with no runtime verification, you probably have problems with code quality on your project.

Contracts allows to not write validation for each function to ensure correct data. It great both for performance and for clean of code, the code become stupid and simple.

# Developer experience and development costs

Sometimes i write the code on pure JavaScript, mostly in browser console to calculate something fast or to parse a data on the page. Few months ago i has write [the script](https://github.com/translate-tools/linguist/tree/master/scripts/locales) for NodeJS to translate locale files with a ChatGPT. Files with text been long and ChatGPT have limits, so it takes some time to slice texts, translate it, find errors in ChatGPT result and translate again, then join slices back. Maybe 3-5 minutes depends on locale file size.

I wasted some time while this process, just because a trivial type errors, like "okay, i had forget about `await`, so variable contains `Promise`, so i write text "[object Promise]" into file instead of translated text" or "oh, i provided wrong object to a function arguments".

Typescript eliminates a type of errors like that.

# Investments to the future

A TypeScript gives your code a potential for analyzing by other tools, because adds a context.

With IDE you can rename property in interface and all entities who implement the interface will automatically rename the property on the place.

AI tools like ChatGPT and Copilot have more meta information, it may potentially improve results of code analysis and code generation. Tools for the analyzing may identify potentially dangerous code better.

Static typing and tests are great completes each other. Frontend code are highly asynchronous, it is hard to cover all possible test cases and consider all possible states of the code. A TypeScript forces programmers to handle all possible cases a state may have.

# The complexity of types

David's says
> TypeScript just gets in the way of that for me. Not just because it requires an explicit compile step, but because it pollutes the code with type gymnastics that add ever so little joy to my development experience, and quite frequently considerable grief. Things that should be easy become hard, and things that are hard become `any`. No thanks!

I quote it because i heard the point a lot of times.

It is true, sometimes you have to write not trivial type to proof the compiler your data are correct.

It's ok. To create a maintainable code with high quality, you sometimes do hard work.
