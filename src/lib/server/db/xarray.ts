import { ready, File, Dataset as HDF5Dataset } from 'h5wasm';
import { totals } from './data';

export async function open_dataset(path: string) {
	await ready;
	const reader = new File(path);
	return new Dataset(reader);
}

const isDim = (dataset: HDF5Dataset) =>
	'CLASS' in dataset.attrs && dataset.get_attribute('CLASS', true) === 'DIMENSION_SCALE';

export class Coordinate {
	// Note: this assumes coords are 1-dimensional
	id: number;
	name: string;
	shape: number[];
	ds: HDF5Dataset;

	constructor(ds: HDF5Dataset) {
		this.id = ds.get_attribute('_Netcdf4Dimid', true) as number;
		// this.name = ds.get_attribute('NAME', true) as string;
		this.name = ds.path.replace('/', '');
		this.shape = ds.shape;
		this.ds = ds;
	}

	get values() {
		if (this.ds.dtype === 'S') return this.ds.to_array() as string[];
		return this.ds.to_array() as number[];
	}

	sel(start?: number | string, stop?: number | string) {
		// Note: this assumes coords are 1-dimensional
		let startIndex: number = 0;
		let stopIndex: number = -1;
		if (this.ds.dtype === 'S') {
			const values = this.values as string[];
			startIndex = typeof start === 'string' ? values.indexOf(start) : 0;
			stopIndex = typeof stop === 'string' ? values.indexOf(stop) : this.shape[0];
		} else {
			const values = this.values as number[];
			startIndex = typeof start === 'number' ? values.indexOf(start) : 0;
			stopIndex = typeof stop === 'number' ? values.indexOf(stop) : this.shape[0];
		}

		return this.isel(startIndex, stopIndex);
	}

	isel(start?: number, stop?: number) {
		let slice: number[] = [];
		if (start === undefined && stop === undefined) {
			slice = [];
		} else if (start !== undefined && stop === undefined) {
			slice = [start, start + 1];
		} else if (start === undefined && stop !== undefined) {
			slice = [0, stop];
		} else if (start !== undefined && stop !== undefined) {
			slice = [start, stop];
		}

		if (this.ds.dtype === 'S') return Array.from(this.ds.slice([slice]) as string[]);
		return Array.from(this.ds.slice([slice]) as number[]);
	}
}

export class DataArray {
	name: string;
	coordinates: Record<string, Coordinate>;
	ds: HDF5Dataset;

	constructor(name: string, coordinates: Record<string, Coordinate>, ds: HDF5Dataset) {
		this.name = name;
		this.coordinates = coordinates;
		this.ds = ds;
	}

	get values() {
		if (this.ds.dtype === 'S') return this.ds.to_array() as string[];
		return this.ds.to_array() as number[];
	}
}

export class Dataset {
	// TODO add "dimensions", "coordinates" and "data_vars" as members during init?
	constructor(private reader: File) {}

	get coords() {
		// TODO verify all keys corresponds to Datasets, i.e. no groups present
		const keys = this.reader.keys();
		const datasets = keys.map((k) => this.reader.get(k) as HDF5Dataset);

		return Object.fromEntries(
			datasets
				.filter(isDim)
				.map((d) => new Coordinate(d))
				.map((c) => [c.name, c])
		);
	}

	get data_vars() {
		// TODO verify all keys corresponds to Datasets, i.e. no groups present
		const keys = this.reader.keys();
		const hdf5Datasets = keys.map((k) => this.reader.get(k) as HDF5Dataset);
		const coordsByIndex = Object.fromEntries(Object.values(this.coords).map((c) => [c.id, c]));

		const dataArrays = hdf5Datasets
			.filter((ds) => !isDim(ds))
			.map((ds) => {
				let dimIds = ds.get_attribute('_Netcdf4Coordinates', true) as number[];
				let coords = Object.fromEntries(
					dimIds.map((id) => {
						const coord = coordsByIndex[id.toString()];
						return [coord.name, coord];
					})
				);
				const name = ds.path.replace('/', '');
				return new DataArray(name, coords, ds);
			});
		return Object.fromEntries(dataArrays.map((v) => [v.name, v]));
	}
}
