export const warmingChoices = ['1.5', '2'] as const;
export type Warming = (typeof warmingChoices)[number];
export const probabilityChoices = ['50', '67'] as const;
export type Probability = (typeof probabilityChoices)[number];
export const nonCO2MitigationChoices = ['low', 'medium', 'high'] as const;
export type NonCO2Mitigation = (typeof nonCO2MitigationChoices)[number];
export const negativeEmissionsChoices = ['low', 'medium', 'high'] as const;
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

interface GlobalBudget extends GlobalBudgetQuery, GlobalBudgetResult {}

/**
 * The total budget of CO2 in the world from 1860 - 2100 in Gt CO2.
 *
 */
const co2_budget: GlobalBudget[] = [
	{
		warming: '1.5',
		probability: '50',
		nonCO2Mitigation: 'low',
		negativeEmissions: 'low',
		total: 3000,
		used: 2500,
		remaining: 500
	},
	{
		warming: '2',
		probability: '50',
		nonCO2Mitigation: 'low',
		negativeEmissions: 'low',
		total: 4000,
		used: 2500,
		remaining: 1500
	}
];

export function globalBudget(query: GlobalBudgetQuery): GlobalBudgetResult {
	// TODO validate args
	let result = co2_budget.find(
		(b) =>
			b.warming === query.warming &&
			b.probability === query.probability &&
			b.nonCO2Mitigation === query.nonCO2Mitigation &&
			b.negativeEmissions === query.negativeEmissions
	);
	if (!result) {
		result = co2_budget[0];
	}
	return {
		total: result.total,
		used: result.used,
		remaining: result.remaining
	};
}
