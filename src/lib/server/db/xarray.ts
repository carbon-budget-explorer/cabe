import { ready, File, Dataset as HDF5Dataset, type OutputData } from 'h5wasm';

export async function open_dataset(path: string) {
	await ready;
	const reader = new File(path);
	return new Dataset(reader);
}

const isDim = (dataset: HDF5Dataset) =>
	'CLASS' in dataset.attrs && dataset.get_attribute('CLASS', true) === 'DIMENSION_SCALE';

export class ExclusiveSlice {
	start: number;
	stop: number;

	constructor(start: number, stop: number) {
		this.start = start;
		this.stop = stop;
	}
}

export class InclusiveSlice {
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

	sel(indexer?: string | number | string[] | number[] | InclusiveSlice) {
		// Note: this assumes coords are 1-dimensional
		let iindexer: undefined | number | InclusiveSlice | number[] = undefined;
		if (indexer === undefined) {
			iindexer = undefined;
		} else if (typeof indexer === 'number' || typeof indexer === 'string') {
			iindexer = this.indexOf(indexer);
		} else if (indexer instanceof InclusiveSlice) {
			iindexer = new ExclusiveSlice(this.indexOf(indexer.start), this.indexOf(indexer.stop) + 1);
		} else if (Array.isArray(indexer)) {
			iindexer = indexer.map((i) => this.indexOf(i));
		}

		return this.isel(iindexer);
	}

	isel(indexer?: number | ExclusiveSlice | number[]): number[] | string[] {
		let slice: number[] = [];
		if (indexer === undefined) {
			slice = [];
		} else if (typeof indexer === 'number') {
			slice = [indexer, indexer + 1];
		} else if (indexer instanceof ExclusiveSlice) {
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

	sel(indexer?: Record<string, string | number | string[] | number[] | InclusiveSlice>) {
		const iindexer: Record<string, number | InclusiveSlice | number[]> = {};
		if (indexer === undefined) {
			return this.isel();
		}
		for (const coordName in this.coordinates) {
			if (coordName in this.coordinates && indexer) {
				const cindex = indexer[coordName];
				if (cindex === undefined) {
					// to nothing
				} else if (typeof cindex === 'number' || typeof cindex === 'string') {
					iindexer[coordName] = this.coordinates[coordName].indexOf(cindex);
				} else if (cindex instanceof InclusiveSlice) {
					iindexer[coordName] = new ExclusiveSlice(
						this.coordinates[coordName].indexOf(cindex.start),
						this.coordinates[coordName].indexOf(cindex.stop) + 1
					);
				} else if (Array.isArray(cindex)) {
					// TODO slice of h5wasm does not handle list of indices
					throw new Error('Not implemented');
				}
			} else {
				throw new Error(`Coordinate ${coordName} not found in ${this.name}`);
			}
		}
		// TODO return sliced coordinates together with sliced data as new dataarray
		return this.isel(iindexer);
	}

	isel(indexer?: Record<string, number | ExclusiveSlice | number[]>) {
		const slice: number[][] = [];
		for (const coordName in this.coordinates) {
			if (coordName in this.coordinates && indexer) {
				const cindex = indexer[coordName];
				if (cindex === undefined) {
					slice.push([]);
				} else if (typeof cindex === 'number') {
					slice.push([cindex, cindex + 1]);
				} else if (cindex instanceof ExclusiveSlice) {
					slice.push([cindex.start, cindex.stop]);
				} else if (Array.isArray(cindex)) {
					// TODO slice of h5wasm does not handle list of indices
					throw new Error('Not implemented');
				}
			} else {
				slice.push([]);
			}
		}
		// TODO dont cast but use typeguard
		const values = this.ds.slice(slice) as number[];
		return Array.from(values)
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
				const dimIds = ds.get_attribute('_Netcdf4Coordinates', true) as number[];
				const coords = Object.fromEntries(
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
