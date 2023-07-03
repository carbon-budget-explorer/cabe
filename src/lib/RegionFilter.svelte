<script lang="ts">
	import type { NamedSpatialMetric } from './server/db/utils';

	export let metrics: NamedSpatialMetric[];
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
	// TODO some region does not have name, only ISO
</script>

<div>
	<input bind:value={query} />
	<button title="Clear query" disabled={query === ''} on:click={() => (query = '')}>X</button>
</div>
<ul>
	{#each filteredMetrics as region}
		<li>
			<a href={`/regions/${region.ISO}`}>{region.name}</a>
		</li>
	{/each}
</ul>
