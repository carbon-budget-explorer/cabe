import { describe, test, expect, beforeAll } from 'vitest';

import { open_dataset, type Dataset, Coordinate, ExclusiveSlice } from './server/db/xarray';

/*

The __tests__/dummy.nc was created with 

```python
import xarray as xr

ds = xr.Dataset({

}, coords={
    'Temperature':['1.5 deg', '1.7 deg', '2.0 deg']
})

ds.to_netcdf('__tests__/dummy.nc')
```

 */
const testnc = '__tests__/dummy.nc';

describe('open_dataset', () => {
	let ds: Dataset;
	beforeAll(async () => {
		ds = await open_dataset(testnc);
	});

	describe('ds.coords', () => {
		test('keys()', () => {
			expect(Object.keys(ds.coords)).toEqual(['Temperature']);
		});

		describe('.Temperature', () => {
			let coord: Coordinate;

			beforeAll(async () => {
				coord = ds.coords['Temperature'];
			});

			test('id', () => {
				expect(coord.id).toEqual(0);
			});

			test('name', () => {
				expect(coord.name).toEqual('Temperature');
			});

			test('shape', () => {
				expect(coord.shape).toEqual([3]);
			});

			test('values', () => {
				expect(coord.values).toEqual(['1.5 deg', '1.7 deg', '2.0 deg']);
			});

			test.each([
				{
					value: '1.5 deg',
					expected: 0
				},
				{
					value: '1.7 deg',
					expected: 1
				},
				{
					value: '2.0 deg',
					expected: 2
				}
			])('indexOf($value)', ({ value, expected }) => {
				const index = coord.indexOf(value);
				expect(index).toEqual(expected);
			});

			test('indexOf(unknown)', () => {
				expect(() => {
					coord.indexOf('unknown');
				}).toThrowError('Value unknown not found in Temperature');
			});

			test.each([
				{
					indexer: undefined,
					expected: ['1.5 deg', '1.7 deg', '2.0 deg']
				}
			])('sel($indexer)', ({ indexer, expected }) => {
				const values = coord.sel(indexer);
				expect(values).toEqual(expected);
			});

			test.each([
				{
					indexer: new ExclusiveSlice(1, 3),
					expected: ['1.7 deg', '2.0 deg']
				},
				{
					indexer: [0, 2],
					expected: ['1.5 deg', '2.0 deg']
				}
			])('isel($indexer)', ({ indexer, expected }) => {
				const values = coord.isel(indexer);
				expect(values).toEqual(expected);
			});
		});
	});
});
