<script lang="ts">
	import { Vega, type SignalListeners, type VisualizationSpec } from 'svelte-vega';
	import type { BordersCollection } from './server/db/borders';

	export let borders: BordersCollection;

	interface Feature {
		properties: {
			ISO_A3_EH: string;
		};
	}

	const signalListeners: SignalListeners = {
		onRegionClick: (_, value: unknown) => {
			if (value === null) {
				// Clicked on ocean
				document.location.href = `/world`;
				return;
			}

			const iso = (value as Feature).properties.ISO_A3_EH;
			document.location.href = `/regions/${iso}`;
		}
	};

	// TODO scale translate so all regions are visible
	// TODO highlight region of page
	// TODO color by metric like GDP, similar to /world
	// TODO pick how to color
	// TODO add enlarge button to pick region on bigger map in a dialog
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
				name: 'onRegionClick',
				value: {},
				on: [{ events: 'click', update: 'datum' }]
			}
		],
		data: [
			{
				name: 'regions',
				values: borders,
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
				from: { data: 'regions' },
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
