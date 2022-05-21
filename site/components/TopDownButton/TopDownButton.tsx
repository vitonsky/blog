import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { recordClassNameManager } from '../../lib/components';

import styles from './TopDownButton.module.css';

import IconUp from '../../assets/icons/chevron-up.svg';

const cnTopDownButton = recordClassNameManager(styles);

const MIN_SCROLL_TO_SHOW_BUTTON = 200;
const SCROLL_TO_IGNORE_RESET = 200;

export interface TopDownButtonProps {}

export const TopDownButton: FC<TopDownButtonProps> = () => {
	const ignoreScrollRef = useRef(false);

	const [lastPosition, setLastPosition] = useState<null | number>(null);
	const onPress = useCallback(() => {
		ignoreScrollRef.current = true;
		requestAnimationFrame(() => {
			ignoreScrollRef.current = false;
		});

		if (lastPosition !== null) {
			document.documentElement.scrollTop = lastPosition;

			setLastPosition(null);
			return;
		}

		const position = document.documentElement.scrollTop;
		document.documentElement.scrollTop = 0;

		setLastPosition(position);
	}, [lastPosition]);

	const [scroll, setScroll] = useState(0);
	useEffect(() => {
		setScroll(document.documentElement.scrollTop);

		const scrollHandler = () => {
			const { scrollTop } = document.documentElement;
			setScroll(scrollTop);

			if (ignoreScrollRef.current || scrollTop < SCROLL_TO_IGNORE_RESET) return;
			setLastPosition(null);
		};

		document.addEventListener('scroll', scrollHandler);
		return () => {
			document.removeEventListener('scroll', scrollHandler);
		};
	}, []);

	const isShowButton = scroll > MIN_SCROLL_TO_SHOW_BUTTON || lastPosition !== null;

	return (
		<div
			className={cnTopDownButton(
				{
					ButtonHide: !isShowButton,
				},
				[styles.Button],
			)}
			onClick={onPress}
		>
			<IconUp
				className={cnTopDownButton(
					{
						IconInvert: lastPosition !== null,
					},
					[styles.Icon],
				)}
				viewBox="0 0 24 24"
			/>
		</div>
	);
};
