<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import type { PageData } from './$types';
	import Pathway from '$lib/charts/Pathway.svelte';
	import Line from '$lib/charts/components/Line.svelte';
	import Area from '$lib/charts/components/Area.svelte';
	import { principles } from '$lib/principles';
	import Gap from '$lib/charts/components/Gap.svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import BudgetChoicesCard from '$lib/BudgetChoicesCard.svelte';
	import NegativeEmissionChoiceCard from '$lib/NegativeEmissionChoiceCard.svelte';
	import MiniPathwayCard from '$lib/MiniPathwayCard.svelte';

	export let data: PageData;

	function updateQueryParam(name: string, value: string) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set(name, value);
			goto(`?${params.toString()}`);
		}
	}

	let activeEffortSharings = Object.fromEntries(
		Object.keys(principles).map((id) => [id, id === data.initialEffortSharingName])
	);

	// Gap hover
	let gapIndex = data.reference.ndc.map((d) => d.time).indexOf(2030);
	let hoveredAmbitionGap: string | null = null;
	let hoveredEmissionGap: string | null = null;

	// Transitions
	const tweenOptions = { duration: 1000, easing: cubicOut };
	const tweenedEffortSharing = tweened(data.effortSharing, tweenOptions);
	$: tweenedEffortSharing.set(data.effortSharing);

	// TODO move calculations to server or web service?
	$: reductions2030 = Object.fromEntries(
		Object.entries(data.effortSharing).map(([key, value]) => [
			key,
			(-(
				value.GHG.find((d) => d.time === 2030)!.mean -
				data.historicalCarbon.data.find((d) => d.time === 1990)!.value
			) /
				value.GHG.find((d) => d.time === 2021)!.mean) *
				100
		])
	);
	$: reductions2040 = Object.fromEntries(
		Object.entries(data.effortSharing).map(([key, value]) => [
			key,
			(-(
				value.GHG.find((d) => d.time === 2040)!.mean -
				data.historicalCarbon.data.find((d) => d.time === 1990)!.value
			) /
				value.GHG.find((d) => d.time === 2021)!.mean) *
				100
		])
	);
</script>

<div class="flex h-full flex-row gap-4">
	<div id="sidebar" class="flex h-full max-w-[25%] flex-col gap-4">
		<BudgetChoicesCard
			total={data.pathway.stats.total}
			remaining={data.pathway.stats.remaining}
			choices={data.pathway.choices}
			query={data.pathway.query}
			onChange={updateQueryParam}
		/>
		<NegativeEmissionChoiceCard
			choices={data.pathway.choices.negativeEmissions}
			query={data.pathway.query.negativeEmissions}
			onChange={updateQueryParam}
		/>
		<MiniPathwayCard global={data.global} />
	</div>
	<div class="flex h-full grow flex-col">
		<div id="country-header" class="flex flex-row items-center gap-4">
			<a href={`/map${$page.url.search}`} title="Back to map" class="text-8xl"> ← </a>
			<img
				src={`https://flagcdn.com/${data.info.iso2?.toLowerCase()}.svg`}
				class="h-8"
				alt={data.info.name}
			/>
			<h1 class="text-3xl font-bold">{data.info.name}</h1>
		</div>
		<!-- setting *any* initial height + grow fixes overflow-auto with h-full -->
		<div class="h-[500px] grow overflow-y-auto bg-base-100 p-2 shadow-xl">
			<section id="key-indicators">
				<div class="border-10 stats mb-2 flex flex-row gap-10 p-2">
					<div class="stat place-items-center bg-accent shadow-lg">
						<div class="stat-title">NDC Ambition (2030)</div>
						<div class="stat-value">{data.indicators.ndcAmbition.toFixed(0)}%</div>
						<div class="stat-desc">wrt 1990</div>
					</div>

					<div class="stat place-items-center bg-accent shadow-lg">
						<div class="stat-title">Historical emissions</div>
						<div class="stat-value">
							{(data.indicators.historicalCarbon / 1_000).toFixed()}
						</div>
						<div class="stat-desc">Gt CO₂e (cumulative)</div>
					</div>
				</div>
				<div class="border-10 mb-2 flex w-full flex-row flex-wrap items-stretch gap-4 p-2">
					{#each Object.entries(principles) as [id, { label, color }]}
						<div class="border-4 text-start shadow-lg" style={`border-color: ${color}`}>
							<h3 class="px-2 text-center text-lg" style={`background-color: ${color}`}>
								{label}
								<a title="More information" target="_blank" rel="noopener" href={`/about#${id}`}
									>ⓘ</a
								>
							</h3>
							<div class="stats shadow">
								<div class="stat place-items-center">
									<div class="stat-title">2030 reduction</div>
									<div class="stat-value text-3xl">{reductions2030[id].toFixed(0)}%</div>
									<div class="stat-desc">wrt 1990 emissions</div>
								</div>
								<div class="stat place-items-center">
									<div class="stat-title">2040 reduction</div>
									<div class="stat-value text-3xl">{reductions2040[id].toFixed(0)}%</div>
									<div class="stat-desc">wrt 1990 emissions</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
			<hr class="py-2" />
			<section id="overview" class="relative h-[500px] grow">
				<div id="overview-legend" class="absolute bottom-8 left-16 z-10">
					<h1>Effort sharing principle</h1>
					<ul>
						{#each Object.entries(principles) as [id, { label, color }]}
							<li>
								<label>
									<b style={`color: ${color}`}>▬</b>
									<input type="checkbox" bind:checked={activeEffortSharings[id]} />
									{' '}{label}
								</label>
							</li>
						{/each}
					</ul>
				</div>

				<!-- TODO compute smarter extent -->
				<Pathway
					yDomain={[data.historicalCarbon.extent[1] * -0.2, data.historicalCarbon.extent[1]]}
				>
					<Line
						data={data.historicalCarbon.data.filter((d) => d.time >= 1990)}
						x={'time'}
						y={'value'}
						color="black"
					/>
					{#each Object.entries(principles) as [id, { color }]}
						{#if activeEffortSharings[id] || hoveredAmbitionGap === id || hoveredEmissionGap === id}
							<g name={id}>
								<Line data={$tweenedEffortSharing[id].GHG} x={'time'} y={'mean'} {color} />
								<Area
									data={$tweenedEffortSharing[id].GHG}
									x={'time'}
									y0={'min'}
									y1={'max'}
									{color}
								/>
								{#if activeEffortSharings[id] && hoveredAmbitionGap}
									<Gap
										x={2030}
										y0={data.reference.ndc[gapIndex].mean}
										y1={$tweenedEffortSharing[hoveredAmbitionGap].GHG.find((d) => d.time === 2030)
											?.mean || 0}
									/>
								{/if}
								{#if activeEffortSharings[id] && hoveredEmissionGap}
									<Gap
										x={2030}
										y0={data.reference.currentPolicy[gapIndex].mean}
										y1={$tweenedEffortSharing[hoveredEmissionGap].GHG.find((d) => d.time === 2030)
											?.mean || 0}
									/>
								{/if}
							</g>
						{/if}
					{/each}
				</Pathway>
			</section>
			<section id="description" class="py-8">
				<p>Some text about country carbon budget and plans.</p>

				<p>Ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget.</p>
			</section>
			<section id="details">
				<!-- TODO use same x-axis for all charts? -->
				<div>
					<h2 class="text-xl" id="pop">Population</h2>
					<div class="h-64">
						<Pathway yDomain={data.details.population.extent} xDomain={[1940, 2100]}>
							<Line data={data.details.population.data} x={'time'} y={'value'} color="black" />
						</Pathway>
					</div>
				</div>
				<div>
					<h2 class="text-xl" id="gdp">Gross domestic product (GDP)</h2>
					<div class="h-64">
						<Pathway yDomain={data.details.gdp.extent} xDomain={[1940, 2100]}>
							<Line data={data.details.gdp.data} x={'time'} y={'value'} color="black" />
						</Pathway>
					</div>
				</div>
				<div>
					<h2 class="text-xl" id="hist-emis">Historical emissions</h2>
					<div class="h-64">
						<Pathway yDomain={data.historicalCarbon.extent} xDomain={[1850, 2021]}>
							<Line data={data.historicalCarbon.data} x={'time'} y={'value'} color="black" />
						</Pathway>
					</div>
					<p>in Mt CO₂e</p>
				</div>
				<div>
					<h2 class="text-xl" id="hist-emis">policy costs ????</h2>
					<div class="h-64">
						Ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget.
					</div>
				</div>
			</section>
		</div>
	</div>
</div>
