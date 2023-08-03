export const warmingChoices = ['1.5', '2'] as const;
export type Warming = (typeof warmingChoices)[number];
export const probabilityChoices = ['50', '67'] as const;
export type Probability = (typeof probabilityChoices)[number];
export const nonCO2MitigationChoices = ['low', 'medium', 'high'] as const;
const nonCO2MitigationValues = [0, 10, 20] as const;
export type NonCO2Mitigation = (typeof nonCO2MitigationChoices)[number];
export const negativeEmissionsChoices = ['low', 'medium', 'high'] as const;
const negativeEmissionsValues = [0, 10, 20] as const;
export type NegativeEmissions = (typeof negativeEmissionsChoices)[number];

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
	const t = parseFloat(query.warming);
	const p = parseFloat(query.probability);
	const non = nonCO2MitigationValues[nonCO2MitigationChoices.indexOf(query.nonCO2Mitigation)];
	const neg = negativeEmissionsValues[negativeEmissionsChoices.indexOf(query.negativeEmissions)];

	const total = 6000 * (1 + t / 10) * (p / 100) * (1 - non / 100) * (1 + neg / 100);
	const used = 2500;
	const remaining = total - used;

	const result = {
		total,
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

function carbonTimeSeries(query: GlobalBudgetQuery): TimeSeries {
	return {
		name: 'carbon emissions',
		values: [
			{ time: 2000, mean: 65, min: 55, max: 68 },
			{ time: 2005, mean: 54, min: 49, max: 58 },
			{ time: 2011, mean: 51, min: 48, max: 56 },
			{ time: 2016, mean: 24, min: 22, max: 29 },
			{ time: 2022, mean: 20, min: 12, max: 27 },
			{ time: 2027, mean: 25, min: 18, max: 30 },
			{ time: 2033, mean: 22, min: 15, max: 26 },
			{ time: 2038, mean: 15, min: 14, max: 18 },
			{ time: 2044, mean: 1, min: -5, max: 8 },
			{ time: 2050, mean: 18, min: 12, max: 22 }
		]
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
