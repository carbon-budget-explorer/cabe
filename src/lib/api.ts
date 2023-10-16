import { principles } from '$lib/principles';
import { browser } from '$app/environment';

export interface SpatialMetric {
	ISO: string;
	value: number;
}

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
	const temperature =
		searchParams.get('temperature') ??
		choices.temperature[Math.floor(choices.temperature.length / 2)];
	const exceedanceRisk =
		searchParams.get('exceedanceRisk') ??
		choices.exceedanceRisk[Math.floor(choices.exceedanceRisk.length / 2)];
	// TODO when more choices are available use Medium==1 as default
	const nonCO2Mitigation =
		searchParams.get('nonCO2Mitigation') ??
		choices.nonCO2Mitigation[Math.floor(choices.nonCO2Mitigation.length / 2)];
	const negativeEmissions =
		searchParams.get('negativeEmissions') ??
		choices.negativeEmissions[Math.floor(choices.negativeEmissions.length / 2)];
	return {
		temperature,
		exceedanceRisk,
		nonCO2Mitigation,
		negativeEmissions
	};
}

export const API_URL = 'http://127.0.0.1:5000';

async function getJSON(path: string, myfetch = fetch) {
	let url = `${API_URL}/${path}`;
	if (browser) {
		url = `/api/${path}`;
	}
	console.time(url);
	const response = await myfetch(url);
	if (!response.ok) {
		console.error(url);
		throw new Error(response.statusText);
	}
	const data = await response.json();
	console.timeEnd(url);
	return data;
}

export async function pathwayChoices(): Promise<Record<keyof PathWayQuery, string[]>> {
	const path = '/pathwayChoices';
	return getJSON(path);
}

export async function pathwayStats(search: string): Promise<PathwayStats> {
	const path = `/pathwayStats${search}`;
	return getJSON(path);
}

export async function pathwayCarbon(search: string): Promise<UncertainTime[]> {
	// TODO: send data instead of search string?
	// TODO: update search with default choices
	return getJSON(`/pathwayCarbon${search}`);
}

export async function historicalCarbon(
	region = 'WORLD',
	start = 1990,
	end = 2021
): Promise<CertainTime[]> {
	return getJSON(`/historicalCarbon/${region}?start=${start}&end=${end}`);
}

export async function populationOverTime(
	region: string,
	start = 1850,
	end = 2100
	// Scenario = 'SSP2'
): Promise<CertainTime[]> {
	return getJSON(`/populationOverTime/${region}?start=${start}&end=${end}`);
}

export async function gdpOverTime(
	region: string,
	start = 1850,
	end = 2100
	// Scenario = 'SSP2'
): Promise<CertainTime[]> {
	return getJSON(`/gdpOverTime/${region}?start=${start}&end=${end}`);
}

export async function listRegions(): Promise<string[]> {
	return getJSON(`/regions`);
}

export async function fullCenturyBudgetSpatial(
	search: string
	// effortSharing: keyof typeof principles
	// Scenario = 'SSP2',
	// Convergence_year = 2040
): Promise<SpatialMetric[]> {
	return getJSON(`/fullCenturyBudgetSpatial${search}`);
}

async function policyPathway(policy: string, Region: string): Promise<UncertainTime[]> {
	return getJSON(`/policyPathway/${policy}/${Region}`);
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

export async function effortSharing(ISO: string, principle: string, search: string, fetch: any) {
	return getJSON(`/${ISO}/${principle}${search}`, fetch);
}

export async function effortSharings(ISO: string, search: string, fetch: any): Promise<Record<string, UncertainTime[]>> {
	// return getJSON(`/${ISO}/effortSharings${search}`);
	const r: Record<string, any> = {};
	for (const principle of Object.keys(principles)) {
		r[principle] = await effortSharing(ISO, principle, search, fetch);
	}

	return r;
}
