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

<!-- <p class="p-4">
	We start with the temperature target that you want to achieve, because this determines how many
	emissions we can distribute among countries at all – we call this amount of emissions the “”. Less
	ambitious targets (for example, 2.2°C) of course allows for more emissions: the global carbon
	budget is larger than when aiming for highly ambitious targets such as 1.5°C temperature rise. The
	risk of exceeding the temperature target is also relevant to the budget. It is a consequence of
	‘climate uncertainty’: the fact that we cannot fully predict how much temperature rise is
	associated with a certain level of emissions. If you want to take less risk, it means that your
	budget also needs to be on the more ‘safe’ side. From the budget, we proceed to the pathway that
	is associated with it. The curvature of the pathway is determined by a number of things, but most
	importantly (which you are allowed to choose here): negative emissions. More negative emissions
	means that you can compensate in the latter half of the century for some more emissions in the
	first half. Find out yourself! When you are ready, click on “World map with shares” to start
	looking into distributing these global results by country.
</p> -->

<div class="card card-compact bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Set global targets</h2>
		<p class="pt-4">The remaining carbon budget depends on your choices!</p>

		<div>
			<div>
				<p>
					The temperature target determines how many greenhouse gases we can still emit, globally. A
					less ambitious target (for example, 2.2°C) means tolerating more emissions.
				</p>
				<p>Limit global warming to (&deg;C)</p>
				<CustomRange
					bind:value={temperature}
					options={choices.temperature.map((d) => Number(d))}
					name="temperature"
				/>
			</div>
			<div>
				<p>
					The risk of exceeding the temperature target is also relevant to the budget. Less risk
					means that your budget is more to the 'safe' side.
				</p>
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
				How quickly we need to reduce depends on the amount of negative emissions we expect to
				achieve in the future. With less negative emissions you need to reduce faster. The global
				budget remains the same.
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
