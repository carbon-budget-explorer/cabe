<script lang="ts">
	import VegaTimeSeries from '$lib/VegaTimeSeries.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	console.log(data);
</script>

<h1>{data.name}</h1>
<main>
	<VegaTimeSeries data={data.metrics} metricName="GDP" />
	<VegaTimeSeries data={data.metrics} metricName="Population" />
</main>
<footer>
	<a href="/world">Go back</a>
</footer>
