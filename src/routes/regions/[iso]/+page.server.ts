import { borders, ds } from '$lib/server/db/data';
import type { RouteParams } from './$types';
import { searchParam } from '$lib/searchparam';
import {
	type GlobalBudgetQuery,
	warmingChoices,
	nonCO2MitigationChoices,
	probabilityChoices,
	negativeEmissionsChoices,
	listEffortSharings,
	effortSharingRegion
} from '$lib/server/db/global';
import { principles } from '$lib/principles';

export const load = async ({ params, url }: { params: RouteParams; url: URL }) => {
	const iso = params.iso;
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
	const effortSharingQuery = searchParam(url, 'effortSharing', 'None');
	const effortSharingChoices = listEffortSharings();
	const effortSharing = {
		choices: effortSharingChoices,
		query: effortSharingQuery
	};

	const effortSharingData =
		effortSharingQuery === 'None'
			? []
			: effortSharingRegion(iso, globalBudgetQuery, effortSharingQuery);

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
		globalBudget: { query: globalBudgetQuery, choices: globalBudgetChoices },
		effortSharing
	};
	return r;
};
