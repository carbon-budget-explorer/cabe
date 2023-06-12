<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// import VegaLiteMap from "$lib/VegaLiteMap.svelte";
	import VegaMap from '$lib/VegaMap.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let country: string;
	const gotoCountry = (country: string) => {
		if (browser && country !== undefined && country !== '') {
			goto(`/countries/${country}`);
		}
	};
	$: gotoCountry(country);

	let selectedYear: string = data.year;
	function gotoYear(event: any) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set('year', event.target.value);
			goto(`?${params.toString()}`);
		}
	}
</script>

<h1>World explorer</h1>
<p>Make a selection by double clicking on a country. Use mouse wheel to zoom and drag to pan map.</p>
<VegaMap metrics={data.metrics} metricName={data.metricName} bind:country />
<p />
<select bind:value={selectedYear} on:change={gotoYear}>
	{#each data.years as year}
		<option value={year}>
			{year}
		</option>
	{/each}
</select>
<ul>
	<li>
		<a href="?metric=Population">Population</a>
	</li>
	<li>
		<a href="?metric=GDP">GDP</a>
	</li>
</ul>

<a href="/">Go back</a>
