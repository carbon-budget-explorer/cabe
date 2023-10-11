import { countriesDb } from '$lib/server/db/data';

export const GET = async () => {
	const iso = 'USA';
	const db = await countriesDb.get(iso);
	const pathwayQuery = {
		temperature: '1.5',
		exceedanceRisk: '0.5',
		nonCO2Mitigation: '0.5',
		negativeEmissions: '0.5'
	};
	console.time('effortSharings');
	const effortSharingData = db.effortSharings(pathwayQuery);
	console.timeEnd('effortSharings');

	return new Response(String(JSON.stringify(effortSharingData)));
};
