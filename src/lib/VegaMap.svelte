<script lang="ts">
	import type { SignalListeners, VisualizationSpec } from 'svelte-vega';
	import { Vega } from 'svelte-vega';
	import type { Metric } from './metrics';

	export let metrics: Metric[];
	export let country: any;

	function updateCountry(_: string, value: unknown) {
		country = value;
	}

	const signalListeners: SignalListeners = {
		selectedCountry: updateCountry
	};

	const spec: VisualizationSpec = {
		$schema: 'https://vega.github.io/schema/vega/v5.json',
		description: 'Test map',
		width: 960,
		height: 500,
		autosize: 'none',
		signals: [
			{
				name: 'selectedCountry',
				description: 'A country ISO code that updates in response to mouse click',
				value: 'NLD',
				on: [{ events: 'mousedown', update: "datum ? datum.properties.ISO_A3_EH : ''" }] // ISO_A3 not set for FRA
			}
		],
		data: [
			{
				name: 'metrics',
				values: metrics,
				format: { type: 'json', parse: 'auto' }
				// async: true,
			},
			{
				name: 'countries',
				// url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
				url: '/ne_110m_admin_0_countries.geojson',
				format: { type: 'json', property: 'features' },
				transform: [
					{
						type: 'lookup',
						from: 'metrics',
						key: 'ISO',
						fields: ['properties.ISO_A3_EH'], // fields from countries for joining the data
						values: ['Population', 'GDP'], // fields from metrics to add to the data
						default: 'unknown'
					}
				]
			}
		],
		projections: [{ name: 'projection', type: 'naturalEarth1' }],
		scales: [
			{
				name: 'color',
				type: 'log',
				domain: { data: 'countries', field: 'GDP' },
				range: { scheme: 'cividis' }
			}
		],
		legends: [
			{
				fill: 'color',
				orient: 'bottom-left',
				title: 'Median GDP'
			}
		],
		marks: [
			{
				type: 'shape',
				from: { data: 'countries' },
				encode: {
					enter: { tooltip: { field: 'properties.GDP_MD' } }, // Note this is population from NE world data
					update: { fill: { scale: 'color', field: 'GDP' } }, // Note this is population from other source
					hover: { fill: { value: 'red' } }
				},
				transform: [{ type: 'geoshape', projection: 'projection' }]
			}
		]
	};
</script>

<Vega {spec} {signalListeners} />
