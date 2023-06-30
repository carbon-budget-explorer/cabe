import { countryName } from '$lib/borders';
import { totals } from '$lib/db/data';
import type { RouteParams } from './$types';

export const load = async ({ params }: { params: RouteParams }) => {
	const iso = params.iso;
	const name = await countryName(iso);
	const r = {
		iso,
		name,
		gdp: await totals.region('GDP', iso),
		population: await totals.region('Population', iso)
	};
	return r;
};
