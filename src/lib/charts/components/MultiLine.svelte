<!--
    @component
    Generates an SVG multi-series line chart with shading for uncertainty.

	Paths are animated using svelte transitions, see
	https://devdocs.io/svelte/index#run-time-svelte-transition

    Data should look like this:

    const data = [
		{
			stroke: ipcc_stroke_red,
			fill: ipcc_fill_red,
			values: [
				{ x: 2000, y: 61, y0: 60, y1: 64 },
				{ x: 2005, y: 56, y0: 51, y1: 58 },
				...
			]
		},
		{
			...
		}
	]
 -->
<script>
	import { getContext } from 'svelte';
	import { area, line as d3line, curveLinear } from 'd3-shape';
	import { draw, fade } from 'svelte/transition';
	import { cubicInOut, cubicOut, linear, quintIn, quintOut } from 'svelte/easing';

	const { data, xGet, yGet, yScale } = getContext('LayerCake');

	let curve = curveLinear;
	$: line = d3line().x($xGet).y($yGet).curve(curve);
	$: shade = area()
		.x($xGet)
		.y1((d) => $yScale(d.y1))
		.y0((d) => $yScale(d.y0))
		.curve(curve);
</script>

<g class="line-group">
	{#each $data as group}
		<path
			in:fade={{ duration: 3000, delay: 3000, easing: linear }}
			class="path-area"
			d={shade(group.values)}
			fill={group.fill}
		/>
		<path
			in:draw={{ duration: 3000, delay: 0, easing: linear }}
			class="path-line"
			d={line(group.values)}
			stroke={group.stroke}
		/>
	{/each}
</g>

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 3px;
	}
	.path-area {
		fill-opacity: 0.8;
	}
</style>
