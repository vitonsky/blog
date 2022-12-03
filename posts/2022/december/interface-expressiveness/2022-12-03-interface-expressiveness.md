---
title: 'Fundamental delusion about interface purposes'
time: '23:35'
tags:
  - architecture
  - quality
  - typescript
---

We strive to ensure code quality with tests, static code typing, code analyzing, code review and documentation, but some of most popular programming languages like Typescript and Java kill interfaces as concept to describe contract of code.

[![](./Apple_Magic_Mouse.jpg)](https://commons.wikimedia.org/wiki/File:Bad_design_-_Apple_Magic_Mouse_2,_unusable_when_charging.jpg)

[Contracts in programming](https://en.wikipedia.org/wiki/Design_by_contract) is a specification of software component. It's describe for another programmers how interact with code that provide contract.

For example, contract may describe class `AbstractStorage` and declare it have property `version` and method `updateVersion`.

Contract only describe how to interact with class, but not describe its implementation, so one programmer may use this class, another programmer can change logic inside this class and third programmer can make a new class that implements a contract and replace original class to own implementation for test purposes.

Programming languages provides mechanics to express contract ideas in the code, in Typescript and Java it's a interface:

```ts
// Define interface
interface AbstractStorage {
	version: number;

	updateVersion: (newVersion: number, previousVersion: number | null) => void;
}

class TranslationsStorage implements AbstractStorage {
	version = 1;

	updateVersion(newVersion: number, previousVersion: number | null) {
		// ...
	}
}
```

However, a lot of programming languages is limit a interfaces abilities to describe contracts.

The most popular common problem is not support a static members in interface.

Example for Typescript

```ts
// Define interface
interface AbstractStorage {
	version: number;

	updateVersion: (newVersion: number, previousVersion: number | null) => void;
}

// ERROR: Class 'TranslationsStorage' incorrectly implements interface 'AbstractStorage'.
//  Type 'TranslationsStorage' is missing the following properties from type 'AbstractStorage': version, updateVersion
class TranslationsStorage implements AbstractStorage {
	static version = 1;

	static updateVersion(newVersion: number, previousVersion: number | null) {
		// ...
	}
}
```

It works that because in Typescript when class implements an interface, it describes an class instance object structure, but not a class contract.

Typescript [did not introduced](https://github.com/microsoft/TypeScript/issues/13462) something like `static` keyword for `interface` declaration syntax.

Java also [have this problem](https://stackoverflow.com/questions/370962/why-cant-static-methods-be-abstract-in-java) and do not support an `abstract static` members in interfaces.

The problem of such limitations is programmers can't express actual contract for their code, so create code that extremely hard to maintenance. An static method will exist on the class, but will not defined in interface to implement, so class contract will not precise, so contract useless.

Impossibility to create interface with static (abstract) member in programming language that have interface feature and ability to define static members for class it's the same big problem as impossibility check to string type in language that have type string.

We have to use interfaces only to express a contract of components and interfaces in programming languages must be enough powerful to describe any external interface of components.
