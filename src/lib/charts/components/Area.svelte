<!--
  @component
  Generates an SVG area shape using the `area` function from [d3-shape](https://github.com/d3/d3-shape).
 -->
<script lang="ts">
	import { getContext } from 'svelte';
	import { area, curveLinear } from 'd3-shape';

	const { data, xGet, yScale } = getContext('LayerCake');

	/** @type {String} [fill='#ab00d610'] - The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
	export let fill = '#ab00d610';

	/** @type {Function} [curve=curveLinear] - An optional D3 interpolation function. See [d3-shape](https://github.com/d3/d3-shape#curves) for options. Pass this function in uncalled, i.e. without the open-close parentheses. */
	export let curve = curveLinear;

	// console.log($data.map((d: any) => $yScale(d.y)));

	$: path = area()
		.x($xGet)
		.y1((d) => $yScale(d.y1))
		.y0((d) => $yScale(d.y0))
		.curve(curve);
</script>

<g>
	{#each $data as group}
		<path class="path-area" d={path(group.values)} {fill} />
	{/each}
</g>
