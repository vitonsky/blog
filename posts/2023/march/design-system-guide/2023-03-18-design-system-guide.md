---
title: 'Design system guide'
time: '19:48'
tags:
keywords:
  - ui
  - design system
  - design tokens
description:
image:
lang:
---

If your project don't have a design system it is probably usual problem for you, when even a small changes like changes a color for action buttons takes off a lot of time, generate a lot of changes and make user interface look inconsistent. To solve the problems, you should start use a design system. Let's talk what is it and how to use.

[
![City study with some painterly additions](a_city_by_fmacmanus.jpg)
A city art by a @fmacmanus
](https://www.deviantart.com/fmacmanus/art/A-City-510598968)

The design system is a principles and rules to form an product user interface. It is a documentation for your product style, required for scalability.

A design system makes a product style are consistent. If you do not have a system, it is hard to keep the one style even on "one project" level and with increase features it makes harder and harder, maintainability cost are grown fast. This problem extremely visible when you have a few clients, like a web application, and a native applications for a smartphones.

Even if you have one project and one team, but do not have a design system, with a time your product style will look like a monster of frankenstein.

## Design system structure

A design system is a documentation that contains a key principles and guides with how to apply a principles to a specific technologies.

Most important sections to explain

- Color system
  - How to work with a colors
  - Product palette
  - Color transformations
  - Color details for text, icons, shadows, the most important common things
- Design tokens
  - Key principles explanation
  - How to use, how to add a new tokens
  - Naming and grouping strategy
- Components guides
  - Anatomy
  - Variants
  - Usage guidelines
- Patterns
  - Guides how to implement a most common features
  - Accessibility instructions
  - Layout principles
- Assets guides
  - Iconography
  - Typography
  - Formating, compression, etc.
- Resources and tools
  - UI kits and its API
  - Where to find an assets (icons, fonts, images, videos)
  - What tools used on projects to work with a design system

Don't worry, you can start from writing a few most important sections for your project, to share principles with your team or with another team and enrich your design system with a new docs later, when you feel the powerful.

It is possible that you actually have a system in your mind, but you didn't share the principles with your team. Try to discuss the rules with a teams who works on UI, to find out a features of product and to prevent conflicts and rules collisions.

## How to use

It is important not just create a design system, but make it a source of truth for a development.

A people who work on user interface must consider these principles to reach uniform style on the product level.

Tell about your design system to your design people before they will start to create a new design.

Require developers to obey a design system principles. When you review a pull request and you see violations with a design system - reject the PR with links to a related sections.

## Examples

Some examples of popular design systems

- [Spectrum](https://spectrum.adobe.com/)
- [Material Design](https://m2.material.io/design/introduction)
- [Kontur guides](https://guides.kontur.ru/)
- [Yandex design systems list](http://designsystemsclub.ru/)
