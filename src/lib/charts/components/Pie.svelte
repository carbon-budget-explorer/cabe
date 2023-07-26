<script lang="ts">
	import type { PieArcDatum } from 'd3';
	import { scaleOrdinal } from 'd3-scale';
	import { arc as d3arc } from 'd3-shape';
	import { pie as d3pie } from 'd3-shape';

	const width = 500;
	const height = 500;

	export let used: number;
	export let remaining: number;

	const radius = 250;

	type PieData = [string, number];
	$: data = [
		['used', used],
		['remaining', remaining]
	] as PieData[];

	$: color = scaleOrdinal<string>()
		.range(['red', 'green'])
		.domain(data.map((d) => d[0]));

	// Compute the position of each group on the pie:
	const pie = d3pie<any, PieData>()
		.sort(null)  // Don't sort
		.sortValues(null) // Really don't sort
		.value((d) => d[1]);
	$: data_ready = pie(data);
	const arcGenerator = d3arc<any, PieArcDatum<PieData>>().innerRadius(0).outerRadius(radius);
</script>

<div class="chart-container">
	<svg {width} {height}>
		<g transform="translate({width / 2}, {height / 2})">
			{#each data_ready as slice}
				<path d={arcGenerator(slice)} fill={color(slice.data[0])} stroke="black" />
				<text transform="translate({arcGenerator.centroid(slice)})">
					{slice.data[0]}
				</text>
			{/each}
		</g>
	</svg>
</div>

<style>
	.chart-container {
		width: 500px;
		height: 500px;
		margin: 40;
	}
	path {
		stroke-width: style2px;
		opacity: 0.7;
	}
	text {
		text-anchor: middle;
		font-size: 1.5em;
	}
</style>
