<script lang="ts">
	export let value: string;
	export let options: number[];
	export let name: string;

	type ChangeEvent = Event & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	function updateValue(event: ChangeEvent) {
		value = options[event.currentTarget.valueAsNumber].toString();
	}

	$: len = options.length;
	$: valIndex = options.indexOf(parseFloat(value));
	// when sliding all intermediate values are also fetched
	// TODO could only fetch the value when the slider is released
</script>

<label>
	<div class="flox-row flex gap-2">
		<input
			type="range"
			{name}
			min="0"
			max={len - 1}
			step="1"
			value={valIndex}
			on:change={updateValue}
		/>
		<div class="badge- badge">
			{value}
		</div>
	</div>
</label>
