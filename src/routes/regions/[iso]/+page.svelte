<script lang="ts">
	import MiniMap from '$lib/MiniMap.svelte';
	import VegaTimeSeries from '$lib/VegaTimeSeries.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>{data.name}</h1>
<main>
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
	<a href="/world">Go back</a>
</footer>

<style>
	main {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
