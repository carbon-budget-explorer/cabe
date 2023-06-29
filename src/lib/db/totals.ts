import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const netcdf4 = require('netcdf4-async');

export const open_totals = async (path: string) => {
    const file = await netcdf4.open(path,'r');
    return new Totals(file);
}

class Totals {
    constructor(private file: any) {

    }

    async isos() {
        const iso = await this.file.root.getVariable('ISO')
        const iso_dims = await iso.getDimensions()
        const iso_string = await iso.readSlice(0, iso_dims.ISO, 0, 3)
        const iso_values = iso_string.match(/.{1,3}/g);
        return iso_values;
    }
}