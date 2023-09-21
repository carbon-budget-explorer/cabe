<script lang="ts">
	export let value: string;
	export let options: string[];
	export let name: string;

	type ChangeEvent = Event & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	function updateValue(event: ChangeEvent) {
		value = options[event.currentTarget.valueAsNumber];
	}

	$: len = options.length;
	$: valIndex = options.indexOf(value);
	$: console.log(value, valIndex, options[valIndex]);
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
