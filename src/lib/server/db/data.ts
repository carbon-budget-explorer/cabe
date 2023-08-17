import { open_borders } from './borders';
import { open_dataset } from './xarray';

const defaultTotalsPath = 'data/xr_total4.nc';
const totalsPath = process.env.CABE_TOTALS_PATH || defaultTotalsPath;
export const ds = await open_dataset(totalsPath);

const defaultBordersPath = 'data/ne_110m_admin_0_countries.geojson';
const bordersPath = process.env.CABE_BORDERS_PATH || defaultBordersPath;
export const borders = await open_borders(bordersPath);
