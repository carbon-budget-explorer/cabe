
import { principles } from '$lib/principles';
import { ds } from './data';
import type { SpatialMetric } from './utils';
import { InclusiveSlice, type DataArraySelection } from './xarray';

export const warmingChoices = ds.coords.Temperature.values as string[]
export type Warming = (typeof warmingChoices)[number];
export const probabilityChoices = ['50%', '67%'] as const;
export type Probability = (typeof probabilityChoices)[number];
export const nonCO2MitigationChoices = ['Low', 'Medium', 'High'] as const;
export type NonCO2Mitigation = (typeof nonCO2MitigationChoices)[number];
export const negativeEmissionsChoices = ['Low', 'Medium', 'High'] as const;
export type NegativeEmissions = (typeof negativeEmissionsChoices)[number];

// console.log(totals2.coords['Temperature'].values);
// console.log(totals2.coords['Temperature'].values);
// console.log(totals2.coords['Temperature'].shape);

// console.log(totals2.coords['Temperature'].isel());
// console.log(totals2.coords['Temperature'].isel(0));
// console.log(totals2.coords['Temperature'].isel(2));
// console.log(totals2.coords['Temperature'].isel([0, 2]));
// console.log(totals2.coords['Temperature'].isel(new Slice(1, 3)));
// console.log(totals2.coords['Temperature'].isel(new Slice(0, 1)));
// console.log(totals2.coords['Temperature'].isel(new Slice(1, undefined)));

// console.log(totals2.coords['Time'].isel());
// console.log(totals2.coords['Time'].isel(0));
// console.log(totals2.coords['Time'].isel(0, 5));
// console.log(totals2.coords['Time'].isel(undefined, 5));

// console.log(totals2.coords['Time'].sel());
// console.log(totals2.coords['Time'].sel(1950));
// console.log(totals2.coords['Time'].sel(new Slice(2070, 2075)));
// console.log(totals2.coords['Time'].sel([2030,2100]));

// console.log(totals2.coords['Time'].sel(0, 10)); // error!

// console.log(
// 	totals2.data_vars['GDP'].sel({
// 		Scenario: 'SSP2',
// 		Region: 'NLD',
// 		Time: 2100
// 	})
// );

// console.log(
// 	totals2.data_vars['GDP'].sel({
// 		Scenario: 'SSP2',
// 		Region: 'NLD',
// 		Time: new InclusiveSlice(2020, 2100)
// 	})
// );
/*
With python
v =  ds.GDP.sel(Scenario='SSP2', Region='NLD', Time=slice(2020,2100)).values
len(v)
81
JS returns 81
*/

// console.log(totals2.data_vars['GDP'].sel({
// 	Scenario: 'SSP2',
// 	Region: ['NLD', 'USA'],
// }))
// const used = ds.data_vars.CO2_hist.sel({Region: 'WORLD'})
// console.log(used)


export interface GlobalBudgetQuery {
	warming: Warming;
	probability: Probability;
	nonCO2Mitigation: NonCO2Mitigation;
	negativeEmissions: NegativeEmissions;
}

export interface CarbonTotalResult {
	total: number;
	used: number;
	remaining: number;
}

function carbonTotal(query: GlobalBudgetQuery): CarbonTotalResult {
	// TODO check number, now returns 1751597.23 while we expect 3500Gt
	const used = ds.data_vars.CO2_hist.sel({ Region: 'WORLD' })
		.filter((d) => !Number.isNaN(d))
		.reduce((a, b) => a + b, 0);

	const remaining = ds.data_vars.CO2_globe.sel({
		Temperature: '1.5 deg',
		Risk_of_exceedance: '50%',
		Negative_emissions: 'Medium',
		Non_CO2_mitigation_potential: 'Medium',
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

function arrays2TimeSeriesArea(time: number[], values: number[], err = 5000): TimeSeriesValue[] {
	//  TODO get variable errors from additional data arrays
	const toValues = (t: number, i: number) => ({
		time: t,
		mean: values[i],
		min: values[i] - err,
		max: values[i] + err
	});

	return Array.from(time).map(toValues);
}

function carbonTimeSeries(query: GlobalBudgetQuery): TimeSeries {
	const Time =  new InclusiveSlice(2021,2100);
	const values = ds.data_vars.CO2_globe.sel({
		Temperature: '1.5 deg',
		Risk_of_exceedance: '50%',
		Negative_emissions: 'Medium',
		Non_CO2_mitigation_potential: 'Medium',
		Time
	})
	const years = ds.coords.Time.sel(Time) as number[]

	// TODO remove nans (what to do with them?)
	// TODO also make time indexable (somehow)
	// TODO if no time index provided for .carbon, return all data

	return {
		name: 'carbon emissions',
		values: arrays2TimeSeriesArea(years, values)
	};
}

// function currentPolicyTimeSeries(): TimeSeries {
//
// }

export interface GlobalGudgetResult {
	carbonTS: TimeSeries;
	carbonTotal: CarbonTotalResult;
	historicalCarbon: TimeSeries
}

export function globalBudget(query: GlobalBudgetQuery): GlobalGudgetResult {
	// TODO validate args
	return {
		carbonTS: carbonTimeSeries(query),
		// currentPolicyTS: temperatureTimeSeries(query),
		carbonTotal: carbonTotal(query),
		historicalCarbon: historicalCarbon(),
	};
}
function historicalCarbon(): TimeSeries {
	const Time = new InclusiveSlice(1990,2020)
	const values = ds.data_vars.CO2_hist.sel({
		Region: 'WORLD',
		Time,
	})
	const years = ds.coords.Time.sel(Time) as number[]
	return {
		name: 'historical carbon emissions',
		values: arrays2TimeSeriesArea(years, values)
	};
}

export function listFutureYears(): number[] {
	return ds.coords.Time.sel(new InclusiveSlice(2021,2100)) as number[]
}

export function listRegions(): string[] {
	return ds.coords.Region.values as string[]
}

export function listEffortSharings(): string[] {
	// Each effort sharing princple has its own data variable in the nc file
	// TODO get effort sharing principles from nc file instead of static lookup
	return Array.from(principles.keys());
}

export function carbonMap(budgetQuery: GlobalBudgetQuery, year: number, effortSharing: string,
	scenario='SSP2',
	converganceYear = 2030): SpatialMetric[] {
	let selection: DataArraySelection = {
		Scenario: scenario,
	}
	const budgetSelection = {
		Temperature: budgetQuery.warming,
		Risk_of_exceedance: budgetQuery.probability,
		Negative_emissions: budgetQuery.negativeEmissions,
		Non_CO2_mitigation_potential: budgetQuery.nonCO2Mitigation,
	}
	if (effortSharing === 'GF' || effortSharing === 'PC') {
		selection = {
			...selection,
			...budgetSelection,
			Time: year,
		}
	} else if (effortSharing === 'PCC') {
		selection = {
			...selection,
			...budgetSelection,
			Convergence_year: converganceYear,
			Time: year,
		}
	} else if (effortSharing === 'AP' || effortSharing === 'GDR') {
		selection = {
			...selection,
			...budgetSelection,
			Scenario: scenario,
			Time: year,
		}
	} else if (effortSharing === 'ECPC') {
		// No need to add extra selections
	} else {
		throw new Error(`Effort sharing principle ${effortSharing} not found`)
	}

	const values = ds.data_vars[effortSharing].sel(selection)
	const regions = listRegions()
	return Array.from(values).map((d, i) => ({
		ISO: regions[i],
		value: d
	}));
}