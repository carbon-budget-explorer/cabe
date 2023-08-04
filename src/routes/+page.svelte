<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import GlobalBudget from '$lib/charts/GlobalBudget.svelte';
	import TimeSeries from '$lib/charts/TimeSeries.svelte';
	import type { TimeSeriesValue } from '$lib/server/db/global';
	import type { LineValue } from '$lib/charts/components/MultiLine';

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

	type ChangeEvent = Event & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	function changeWarming(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set('warming', event.currentTarget.value);
			goto(`?${params.toString()}`);
		}
	}

	function changeProbability(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set('probability', event.currentTarget.value);
			goto(`?${params.toString()}`);
		}
	}

	function changeNonCO2Mitigation(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set('nonCO2Mitigation', event.currentTarget.value);
			goto(`?${params.toString()}`);
		}
	}

	function changeNegativeEmissions(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set('negativeEmissions', event.currentTarget.value);
			goto(`?${params.toString()}`);
		}
	}
	// TODO show loading message when server is processing
</script>

<h1 class="pb-20 text-3xl font-bold">Welcome to Carbon Budget Explorer</h1>

<div class="flex flex-row justify-around">
	<div class="flex flex-col justify-between gap-2">
		<div>
			<div>
				<p>Limit global warming to</p>
				{#each data.choices.warming as warmingChoice}
					<label>
						<input
							type="radio"
							name="target"
							value={warmingChoice}
							checked={warmingChoice === data.query.warming}
							on:change={changeWarming}
						/>
						{warmingChoice}°C
					</label>
				{/each}
			</div>
			<div>
				<p>Acceptable risk of exceeding global warming limit</p>
				{#each data.choices.probability as probabilityChoice}
					<label>
						<input
							type="radio"
							name="probability"
							value={probabilityChoice}
							checked={probabilityChoice === data.query.probability}
							on:change={changeProbability}
						/>
						{100 - parseFloat(probabilityChoice)}%
					</label>
				{/each}
			</div>
			<div>
				<p>Assumption of non CO2 emissions to mitigate</p>
				{#each data.choices.nonCO2Mitigation as nonCO2MitigationChoice}
					<label>
						<input
							type="radio"
							name="nonCO2Mitigation"
							value={nonCO2MitigationChoice}
							checked={nonCO2MitigationChoice === data.query.nonCO2Mitigation}
							on:change={changeNonCO2Mitigation}
						/>
						{nonCO2MitigationChoice}
					</label>
				{/each}
			</div>
			<div>
				<p>Assumption amount of negative emissions in 2050 - 2100.</p>
				{#each data.choices.negativeEmissions as negativeEmissionsChoice}
					<label>
						<input
							type="radio"
							name="negativeEmissions"
							value={negativeEmissionsChoice}
							checked={negativeEmissionsChoice === data.query.negativeEmissions}
							on:change={changeNegativeEmissions}
						/>
						{negativeEmissionsChoice}
					</label>
				{/each}
			</div>
		</div>
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
