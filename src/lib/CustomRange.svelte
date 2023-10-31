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
	<div class="flex flex-row gap-2">
		<input
			type="range"
			class="range range-accent range-xs"
			{name}
			min="0"
			max={len - 1}
			step="1"
			value={valIndex}
			on:change={updateValue}
		/>
	</div>
	<div class="flex w-full justify-between px-2 text-xs">
		<!-- TODO make low/high settable to numbers/strings -->
		<span>low</span>
		<span>high</span>
	</div>
	<!-- TODO make value show up at place of slider? -->
	<div class="badge- badge">
		{value}
	</div>
</label>
