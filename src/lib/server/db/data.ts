import { open_borders } from './borders';
import { open_scenarios } from './scenarios';
import { open_totals } from './totals';

const defaultTotalsPath = 'data/xr_total.nc';
// TODO if data/xr_total.nc does not exist, failback to __tests__/totals.nc?
const totalsPath = process.env.CABE_TOTALS_PATH || defaultTotalsPath;
export const totals = await open_totals(totalsPath);

const defaultScenariosPath = 'data/xr_budgets_scenario.nc';
const scenariosPath = process.env.CABE_SCENARIOS_PATH || defaultScenariosPath;
export const scenarios = await open_scenarios(scenariosPath);

const defaultBordersPath = 'data/ne_110m_admin_0_countries.geojson';
const bordersPath = process.env.CABE_BORDERS_PATH || defaultBordersPath;
export const borders = await open_borders(bordersPath);
