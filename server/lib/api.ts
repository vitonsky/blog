import { stringify } from "query-string";

import { OptionalKeys } from "../types";
import { apiPath } from "../constants";

export const buildApiRequest =
	<T extends Record<string, any> | void = void, R = void>(path: string) =>
		(options: keyof T extends OptionalKeys<T> ? T | void : T) => {
			const url =
				apiPath + path + (options === undefined ? "" : "?" + stringify(options));

			return fetch(url).then((r) => r.json() as Promise<R>);
		};
