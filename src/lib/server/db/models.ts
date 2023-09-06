import { principles } from '$lib/principles';
import { ds, pyodide } from './data';
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
	return ds.coords.Temperature.values as string[];
}

function exceedanceRisks() {
	return ds.coords.Risk_of_exceedance.values as string[];
}

function nonCO2Mitigations() {
	return ds.coords.Non_CO2_mitigation_potential.values as string[];
}

function negativeEmissions() {
	return ds.coords.Negative_emissions.values as string[];
}

export function pathwayStats(query: PathWayQuery): PathwayStats {
	// TODO check number, now returns 2171597.23 while we expect 3500Gt
	// ds.CO2_hist.sel(Region='WORLD')
	const used: number = ds.CO2_hist.sel.callKwargs({ Region: 'WORLD' }).sum().tolist().toJs()[0];

	const remaining: number = ds.CO2_globe.sel
		.callKwargs({
			Temperature: query.temperature,
			Risk_of_exceedance: query.exceedanceRisk,
			Negative_emissions: query.negativeEmissions,
			Non_CO2_mitigation_potential: query.nonCO2Mitigation
		})
		.sum()
		.tolist()
		.toJs()[0];

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

function arrays2TimeSeriesArea(time: number[], values: number[], err = 5000) {
	//  TODO get variable errors from additional data arrays
	const toValues = (t: number, i: number) => ({
		time: t,
		mean: values[i],
		min: values[i] - err,
		max: values[i] + err
	});

	return Array.from(time).map(toValues);
}

export function pathwayCarbon(query: PathWayQuery) {
	// ds.CO2_globe.sel(Temperature='1.5 deg', Negative_emissions='Medium',
	//   Non_CO2_mitigation_potential='Medium', Risk_of_exceedance='50%', Time=slice(2021,2100)
	//)
	const Time = slice(pyodide, 2021, 2100);
	const values = ds.CO2_globe.sel
		.callKwargs({
			Temperature: query.temperature,
			Risk_of_exceedance: query.exceedanceRisk,
			Negative_emissions: query.negativeEmissions,
			Non_CO2_mitigation_potential: query.nonCO2Mitigation,
			Time
		})
		.values.tolist()
		.toJs() as number[];
	const years = ds.Time.sel.callKwargs({ Time }).values.tolist().toJs() as number[];

	// TODO remove nans (what to do with them?)
	// TODO also make time indexable (somehow)
	// TODO if no time index provided for .carbon, return all data

	return arrays2TimeSeriesArea(years, values);
}

export function historicalCarbon() {
	const Time = slice(pyodide, 1990, 2021);
	const values = ds.CO2_hist.sel
		.callKwargs({
			Region: 'WORLD',
			Time
		})
		.to_series()
		.to_dict()
		.toJs() as Record<number, number>[];
	return values;
}

export function listFutureYears(): number[] {
	const Time = slice(pyodide, 2021, 2100 + 1);
	return ds.Time.sel.callKwargs(Time).values.tolist().toJs() as number[];
}

export function listRegions(): string[] {
	return ds.Region.values.tolist().toJs() as string[];
}

export function listEffortSharings(): string[] {
	// Each effort sharing princple has its own data variable in the nc file
	// TODO get effort sharing principles from nc file instead of static lookup
	return Array.from(principles.keys());
}

export function effortSharingMap(
	pathwayQuery: PathWayQuery,
	Time: number,
	effortSharing: string,
	Scenario = 'SSP2',
	Convergence_year = 2030
): SpatialMetric[] {
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
			Time
		};
	} else if (effortSharing === 'PC') {
		selection = {
			Scenario,
			...pathwaySelection,
			Time
		};
	} else if (effortSharing === 'PCC') {
		selection = {
			...pathwaySelection,
			Convergence_year,
			Scenario,
			Time
		};
	} else if (effortSharing === 'AP' || effortSharing === 'GDR') {
		selection = {
			...pathwaySelection,
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

	const df = ds
		.get(effortSharing)
		.sel.callKwargs(selection)
		.to_pandas()
	// Index is called Region and column is unnamed
	df.index.rename('ISO', true)
	df.set('value', df.get(0))
	return df.reset_index().to_json.callKwargs({ orient: 'records' }).toJs() as {ISO: string, value: number}[];
}

export function effortSharingRegion(
	Region: string,
	pathwayQuery: PathWayQuery,
	effortSharing: string,
	Scenario = 'SSP2',
	Convergence_year = 2030
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
	} else if (effortSharing === 'PC') {
		selection = {
			Scenario,
			...pathwaySelection,
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
	} else if (effortSharing === 'AP' || effortSharing === 'GDR') {
		selection = {
			...pathwaySelection,
			Scenario,
			Region,
			Time
		};
	} else if (effortSharing === 'ECPC') {
		selection = {
			Scenario
		};
		// TODO Handle single value instead of array over time
	} else {
		throw new Error(`Effort sharing principle ${effortSharing} not found`);
	}
	const df = ds.get(effortSharing).sel.callKwargs(selection).to_pandas()
	df.set('value', df.get(0))
	return df.reset_index().to_json.callKwargs({ orient: 'records' }).toJs() as {Time: number, value: number}[];
}

const policyMap = {
	current: 'CurPol',
	ndc: 'NDC',
	netzero: 'NetZero'
} as const;

function policyPathway(policy: keyof typeof policyMap, Region: string) {
	// TODO calculate meean, min and max over all models
	// tricky because sel() returns a 1d array with Time and Model as coords
	const Time = new InclusiveSlice(2021, 2100);
	const modelValues = ds.data_vars[policyMap[policy]].sel({ Region, Time });

	const years = ds.coords.Time.sel(Time) as number[];
	const models = ds.coords.Model.values as string[];
	// TODO figure out which dimemsions sel returns
	const values = reshape(modelValues, [models.length, years.length]);

	return {
		time: years,
		...describe(values)
	};
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
		Risk_of_exceedance: query.exceedanceRisk,
		Negative_emissions: query.negativeEmissions,
		Non_CO2_mitigation_potential: query.nonCO2Mitigation
	};
	const pathway = ds.data_vars.CO2_globe.sel({
		...pathwaySelection,
		Time
	});
	const policy = ds.data_vars.CurPol.sel({
		Region: 'WORLD',
		Time
	}).filter((d) => !Number.isNaN(d));
	const averagePolicy = policy.reduce((a, b) => a + b, 0) / policy.length;
	return averagePolicy - pathway[0];
}

export function emissionGap(query: PathWayQuery, Time = 2030) {
	const pathwaySelection = {
		Temperature: query.temperature,
		Risk_of_exceedance: query.exceedanceRisk,
		Negative_emissions: query.negativeEmissions,
		Non_CO2_mitigation_potential: query.nonCO2Mitigation
	};
	const pathway = ds.data_vars.CO2_globe.sel({
		...pathwaySelection,
		Time
	});
	const policy = ds.data_vars.NDC.sel({
		Region: 'WORLD',
		Time
	}).filter((d) => !Number.isNaN(d));
	const averagePolicy = policy.reduce((a, b) => a + b, 0) / policy.length;
	return averagePolicy - pathway[0];
}
