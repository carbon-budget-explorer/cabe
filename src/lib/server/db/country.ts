import type { PyodideInterface } from 'pyodide';
import { open_dataset, type DataArraySelection } from './xarray';
import { principles } from '$lib/principles';
import { toJsOpts, type PathWayQuery, type UncertainTime } from './models';

export class CountryDatabase {
	ds: any;
	constructor(public iso: string, public ncPath: string) {}

	async open(pyodide: PyodideInterface) {
		this.ds = await open_dataset(this.ncPath, pyodide);
	}

	effortSharings(pathwayQuery: PathWayQuery, Scenario = 'SSP2', Convergence_year = 2040){
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
		let ds = this.ds.get(principle).sel.callKwargs(selection);
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
			df = df.agg(['mean', 'min', 'max']).transpose();
		} else {
			df = df.agg.callKwargs({ func: ['mean', 'min', 'max'], axis: 1 });
		}
		const r = df
			.reset_index()
			.to_dict.callKwargs({ orient: 'records' })
			.toJs(toJsOpts) as UncertainTime[];

		return r;
	}
}
