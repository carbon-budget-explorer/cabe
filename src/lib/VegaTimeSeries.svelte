<script lang="ts">
	import type { View, VisualizationSpec } from 'svelte-vega';
	import { VegaLite } from 'svelte-vega';
	import type { Metric } from './metrics';

	export let metricName: string;
	export let data: Metric[];
    console.log(metricName)

	$: spec = {
		$schema: 'https://vega.github.io/schema/vega/v5.json',
		description: `${metricName} over time`,
		width: 960,
		height: 500,
		autosize: 'none',
		data: [{ name: 'table' }],
		mark: 'bar',
        encoding: {
            x: { field: 'Time', type: 'nominal' },
            y: { field: metricName, type: 'quantitative' },
        }
	} as VisualizationSpec;
    
    let viewV: View;
    $: viewV ? console.log('Vega view: ', viewV.data('table'), viewV.getState()) : '';
</script>

<VegaLite data={{table: data}} {spec} bind:view={viewV}  />
