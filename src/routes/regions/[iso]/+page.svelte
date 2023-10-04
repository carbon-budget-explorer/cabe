<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GlobalBudgetForm from '$lib/PathwayForm.svelte';

	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import Pathway from '$lib/charts/Pathway.svelte';
	import Line from '$lib/charts/components/Line.svelte';
	import Area from '$lib/charts/components/Area.svelte';
	import { principles } from '$lib/principles';
	import Gap from '$lib/charts/components/Gap.svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	export let data: PageData;

	function updateQueryParam(name: string, value: string) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set(name, value);
			goto(`?${params.toString()}`);
		}
	}
	// Bottom colors from https://colorbrewer2.org/#type=qualitative&scheme=Pastel1&n=9
	const ipcc_red = '#e5d8bd';
	const ipcc_blue = '#fddaec';
	const ipcc_purple = '#f2f2f2';
	let showSettngsPanel = false;

	let activeEffortSharings = [data.effortSharing.initial];
	let activeReference: string[] = [];

	// Transitions
	const tweenOptions = { duration: 1000, easing: cubicOut };
	const tweenedEffortSharing = tweened(data.effortSharing.data, tweenOptions)
	$: tweenedEffortSharing.set(data.effortSharing.data);
</script>

<main class="flex flex-col gap-2">
	<header class="flex flex-row gap-4">
		<img
			src={`https://flagcdn.com/${data.info.iso2?.toLowerCase()}.svg`}
			class="h-8"
			alt={data.info.name}
		/>
		<h1 class="text-3xl font-bold">{data.info.name}</h1>
	</header>
	<section id="key-indicators">
		<p class="bg-slate-400 px-2 text-2xl">Key indicators</p>
		<div class="border-10 mb-2 flex flex-row gap-10 border-2 border-slate-400 bg-slate-200 p-2">
			<div class="grow">
				<div class="justify-left flex flex-row gap-10">
					<div class="">
						<p>Ambition gap</p>
						<p>{data.indicators.ambitionGap}</p>
					</div>
					<div class="">
						<p>Emission gap</p>
						<p>{data.indicators.emissionGap}</p>
					</div>
					<div class="">
						<p>NDC Ambition (normalized)</p>
						<p>{data.indicators.ndcAmbition}</p>
					</div>
					<div class="">
						<p>Historical emissions (cumulative)</p>
						<p>{(data.indicators.historicalCarbon / 1_000).toFixed()} Gt CO₂</p>
					</div>
				</div>
				<div class="justify-left flex flex-row gap-10 pt-10">
					{#each Object.entries(principles) as [id, { label }]}
						<div title="Temperature assessment of effort sharing">
							<p>{label}</p>
							<p>{data.indicators.temperatureAssesment[id]} &deg;C</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>
	<section id="overview" class="flex h-[500px] grow flex-row">
		{#if showSettngsPanel}
			<div class="relative">
				<button
					class="absolute right-0 top-0"
					title="Toggle selection panel"
					on:click={() => (showSettngsPanel = !showSettngsPanel)}
				>
					⚙
				</button>
				<div transition:slide={{ axis: 'x' }}>
					<GlobalBudgetForm
						choices={data.pathway.choices}
						query={data.pathway.query}
						onChange={updateQueryParam}
					/>
				</div>
			</div>
		{:else}
			<div>
				<button
					class=""
					title="Toggle selection panel"
					on:click={() => (showSettngsPanel = !showSettngsPanel)}
				>
					⚙
				</button>
			</div>
		{/if}

		<Pathway yDomain={[-50, 220]}>
			<Line
				data={data.historicalCarbon.filter((d) => d.time >= 1990)}
				x={'time'}
				y={'value'}
				color="black"
			/>
			{#each activeEffortSharings as activeEffortSharing}
				<g name={activeEffortSharing}>
					{#if activeEffortSharing === 'ECPC'}
						<!-- TODO show ECPC as error bar on chart -->
						<Gap
							x={$tweenedEffortSharing[activeEffortSharing][0].time}
							y0={$tweenedEffortSharing[activeEffortSharing][0].min}
							y1={$tweenedEffortSharing[activeEffortSharing][0].max}
						/>
					{:else}
						<Line
							data={$tweenedEffortSharing[activeEffortSharing]}
							x={'time'}
							y={'mean'}
							color={principles[activeEffortSharing].color}
						/>
						<Area
							data={$tweenedEffortSharing[activeEffortSharing]}
							x={'time'}
							y0={'min'}
							y1={'max'}
							color={principles[activeEffortSharing].color}
						/>
					{/if}
				</g>
			{/each}

			{#if activeReference.includes('currentPolicy')}
				<g name="currentPolicy">
					<Line data={data.reference.currentPolicy} x={'time'} y={'mean'} color={ipcc_red} />
					<Area
						data={data.reference.currentPolicy}
						x={'time'}
						y0={'min'}
						y1={'max'}
						color={ipcc_red}
					/>
				</g>
			{/if}
			{#if activeReference.includes('ndc')}
				<g name="ndc">
					<Line data={data.reference.ndc} x={'time'} y={'mean'} color={ipcc_blue} />
					<Area data={data.reference.ndc} x={'time'} y0={'min'} y1={'max'} color={ipcc_blue} />
				</g>
			{/if}
			{#if activeReference.includes('netzero')}
				<g name="netzero">
					<Line data={data.reference.netzero} x={'time'} y={'mean'} color={ipcc_purple} />
					<Area
						data={data.reference.netzero}
						x={'time'}
						y0={'min'}
						y1={'max'}
						color={ipcc_purple}
					/>
				</g>
			{/if}
		</Pathway>
		<div>
			<h1 class="pt-4">Reference pathways</h1>
			<div>
				<!-- TODO this checkbox group is also used in /global page, deduplicate -->
				<label class="block">
					<b style={`color: ${ipcc_red}`}>▬</b>
					<input class="mr-1" type="checkbox" value="currentPolicy" bind:group={activeReference} />
					Current policy</label
				>
				<label class="block">
					<b style={`color: ${ipcc_blue}`}>▬</b>
					<input class="mr-1" type="checkbox" value="ndc" bind:group={activeReference} />
					Nationally determined contributions (NDCs)
				</label>
				<label class="block">
					<b style={`color: ${ipcc_purple}`}>▬</b>
					<input class="mr-1" type="checkbox" value="netzero" bind:group={activeReference} />
					Net zero-scenarios
				</label>
			</div>
			<h1 class="pt-4">Effort sharing</h1>
			<div>
				{#each Object.entries(principles) as [id, { label, color }]}
					<label class="block">
						<b style={`color: ${color}`}>▬</b>
						<input type="checkbox" class="mr-1" value={id} bind:group={activeEffortSharings} />
						{label}
					</label>
				{/each}
			</div>
		</div>
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
				<Pathway yDomain={[-50, 220]} xDomain={[1850, 2021]}>
					<Line data={data.historicalCarbon} x={'time'} y={'value'} color="black" />
				</Pathway>
			</div>
			<p>in Mt CO₂</p>
		</div>
		<div>
			<h2 class="text-xl" id="hist-emis">policy costs ????</h2>
			<div class="h-64">
				Ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget.
			</div>
		</div>
	</section>
</main>
