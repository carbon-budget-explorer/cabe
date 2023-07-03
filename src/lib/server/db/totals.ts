import { readFile } from 'fs/promises';

import { NetCDFReader } from 'netcdfjs';

import { getStringVariable, getVariableShape, type SpatialMetric } from './utils';

export const open_totals = async (path: string) => {
	const data = await readFile(path);
	const reader = new NetCDFReader(data);
	return new Totals(reader);
};

export class Totals {
	constructor(private reader: NetCDFReader) {}

	isos() {
		const variable = 'ISO';
		const file = this.reader;
		return getStringVariable(file, variable);
	}

	years() {
		return this.reader.getDataVariable('Time');
	}

	/**
	 * Variables with ISO and Time dimensions
	 */
	variables() {
		const variables = this.reader.variables;
		// only return variables with ISO and Time dimensions
		const dimNames = this.reader.dimensions.map((d) => d.name);
		const dimIndexes = new Set([dimNames.indexOf('ISO'), dimNames.indexOf('Time')]);
		// TODO add labels in variable attribute as variable might not be human friendly
		return variables
			.filter(
				(v) =>
					v.dimensions.every((d) => dimIndexes.has(d)) && v.dimensions.length === dimIndexes.size
			)
			.map((v) => v.name);
	}

	global(variable: string, year: number) {
		const var_ = this.reader.getDataVariable(variable);
		const var_dims = getVariableShape(this.reader, variable);
		const years = this.years();
		const year_index = years.indexOf(year);
		const isos = this.isos();
		const values: SpatialMetric[] = [];
		for (let index = 0; index < isos.length; index++) {
			const value = var_[index * var_dims[1] + year_index];
			values.push({
				ISO: isos[index],
				value
			});
		}
		return values;
	}

	region(variable: string, iso: string) {
		const var_ = this.reader.getDataVariable(variable);
		const var_size = getVariableShape(this.reader, variable);
		const isos = this.isos();
		const iso_index = isos.indexOf(iso);
		const start = var_size[1] * iso_index;
		const end = start + var_size[1];
		const values = var_.slice(start, end);
		const years = this.years();
		return Array.from(values)
			.map((value, i) => {
				return {
					Time: years[i],
					value
				};
			})
			.filter((v) => !Number.isNaN(v.value));
	}
}
