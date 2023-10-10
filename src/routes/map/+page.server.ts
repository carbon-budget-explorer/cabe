import { borders as bordersDb } from '$lib/server/db/data';
import { searchParam } from '$lib/searchparam';
import {
	fullCenturyBudgetSpatial,
	pathwayChoices,
	pathwayQueryFromSearchParams
} from '$lib/server/db/models';
import type { SpatialMetric } from '$lib/server/db/utils';
import type { principles } from '$lib/principles';

export async function load({ url }: { url: URL }) {
	const choices = pathwayChoices();
	const pathwayQuery = pathwayQueryFromSearchParams(url.searchParams, choices);
	const pathway = {
		query: pathwayQuery,
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
			rawMetrics = fullCenturyBudgetSpatial(pathwayQuery, selectedEffortSharing);
		} else {
			throw new Error(`Unknown variable: ${selectedVariable}`);
		}
	}

	const metrics = bordersDb.addNames(
		rawMetrics.filter((d) => !Number.isNaN(d.value) && d.value !== null && d.value !== undefined)
	);

	const data = {
		pathway,
		effortSharing: selectedEffortSharing,
		metrics,
		variable: selectedVariable,
		borders: bordersDb.geojson
	};
	return data;
}
