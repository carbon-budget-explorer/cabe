<script lang="ts">
	import { Html, LayerCake, Svg } from 'layercake';
	import AxisX from './components/AxisX.svelte';
	import AxisY from './components/AxisY.svelte';
	import Tooltip from './components/Tooltip.html.svelte';
	import type { ComponentEvents, SvelteComponent } from 'svelte';

	export let xDomain: [number, number] = [1990, 2100];
	export let yDomain: [number, number] = [0, 60];
	export let evt: ComponentEvents<SvelteComponent> = {};
</script>

<div class="h-full w-full overflow-clip pb-5 pl-12 pr-5 pt-1">
	<LayerCake {xDomain} {yDomain}>
		<Svg>
			<AxisX gridlines={true} />
			<AxisY gridlines={true} ticks={4} textAnchor={'end'} />
			<slot />
		</Svg>
		<Html pointerEvents={false}>
			{#if evt?.detail?.msg}
				<Tooltip {evt}>
					{evt.detail.msg}
				</Tooltip>
			{/if}
		</Html>
	</LayerCake>
</div>
