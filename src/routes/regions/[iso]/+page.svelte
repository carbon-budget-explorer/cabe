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
</script>

<div class="flex h-full flex-row">
	<div class="flex h-full grow flex-col gap-4">
		<div class="flex h-full min-h-full flex-col">
			<div class="m-2 flex flex-row gap-4">
				<h1 class="text-3xl font-bold">{data.name}</h1>
				<p class="bg-red-300 p-2">flag</p>
			</div>
			<p class="bg-slate-400 px-2 text-2xl">Key indicators</p>
			<div class="border-10 mb-2 flex flex-row gap-10 border-2 border-slate-400 bg-slate-200 p-2">
				<div class="grow">
					<div class="justify-left flex flex-row gap-10">
						<div class="">
							<p>Ambition gap</p>
							<p>value</p>
						</div>
						<div class="">
							<p>Emission gap</p>
							<p>value</p>
						</div>
						<div class="">
							<p>NDC Ambition (normalized)</p>
							<p>value</p>
						</div>
						<div class="">
							<p>Historical emissions (cumulative)</p>
							<p>value</p>
						</div>
					</div>
					<div class="justify-left flex flex-row gap-10 pt-10">
						<div class="" title="Assessment effort sharing">
							<p>Grandfathering</p>
							<p>value</p>
						</div>
						<div class="" title="Assessment effort sharing">
							<p>Per capita</p>
							<p>value</p>
						</div>
						<div class="" title="Assessment effort sharing">
							<p>Per capita convergence</p>
							<p>value</p>
						</div>
						<div class="" title="Assessment effort sharing">
							<p>Ability to pay</p>
							<p>value</p>
						</div>
						<div class="" title="Assessment effort sharing">
							<p>Greenhouse development rights</p>
							<p>value</p>
						</div>
						<div class="" title="Assessment effort sharing">
							<p>Equal cumulative per capita</p>
							<p>value</p>
						</div>
					</div>
				</div>
			</div>
			<div class="flex grow flex-row">
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
					<Line data={data.historicalCarbon} x={'time'} y={'value'} color="black" />
					{#each activeEffortSharings as activeEffortSharing}
						<g name={activeEffortSharing}>
							{#if activeEffortSharing === 'ECPC'}
								<!-- TODO show ECPC as error bar on chart -->
								<Gap
									x={data.effortSharing.data[activeEffortSharing][0].time}
									y0={data.effortSharing.data[activeEffortSharing][0].min}
									y1={data.effortSharing.data[activeEffortSharing][0].max}
								/>
							{:else}
								<Line
									data={data.effortSharing.data[activeEffortSharing]}
									x={'time'}
									y={'mean'}
									color={principles[activeEffortSharing].color}
								/>
								<Area
									data={data.effortSharing.data[activeEffortSharing]}
									x={'time'}
									y0={'min'}
									y1={'max'}
									color={principles[activeEffortSharing].color}
								/>
							{/if}
						</g>
					{/each}

					<g name="currentPolicy">
						<Line data={data.currentPolicy} x={'time'} y={'mean'} color={ipcc_red} />
						<Area data={data.currentPolicy} x={'time'} y0={'min'} y1={'max'} color={ipcc_red} />
					</g>
				</Pathway>
				<div>
					<h1 class="pt-4">Reference pathways</h1>
					<div>
						<!-- TODO this checkbox group is also used in /global page, deduplicate -->
						<label class="block">
							<b style={`color: ${ipcc_red}`}>▬</b>
							<input class="mr-1" type="checkbox" />
							Current policy</label
						>
						<label class="block">
							<b style={`color: ${ipcc_blue}`}>▬</b>
							<input class="mr-1" type="checkbox" />
							Nationally determined contributions (NDCs)
						</label>
						<label class="block">
							<b style={`color: ${ipcc_purple}`}>▬</b>
							<input class="mr-1" type="checkbox" />
							zero-scenarios
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
			</div>
		</div>
		<div>
			<div>Details</div>
			<div>details graphs: population</div>
			<div>details graphs: gdp</div>
			<div>details graphs: historical emissions</div>
			<div>details graphs: policy costs ????</div>
		</div>
	</div>
</div>
