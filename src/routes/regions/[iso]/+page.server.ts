import { borders, totals } from '$lib/server/db/data';
import { scenarios } from '../../../lib/server/db/data';
import type { RouteParams } from './$types';

export const load = async ({ params }: { params: RouteParams }) => {
	const iso = params.iso;
	const name = borders.labels.get(iso) || iso;
	const r = {
		borders: borders.geojson,
		iso,
		name,
		gdp: totals.region('GDP', iso),
		population: totals.region('Population', iso),
		GF: scenarios.region('C1', 'GF', iso)
	};
	return r;
};
