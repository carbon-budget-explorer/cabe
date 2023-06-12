import { readFile } from 'node:fs/promises';

export interface Metric {
    ISO: string;
    Time: number;
    Population: number;
    GDP: number;
}

export async function loadMetrics() {
    const fn = 'data/test.json';
    const metrics: Metric[] = JSON.parse(
        await readFile(fn, { encoding: 'utf8' })
    )
    return metrics
}

export function filterMetrics(raw_metrics: Metric[], year: number) {
    return raw_metrics.filter(d => d.Time === year)
}

export async function getCountryMetrics(iso: string) {
    const rawmetrics = await loadMetrics()
    const metrics = rawmetrics.filter(d => d.ISO === iso)
    console.log(metrics)
    // TODO add name of country and other fields from static/ne_110m_admin_0_countries.geojson
    return {
        iso,
        metrics
    }
}