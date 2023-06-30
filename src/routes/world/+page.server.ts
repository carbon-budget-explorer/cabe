import { countryName } from '$lib/borders';
import { totals } from '$lib/db/data';

export async function load({ url }: { url: URL }) {
	// TODO validate searchParam with zod.js

	const years = await totals.years();

	const rawyear = url.searchParams.get('year');
	let year: number = new Date().getFullYear();
	if (rawyear !== null) {
		year = parseInt(rawyear);
	}

	const rawmetricName = url.searchParams.get('metric');
	let metricName = 'GDP';
	if (rawmetricName !== null) {
		metricName = rawmetricName;
	}

	const filteredMetrics = await totals.global(metricName, year);
	// TODO Add country name in more efficient and reusable way
	const metrics = await Promise.all(
		filteredMetrics
			.filter((d) => !Number.isNaN(d.value) && d.value !== null)
			.map(async (d) => {
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

	const variables = await totals.variables();

	return { metrics, metricName, years, year, variables };
}
