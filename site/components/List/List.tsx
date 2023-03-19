import { FC, HTMLAttributes } from 'react';

import styles from './List.module.css';

export const List: FC<HTMLAttributes<HTMLUListElement>> = (props) => {
	return <ul {...props} className={styles.List} />;
};
