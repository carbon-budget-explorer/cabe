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

	async global(variable: string, year: number) {
		const var_ = await this.file.root.getVariable(variable);
		const var_dims = await var_.getDimensions();
		const years = await this.years();
		const year_index = years.indexOf(year);
		const values = await var_.readSlice(0, var_dims.ISO, year_index, 1);
		const iso = await this.isos();
		return Array.from(values).map((value, i) => {
			return {
				iso: iso[i],
				value
			};
		});
	}

	async regional(variable: string, iso: string) {
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
