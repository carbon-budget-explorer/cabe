<script lang="ts">
	import { Vega, type SignalListeners, type VisualizationSpec } from 'svelte-vega';

	interface Feature {
		properties: {
			ISO_A3_EH: string;
		};
	}

	const signalListeners: SignalListeners = {
		onCountryClick: (_, value: unknown) => {
			if (value === null) {
				document.location.href = `/world`;
				return;
			}

			const iso = (value as Feature).properties.ISO_A3_EH;
			document.location.href = `/countries/${iso}`;
		}
	};

	// TODO scale translat so all countries are visible
	// TODO highlight country of page
	// TODO color by metric like GDP, similar to /world
	// TODO pick how to color
	// TODO add enlarge button to pick country on bigger map in a dialog
	const spec: VisualizationSpec = {
		$schema: 'https://vega.github.io/schema/vega/v5.json',
		description: 'World minimap',
		width: 300,
		height: 200,
		autosize: {
			type: 'fit',
			resize: false,
			contains: 'content'
		},
		signals: [
			{
				name: 'onCountryClick',
				value: {},
				on: [{ events: 'click', update: 'datum' }]
			}
		],
		data: [
			{
				name: 'countries',
				url: '/country_borders.geojson',
				format: { type: 'json', property: 'features' }
			}
		],
		projections: [
			{
				name: 'projection',
				type: 'equalEarth'
			}
		],
		marks: [
			{
				type: 'shape',
				from: { data: 'countries' },
				encode: {
					update: { fill: { value: 'white' }, stroke: { value: 'darkgray' } },
					hover: { fill: { value: 'firebrick' } }
				},
				transform: [{ type: 'geoshape', projection: 'projection' }]
			}
		],
		usermeta: {
			embedOptions: {
				actions: false
			}
		}
	};
</script>

<Vega {spec} {signalListeners} />
