import { readFile } from 'fs/promises';

import { NetCDFReader } from 'netcdfjs';

import { getStringVariable, getVariableDimensions, type SpatialMetric } from './utils';

export const open_scenarios = async (path: string) => {
	const data = await readFile(path);
	const reader = new NetCDFReader(data);
	return new Scenarios(reader);
};

export class Scenarios {
	constructor(private reader: NetCDFReader) {}

	isos() {
		const variable = 'ISO';
		const file = this.reader;
		return getStringVariable(file, variable);
	}

	years() {
		return this.reader.getDataVariable('Time');
	}

	variables() {
		const variables = this.reader.variables;
		// only return variables with Category, ISO and Time dimensions in any order
		const dimNames = this.reader.dimensions.map((d) => d.name);
		const dimIndexes = new Set([
			dimNames.indexOf('Category'),
			dimNames.indexOf('ISO'),
			dimNames.indexOf('Time')
		]);
		// TODO add labels in variable attribute as variable might not be human friendly
		return variables
			.filter(
				(v) =>
					v.dimensions.every((d) => dimIndexes.has(d)) && v.dimensions.length === dimIndexes.size
			)
			.map((v) => v.name);
	}

	categories() {
		return getStringVariable(this.reader, 'Category');
	}

	global(category: string, variable: string, year: number) {
		const var_ = this.reader.getDataVariable(variable);
		const var_dims = getVariableDimensions(this.reader, variable);
		const isos = this.isos();
		const categories = this.categories();
		const category_index = categories.indexOf(category);
		const years = this.years();
		const year_index = years.indexOf(year);
		const values: SpatialMetric[] = [];
		for (let iso_index = 0; iso_index < isos.length; iso_index++) {
			let index = 0;
			// TODO if time is last dimension use slice instead of looping cells
			if (
				var_dims[0].name === 'ISO' &&
				var_dims[1].name === 'Time' &&
				var_dims[2].name === 'Category'
			) {
				index =
					iso_index * var_dims[1].size * var_dims[2].size +
					year_index * var_dims[2].size +
					category_index;
			} else if (
				var_dims[0].name === 'Category' &&
				var_dims[1].name === 'ISO' &&
				var_dims[2].name === 'Time'
			) {
				index =
					category_index * var_dims[1].size * var_dims[2].size +
					iso_index * var_dims[2].size +
					year_index;
			} else if (
				var_dims[0].name === 'ISO' &&
				var_dims[1].name === 'Category' &&
				var_dims[2].name === 'Time'
			) {
				index =
					iso_index * var_dims[1].size * var_dims[2].size +
					category_index * var_dims[2].size +
					year_index;
			} else {
				throw new Error('Unknown variable dimensions');
			}
			const value = var_[index];
			values.push({
				ISO: isos[iso_index],
				value
			});
		}
		return values;
	}

	region(category: string, variable: string, iso: string) {
		const var_ = this.reader.getDataVariable(variable);
		const var_dims = getVariableDimensions(this.reader, variable);
		const isos = this.isos();
		const iso_index = isos.indexOf(iso);
		const categories = this.categories();
		const category_index = categories.indexOf(category);
		const years = this.years();
		const values = [];
		for (let year_index = 0; year_index < years.length; year_index++) {
			let index = 0;
			if (
				var_dims[0].name === 'ISO' &&
				var_dims[1].name === 'Time' &&
				var_dims[2].name === 'Category'
			) {
				index =
					iso_index * var_dims[1].size * var_dims[2].size +
					year_index * var_dims[2].size +
					category_index;
			} else if (
				var_dims[0].name === 'Category' &&
				var_dims[1].name === 'ISO' &&
				var_dims[2].name === 'Time'
			) {
				index =
					category_index * var_dims[1].size * var_dims[2].size +
					iso_index * var_dims[2].size +
					year_index;
			} else if (
				var_dims[0].name === 'ISO' &&
				var_dims[1].name === 'Category' &&
				var_dims[2].name === 'Time'
			) {
				index =
					iso_index * var_dims[1].size * var_dims[2].size +
					category_index * var_dims[2].size +
					year_index;
			} else {
				throw new Error('Unknown variable dimensions');
			}
			const value = var_[index];
			values.push({
				Time: years[year_index],
				value
			});
		}
		return values;
	}
}
