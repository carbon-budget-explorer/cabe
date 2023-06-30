<script lang="ts">
	import type { NamedMetric } from './metrics';

	export let metrics: any;
	let query = '';
	$: filteredMetrics = metrics
		.filter((a) => a.ISO !== undefined && a.ISO !== null)
		.sort((a, b) => a.ISO.localeCompare(b.ISO))
		.filter((d) => {
			return (
				query === '' ||
				d.ISO.includes(query) ||
				(d.name !== null && d.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
			);
		});
	// TODO when hovered higlight in map and vice versa
	// TODO use same color as in map
	// TODO some country does not have name, only ISO
</script>

<div>
	<input bind:value={query} />
	<button title="Clear query" disabled={query === ''} on:click={() => (query = '')}>X</button>
</div>
<ul>
	{#each filteredMetrics as country}
		<li>
			<a href={`/countries/${country.ISO}`}>{country.name}</a>
		</li>
	{/each}
</ul>
