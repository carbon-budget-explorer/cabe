<script lang="ts">
	import type { PageData } from '../global/$types';

	import PathwayForm from '$lib/PathwayForm.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Pathway from '$lib/charts/Pathway.svelte';
	import Line from '$lib/charts/components/Line.svelte';
	import Area from '$lib/charts/components/Area.svelte';
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

	let policyPathwayToggles = {
		current: true,
		ndc: false,
		netzero: false
	};
</script>

<div class="flex h-full flex-col items-center">
	<div class="flex w-full grow flex-row justify-between gap-4">
		<div class="flex max-w-[25%] flex-col gap-4 p-4 shadow-lg">
			<div>
				<h1 class="text-xl">Compose your pathway</h1>
				<h2>Choose from the options below and see how it affects the remaining carbon budget.</h2>
			</div>
			<div class="">
				<PathwayForm
					choices={data.pathway.choices}
					query={data.pathway.query}
					onChange={updateQueryParam}
				/>
			</div>
			<div class="rounded-lg border-4 p-2">
				<ul>
					<li>Global budget: {data.result.pathwayStats.total.toFixed(2)} GtCO2</li>
					<li>Used 1850-2021: {data.result.pathwayStats.used.toFixed(2)} GtCO2</li>
					<li>Remaining till 2050: {data.result.pathwayStats.remaining.toFixed(2)} GtCO2</li>
				</ul>
			</div>
		</div>
		<div class="flex grow flex-col gap-4">
			<div class="grow p-4 shadow-lg">
				<Pathway>
					<Line data={data.result.historicalCarbon} x={'time'} y={'value'} color="black" />
					<Line data={data.result.pathwayCarbon} x={'time'} y={'mean'} color={ipcc_green} />
					<Area
						data={data.result.pathwayCarbon}
						x={'time'}
						y0={'min'}
						y1={'max'}
						color={ipcc_green}
					/>
					{#if policyPathwayToggles.current}
						<Line data={data.result.currentPolicy} x={'time'} y={'value'} color={ipcc_red} />
					{/if}
					{#if policyPathwayToggles.ndc}
						<Line data={data.result.ndc} x={'time'} y={'value'} color={ipcc_blue} />
					{/if}
					{#if policyPathwayToggles.netzero}
						<Line data={data.result.netzero} x={'time'} y={'value'} color={ipcc_purple} />
					{/if}
					<!--
					<Gap year={2030} name="Ambition" from={ndc.find(d => d.Time === 2030)} to={co2remaining.find(d => d.Time === 2030)}>
					<Gap year={2030} name="Emission" from={currentpolicy.find(d => d.Time === 2030)} to={co2remaining.find(d => d.Time === 2030)}>
					-->
				</Pathway>
			</div>
			<div class="p-4 shadow-lg">
				<h1>Difference between your scenario and current policy</h1>
				<ul>
					<li>Ambition gap: {data.result.ambitionGap.toFixed(2)} GtCO2</li>
					<li>Emission gap: {data.result.emissionGap.toFixed(2)} GtCO2</li>
				</ul>
			</div>
		</div>
		<div class="flex h-full max-w-[25%] flex-col justify-between gap-4 p-4 shadow-lg">
			<div>
				<h1 class="text-xl">Reference pathways</h1>
				<!-- <h2>(Currenty policy)</h2> -->
				<h2>Compare your own pathway with the following references:</h2>
			</div>
			<div class="grow">
				<ul>
					<li>
						<label
							><input type="checkbox" bind:checked={policyPathwayToggles.current} />{' '}Current
							policy</label
						>
					</li>
					<li>
						<label
							><input type="checkbox" bind:checked={policyPathwayToggles.ndc} />{' '}Nationally
							determined contributions (NDCs)</label
						>
					</li>
					<li>
						<label
							><input type="checkbox" bind:checked={policyPathwayToggles.netzero} />{' '}Net
							zero-scenarios</label
						>
					</li>
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
