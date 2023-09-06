import { FC, HTMLProps, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import styles from './Link.module.css';

export interface LinkProps extends HTMLProps<HTMLAnchorElement> {
	external?: boolean;
}

const whiteListedExternalResources = [
	'https://github.com/vitonsky',
	'https://github.com/translate-tools',
	'https://chrome.google.com/webstore/detail/gbefmodhlophhakmoecijeppjblibmie',
	'https://addons.mozilla.org/addon/linguist-translator'
];

export const Link: FC<LinkProps> = ({ external, ...props }) => {
	const router = useRouter();

	const onClick = useCallback<Required<LinkProps>['onClick']>(
		(evt) => {
			if (props.onClick !== undefined) {
				props.onClick(evt);
			}

			if (external || evt.isPropagationStopped()) return;

			const url = props.href;
			if (url !== undefined) {
				const isContainsProtocol = /^[a-z]*:\/\//.test(url);

				if (!isContainsProtocol) {
					evt.preventDefault();
					router.push(url);
				}
			}
		},
		[external, props, router],
	);

	const rel = useMemo(() => {
		if (!external) return undefined;

		const isWhiteListedUrl = props.href && whiteListedExternalResources.some((prefix) => props.href!.startsWith(prefix));
		if (isWhiteListedUrl) return undefined;

		return 'nofollow ugc';
	}, [external, props.href]);

	return (
		<a
			rel={rel}
			{...props}
			className={[styles.Link, props.className].join(' ')}
			onClick={onClick}
		>
			{props.children}
		</a>
	);
};
