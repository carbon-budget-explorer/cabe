import { borders as bordersDb } from '$lib/server/db/data';
import { searchParam } from '$lib/searchparam';
import {
	type GlobalBudgetQuery,
	warmingChoices,
	nonCO2MitigationChoices,
	probabilityChoices,
	negativeEmissionsChoices,
	listFutureYears,
	listEffortSharings,
	carbonMap
} from '$lib/server/db/global';

export async function load({ url }: { url: URL }) {
	const globalBudgetQuery: GlobalBudgetQuery = {
		warming: searchParam(url, 'warming', warmingChoices[0]),
		probability: searchParam(url, 'probability', '50%'),
		nonCO2Mitigation: searchParam(url, 'nonCO2Mitigation', 'Medium'),
		negativeEmissions: searchParam(url, 'negativeEmissions', 'Medium')
	};
	const globalBudgetChoices = {
		warming: warmingChoices,
		nonCO2Mitigation: nonCO2MitigationChoices,
		probability: probabilityChoices,
		negativeEmissions: negativeEmissionsChoices
	};
	// TODO validate searchParam with zod.js

	const rawyear = searchParam(url, 'year', '2030');
	const year = parseInt(rawyear);

	const effortSharingQuery = searchParam(url, 'effortSharing', 'None');
	const rawMetrics = effortSharingQuery === 'None' ? [] : carbonMap(
		globalBudgetQuery,
		year,
		effortSharingQuery
	)
	const metrics = bordersDb.addNames(
		rawMetrics.filter((d) => !Number.isNaN(d.value) && d.value !== null && d.value !== undefined)
	);

	const effortSharingChoices = listEffortSharings()
	const effortSharing = {
		choices: effortSharingChoices,
		query: effortSharingQuery
	};
	const data = {
		globalBudget: { query: globalBudgetQuery, choices: globalBudgetChoices },
		effortSharing,
		metrics,
		years: listFutureYears(),
		year,
		borders: bordersDb.geojson
	};
	return data;
}
