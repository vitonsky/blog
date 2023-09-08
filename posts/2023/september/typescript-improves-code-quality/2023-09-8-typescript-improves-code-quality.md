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

A few days ago, David Heinemeier Hansson [announced](https://world.hey.com/dhh/turbo-8-is-dropping-typescript-70165c01) that Turbo 8 [is dropping TypeScript](https://github.com/hotwired/turbo/pull/971). I'm okay with that because I don't even know what Turbo 8 is. However, over the past few years, some frontend programmers have tried to sell me the idea that "TypeScript is useless, just use tests". I think people with such opinions either don't care about code quality or simply don't know what TypeScript is. Here, I will explain why you should use TypeScript.

![The Star Wars: Revenge of the Sith movie](Anakin-Skywalker.png)

The code quality control is a complex process to keep the code maintainable. You can't just cover code with tests at 100% or review each pull request and be sure your code are maintainable, and someone other than you can figure it out in this mess.

You can't ensure at all that your code doesn't have bugs and has perfect maintainability. You can only increase defensive structures in your repository to make it hard to push bad code with bugs. The more barriers you have for bad code, the better your code quality.

It means you should use all methods together to protect code in your repository: unit/e2e/integration tests, code review, code analysis tools, and maintain clear documentation, etc.

TypeScript is a powerful code analysis tool; it can detect many defects in code. A TypeScript compiler forces programmers to ensure the code is correct on the types level. The value of static typing is underestimated by David and many others.

Let's see what benefits TypeScript gives for code quality.

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

The `sayHi` function requires an object with exact properties and exact types, and it doesn't care what the user of this function will do to meet the requirements.

A user may provide an object that doesn't meet the requirements and cast the type to any, but it is not a problem of the `sayHi` function. This is a **responsibility delegation**, an important concept that developers must understand to use TypeScript properly and reap its benefits.

Programmers must validate any untrusted data, such as user input and other IO data, or the results of interoperation with JavaScript. After validation and setting types, they can then pass the data to TypeScript code and trust that the contracts will be honored because the TypeScript compiler has checked the code. If a programmer casts a type, they must ensure the code is correct at runtime.

If you can cast non-intersected types in your project to any types except `unknown` with no runtime verification, you probably have problems with code quality on your project.

Contracts allow you to avoid writing validation for each function to ensure correct data. This is great for both performance and code cleanliness, the code becomes stupid and simple.

# Developer experience and development costs

Sometimes I write code in pure JavaScript, mostly in the browser console for quick calculations or data parsing on a web page. A few months ago, I wrote [a script](https://github.com/translate-tools/linguist/tree/master/scripts/locales) for Node.js to translate locale files using ChatGPT. These files contained long texts, and ChatGPT had limits, so it took some time to slice the texts, translate them, find errors in ChatGPT's results, retranslate as needed, and then join the slices back together. This process took around 3-5 minutes depending on the size of the locale file.

I wasted some time during this process due to trivial type errors, like forgetting to use `await`, which resulted in a variable containing a `Promise` and writing "[object Promise]" into the file instead of the translated text, or providing the wrong object as a function argument.

TypeScript eliminates errors like these.

# Investments to the future

TypeScript provides your code with the potential for analysis by other tools because it adds context.

With IDE you can rename a property in an interface, and all entities that implement the interface will automatically update the property's name in their respective places.

AI tools like ChatGPT and Copilot benefit from the additional meta information TypeScript provides, potentially improving code analysis and code generation. Analyzing tools can better identify potentially risky code.

Static typing and tests complement each other nicely. Frontend code is highly asynchronous, making it challenging to cover all possible test cases and consider all potential code states. TypeScript forces programmers to handle all possible cases a state may have, enhancing code reliability.

# The complexity of types

David's says
> TypeScript just gets in the way of that for me. Not just because it requires an explicit compile step, but because it pollutes the code with type gymnastics that add ever so little joy to my development experience, and quite frequently considerable grief. Things that should be easy become hard, and things that are hard become `any`. No thanks!

I quote it because I've heard this point many times.

It's true that sometimes you have to write non-trivial types to convince the compiler that your data is correct.

That's okay. Creating maintainable code with high quality often requires putting in the hard work.
