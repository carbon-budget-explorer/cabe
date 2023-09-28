import type { principles } from '$lib/principles';
import { dsGlobal, dsMap, pyodide } from './data';
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

export function pathwayChoices(): Record<keyof PathWayQuery, string[]> {
	return {
		temperature: Temperatures(),
		exceedanceRisk: exceedanceRisks(),
		nonCO2Mitigation: nonCO2Mitigations(),
		negativeEmissions: negativeEmissions()
	};
}

function Temperatures() {
	return dsGlobal.Temperature.values.tolist().toJs() as string[];
}

function exceedanceRisks() {
	return dsGlobal.Risk.values.tolist().toJs() as string[];
}

function nonCO2Mitigations() {
	return dsGlobal.NonCO2.values.tolist().toJs() as string[];
}

function negativeEmissions() {
	return dsGlobal.NegEmis.values.tolist().toJs() as string[];
}

export function pathwayStats(query: PathWayQuery): PathwayStats {
	// TODO check number, now returns 2171597.23 while we expect 3500Gt
	// ds.CO2_hist.sel(Region='WORLD')
	const used: number = dsGlobal.CO2_hist.sel.callKwargs({ Region: 'WORLD' }).sum().values.tolist();

	const remaining: number = dsGlobal.CO2_globe.sel
		.callKwargs({
			Temperature: query.temperature,
			Risk: query.exceedanceRisk,
			NegEmis: query.negativeEmissions,
			NonCO2: query.nonCO2Mitigation
		})
		.sum()
		.values.tolist();
	const total = used + remaining;

	const result = {
		total: total,
		used,
		remaining
	};
	return result;
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

export function pathwayCarbon(query: PathWayQuery, ds = dsGlobal) {
	// ds.CO2_globe.sel(
	// 	Temperature=1.5, Risk=0.2, NegEmis=0.4, NonCO2=0.35, Time=slice(2021, 2100)
	// 	).to_pandas()
	const Time = slice(pyodide, 2021, 2100);
	const df = ds.CO2_globe.sel
		.callKwargs({
			Temperature: query.temperature,
			Risk: query.exceedanceRisk,
			NegEmis: query.negativeEmissions,
			NonCO2: query.nonCO2Mitigation,
			Time
		})
		.rename.callKwargs({ Time: 'time' })
		.to_pandas();
	return df.agg
		.callKwargs({ func: ['min', 'mean', 'max'] })
		.transpose()
		.reset_index()
		.to_dict.callKwargs({ orient: 'records' })
		.toJs(toJsOpts) as UncertainTime[];
}

export function historicalCarbon(region = 'WORLD') {
	const Time = slice(pyodide, 1990, 2021);
	let df = dsGlobal.CO2_hist.sel
		.callKwargs({
			Region: region,
			Time
		})
		.to_pandas();
	df.index.rename('time', true);
	df = df.reset_index();
	df.set('value', df.pop(0));
	const values = df.to_dict.callKwargs({ orient: 'records' }).toJs(toJsOpts) as Record<
		number,
		number
	>[];
	return values;
}

export function listFutureYears(): number[] {
	const Time = slice(pyodide, 2021, 2100 + 1);
	return dsGlobal.Time.sel.callKwargs({ Time }).values.tolist().toJs() as number[];
}

export function listRegions(): string[] {
	return dsGlobal.Region.values.tolist().toJs() as string[];
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
		Risk_of_exceedance: pathwayQuery.exceedanceRisk,
		Negative_emissions: pathwayQuery.negativeEmissions,
		Non_CO2_mitigation_potential: pathwayQuery.nonCO2Mitigation
	};
	const Time = slice(pyodide, 2021, 2100);
	if (effortSharing === 'GF') {
		selection = {
			...pathwaySelection,
			Time
		};
	} else if (effortSharing === 'PC' || effortSharing === 'AP' || effortSharing === 'GDR') {
		selection = {
			...pathwaySelection,
			Scenario,
			Time
		};
	} else if (effortSharing === 'PCC') {
		selection = {
			...pathwaySelection,
			Convergence_year,
			Scenario,
			Time
		};
	} else if (effortSharing === 'ECPC') {
		selection = {
			Scenario
		};
	} else {
		throw new Error(`Effort sharing principle ${effortSharing} not found`);
	}

	let da = dsMap.get(effortSharing).sel.callKwargs(selection);
	if (effortSharing !== 'ECPC') {
		da = da.sum('Time');
	}
	let df = da.to_pandas();
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

export function temperatureAssesment(
	pathwayQuery: PathWayQuery,
	effortSharing: keyof typeof principles,
	Hot_air = 'exclude',
	Ambition = 'high',
	Conditionality = 'conditional',
	Scenario = 'SSP2',
	Convergence_year = 2040
): SpatialMetric[] {
	let selection: DataArraySelection = {};
	const pathwaySelection = {
		Risk_of_exceedance: pathwayQuery.exceedanceRisk,
		Negative_emissions: pathwayQuery.negativeEmissions,
		Non_CO2_mitigation_potential: pathwayQuery.nonCO2Mitigation
	};
	const pinnedSelection = {
		Hot_air,
		Ambition,
		Conditionality
	};
	if (effortSharing === 'GF') {
		selection = {
			...pathwaySelection,
			...pinnedSelection
		};
	} else if (effortSharing === 'PC' || effortSharing === 'AP' || effortSharing === 'GDR') {
		selection = {
			...pathwaySelection,
			Scenario,
			...pinnedSelection
		};
	} else if (effortSharing === 'PCC') {
		selection = {
			...pathwaySelection,
			Convergence_year,
			Scenario,
			...pinnedSelection
		};
	} else if (effortSharing === 'ECPC') {
		selection = {
			Scenario,
			...pinnedSelection
		};
	} else {
		throw new Error(`Effort sharing principle ${effortSharing} not found`);
	}

	let df = dsGlobal
		.get(effortSharing + '_temp')
		.sel.callKwargs(selection)
		.to_pandas();
	df.index.rename('ISO', true);
	df = df.reset_index();
	df.set('value', df.pop(0));
	return df.to_dict.callKwargs({ orient: 'records' }).toJs(toJsOpts);
}

const policyMap = {
	current: 'CurPol',
	ndc: 'NDC',
	netzero: 'NetZero'
} as const;

function policyPathway(policy: keyof typeof policyMap, Region: string) {
	// Calculate mean, min and max over all models
	const Time = slice(pyodide, 2021, 2100 + 1);
	const policy_ds = dsMap
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
		.values.tolist() as number;
	const averagePolicy = dsGlobal.CO2_ndc.sel // TODO revert to CurPol
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
		.values.tolist() as number;
	const averagePolicy = dsGlobal.CO2_ndc.sel // TODO is this correct?
		.callKwargs({
			Region: 'WORLD',
			Time
		})
		.mean()
		.values.tolist() as number;
	return averagePolicy - pathway;
}
