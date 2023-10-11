import type { principles } from '$lib/principles';
import { dsGlobal, dsMap, dsRef, pyodide } from './data';
import type { SpatialMetric, TemnporalMetric } from './utils';
import { slice, type DataArraySelection } from './xarray';

export interface PathWayQuery {
	temperature: string;
	exceedanceRisk: string;
	nonCO2Mitigation: string;
	negativeEmissions: string;
}

export interface PathwayStats {
	total: number;
	used: number;
	remaining: number;
}

export interface TimeSeriesValue {
	time: number;
	mean: number;
	min: number;
	max: number;
}

// TODO transpose structure: time, mean, min and max arrays as attributes
export interface TimeSeries {
	name: string;
	values: TimeSeriesValue[];
}

/**
 * make pyodide toJs(toJsOpts) return a list of JS object instead of list of Map instances
 */
export const toJsOpts = { dict_converter: Object.fromEntries };
export type UncertainTime = {
	time: number;
	mean: number;
	max: number;
	min: number;
};
export type CertainTime = {
	time: number;
	value: number;
};

export function pathwayQueryFromSearchParams(
	searchParams: URLSearchParams,
	choices: Record<keyof PathWayQuery, string[]>
): PathWayQuery {
	// TODO check each searchParam is in respective choices array
	const temperature = searchParams.get('temperature') ?? choices.temperature[0];
	const exceedanceRisk = searchParams.get('exceedanceRisk') ?? choices.exceedanceRisk[0];
	// TODO when more choices are available use Medium==1 as default
	const nonCO2Mitigation = searchParams.get('nonCO2Mitigation') ?? choices.nonCO2Mitigation[0];
	const negativeEmissions = searchParams.get('negativeEmissions') ?? choices.negativeEmissions[0];
	return {
		temperature,
		exceedanceRisk,
		nonCO2Mitigation,
		negativeEmissions
	};
}

export async function pathwayChoices(): Promise<Record<keyof PathWayQuery, string[]>> {
	const url = 'http://127.0.0.1:5000/pathwayChoices';
	const response = await fetch(url);
	const choices = await response.json();
	return choices;
}

export async function pathwayStats(search: string): Promise<PathwayStats> {
	const url = 'http://127.0.0.1:5000/pathwayStats' + search;
	const response = await fetch(url);
	const stats = await response.json();
	return stats;
}

export async function pathwayCarbon(search: string) {
	// TODO: send data instead of search string?
	// TODO: update search with default choices
	const url = 'http://127.0.0.1:5000/pathwayCarbon' + search;
	const response = await fetch(url);
	const effortSharingData = await response.json();
	return effortSharingData;
}

export async function historicalCarbon(
	region = 'WORLD',
	start = 1990,
	end = 2021
): Promise<CertainTime[]> {
	const url = `http://127.0.0.1:5000/historicalCarbon/${region}?start=${start}&end=${end}`;
	const response = await fetch(url);
	const histCO2 = await response.json();
	return histCO2;
}

export async function populationOverTime(
	region: string,
	start = 1850,
	end = 2100,
	Scenario = 'SSP2'
): Promise<CertainTime[]> {
	const url = `http://127.0.0.1:5000/populationOverTime/${region}?start=${start}&end=${end}`;
	const response = await fetch(url);
	const population = await response.json();
	return population;
}

export async function gdpOverTime(
	region: string,
	start = 1850,
	end = 2100,
	Scenario = 'SSP2'
): Promise<CertainTime[]> {
	const url = `http://127.0.0.1:5000/gdpOverTime/${region}?start=${start}&end=${end}`;
	const response = await fetch(url);
	const gdp = await response.json();
	return gdp;
}

export async function listRegions(): Promise<string[]> {
	const url = `http://127.0.0.1:5000/regions`;
	const response = await fetch(url);
	const regions = await response.json();
	return regions;
}

export function fullCenturyBudgetSpatial(
	pathwayQuery: PathWayQuery,
	effortSharing: keyof typeof principles,
	Scenario = 'SSP2',
	Convergence_year = 2040
): SpatialMetric[] {
	let selection: DataArraySelection = {};
	const pathwaySelection = {
		Temperature: pathwayQuery.temperature,
		Risk: pathwayQuery.exceedanceRisk,
		NegEmis: pathwayQuery.negativeEmissions,
		NonCO2: pathwayQuery.nonCO2Mitigation
	};
	if (effortSharing === 'GF') {
		selection = {
			...pathwaySelection
		};
	} else if (
		effortSharing === 'PC' ||
		effortSharing === 'AP' ||
		effortSharing === 'GDR' ||
		effortSharing === 'ECPC'
	) {
		selection = {
			...pathwaySelection,
			Scenario
		};
	} else if (effortSharing === 'PCC') {
		selection = {
			...pathwaySelection,
			Convergence_year,
			Scenario
		};
	} else {
		throw new Error(`Effort sharing principle ${effortSharing} not found`);
	}
	let df = dsMap.get(effortSharing).sel.callKwargs(selection).to_pandas();
	// Taking mean over TrajUnc dimension
	// TODO should we pin TrajUnc to a specific value? Or take max or min?
	df = df.agg.callKwargs({ func: 'mean', axis: 1 });
	// Index is called Region and column is unnamed
	df.index.rename('ISO', true);
	df = df.reset_index();
	df.set('value', df.pop(0));
	const values = df.to_dict.callKwargs({ orient: 'records' }).toJs(toJsOpts) as {
		ISO: string;
		value: number;
	}[];
	return values;
}

export function fullCenturyBudgetSingleRegion(
	Region: string,
	pathwayQuery: PathWayQuery,
	effortSharing: keyof typeof principles,
	Scenario = 'SSP2',
	Convergence_year = 2040
): TemnporalMetric[] {
	const Time = slice(pyodide, 2021, 2100);
	let selection: DataArraySelection = {};
	const pathwaySelection = {
		Temperature: pathwayQuery.temperature,
		Risk_of_exceedance: pathwayQuery.exceedanceRisk,
		Negative_emissions: pathwayQuery.negativeEmissions,
		Non_CO2_mitigation_potential: pathwayQuery.nonCO2Mitigation
	};
	if (effortSharing === 'GF') {
		selection = {
			...pathwaySelection,
			Region,
			Time
		};
	} else if (effortSharing === 'PC' || effortSharing === 'AP' || effortSharing === 'GDR') {
		selection = {
			...pathwaySelection,
			Scenario,
			Region,
			Time
		};
	} else if (effortSharing === 'PCC') {
		selection = {
			...pathwaySelection,
			Convergence_year,
			Scenario,
			Region,
			Time
		};
	} else if (effortSharing === 'ECPC') {
		selection = {
			Scenario,
			Region
		};
		// TODO Handle single value instead of array over time
	} else {
		throw new Error(`Effort sharing principle ${effortSharing} not found`);
	}
	let df = dsGlobal.get(effortSharing).sel.callKwargs(selection).to_pandas();
	df = df.reset_index();
	df.set('value', df.pop(0));
	return df.to_dict.callKwargs({ orient: 'records' }).toJs(toJsOpts) as {
		Time: number;
		value: number;
	}[];
}

const policyMap = {
	current: 'CurPol',
	ndc: 'NDC',
	netzero: 'NetZero'
} as const;

function policyPathway(policy: keyof typeof policyMap, Region: string) {
	// Calculate mean, min and max over all models
	const Time = slice(pyodide, 2021, 2100 + 1);
	const policy_ds = dsRef
		.get(policyMap[policy])
		.sel.callKwargs({ Region, Time })
		.drop('Region')
		.groupby('Time');
	const xr = pyodide.pyimport('xarray');
	// TODO precompute mean, min and max
	// instead of calculating them on the fly each time
	const df = xr
		.merge([
			policy_ds.mean(['Model']).rename('mean'),
			policy_ds.min(['Model']).rename('min'),
			policy_ds.max(['Model']).rename('max')
		])
		.to_pandas();
	df.index.rename('time', true);
	return df.reset_index().to_dict.callKwargs({ orient: 'records' }).toJs(toJsOpts) as {
		time: number;
		mean: number;
		min: number;
		max: number;
	}[];
}

export function currentPolicy(Region = 'WORLD') {
	return policyPathway('current', Region);
}

export function ndc(Region = 'WORLD') {
	return policyPathway('ndc', Region);
}

export function netzero(Region = 'WORLD') {
	return policyPathway('netzero', Region);
}

export function ambitionGap(query: PathWayQuery, Time = 2030) {
	const pathwaySelection = {
		Temperature: query.temperature,
		Risk: query.exceedanceRisk,
		NegEmis: query.negativeEmissions,
		NonCO2: query.nonCO2Mitigation
	};
	const pathway = dsGlobal.CO2_globe.sel
		.callKwargs({
			...pathwaySelection,
			Time
		})
		.mean()
		.values.tolist() as number;
	const averagePolicy = dsRef.NDC.sel
		.callKwargs({
			Region: 'WORLD',
			Time
		})
		.mean()
		.values.tolist() as number;
	return averagePolicy - pathway;
}

export function emissionGap(query: PathWayQuery, Time = 2030) {
	const pathwaySelection = {
		Temperature: query.temperature,
		Risk: query.exceedanceRisk,
		NegEmis: query.negativeEmissions,
		NonCO2: query.nonCO2Mitigation
	};
	const pathway = dsGlobal.CO2_globe.sel
		.callKwargs({
			...pathwaySelection,
			Time
		})
		.mean()
		.values.tolist() as number;
	const averagePolicy = dsRef.CurPol.sel
		.callKwargs({
			Region: 'WORLD',
			Time
		})
		.mean()
		.values.tolist() as number;
	return averagePolicy - pathway;
}
