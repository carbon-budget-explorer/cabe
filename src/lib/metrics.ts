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