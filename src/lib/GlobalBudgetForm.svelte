<script lang="ts">
	import type { GlobalBudgetQuery } from './server/db/global';

	type ChangeEvent = Event & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	export let query: GlobalBudgetQuery;
	export let choices: any;
	export let onChange: (name: string, value: string) => void;

	function changeWarming(event: ChangeEvent) {
		onChange('warming', event.currentTarget.value);
	}

	function changeProbability(event: ChangeEvent) {
		onChange('probability', event.currentTarget.value);
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
		{#each choices.warming as warmingChoice}
			<label>
				<input
					type="radio"
					name="target"
					value={warmingChoice}
					checked={warmingChoice === query.warming}
					on:change={changeWarming}
				/>
				{warmingChoice}°C
			</label>
		{/each}
	</div>
	<div>
		<p>Acceptable risk of exceeding global warming limit</p>
		{#each choices.probability as probabilityChoice}
			<label>
				<input
					type="radio"
					name="probability"
					value={probabilityChoice}
					checked={probabilityChoice === query.probability}
					on:change={changeProbability}
				/>
				{100 - parseFloat(probabilityChoice)}%
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
