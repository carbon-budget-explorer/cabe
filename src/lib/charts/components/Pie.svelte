<script lang="ts">
	import type { PieArcDatum, ScaleOrdinal } from 'd3';
	import { arc as d3arc } from 'd3-shape';
	import { pie as d3pie } from 'd3-shape';
	import { getContext } from 'svelte';
	import type { PieData } from './Pie';

	const { data, zScale, width, height } = getContext<{
		data: SvelteStore<PieData[]>;
		zScale: SvelteStore<ScaleOrdinal<string, string, never>>;
		width: SvelteStore<number>;
		height: SvelteStore<number>;
	}>('LayerCake');

	$: radius = Math.min($width, $height) / 2 - 1;

	// Compute the position of each group on the pie:
	const pie = d3pie<any, PieData>()
		.sort(null) // Don't sort
		.sortValues(null) // Really don't sort
		.value((d) => d[1]);
	$: slices = pie($data);
	$: arcGenerator = d3arc<any, PieArcDatum<PieData>>().innerRadius(0).outerRadius(radius);
</script>

<g transform="translate({$width / 2}, {$height / 2})">
	{#each slices as slice}
		<path d={arcGenerator(slice)} fill={$zScale(slice.data[0])} stroke="black" />
		<text transform="translate({arcGenerator.centroid(slice)})">
			{slice.data[0]}
		</text>
	{/each}
</g>

<style>
	path {
		stroke-width: style2px;
		opacity: 0.7;
	}
	text {
		text-anchor: middle;
		font-size: 1.5em;
	}
</style>
