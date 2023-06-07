<script lang="ts">
	// import VegaLiteMap from "$lib/VegaLiteMap.svelte";
	import VegaMap from "$lib/VegaMap.svelte";
	import type { PageData } from './$types';

	export let data: PageData;
	let country: string;
</script>

<h1>World explorer</h1>
<p>Make a selection by clicking on a country.</p>
<p>Selected country: {country}</p>
<a href="/">Go back</a>
<VegaMap metrics={data.metrics} bind:country />
