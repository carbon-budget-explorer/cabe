import { countriesDb } from "$lib/server/db/data";

export const GET = async () => {
	const iso ='USA';
	const db = await countriesDb.get(iso);
	const pathwayQuery = {
		temperature: '2.3',
		exceedanceRisk: '0.2',
		nonCO2Mitigation: '0.2',
		negativeEmissions: '0.6'
	}
	console.time('effortSharings');
	const effortSharingData = db.effortSharings(pathwayQuery);
	console.timeEnd('effortSharings');

	return new Response(String(JSON.stringify(effortSharingData)));
};
