import type { PageServerLoad } from '../global/$types';
import { globalBudget, pathwayChoices, pathwayQueryFromSearchParams } from '$lib/server/db/models';

export const load = (async ({ url }: { url: URL }) => {
	const choices = pathwayChoices();
	const query = pathwayQueryFromSearchParams(url.searchParams, choices);
	const result = globalBudget(query);
	return {
		query,
		choices,
		result
	};
}) satisfies PageServerLoad;
