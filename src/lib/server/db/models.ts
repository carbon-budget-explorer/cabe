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
	end = 2100
	// Scenario = 'SSP2'
): Promise<CertainTime[]> {
	const url = `http://127.0.0.1:5000/populationOverTime/${region}?start=${start}&end=${end}`;
	const response = await fetch(url);
	const population = await response.json();
	return population;
}

export async function gdpOverTime(
	region: string,
	start = 1850,
	end = 2100
	// Scenario = 'SSP2'
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

export async function fullCenturyBudgetSpatial(
	search: string
	// effortSharing: keyof typeof principles
	// Scenario = 'SSP2',
	// Convergence_year = 2040
): Promise<SpatialMetric[]> {
	const url = `http://127.0.0.1:5000/fullCenturyBudgetSpatial${search}`;
	const response = await fetch(url);
	const values = await response.json();
	return values;
}

async function policyPathway(policy: string, Region: string): Promise<UncertainTime[]> {
	const url = `http://127.0.0.1:5000/policyPathway/${policy}/${Region}`;
	const response = await fetch(url);
	const values = await response.json();
	return values;
}

export async function currentPolicy(Region = 'WORLD'): Promise<UncertainTime[]> {
	return await policyPathway('CurPol', Region);
}

export async function ndc(Region = 'WORLD'): Promise<UncertainTime[]> {
	return await policyPathway('NDC', Region);
}

export async function netzero(Region = 'WORLD'): Promise<UncertainTime[]> {
	return await policyPathway('NetZero', Region);
}
