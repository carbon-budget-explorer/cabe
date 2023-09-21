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
</script>

<label>
	<input
		type="range"
		{name}
		min="0"
		max={len - 1}
		step="1"
		value={valIndex}
		on:change={updateValue}
	/>
	{value}
</label>
