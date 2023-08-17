
import { ds } from './data';
import { ExclusiveSlice, InclusiveSlice } from './xarray';

export const warmingChoices = ds.coords.Temperature.values as string[]
export type Warming = (typeof warmingChoices)[number];
export const probabilityChoices = ['50', '67'] as const;
export type Probability = (typeof probabilityChoices)[number];
export const nonCO2MitigationChoices = ['low', 'medium', 'high'] as const;
const nonCO2MitigationValues = [0, 10, 20] as const;
export type NonCO2Mitigation = (typeof nonCO2MitigationChoices)[number];
export const negativeEmissionsChoices = ['low', 'medium', 'high'] as const;
const negativeEmissionsValues = [0, 10, 20] as const;
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

function temperatureTimeSeries(query: GlobalBudgetQuery): TimeSeries {
	return {
		name: 'temperature',
		values: [
			{ time: 2000, mean: 61, min: 60, max: 64 },
			{ time: 2005, mean: 56, min: 51, max: 58 },
			{ time: 2011, mean: 40, min: 31, max: 43 },
			{ time: 2016, mean: 29, min: 24, max: 30 },
			{ time: 2022, mean: 19, min: 9, max: 25 },
			{ time: 2027, mean: 13, min: 8, max: 13 },
			{ time: 2033, mean: 19, min: 12, max: 26 },
			{ time: 2038, mean: 24, min: 16, max: 25 },
			{ time: 2044, mean: 11, min: 4, max: 14 },
			{ time: 2050, mean: -10, min: -12, max: -1 }
		]
	};
}

function arrays2TimeSeries(time: number[], values: number[], err = 5000): TimeSeriesValue[] {
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
		values: arrays2TimeSeries(years, values)
	};
}

// function currentPolicyTimeSeries(): TimeSeries {
//
// }

export interface GlobalGudgetResult {
	carbonTS: TimeSeries;
	temperatureTS: TimeSeries;
	carbonTotal: CarbonTotalResult;
}

export function globalBudget(query: GlobalBudgetQuery): GlobalGudgetResult {
	// TODO validate args
	return {
		carbonTS: carbonTimeSeries(query),
		temperatureTS: temperatureTimeSeries(query),
		// currentPolicyTS: temperatureTimeSeries(query),
		carbonTotal: carbonTotal(query)
	};
}
