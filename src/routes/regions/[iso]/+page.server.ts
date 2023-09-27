import { borders, dataDir, pyodide } from '$lib/server/db/data';
import type { RouteParams } from './$types';
import { searchParam } from '$lib/searchparam';
import {
	currentPolicy,
	fullCenturyBudgetSingleRegion,
	historicalCarbon,
	pathwayChoices,
	pathwayQueryFromSearchParams
} from '$lib/server/db/models';
import { principles } from '$lib/principles';
import { CountryDatabase } from '$lib/server/db/country';

export const load = async ({ params, url }: { params: RouteParams; url: URL }) => {
	const iso = params.iso;
	// TODO validate iso, check that file exists
	const ncPath = dataDir + `/xr_alloc_${iso}.nc`;
	const db = new CountryDatabase(iso, ncPath);
	await db.open(pyodide);

	const choices = pathwayChoices();
	const pathwayQuery = pathwayQueryFromSearchParams(url.searchParams, choices);
	const pathway = {
		query: pathwayQuery,
		choices
	};
	const initialEffortScharingName = searchParam<keyof typeof principles>(
		url,
		'effortSharing',
		'PC' // When no effort sharing is selected on prev page, use per capita as default
	);

	const effortSharingData = db.effortSharings(pathwayQuery);
	const hist = historicalCarbon(iso);
	const curPol: any[] = [];

	const name = borders.labels.get(iso) || iso;
	const label =
		initialEffortScharingName !== undefined ? principles[initialEffortScharingName].label : '';
	const r = {
		iso,
		name,
		timeseries: {
			label,
			data: effortSharingData
		},
		pathway,
		currentPolicy: curPol,
		historicalCarbon: hist,
		effortSharing: {
			initial: initialEffortScharingName,
			data: effortSharingData
		}
	};
	return r;
};
