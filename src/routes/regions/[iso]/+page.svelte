<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GlobalBudgetForm from '$lib/PathwayForm.svelte';

	// import MiniMap from '$lib/MiniMap.svelte';
	import VegaTimeSeries from '$lib/VegaTimeSeries.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	function updateQueryParam(name: string, value: string) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set(name, value);
			goto(`?${params.toString()}`);
		}
	}
</script>

<h1 class="text-3xl font-bold">{data.name}</h1>
<main class="flex flex-row justify-between gap-4">
	<details>
		<summary>Global</summary>
		<GlobalBudgetForm
			choices={data.pathway.choices}
			query={data.pathway.query}
			onChange={updateQueryParam}
		/>
	</details>
	<div>
		<VegaTimeSeries
			data={data.timeseries.data}
			title={`${data.timeseries.label} effort-sharing principle`}
			yLabel="CO2 emissions (GtCO2)"
		/>
		<!-- TODO add more scenarios -->
		<p>Text about the region.</p>
	</div>
	<div>
		<div>
			Minimap
			<!-- <MiniMap borders={data.borders} /> -->
		</div>
		<div>Side bar</div>
	</div>
</main>
