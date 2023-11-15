<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	import { principles } from '$lib/principles';

	export let reductions: Record<string, Record<number, number>>;

	const tweenOptions = { duration: 1000, easing: cubicOut };
	const tweenedReductions = tweened(reductions, tweenOptions);
	$: tweenedReductions.set(reductions);

	export let activeEffortSharings: Record<string, boolean>;
</script>

<div class="p-4">
	<table class="prose w-full max-w-none table-auto">
		<thead>
			<tr>
				<th>Effort sharing principle</th>
				{#each Object.entries(principles) as [id, { label, color }]}
					<th>{label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			<tr>
				<th>2030 reductions</th>
				{#each Object.entries(principles) as [id, { label, color }]}
					<th>{reductions[id][2030] === null ? '-' : $tweenedReductions[id][2030].toFixed(0)}%</th>
				{/each}
			</tr>
			<tr>
				<th>2040 reductions</th>
				{#each Object.entries(principles) as [id, { label, color }]}
					<th>{reductions[id][2040] === null ? '-' : $tweenedReductions[id][2040].toFixed(0)}%</th>
				{/each}
			</tr>
			<tr>
				<th>Display graph</th>
				{#each Object.entries(principles) as [id, { label, color }]}
					<th
						><input
							type="checkbox"
							style={`background-color: ${color}`}
							bind:checked={activeEffortSharings[id]}
						/></th
					>
				{/each}
			</tr>
		</tbody>
	</table>
</div>
