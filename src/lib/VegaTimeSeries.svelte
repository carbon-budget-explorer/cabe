<script lang="ts">
	import type { VisualizationSpec } from 'svelte-vega';
	import { VegaLite } from 'svelte-vega';

	export let metricName: string;
	export let data: any;

	$: spec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		title: `${metricName} over time`,
		width: 960,
		height: 200,
		// autosize: 'none',
		data: {
			values: data,
		},
		mark: 'line',
		encoding: {
			x: { field: 'Time', type: 'ordinal' },
			y: { field: metricName, type: 'quantitative' }
		}
	} as VisualizationSpec;
</script>

<VegaLite {spec} />
