import { borders } from '$lib/server/db/data';
import type { RouteParams } from './$types';
import { searchParam } from '$lib/searchparam';
import {
	listEffortSharings,
	effortSharingRegion,
	pathwayChoices,
	pathwayQueryFromSearchParams
} from '$lib/server/db/models';
import { principles } from '$lib/principles';

export const load = async ({ params, url }: { params: RouteParams; url: URL }) => {
	const iso = params.iso;
	const choices = pathwayChoices()
	const pathwayQuery = pathwayQueryFromSearchParams(url.searchParams, choices);
	const pathway = {
		query: pathwayQuery,
		choices
	}
	const effortSharingQuery = searchParam(url, 'effortSharing', 'None');
	const effortSharingChoices = listEffortSharings();
	const effortSharing = {
		choices: effortSharingChoices,
		query: effortSharingQuery
	};

	const effortSharingData =
		effortSharingQuery === 'None'
			? []
			: effortSharingRegion(iso, pathwayQuery, effortSharingQuery);

	const name = borders.labels.get(iso) || iso;
	const label = principles.get(effortSharingQuery);
	const r = {
		borders: borders.geojson,
		iso,
		name,
		timeseries: {
			label,
			data: effortSharingData
		},
		pathway,
		effortSharing
	};
	return r;
};
