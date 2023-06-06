import { loadMetrics } from "$lib/metrics";

export async function load() {
    return {
        metrics: await loadMetrics()
    }
}