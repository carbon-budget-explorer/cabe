<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import GlobalBudget from '$lib/charts/GlobalBudget.svelte';
	import TimeSeries from '$lib/charts/TimeSeries.svelte';
	import type { TimeSeriesValue } from '$lib/server/db/global';
	import type { LineValue } from '$lib/charts/components/MultiLine';
	import GlobalBudgetForm from '$lib/GlobalBudgetForm.svelte';

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
		}
	];

	$: temperatureTSData = [
		{
			name: data.result.temperatureTS.name,
			values: data.result.temperatureTS.values.map(tsDataToLine),
			fill: ipcc_fill_blue,
			stroke: ipcc_stroke_blue
		}
	];

	function changeQuery(name: string, value: string) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set(name, value);
			goto(`?${params.toString()}`);
		}
	}

	// TODO show loading message when server is processing
</script>

<h1 class="pb-20 text-3xl font-bold">Welcome to Carbon Budget Explorer</h1>

<div class="flex flex-row justify-around">
	<div class="flex flex-col justify-between gap-2">
		<GlobalBudgetForm choices={data.choices} query={data.query} onChange={changeQuery} />
		<div>
			<a
				class="rounded bg-slate-200 p-2 text-4xl"
				href={`/world${$page.url.search}`}
				title="Look at budget for each country">🌍</a
			>
		</div>
	</div>
	<div class="flex flex-col justify-around">
		<div class="flex flex-col items-center gap-6 pb-4">
			<h1 class="text-bold text-2xl">Global carbon budget</h1>
			<GlobalBudget
				used={data.result.carbonTotal.used}
				remaining={data.result.carbonTotal.remaining}
			/>
		</div>
	</div>
	<div class="flex flex-col gap-6 pb-4">
		<h1 class="text-bold text-2xl">Evolution of carbon emissions</h1>
		<TimeSeries data={carbonTSData} />
		<h1 class="text-bold text-2xl">Evolution of global mean temperature</h1>
		<TimeSeries data={temperatureTSData} />
	</div>
</div>
