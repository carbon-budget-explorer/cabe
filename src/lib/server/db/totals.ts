import { ready, File, Dataset } from 'h5wasm';
export const open_totals = async (path: string) => {
	await ready;
	const reader = new File(path);
	return new Totals(reader);
};

export class Totals {
	constructor(private reader: File) {}

	temperatures() {
		const ds = this.reader.get('Temperature') as Dataset;
		return ds.value as string[];
	}

	regions() {
		const ds = this.reader.get('Region') as Dataset;
		return ds.value as string[];
	}

	times() {
		const ds = this.reader.get('Time') as Dataset;
		return Array.from(ds.value as number[]);
	}

	effortSharings() {
		const ds = this.reader.get('EffortSharing') as Dataset;
		return ds.value as string[];
	}

	scenarios() {
		const ds = this.reader.get('Scenario') as Dataset;
		return ds.value as string[];
	}

	converganceYears() {
		const ds = this.reader.get('Convergence_year') as Dataset;
		return ds.value as number[];
	}

	carbon(
		temperature: string,
		startyear: number,
		endyear: number,
		region = 'WORLD',
		effortSharing = 'None',
		scenario = 'SSP2',
		converganceYear = 2030
	) {
		const variable = 'CO2';
		const ds = this.reader.get(variable) as Dataset;

		const temperatureIndex = this.temperatures().indexOf(temperature);
		const regionIndex = this.regions().indexOf(region);
		const effortSharingIndex = this.effortSharings().indexOf(effortSharing);
		const scenarioIndex = this.scenarios().indexOf(scenario);
		const converganceYearIndex = this.converganceYears().indexOf(converganceYear);
		const startTimeIndex = this.times().indexOf(startyear);
		const endTimeIndex = this.times().indexOf(endyear);

		const indices = [
			[temperatureIndex, temperatureIndex + 1],
			[startTimeIndex, endTimeIndex + 1],
			[regionIndex, regionIndex + 1],
			[effortSharingIndex, effortSharingIndex + 1],
			[scenarioIndex, scenarioIndex + 1],
			[converganceYearIndex, converganceYearIndex + 1]
		];
		const values = ds.slice(indices);
		return values as Float64Array;
	}

	region(variable: string, region: string) {
		// TODO impmlement
		return [];
	}

	variables() {
		/// TODO implement
		return [];
	}

	global(variable: string, time: number) {
		/// TODO implement
		return [];
	}
}
