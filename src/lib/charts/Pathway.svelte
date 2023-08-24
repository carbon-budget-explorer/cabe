<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import AxisX from './components/AxisX.svelte';
	import AxisY from './components/AxisY.svelte';

	export let xDomain: [number, number] = [1990, 2100];
	export let yDomain: [number, number] = [-15_000, 51_000];
</script>

<div class="h-full w-full overflow-clip pb-5 pl-12 pr-5 pt-1">
	<LayerCake {xDomain} {yDomain}>
		<Svg>
			<AxisX gridlines={true} />
			<AxisY gridlines={true} ticks={4} textAnchor={'end'} />
			<slot />
		</Svg>
	</LayerCake>
</div>
