<!-- { filename: 'App.svelte' } -->
<script lang="ts">
	import { LayerCake, Svg, flatten } from 'layercake';
	import AxisX from './components/AxisX.svelte';
	import AxisY from './components/AxisY.svelte';
	import MultiLine from './components/MultiLine.svelte';
	import type { LineData } from './components/MultiLine';

	export let data: LineData[];

	$: yDomain = [-15_000, 45_000]
	$: xDomain = [ 1990,2100]
</script>

<div class="chart-container p-10">
	<LayerCake x="x" y="y" z="group" {data} flatData={flatten(data, 'values')} {yDomain} {xDomain}>
		<Svg>
			<AxisX gridlines={true} />
			<AxisY gridlines={true} ticks={4} textAnchor={'end'} />
			<MultiLine />
		</Svg>
	</LayerCake>
</div>

<style>
	/*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
	.chart-container {
		/* width: 500px;
		height: 200px; */
		width: 100%;
		height: 100%;
	}
</style>
