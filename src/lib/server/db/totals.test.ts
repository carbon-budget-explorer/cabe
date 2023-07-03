import { describe, test, expect, beforeAll } from 'vitest';

import { Totals, open_totals } from './totals';

// Python code to generate test fle:
// import xarray as xr
// import numpy as np
// ds = xr.Dataset(
//   {
//     'Population': (['ISO', 'Time'], np.array([[1.11, 2.22, 3.33],[ 4.44, 5.55, 6.66]])),
//     'GDP': (['ISO', 'Time'], np.array([[11.11, 22.22, 33.33],[ 44.44, 55.55, 66.66]])),
//   },
//   coords={'ISO': ['NLD', 'USA'], 'Time': [2019, 2020, 2021]},
// )
// ds.to_netcdf('__tests__/totals.nc', format='NETCDF3_CLASSIC')
const testnc = '__tests__/totals.nc';


describe('Totals', () => {
	let totals: Totals;
	beforeAll(async () => {
		totals = await open_totals(testnc);
	})

	test('years', () => {
		const years = totals.years();
		expect(years).toEqual([2019, 2020, 2021]);
	});
	test('isos', () => {
		const isos = totals.isos();
		expect(isos).toEqual(['NLD', 'USA']);
	});

	test('variables', () => {
		const variables = totals.variables();
		expect(variables).toEqual(['Population', 'GDP']);
	});

	test.each([
		[
			2019,
			[
				{ ISO: 'NLD', value: 1.11 },
				{ ISO: 'USA', value: 4.44 }
			]
		],
		[
			2020,
			[
				{ ISO: 'NLD', value: 2.22 },
				{ ISO: 'USA', value: 5.55 }
			]
		],
		[
			2021,
			[
				{ ISO: 'NLD', value: 3.33 },
				{ ISO: 'USA', value: 6.66 }
			]
		]
	])('global %i', async (year, expected) => {
		const population = totals.global('Population', year);
		expect(population).toEqual(expected);
	});

	test.each([
		[
			'NLD',
			[
				{ Time: 2019, value: 1.11 },
				{ Time: 2020, value: 2.22 },
				{ Time: 2021, value: 3.33 }
			]
		],
		[
			'USA',
			[
				{ Time: 2019, value: 4.44 },
				{ Time: 2020, value: 5.55 },
				{ Time: 2021, value: 6.66 }
			]
		]
	])('regional %s', (iso, expected) => {
		const population = totals.region('Population', iso);
		expect(population).toEqual(expected);
	});
});
