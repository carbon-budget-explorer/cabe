import {
	scenarios as scenariosDb,
	totals as totalsDb,
	borders as bordersDb
} from '$lib/server/db/data';
import type { SpatialMetric } from '$lib/server/db/utils';

function searchParam(url: URL, name: string, defaultValue = '') {
	const param = url.searchParams.get(name);
	if (param === null) {
		return defaultValue;
	}
	return param;
}

export async function load({ url }: { url: URL }) {
	// TODO validate searchParam with zod.js

	// TODO are years same for totals and scenarios?
	const years = totalsDb.years();

	const rawyear = searchParam(url, 'year', '2030');
	const year = parseInt(rawyear);

	const totals = {
		variables: totalsDb.variables(),
		variable: searchParam(url, 'tv')
	};

	const scenarios = {
		categories: scenariosDb.categories(),
		variables: scenariosDb.variables(),
		category: searchParam(url, 'sc', totals.variable ? '' : 'C1'),
		variable: searchParam(url, 'sv', totals.variable ? '' : 'GF')
	};

	let rawMetrics: SpatialMetric[];
	if (scenarios.category && scenarios.variable) {
		rawMetrics = scenariosDb.global(scenarios.category, scenarios.variable, year);
	} else {
		rawMetrics = totalsDb.global(totals.variable, year);
	}
	const metricName = totals.variable || scenarios.variable;
	const metrics = bordersDb.addNames(
		rawMetrics.filter((d) => !Number.isNaN(d.value) && d.value !== null && d.value !== undefined)
	);
	return { metrics, metricName, totals, years, year, scenarios, borders: bordersDb.geojson };
}
