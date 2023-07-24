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

export interface GlobalBudgetResult {
	total: number;
	used: number;
	remaining: number;
}

export function globalBudget(query: GlobalBudgetQuery): GlobalBudgetResult {
	// TODO validate args
	const t = parseFloat(query.warming);
	const p = parseFloat(query.probability);
	const non = nonCO2MitigationValues[nonCO2MitigationChoices.indexOf(query.nonCO2Mitigation)];
	const neg = negativeEmissionsValues[negativeEmissionsChoices.indexOf(query.negativeEmissions)];

	const total = 3000 * (1 + t / 10) * (1 - p / 100) * (1 - non / 100) * (1 + neg / 100);
	const used = 2500;
	const remaining = total - used;

	return {
		total,
		used,
		remaining
	};
}
