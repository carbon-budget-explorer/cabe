<!-- { filename: 'App.svelte' } -->
<script lang="ts">
	import { LayerCake, Svg, flatten } from 'layercake';
	import AxisX from './components/AxisX.svelte';
	import AxisY from './components/AxisY.svelte';
	import MultiLine from './components/MultiLine.svelte';

	// TODO generalize to colormap component or so
	const ipcc_fill_green = '#dbe3d2';
	const ipcc_stroke_green = '#82a56e';
	const ipcc_fill_red = '#f39995';
	const ipcc_fill2_red = '#f3c6c5'; // lighter
	const ipcc_stroke_red = '#f5331e';
	const ipcc_fill_blue = '#c2e0e7';
	const ipcc_stroke_blue = '#5bb0c6';

	const points = [
		{
			group: 'a',
			stroke: ipcc_stroke_red,
			fill: ipcc_fill_red,
			values: [
				{ x: 2000, y: 61, y0: 60, y1: 64, group: 'a' },
				{ x: 2005, y: 56, y0: 51, y1: 58, group: 'a' },
				{ x: 2011, y: 40, y0: 31, y1: 43, group: 'a' },
				{ x: 2016, y: 29, y0: 24, y1: 30, group: 'a' },
				{ x: 2022, y: 19, y0: 9, y1: 25, group: 'a' },
				{ x: 2027, y: 13, y0: 8, y1: 13, group: 'a' },
				{ x: 2033, y: 19, y0: 12, y1: 26, group: 'a' },
				{ x: 2038, y: 24, y0: 16, y1: 25, group: 'a' },
				{ x: 2044, y: 11, y0: 4, y1: 14, group: 'a' },
				{ x: 2050, y: -10, y0: -12, y1: -1, group: 'a' }
			]
		},
		{
			group: 'b',
			stroke: ipcc_stroke_green,
			fill: ipcc_fill_green,
			values: [
				{ x: 2000, y: 65, y0: 55, y1: 68, group: 'b' },
				{ x: 2005, y: 54, y0: 49, y1: 58, group: 'b' },
				{ x: 2011, y: 51, y0: 48, y1: 56, group: 'b' },
				{ x: 2016, y: 24, y0: 22, y1: 29, group: 'b' },
				{ x: 2022, y: 20, y0: 12, y1: 27, group: 'b' },
				{ x: 2027, y: 25, y0: 18, y1: 30, group: 'b' },
				{ x: 2033, y: 22, y0: 15, y1: 26, group: 'b' },
				{ x: 2038, y: 15, y0: 14, y1: 18, group: 'b' },
				{ x: 2044, y: 1, y0: -5, y1: 8, group: 'b' },
				{ x: 2050, y: 18, y0: 12, y1: 22, group: 'b' }
			]
		}
	];
</script>

<div class="chart-container">
	<LayerCake x="x" y="y" z="group" data={points} flatData={flatten(points, 'values')}>
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
		width: 500px;
		height: 200px;
	}
</style>
