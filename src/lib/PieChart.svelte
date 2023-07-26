<script lang="ts">
	import { VegaLite, type VisualizationSpec } from 'svelte-vega';

	export let used: number;
	export let remaining: number;

	$: data = {
		table: [
			{ category: 'Used', amount: used },
			{ category: 'Remaining', amount: remaining }
		]
	};
	$: spec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v4.json',
		description: `Total: ${used + remaining} Gt CO2 equivalent`,
		data: {
			name: 'table'
		},
		width: 500,
		height: 500,
		title: 'Carbon Budget',
		encoding: {
			color: { field: 'category', type: 'nominal', legend: null },
			theta: { field: 'amount', type: 'quantitative', stack: true }
		},
		layer: [
			{
				mark: { type: 'arc', outerRadius: 260 }
			},
			{
				mark: { type: 'text', radius: 190, stroke: 'white', fontSize: 20, fill: 'white' },
				encoding: {
					text: { field: 'category', type: 'nominal' }
				}
			}
		]
	} as VisualizationSpec;
</script>

<VegaLite {spec} {data} />
