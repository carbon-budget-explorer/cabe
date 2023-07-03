import { borders, totals } from '$lib/server/db/data';
import { scenarios } from '../../../lib/server/db/data';
import type { RouteParams } from './$types';

export const load = async ({ params }: { params: RouteParams }) => {
	const iso = params.iso;
	const name = borders.labels.get(iso) || iso;
	const vars = scenarios.variables();
	const gfLabel = vars.find((v) => v[0] === 'GF')?.[1];
	const r = {
		borders: borders.geojson,
		iso,
		name,
		gdp: totals.region('GDP', iso),
		population: totals.region('Population', iso),
		GF: {
			label: gfLabel,
			data: scenarios.region('C1', 'GF', iso)
		}
	};
	return r;
};
