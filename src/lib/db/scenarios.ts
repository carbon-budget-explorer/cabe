import type { NetCDFFile } from 'netcdf4-async';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const netcdf4 = require('netcdf4-async');

export const open_scenarios = async (path: string) => {
	const file: NetCDFFile = await netcdf4.open(path, 'r');
	return new Scenarios(file);
};

export class Scenarios {
	constructor(private file: NetCDFFile) {}

	async isos() {
		const iso = await this.file.root.getVariable('ISO');
		const iso_dims = await iso.getDimensions();
		if (iso.type === 'char') {
			const iso_string = await iso.readSlice<string>(0, iso_dims.ISO, 0, 3);
			const values = iso_string.match(/.{1,3}/g);
			if (!values) {
				throw new Error('Could not parse ISO string');
			}
			return values;
		}
		return await iso.readSlice<string[]>(0, iso_dims.ISO);
	}

	async years() {
		const time = await this.file.root.getVariable('Time');
		const time_dims = await time.getDimensions();
		const values = await time.readSlice(0, time_dims.Time);
		return Array.from(values);
	}

	async categories() {
		const category = await this.file.root.getVariable('Category');
		const category_dims = await category.getDimensions();
		if (category.type === 'char') {
			const values = [];
			// Unable to all items in single readSlice, so readSlice each item
			for (let index = 0; index < category_dims.Category; index++) {
				const cat_string = await category.readSlice<string>(index, 1, 0, 5);
				values.push(cat_string);
			}
			return values;
		}
		const values = await category.readSlice<string[]>(0, category_dims.Category);
		return Array.from(values);
	}

	async variables() {
		const variables = await this.file.root.getVariables();
		const dimensions = new Set<string>(['Category', 'ISO', 'Time']);
		const varnames: string[] = [];
		for (const [vname, variable] of Object.entries(variables)) {
			const dims = await variable.getDimensions();
			// filter out vars which do not have ISO and Time and Category dimensions
			if (!dimensions.has(vname) && dims.ISO && dims.Time && dims.Category) {
				varnames.push(vname);
			}
		}
		return varnames;
	}

	async global(category: string, variable: string, year: number) {
		const var_ = await this.file.root.getVariable(variable);
		const var_dims = await var_.getDimensions();
		const categories = await this.categories();
		const category_index = categories.indexOf(category);
		const iso = await this.isos();
		const years = await this.years();
		const year_index = years.indexOf(year);
		const dim_order = Object.keys(var_dims).toString();
		let selection = [];
		switch (dim_order) {
			case 'ISO,Time,Category':
				selection = [0, var_dims.ISO, year_index, 1, category_index, 1];
				break;
			case 'Category,ISO,Time':
				selection = [category_index, 1, 0, var_dims.ISO, 0, year_index, 1];
				break;
			case 'ISO,Category,Time':
				selection = [0, var_dims.ISO, category_index, 1, year_index, 1];
				break;
			default:
				throw new Error(`Unknown dim order: ${dim_order}`);
		}
		const values = await var_.readSlice(...selection);
		return Array.from(values).map((value, i) => {
			return {
				ISO: iso[i],
				value
			};
		});
	}

	async region(category: string, variable: string, iso: string) {
		const var_ = await this.file.root.getVariable(variable);
		const var_dims = await var_.getDimensions();
		const isos = await this.isos();
		const iso_index = isos.indexOf(iso);
		const categories = await this.categories();
		const category_index = categories.indexOf(category);
		const years = await this.years();
		const dim_order = Object.keys(var_dims).toString();
		let selection = [];
		switch (dim_order) {
			case 'ISO,Time,Category':
				selection = [iso_index, 1, 0, var_dims.Time, category_index, 1];
				break;
			case 'Category,ISO,Time':
				selection = [category_index, 1, iso_index, 1, 0, var_dims.Time];
				break;
			case 'ISO,Category,Time':
				selection = [iso_index, 1, category_index, 1, 0, var_dims.Time];
				break;
			default:
				throw new Error(`Unknown dim order: ${dim_order}`);
		}
		const values = await var_.readSlice(...selection);
		return Array.from(values).map((value, i) => {
			return {
				Time: years[i],
				value
			};
		});
	}
}
