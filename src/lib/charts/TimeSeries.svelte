<!-- { filename: 'App.svelte' } -->
<script>
	import { LayerCake, Svg } from 'layercake';
	import Scatter from './components/Scatter.svelte';
	import AxisX from './components/AxisX.svelte';
	import AxisY from './components/AxisY.svelte';

	const points = [
		{ x: 0, y: 0 },
		{ x: 5, y: 10 },
		{ x: 10, y: 20 },
		{ x: 15, y: 30 },
		{ x: 20, y: 40 }
	];
</script>

<div class="chart-container">
	<LayerCake x="x" y="y" data={points}>
		<Svg>
			<AxisX gridlines={true} />
			<AxisY gridlines={true} ticks={4} textAnchor={'end'} />
			<!-- You can expose properties on your chart components to make them more reusable -->
			<Scatter fill={'blue'} r={3} />
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
		width: 300px;
		height: 300px;
	}
</style>
