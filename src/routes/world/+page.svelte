<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import RegionFilter from '$lib/RegionFilter.svelte';

	import VegaMap from '$lib/VegaMap.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let region: string;
	const gotoRegion = (region: string) => {
		if (browser && region !== undefined && region !== '') {
			goto(`/regions/${region}`);
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

	function gotoTotalVariable(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.delete('sc');
			params.delete('sv');
			params.set('tv', event.currentTarget.value);
			params.set('year', selectedYear.toString());
			goto(`?${params.toString()}`);
		}
	}

	function gotoScenarioCategory(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.delete('tv');
			params.set('sc', event.currentTarget.value);
			params.set(
				'sv',
				data.scenarios.variable ? data.scenarios.variable : data.scenarios.variables[0][0]
			);
			params.set('year', selectedYear.toString());
			goto(`?${params.toString()}`);
		}
	}

	function gotoScenarioVariable(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.delete('tv');
			params.set('sv', event.currentTarget.value);
			params.set(
				'sc',
				data.scenarios.category ? data.scenarios.category : data.scenarios.categories[0]
			);
			params.set('year', selectedYear.toString());
			goto(`?${params.toString()}`);
		}
	}
</script>

<h1 class="text-3xl font-bold">World explorer</h1>
<main class="flex flex-row justify-between gap-4">
	<div>
		<div>
			<p>
				Make a selection by double clicking on a region. Use mouse wheel to zoom and drag to pan
				map.
			</p>

			<VegaMap
				borders={data.borders}
				metrics={data.metrics}
				metricName={data.metricName}
				bind:region
			/>
			<p />
		</div>
		<div class="flew-row flex justify-around gap-4">
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
			<div>
				<h3 class="text-xl">Totals</h3>
				<label class="block">
					<div class="flex flex-col">
						{#each data.totals.variables as variable}
							<label>
								<input
									type="radio"
									name="sv"
									value={variable}
									checked={data.totals.variable === variable}
									on:change={gotoTotalVariable}
								/>
								{variable}
							</label>
						{/each}
					</div>
				</label>
			</div>
			<div>
				<h3 class="text-xl">Scenarios</h3>
				<label>
					Category
					<select value={data.scenarios.category} on:change={gotoScenarioCategory}>
						<option value="" />
						{#each data.scenarios.categories as category}
							<option value={category}>
								{category}
							</option>
						{/each}
					</select>
				</label>
				<label>
					<p>Effort-sharing principle</p>
					<div class="flex flex-col">
						{#each data.scenarios.variables as [variable, label]}
							<!-- TODO render variable without label -->
							{#if label !== variable}
								<label>
									<input
										type="radio"
										name="sv"
										value={variable}
										checked={data.scenarios.variable === variable}
										on:change={gotoScenarioVariable}
									/>
									{label}
								</label>
							{/if}
						{/each}
					</div>
				</label>
			</div>
		</div>
	</div>
	<div>
		<RegionFilter metrics={data.metrics} />
	</div>
</main>
<footer>
	<a href="/">Go back</a>
</footer>
