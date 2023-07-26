<script lang="ts">
	import { scaleOrdinal } from 'd3-scale';
	import { arc as d3arc } from 'd3-shape';
	import { pie as d3pie } from 'd3-shape';

	const width = 500;
	const height = 500;

	export let used: number;
	export let remaining: number;

	const radius = 250;

	$: data = { used, remaining };
	$: console.log(data);

	// const color = scaleOrdinal().range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56']);
	const color = scaleOrdinal().range(['red', 'green']);

	// Compute the position of each group on the pie:
	const pie = d3pie().value(function (d: any) {
		return d[1];
	});
	$: data_ready = pie(Object.entries(data));
    $: console.log(data_ready)
	const arcGenerator = d3arc().innerRadius(0).outerRadius(radius);
</script>

<div class="chart-container" id="my_dataviz">
	<svg {width} {height}>
		<g transform="translate({width / 2}, {height / 2})">
			{#each data_ready as slice, i}
				<path
					d={arcGenerator(slice)}
                    fill={color(i)}
					stroke="black"
				/>
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
