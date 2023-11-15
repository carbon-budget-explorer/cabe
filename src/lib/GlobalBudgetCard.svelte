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

<div class="grid min-w-full grid-cols-2 place-items-center rounded bg-base-100 p-2 shadow-xl">
	<div class="text-center text-base-content/60">Global carbon budget</div>
	<div class="text-center text-base-content/60">That amounts to</div>

	<div class="text-4xl font-extrabold">{($remainingBudgetCounter / 1_000).toFixed(0)}</div>
	<div class="text-4xl font-extrabold">
		<!-- TODO fix this hardcoded 37, should be global emissions in 2021 -->
		{($remainingBudgetCounter / 1_000 / 37).toFixed(0)}x
	</div>

	<div class="text-center text-xs text-base-content/60" title="Gigaton carbon dioxide equivalent">
		Gt CO₂e
	</div>
	<div class="text-center text-xs text-base-content/60">the current annual emissions</div>
</div>
