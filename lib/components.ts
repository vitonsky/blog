/**
 * Util to manage CSS module classnames
 */
export const recordClassNameManager =
	<T extends Record<string, string>>(stylesDictionary: T) =>
		(
			classes: Partial<Record<keyof T, boolean>>,
			additionalClasses: string[] = []
		) => {
			const className: string[] = [];
			for (let key in classes) {
				if (!classes[key]) continue;

				className.push(stylesDictionary[key]);
			}

			return className.concat(additionalClasses).filter(Boolean).join(" ");
		};