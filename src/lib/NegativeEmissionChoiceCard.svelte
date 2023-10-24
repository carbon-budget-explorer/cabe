<script lang="ts">
	import CustomRange from '$lib/CustomRange.svelte';

	export let query: string;
	export let choices: string[];
	export let onChange: (name: string, value: string) => void;

	const defaults = choices[Math.floor(choices.length / 2)];
	let negativeEmissions: string = query || defaults;
	$: onChange('negativeEmissions', negativeEmissions);
</script>

<div class="card card-compact flex-1 bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Negative emissions</h2>
		<p>
			With less negative emissions you need to reduce faster. The global budget remains the same.
		</p>
		<div>
			<p>Assumption amount of negative emissions in 2050 - 2100.</p>
			<CustomRange
				bind:value={negativeEmissions}
				options={choices.map((d) => Number(d))}
				name="negEmis"
			/>
		</div>
	</div>
</div>
