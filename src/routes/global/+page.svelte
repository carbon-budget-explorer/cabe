<script lang="ts">
	import Sidebar from '$lib/Sidebar.svelte';

	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { tour } from '$lib/shared/stores';
	import ShareTabs from '$lib/ShareTabs.svelte';
	import Pathway from '$lib/charts/Pathway.svelte';
	import Line from '$lib/charts/components/Line.svelte';
	import Area from '$lib/charts/components/Area.svelte';
	import Gap from '$lib/charts/components/Gap.svelte';

	import type { PageData } from '../global/$types';
	import GlobalBudgetCard from '$lib/GlobalBudgetCard.svelte';
	import GlobalQueryCard from '$lib/GlobalQueryCard.svelte';
	import { onMount, type ComponentEvents, type SvelteComponent } from 'svelte';

	import { driver } from 'driver.js';
	import 'driver.js/dist/driver.css';

	export let data: PageData;
	const driverObj = driver({
		steps: [
			{
				element: '#globalquerycard',
				popover: {
					title: 'Determine your pathway',
					description: 'Use the sliders to construct your personal carbon budget and pathway'
				}
			},
			{
				element: '#references',
				popover: {
					title: 'Compare with others',
					description: 'Check the tickboxes to show reference pathways on the graph'
				}
			},
			{
				element: '#sharetabs',
				popover: {
					title: 'Proceed to map',
					description:
						"When you're ready, proceed to the map view to select your effor-sharing principle"
				}
			}
		]
	});

	onMount(() => {
		tour.useLocalStorage();
		if ($tour.completed === false) {
			console.log($tour);
			driverObj.drive();
			tour.set({ completed: true });
		}
	});

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

	let evt = {};
	function hoverBuilder(tmpl: (row: any) => string) {
		return function (e: ComponentEvents<SvelteComponent>) {
			const row = e.detail.row;
			if (row === undefined) {
				return;
			}
			e.detail.msg = tmpl(row);
			evt = e;
		};
	}
	const hoverHistoricalCarbon = hoverBuilder(
		(row) => `Historical emission in ${row.time} was ${row.value.toFixed(0)} Gt CO₂e`
	);
	const hoverPathway = hoverBuilder(
		(row) =>
			`Your selected global pathway emission in ${row.time} is on average ${row.mean.toFixed(
				0
			)} Gt CO₂e`
	);
	const hoverCurrentPolicy = hoverBuilder(
		(row) => `Current policy in ${row.time} is on average ${row.mean.toFixed(0)} Gt CO₂e`
	);
	const hoverNdc = hoverBuilder(
		(row) => `NDCs in ${row.time} is on average ${row.mean.toFixed(0)} Gt CO₂e`
	);
	const hoverNetzero = hoverBuilder(
		(row) => `Net zero-scenarios in ${row.time} is on average ${row.mean.toFixed(0)} Gt CO₂e`
	);
	// When series overlap the top most series will react to mouse events

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

<div class="flex h-full gap-4">
	<Sidebar>
		<GlobalBudgetCard
			remaining={data.result.stats.remaining}
			relative={data.result.stats.relative}
		/>
		<div id="globalquerycard">
			<GlobalQueryCard
				choices={data.pathway.choices}
				query={data.pathway.query}
				onChange={updateQueryParam}
			/>
		</div>
		<div id="references">
			<div class="card card-compact min-w-full bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Reference pathways</h2>
					<p>
						Use the checkboxes below to compare your pathway with common references. The difference
						between them is characterized by the <span
							class="tooltip cursor-pointer"
							role="tooltip"
							on:mouseenter={toggleEmissionGap}
							on:mouseleave={toggleEmissionGap}
							data-tip="The emission gap is the difference between your scenario and the current policy."
							>emission ⓘ</span
						>
						and
						<span
							class="tooltip cursor-pointer"
							role="tooltip"
							on:mouseenter={toggleAmbitionGap}
							on:mouseleave={toggleAmbitionGap}
							data-tip="The ambition gap is the
				difference between your scenario and the NDCs.">ambition ⓘ</span
						>
						gaps.
					</p>
					<ul class="">
						<li>
							<label class="cursor-pointer">
								<input
									type="checkbox"
									style={`background-color: ${ipcc_green}`}
									class="m-1 scale-125 shadow"
									checked
									disabled
								/>{' '}Your pathway</label
							>
						</li>
						<li>
							<label class="cursor-pointer">
								<input
									type="checkbox"
									style={`background-color: ${ipcc_red}`}
									class="m-1 scale-125 shadow"
									bind:checked={policyPathwayToggles.current}
								/>{' '}Current policy</label
							>
						</li>
						<li>
							<label class="cursor-pointer">
								<input
									type="checkbox"
									style={`background-color: ${ipcc_blue}`}
									class="m-1 scale-125 shadow"
									bind:checked={policyPathwayToggles.ndc}
								/>{' '}Nationally determined contributions (NDCs)</label
							>
						</li>
						<li>
							<label class="cursor-pointer">
								<input
									type="checkbox"
									style={`background-color: ${ipcc_purple}`}
									class="m-1 scale-125 shadow"
									bind:checked={policyPathwayToggles.netzero}
								/>{' '}Net zero-scenarios</label
							>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</Sidebar>
	<div class="flex grow flex-col">
		<div id="sharetabs">
			<ShareTabs />
		</div>
		<div class="relative grow bg-base-100 p-4 shadow-lg">
			<Pathway {evt} yAxisTtle="Greenhouse gas emissions (Gt CO₂e/year)">
				<Line
					data={data.result.historicalCarbon}
					x={'time'}
					y={'value'}
					color="black"
					on:mouseover={hoverHistoricalCarbon}
					on:mouseout={(e) => (evt = e)}
				/>
				{#if policyPathwayToggles.current || emissionGapHover}
					<Line data={data.result.currentPolicy} x={'time'} y={'mean'} color={ipcc_red} />
					<Area
						data={data.result.currentPolicy}
						x={'time'}
						y0={'min'}
						y1={'max'}
						color={ipcc_red}
						on:mouseover={hoverCurrentPolicy}
						on:mouseout={(e) => (evt = e)}
					/>
				{/if}
				{#if policyPathwayToggles.ndc || ambitionGapHover}
					<Line data={data.result.ndc} x={'time'} y={'mean'} color={ipcc_blue} />
					<Area
						data={data.result.ndc}
						x={'time'}
						y0={'min'}
						y1={'max'}
						color={ipcc_blue}
						on:mouseover={hoverNdc}
						on:mouseout={(e) => (evt = e)}
					/>
				{/if}
				{#if policyPathwayToggles.netzero}
					<Line data={data.result.netzero} x={'time'} y={'mean'} color={ipcc_purple} />
					<Area
						data={data.result.netzero}
						x={'time'}
						y0={'min'}
						y1={'max'}
						color={ipcc_purple}
						on:mouseover={hoverNetzero}
						on:mouseout={(e) => (evt = e)}
					/>
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
				<Area
					data={$pathwayCarbonTweened}
					x={'time'}
					y0={'min'}
					y1={'max'}
					color={ipcc_green}
					on:mouseover={hoverPathway}
					on:mouseout={(e) => (evt = e)}
				/>
			</Pathway>
		</div>
	</div>
</div>
