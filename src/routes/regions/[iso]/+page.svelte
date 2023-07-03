<script lang="ts">
	import MiniMap from '$lib/MiniMap.svelte';
	import VegaTimeSeries from '$lib/VegaTimeSeries.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1 class="text-3xl font-bold">{data.name}</h1>
<main class="flex flex-row justify-between">
	<div>
		<VegaTimeSeries data={data.gdp} yLabel="GDP" />
		<VegaTimeSeries data={data.population} yLabel="Population" />
		<VegaTimeSeries
			data={data.GF}
			title="Grand fathering principle"
			yLabel="Temperature rise associated with NDC"
		/>
		<!-- TODO add more scenarios -->
	</div>
	<div>
		<MiniMap borders={data.borders} />
	</div>
</main>
<footer>
	<a class="underline" href="/world">Go back</a>
</footer>
