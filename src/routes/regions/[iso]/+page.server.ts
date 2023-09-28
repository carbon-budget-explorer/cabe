import { borders, countriesDb } from '$lib/server/db/data';
import type { RouteParams } from './$types';
import { searchParam } from '$lib/searchparam';
import {
	historicalCarbon,
	pathwayChoices,
	pathwayQueryFromSearchParams
} from '$lib/server/db/models';
import type { principles } from '$lib/principles';

export const load = async ({ params, url }: { params: RouteParams; url: URL }) => {
	const iso = params.iso;
	// TODO validate iso, check that file exists
	const db = await countriesDb.get(iso);

	const choices = pathwayChoices();
	const pathwayQuery = pathwayQueryFromSearchParams(url.searchParams, choices);
	const pathway = {
		query: pathwayQuery,
		choices
	};
	const initialEffortScharingName = searchParam<keyof typeof principles>(
		url,
		'effortSharing',
		'PC' // When no effort sharing is selected on prev page, use per capita as default
	);

	const effortSharingData = db.effortSharings(pathwayQuery);
	const hist = historicalCarbon(iso);
	const reference = {
		currentPolicy: [],
		ndc: [],
		netzero: []
	};
	const details = {
		gdp: [],
		population: []
	};

	const name = borders.labels.get(iso) || iso;
	const r = {
		iso,
		name,
		pathway,
		historicalCarbon: hist,
		effortSharing: {
			initial: initialEffortScharingName,
			data: effortSharingData
		},
		reference,
		details
	};
	return r;
};
