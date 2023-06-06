<script lang="ts">
	import VegaMap from "$lib/VegaMap.svelte";
	import type { PageData } from './$types';

	export let data: PageData;
</script>
<h1>World explorer</h1>
<p>Make a selection and view the map!</p>
<a href="/">Go back</a>
<!-- <Map metrics={data.metrics} /> -->
<VegaMap />
