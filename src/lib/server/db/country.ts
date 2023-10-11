import type { PyodideInterface } from 'pyodide';
import { open_dataset, type DataArraySelection } from './xarray';
import { principles } from '$lib/principles';
import { toJsOpts, type PathWayQuery, type UncertainTime } from './models';
import { dsGlobal } from './data';

export class CountriesDatabase {
	cache = new Map<string, CountryDatabase>();

	constructor(public pyodide: PyodideInterface, public dataDir: string) {}

	async get(iso: string) {
		let db = this.cache.get(iso);
		if (db === undefined) {
			const ncPath = this.dataDir + `/xr_alloc_${iso}.nc`;
			db = new CountryDatabase(iso, ncPath);
			await db.open(this.pyodide);
			this.cache.set(iso, db);
		}
		return db;
	}
}

export class CountryDatabase {
	ds: any;
	constructor(public iso: string, public ncPath: string) {}

	async open(pyodide: PyodideInterface) {
		this.ds = await open_dataset(this.ncPath, pyodide);
	}

	effortSharings(pathwayQuery: PathWayQuery, Scenario = 'SSP2', Convergence_year = 2040) {
		// TODO dont get data for all principles, only the ones that are selected
		return Object.fromEntries(
			Object.keys(principles).map((principle) => {
				return [
					principle,
					this.effortSharing(
						principle as keyof typeof principles,
						pathwayQuery,
						Scenario,
						Convergence_year
					)
				];
			})
		);
	}

	effortSharing(
		principle: keyof typeof principles,
		pathwayQuery: PathWayQuery,
		Scenario = 'SSP2',
		Convergence_year = 2040
	) {
		let selection: DataArraySelection = {};
		const pathwaySelection = {
			Temperature: pathwayQuery.temperature,
			Risk: pathwayQuery.exceedanceRisk,
			NegEmis: pathwayQuery.negativeEmissions,
			NonCO2: pathwayQuery.nonCO2Mitigation
		};

		// TODO should I do aggregation on Scenario and Convergence_year?
		// or use static selection?
		if (principle === 'GF') {
			selection = {
				...pathwaySelection
			};
		} else if (
			principle === 'PC' ||
			principle === 'AP' ||
			principle === 'GDR' ||
			principle === 'ECPC'
		) {
			selection = {
				...pathwaySelection,
				Scenario
			};
		} else if (principle === 'PCC') {
			selection = {
				...pathwaySelection,
				Convergence_year,
				Scenario
			};
		} else {
			throw new Error(`Effort sharing principle ${principle} not found`);
		}
		const ds = this.ds.get(principle).sel.callKwargs(selection);
		if (principle === 'ECPC') {
			// ECPC does not have time dimension, now plotting at 2100
			const uncertainty = ds
				.to_pandas()
				.agg(['mean', 'min', 'max'])
				.transpose()
				.to_dict()
				.toJs(toJsOpts);
			return [
				{
					time: '2100',
					...uncertainty
				}
			] as UncertainTime[];
		}
		let df = ds.rename.callKwargs({ Time: 'time' }).to_pandas();
		if (['GF', 'PC'].includes(principle)) {
			// These effort sharing principles have Time dimension after TrajUnc dimension
			// While all other principles have TrajUnc dimension after Time dimension
			// Causing columns to be Time and TrajUnc to be rows in dataframe
			// We want the opposite
			// TODO order dimensions for each principle in same way, so this is not needed anymore
			df = df.transpose();
		}
		const r = df.agg
			.callKwargs({ func: ['mean', 'min', 'max'], axis: 1 })
			.reset_index()
			.to_dict.callKwargs({ orient: 'records' })
			.toJs(toJsOpts) as UncertainTime[];
		return r;
	}
}
