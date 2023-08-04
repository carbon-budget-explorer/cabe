import { ready, File, Dataset } from 'h5wasm';
export const open_totals = async (path: string) => {
	await ready;
	const reader = new File(path);
	return new Totals(reader);
};

export class Totals {
	constructor(private reader: File) {}

	getVariable(name: string){
		// TODO: implement
		return name
	}

	dimensions() {
		const keys = this.reader.keys()
		// TODO verify all keys corresponds to Datasets, i.e. no groups present
		const datasets = keys.map(k => this.reader.get(k) as Dataset)
		const dims = datasets.filter(d => ("CLASS" in d.attrs))
		return dims.map(d => ({
			id: d.get_attribute("_Netcdf4Dimid", true) as number,
			name: d.get_attribute("NAME", true) as string,
			shape: d.shape,
		})).sort((a, b) => a.id - b.id)
	}

	datasets(){
		const keys = this.reader.keys()
		const datasets = keys.map(k => ({name: k, dataset: this.reader.get(k) as Dataset}))
		// TODO verify all keys corresponds to Datasets, i.e. no groups present
		return datasets.map(ds => {
			let dimIds = ds.dataset.get_attribute("_Netcdf4Coordinates", true) as number[]
			let dims = dimIds.map(id => this.dimensions()[id].name)
			return {name: ds.name, dimensions: dims}
		})
	}

	// temp() {
	// 	const keys = this.reader.keys()
	// 	const datasets = keys.map(v => this.reader.get(v))
	// 	datasets.forEach(dataset => {
	// 		let meta = dataset.metadata
	// 		console.log(dataset)
	// 	})
	// 	const ds = this.reader.get('CO2') as Dataset;
	// 	console.log(ds.attrs)
	// 	console.log(ds.get_attribute("_Netcdf4Coordinates"))  // gives the order of the dimensions
	// 	console.log(ds.get_attribute("_Netcdf4Dimid"))
	// 	console.log(ds.get_attribute("DIMENSION_LIST"))
	// 	// console.log(ds.dtype)
	// 	// console.log(ds.filters)
	// 	// console.log(ds.shape)
	// 	// console.log(ds.slice)
	// 	// console.log(ds.to_array)
	// 	// console.log(ds.type)
	// 	// console.log(ds.value)
	// 	console.log('new')
	// 	const ds2 = this.reader.get('Time') as Dataset;
	// 	console.log(ds2.attrs)
	// 	console.log(ds2.get_attribute("CLASS"))
	// 	console.log(ds2.get_attribute("NAME"))
	// 	// console.log(ds2.get_attribute("REFERENCE_LIST"))
	// 	console.log(ds2.get_attribute("_Netcdf4Coordinates"))
	// 	console.log(ds2.get_attribute("_Netcdf4Dimid"))


	// 	console.log(dimensions)
	// 	return 'ready'
	// }

	//
	//
	//
	//
	//

	temperatures() {
		const ds = this.reader.get('Temperature') as Dataset;
		return ds.value as string[];
	}

	regions() {
		const ds = this.reader.get('Region') as Dataset;
		return ds.value as string;
	}

	times() {
		const ds = this.reader.get('Time') as Dataset;
		return ds.value as number[];
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
