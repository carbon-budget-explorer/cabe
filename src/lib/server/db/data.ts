import { open_borders } from './borders';
import { open_scenarios } from './scenarios';
import { open_totals } from './totals';
import { open_dataset } from './xarray';

const defaultTotalsPath = 'data/xr_total4.nc';
const totalsPath = process.env.CABE_TOTALS_PATH || defaultTotalsPath;
export const totals = await open_totals(totalsPath);
export const totals2 = await open_dataset(totalsPath);

const defaultScenariosPath = 'data/xr_budgets_scenario.nc';
const scenariosPath = process.env.CABE_SCENARIOS_PATH || defaultScenariosPath;
export const scenarios = await open_scenarios(scenariosPath);

const defaultBordersPath = 'data/ne_110m_admin_0_countries.geojson';
const bordersPath = process.env.CABE_BORDERS_PATH || defaultBordersPath;
export const borders = await open_borders(bordersPath);
