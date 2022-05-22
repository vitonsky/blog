import styles from './ErrorPage.module.css';

export const ErrorPage = () => {
	return (
		<div className={styles.ErrorPage}>
			<div className={styles.ErrorCode}>404</div>
			<div className={styles.ErrorText}>Page not found</div>
		</div>
	);
};
