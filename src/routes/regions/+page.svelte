<script lang="ts">
	import { page } from '$app/stores';
	import RegionFilter from '$lib/RegionFilter.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-3xl font-bold">Pick a region</h1>
<!-- TODO add world map to pick a country with -->
<RegionFilter regions={data.regions} searchParams={$page.url.search} />
