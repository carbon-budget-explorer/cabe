<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	import ShareTabs from '$lib/ShareTabs.svelte';
	import Pathway from '$lib/charts/Pathway.svelte';
	import Line from '$lib/charts/components/Line.svelte';
	import Area from '$lib/charts/components/Area.svelte';
	import Gap from '$lib/charts/components/Gap.svelte';

	import type { PageData } from '../global/$types';
	import GlobalBudgetCard from '$lib/GlobalBudgetCard.svelte';
	import GlobalQueryCard from '$lib/GlobalQueryCard.svelte';

	export let data: PageData;

	// TODO generalize to colormap component or named after the series it used for
	const ipcc_green = '#82a56e';
	const ipcc_red = '#f5331e';
	const ipcc_blue = '#5bb0c6';
	const ipcc_purple = '#a67ab8';

	function updateQueryParam(name: string, value: string) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set(name, value);
			goto(`?${params.toString()}`);
		}
	}

	function toggleAmbitionGap() {
		ambitionGapHover = !ambitionGapHover;
	}
	function toggleEmissionGap() {
		emissionGapHover = !emissionGapHover;
	}

	let policyPathwayToggles = {
		current: false,
		ndc: false,
		netzero: false
	};

	let ambitionGapHover = false;
	let emissionGapHover = false;

	// $: console.log(data.result.currentPolicy); // only nans in input data...
	// Transitions
	const tweenOptions = { duration: 1000, easing: cubicOut };
	const pathwayCarbonTweened = tweened(data.result.pathwayCarbon, tweenOptions);
	$: pathwayCarbonTweened.set(data.result.pathwayCarbon);
	const emissionGapTweened = tweened(data.result.stats.gaps.emission, tweenOptions);
	$: emissionGapTweened.set(data.result.stats.gaps.emission);
	const ambitionGapTweened = tweened(data.result.stats.gaps.ambition, tweenOptions);
	$: ambitionGapTweened.set(data.result.stats.gaps.ambition);
</script>

<!-- <p class="p-4">
	We start with the temperature target that you want to achieve, because this determines how many
	emissions we can distribute among countries at all – we call this amount of emissions the “”. Less
	ambitious targets (for example, 2.2°C) of course allows for more emissions: the global carbon
	budget is larger than when aiming for highly ambitious targets such as 1.5°C temperature rise. The
	risk of exceeding the temperature target is also relevant to the budget. It is a consequence of
	‘climate uncertainty’: the fact that we cannot fully predict how much temperature rise is
	associated with a certain level of emissions. If you want to take less risk, it means that your
	budget also needs to be on the more ‘safe’ side. From the budget, we proceed to the pathway that
	is associated with it. The curvature of the pathway is determined by a number of things, but most
	importantly (which you are allowed to choose here): negative emissions. More negative emissions
	means that you can compensate in the latter half of the century for some more emissions in the
	first half. Find out yourself! When you are ready, click on “World map with shares” to start
	looking into distributing these global results by country.
</p> -->

<div class="flex gap-4">
	<div id="sidebar" class="flex h-full max-w-[25%] flex-col justify-between gap-4">
		<GlobalBudgetCard total={data.result.stats.total} remaining={data.result.stats.remaining} />
		<GlobalQueryCard
			choices={data.pathway.choices}
			query={data.pathway.query}
			onChange={updateQueryParam}
		/>
		<div class="card card-compact bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Reference pathways</h2>
				<p>Compare your pathway to the following reference pathways:</p>
				<ul>
					<li>
						<label>
							<b style={`color: ${ipcc_red}`}>▬</b>
							<input type="checkbox" bind:checked={policyPathwayToggles.current} />{' '}Current
							policy</label
						>
					</li>
					<li>
						<label>
							<b style={`color: ${ipcc_blue}`}>▬</b>
							<input type="checkbox" bind:checked={policyPathwayToggles.ndc} />{' '}Nationally
							determined contributions (NDCs)</label
						>
					</li>
					<li>
						<label>
							<b style={`color: ${ipcc_purple}`}>▬</b>
							<input type="checkbox" bind:checked={policyPathwayToggles.netzero} />{' '}Net
							zero-scenarios</label
						>
					</li>
				</ul>
				<p>
					The emission gap is the difference between your scenario and the current policy. The
					ambition gap is the difference between your scenario and the NDCs. Hover below to show on
					graph.
				</p>
			</div>
		</div>
		<div class="stats shadow">
			<div
				role="tooltip"
				class="stat place-items-center"
				on:mouseenter={toggleEmissionGap}
				on:mouseleave={toggleEmissionGap}
			>
				<div class="stat-title">Emission gap in 2030</div>
				<div class="stat-value">{($emissionGapTweened / 1_000).toFixed(0)}</div>
				<div class="stat-desc" title="Gigaton carbon dioxide equivalent">Gt CO₂e</div>
			</div>

			<div
				role="tooltip"
				class="stat place-items-center"
				on:mouseenter={toggleAmbitionGap}
				on:mouseleave={toggleAmbitionGap}
			>
				<div class="stat-title">Ambition gap in 2030</div>
				<div class="stat-value">{($ambitionGapTweened / 1_000).toFixed(0)}</div>
				<div class="stat-desc" title="Gigaton carbon dioxide equivalent">Gt CO₂e</div>
				<p class="text-xs" />
			</div>
		</div>
	</div>

	<div class="flex grow flex-col">
		<ShareTabs />
		<div class="relative grow bg-base-100 p-4 shadow-lg">
			<Pathway>
				<Line data={data.result.historicalCarbon} x={'time'} y={'value'} color="black" />
				{#if policyPathwayToggles.current || emissionGapHover}
					<Line data={data.result.currentPolicy} x={'time'} y={'mean'} color={ipcc_red} />
					<Area
						data={data.result.currentPolicy}
						x={'time'}
						y0={'min'}
						y1={'max'}
						color={ipcc_red}
					/>
				{/if}
				{#if policyPathwayToggles.ndc || ambitionGapHover}
					<Line data={data.result.ndc} x={'time'} y={'mean'} color={ipcc_blue} />
					<Area data={data.result.ndc} x={'time'} y0={'min'} y1={'max'} color={ipcc_blue} />
				{/if}
				{#if policyPathwayToggles.netzero}
					<Line data={data.result.netzero} x={'time'} y={'mean'} color={ipcc_purple} />
					<Area data={data.result.netzero} x={'time'} y0={'min'} y1={'max'} color={ipcc_purple} />
				{/if}

				{#if ambitionGapHover}
					<Gap
						x={data.result.stats.gaps.index}
						y0={data.result.stats.gaps.ndc}
						y1={data.result.stats.gaps.budget}
					/>
				{/if}
				{#if emissionGapHover}
					<Gap
						x={data.result.stats.gaps.index}
						y0={data.result.stats.gaps.curPol}
						y1={data.result.stats.gaps.budget}
					/>
				{/if}

				<Line data={$pathwayCarbonTweened} x={'time'} y={'mean'} color={ipcc_green} />
				<Area data={$pathwayCarbonTweened} x={'time'} y0={'min'} y1={'max'} color={ipcc_green} />
			</Pathway>
		</div>
	</div>
</div>
