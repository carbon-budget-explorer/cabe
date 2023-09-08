import { borders as bordersDb } from '$lib/server/db/data';
import { searchParam } from '$lib/searchparam';
import {
	listFutureYears,
	listEffortSharings,
	effortSharingMap,
	pathwayChoices,
	pathwayQueryFromSearchParams
} from '$lib/server/db/models';

export async function load({ url }: { url: URL }) {
	const choices = pathwayChoices();
	const pathwayQuery = pathwayQueryFromSearchParams(url.searchParams, choices);
	const pathway = {
		query: pathwayQuery,
		choices
	};

	const rawyear = searchParam(url, 'year', '2030');
	const year = parseInt(rawyear);

	const effortSharingQuery = searchParam(url, 'effortSharing', 'None');
	const rawMetrics =
		effortSharingQuery === 'None' ? [] : effortSharingMap(pathwayQuery, year, effortSharingQuery);
	const metrics = bordersDb.addNames(
		rawMetrics.filter((d) => !Number.isNaN(d.value) && d.value !== null && d.value !== undefined)
	);

	const effortSharingChoices = listEffortSharings();
	const effortSharing = {
		choices: effortSharingChoices,
		query: effortSharingQuery
	};
	const data = {
		pathway,
		effortSharing,
		metrics,
		years: listFutureYears(),
		year,
		borders: bordersDb.geojson
	};
	return data;
}
