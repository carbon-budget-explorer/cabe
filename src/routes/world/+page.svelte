<script lang="ts">
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GlobalBudgetForm from '$lib/GlobalBudgetForm.svelte';
	import RegionFilter from '$lib/RegionFilter.svelte';

	import VegaMap from '$lib/VegaMap.svelte';
	import { principles } from '$lib/principles';
	import type { PageData } from './$types';

	export let data: PageData;

	let region: string;
	const gotoRegion = (region: string) => {
		if (browser && region !== undefined && region !== '') {
			goto(`/regions/${region}${$page.url.search}`);
		}
	};
	$: gotoRegion(region);

	type ChangeEvent = Event & {
		currentTarget: EventTarget & (HTMLSelectElement | HTMLInputElement);
	};

	let selectedYear: number = data.year;
	function gotoYear(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set('year', event.currentTarget.value);
			goto(`?${params.toString()}`);
		}
	}

	function updateQueryParam(name: string, value: string) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set(name, value);
			goto(`?${params.toString()}`);
		}
	}

	let showCountriesPanel = false;
</script>

<h1 class="text-3xl font-bold">World explorer</h1>
<main class="flex flex-row justify-between gap-4">
	<div class="flex flex-col gap-4">
		<details>
			<summary>Global</summary>
			<GlobalBudgetForm
			choices={data.globalBudget.choices}
			query={data.globalBudget.query}
			onChange={updateQueryParam}
			/>
		</details>
		<div>
			<p>Effort-sharing principle</p>
			<div class="flex flex-col">
				{#each data.effortSharing.choices as choice}
					<!-- TODO render variable without label -->
					<label>
						<input
							type="radio"
							name="effortSharing"
							value={choice}
							checked={data.effortSharing.query === choice}
							on:change={() => updateQueryParam('effortSharing', choice)}
						/>
						{principles.get(choice)}
					</label>
				{/each}
			</div>
		</div>
		<div>
			<div>
				<h3 class="text-xl">Year</h3>
				<select bind:value={selectedYear} on:change={gotoYear}>
					{#each data.years as year}
						<option value={year}>
							{year}
						</option>
					{/each}
				</select>
			</div>
		</div>
		<div>
			<p>Variable</p>
			<ul>
				<li>
					<label>
						<input type="radio" name="variable" value="CO2" checked={true} />
						CO2
					</label>
				</li>
				<!-- <li>Population</li>
				<li>Gross Domestic Product (GDP)</li>
				<li>CO2 historical</li>
				<li>CO2 base</li> -->
			</ul>
		</div>
	</div>
	<div>
		<div>
			<p>
				Make a selection by double clicking on a region. Use mouse wheel to zoom and drag to pan
				map.
			</p>

			<VegaMap
				borders={data.borders}
				metrics={data.metrics}
				metricName={'CO2'}
				bind:region
			/>
			<p />
		</div>
	</div>
	<div>
		<button on:click={() => (showCountriesPanel = !showCountriesPanel)}>🔎</button>
		{#if showCountriesPanel}
			<div transition:slide={{ axis: 'x' }}>
				<RegionFilter metrics={data.metrics} searchParams={$page.url.search} />
			</div>
		{/if}
	</div>
</main>
