<script lang="ts">
	// See https://observablehq.com/@d3/color-legend
	import type { ScaleSequential } from 'd3-scale';
	import { LayerCake, Svg } from 'layercake';
	import AxisY from './AxisY.svelte';
	import { format, interpolateRound, quantile, range } from 'd3';

	export let title: string;
	export let scale: ScaleSequential<string, never>;

	function ramp(color: any, n = 256) {
		const canvas = document.createElement('canvas');
		canvas.height = n;
		canvas.width = 1;
		const context = canvas.getContext('2d');
		for (let i = 0; i < n; ++i) {
			context!.fillStyle = color(i / (n - 1));
			context!.fillRect(0, n - i, 1, 1);
		}
		return canvas;
	}

	const tickSize = 6;
	const width = 44 + tickSize;
	const height = 320;
	const marginTop = 0;
	const marginRight = 18;
	const marginBottom = 0;
	const marginLeft = 16 + tickSize;
	const ticks = 4;

	$: y = Object.assign(
		scale.copy().interpolator(interpolateRound(marginBottom, height - marginTop)),
		{
			range() {
				return [marginBottom, height - marginTop];
			}
		}
	);
	$: tickValues = range(ticks + 1).map((i) => quantile(scale.domain(), i / ticks));
	$: tickFormat = format(',r');
</script>

<div class="absolute right-4 top-4 h-48 w-24">
	<LayerCake yScale={scale}>
		<Svg>
			<image
				width={width - marginRight - marginLeft}
				height={height - marginTop - marginBottom}
				x={marginLeft - 24}
				y={marginTop}
				preserveAspectRatio="none"
				xlink:href={ramp(scale.interpolator()).toDataURL()}
			/>
			<g>
				{#each tickValues as tick (tick)}
					<g class="tick" transform={`translate(0, ${height - y(tick || 0)})`}>
						<line stroke="currentColor" x2={tickSize} />
						<text fill="currentColor" x={tickSize + 3} dy=".32em">
							{tickFormat(tick || 0)}
						</text>
					</g>
				{/each}
			</g>
			<text transform={`translate(0, ${height + 24})`}>{title}</text>
		</Svg>
	</LayerCake>
</div>
