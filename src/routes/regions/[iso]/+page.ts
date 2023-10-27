import type { PageLoad } from './$types';
import { searchParam } from '$lib/searchparam';
import {
	effortSharings,
	pathwayCarbon,
	pathwayQueryFromSearchParams,
	pathwayStats
} from '$lib/api';
import { principles } from '$lib/principles';

export const load: PageLoad = async ({ params, data, url, fetch }) => {
	const iso = params.iso;
	const pathwayQuery = pathwayQueryFromSearchParams(url.searchParams, data.pathway.choices);
	const pathway = {
		query: pathwayQuery,
		stats: await pathwayStats(url.search, fetch),
		...data.pathway
	};
	const initialEffortSharingName = searchParam<keyof typeof principles>(
		url,
		'effortSharing',
		'PC' // When no effort sharing is selected on prev page, use per capita as default
	);

	// TODO validate iso, check that file exists
	const effortSharingData = await effortSharings(iso, url.search, fetch);
	const effortSharing = Object.fromEntries(
		Object.keys(principles).map((principle) => {
			const principleKey = principle as keyof typeof principles;
			const GHG = effortSharingData[principleKey];
			let emissionGap = -1;
			let ambitionGap = -1;
			if (principleKey !== 'ECPC') {
				emissionGap =
					data.reference.currentPolicy.find((d) => d.time === 2030)!.mean -
					GHG.find((d) => d.time === 2030)!.mean;
				ambitionGap =
					data.reference.ndc.find((d) => d.time === 2030)!.mean -
					GHG.find((d) => d.time === 2030)!.mean;
			}
			return [
				principleKey,
				{
					GHG: GHG,
					emissionGap,
					ambitionGap
				}
			];
		})
	);

	const global = {
		...data.global,
		pathwayCarbon: await pathwayCarbon(url.search, fetch)
	};

	return {
		...data,
		pathway,
		initialEffortSharingName,
		effortSharing,
		global
	};
};
