<script lang="ts">
	import type { PathWayQuery } from './server/db/models';

	type ChangeEvent = Event & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	export let query: PathWayQuery;
	export let choices: Record<keyof PathWayQuery, string[]>;
	export let onChange: (name: string, value: string) => void;

	function changeWarming(event: ChangeEvent) {
		onChange('temperature', event.currentTarget.value);
	}

	function changeProbability(event: ChangeEvent) {
		onChange('exceedanceRisk', event.currentTarget.value);
	}

	function changeNonCO2Mitigation(event: ChangeEvent) {
		onChange('nonCO2Mitigation', event.currentTarget.value);
	}

	function changeNegativeEmissions(event: ChangeEvent) {
		onChange('negativeEmissions', event.currentTarget.value);
	}
</script>

<div>
	<div>
		<p>Limit global warming to</p>
		{#each choices.temperature as temperatureChoice}
			<label>
				<input
					type="radio"
					name="target"
					value={temperatureChoice}
					checked={temperatureChoice === query.temperature}
					on:change={changeWarming}
				/>
				{temperatureChoice.replace('deg', '°')}C
			</label>
		{/each}
	</div>
	<div>
		<p>Acceptable risk of exceeding global warming limit</p>
		{#each choices.exceedanceRisk as riskChoice}
			<label>
				<input
					type="radio"
					name="exceedanceRisk"
					value={riskChoice}
					checked={riskChoice === query.exceedanceRisk}
					on:change={changeProbability}
				/>
				{riskChoice}
			</label>
		{/each}
	</div>
	<div>
		<p>Assumption of non CO2 emissions to mitigate</p>
		{#each choices.nonCO2Mitigation as nonCO2MitigationChoice}
			<label>
				<input
					type="radio"
					name="nonCO2Mitigation"
					value={nonCO2MitigationChoice}
					checked={nonCO2MitigationChoice === query.nonCO2Mitigation}
					on:change={changeNonCO2Mitigation}
				/>
				{nonCO2MitigationChoice}
			</label>
		{/each}
	</div>
	<div>
		<p>Assumption amount of negative emissions in 2050 - 2100.</p>
		{#each choices.negativeEmissions as negativeEmissionsChoice}
			<label>
				<input
					type="radio"
					name="negativeEmissions"
					value={negativeEmissionsChoice}
					checked={negativeEmissionsChoice === query.negativeEmissions}
					on:change={changeNegativeEmissions}
				/>
				{negativeEmissionsChoice}
			</label>
		{/each}
	</div>
</div>
