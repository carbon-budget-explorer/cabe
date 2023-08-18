<script lang="ts">
	import type { PageData } from '../global/$types';

	import GlobalBudgetForm from '$lib/GlobalBudgetForm.svelte';
	import TimeSeries from '$lib/charts/TimeSeries.svelte';
	import type { LineValue } from '$lib/charts/components/MultiLine';
	import type { TimeSeriesValue } from '$lib/server/db/global';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	export let data: PageData;

	// TODO generalize to colormap component or so
	const ipcc_fill_green = '#dbe3d2';
	const ipcc_stroke_green = '#82a56e';
	const ipcc_fill_red = '#f39995';
	const ipcc_fill2_red = '#f3c6c5'; // lighter
	const ipcc_stroke_red = '#f5331e';
	const ipcc_fill_blue = '#c2e0e7';
	const ipcc_stroke_blue = '#5bb0c6';

	function tsDataToLine(d: TimeSeriesValue): LineValue {
		return {
			x: d.time,
			y: d.mean,
			ymin: d.min,
			ymax: d.max
		};
	}
	$: carbonTSData = [
		{
			name: data.result.carbonTS.name,
			values: data.result.carbonTS.values.map(tsDataToLine),
			fill: ipcc_fill_green,
			stroke: ipcc_stroke_green
		},
		{
			name: data.result.historicalCarbon.name,
			values: data.result.historicalCarbon.values.map(tsDataToLine),
			fill: 'black',
			stroke: 'black'
		}
	];

	function updateQueryParam(name: string, value: string) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set(name, value);
			goto(`?${params.toString()}`);
		}
	}
</script>

<div class="border-grey-4 border-grey flex h-full w-full flex-col items-center border-4">
	<div class="flex h-full w-full flex-row justify-between gap-4">
		<div class="flex flex-col gap-4">
			<div>
				<h1 class="text-xl">Choosing your pathway</h1>
				<h2>(Wat wil ik?)</h2>
			</div>
			<div class="border-grey-400 border-4">
				<GlobalBudgetForm choices={data.choices} query={data.query} onChange={updateQueryParam} />
			</div>
			<div class="border-grey-400 border-4">
				<ul>
					<li>Global budget: {data.result.carbonTotal.total.toFixed(2)} GtCO2</li>
					<li>Used since 1850-2021: {data.result.carbonTotal.used.toFixed(2)} GtCO2</li>
					<li>Remaining till 2050: {data.result.carbonTotal.remaining.toFixed(2)} GtCO2</li>
				</ul>
			</div>
		</div>
		<div class="flex grow flex-col gap-4">
			<div class="border-grey-400 grow border-4">
				<TimeSeries data={carbonTSData} />

				<!-- <GlobalBudgetChart {xDomain} {yDomain}>
					<AreaLine {co2remaining}/>
					<Line {co2historical}/>
					<AreaLine {currentpolicy}/>
					<AreaLine {ndc}/>
					<AreaLine {netzero}/>
					<Gap year={2030} name="Ambition" from={ndc.find(d => d.Time === 2030)} to={co2remaining.find(d => d.Time === 2030)}>
					<Gap year={2030} name="Emission" from={currentpolicy.find(d => d.Time === 2030)} to={co2remaining.find(d => d.Time === 2030)}>
				</GlobalBudgetChart> -->
			</div>
			<div class="border-grey-400 border-4">
				<h1>Difference between your scenario and current policy</h1>
				<ul>
					<li>Ambition gap: XXX GtCO2</li>
					<li>Emission gap: XXX GtCO2</li>
				</ul>
			</div>
		</div>
		<div class="flex h-full flex-col justify-between gap-4">
			<div>
				<h1 class="text-xl">Policy pathways</h1>
				<!-- <h2>(Currenty policy)</h2> -->
				<h2>(Waar kom ik nu eigenlijk?)</h2>
			</div>
			<div class="border-grey-400 grow border-4">
				<ul>
					<li><label><input type="checkbox" checked />{' '}Current policy</label></li>
					<li>
						<label><input type="checkbox" />{' '}Nationally determined contributions (NDCs)</label>
					</li>
					<li><label><input type="checkbox" />{' '}Net zero-scenarios</label></li>
				</ul>
			</div>

			<div>
				<a
					class="mb-2 mr-2 block rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-3xl font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
					href={`/world${$page.url.search}`}
				>
					Next step: Allocate
				</a>
			</div>
		</div>
	</div>
</div>
