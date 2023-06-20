<script lang="ts">
	import type { SignalListeners, VisualizationSpec } from 'svelte-vega';
	import { Vega } from 'svelte-vega';
	import type { Metric } from './metrics';

	export let metricName: string;
	export let metrics: Metric[];
	export let country: any;

	function updateCountry(_: string, value: unknown) {
		country = value;
	}

	const signalListeners: SignalListeners = {
		selectedCountry: updateCountry
	};

	$: spec = {
		$schema: 'https://vega.github.io/schema/vega/v5.json',
		description: 'Test map',
		width: 960,
		height: 500,
		autosize: 'none',
		signals: [
			{
				name: 'selectedCountry',
				description: 'A country ISO code that updates in response to mouse click',
				value: '',
				on: [{ events: 'dblclick', update: "datum ? datum.properties.ISO_A3_EH : ''" }] // ISO_A3 not set for FRA
			},
			{ name: 'tx', update: 'width / 2' },
			{ name: 'ty', update: 'height / 2' },
			{
				name: 'scale',
				value: 150,
				on: [
					{
						events: { type: 'wheel', consume: true },
						update:
							'clamp(scale * pow(1.0005, -event.deltaY * pow(16, event.deltaMode)), 150, 3000)'
					}
				]
			},
			{
				name: 'angles',
				value: [0, 0],
				on: [
					{
						events: 'mousedown',
						update: '[rotateX, centerY]'
					}
				]
			},
			{
				name: 'cloned',
				value: null,
				on: [
					{
						events: 'mousedown',
						update: "copy('projection')"
					}
				]
			},
			{
				name: 'start',
				value: null,
				on: [
					{
						events: 'mousedown',
						update: 'invert(cloned, xy())'
					}
				]
			},
			{
				name: 'drag',
				value: null,
				on: [
					{
						events: '[mousedown, window:mouseup] > window:mousemove',
						update: 'invert(cloned, xy())'
					}
				]
			},
			{
				name: 'delta',
				value: null,
				on: [
					{
						events: { signal: 'drag' },
						update: '[drag[0] - start[0], start[1] - drag[1]]'
					}
				]
			},
			{
				name: 'rotateX',
				value: 0,
				on: [
					{
						events: { signal: 'delta' },
						update: 'angles[0] + delta[0]'
					}
				]
			},
			{
				name: 'centerY',
				value: 0,
				on: [
					{
						events: { signal: 'delta' },
						update: 'clamp(angles[1] + delta[1], -60, 60)'
					}
				]
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
				url: '/country_borders.geojson',
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
		projections: [
			{
				name: 'projection',
				type: 'equalEarth',
				scale: { signal: 'scale' },
				rotate: [{ signal: 'rotateX' }, 0, 0],
				center: [0, { signal: 'centerY' }],
				translate: [{ signal: 'tx' }, { signal: 'ty' }]
			}
		],
		scales: [
			{
				name: 'color',
				type: 'log',
				domain: { data: 'countries', field: metricName },
				range: { scheme: 'cividis' }
			}
		],
		legends: [
			{
				fill: 'color',
				orient: 'bottom-left',
				title: metricName
			}
		],
		marks: [
			{
				type: 'shape',
				from: { data: 'countries' },
				encode: {
					enter: { tooltip: { 
						signal: `{ title: datum.properties.ISO_A3_EH, ${metricName} : format(datum.${metricName}, 's') }`
					} },
					update: { fill: { signal: `scale('color',  datum.${metricName}) || 'grey'` } },
					hover: { fill: { value: 'red' } }
				},
				transform: [{ type: 'geoshape', projection: 'projection' }]
			}
		]
	} as VisualizationSpec;
</script>

<Vega {spec} {signalListeners} />
