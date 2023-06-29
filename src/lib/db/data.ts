import { open_totals } from "./totals";

const defaultTotalsPath = 'data/xr_total.nc';
const totalsPath = process.env.CABE_TOTALS_PATH || defaultTotalsPath;
export const totals = await open_totals(totalsPath);
