<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GlobalBudgetForm from '$lib/PathwayForm.svelte';

	// import MiniMap from '$lib/MiniMap.svelte';
	import VegaTimeSeries from '$lib/VegaTimeSeries.svelte';
	import { fly, slide } from 'svelte/transition';
	import type { PageData } from './$types';
	export let data: PageData;

	function updateQueryParam(name: string, value: string) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			params.set(name, value);
			goto(`?${params.toString()}`);
		}
	}

	let showSettngsPanel = false;
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

				<div class="grow bg-blue-300">figure</div>
				<div>
					<h1 class="pt-4">Reference pathways</h1>
					<div>
						<label class="block"><input type="checkbox" checked />Current policy</label>
						<label class="block"><input type="checkbox" />NDCs</label>
						<label class="block"><input type="checkbox" />NetZero</label>
					</div>
					<h1 class="pt-4">Effort sharing choices</h1>
					<div>
						<label class="block"><input type="checkbox" class="mr-2" checked />GF</label>
						<label class="block"><input type="checkbox" class="mr-2" />PC</label>
						<label class="block"><input type="checkbox" class="mr-2" />PCC</label>
						<label class="block"><input type="checkbox" class="mr-2" />GF</label>
						<label class="block"><input type="checkbox" class="mr-2" />GF</label>
						<label class="block"><input type="checkbox" class="mr-2" />GF</label>
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
