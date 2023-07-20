<script lang="ts">
	// import MiniMap from '$lib/MiniMap.svelte';
	import VegaTimeSeries from '$lib/VegaTimeSeries.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1 class="text-3xl font-bold">{data.name}</h1>
<main class="flex flex-row justify-between gap-4">
	<div>
		<VegaTimeSeries data={data.gdp} yLabel="GDP" />
		<VegaTimeSeries data={data.population} yLabel="Population" />
		<VegaTimeSeries
			data={data.GF.data}
			title={`${data.GF.label} effort-sharing principle`}
			yLabel="Temperature rise associated with NDC"
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
