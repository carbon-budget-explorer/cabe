
import { HTTPStore , ZarrArray, openGroup, } from 'zarr'

export async function loadScenarios() {
    // console.log(import.meta.url)
    // TODO use url where server is running or local path
    // throws ERR_INVALID_URL
    // const url = '/xr_budgets_scenario.zarr'
    const url = 'http://localhost:5173/xr_budgets_scenario.zarr'
    const store = new HTTPStore(url);
    // console.log(store)
    const z = await openGroup(
        store, undefined, 'r'
    )
    // console.log(z)
    const a = await z.getItem('GF')
    // console.log(a)
    const vs = await a.get([0, null]);
    // console.log(vs)

    // can get data but need to know the path to it aka 'GF'
    // zarr.js does not seem to have method like 
    // https://zarr.readthedocs.io/en/stable/api/hierarchy.html#zarr.hierarchy.Group.arrays

    // also we need to to perform join of coordinates and variables by hand
    // for example in Python I can do
    // ds.sel(Time=2030, Category='C1', ISO='NLD')['GF'].values

    const category_array = await z.getItem('Category') as ZarrArray
    console.log(category_array)

    const categories = await category_array.get([null])
    console.log(categories)
    // zarr.js does not support string dtype |S5
    
}