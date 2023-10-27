import { borders } from '$lib/server/db/data';
import type { PageServerLoad } from './$types';
import {
	currentPolicy,
	gdpOverTime,
	historicalCarbon,
	ndc,
	pathwayChoices,
	populationOverTime
} from '$lib/api';
import { extent } from 'd3';

// TODO figure out when pathway query in url.searchparams is changed
// then this load method is not called, but only ./+page.ts:load is called

export const load: PageServerLoad = async ({ params }) => {
	const iso = params.iso;

	const choices = await pathwayChoices();

	const hist = await historicalCarbon(iso, 1850, 2021);
	const reference = await ndc(iso)
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
		ndcAmbition:
			(-(
				reference.find((d) => d.time === 2030)!.mean - hist.find((d) => d.time === 1990)!.value
			) /
				hist.find((d) => d.time === 1990)!.value) *
			100,
		historicalCarbon: hist.map((d) => d.value).reduce((a, b) => a + b, 0)
	};

	const global = {
		historicalCarbon: await historicalCarbon(),
		currentPolicy: await currentPolicy()
	};

	const r = {
		info: {
			iso,
			iso2,
			name
		},
		pathway: {
			choices
		},
		historicalCarbon: {
			data: hist,
			extent: extent(hist, (d) => d.value) as [number, number]
		},
		indicators,
		details,
		global
	};
	return r;
};
