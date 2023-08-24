<!--
  @component
  Generates an SVG area shape using the `area` function from [d3-shape](https://github.com/d3/d3-shape).
 -->
<script lang="ts">
	import type { ScaleLinear } from 'd3';
	import { area, curveLinear } from 'd3-shape';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	const { xScale, yScale } = getContext<{
		xScale: Readable<ScaleLinear<number, number, never>>;
		yScale: Readable<ScaleLinear<number, number, never>>;
	}>('LayerCake');

	export let data: Record<string, number[]>;
	export let x = 'x';
	export let y0 = 'y0';
	export let y1 = 'y1';
	export let color = '#ab00d6';

	$: shade = area<number>()
		.x((d) => $xScale(d))
		.y1((_, i) => $yScale(data[y1][i]))
		.y0((_, i) => $yScale(data[y0][i]))
		.curve(curveLinear);
	$: path = shade(data[x]);
</script>

<path class="path-area" d={path} fill={color} />

<style>
	.path-area {
		fill-opacity: 0.5;
	}
</style>
