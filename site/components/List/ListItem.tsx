import { FC, HTMLAttributes } from 'react';

import styles from './List.module.css';

export const ListItem: FC<HTMLAttributes<HTMLLIElement>> = (props) => {
	return (
		<li {...props} className={styles['List-Item']}>
			{props.children}
			<div className={styles['List-ItemBottomIndent']} />
		</li>
	);
};
