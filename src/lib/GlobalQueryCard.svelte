<script lang="ts">
	import CustomRange from '$lib/CustomRange.svelte';
	import type { PathWayQuery } from '$lib/api';

	export let query: PathWayQuery;
	export let choices: Record<keyof PathWayQuery, string[]>;
	export let onChange: (name: string, value: string) => void;

	let defaults = {
		temperature: choices.temperature[Math.floor(choices.temperature.length / 2)],
		exceedanceRisk: choices.exceedanceRisk[Math.floor(choices.exceedanceRisk.length / 2)],
		negativeEmissions: choices.negativeEmissions[Math.floor(choices.negativeEmissions.length / 2)]
	};

	let temperature: string = query.temperature || defaults.temperature;
	let exceedanceRisk: string = query.exceedanceRisk || defaults.exceedanceRisk;
	let negativeEmissions: string = query.negativeEmissions || defaults.negativeEmissions;

	$: onChange('temperature', temperature);
	$: onChange('exceedanceRisk', exceedanceRisk);
	$: onChange('negativeEmissions', negativeEmissions);
</script>

<div class="card-compact card flex-1 bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Set global targets</h2>
		<p class="pt-4">The remaining carbon budget depends on your choices!</p>

		<div>
			<div>
				<p>Limit global warming to (&deg;C)</p>
				<CustomRange
					bind:value={temperature}
					options={choices.temperature.map((d) => Number(d))}
					name="temperature"
				/>
			</div>
			<div>
				<p>Acceptable risk of exceeding global warming limit</p>
				<CustomRange
					bind:value={exceedanceRisk}
					options={choices.exceedanceRisk.map((d) => Number(d))}
					name="risk"
				/>
			</div>
		</div>
		<div>
			<p>
				With less negative emissions you need to reduce faster. The global budget remains the same.
			</p>
			<div>
				<p>Assumption amount of negative emissions in 2050 - 2100.</p>
				<CustomRange
					bind:value={negativeEmissions}
					options={choices.negativeEmissions.map((d) => Number(d))}
					name="negEmis"
				/>
			</div>
		</div>
	</div>
</div>
