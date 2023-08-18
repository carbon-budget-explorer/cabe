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

	export let data: Record<string, number>[];
	export let x = 'x';
	export let y0 = 'y0';
	export let y1 = 'y1';
	export let fill = '#ab00d6';

	$: shade = area<Record<string, number>>()
		.x((d) => $xScale(d[x]))
		.y1((d) => $yScale(d[y1]))
		.y0((d) => $yScale(d[y0]))
		.curve(curveLinear);
	$: path = shade(data);
</script>

<path class="path-area" d={path} {fill} />

<style>
	.path-area {
		fill-opacity: 0.8;
	}
</style>
