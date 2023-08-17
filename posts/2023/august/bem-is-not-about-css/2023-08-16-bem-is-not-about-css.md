---
title: "BEM methodology is not about CSS"
time: '14:28'
tags:
keywords:
  - BEM methodology
  - software design
  - frontend
description:
image:
lang:
---

Some developers are sure that BEM is just a way to make class names in CSS are unique and, since a modern tools allow to make names unique automatically they have no reasons to use BEM. This is a mistake with a bad consequences, BEM is are methodology about atomic code design, it gives you a standards and guides how to simplify code maintaining.

![The Pusher movie (1996)](the-pusher-movie.jpg)

First of all, let's see BEM definition from an [official docs site](https://en.bem.info/methodology/quick-start/).

> BEM (Block, Element, Modifier) is a component-based approach to web development. The idea behind it is to divide the user interface into independent blocks. This makes interface development easy and fast even with a complex UI, and it allows reuse of existing code without copying and pasting.

No one single word about CSS as you see, because a [naming convention](https://en.bem.info/methodology/naming-convention/) is not a whole BEM, it just one of tools the methodology offers you.

BEM is a methodology to develop a high extensible modular components with low code coupling.

## Best practices to create a robust software

BEM gives you a methods to improve a code maintainability, its based on most popular best practices like a code decoupling and dependency inversion principles and focused on front end problems.

For example, look at [external geometry principle](https://en.bem.info/methodology/css/#external-geometry-and-positioning), the essence which is that blocks must never set their own position and external indents. This allows to reuse a block at any place and to set position by another element as needed with no problems about overriding CSS specificity.

Example for block `search-form`
```html
<!-- `header` block -->
<div class="header">
    <!--
        The `search-form` block is mixed with the `search-form` element
        from the `header` block
    -->
    <div class="search-form header__search-form"></div>
</div>
```

A `search-form` does not have margin, a block `header` is responsible to set position for a block `search-form` inside, it uses an element `header__search-form` to implement positioning, so block `search-form` may be re-used in other blocks.

BEM defines a responsibility model for entities.

## Code composition

With BEM you can extend the basic component with a new features (the "decorator" pattern) just by add a [a modifier](https://en.bem.info/methodology/key-concepts/#modifier).

For example, you can implement base `List` component:
```tsx
const BaseList: IList<IListProps> = ({items, ...props}) => {
	// ...
	return <ul {...props} className="List">
		{items.map(
			(item) => <li key={item.id} className="ListItem" {...item.props}>
				{item.content}
			</li>
		)}
	</ul>
}
```

and then add feature to enable keyboard navigation over items by modifier

```tsx
const withListKeyboardNavigation = (List: IList): IList<IListProps & { keyboardNavigation: boolean }> => {
	return ({ keyboardNavigation, ...props }) => {
		const onKeyDown = // navigation implementation ...
		return <List {...props} onKeyDown={onKeyDown}/>
	}
}
```

now you can enable features you needs

```tsx
const List = withListTypeCheckbox(
	withListTypeRadio(
		withListKeyboardNavigation(BaseList)
	)
);

// You can now enable keyboard navigation by set modifier
<List keyboardNavigation items={listItems}/>

// Or not to use feature
<List items={listItems}/>
```

Unlike most popular UI kits who give you not flexible monolith components that includes all features out of box and not have a way to override features behavior, a BEM methodology force to decompose a complex component to block, elements and modifiers to allow you replace any feature with your implementation and to include in bundle only features you needs. This is benefits of [elements](https://en.bem.info/methodology/key-concepts/#element) and [modifiers](https://en.bem.info/methodology/key-concepts/#modifier) in BEM.

With this approach you can reuse components and its features between projects and even use code in BEM community that rely on interface, not on implementation.

## Files structure standard

You may know about [Feature-Sliced Design](https://feature-sliced.design/), an methodology for a frontend projects to eliminate chaos and to make standard how to organize files on project, to simplify find a files between projects. Maybe your framework or your company have their own rules and guidelines how to place files.

BEM methodology offers [a way to organize a file structure](https://en.bem.info/methodology/filestructure/#files-are-grouped-by-meaning-not-by-type) by meaning, not by type.

When you have a button component, you should place all files of the button to one directory, file type are not matter - javascript, CSS, HTML, images and other resources, docs, tests, all things in one place.

This approach makes components really atomic and independent.

## Conclusion

Of course, BEM also useful for naming CSS entities, but it is not main feature of BEM, it's just a result of methodology use.

Methodology lays a proper software design ideas applicable not only for CSS and even not only for front-end.

This is why advanced tools that improve development experience will not take out a BEM methodology, but enhance each other.

If you are interesting a BEM now - read the [BEM methodology docs](https://en.bem.info/methodology/quick-start/).

## Related links

- [yandex-ui](https://github.com/bem/yandex-ui), an UI-kit built by BEM methodology
- [elegant-ui](https://github.com/vitonsky/react-elegant-ui), my UI-kit build by BEM methodology. It inspired by `yandex-ui` project, enhanced and used in my personal projects since 2021 year
- [What Is BEM and Why It’s Not What You Are Looking For](https://codete.com/blog/what-is-bem-and-why-it-s-not-what-you-are-looking-for) - a funny article about BEM, that shows you a typical wrongs in understanding what BEM is