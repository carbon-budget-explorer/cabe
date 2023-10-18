<script lang="ts">
	import type { PageData } from '../global/$types';

	import PathwayForm from '$lib/PathwayForm.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Pathway from '$lib/charts/Pathway.svelte';
	import Line from '$lib/charts/components/Line.svelte';
	import Area from '$lib/charts/components/Area.svelte';
	import Gap from '$lib/charts/components/Gap.svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import CustomRange from '$lib/CustomRange.svelte';

	export let data: PageData;

	// TODO generalize to colormap component or so
	const ipcc_green = '#82a56e';
	const ipcc_red = '#f5331e';
	const ipcc_blue = '#5bb0c6';
	const ipcc_purple = '#a67ab8';

	function updateQueryParam(name: string, value: string) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set(name, value);
			goto(`?${params.toString()}`);
		}
	}

	function toggleAmbitionGap() {
		ambitionGapHover = !ambitionGapHover;
	}
	function toggleEmissionGap() {
		emissionGapHover = !emissionGapHover;
	}

	let policyPathwayToggles = {
		current: true,
		ndc: false,
		netzero: false
	};

	let gapIndex = data.result.ndc.map((d) => d.time).indexOf(2030);
	let ambitionGapHover = false;
	let emissionGapHover = false;

	// $: console.log(data.result.currentPolicy); // only nans in input data...
	// Transitions
	const tweenOptions = { duration: 1000, easing: cubicOut };
	const globalBudgetCounter = tweened(data.result.pathwayStats.total, tweenOptions);
	$: globalBudgetCounter.set(data.result.pathwayStats.total);
	const remainingBudgetCounter = tweened(data.result.pathwayStats.remaining, tweenOptions);
	$: remainingBudgetCounter.set(data.result.pathwayStats.remaining);
	const pathwayCarbonTweened = tweened(data.result.pathwayCarbon, tweenOptions);
	$: pathwayCarbonTweened.set(data.result.pathwayCarbon);
	const emissionGapTweened = tweened(data.result.emissionGap, tweenOptions);
	$: emissionGapTweened.set(data.result.emissionGap);
	const ambitionGapTweened = tweened(data.result.ambitionGap, tweenOptions);
	$: ambitionGapTweened.set(data.result.ambitionGap);

	let temperature: string = data.pathway.query.temperature || data.pathway.choices.temperature[0];
	let negEmis: string =
		data.pathway.query.negativeEmissions || data.pathway.choices.negativeEmissions[0];
	let nonCO2: string =
		data.pathway.query.nonCO2Mitigation || data.pathway.choices.nonCO2Mitigation[0];
	let risk: string = data.pathway.query.exceedanceRisk || data.pathway.choices.exceedanceRisk[0];
	$: updateQueryParam('temperature', temperature);
	$: updateQueryParam('negativeEmissions', negEmis);
	$: updateQueryParam('nonCO2Mitigation', nonCO2);
	$: updateQueryParam('exceedanceRisk', risk);
</script>

<div class="flex h-full gap-4">
	<div id="sidebar" class="flex h-full max-w-[25%] flex-col gap-4">
		<div class="card card-compact flex-1 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Global carbon budget</h2>

				<div class="stats bg-accent shadow">
					<div class="stat place-items-center">
						<div class="stat-title">Total</div>
						<div class="stat-value">{($remainingBudgetCounter / 1_000).toFixed(0)}</div>
						<div class="stat-desc">Gt CO2</div>
					</div>

					<div class="stat place-items-center">
						<div class="stat-title">Relative</div>
						<div class="stat-value">
							<!-- TODO fix this hardcoded 37 -->
							{($remainingBudgetCounter / 1_000 / 37).toFixed(0)}x
						</div>
						<div class="stat-desc">current emissions</div>
					</div>
				</div>

				<p class="pt-4">The remaining carbon budget depends on your choices!</p>

				<div>
					<div>
						<p>Limit global warming to:</p>
						<CustomRange
							bind:value={temperature}
							options={data.pathway.choices.temperature.map((d) => Number(d))}
							name="temperature"
						/>
					</div>
					<div>
						<p>Acceptable risk of exceeding global warming limit</p>
						<CustomRange
							bind:value={risk}
							options={data.pathway.choices.exceedanceRisk.map((d) => Number(d))}
							name="risk"
						/>
					</div>
					<div>
						<p>Assumption of non CO2 emissions to mitigate</p>
						<CustomRange
							bind:value={nonCO2}
							options={data.pathway.choices.nonCO2Mitigation.map((d) => Number(d))}
							name="nonCO2"
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="card-compact card flex-1 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Negative emissions</h2>
				<p>
					With less negative emissions you need to reduce faster. The global budget remains the
					same.
				</p>
				<div>
					<p>Assumption amount of negative emissions in 2050 - 2100.</p>
					<CustomRange
						bind:value={negEmis}
						options={data.pathway.choices.negativeEmissions.map((d) => Number(d))}
						name="negEmis"
					/>
				</div>
			</div>
		</div>
		<div class="card-compact card flex-1 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Metrics</h2>

				<p>
					These metrics show the difference between your scenario and the current policy or
					nationally determined contributions.
				</p>

				<div class="stats shadow">
					<div class="stat place-items-center">
						<div class="stat-title">Emission gap</div>
						<div class="stat-value">{($emissionGapTweened / 1_000).toFixed(0)}</div>
						<div class="stat-desc">Gt CO2</div>
						<button
							class="btn-sm btn mt-2"
							on:mouseenter={toggleEmissionGap}
							on:mouseleave={toggleEmissionGap}
						>
							view
						</button>
					</div>

					<div class="stat place-items-center">
						<div class="stat-title">Amibition gap</div>
						<div class="stat-value">{($ambitionGapTweened / 1_000).toFixed(0)}</div>
						<div class="stat-desc">Gt CO2</div>
						<button
							class="btn-sm btn mt-2"
							on:mouseenter={toggleAmbitionGap}
							on:mouseleave={toggleAmbitionGap}
						>
							view
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="flex grow flex-col">
		<div class="tabs">
			<a href="/" class="tab-lifted tab tab-active tab-lg">Global budget</a>
			<a href={`/map${$page.url.search}`} class="tab-lifted tab tab-lg">Country shares</a>
		</div>
		<div class="relative grow bg-base-100 p-4 shadow-lg">
			<Pathway>
				<Line data={data.result.historicalCarbon} x={'time'} y={'value'} color="black" />
				{#if policyPathwayToggles.current || emissionGapHover}
					<Line data={data.result.currentPolicy} x={'time'} y={'mean'} color={ipcc_red} />
					<Area
						data={data.result.currentPolicy}
						x={'time'}
						y0={'min'}
						y1={'max'}
						color={ipcc_red}
					/>
				{/if}
				{#if policyPathwayToggles.ndc || ambitionGapHover}
					<Line data={data.result.ndc} x={'time'} y={'mean'} color={ipcc_blue} />
					<Area data={data.result.ndc} x={'time'} y0={'min'} y1={'max'} color={ipcc_blue} />
				{/if}
				{#if policyPathwayToggles.netzero}
					<Line data={data.result.netzero} x={'time'} y={'mean'} color={ipcc_purple} />
					<Area data={data.result.netzero} x={'time'} y0={'min'} y1={'max'} color={ipcc_purple} />
				{/if}

				{#if ambitionGapHover}
					<Gap
						x={2030}
						y0={data.result.ndc[gapIndex].mean}
						y1={$pathwayCarbonTweened.find((d) => d.time === 2030)?.mean || 0}
					/>
				{/if}
				{#if emissionGapHover}
					<Gap
						x={2030}
						y0={data.result.currentPolicy[gapIndex].mean}
						y1={$pathwayCarbonTweened.find((d) => d.time === 2030)?.mean || 0}
					/>
				{/if}

				<Line data={$pathwayCarbonTweened} x={'time'} y={'mean'} color={ipcc_green} />
				<Area data={$pathwayCarbonTweened} x={'time'} y0={'min'} y1={'max'} color={ipcc_green} />
			</Pathway>

			<div class="absolute bottom-20 left-24">
				<label>
					<b style={`color: ${ipcc_green}`}>▬</b>
					<input type="checkbox" checked disabled />{' '}Your pathway</label
				>
				<h1 class="pb-2 pt-4 text-xl">Reference pathways</h1>
				<ul>
					<li />
					<li>
						<label>
							<b style={`color: ${ipcc_red}`}>▬</b>
							<input type="checkbox" bind:checked={policyPathwayToggles.current} />{' '}Current
							policy</label
						>
					</li>
					<li>
						<label>
							<b style={`color: ${ipcc_blue}`}>▬</b>
							<input type="checkbox" bind:checked={policyPathwayToggles.ndc} />{' '}Nationally
							determined contributions (NDCs)</label
						>
					</li>
					<li>
						<label>
							<b style={`color: ${ipcc_purple}`}>▬</b>
							<input type="checkbox" bind:checked={policyPathwayToggles.netzero} />{' '}Net
							zero-scenarios</label
						>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
