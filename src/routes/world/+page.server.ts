import { allYears, filterMetrics, loadMetrics } from '$lib/metrics';

export async function load({ url }) {
	// TODO validate searchParam with zod.js

	const rawMetrics = await loadMetrics();
	const years = allYears(rawMetrics);

	const rawyear = url.searchParams.get('year');
	let year: string = years[years.length - 1];
	if (rawyear !== null) {
		year = rawyear;
	}

	const rawmetricName = url.searchParams.get('metric');
	let metricName: string = 'GDP';
	if (rawmetricName !== null) {
		metricName = rawmetricName;
	}

	const metrics = filterMetrics(rawMetrics, parseInt(year));

	return { metrics, metricName, years, year };
}
