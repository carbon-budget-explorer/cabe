<script lang="ts">
	import type { View, VisualizationSpec } from 'svelte-vega';
	import { VegaLite } from 'svelte-vega';
	import type { Metric } from './metrics';

	export let metricName: string;
	export let data: Metric[];
	console.log(metricName);

	$: spec = {
		$schema: 'https://vega.github.io/schema/vega/v5.json',
		title: `${metricName} over time`,
		width: 960,
		height: 500,
		// autosize: 'none',
		data: {
			values: data
		},
		mark: 'bar',
		encoding: {
			x: { field: 'Time', type: 'ordinal' },
			y: { field: metricName, type: 'quantitative' }
		}
	} as VisualizationSpec;

	let view: View;
	$: view ? console.log('Vega view: ', data, view.getState()) : '';
</script>

<VegaLite {spec} bind:view={view} />
