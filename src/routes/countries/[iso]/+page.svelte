<script lang="ts">
	import MiniMap from '$lib/MiniMap.svelte';
	import VegaTimeSeries from '$lib/VegaTimeSeries.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>{data.name}</h1>
<main>
	<div>
		<h2>GDP</h2>
		<VegaTimeSeries data={data.gdp} metricName="value" />
		<h2>Population</h2>
		<VegaTimeSeries data={data.population} metricName="value" />
	</div>
	<div>
		<MiniMap />
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
