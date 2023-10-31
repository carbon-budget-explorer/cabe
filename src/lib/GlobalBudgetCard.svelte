<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let total: number;
	export let remaining: number;

	const tweenOptions = { duration: 1000, easing: cubicOut };
	const globalBudgetCounter = tweened(total, tweenOptions);
	$: globalBudgetCounter.set(total);
	const remainingBudgetCounter = tweened(remaining, tweenOptions);
	$: remainingBudgetCounter.set(remaining);
</script>

<div class="card-compact card flex-1 bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Global carbon budget</h2>

		<div class="stats shadow">
			<div class="stat place-items-center">
				<div class="stat-title">Total</div>
				<div class="stat-value">{($remainingBudgetCounter / 1_000).toFixed(0)}</div>
				<div class="stat-desc" title="Gigaton carbon dioxide equivalent">Gt CO₂e</div>
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
	</div>
</div>
