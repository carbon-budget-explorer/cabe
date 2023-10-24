import { borders as bordersDb } from '$lib/server/db/data';
import { searchParam } from '$lib/searchparam';
import {
	currentPolicy,
	fullCenturyBudgetSpatial,
	historicalCarbon,
	pathwayCarbon,
	pathwayChoices,
	pathwayQueryFromSearchParams,
	pathwayStats
} from '$lib/api';
import type { SpatialMetric } from '$lib/api';
import type { principles } from '$lib/principles';

export async function load({ url }: { url: URL }) {
	const choices = await pathwayChoices();
	const pathwayQuery = pathwayQueryFromSearchParams(url.searchParams, choices);
	const pathway = {
		query: pathwayQuery,
		stats: await pathwayStats(url.search),
		choices
	};

	const selectedVariable: string = searchParam(url, 'variable', '2100');
	const selectedEffortSharing = searchParam<undefined | keyof typeof principles>(
		url,
		'effortSharing',
		'PCC'
	);
	let rawMetrics: SpatialMetric[] = [];
	if (selectedEffortSharing !== undefined) {
		if (selectedVariable === '2100') {
			rawMetrics = await fullCenturyBudgetSpatial(url.search);
		} else {
			throw new Error(`Unknown variable: ${selectedVariable}`);
		}
	}

	const metrics = bordersDb.addNames(
		rawMetrics.filter((d) => !Number.isNaN(d.value) && d.value !== null && d.value !== undefined)
	);

	const global = {
		historicalCarbon: await historicalCarbon(),
		pathwayCarbon: await pathwayCarbon(url.search),
		currentPolicy: await currentPolicy()
	};

	const data = {
		pathway,
		effortSharing: selectedEffortSharing,
		metrics,
		variable: selectedVariable,
		borders: bordersDb.geojson,
		global
	};
	return data;
}
