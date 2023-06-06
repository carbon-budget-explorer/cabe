<script lang="ts">
	import type { VisualizationSpec } from 'svelte-vega';
	import { Vega } from 'svelte-vega';

	const spec: VisualizationSpec = {
		$schema: 'https://vega.github.io/schema/vega/v5.json',
		description: 'A configurable map of countries of the world.',
		width: 900,
		height: 500,
		autosize: 'none',
		data: [
			{
				name: 'world',
				url: 'https://raw.githubusercontent.com/vega/vega-datasets/main/data/world-110m.json',
				format: {
					type: 'topojson',
					feature: 'countries'
				}
			},
		],
        projections: [
            {
            name: 'naturalEarth1',
            type: 'naturalEarth1'
            },
        ],
		marks: [
			{
				type: 'shape',
				from: { data: 'world' },
				encode: {
					update: {
						strokeWidth: { value: 2 },
						stroke: { value: '#bbb' },
						fill: { value: '#000' },
						zindex: { value: 0 }
					},
					hover: {
						strokeWidth: { value: 2 },
						stroke: { value: 'firebrick' },
						zindex: { value: 1 }
					}
				},
				transform: [{ type: 'geoshape', projection: 'naturalEarth1' }]
			}
		]
	};
</script>

<Vega {spec} />

