import { principles } from '$lib/principles';
import { ds } from './data';
import type { SpatialMetric, TemnporalMetric } from './utils';
import { InclusiveSlice, type DataArraySelection } from './xarray';

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
	const used = ds.data_vars.CO2_hist.sel({ Region: 'WORLD' })
		.filter((d) => !Number.isNaN(d))
		.reduce((a, b) => a + b, 0);

	const remaining = ds.data_vars.CO2_globe.sel({
		Temperature: query.temperature,
		Risk_of_exceedance: query.exceedanceRisk,
		Negative_emissions: query.negativeEmissions,
		Non_CO2_mitigation_potential: query.nonCO2Mitigation
	})
		.filter((d) => !Number.isNaN(d))
		.reduce((a, b) => a + b, 0);

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
	const Time = new InclusiveSlice(2021, 2100);
	const values = ds.data_vars.CO2_globe.sel({
		Temperature: query.temperature,
		Risk_of_exceedance: query.exceedanceRisk,
		Negative_emissions: query.negativeEmissions,
		Non_CO2_mitigation_potential: query.nonCO2Mitigation,
		Time
	});
	const years = ds.coords.Time.sel(Time) as number[];

	// TODO remove nans (what to do with them?)
	// TODO also make time indexable (somehow)
	// TODO if no time index provided for .carbon, return all data

	return arrays2TimeSeriesArea(years, values);
}

export function historicalCarbon() {
	const Time = new InclusiveSlice(1990, 2021);
	const values = ds.data_vars.CO2_hist.sel({
		Region: 'WORLD',
		Time
	});
	const years = ds.coords.Time.sel(Time) as number[];
	return values.map((value, i) => ({
		time: years[i],
		value
	}));
}

export function listFutureYears(): number[] {
	return ds.coords.Time.sel(new InclusiveSlice(2021, 2100)) as number[];
}

export function listRegions(): string[] {
	return ds.coords.Region.values as string[];
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

	const values = ds.data_vars[effortSharing].sel(selection);
	const regions = listRegions();
	return Array.from(values).map((d, i) => ({
		ISO: regions[i],
		value: d
	}));
}

export function effortSharingRegion(
	Region: string,
	pathwayQuery: PathWayQuery,
	effortSharing: string,
	Scenario = 'SSP2',
	Convergence_year = 2030
): TemnporalMetric[] {
	const Time = new InclusiveSlice(2021, 2100);
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
	const values = ds.data_vars[effortSharing].sel(selection);
	const years = ds.coords.Time.sel(Time) as number[];
	return Array.from(values).map((value, i) => ({
		Time: years[i],
		value
	}));
}

const policyMap = {
	current: 'CurPol',
	ndc: 'NDC',
	netzero: 'NetZero'
} as const;

function policyPathway(policy: keyof typeof policyMap, Region: string, Model = 'IMAGE 3.2') {
	// TODO calculate meean, min and max over all models
	// tricky because sel() returns a 1d array with Time and Model as coords
	const Time = new InclusiveSlice(2021, 2100);
	const values = ds.data_vars[policyMap[policy]].sel({ Model, Region, Time });
	const years = ds.coords.Time.sel(Time) as number[];
	return values.map((value, i) => ({
		time: years[i],
		value
	}));
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
