import { borders, countriesDb } from '$lib/server/db/data';
import type { RouteParams } from './$types';
import { searchParam } from '$lib/searchparam';
import {
	gdpOverTime,
	historicalCarbon,
	pathwayChoices,
	pathwayQueryFromSearchParams,
	populationOverTime
} from '$lib/server/db/models';
import type { principles } from '$lib/principles';
import { extent } from 'd3';

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
	const hist = historicalCarbon(iso, 1850);
	const reference = {
		currentPolicy: [],
		ndc: [],
		netzero: []
	};
	const population = populationOverTime(iso, 1850, 2100);
	const gdp = gdpOverTime(iso, 1850, 2100);
	const details = {
		gdp: {
			data: gdp,
			extent: extent(gdp, (d) => d.value) as [number, number]
		},
		population: {
			data: population,
			extent: extent(population, (d) => d.value) as [number, number]
		}
	};

	const name = borders.labels.get(iso) || iso;
	const iso2 = borders.geojson.features.find((f) => f.properties.ISO_A3_EH === iso)?.properties
		.ISO_A2_EH;
	const r = {
		iso,
		iso2,
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
