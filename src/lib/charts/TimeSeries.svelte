<!-- { filename: 'App.svelte' } -->
<script>
	import { LayerCake, Svg } from 'layercake';
	import AxisX from './components/AxisX.svelte';
	import AxisY from './components/AxisY.svelte';
	import Area from './components/Area.svelte';
	import Line from './components/Line.svelte';

	const points = [
		{ x: 2000, y: 61, y0: 60, y1: 64 },
		{ x: 2005, y: 56, y0: 51, y1: 58 },
		{ x: 2011, y: 40, y0: 31, y1: 43 },
		{ x: 2016, y: 29, y0: 24, y1: 30 },
		{ x: 2022, y: 19, y0: 9, y1: 25 },
		{ x: 2027, y: 13, y0: 8, y1: 13 },
		{ x: 2033, y: 19, y0: 12, y1: 26 },
		{ x: 2038, y: 24, y0: 16, y1: 25 },
		{ x: 2044, y: 11, y0: 4, y1: 14 },
		{ x: 2050, y: -10, y0: -12, y1: -1 }
	];

	const ipcc_fill_green = '#dbe3d2';
	const ipcc_stroke_green = '#82a56e';
	const ipcc_fill_red = '#f39995';
	const ipcc_fill2_red = '#f3c6c5'; // lighter
	const ipcc_stroke_red = '#f5331e';
	const ipcc_fill_blue = '#c2e0e7';
	const ipcc_stroke_blue = '#5bb0c6';
</script>

<div class="chart-container">
	<LayerCake x="x" y="y" data={points}>
		<Svg>
			<AxisX gridlines={true} />
			<AxisY gridlines={true} ticks={4} textAnchor={'end'} />
			<Area fill={ipcc_fill_blue} />
			<Line stroke={ipcc_stroke_blue} />
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
