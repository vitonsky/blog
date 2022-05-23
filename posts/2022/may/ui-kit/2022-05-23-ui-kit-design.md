---
title: 'The most big problem of UI kits'
time: '2:30'
tags:
  - frontend
  - architecture
  - UI kit
---

UI kits are became popular and today exists really many UI libraries, but almost whole its a have one fundamental architecture problem which make this libraries not much good for wide use. The problem is a not modular design.

![](lego.jpg 'Lego blocks')

When developers search a UI library, they want to it contains a specific components and features which implement UX requirements. Components like buttons, menu, calendar, checkbox, popups and others with behavior from specification. A developers of UI libraries usually try to cover all use cases and consumer requirements, so they develop as many components and its features as they can.

But when consumers start to use UI kits, they often got some problems like this:

- UI kit is have unnecessary features
- features work a bit different than need and not possible to change behavior
- UI kit is have very big size, even if don't use unnecessary features and components

At the same time, independent of developers team size and time invested to development, any UI kit is cannot cover absolutely all use cases, so users have to implement some components itself.

This is how works most popular UI kits today.

## Modular architecture

The way to solve the problems is modular architecture.

Instead of one `Button` component which include all features, we should make basic `Button` component which have most basic features and mostly are interface of button which you can rely on, and then make wrappers to implement additional features.

```js
/**
 * Basic button
 */
export const Button = (props) => {
	return <button {...props} />;
};

/**
 * Feature to implement button toggle
 */
export const withButtonToggle = (Button) => {
	return ({ toggleable, isPressed, onToggle, ...props }) => {
		const className = [props.className, isPressed ? 'pressed' : undefined]
			.filter(Boolean)
			.join(' ');

		const onClick = (event) => {
			if (props.onClick) {
				props.onClick(event);
			}

			if (toggleable && onToggle) {
				onToggle();
			}
		};

		return <Button {...props} className={className} onClick={onClick} />;
	};
};

/**
 * Feature to implement button loading
 */
export const withButtonLoading = (Button) => {
	return ({ loading = false, ...props }) => {
		const className = [props.className, loading ? 'loading' : undefined]
			.filter(Boolean)
			.join(' ');

		return <Button {...props} className={className} disabled={loading} />;
	};
};
```

Then, to use button, we can just compose basic button and features which we really need.

```js
import { useState } from 'react';

export const MyButton = withButtonLoading(withButtonToggle(Button));

const App = () => {
	const [isLoading, setIsLoading] = useState(false);
	const toggle = () => setIsLoading((state) => !state);

	return (
		<div>
			<MyButton toggleable onToggle={toggle} isPressed={isLoading}>
				{isLoading ? 'Stop loading' : 'Start loading'}
			</MyButton>
			<br />
			<MyButton loading={isLoading} onClick={() => console.log('Pressed')}>
				{isLoading ? 'Loading...' : 'Press me'}
			</MyButton>
		</div>
	);
};

export default App;
```

[CodeSandbox](https://codesandbox.io/embed/ecstatic-monad-x9m75c?fontsize=14&hidenavigation=1&theme=dark&view=preview)

This way is allow us to implement or replace any additional features for components, enable only necessary features and even replace basic button to other component which implement interface of button.

## Implementations

Today, most popular UI kits still use "all in one" architecture, hovewer some libraries try to split components to features.

The [react-spectrum](https://github.com/adobe/react-spectrum) library maden by adobe is provide a react hooks which implement primitive behavior like "toggleable", "pressable", abstract keyboard navigation and etc. This hooks is allow you to create components with any markup and use only necessary hooks to implement component features.

The [react-elegant-ui](https://github.com/vitonsky/react-elegant-ui) is provide a components implemented by [BEM methodology](https://en.bem.info/methodology/quick-start/). The component split to "block" which is basic interface of component, "elements" which is sub-components and "modifiers" which define behavior of component.

You just [compose necessary features](https://vitonsky.github.io/react-elegant-ui/docs/Introduction/GettingStarted/#build) to use component:

```js
// Compose function will apply features to basic component
export const Button = compose(
	// Every feature after this can use this registry
	withRegistry(ButtonDesktopRegistry),

	// Apply only one HOC in list by props match
	composeU(withModButtonViewDefault, withModButtonViewAction),
	composeU(withModButtonSizeS, withModButtonSizeM, withModButtonSizeL),
)(DesktopButton);

// Set default properties for composed component
Button.defaultProps = { size: 'm', view: 'default' };

const App = () => {
	return (
		<div>
			<Button>Default button</Button>
			<Button size="l" view="action">
				Big action button
			</Button>
		</div>
	);
};
```
