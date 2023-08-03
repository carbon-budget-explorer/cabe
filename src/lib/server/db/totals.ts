import { readFile } from 'fs/promises';

import { NetCDFReader } from 'netcdfjs';
import { getStringVariable, getVariableDimensions } from './utils';

export const open_totals = async (path: string) => {
	const data = await readFile(path);
	const reader = new NetCDFReader(data);
	return new Totals(reader);
};

export class Totals {
	constructor(private reader: NetCDFReader) {}

	temperatures() {
		const variable = 'Temperature';
		const file = this.reader;
		// TODO remove ' deg' in xr_total.nc
		return getStringVariable(file, variable).map((v) => v.replace(' deg', ''));
	}

	regions() {
		const variable = 'Region';
		const file = this.reader;
		return getStringVariable(file, variable);
	}

	times() {
		const variable = 'Time';
		const file = this.reader;
		return file.getDataVariable(variable);
	}

	effortSharings() {
		const variable = 'EffortSharing';
		const file = this.reader;
		return getStringVariable(file, variable);
	}

	scenarios() {
		const variable = 'Scenario';
		const file = this.reader;
		return getStringVariable(file, variable);
	}

	converganceYears() {
		const variable = 'Convergence_year';
		const file = this.reader;
		return file.getDataVariable(variable);
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
		console.time('get data')
		const var_ = this.reader.getDataVariable(variable);
		const var_dims = Object.fromEntries(
			getVariableDimensions(this.reader, variable).map((d) => [d.name, d.size])
		);

		// console.log(var_);
		console.log(var_dims);

		const temperatureIndex2 = this.temperatures().indexOf(temperature);
		const regionIndex2 = this.regions().indexOf(region);
		const effortSharingIndex2 = this.effortSharings().indexOf(effortSharing);
		const scenarioIndex2 = this.scenarios().indexOf(scenario);
		const converganceYearIndex2 = this.converganceYears().indexOf(converganceYear);
		const startTimeIndex = this.times().indexOf(startyear);
		const endTimeIndex = this.times().indexOf(endyear);
		console.log({
			temperature,
			temperatureIndex2,
			regionIndex2,
			effortSharingIndex2,
			scenarioIndex2,
			converganceYearIndex2,
			startTimeIndex,
			endTimeIndex,

		})

		const values = [];
		console.timeStamp('start loop')
		let flatIndex = 0;
		// TODO use less loops
		for (let temperatureIndex = 0; temperatureIndex < var_dims.Temperature; temperatureIndex++) {
			for (let timeIndex = 0; timeIndex < var_dims.Time; timeIndex++) {
				for (let regionIndex = 0; regionIndex < var_dims.Region; regionIndex++) {
					for (let effortSharingIndex = 0; effortSharingIndex < var_dims.EffortSharing; effortSharingIndex++) {
						for (let scenarioIndex = 0; scenarioIndex < var_dims.Scenario; scenarioIndex++) {
							for (let converganceYearIndex = 0; converganceYearIndex < var_dims.Convergence_year; converganceYearIndex++) {
								if (temperatureIndex === temperatureIndex2 &&
									timeIndex >= startTimeIndex && timeIndex <= endTimeIndex &&
									regionIndex ===regionIndex2 &&
									effortSharingIndex === effortSharingIndex2 &&
									scenarioIndex === scenarioIndex2 &&
									converganceYearIndex === converganceYearIndex2) {
										const value = var_[flatIndex];
										values.push(value); 
								}
								flatIndex++;
							}
						}
					}
				}
			}
		}				
		console.log(flatIndex)
		console.log({values});				
		console.timeEnd('get data')
		return values
	}

	// isos() {
	// 	const variable = 'ISO';
	// 	const file = this.reader;
	// 	return getStringVariable(file, variable);
	// }

	// years() {
	// 	return this.reader.getDataVariable('Time');
	// }

	// /**
	//  * Variables with ISO and Time dimensions
	//  */
	// variables() {
	// 	const variables = this.reader.variables;
	// 	// only return variables with ISO and Time dimensions
	// 	const dimNames = this.reader.dimensions.map((d) => d.name);
	// 	const dimIndexes = new Set([dimNames.indexOf('ISO'), dimNames.indexOf('Time')]);
	// 	// TODO add labels in variable attribute as variable might not be human friendly
	// 	return variables
	// 		.filter(
	// 			(v) =>
	// 				v.dimensions.every((d) => dimIndexes.has(d)) && v.dimensions.length === dimIndexes.size
	// 		)
	// 		.map((v) => v.name);
	// }

	// global(variable: string, year: number) {
	// 	const var_ = this.reader.getDataVariable(variable);
	// 	const var_dims = getVariableShape(this.reader, variable);
	// 	const years = this.years();
	// 	const year_index = years.indexOf(year);
	// 	const isos = this.isos();
	// 	const values: SpatialMetric[] = [];
	// 	for (let index = 0; index < isos.length; index++) {
	// 		const value = var_[index * var_dims[1] + year_index];
	// 		values.push({
	// 			ISO: isos[index],
	// 			value
	// 		});
	// 	}
	// 	return values;
	// }

	// region(variable: string, iso: string) {
	// 	const var_ = this.reader.getDataVariable(variable);
	// 	const var_size = getVariableShape(this.reader, variable);
	// 	const isos = this.isos();
	// 	const iso_index = isos.indexOf(iso);
	// 	const start = var_size[1] * iso_index;
	// 	const end = start + var_size[1];
	// 	const values = var_.slice(start, end);
	// 	const years = this.years();
	// 	return Array.from(values)
	// 		.map((value, i) => {
	// 			return {
	// 				Time: years[i],
	// 				value
	// 			};
	// 		})
	// 		.filter((v) => !Number.isNaN(v.value));
	// }
}
