<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	export let color: string;
	export let label: string;
	export let reductions: Record<number, number>;

	const tweenOptions = { duration: 1000, easing: cubicOut };
	const tweenedReductions = tweened(reductions, tweenOptions);
	$: tweenedReductions.set(reductions);
</script>

<div class="border-4 text-start shadow-lg" style={`border-color: ${color}`}>
	<h3 class="px-2 text-center text-lg" style={`background-color: ${color}`}>
		{label}
		<a title="More information" target="_blank" rel="noopener" href={`/about#principles`}>ⓘ</a>
	</h3>
	<div class="stats">
		<div class="stat place-items-center">
			<div class="stat-title">2030 reduction</div>
			<div class="stat-value text-3xl">
				{reductions[2030] === null ? '-' : reductions[2030].toFixed(0)}%
			</div>
			<div class="stat-desc" title="With respect to emissions in 1990">wrt 1990 emissions</div>
		</div>
		<div class="stat place-items-center">
			<div class="stat-title">2040 reduction</div>
			<div class="stat-value text-3xl">
				{reductions[2040] === null ? '-' : reductions[2040].toFixed(0)}%
			</div>
			<div class="stat-desc" title="With respect to emissions in 1990">wrt 1990 emissions</div>
		</div>
	</div>
</div>
