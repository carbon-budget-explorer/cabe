import type { PageServerLoad } from '../global/$types';
import {
	ambitionGap,
	pathwayCarbon,
	currentPolicy,
	emissionGap,
	historicalCarbon,
	ndc,
	netzero,
	pathwayChoices,
	pathwayQueryFromSearchParams,
	pathwayStats,
} from '$lib/server/db/models';

export const load = (async ({ url }: { url: URL }) => {
	const choices = pathwayChoices();
	const query = pathwayQueryFromSearchParams(url.searchParams, choices);

	const result = {
		pathwayCarbon: pathwayCarbon(query),
		pathwayStats: pathwayStats(query),
		historicalCarbon: historicalCarbon(),
		currentPolicy: currentPolicy(),
		ndc: ndc(),
		netzero: netzero(),
		ambitionGap: ambitionGap(query),
		emissionGap: emissionGap(query),
	};
	// TODO many rows in result have same year, so could be optimised for size
	return {
		pathway: {
			query,
			choices
		},
		result
	};
}) satisfies PageServerLoad;
