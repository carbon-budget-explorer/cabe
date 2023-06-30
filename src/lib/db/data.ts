import { open_scenarios } from './scenarios';
import { open_totals } from './totals';

const defaultTotalsPath = 'data/xr_total.nc';
const totalsPath = process.env.CABE_TOTALS_PATH || defaultTotalsPath;
export const totals = await open_totals(totalsPath);

const defaultScenariosPath = 'data/xr_budgets_scenario.nc';
const scenariosPath = process.env.CABE_SCENARIOS_PATH || defaultScenariosPath;
export const scenarios = await open_scenarios(scenariosPath);
