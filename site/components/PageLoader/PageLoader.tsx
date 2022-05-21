import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Spinner } from 'react-elegant-ui/components/Spinner/Spinner.bundle/desktop';

import styles from './PageLoader.module.css';

const useIsRouterLoading = () => {
	const router = useRouter();

	const [loadingPath, setLoadingPath] = useState<null | string>(null);

	useEffect(() => {
		const startLoading = (url: string) => {
			setLoadingPath(url);
		};

		const completeLoading = (url: string) => {
			if (loadingPath !== url) return;
			setLoadingPath(null);
		};

		router.events.on('routeChangeStart', startLoading);
		router.events.on('routeChangeComplete', completeLoading);
		router.events.on('routeChangeError', completeLoading);

		return () => {
			router.events.off('routeChangeStart', startLoading);
			router.events.off('routeChangeComplete', completeLoading);
			router.events.off('routeChangeError', completeLoading);
		};
	}, [loadingPath, router]);

	return loadingPath !== null;
};

export const PageLoader: FC = () => {
	const isRouterLoading = useIsRouterLoading();

	return (
		<div className={styles.Loader}>
			<Spinner view="primitive" progress={isRouterLoading} />
		</div>
	);
};
