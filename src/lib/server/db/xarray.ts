import { ready, File, Dataset as HDF5Dataset } from 'h5wasm';
import { totals } from './data';

export async function open_dataset(path: string) {
	await ready;
	const reader = new File(path);
	return new Dataset(reader);
}

const isDim = (dataset: HDF5Dataset) =>
	'CLASS' in dataset.attrs && dataset.get_attribute('CLASS', true) === 'DIMENSION_SCALE';

export class Slice {
	start: number;
	stop: number;

	constructor(start: number, stop: number) {
		this.start = start;
		this.stop = stop;
	}
}

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

	indexOf(value: string | number) {
		let index = -1;
		if (typeof value === 'string') {
			index = (this.values as string[]).indexOf(value);
		} else {
			index = (this.values as number[]).indexOf(value);
		}
		if (index === -1) throw new Error(`Value ${value} not found in ${this.name}`);
		return index;
	}

	sel(indexer?: string | number | string[] | number[] | Slice) {
		// Note: this assumes coords are 1-dimensional
		let iindexer: undefined | number | Slice | number[] = undefined;
		if (indexer === undefined) {
			iindexer = undefined;
		} else if (typeof indexer === 'number' || typeof indexer === 'string') {
			iindexer = this.indexOf(indexer);
		} else if (indexer instanceof Slice) {
			iindexer = new Slice(this.indexOf(indexer.start), this.indexOf(indexer.stop));
		} else if (Array.isArray(indexer)) {
			iindexer = indexer.map((i) => this.indexOf(i));
		}

		return this.isel(iindexer);
	}

	isel(indexer?: number | Slice | number[]): number[] | string[] {
		let slice: number[] = [];
		if (indexer === undefined) {
			slice = [];
		} else if (typeof indexer === 'number') {
			slice = [indexer, indexer + 1];
		} else if (indexer instanceof Slice) {
			slice = [indexer.start, indexer.stop];
		} else if (Array.isArray(indexer)) {
			if (this.ds.dtype === 'S') {
				return indexer.map((i) => this.isel(i)[0] as string);
			}
			return indexer.map((i) => this.isel(i)[0] as number);
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

	sel(indexer?: Record<string, string | number | string[] | number[] | Slice>) {
		let iindexer: Record<string, number | Slice | number[]> = {};
		if (indexer === undefined) {
			return this.isel();
		}
		for (let coordName in this.coordinates) {
			if (coordName in this.coordinates && indexer) {
				let cindex = indexer[coordName];
				if (cindex === undefined) {
					// to nothing
				} else if (typeof cindex === 'number' || typeof cindex === 'string') {
					iindexer[coordName] = this.coordinates[coordName].indexOf(cindex);
				} else if (cindex instanceof Slice) {
					iindexer[coordName] = new Slice(
						this.coordinates[coordName].indexOf(cindex.start),
						this.coordinates[coordName].indexOf(cindex.stop)
					);
				} else if (Array.isArray(cindex)) {
					// TODO slice of h5wasm does not handle list of indices
					throw new Error('Not implemented');
				}
			} else {
				throw new Error(`Coordinate ${coordName} not found in ${this.name}`);
			}
		}
		return this.isel(iindexer);
	}

	isel(indexer?: Record<string, number | Slice | number[]>) {
		let slice: number[][] = [];
		for (let coordName in this.coordinates) {
			if (coordName in this.coordinates && indexer) {
				let cindex = indexer[coordName];
				if (cindex === undefined) {
					slice.push([]);
				} else if (typeof cindex === 'number') {
					slice.push([cindex, cindex + 1]);
				} else if (cindex instanceof Slice) {
					slice.push([cindex.start, cindex.stop]);
				} else if (Array.isArray(cindex)) {
					// TODO slice of h5wasm does not handle list of indices
					throw new Error('Not implemented');
				}
			} else {
				slice.push([]);
			}
		}
		return this.ds.slice(slice);
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
