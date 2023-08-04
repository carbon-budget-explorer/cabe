import { ready, File, Dataset as HDF5Dataset } from 'h5wasm';

export async function open_dataset(path: string) {
	await ready;
	const reader = new File(path);
	return new Dataset(reader);
}

const isDim = (dataset: HDF5Dataset) =>
	'CLASS' in dataset.attrs && dataset.get_attribute('CLASS', true) === 'DIMENSION_SCALE';

export class Dimension {
	id: number;
	name: string;
	shape: number[];
	ds: HDF5Dataset;

	constructor(ds: HDF5Dataset) {
		this.id = ds.get_attribute('_Netcdf4Dimid', true) as number;
		this.name = ds.get_attribute('NAME', true) as string;
		this.shape = ds.shape;
		this.ds = ds;
	}

	get quickview() {
		return [this.id, this.name, this.shape];
	}
}

export class DataArray {
	name: string;
	dimensions: Dimension[];
	ds: HDF5Dataset;

	constructor(name: string, dimensions: Dimension[], ds: HDF5Dataset) {
		this.name = name;
		this.dimensions = dimensions;
		this.ds = ds;
	}

	get quickview() {
		return { name: this.name, dimensions: this.dimensions.map((d) => `${d.name} (${d.shape[0]})`) };
	}

	get values() {
		// return ds
		if (this.ds.dtype === 'S') return this.ds.value as string[];

		// TODO perhaps other types are possible as well?
		// TODO make this lazy?
		return this.ds.value as number[];
	}
}

export class Dataset {
	// TODO add "dimensions", "coordinates" and "data_vars" as members during init?
	constructor(private reader: File) {}

	get dimensions(): Dimension[] {
		const keys = this.reader.keys();

		// TODO verify all keys corresponds to Datasets, i.e. no groups present
		const datasets = keys.map((k) => this.reader.get(k) as HDF5Dataset);

		return datasets
			.filter(isDim)
			.map((d) => new Dimension(d))
			.sort((a, b) => a.id - b.id);
	}

	get variables() {
		// TODO cast to object {name: Variable}?
		const keys = this.reader.keys();

		// TODO verify all keys corresponds to Datasets, i.e. no groups present
		const datasets = keys.map((k) => ({ name: k, dataset: this.reader.get(k) as HDF5Dataset }));

		// TODO create class for dataset (or "dataArray" / "variable")?
		return datasets.map((ds) => {
			let dimIds = ds.dataset.get_attribute('_Netcdf4Coordinates', true) as number[];
			let dims = dimIds.map((id) => this.dimensions[id]);
			return new DataArray(ds.name, dims, ds.dataset);
		});
	}

	get coordinates() {
		// TODO cast to object {name: Coordinate}?
		return this.variables.filter((v) => isDim(v.ds));
	}

	get data_vars() {
		// TODO cast to object {name: Variable}?
		return this.variables.filter((v) => !isDim(v.ds));
	}
}
