import { getCountryMetrics } from '$lib/metrics';
import type { RouteParams } from './$types';

export const load = async ({ params }: { params: RouteParams }) => {
	return await getCountryMetrics(params.iso);
};
