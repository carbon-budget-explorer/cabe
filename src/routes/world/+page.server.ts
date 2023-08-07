import {
	scenarios as scenariosDb,
	totals as totalsDb,
	borders as bordersDb
} from '$lib/server/db/data';
import { searchParam } from '$lib/searchparam';
import type { SpatialMetric } from '$lib/server/db/utils';
import {
	type GlobalBudgetQuery,
	warmingChoices,
	nonCO2MitigationChoices,
	probabilityChoices,
	negativeEmissionsChoices
} from '$lib/server/db/global';

export async function load({ url }: { url: URL }) {
	const globalBudgetQuery: GlobalBudgetQuery = {
		warming: searchParam(url, 'warming', warmingChoices[0]),
		probability: searchParam(url, 'probability', '50'),
		nonCO2Mitigation: searchParam(url, 'nonCO2Mitigation', 'low'),
		negativeEmissions: searchParam(url, 'negativeEmissions', 'low')
	};
	const globalBudgetChoices = {
		warming: warmingChoices,
		nonCO2Mitigation: nonCO2MitigationChoices,
		probability: probabilityChoices,
		negativeEmissions: negativeEmissionsChoices
	};
	// TODO validate searchParam with zod.js

	// TODO are years same for totals and scenarios?
	const years = totalsDb.times();

	const rawyear = searchParam(url, 'year', '2030');
	const year = parseInt(rawyear);

	const totals = {
		variables: totalsDb.variables(),
		variable: searchParam(url, 'tv', '')
	};

	const scenarios = {
		categories: scenariosDb.categories(),
		variables: scenariosDb.variables(),
		category: searchParam(url, 'sc', totals.variable ? '' : 'C1'),
		variable: searchParam(url, 'sv', totals.variable ? '' : 'GF')
	};

	const effortSharingQuery = searchParam(url, 'effortSharing', 'None');
	const regions = totalsDb.regions();
	const rawMetrics: SpatialMetric[] = Array.from(
		totalsDb.carbonMap(globalBudgetQuery.warming, year, effortSharingQuery)
	).map((d, i) => ({
		ISO: regions[i],
		value: d
	}));
	const metrics = bordersDb.addNames(
		rawMetrics.filter((d) => !Number.isNaN(d.value) && d.value !== null && d.value !== undefined)
	);

	const effortSharingChoices = totalsDb.effortSharings();
	const effortSharing = {
		choices: effortSharingChoices,
		query: effortSharingQuery
	};
	const data = {
		globalBudget: { query: globalBudgetQuery, choices: globalBudgetChoices },
		effortSharing,
		metrics,
		years,
		year,
		borders: bordersDb.geojson
	};
	return data;
}
