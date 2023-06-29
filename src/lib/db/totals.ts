import type { NetCDFFile} from 'netcdf4-async';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const netcdf4  = require('netcdf4-async');

export const open_totals = async (path: string) => {
    const file: NetCDFFile = await netcdf4.open(path,'r');
    return new Totals(file);
}

class Totals {
    constructor(private file: NetCDFFile) {

    }

    async isos() {
        const iso = await this.file.root.getVariable('ISO')
        const iso_dims = await iso.getDimensions()
        const iso_string = await iso.readSlice<string>(0, iso_dims.ISO, 0, 3)
        return iso_string.match(/.{1,3}/g);
    }

    async years() {
        const time = await this.file.root.getVariable('Time')
        const time_dims = await time.getDimensions()
        const time_number = await time.readSlice(0, time_dims.Time, 0, 1)
        return time_number;
    }

    async global(variable: string, year: number) {
        const var_ = await this.file.root.getVariable(variable)
        const var_dims = await var_.getDimensions()
        const years = await this.years()
        const year_index = years.indexOf(year)
        return await var_.readSlice(0, var_dims.Time, year_index, 1)
    }   
}