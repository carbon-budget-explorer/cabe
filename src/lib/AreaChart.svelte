<script lang="ts">
	import { VegaLite, type VisualizationSpec } from 'svelte-vega';

	export let used: number;
	export let remaining: number;

	$: data = {
		table: [
			{ category: 'Used', amount: used },
			{ category: 'Remaining', amount: remaining }
		]
	};
	$: spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"data": {values:
			[
				{year: 2010, cost_optimal_lower: 900, cost_optimal_upper: 1000, current_policy: 100},
				{year: 2020, cost_optimal_lower: 800, cost_optimal_upper: 900, current_policy: 100},
				{year: 2030, cost_optimal_lower: 700, cost_optimal_upper: 800, current_policy: 100},
				{year: 2040, cost_optimal_lower: 600, cost_optimal_upper: 700, current_policy: 100},
				{year: 2050, cost_optimal_lower: 500, cost_optimal_upper: 600, current_policy: 100},
				{year: 2060, cost_optimal_lower: 400, cost_optimal_upper: 500, current_policy: 100},
				{year: 2070, cost_optimal_lower: 300, cost_optimal_upper: 400, current_policy: 100},
				{year: 2080, cost_optimal_lower: 200, cost_optimal_upper: 300, current_policy: 100},
				{year: 2090, cost_optimal_lower: 100, cost_optimal_upper: 200, current_policy: 100},
				{year: 2100, cost_optimal_lower: 0, cost_optimal_upper: 100, current_policy: 100},
			]
		},
		"mark": {
			"type": "area",
			"line": {
			"color": "darkgreen"
			},
			"color": {
			"x1": 1,
			"y1": 1,
			"x2": 1,
			"y2": 0,
			"gradient": "linear",
			"stops": [
				{
				"offset": 0,
				"color": "white"
				},
				{
				"offset": 1,
				"color": "darkgreen"
				}
			]
			}
		},
		"encoding": {
			"x": { "field": "year", "type": "quantitative"},
			"y": { "title": "Global GHG emissions [Gt CO2e/yr"}
		},
		layer: [
			{
				mark: { type: 'errorband', color: "red"},
				encoding: {
					"y": {"field": "cost_optimal_lower", "type": "quantitative"},
					"y2": {"field": "cost_optimal_upper", "type": "quantitative"},
				}
			},
			{
				mark: { type: 'line'},
				encoding: {
					"y": {"field": "current_policy", "type": "quantitative"}
				}
			}
		]
	} as VisualizationSpec;
</script>

<VegaLite {spec} />
