import { getCountryMetrics } from '$lib/metrics'
import type { PageLoad } from './$types'

export const load = (
    async ({ params }) => {
       return await getCountryMetrics(params.iso)
    }
) satisfies PageLoad