import { searchParam } from '$lib/searchparam';
import type { PageServerLoad } from '../(nolayout)/global/$types';
import {
	warmingChoices,
	type GlobalBudgetQuery,
	nonCO2MitigationChoices as nonCO2MitigationChoices,
	negativeEmissionsChoices,
	probabilityChoices,
	globalBudget
} from '$lib/server/db/global';

export const load = (async ({ url }: { url: URL }) => {
	const query: GlobalBudgetQuery = {
		warming: searchParam(url, 'warming', warmingChoices[0]),
		probability: searchParam(url, 'probability', '50'),
		nonCO2Mitigation: searchParam(url, 'nonCO2Mitigation', 'low'),
		negativeEmissions: searchParam(url, 'negativeEmissions', 'low')
	};
	const choices = {
		warming: warmingChoices,
		nonCO2Mitigation: nonCO2MitigationChoices,
		probability: probabilityChoices,
		negativeEmissions: negativeEmissionsChoices
	};
	const result = globalBudget(query);
	return {
		query,
		choices,
		result
	};
}) satisfies PageServerLoad;