import { countryName } from '$lib/borders';
import { allYears, filterMetrics, loadMetrics, type NamedMetric } from '$lib/metrics';
import { loadScenarios } from '$lib/scenarios';

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
	let metricName = 'GDP';
	if (rawmetricName !== null) {
		metricName = rawmetricName;
	}

	const filteredMetrics = filterMetrics(rawMetrics, parseInt(year));
	// TODO Add country name in more efficient and reusable way
	const metrics: NamedMetric[] = await Promise.all(
		filteredMetrics.map(async (d) => {
			try {
				return {
					...d,
					name: await countryName(d.ISO)
				};
			} catch (error) {
				return {
					...d,
					name: d.ISO
				};
			}
		})
	);

	await loadScenarios();

	return { metrics, metricName, years, year };
}
