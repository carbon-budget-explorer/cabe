<script lang="ts">
	import type { VisualizationSpec } from 'svelte-vega';
	import { VegaLite } from 'svelte-vega';
	import type { TemnporalMetric } from './server/db/utils';

	export let yLabel: string;
	export let title: string = yLabel;
	export let data: TemnporalMetric[];

	$: spec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		title,
		width: 960,
		height: 200,
		// autosize: 'none',
		data: {
			values: data
		},
		mark: 'line',
		encoding: {
			// TODO have less ticks
			x: { field: 'Time', type: 'ordinal' },
			y: { field: 'value', type: 'quantitative', title: yLabel }
		}
	} as VisualizationSpec;
</script>

<VegaLite {spec} />
