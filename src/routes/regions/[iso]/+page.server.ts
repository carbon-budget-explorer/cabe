import { borders } from '$lib/server/db/data';
import type { RouteParams } from './$types';
import { searchParam } from '$lib/searchparam';
import {
	currentPolicy,
	effortSharings,
	gdpOverTime,
	historicalCarbon,
	ndc,
	netzero,
	pathwayChoices,
	pathwayQueryFromSearchParams,
	populationOverTime
} from '$lib/server/db/data_client';
import { principles } from '$lib/principles';
import { extent } from 'd3';

export const load = async ({ params, url }: { params: RouteParams; url: URL }) => {
	const iso = params.iso;

	const choices = await pathwayChoices();
	const pathwayQuery = pathwayQueryFromSearchParams(url.searchParams, choices);
	const pathway = {
		query: pathwayQuery,
		choices
	};
	const initialEffortSharingName = searchParam<keyof typeof principles>(
		url,
		'effortSharing',
		'PC' // When no effort sharing is selected on prev page, use per capita as default
	);

	// TODO validate iso, check that file exists
	const effortSharingData = await effortSharings(iso, url.search);
	const hist = await historicalCarbon(iso, 1850, 2021);
	const reference = {
		currentPolicy: await currentPolicy(iso),
		ndc: await ndc(iso),
		netzero: await netzero(iso)
	};
	const population = await populationOverTime(iso, 1850, 2100);
	const gdp = await gdpOverTime(iso, 1850, 2100);
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
	const iso2 = borders.iso3to2.get(iso) || iso;
	const indicators = {
		ndcAmbition: -1,
		historicalCarbon: hist.map((d) => d.value).reduce((a, b) => a + b, 0)
	};
	const effortSharing = Object.fromEntries(
		Object.keys(principles).map((principle) => {
			const principleKey = principle as keyof typeof principles;
			const CO2 = effortSharingData[principleKey];
			let emissionGap = -1;
			let ambitionGap = -1;
			if (principleKey !== 'ECPC') {
				emissionGap =
					reference.currentPolicy.find((d) => d.time === 2030)!.mean -
					CO2.find((d) => d.time === 2030)!.mean;
				ambitionGap =
					reference.ndc.find((d) => d.time === 2030)!.mean - CO2.find((d) => d.time === 2030)!.mean;
			}
			return [
				principleKey,
				{
					CO2,
					emissionGap,
					ambitionGap
				}
			];
		})
	);

	const r = {
		info: {
			iso,
			iso2,
			name
		},
		pathway,
		historicalCarbon: {
			data: hist,
			extent: extent(hist, (d) => d.value) as [number, number]
		},
		initialEffortSharingName,
		effortSharing,
		reference,
		indicators,
		details
	};
	return r;
};
