import { describe, test, expect, beforeAll } from 'vitest';

import { Scenarios, open_scenarios } from './scenarios';

// Python code to generate test fle:
// import xarray as xr
// import numpy as np
// ds = xr.Dataset(
//   {
//     'principle1': (['ISO', 'Time', 'Category'], np.arange(24).reshape(4,3,2) * 1.1),
//     'principle2': (['ISO', 'Category', 'Time'], np.arange(24).reshape(4,2,3) * 1.2),
//     'principle3': (['Category', 'ISO', 'Time'], np.arange(24).reshape(2,4,3) * 1.3),
//   },
//   coords={
//     'ISO': ['NLD', 'USA', 'CHN', 'IND'],
//     'Time': [2019, 2020, 2021],
//     'Category': ['cat1', 'cat2'],
//     },
// )
// ds.to_netcdf('__tests__/scenarios.nc', format='NETCDF3_CLASSIC')
const testnc = '__tests__/scenarios.nc';

describe('Scanarios', () => {
	let scenarios: Scenarios;
	beforeAll(async () => {
		scenarios = await open_scenarios(testnc);
	})

	test('years', async () => {
		const years = scenarios.years();
		expect(years).toEqual([2019, 2020, 2021]);
	});
	test('isos', async () => {
		const isos = scenarios.isos();
		expect(isos).toEqual(['NLD', 'USA', 'CHN', 'IND']);
	});

	test('variables', async () => {
		const variables = scenarios.variables();
		expect(variables).toEqual(['principle1', 'principle2', 'principle3']);
	});

	test('categories', async () => {
		const categories = scenarios.categories();
		expect(categories).toEqual(['cat1', 'cat2']);
	});

	test.each([
		// TODO are values correct?
		[
			'cat1',
			'principle1',
			2019,
			[
				{ ISO: 'NLD', value: 0 },
				{ ISO: 'USA', value: 6.6000000000000005 },
				{ ISO: 'CHN', value: 13.200000000000001 },
				{ ISO: 'IND', value: 19.8 }
			]
		],
		[
			'cat1',
			'principle2',
			2020,
			[
				{ ISO: 'NLD', value: 1.2 },
				{ ISO: 'USA', value: 8.4 },
				{ ISO: 'CHN', value: 15.6 },
				{ ISO: 'IND', value: 22.8 }
			]
		],
		[
			'cat1',
			'principle3',
			2021,
			[
				{ ISO: 'NLD', value: 2.6 },
				{ ISO: 'USA', value: 6.5 },
				{ ISO: 'CHN', value: 10.4 },
				{ ISO: 'IND', value: 14.3 }
			]
		]
	])('global(%s, %s, %i)', async (category, variable, year, expected) => {
		const result = scenarios.global(category, variable, year);
		expect(result).toEqual(expected);
	});

	test.each([
		[
			'cat1',
			'principle1',
			'NLD',
			[
				{ Time: 2019, value: 0 },
				{ Time: 2020, value: 2.2 },
				{ Time: 2021, value: 4.4 }
			]
		],
		[
			'cat2',
			'principle2',
			'USA',
			[
				{ Time: 2019, value: 10.799999999999999 },
				{ Time: 2020, value: 12 },
				{ Time: 2021, value: 13.2 }
			]
		],
		[
			'cat1',
			'principle3',
			'CHN',
			[
				{ Time: 2019, value: 7.800000000000001 },
				{ Time: 2020, value: 9.1 },
				{ Time: 2021, value: 10.4 }
			]
		]
	])('region(%s, %s, %s)', async (category, variable, iso, expected) => {
		const result = scenarios.region(category, variable, iso);
		expect(result).toEqual(expected);
	});
});
