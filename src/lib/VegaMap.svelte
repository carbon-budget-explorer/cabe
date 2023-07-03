<script lang="ts">
	import type { SignalListeners, VisualizationSpec } from 'svelte-vega';
	import { Vega } from 'svelte-vega';
	import type { Scale } from 'vega';

	import type { NamedSpatialMetric } from './server/db/utils';
	import type { BordersCollection } from './server/db/borders';

	export let metricName: string;
	export let borders: BordersCollection;
	export let metrics: NamedSpatialMetric[];
	export let region = '';

	function updateRegion(_: string, value: unknown) {
		if (typeof value === 'string') {
			region = value;
		}
	}

	const signalListeners: SignalListeners = {
		selectedRegion: updateRegion
	};

	function generateScale(data: NamedSpatialMetric[]): Scale {
		// From https://github.com/vega/vega/blob/60916a9287cdb56646616cb13359aef982fec4d6/packages/vega-encode/src/Scale.js#L208C13-L208C84
		const s = Math.abs(data.reduce((s, v) => s + (v.value < 0 ? -1 : v.value > 0 ? 1 : 0), 0));
		// Log scale domain can not includes zero
		const scaleType = s === data.length ? 'log' : 'linear';
		return {
			name: 'color',
			type: scaleType,
			domain: { data: 'regions', field: 'value' },
			range: { scheme: 'cividis' }
		};
	}

	$: scale = generateScale(metrics);
	$: spec = {
		$schema: 'https://vega.github.io/schema/vega/v5.json',
		description: 'World map',
		width: 1160,
		height: 600,
		autosize: 'none',
		signals: [
			{
				name: 'selectedRegion',
				description: 'A region ISO code that updates in response to mouse click',
				value: '',
				on: [{ events: 'dblclick', update: "datum ? datum.properties.ISO_A3_EH : ''" }] // ISO_A3 not set for FRA
			},
			{ name: 'tx', update: 'width / 2' },
			{ name: 'ty', update: 'height / 2' },
			{
				name: 'scale',
				value: 230,
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
				name: 'regions',
				values: borders,
				format: { type: 'json', property: 'features' },
				transform: [
					{
						type: 'lookup',
						from: 'metrics',
						key: 'ISO',
						fields: ['properties.ISO_A3_EH'], // fields from regions for joining the data
						values: ['value'], // fields from metrics to add to the data
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
		scales: [scale],
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
				from: { data: 'regions' },
				encode: {
					enter: {
						tooltip: {
							signal: `{ title: datum.properties.ISO_A3_EH, ${metricName} : format(datum.value, 's') }`
						}
					},
					update: { fill: { signal: `scale('color',  datum.value) || 'grey'` } },
					hover: { fill: { value: 'firebrick' } }
				},
				transform: [{ type: 'geoshape', projection: 'projection' }]
			}
		]
	} as VisualizationSpec;
</script>

<Vega {spec} {signalListeners} />
