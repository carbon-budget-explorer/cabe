import { filterMetrics, loadMetrics } from "$lib/metrics";

export async function load({ url }) {

    // TODO validate searchParam with zod.js

    const rawyear = url.searchParams.get('year')
    // TODO determine default year from data
    let year: number = 2018
    if (rawyear !== null) {
        year = parseInt(rawyear)
    }
    const rawmetricName = url.searchParams.get('metric')
	let metricName: string = 'GDP';
    if (rawmetricName !== null) {
        metricName = rawmetricName
    }
    const raw_metrics = await loadMetrics()
    const metrics = filterMetrics(raw_metrics, year)
    return { metrics, metricName }
}
