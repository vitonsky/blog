import { FC, HTMLProps, useCallback } from "react";
import { useRouter } from "next/router";

import styles from "./Link.module.css";

export interface LinkProps extends HTMLProps<HTMLAnchorElement> {
	external?: boolean;
}

export const Link: FC<LinkProps> = ({ external, ...props }) => {
	const router = useRouter();

	const onClick = useCallback<Required<LinkProps>["onClick"]>(
		(evt) => {
			if (props.onClick !== undefined) {
				props.onClick(evt);
			}

			if (external || evt.isPropagationStopped()) return;

			const url = props.href;
			if (url !== undefined) {
				const isContainsProtocol = (/^[a-z]*:\/\//).test(url);

				if (!isContainsProtocol) {
					evt.preventDefault();
					router.push(url);
				}
			}
		},
		[external, props, router]
	);

	return (
		<a
			{...props}
			className={[styles.Link, props.className].join(" ")}
			onClick={onClick}
		>
			{props.children}
		</a>
	);
};
