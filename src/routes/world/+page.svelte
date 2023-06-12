<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	// import VegaLiteMap from "$lib/VegaLiteMap.svelte";
	import VegaMap from '$lib/VegaMap.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let country: string;

	const gotoCountry = (country: string) => {
		if (browser && country !== undefined) {
			goto(`/countries/${country}`);
		}
	};

	$: gotoCountry(country);
</script>

<h1>World explorer</h1>
<p>Make a selection by clicking on a country.</p>
<VegaMap metrics={data.metrics} metricName={data.metricName} bind:country />
<ul>
	<li>
		<a href="?year=2018">Go to 2018</a>
	</li>
	<li>
		<a href="?year=2019">Go to 2019</a>
	</li>
	<li>
		<a href="?year=2020">Go to 2020</a>
	</li>
</ul>
<ul>
	<li>
		<a href="?metric=Population">Population</a>
	</li>
	<li>
		<a href="?metric=GDP">GDP</a>
	</li>
</ul>

<a href="/">Go back</a>