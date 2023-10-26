<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import CustomRange from '$lib/CustomRange.svelte';
	import type { PathWayQuery } from '$lib/api';

	export let total: number;
	export let remaining: number;
	export let query: PathWayQuery;
	export let choices: Record<keyof PathWayQuery, string[]>;
	export let onChange: (name: string, value: string) => void;

	const tweenOptions = { duration: 1000, easing: cubicOut };
	const globalBudgetCounter = tweened(total, tweenOptions);
	$: globalBudgetCounter.set(total);
	const remainingBudgetCounter = tweened(remaining, tweenOptions);
	$: remainingBudgetCounter.set(remaining);

	let defaults = {
		temperature: choices.temperature[Math.floor(choices.temperature.length / 2)],
		exceedanceRisk: choices.exceedanceRisk[Math.floor(choices.exceedanceRisk.length / 2)]
	};
	let temperature: string = query.temperature || defaults.temperature;
	let exceedanceRisk: string = query.exceedanceRisk || defaults.exceedanceRisk;
	$: onChange('temperature', temperature);
	$: onChange('exceedanceRisk', exceedanceRisk);
</script>

<div class="card card-compact flex-1 bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Global carbon budget</h2>

		<div class="stats bg-accent shadow">
			<div class="stat place-items-center">
				<div class="stat-title">Total</div>
				<div class="stat-value">{($remainingBudgetCounter / 1_000).toFixed(0)}</div>
				<div class="stat-desc">Gt CO2</div>
			</div>

			<div class="stat place-items-center">
				<div class="stat-title">Relative</div>
				<div class="stat-value">
					<!-- TODO fix this hardcoded 37, should be global emissions in 2021 -->
					{($remainingBudgetCounter / 1_000 / 37).toFixed(0)}x
				</div>
				<div class="stat-desc">current emissions</div>
			</div>
		</div>

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
	</div>
</div>
