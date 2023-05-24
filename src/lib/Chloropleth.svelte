<script>
	import { VegaLite } from 'svelte-vega';
	import topojson from 'world-atlas/countries-110m.json';

	export let features;

	// Based on https://vega.github.io/vega-lite/examples/choropleth_unemployment.html
	const data = {
		topojson,
		// features,
	};

	/** @type {import('svelte-vega').VisualizationSpec}  */
	const spec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		width: 1200,
		height: 800,
		data: {
			name: 'topojson',
			format: {
				type: 'topojson',
				feature: 'countries'
			}
		},
		// transform: [
		// 	{
		// 		lookup: 'id',
		// 		from: {
		// 			data: {
		// 				name: 'features'
		// 			},
		// 			key: 'id',
		// 			fields: ['population']
		// 		},
		// 		default: 0
		// 	}
		// ],
		mark: 'geoshape',
		projection: {
			type: 'naturalEarth1'
		},
		encoding: {
			color: {
				"value": "red",
				// field: 'population',
				// type: 'quantitative'
			}
		}
	};

	/** @type {import('svelte-vega').View}*/
	let view;
	$: view ? console.log(view.data('topojson')) : '';
</script>

<VegaLite {data} {spec} bind:view={view}/>
