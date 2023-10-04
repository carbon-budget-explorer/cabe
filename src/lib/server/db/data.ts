import type { PyodideInterface } from 'pyodide';
import { open_borders } from './borders';
import { mount_data, open_dataset, open_pyodide } from './xarray';
import { CountriesDatabase } from './country';

export const pyodide: PyodideInterface = await open_pyodide();

export const dataDir = process.env.CABE_DATA_DIR || 'data';
mount_data(dataDir, pyodide);

const globalPath = dataDir + '/xr_dataread.nc';
export const dsGlobal = await open_dataset(globalPath, pyodide);

const mapPath = dataDir + '/xr_alloc_2030.nc';
export const dsMap = await open_dataset(mapPath, pyodide);

const bordersPath = dataDir + '/ne_110m_admin_0_countries.geojson';
export const borders = await open_borders(bordersPath);

export const countriesDb = new CountriesDatabase(pyodide, dataDir);
