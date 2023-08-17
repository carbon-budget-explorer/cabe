<script lang="ts">
	import type { PageData } from '../global/$types';

	import GlobalBudgetForm from '$lib/GlobalBudgetForm.svelte';
	import TimeSeries from '$lib/charts/TimeSeries.svelte';
	import type { LineValue } from '$lib/charts/components/MultiLine';
	import type { TimeSeriesValue } from '$lib/server/db/global';
	import { LayerCake } from 'layercake';
	import AxisX from '$lib/charts/components/AxisX.svelte';
	import AxisY from '$lib/charts/components/AxisY.svelte';
	import MultiLine from '$lib/charts/components/MultiLine.svelte';
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
		}, {
			name: data.result.historicalCarbon.name,
			values: data.result.historicalCarbon.values.map(tsDataToLine),
			fill: 'black',
			stroke: 'black',
		}
	];
</script>

<div class="border-grey-4 border-grey flex h-full w-full flex-col items-center border-4">
	<div class="flex h-full w-full flex-row justify-between gap-4">
		<div class="flex flex-col gap-4">
			<div>
				<h1 class="text-xl">Choosing your pathway</h1>
				<h2>(Wat wil ik?)</h2>
			</div>
			<div class="border-grey-400 border-4">
				<GlobalBudgetForm choices={data.choices} query={data.query} onChange={() => 1} />
			</div>
			<div class="border-grey-400 border-4">
				<ul>
					<li>Global budget: {data.result.carbonTotal.total.toFixed(2)} GtCO2</li>
					<li>Used since 1850-2021: {data.result.carbonTotal.used.toFixed(2)}  GtCO2</li>
					<li>Remaining till 2050: {data.result.carbonTotal.remaining.toFixed(2)}  GtCO2</li>
				</ul>
			</div>
		</div>
		<div class="flex grow flex-col gap-4">
			<div class="border-grey-400 grow border-4" >
				<TimeSeries data={carbonTSData}/>

				<!-- <LayerCake {xDomain} {yDomain}>
					<AxisX/>
					<AxisY/>
					<AreaLine {co2remaining}/>
					<Line {co2historical}/>

				</LayerCake> -->
					
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
				<button
					class="mb-2 mr-2 rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-3xl font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
				>
					Next step: allocate
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	#imagecontainer {
		background: url('https://private-user-images.githubusercontent.com/17080502/255811842-a72cfb8b-d325-4bcb-8161-209b7f8ae732.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE2OTE1MDI1MjgsIm5iZiI6MTY5MTUwMjIyOCwicGF0aCI6Ii8xNzA4MDUwMi8yNTU4MTE4NDItYTcyY2ZiOGItZDMyNS00YmNiLTgxNjEtMjA5YjdmOGFlNzMyLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJV05KWUFYNENTVkVINTNBJTJGMjAyMzA4MDglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjMwODA4VDEzNDM0OFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTI0ZDc5N2NjNmQ3NWVmZWQwYzM5M2E4YmExMzAwNDY4ZWU0OTZkMmEwY2JmZTBlMGEwNDc5MTA4ZDg1MWZiMmEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.bKX5pbRv32EvSaRbdr4_spGJq4ajD0WY9uPe22eG8Gc')
			no-repeat;
		background-size: contain;
	}
</style>
