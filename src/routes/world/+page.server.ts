import { loadMetrics, type Metric } from "$lib/metrics";

function filterMetrics(raw_metrics: Metric[], year: number) {
    return raw_metrics.filter(d => d.Time === year)
}

export async function load({ url }) {

    // TODO validate with zod.js

    let rawyear: any = url.searchParams.get('year')
    let year: number = 2018
    if (rawyear !== undefined) {
        console.log(year)
        year = parseInt(rawyear)
    }

    console.log(year)
    const raw_metrics = await loadMetrics()
    const metrics = filterMetrics(raw_metrics, year)
    return { metrics }
}
