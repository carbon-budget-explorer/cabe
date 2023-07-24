<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import PieChart from '$lib/PieChart.svelte';

	export let data: PageData;

	type ChangeEvent = Event & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	function changeWarming(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set('warming', event.currentTarget.value);
			goto(`?${params.toString()}`);
		}
	}

	function changeProbability(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set('probability', event.currentTarget.value);
			goto(`?${params.toString()}`);
		}
	}

	function changeNonCO2Mitigation(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set('nonCO2Mitigation', event.currentTarget.value);
			goto(`?${params.toString()}`);
		}
	}

	function changeNegativeEmissions(event: ChangeEvent) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set('negativeEmissions', event.currentTarget.value);
			goto(`?${params.toString()}`);
		}
	}
	// TODO show loading message when server is processing
</script>

<h1 class="pb-20 text-3xl font-bold">Welcome to Carbon Budget Explorer</h1>

<div class="flex flex-row justify-around">
	<div class="flex flex-col gap-2 justify-between">
		<div>
			<div>
				<p>Limit global warming to</p>
				{#each data.choices.warming as warmingChoice}
					<label>
						<input
							type="radio"
							name="target"
							value={warmingChoice}
							checked={warmingChoice === data.query.warming}
							on:change={changeWarming}
						/>
						{warmingChoice}°C
					</label>
				{/each}
			</div>
			<div>
				<p>Acceptable risk of exceeding global warming limit</p>
				{#each data.choices.probability as probabilityChoice}
					<label>
						<input
							type="radio"
							name="probability"
							value={probabilityChoice}
							checked={probabilityChoice === data.query.probability}
							on:change={changeProbability}
						/>
						{100 - parseFloat(probabilityChoice)}%
					</label>
				{/each}
			</div>
			<div>
				<p>Assumption of non CO2 emissions to mitigate</p>
				{#each data.choices.nonCO2Mitigation as nonCO2MitigationChoice}
					<label>
						<input
							type="radio"
							name="nonCO2Mitigation"
							value={nonCO2MitigationChoice}
							checked={nonCO2MitigationChoice === data.query.nonCO2Mitigation}
							on:change={changeNonCO2Mitigation}
						/>
						{nonCO2MitigationChoice}
					</label>
				{/each}
			</div>
			<div>
				<p>Assumption amount of negative emissions in 2050 - 2100.</p>
				{#each data.choices.negativeEmissions as negativeEmissionsChoice}
					<label>
						<input
							type="radio"
							name="negativeEmissions"
							value={negativeEmissionsChoice}
							checked={negativeEmissionsChoice === data.query.negativeEmissions}
							on:change={changeNegativeEmissions}
						/>
						{negativeEmissionsChoice}
					</label>
				{/each}
			</div>
		</div>
		<div>
			<a class="rounded bg-slate-200 p-2 text-4xl" href={`/world${$page.url.search}`} title="Look at budget for each country">🌍</a>
		</div>
	</div>
	<div class="flex flex-col justify-around">
		<div>
			<PieChart used={data.result.used} remaining={data.result.remaining} />
		</div>
		<div>temperature plot</div>
	</div>
	<div>Line plot</div>
</div>
