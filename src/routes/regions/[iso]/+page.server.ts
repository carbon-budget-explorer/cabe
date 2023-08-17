import { borders, totals } from '$lib/server/db/data';
import type { RouteParams } from './$types';
import { totals as totalsDb } from '$lib/server/db/data';
import { searchParam } from '$lib/searchparam';
import {
	type GlobalBudgetQuery,
	warmingChoices,
	nonCO2MitigationChoices,
	probabilityChoices,
	negativeEmissionsChoices
} from '$lib/server/db/global';
import { principles } from '$lib/principles';

export const load = async ({ params, url }: { params: RouteParams; url: URL }) => {
	const iso = params.iso;

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
	const effortSharingQuery = searchParam(url, 'effortSharing', 'None');
	const effortSharingChoices = totalsDb.effortSharings();
	const effortSharing = {
		choices: effortSharingChoices,
		query: effortSharingQuery
	};

	const startYear = 2020;
	const endYear = 2100;
	const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
	const effortSharingData = Array.from(
		totals.carbon(globalBudgetQuery.warming, startYear, endYear, iso, effortSharingQuery)
	);

	const name = borders.labels.get(iso) || iso;
	const label = principles.get(effortSharingQuery);
	const r = {
		borders: borders.geojson,
		iso,
		name,
		timeseries: {
			label,
			data: effortSharingData.map((d, i) => ({ Time: years[i], value: d }))
		},
		globalBudget: { query: globalBudgetQuery, choices: globalBudgetChoices },
		effortSharing
	};
	return r;
};
