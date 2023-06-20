import { readFile } from 'node:fs/promises';
import { countryName } from './borders';

export interface Metric {
	ISO: string;
	Time: number;
	Population: number;
	GDP: number;
}

export interface NamedMetric extends Metric {
	name: string;
}

export async function loadMetrics() {
	const fn = 'data/metrics.json';
	const text = await readFile(fn, { encoding: 'utf8' });
	const metrics: Metric[] = JSON.parse(text);
	return metrics;
}

export function filterMetrics(raw_metrics: Metric[], year: number) {
	return raw_metrics.filter((d) => d.Time === year);
}

export function allYears(raw_metrics: Metric[]) {
	return [...new Set(raw_metrics.map((d) => d.Time.toString()))];
}

export async function getCountryMetrics(iso: string) {
	const rawmetrics = await loadMetrics();
	const metrics = rawmetrics.filter((d) => d.ISO === iso);
	// TODO add name of country and other fields from static/ne_110m_admin_0_countries.geojson
	const name = await countryName(iso);
	return {
		iso,
		name,
		metrics
	};
}
