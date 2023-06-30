import type { NetCDFFile } from 'netcdf4-async';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const netcdf4 = require('netcdf4-async');

export const open_totals = async (path: string) => {
	const file: NetCDFFile = await netcdf4.open(path, 'r');
	return new Totals(file);
};

export class Totals {
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

	async variables() {
		const variables = await this.file.root.getVariables();
		const dimensions = new Set<string>(['Category', 'ISO', 'Time']);
		const varnames: string[] = [];
		for (const [vname, variable] of Object.entries(variables)) {
			const dims = await variable.getDimensions();
			// filter out vars which do not have ISO and Time dimensions
			if (!dimensions.has(vname) && dims.ISO && dims.Time) {
				varnames.push(vname);
			}
		}
		return varnames;
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

	async references() {
		const variables = await this.file.root.getVariables();
		const varnames: string[] = [];
		for (const [vname, variable] of Object.entries(variables)) {
			const dims = await variable.getDimensions();
			// filter out vars which do not have ISO and Time dimensions
			if (dims.ISO && !dims.Time) {
				varnames.push(vname);
			}
		}
		return varnames;
	}

	async reference(reference: string) {
		const var_ = await this.file.root.getVariable(reference);
		const var_dims = await var_.getDimensions();
		const values = await var_.readSlice(0, var_dims.ISO);
		const iso = await this.isos();
		return Array.from(values).map((value, i) => {
			return {
				ISO: iso[i],
				value
			};
		});
	}

	async category(category: string) {
		const var_ = await this.file.root.getVariable(category);
		const var_dims = await var_.getDimensions();
		const values = await var_.readSlice(0, var_dims.Category, 0, var_dims.Time);
		return Array.from(values);
	}

	async global(variable: string, year: number) {
		const var_ = await this.file.root.getVariable(variable);
		const var_dims = await var_.getDimensions();
		const years = await this.years();
		const year_index = years.indexOf(year);
		const values = await var_.readSlice(0, var_dims.ISO, year_index, 1);
		const iso = await this.isos();
		return Array.from(values).map((value, i) => {
			return {
				ISO: iso[i],
				value
			};
		});
	}

	async region(variable: string, iso: string) {
		const var_ = await this.file.root.getVariable(variable);
		const var_dims = await var_.getDimensions();
		const isos = await this.isos();
		const iso_index = isos.indexOf(iso);
		const values = await var_.readSlice(iso_index, 1, 0, var_dims.Time);
		const years = await this.years();
		return Array.from(values).map((value, i) => {
			return {
				Time: years[i],
				value
			};
		});
	}
}
