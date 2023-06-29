import { rm, mkdtemp } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import type { NetCDFFile } from 'netcdf4-async';
import { createRequire } from 'node:module';

import { open_totals } from './totals';

const require = createRequire(import.meta.url);

const netcdf4 = require('netcdf4-async');

let testnc = '';

beforeAll(async () => {
	const workdir = await mkdtemp(join(tmpdir(), 'cabe-test-'));
	testnc = join(workdir, 'test.nc');
	console.log(testnc);
	const file: NetCDFFile = await netcdf4.open(testnc, 'c', 'netcdf4');
	// Time dimension
	await file.root.addDimension('Time', 3);
	const time = await file.root.addVariable('Time', 'int', ['Time']);
	await time.writeSlice(0, 3, new Int32Array([2019, 2020, 2021]));
	// ISO dimemsion
	await file.root.addDimension('ISO', 2);
	const iso = await file.root.addVariable('ISO', 'string', ['ISO']);
	await iso.writeSlice(0, 2, ['NLD', 'USA']);
	// Population variable
	const population = await file.root.addVariable('Population', 'double', ['ISO', 'Time']);
	await population.writeSlice(0, 1, 0, 3, new Float64Array([1.11, 2.22, 3.33]));
	await population.writeSlice(1, 1, 0, 3, new Float64Array([4.44, 5.55, 6.66]));
	await file.sync();
	await file.close();
});

afterAll(async () => {
	if (testnc) {
		await rm(dirname(testnc), { recursive: true });
	}
});

describe('Totals', () => {
	test('years', async () => {
		const totals = await open_totals(testnc);
		const years = await totals.years();
		expect(years).toEqual([2019, 2020, 2021]);
	});
	test('isos', async () => {
		const totals = await open_totals(testnc);
		const isos = await totals.isos();
		expect(isos).toEqual(['NLD', 'USA']);
	});
	test.each([
		[
			2019,
			[
				{ iso: 'NLD', value: 1.11 },
				{ iso: 'USA', value: 4.44 }
			]
		],
		[
			2020,
			[
				{ iso: 'NLD', value: 2.22 },
				{ iso: 'USA', value: 5.55 }
			]
		],
		[
			2021,
			[
				{ iso: 'NLD', value: 3.33 },
				{ iso: 'USA', value: 6.66 }
			]
		]
	])('global %i', async (year, expected) => {
		const totals = await open_totals(testnc);
		const population = await totals.global('Population', year);
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
	])('regional %s', async (iso, expected) => {
		const totals = await open_totals(testnc);
		const population = await totals.regional('Population', iso);
		expect(population).toEqual(expected);
	});
});
