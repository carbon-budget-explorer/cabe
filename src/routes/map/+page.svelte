<script lang="ts">
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GlobalBudgetForm from '$lib/PathwayForm.svelte';
	import RegionFilter from '$lib/RegionFilter.svelte';

	import { principles } from '$lib/principles';
	import type { PageData } from './$types';

	export let data: PageData;

	let region: string;
	const gotoRegion = (region: string) => {
		if (browser && region !== undefined && region !== '') {
			goto(`/regions/${region}${$page.url.search}`);
		}
	};
	$: gotoRegion(region);

	type ChangeEvent = Event & {
		currentTarget: EventTarget & (HTMLSelectElement | HTMLInputElement);
	};

	function updateQueryParam(name: string, value: string) {
		if (browser) {
			const params = new URLSearchParams($page.url.search);
			// TODO get called once instead of currently being called twice
			if (params.get(name) !== value) {
				params.set(name, value);
				goto(`?${params.toString()}`);
			}
		}
	}

	function changeVariable(value: string) {
		updateQueryParam('variable', value);
	}
	$: changeVariable(data.variable);

	function selectEffortSharing(value: string) {
		data.effortSharing = value as keyof typeof principles;
	}

	function changeEffortSharing(value: keyof typeof principles | undefined) {
		if (value !== undefined) {
			updateQueryParam('effortSharing', value);
		}
	}
	$: changeEffortSharing(data.effortSharing);

	let showCountriesPanel = false;
	let showSettngsPanel = false;
</script>

<main class="flex h-full max-h-full w-full flex-row gap-2">
	<div class="flex grow flex-col">
		<div class="relative h-full w-full">
			<div class="absolute left-4 top-4">
				<button class="text-xl" on:click={() => (showSettngsPanel = !showSettngsPanel)}>⚙</button>
				{#if showSettngsPanel}
					<div class="bg-slate-50 p-2 shadow-lg">
						<!-- TODO if variable is temp then disable warming temp radio group -->
						<GlobalBudgetForm
							choices={data.pathway.choices}
							query={data.pathway.query}
							onChange={updateQueryParam}
						/>
						<div class="flex flex-col pt-4">
							<h2>Variable</h2>
							<label>
								<input type="radio" name="variable" value="budget" bind:group={data.variable} />
								Full century CO2 budget
							</label>
							<label>
								<input type="radio" name="variable" value="temp" bind:group={data.variable} />
								Temperature assessment
							</label>
						</div>
					</div>
				{/if}
			</div>
			<div class="h-full w-full bg-gray-200">
				<div class="flex h-full w-full items-center justify-center">Map</div>
			</div>
			<div class="absolute bottom-2 flex w-full flex-row justify-center gap-2">
				{#each Object.entries(principles) as [id, { label, summary }]}
					<button
						class={data.effortSharing === id
							? 'h-38 relative w-48 border-2 border-orange-950 bg-orange-400 object-center text-center shadow-lg'
							: 'h-38 relative w-48 border-2 bg-orange-200 object-top text-center shadow-lg'}
						disabled={data.effortSharing === id}
						on:click={() => selectEffortSharing(id)}
					>
						<p class="text-xl">{label}</p>
						<p class="text-sm">{summary}</p>
						<a
							class="absolute right-1 top-1 inline-block text-xl"
							title="More information"
							target="_blank"
							rel="noopener"
							href={`/about#${id}`}>ⓘ</a
						>
					</button>
				{/each}
			</div>
		</div>
	</div>
	<!-- TODO make region filter have own scroll bar and not move map down -->
	<div class="max-h-screen overflow-y-auto">
		<button
			title={showCountriesPanel ? 'Click to hide region list' : 'Click to search for region'}
			on:click={() => (showCountriesPanel = !showCountriesPanel)}
		>
			<span class={showCountriesPanel ? 'countries-panel-shown' : 'countries-panel-hidden'}
				>{showCountriesPanel ? '↦' : '↧'} Find region</span
			>
		</button>
		{#if showCountriesPanel}
			<div transition:slide={{ axis: 'x' }}>
				<RegionFilter regions={data.metrics} searchParams={$page.url.search} />
			</div>
		{/if}
	</div>
</main>

<style>
	.countries-panel-hidden {
		text-orientation: sideways;
		writing-mode: vertical-rl;
	}
	.countries-panel-shown {
		text-orientation: upright;
		writing-mode: horizontal-tb;
	}
</style>
