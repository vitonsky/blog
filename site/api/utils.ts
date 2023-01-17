import queryString from 'query-string';

import { OptionalKeys } from '../../server/types';
import { apiPath } from '../../server/constants';

export const buildApiRequest =
	<T extends Record<string, any> | void = void, R = void>(path: string) =>
		(options: keyof T extends OptionalKeys<T> ? T | void : T) => {
			const url =
			apiPath +
			path +
			(options === undefined ? '' : '?' + queryString.stringify(options));

			return fetch(url).then((r) => r.json() as Promise<R>);
		};
