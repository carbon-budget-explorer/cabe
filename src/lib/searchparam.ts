export function searchParam<T>(url: URL, name: string, defaultValue: T): T {
	const param = url.searchParams.get(name);
	if (param === null) {
		return defaultValue;
	}
	return param as unknown as T;
}
